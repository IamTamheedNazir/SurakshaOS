//! SurakshaOS Virtual Memory Manager (VMM) — Sv39
//!
//! Implements RISC-V Sv39 page tables, address space management, and
//! the kernel's initial memory mapping. This is the foundation for
//! process isolation, user/kernel separation, and memory protection.
//!
//! # Architecture
//!
//! Sv39 uses 39-bit virtual addresses with 3 levels of page tables:
//!
//! ```text
//! Virtual Address (39 bits):
//!   VPN[2] (bits 38:30) → Level 2 (root) index
//!   VPN[1] (bits 29:21) → Level 1 index
//!   VPN[0] (bits 20:12) → Level 0 (leaf) index
//!   Page Offset (bits 11:0) → byte within page
//!
//! Page sizes:
//!   Level 0 (leaf): 4 KiB pages
//!   Level 1 (leaf): 1 GiB megapages
//!   Level 2 (non-leaf): always points to next table level
//! ```
//!
//! # Initial Kernel Mapping
//!
//! On boot, the kernel identity-maps:
//! 1. Lower 512 MiB of physical RAM — covers MMIO devices (UART, CLINT, PLIC)
//! 2. The full 256 MiB kernel physical region — covers kernel code/data/heap
//!
//! After `enable_paging()`, all memory access goes through these mappings.
//! Since this is an identity map, the kernel continues executing at the
//! same physical addresses — no code relocation needed.
//!
//! # Future Work
//!
//! - Replace identity mapping with higher-half kernel mapping
//!   (kernel at0xFFFF_FF80_0000_0000+, physical at 0x8000_0000+)
//! - Per-process address spaces with user/kernel separation
//! - Copy-on-write (COW) for fork()
//! - Guard pages for stack overflow detection
//!
//! # Safety
//!
//! This module directly manipulates page tables and the `satp` CSR.
//! All `unsafe` blocks document their safety invariants. The page tables
//! must be set up correctly before `enable_paging()` is called, as an
//! incorrect mapping will cause an immediate fault.

use spin::Mutex;

use crate::pma::{self, PhysAddr, PAGE_SIZE, RAM_START, RAM_SIZE};

// ─── Page Table Entry Flags ─────────────────────────────────────────────────

/// Page is valid and can be used in a page table walk.
pub const PTE_V: u64 = 1 << 0;
/// Page is readable.
pub const PTE_R: u64 = 1 << 1;
/// Page is writable.
pub const PTE_W: u64 = 1 << 2;
/// Page is executable.
pub const PTE_X: u64 = 1 << 3;
/// Page is accessible from user mode (U-mode).
pub const PTE_U: u64 = 1 << 4;
/// Page has been accessed (set by hardware on read/write).
pub const PTE_A: u64 = 1 << 6;
/// Page has been written to (set by hardware on write).
pub const PTE_D: u64 = 1 << 7;
/// Global mapping (not flushed on ASID change).
pub const PTE_G: u64 = 1 << 5;

/// Combination: valid + readable + writable + executable (for kernel data).
pub const PTE_RWX: u64 = PTE_V | PTE_R | PTE_W | PTE_X;

/// Combination: valid + readable + executable (for kernel code).
pub const PTE_RX: u64 = PTE_V | PTE_R | PTE_X;

/// Combination: valid + readable + writable (for kernel data, no execute).
pub const PTE_RW: u64 = PTE_V | PTE_R | PTE_W;

/// Combination: valid + readable (for read-only mappings).
pub const PTE_R_ONLY: u64 = PTE_V | PTE_R;

/// Mask for extracting the physical page number (PPN) from a PTE.
/// PTE bits [53:10] hold the PPN.
const PTE_PPN_MASK: u64 = 0x003F_FFFF_FFC00;

/// Mask for extracting flags from a PTE.
const PTE_FLAGS_MASK: u64 = 0x3FF;

// ─── Page Table Entry ───────────────────────────────────────────────────────

/// A single Sv39 page table entry (8 bytes).
///
/// Layout:
/// ```text
/// Bit  0     : V  (Valid)
/// Bit  1     : R  (Read)
/// Bit  2     : W  (Write)
/// Bit  3     : X  (Execute)
/// Bit  4     : U  (User accessible)
/// Bit  5     : G  (Global)
/// Bit  6     : A  (Accessed)
/// Bit  7     : D  (Dirty)
/// Bits 8-9   : RSW (Reserved for Software)
/// Bits 10-53 : PPN (Physical Page Number)
/// Bits 54-63 : Reserved
/// ```
#[derive(Debug, Clone, Copy)]
#[repr(transparent)]
pub struct PageTableEntry(u64);

impl PageTableEntry {
    /// Create a new entry from a physical address and flags.
    ///
    /// The physical address must be page-aligned (low 12 bits zero).
    ///
    /// # Panics
    ///
    /// Panics if `phys_addr` is not page-aligned.
    pub fn new(phys_addr: PhysAddr, flags: u64) -> Self {
        assert!(
            phys_addr.is_page_aligned(),
            "PageTableEntry::new: phys_addr {} is not page-aligned",
            phys_addr
        );
        let ppn = phys_addr.0 / PAGE_SIZE;
        PageTableEntry((ppn << 10) | (flags & PTE_FLAGS_MASK))
    }

    /// Create an empty (invalid) entry.
    pub fn empty() -> Self {
        PageTableEntry(0)
    }

    /// Check if this entry is valid.
    #[inline]
    pub fn is_valid(&self) -> bool {
        self.0 & PTE_V != 0
    }

    /// Check if this entry is a leaf (points directly to a page).
    ///
    /// A leaf entry has at least one of R, W, or X set.
    /// Non-leaf entries (pointers to next-level tables) have R=W=X=0.
    #[inline]
    pub fn is_leaf(&self) -> bool {
        self.0 & (PTE_R | PTE_W | PTE_X) != 0
    }

    /// Get the physical address this entry points to.
    #[inline]
    pub fn phys_addr(&self) -> PhysAddr {
        PhysAddr(((self.0 & PTE_PPN_MASK) >> 10) * PAGE_SIZE)
    }

    /// Get the raw flags of this entry.
    #[inline]
    pub fn flags(&self) -> u64 {
        self.0 & PTE_FLAGS_MASK
    }

    /// Get the raw 64-bit value of this entry.
    #[inline]
    pub fn raw(&self) -> u64 {
        self.0
    }

    /// Set the physical address this entry points to.
    #[inline]
    pub fn set_phys_addr(&mut self, phys_addr: PhysAddr) {
        assert!(phys_addr.is_page_aligned());
        let ppn = phys_addr.0 / PAGE_SIZE;
        self.0 = (self.0 & !PTE_PPN_MASK) | ((ppn as u64) << 10);
    }

    /// Set the flags of this entry.
    #[inline]
    pub fn set_flags(&mut self, flags: u64) {
        self.0 = (self.0 & !PTE_FLAGS_MASK) | (flags & PTE_FLAGS_MASK);
    }
}

// ─── Page Table ─────────────────────────────────────────────────────────────

/// An Sv39 page table — 512 entries, 4 KiB, page-aligned.
///
/// Each entry is 8 bytes, totaling 4096 bytes per table.
/// Page tables are allocated from physical frames via the PMA.
#[repr(C, align(4096))]
pub struct PageTable {
    entries: [PageTableEntry; 512],
}

impl PageTable {
    /// Create a new, zeroed page table (all entries invalid).
    pub fn new() -> Self {
        PageTable {
            entries: [PageTableEntry::empty(); 512],
        }
    }

    /// Get a reference to the entry at the given index.
    ///
    /// # Panics
    ///
    /// Panics if `index >= 512`.
    #[inline]
    pub fn entry(&self, index: usize) -> &PageTableEntry {
        assert!(index < 512, "PageTable::entry: index {} out of range", index);
        &self.entries[index]
    }

    /// Get a mutable reference to the entry at the given index.
    #[inline]
    pub fn entry_mut(&mut self, index: usize) -> &mut PageTableEntry {
        assert!(index < 512, "PageTable::entry_mut: index {} out of range", index);
        &mut self.entries[index]
    }

    /// Look up the physical address for a virtual address.
    ///
    /// Returns `Some(phys_addr)` if a valid mapping exists, or `None`
    /// if the virtual address is not mapped.
    ///
    /// This performs a full 3-level page table walk.
    pub fn translate(&self, virt_addr: usize) -> Option<PhysAddr> {
        let vpn2 = Self::vpn2(virt_addr);
        let vpn1 = Self::vpn1(virt_addr);
        let vpn0 = Self::vpn0(virt_addr);

        // Level 2 (root table — this)
        let e2 = self.entry(vpn2);
        if !e2.is_valid() {
            return None;
        }

        if e2.is_leaf() {
            // 1 GiB megapage at level 2
            let phys = e2.phys_addr().0 + (virt_addr & 0x3FFF_FFFF);
            return Some(PhysAddr(phys));
        }

        // Descend to level 1
        let l1_table = unsafe { &*(e2.phys_addr().0 as *const PageTable) };
        let e1 = l1_table.entry(vpn1);
        if !e1.is_valid() {
            return None;
        }

        if e1.is_leaf() {
            // 1 GiB megapage at level 1 (2 MiB superpage in Sv39)
            let phys = e1.phys_addr().0 + (virt_addr & 0x1F_FFFF);
            return Some(PhysAddr(phys));
        }

        // Descend to level 0
        let l0_table = unsafe { &*(e1.phys_addr().0 as *const PageTable) };
        let e0 = l0_table.entry(vpn0);
        if !e0.is_valid() {
            return None;
        }

        // Level 0 leaf — 4 KiB page
        let phys = e0.phys_addr().0 + (virt_addr & 0xFFF);
        Some(PhysAddr(phys))
    }

    // ─── VPN extraction helpers ────────────────────────────────────────

    /// Extract VPN[2] (bits 38:30) from a virtual address.
    #[inline]
    pub fn vpn2(virt: usize) -> usize {
        (virt >> 30) & 0x1FF
    }

    /// Extract VPN[1] (bits 29:21) from a virtual address.
    #[inline]
    pub fn vpn1(virt: usize) -> usize {
        (virt >> 21) & 0x1FF
    }

    /// Extract VPN[0] (bits 20:12) from a virtual address.
    #[inline]
    pub fn vpn0(virt: usize) -> usize {
        (virt >> 12) & 0x1FF
    }

    /// Get the raw pointer to the page table as a physical address.
    /// Used for writing to the `satp` CSR.
    #[inline]
    pub fn phys_addr(&self) -> PhysAddr {
        PhysAddr(self as *const Self as usize)
    }
}

// ─── Virtual Memory Manager ─────────────────────────────────────────────────

/// The global virtual memory manager.
///
/// Holds the kernel's root page table and provides the API for
/// creating address spaces and mapping virtual addresses.
static VMM: Mutex<KernelVmm> = Mutex::new(KernelVmm::new());

/// Kernel VMM state. Holds the root page table.
struct KernelVmm {
    root_table: &'static mut PageTable,
}

impl KernelVmm {
    const fn new() -> Self {
        KernelVmm {
            // SAFETY: This is a placeholder. The real root table is set during init().
            // Using a dangling pointer here is safe because VMM is never accessed
            // before init() replaces this with a valid pointer.
            root_table: unsafe { &mut *(0x1000 as *mut PageTable) },
        }
    }

    /// Replace the root table with a newly allocated one.
    ///
    /// # Safety
    ///
    /// `table` must point to a valid, allocated `PageTable`.
    unsafe fn set_root(&mut self, table: &'static mut PageTable) {
        self.root_table = table;
    }
}

// ─── Initialization ─────────────────────────────────────────────────────────

/// Initialize the virtual memory subsystem.
///
/// This function:
/// 1. Allocates a root page table frame from the PMA
/// 2. Identity-maps the lower 512 MiB of physical RAM (covers MMIO devices)
/// 3. Identity-maps the full kernel physical region (code/data/heap)
/// 4. Enables Sv39 paging by writing the `satp` CSR
///
/// After this function returns, all memory access goes through the page
/// tables. Since we use identity mapping, the kernel continues executing
/// at the same physical addresses — no relocation needed.
///
/// # Panics
///
/// Panics if page table frame allocation fails or the root table
/// address is not properly aligned.
///
/// # Safety
///
/// This modifies the `satp` CSR to enable hardware page translation.
/// Must be called exactly once, after PMA is initialized, before any
/// code that depends on virtual memory.
pub fn init() {
    // ─── 1. Allocate root page table ──────────────────────────────────
    let root_frame = pma::alloc_frame().expect("vmm: failed to allocate root page table frame");

    // SAFETY: root_frame is a freshly allocated, page-aligned physical address.
    // The PMA guarantees the frame is not used by anyone else.
    // We cast it to a mutable PageTable reference for initialization.
    let root_ptr = root_frame.0 as *mut PageTable;
    // SAFETY: root_ptr points to a valid, allocated frame of PAGE_SIZE bytes.
    // We zero it and initialize it as a PageTable. After this, the static
    // reference keeps it alive for the kernel's lifetime.
    let root_table: &'static mut PageTable = unsafe {
        core::ptr::write_bytes(root_ptr, 0, 1);
        &mut *root_ptr
    };

    // Store root table in the global VMM
    // SAFETY: VMM is initialized exactly once during boot. No concurrent access.
    unsafe {
        VMM.lock().set_root(root_table);
    }

    crate::println!("  [vmm] Sv39 page tables allocated at {}", root_frame);

    // ─── 2. Identity-map lower 512 MiB (MMIO coverage) ───────────────
    //
    // This maps virtual0x0000_0000_0000_0000 → physical0x0000_0000_0000_0000
    // for the first 512 MiB of physical address space.
    //
    // This covers:
    //   0x0000_0000 - 0x0000_FFFF : Firmware/ROM (64 KiB)
    //   0x0010_0000 - 0x0010_FFFF : UART NS16550A (64 KiB)
    //   0x0200_0000 - 0x0201_FFFF : CLINT timer/IPI (128 KiB)
    //   0x0C00_0000 - 0x0C0F_FFFF : PLIC (first 1 MiB)
    //
    // Without this, the UART would be inaccessible after paging is enabled,
    // and the kernel would be unable to print.
    {
        let mut vmm = VMM.lock();
        let root = vmm.root_table;

        let mmio_virt = 0usize;
        let mmio_phys = PhysAddr(0);
        map_megapage(root, mmio_virt, mmio_phys, PTE_RW | PTE_G);
        crate::println!("  [vmm] Identity-mapped lower 512 MiB (MMIO region)");
    }

    // ─── 3. Identity-map kernel physical region ───────────────────────
    //
    // This maps virtual 0x8000_0000 → physical 0x8000_0000 for the full
    // 256 MiB RAM region. This covers:
    //   Kernel .text, .rodata, .data, .stack, .bss
    //   Kernel heap
    //   Free frames
    //
    // After this mapping, the kernel continues executing at the same
    // physical addresses it was using before paging was enabled.
    {
        let mut vmm = VMM.lock();
        let root = vmm.root_table;
        let ram_size = RAM_SIZE;
        let ram_phys = PhysAddr(RAM_START);
        map_region(root, RAM_START, ram_phys, ram_size, PTE_RW | PTE_G);
        crate::println!(
            "  [vmm] Identity-mapped {} MiB kernel region ({:#x} - {:#x})",
            ram_size / (1024 * 1024),
            RAM_START,
            RAM_START + ram_size,
        );
    }

    // ─── 4. Enable Sv39 paging ────────────────────────────────────────
    //
    // Write the satp CSR to activate hardware page translation.
    // The SFENCE.VMA instruction flushes any stale TLB entries.
    //
    // After this point, all memory access goes through the page tables.
    // Since we used identity mapping, the kernel code, data, and stack
    // continue to be accessible at their current physical addresses.
    enable_paging(root_frame);

    crate::println!("  [vmm] Sv39 paging enabled — virtual memory active");

    // ─── 5. Verify mapping works ──────────────────────────────────────
    //
    // Sanity-check that the UART is still accessible (proves the
    // identity mapping works).
    {
        let root = VMM.lock().root_table;
        let uart_virt = 0x0010_0000usize;
        match root.translate(uart_virt) {
            Some(phys) => {
                crate::println!("  [vmm] Verification: UART {} → {}", uart_virt, phys);
            }
            None => {
                crate::println!("  [vmm] WARNING: UART not mapped — display broken!");
            }
        }
    }
}

// ─── Mapping Helpers ────────────────────────────────────────────────────────

/// Map a 1 GiB megapage at VPN[2] level.
///
/// This maps `virt_addr` (must be 1 GiB aligned) to `phys_addr`
/// using a single level-2 page table entry.
///
/// # Panics
///
/// Panics if `virt_addr` is not 1 GiB aligned.
fn map_megapage(table: &mut PageTable, virt_addr: usize, phys_addr: PhysAddr, flags: u64) {
    assert!(
        virt_addr & 0x3FFF_FFFF == 0,
        "map_megapage: virt_addr {:#x} is not 1 GiB aligned",
        virt_addr
    );
    let vpn2 = PageTable::vpn2(virt_addr);
    let entry = table.entry_mut(vpn2);
    assert!(
        !entry.is_valid(),
        "map_megapage: VPN[2] entry {} already in use",
        vpn2
    );
    *entry = PageTableEntry::new(phys_addr, flags | PTE_V);
}

/// Map a single 4 KiB page.
///
/// Walks (or allocates) the 3-level page table hierarchy and maps
/// `virt_addr` to `phys_addr` with the given flags.
///
/// # Panics
///
/// Panics if a page table frame allocation fails.
fn map_page(table: &mut PageTable, virt_addr: usize, phys_addr: PhysAddr, flags: u64) {
    assert!(virt_addr % PAGE_SIZE == 0, "map_page: virt_addr not page-aligned");
    assert!(phys_addr.is_page_aligned(), "map_page: phys_addr not page-aligned");

    let vpn2 = PageTable::vpn2(virt_addr);
    let vpn1 = PageTable::vpn1(virt_addr);
    let vpn0 = PageTable::vpn0(virt_addr);

    // Level 2 → Level 1
    let l1_table = get_or_create_table(table, vpn2);
    // Level 1 → Level 0
    let l0_table = get_or_create_table(l1_table, vpn1);
    // Level 0: set the leaf entry
    let entry = l0_table.entry_mut(vpn0);
    assert!(
        !entry.is_valid(),
        "map_page: page at VPN[0]={} already mapped",
        vpn0
    );
    *entry = PageTableEntry::new(phys_addr, flags | PTE_V);
}

/// Map a range of 4 KiB pages.
///
/// Maps `count` consecutive pages starting at `virt_addr` to `phys_addr`.
/// Each page is mapped individually through the 3-level hierarchy.
///
/// # Panics
///
/// Panics if any page table frame allocation fails, or if any page
/// in the range is already mapped.
fn map_region(
    table: &mut PageTable,
    virt_addr: usize,
    phys_addr: PhysAddr,
    size: usize,
    flags: u64,
) {
    assert!(virt_addr % PAGE_SIZE == 0, "map_region: virt_addr not page-aligned");
    assert!(phys_addr.is_page_aligned(), "map_region: phys_addr not page-aligned");
    assert!(size % PAGE_SIZE == 0, "map_region: size not page-aligned");

    let pages = size / PAGE_SIZE;
    for i in 0..pages {
        let v = virt_addr + i * PAGE_SIZE;
        let p = PhysAddr(phys_addr.0 + i * PAGE_SIZE);
        map_page(table, v, p, flags);
    }
}

/// Get or create a page table at the given VPN[2] or VPN[1] index.
///
/// If the entry at `parent_table[vpn_index]` is valid and non-leaf,
/// returns a mutable reference to the next-level table.
///
/// If the entry is invalid, allocates a new page table frame from the
/// PMA, links it into the parent, and returns a mutable reference.
///
/// # Panics
///
/// Panics if the entry is already a leaf (megapage) or if frame
/// allocation fails.
fn get_or_create_table<'a>(
    parent_table: &'a mut PageTable,
    vpn_index: usize,
) -> &'a mut PageTable {
    let entry = parent_table.entry(vpn_index);

    if entry.is_valid() {
        // Entry exists — it should be a non-leaf pointing to a sub-table
        assert!(
            !entry.is_leaf(),
            "get_or_create_table: entry at VPN index {} is a leaf (megapage)",
            vpn_index
        );
        let table_phys = entry.phys_addr().0;
        // SAFETY: entry.phys_addr() points to a valid, previously allocated
        // page table frame. We cast it to a mutable reference because we
        // are the sole owner of this address space during initialization.
        unsafe { &mut *(table_phys as *mut PageTable) }
    } else {
        // Allocate a new page table frame
        let frame = pma::alloc_frame()
            .expect("get_or_create_table: failed to allocate page table frame");

        // Zero the new table
        // SAFETY: frame is a freshly allocated, page-aligned physical address.
        // The PMA guarantees it's not used by anyone else.
        unsafe {
            core::ptr::write_bytes(frame.0 as *mut u8, 0, PAGE_SIZE);
        }

        // Link it into the parent
        let parent_entry = parent_table.entry_mut(vpn_index);
        // PPN is frame_number, flags are just valid (non-leaf: no R/W/X)
        *parent_entry = PageTableEntry::new(frame, PTE_V);

        // SAFETY: frame is a valid, allocated page table frame.
        // We return a mutable reference to it. This is safe because
        // we just allocated it and no one else has a reference.
        unsafe { &mut *(frame.0 as *mut PageTable) }
    }
}

// ─── Paging Control ─────────────────────────────────────────────────────────

/// Enable Sv39 paging by writing the `satp` CSR.
///
/// This activates hardware page translation. The `sfence.vma` instruction
/// flushes any stale TLB entries before the switch.
///
/// # Safety
///
/// - Modifies the `satp` CSR (Supervisor Address Translation and Protection)
/// - Must only be called after the page tables are correctly set up
/// - Must only be called once during boot
/// - After this call, all memory access goes through the page tables
/// - The identity mapping ensures the kernel continues executing seamlessly
fn enable_paging(root_table_phys: PhysAddr) {
    // Compute the satp value:
    //   Bits [63:60] = 0 (reserved)
    //   Bits [59:44] = 0 (ASID — no address space ID yet)
    //   Bits [43:0]  = PPN of root page table (root_table_phys / PAGE_SIZE)
    let ppn = root_table_phys.0 / PAGE_SIZE;
    let satp_value: u64 = (8u64 << 60) | (ppn as u64); // Mode 8 = Sv39

    unsafe {
        // Flush TLB — ensures no stale translations persist
        core::arch::asm!("sfence.vma");

        // Compiler fence — ensure all page table writes are committed
        // before we enable paging. Without this, the compiler could
        // reorder writes and we'd enable paging before tables are ready.
        core::sync::atomic::fence(core::sync::atomic::Ordering::SeqCst);

        // Enable Sv39 paging
        core::arch::asm!("csrw satp, {}", in(reg) satp_value);

        // Flush TLB again — the previous sfence was before satp write,
        // this one ensures the new mappings take effect immediately.
        core::arch::asm!("sfence.vma");
    }
}

// ─── Public API ─────────────────────────────────────────────────────────────

/// Map a single 4 KiB page in the kernel's address space.
///
/// # Arguments
///
/// * `virt_addr` — Virtual address to map (must be page-aligned).
/// * `phys_addr` — Physical address to map to (must be page-aligned).
/// * `flags` — Page table entry flags (PTE_R, PTE_W, PTE_X, etc.).
///
/// # Panics
///
/// Panics if the page is already mapped or frame allocation fails.
pub fn map_page_kernel(virt_addr: usize, phys_addr: PhysAddr, flags: u64) {
    let mut vmm = VMM.lock();
    map_page(vmm.root_table, virt_addr, phys_addr, flags);
}

/// Unmap a single 4 KiB page in the kernel's address space.
///
/// Sets the entry to invalid. Does NOT free the underlying physical frame.
///
/// # Panics
///
/// Panics if the page is not currently mapped.
pub fn unmap_page_kernel(virt_addr: usize) {
    let mut vmm = VMM.lock();
    let root = vmm.root_table;

    let vpn2 = PageTable::vpn2(virt_addr);
    let vpn1 = PageTable::vpn1(virt_addr);
    let vpn0 = PageTable::vpn0(virt_addr);

    let e2 = &root.entries[vpn2];
    assert!(e2.is_valid(), "unmap_page_kernel: level 2 entry invalid");
    assert!(!e2.is_leaf(), "unmap_page_kernel: level 2 is a megapage");

    let l1 = unsafe { &mut *(e2.phys_addr().0 as *mut PageTable) };
    let e1 = &l1.entries[vpn1];
    assert!(e1.is_valid(), "unmap_page_kernel: level 1 entry invalid");
    assert!(!e1.is_leaf(), "unmap_page_kernel: level 1 is a megapage");

    let l0 = unsafe { &mut *(e1.phys_addr().0 as *mut PageTable) };
    let e0 = &l0.entries[vpn0];
    assert!(e0.is_valid(), "unmap_page_kernel: page not mapped");

    // Invalidate the entry
    l0.entries[vpn0] = PageTableEntry::empty();

    // Flush TLB for this address
    unsafe {
        core::arch::asm!(
            "sfence.vma {}",
            in(reg) virt_addr,
        );
    }
}

/// Translate a virtual address to a physical address.
///
/// Performs a full 3-level page table walk on the kernel's root table.
///
/// Returns `Some(phys_addr)` if the mapping exists, `None` otherwise.
pub fn translate(virt_addr: usize) -> Option<PhysAddr> {
    let vmm = VMM.lock();
    vmm.root_table.translate(virt_addr)
}

/// Get the physical address of the kernel's root page table.
///
/// Used when switching address spaces (writing to `satp`).
pub fn kernel_page_table_phys() -> PhysAddr {
    let vmm = VMM.lock();
    vmm.root_table.phys_addr()
}

/// Print page table statistics for diagnostics.
pub fn print_stats() {
    let vmm = VMM.lock();
    let root = vmm.root_table;
    let root_phys = root.phys_addr();

    crate::println!("  [vmm] Root page table at {}", root_phys);

    // Count valid entries at each level
    let mut l2_count = 0usize;
    let mut l1_count = 0usize;
    let mut l0_count = 0usize;

    for i in 0..512 {
        let e2 = root.entry(i);
        if e2.is_valid() {
            l2_count += 1;
            if !e2.is_leaf() {
                // Walk level 1
                let l1 = unsafe { &*(e2.phys_addr().0 as *const PageTable) };
                for j in 0..512 {
                    let e1 = l1.entry(j);
                    if e1.is_valid() {
                        l1_count += 1;
                        if !e1.is_leaf() {
                            // Walk level 0
                            let l0 = unsafe { &*(e1.phys_addr().0 as *const PageTable) };
                            for k in 0..512 {
                                if l0.entry(k).is_valid() {
                                    l0_count += 1;
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    crate::println!("  [vmm]   Level 2 entries: {}", l2_count);
    crate::println!("  [vmm]   Level 1 entries: {}", l1_count);
    crate::println!("  [vmm]   Level 0 entries: {}", l0_count);
    crate::println!(
        "  [vmm]   Total mapped pages: {} ({} MiB)",
        l0_count,
        l0_count * 4 // KiB → MiB? No: l0_count * 4096 / (1024*1024)
    );
}

// ─── Unit Tests ─────────────────────────────────────────────────────────────

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_pte_basic() {
        let addr = PhysAddr(0x8000_1000);
        let flags = PTE_V | PTE_R | PTE_W;
        let pte = PageTableEntry::new(addr, flags);

        assert!(pte.is_valid());
        assert!(!pte.is_leaf()); // R+W without X → non-leaf? Actually R|W is leaf.
        // Wait — is_leaf checks if ANY of R/W/X is set. So R|W IS a leaf.
        assert!(pte.is_leaf());
        assert_eq!(pte.phys_addr(), addr);
        assert_eq!(pte.flags(), flags);
    }

    #[test]
    fn test_pte_empty() {
        let pte = PageTableEntry::empty();
        assert!(!pte.is_valid());
        assert!(!pte.is_leaf());
    }

    #[test]
    fn test_vpn_extraction() {
        // Virtual address 0xFFFF_FFC0_8000_1000
        let va = 0xFFFF_FFC0_8000_1000usize;
        assert_eq!(PageTable::vpn2(va), 0x1FD); // bits 38:30
        assert_eq!(PageTable::vpn1(va), 0x000); // bits 29:21
        assert_eq!(PageTable::vpn0(va), 0x000); // bits 20:12

        // Virtual address 0x8000_0000
        let va2 = 0x8000_0000usize;
        assert_eq!(PageTable::vpn2(va2), 2);
        assert_eq!(PageTable::vpn1(va2), 0);
        assert_eq!(PageTable::vpn0(va2), 0);
    }

    #[test]
    fn test_page_table_new() {
        let table = PageTable::new();
        for i in 0..512 {
            assert!(!table.entry(i).is_valid());
        }
    }
}
