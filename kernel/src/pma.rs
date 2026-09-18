//! SurakshaOS Physical Memory Allocator (PMA)
//!
//! A bitmap-based allocator managing 4 KiB physical page frames.
//! Each frame is represented by one bit in a bitmap: 0 = free, 1 = in use.
//!
//! Designed per `docs/MEMORY_ARCHITECTURE.md` Phase 1:
//!   "Physical frame allocator + Sv39 page tables + kernel mapping"
//!
//! # Design
//!
//! - Page/frame size: 4096 bytes (RISC-V Sv39 standard)
//! - Bitmap: 1 bit per frame → 128 MiB = 32768 frames → 4096 bytes of bitmap
//! - Thread-safe via `spin::Mutex`
//! - Reserved regions: firmware, MMIO, kernel code/data/heap/bitmap
//! - All other RAM frames are available for allocation
//!
//! # Safety
//!
//! This module performs raw pointer arithmetic on physical addresses.
//! All `unsafe` blocks are documented. The allocator is the sole owner
//! of the physical frame bitmap; concurrent access is serialized by the
//! internal mutex.

use spin::Mutex;

// ─── Constants ───────────────────────────────────────────────────────────────

/// Physical page frame size in bytes (4 KiB, standard for RISC-V Sv39).
pub const PAGE_SIZE: usize = 4096;

/// Physical base address of RAM on QEMU virt machine.
pub const RAM_START: usize = 0x8000_0000;

/// Total physical RAM in bytes (256 MiB, QEMU virt default).
/// TODO: Read from DTB memory node once DTB parser is implemented.
pub const RAM_SIZE: usize = 256 * 1024 * 1024;

/// Total number of physical frames in the managed region.
pub const TOTAL_FRAMES: usize = RAM_SIZE / PAGE_SIZE;

/// UART (NS16550A) MMIO region on QEMU virt: 0x1000_0000, 0x1000 bytes.
const UART_BASE: usize = 0x0010_0000;
const UART_SIZE: usize = 0x0010_000;

/// CLINT (Core Local Interruptor) MMIO region on QEMU virt: 0x0200_0000, 0x10000 bytes.
const CLINT_BASE: usize = 0x0200_0000;
const CLINT_SIZE: usize = 0x0001_0000;

/// PLIC (Platform-Level Interrupt Controller) MMIO region on QEMU virt: 0x0C00_0000.
/// 64 MiB for max 15872 sources (QEMU default).
const PLIC_BASE: usize = 0x0C00_0000;
const PLIC_SIZE: usize = 64 * 1024 * 1024;

// ─── Physical Address Type ──────────────────────────────────────────────────

/// A physical memory address. Wrapper around `usize` for type safety.
#[derive(Debug, Clone, Copy, PartialEq, Eq, PartialOrd, Ord)]
pub struct PhysAddr(pub usize);

impl PhysAddr {
    /// Convert physical address to frame number (page frame index).
    #[inline]
    pub fn frame_number(self) -> usize {
        self.0 / PAGE_SIZE
    }

    /// Get the page-aligned base address of the frame containing this address.
    #[inline]
    pub fn page_align_down(self) -> PhysAddr {
        PhysAddr(self.0 & !(PAGE_SIZE - 1))
    }

    /// Return true if this address is page-aligned.
    #[inline]
    pub fn is_page_aligned(self) -> bool {
        self.0 & (PAGE_SIZE - 1) == 0
    }

    /// Convert a frame number to its physical base address.
    #[inline]
    pub fn from_frame_number(frame: usize) -> PhysAddr {
        PhysAddr(frame * PAGE_SIZE)
    }
}

impl core::fmt::Display for PhysAddr {
    fn fmt(&self, f: &mut core::fmt::Formatter<'_>) -> core::fmt::Result {
        write!(f, "{:#x}", self.0)
    }
}

// ─── Frame State ────────────────────────────────────────────────────────────

/// Whether a physical frame is free or allocated.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum FrameState {
    Free,
    Used,
}

// ─── Allocator Statistics ───────────────────────────────────────────────────

/// Snapshot of physical memory allocator state.
#[derive(Debug, Clone, Copy)]
pub struct PmaStats {
    /// Total number of managed frames.
    pub total_frames: usize,
    /// Number of frames currently in use (allocated or reserved).
    pub used_frames: usize,
    /// Number of frames available for allocation.
    pub free_frames: usize,
    /// Total managed physical memory in bytes.
    pub total_bytes: usize,
    /// Used physical memory in bytes.
    pub used_bytes: usize,
}

// ─── Physical Memory Allocator ─────────────────────────────────────────────

/// Bitmap-based physical frame allocator.
///
/// Each bit in the bitmap corresponds to one 4 KiB frame:
///   - `0` = frame is free
///   - `1` = frame is in use (allocated or reserved)
///
/// The bitmap is stored in BSS (zeroed by boot.S), so all frames
/// start as free. `init()` marks reserved regions before first use.
struct BitmapPma {
    /// Bitmap: bit `i` corresponds to frame `i`.
    /// `bitmap[i / 64]` bit `(i % 64)` indicates frame `i` state.
    bitmap: &'static mut [u64],

    /// Number of frames currently marked as used.
    used_frames: usize,

    /// Total number of managed frames.
    total_frames: usize,

    /// Base physical address of the managed region (inclusive).
    base_addr: usize,

    /// End physical address of the managed region (exclusive).
    end_addr: usize,
}

impl BitmapPma {
    /// Create a new allocator over a given memory region.
    ///
    /// # Safety
    ///
    /// - `bitmap_slice` must point to valid, uniquely-owned memory
    ///   of sufficient length (`ceil(total_frames / 64)` u64 entries).
    /// - `base_addr` and `end_addr` must be page-aligned and describe
    ///   a valid physical memory region.
    /// - All frames in the region must be accounted for in the bitmap.
    unsafe fn new(
        bitmap_slice: &'static mut [u64],
        base_addr: usize,
        end_addr: usize,
    ) -> Self {
        assert!(base_addr % PAGE_SIZE == 0, "base_addr must be page-aligned");
        assert!(end_addr % PAGE_SIZE == 0, "end_addr must be page-aligned");
        assert!(end_addr > base_addr, "end_addr must be greater than base_addr");

        let total_frames = (end_addr - base_addr) / PAGE_SIZE;
        let bitmap_words = (total_frames + 63) / 64;
        assert!(
            bitmap_slice.len() >= bitmap_words,
            "bitmap too small: need {} words, got {}",
            bitmap_words,
            bitmap_slice.len()
        );

        // Zero the bitmap — all frames start as free.
        // (boot.S clears BSS, but be explicit for safety.)
        for word in bitmap_slice.iter_mut() {
            *word = 0;
        }

        BitmapPma {
            bitmap: bitmap_slice,
            used_frames: 0,
            total_frames,
            base_addr,
            end_addr,
        }
    }

    /// Mark a single frame as used (allocated or reserved).
    ///
    /// # Panics
    ///
    /// Panics if the frame is already marked as used (double-reserve).
    fn mark_used(&mut self, frame: usize) {
        assert!(
            frame < self.total_frames,
            "mark_used: frame {} out of range (total: {})",
            frame,
            self.total_frames
        );
        let word = frame / 64;
        let bit = frame % 64;
        assert!(
            self.bitmap[word] & (1 << bit) == 0,
            "mark_used: frame {} already in use",
            frame
        );
        self.bitmap[word] |= 1 << bit;
        self.used_frames += 1;
    }

    /// Mark a contiguous range of frames as used.
    ///
    /// # Panics
    ///
    /// Panics if any frame in the range is already in use.
    fn mark_used_range(&mut self, start_frame: usize, count: usize) {
        for i in 0..count {
            self.mark_used(start_frame + i);
        }
    }

    /// Set the used-frame count without going through individual marks.
    /// Used during initialization to bulk-mark the bitmap.
    fn set_bulk_used_count(&mut self, count: usize) {
        self.used_frames = count;
    }

    /// Allocate a single physical frame.
    ///
    /// Returns the physical address of the allocated frame, or `None`
    /// if no free frames remain.
    fn alloc_frame(&mut self) -> Option<PhysAddr> {
        for (word_idx, word) in self.bitmap.iter_mut().enumerate() {
            if *word != u64::MAX {
                // At least one bit is 0 (free) in this word.
                let bit = word.trailing_ones() as usize;
                let frame = word_idx * 64 + bit;
                if frame >= self.total_frames {
                    return None;
                }
                *word |= 1 << bit;
                self.used_frames += 1;
                return Some(PhysAddr::from_frame_number(frame + self.base_frame()));
            }
        }
        None
    }

    /// Allocate `count` contiguous physical frames.
    ///
    /// Uses a simple linear scan to find `count` consecutive free frames.
    /// Returns the base physical address of the contiguous region, or
    /// `None` if no suitable contiguous block exists.
    fn alloc_contiguous(&mut self, count: usize) -> Option<PhysAddr> {
        if count == 0 {
            return None;
        }
        if count == 1 {
            return self.alloc_frame();
        }
        if count > self.total_frames {
            return None;
        }

        let mut run_start: Option<usize> = None;
        let mut run_len: usize = 0;

        for frame in 0..self.total_frames {
            let word = frame / 64;
            let bit = frame % 64;
            let is_free = self.bitmap[word] & (1 << bit) == 0;

            if is_free {
                if run_start.is_none() {
                    run_start = Some(frame);
                    run_len = 1;
                } else {
                    run_len += 1;
                }
                if run_len == count {
                    let start = run_start.unwrap();
                    // Mark all frames in the run as used
                    for i in 0..count {
                        let f = start + i;
                        let w = f / 64;
                        let b = f % 64;
                        self.bitmap[w] |= 1 << b;
                    }
                    self.used_frames += count;
                    return Some(PhysAddr::from_frame_number(
                        start + self.base_frame(),
                    ));
                }
            } else {
                // Break the run
                run_start = None;
                run_len = 0;
            }
        }

        None
    }

    /// Free a single physical frame.
    ///
    /// # Panics
    ///
    /// Panics if the frame is not currently allocated.
    fn free_frame(&mut self, addr: PhysAddr) {
        let frame = addr.frame_number() - self.base_frame();
        assert!(
            frame < self.total_frames,
            "free_frame: address {} out of managed range",
            addr
        );
        let word = frame / 64;
        let bit = frame % 64;
        assert!(
            self.bitmap[word] & (1 << bit) != 0,
            "free_frame: frame at {} is already free",
            addr
        );
        self.bitmap[word] &= !(1 << bit);
        self.used_frames -= 1;
    }

    /// Get the state of a specific frame.
    fn frame_state(&self, addr: PhysAddr) -> FrameState {
        let frame = addr.frame_number() - self.base_frame();
        if frame >= self.total_frames {
            return FrameState::Used; // Out of range = treated as used
        }
        let word = frame / 64;
        let bit = frame % 64;
        if self.bitmap[word] & (1 << bit) != 0 {
            FrameState::Used
        } else {
            FrameState::Free
        }
    }

    /// Get the first managed frame number (offset from frame 0).
    fn base_frame(&self) -> usize {
        self.base_addr / PAGE_SIZE
    }

    /// Get allocator statistics.
    fn stats(&self) -> PmaStats {
        PmaStats {
            total_frames: self.total_frames,
            used_frames: self.used_frames,
            free_frames: self.total_frames - self.used_frames,
            total_bytes: self.total_frames * PAGE_SIZE,
            used_bytes: self.used_frames * PAGE_SIZE,
        }
    }
}

// ─── Global Allocator ───────────────────────────────────────────────────────

/// The global physical memory allocator, protected by a spin lock.
///
/// # Safety
///
/// Initialized exactly once by `init()`. All public functions acquire
/// the lock before accessing the inner `BitmapPma`, so concurrent
/// access is safe.
static PMA: Mutex<BitmapPma> = Mutex::new(BitmapPma {
    bitmap: &mut [],
    used_frames: 0,
    total_frames: 0,
    base_addr: 0,
    end_addr: 0,
});

/// Bitmap storage. Placed in BSS (zeroed by boot.S).
///
/// Size: `ceil(TOTAL_FRAMES / 64)` × 8 bytes = `ceil(32768 / 64)` × 8
///     = 512 × 8 = 4096 bytes = 1 page.
///
/// This static is mutably borrowed during `init()` only; after that
/// the `PMA` lock is the sole access path.
static mut BITMAP_STORAGE: [u64; (TOTAL_FRAMES + 63) / 64] = [0u64; (TOTAL_FRAMES + 63) / 64];

// ─── Linker Symbols ─────────────────────────────────────────────────────────

extern "C" {
    static _bss_end: u8;
}

// ─── Initialization ─────────────────────────────────────────────────────────

/// Initialize the physical memory allocator.
///
/// Must be called exactly once, early in boot, before any `alloc_frame()`
/// calls. Marks the following regions as reserved (used):
///
/// 1. Physical RAM below the kernel's BSS end (firmware, kernel code/data)
/// 2. MMIO regions (UART, CLINT, PLIC) — if within managed range
/// 3. The PMA bitmap itself
///
/// # Safety
///
/// Called once from `kernel_main`. Reads linker symbols (`_bss_end`)
/// and initializes the global `PMA` and `BITMAP_STORAGE` statics.
pub fn init() {
    // SAFETY: `_bss_end` is a linker symbol placed at the end of the BSS
    // section. Its address is the first free byte after kernel data.
    let bss_end = unsafe {(&_bss_end as *const u8) as usize };

    // Align BSS end up to the next page boundary for the kernel heap start.
    let kernel_end = (bss_end + PAGE_SIZE - 1) & !(PAGE_SIZE - 1);

    // The managed region spans the entire physical RAM.
    let ram_end = RAM_START + RAM_SIZE;

    // SAFETY: BITMAP_STORAGE is a static mutable array. We take an exclusive
    // reference during initialization only. After init() returns, this
    // reference is no longer alive, and the PMA lock is the sole access path.
    let bitmap_storage = unsafe { &mut *core::ptr::addr_of_mut!(BITMAP_STORAGE) };

    // SAFETY: We have exclusive access to BITMAP_STORAGE, the addresses are
    // valid for the QEMU virt memory map, and the bitmap is sized for TOTAL_FRAMES.
    let mut pma = unsafe {
        BitmapPma::new(bitmap_storage, RAM_START, ram_end)
    };

    // ─── Mark reserved regions ───────────────────────────────────────────

    // 1. Reserve all frames from RAM start through kernel BSS end.
    //    This covers: firmware area, kernel .text, .rodata, .data, .stack, .bss.
    //    Note: MMIO regions (UART, CLINT, PLIC) are BELOW RAM_START (0x8000_0000)
    //    so they are outside our managed range and don't need explicit marking.
    let kernel_frames = (kernel_end - RAM_START) / PAGE_SIZE;
    pma.mark_used_range(0, kernel_frames);

    // 2. Reserve the PMA bitmap's own physical frames.
    //    The bitmap is stored in BSS (within the kernel region already reserved
    //    above), but we verify the accounting is correct.
    let bitmap_addr = unsafe { core::ptr::addr_of!(BITMAP_STORAGE) } as usize;
    let bitmap_size = core::mem::size_of_val(unsafe { &BITMAP_STORAGE });
    let bitmap_start_frame = (bitmap_addr - RAM_START) / PAGE_SIZE;
    let bitmap_frame_count = (bitmap_size + PAGE_SIZE - 1) / PAGE_SIZE;

    // Bitmap should be within the already-reserved kernel region.
    // This assertion verifies our layout is consistent.
    assert!(
        bitmap_start_frame + bitmap_frame_count <= kernel_frames,
        "PMA bitmap extends beyond kernel reserved region: bitmap frames {}-{}, kernel frames 0-{}",
        bitmap_start_frame,
        bitmap_start_frame + bitmap_frame_count,
        kernel_frames,
    );

    // Store into the global.
    // SAFETY: PMA is a static Mutex<BitmapPma>. We initialize it here exactly
    // once during boot, before any other code accesses it.
    unsafe {
        core::ptr::write(core::ptr::addr_of_mut!(PMA), Mutex::new(pma));
    }

    // Print initialization info.
    let stats = PMA.lock().stats();
    crate::println!("  [pma] Physical memory allocator initialized");
    crate::println!("  [pma]   RAM: {:#x} - {:#x} ({} MiB)", RAM_START, ram_end, RAM_SIZE / (1024 * 1024));
    crate::println!("  [pma]   Frames: {} total, {} used, {} free",
        stats.total_frames, stats.used_frames, stats.free_frames);
    crate::println!("  [pma]   Bitmap: {} bytes at {:#x}",
        bitmap_size, bitmap_addr);
}

// ─── Public API ─────────────────────────────────────────────────────────────

/// Allocate a single physical page frame.
///
/// Returns the physical address of the allocated frame, or `None` if
/// no free frames remain. The returned frame is page-aligned.
///
/// # Examples
///
/// ```ignore
/// if let Some(frame) = pma::alloc_frame() {
///     // Use the 4 KiB frame at `frame`
/// } else {
///     // Out of physical memory
/// }
/// ```
pub fn alloc_frame() -> Option<PhysAddr> {
    PMA.lock().alloc_frame()
}

/// Allocate `count` contiguous physical page frames.
///
/// Returns the base physical address of the contiguous region, or
/// `None` if no suitable contiguous block exists.
///
/// # Arguments
///
/// * `count` — Number of contiguous frames to allocate.
pub fn alloc_contiguous(count: usize) -> Option<PhysAddr> {
    PMA.lock().alloc_contiguous(count)
}

/// Free a previously allocated physical page frame.
///
/// # Arguments
///
/// * `addr` — Physical address of the frame to free. Must be page-aligned
///   and must have been previously allocated via `alloc_frame()` or
///   `alloc_contiguous()`.
///
/// # Panics
///
/// Panics if the address is not within the managed range or the frame
/// is already free.
pub fn free_frame(addr: PhysAddr) {
    PMA.lock().free_frame(addr);
}

/// Free `count` contiguous physical page frames starting at `addr`.
///
/// # Arguments
///
/// * `addr` — Base physical address (must be page-aligned).
/// * `count` — Number of frames to free.
pub fn free_contiguous(addr: PhysAddr, count: usize) {
    let mut pma = PMA.lock();
    for i in 0..count {
        let frame_addr = PhysAddr(addr.0 + i * PAGE_SIZE);
        pma.free_frame(frame_addr);
    }
}

/// Get the current state of a physical frame.
pub fn frame_state(addr: PhysAddr) -> FrameState {
    PMA.lock().frame_state(addr)
}

/// Get allocator statistics.
pub fn stats() -> PmaStats {
    PMA.lock().stats()
}

/// Get the physical address of the first frame available for allocation.
///
/// Returns `None` if no frames are available.
pub fn first_free_frame() -> Option<PhysAddr> {
    alloc_frame()
}

// ─── Unit Tests ─────────────────────────────────────────────────────────────

#[cfg(test)]
mod tests {
    use super::*;

    // NOTE: These tests run on the host, not on RISC-V QEMU.
    // They test the bitmap allocator logic with a small mock region.

    const TEST_PAGE_SIZE: usize = 4096;
    const TEST_FRAMES: usize = 128; // 512 KiB test region

    /// Create a test allocator over a small static bitmap.
    fn create_test_pma() -> BitmapPma {
        static mut TEST_BITMAP: [u64; (TEST_FRAMES + 63) / 64] =
            [0u64; (TEST_FRAMES + 63) / 64];
        unsafe {
            let bitmap = &mut *core::ptr::addr_of_mut!(TEST_BITMAP);
            BitmapPma::new(bitmap, 0x1000_0000, 0x1000_0000 + TEST_FRAMES * TEST_PAGE_SIZE)
        }
    }

    #[test]
    fn test_alloc_single_frame() {
        let mut pma = create_test_pma();
        let frame = pma.alloc_frame().expect("should allocate a frame");
        assert_eq!(frame, PhysAddr(0x1000_0000));
        assert_eq!(pma.used_frames, 1);
    }

    #[test]
    fn test_alloc_and_free() {
        let mut pma = create_test_pma();
        let f1 = pma.alloc_frame().unwrap();
        let f2 = pma.alloc_frame().unwrap();
        assert_ne!(f1, f2);
        assert_eq!(pma.used_frames, 2);

        pma.free_frame(f1);
        assert_eq!(pma.used_frames, 1);

        // The freed frame should be re-allocated first
        let f3 = pma.alloc_frame().unwrap();
        assert_eq!(f3, f1);
    }

    #[test]
    fn test_alloc_contiguous() {
        let mut pma = create_test_pma();
        // Reserve first frame so allocation doesn't start at 0
        pma.mark_used(0);

        let region = pma.alloc_contiguous(4).expect("should allocate 4 contiguous frames");
        assert_eq!(region, PhysAddr(0x1000_0000 + 1 * TEST_PAGE_SIZE));

        // Verify all 4 frames are marked used
        for i in 0..4 {
            let addr = PhysAddr(region.0 + i * TEST_PAGE_SIZE);
            assert_eq!(pma.frame_state(addr), FrameState::Used);
        }
        assert_eq!(pma.used_frames, 5); // 1 reserved + 4 allocated
    }

    #[test]
    fn test_free_contiguous() {
        let mut pma = create_test_pma();
        let region = pma.alloc_contiguous(3).unwrap();
        assert_eq!(pma.used_frames, 3);

        pma.free_frame(region);
        pma.free_frame(PhysAddr(region.0 + TEST_PAGE_SIZE));
        pma.free_frame(PhysAddr(region.0 + 2 * TEST_PAGE_SIZE));
        assert_eq!(pma.used_frames, 0);
    }

    #[test]
    fn test_exhaust_memory() {
        let mut pma = create_test_pma();
        let mut count = 0;
        while pma.alloc_frame().is_some() {
            count += 1;
        }
        assert_eq!(count, TEST_FRAMES);
        assert_eq!(pma.alloc_frame(), None);
    }

    #[test]
    fn test_stats() {
        let mut pma = create_test_pma();
        let s = pma.stats();
        assert_eq!(s.total_frames, TEST_FRAMES);
        assert_eq!(s.used_frames, 0);
        assert_eq!(s.free_frames, TEST_FRAMES);

        pma.alloc_frame();
        let s = pma.stats();
        assert_eq!(s.used_frames, 1);
        assert_eq!(s.free_frames, TEST_FRAMES - 1);
    }

    #[test]
    fn test_alloc_contiguous_fails_when_fragmented() {
        let mut pma = create_test_pma();
        // Allocate every other frame to create fragmentation
        for i in (0..TEST_FRAMES).step_by(2) {
            pma.mark_used(i);
        }
        // Cannot find 2 contiguous free frames
        assert_eq!(pma.alloc_contiguous(2), None);
    }

    #[test]
    fn test_phys_addr_operations() {
        let addr = PhysAddr(0x8000_1234);
        assert_eq!(addr.frame_number(), 0x8000_1234 / PAGE_SIZE);
        assert!(!addr.is_page_aligned());
        assert_eq!(addr.page_align_down(), PhysAddr(0x8000_1000));

        let aligned = PhysAddr(0x8000_2000);
        assert!(aligned.is_page_aligned());
    }
}
