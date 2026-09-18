//! SurakshaOS Virtual Memory Manager (VMM) — Sv39
//!
//! Implements RISC-V Sv39 page tables, per-process address spaces,
//! and the kernel's initial memory mapping.
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
//! ```
//!
//! # Per-Process Address Spaces
//!
//! Each process has its own `AddressSpace` with:
//! - A root page table (physically allocated via PMA)
//! - Copies of kernel mappings (MMIO + kernel region)
//! - Process-specific user-space mappings
//!
//! When switching between processes, `switch_address_space()` writes
//! the new root table's PPN to the `satp` CSR. The kernel mappings
//! are shared across all address spaces (same physical sub-tables),
//! so the kernel remains accessible regardless of which process is active.
//!
//! # Safety
//!
//! This module directly manipulates page tables and the `satp` CSR.
//! All `unsafe` blocks document their safety invariants. Incorrect
//! page table setup will cause immediate hardware faults.

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
/// Combination: valid + readable + writable (for kernel data).
pub const PTE_RW: u64 = PTE_V | PTE_R | PTE_W;
/// Combination: valid + readable (for read-only mappings).
pub const PTE_R_ONLY: u64 = PTE_V | PTE_R;

/// Mask for extracting the physical page number (PPN) from a PTE.
const PTE_PPN_MASK: u64 = 0x003F_FFFF_FFC00;
/// Mask for extracting flags from a PTE.
const PTE_FLAGS_MASK: u64 = 0x3FF;

// ─── Kernel Virtual Address Boundaries ──────────────────────────────────────

/// Start of kernel physical region (identity-mapped in all address spaces).
const KERNEL_REGION_START: usize = RAM_START;
/// End of kernel physical region.
const KERNEL_REGION_END: usize = RAM_START + RAM_SIZE;

/// Check if a virtual address falls within the kernel's mapped region.
/// Used to determine which page tables can be safely freed during
/// address space destruction (kernel-mapped tables are shared).
fn is_kernel_region(virt: usize) -> bool {
    virt >= KERNEL_REGION_START && virt < KERNEL_REGION_END
}

// ─── Page Table Entry ───────────────────────────────────────────────────────

/// A single Sv39 page table entry (8 bytes).
#[derive(Debug, Clone, Copy)]
#[repr(transparent)]
pub struct PageTableEntry(u64);

impl PageTableEntry {
    /// Create a new entry from a physical address and flags.
    pub fn new(phys_addr: PhysAddr, flags: u64) -> Self {
        assert!(
            phys_addr.is_page_aligned(),
            "PageTableEntry::new: phys_addr {} not page-aligned",
            phys_addr
        );
        let ppn = phys_addr.0 / PAGE_SIZE;
        PageTableEntry((ppn << 10) | (flags & PTE_FLAGS_MASK))
    }

    /// Create an empty (invalid) entry.
    pub fn empty() -> Self { PageTableEntry(0) }

    /// Check if this entry is valid.
    #[inline]
    pub fn is_valid(&self) -> bool { self.0 & PTE_V != 0 }

    /// Check if this entry is a leaf (R, W, or X set).
    #[inline]
    pub fn is_leaf(&self) -> bool { self.0 & (PTE_R | PTE_W | PTE_X) != 0 }

    /// Get the physical address this entry points to.
    #[inline]
    pub fn phys_addr(&self) -> PhysAddr {
        PhysAddr(((self.0 & PTE_PPN_MASK) >> 10) * PAGE_SIZE)
    }

    /// Get the raw flags.
    #[inline]
    pub fn flags(&self) -> u64 { self.0 & PTE_FLAGS_MASK }

    /// Get the raw 64-bit value.
    #[inline]
    pub fn raw(&self) -> u64 { self.0 }

    /// Set the physical address.
    #[inline]
    pub fn set_phys_addr(&mut self, phys_addr: PhysAddr) {
        assert!(phys_addr.is_page_aligned());
        let ppn = phys_addr.0 / PAGE_SIZE;
        self.0 = (self.0 & !PTE_PPN_MASK) | ((ppn as u64) << 10);
    }

    /// Set the flags.
    #[inline]
    pub fn set_flags(&mut self, flags: u64) {
        self.0 = (self.0 & !PTE_FLAGS_MASK) | (flags & PTE_FLAGS_MASK);
    }
}

// ─── Page Table ─────────────────────────────────────────────────────────────

/// An Sv39 page table — 512 entries, 4 KiB, page-aligned.
#[repr(C, align(4096))]
pub struct PageTable {
    entries: [PageTableEntry; 512],
}

impl PageTable {
    /// Create a new, zeroed page table.
    pub fn new() -> Self {
        PageTable { entries: [PageTableEntry::empty(); 512] }
    }

    /// Get a reference to the entry at `index`.
    #[inline]
    pub fn entry(&self, index: usize) -> &PageTableEntry {
        assert!(index < 512);
        &self.entries[index]
    }

    /// Get a mutable reference to the entry at `index`.
    #[inline]
    pub fn entry_mut(&mut self, index: usize) -> &mut PageTableEntry {
        assert!(index < 512);
        &mut self.entries[index]
    }

    /// Full 3-level page table walk to translate a virtual address.
    pub fn translate(&self, virt_addr: usize) -> Option<PhysAddr> {
        let vpn2 = Self::vpn2(virt_addr);
        let vpn1 = Self::vpn1(virt_addr);
        let vpn0 = Self::vpn0(virt_addr);

        let e2 = self.entry(vpn2);
        if !e2.is_valid() { return None; }
        if e2.is_leaf() {
            return Some(PhysAddr(e2.phys_addr().0 + (virt_addr & 0x3FFF_FFFF)));
        }

        let l1 = unsafe { &*(e2.phys_addr().0 as *const PageTable) };
        let e1 = l1.entry(vpn1);
        if !e1.is_valid() { return None; }
        if e1.is_leaf() {
            return Some(PhysAddr(e1.phys_addr().0 + (virt_addr & 0x1F_FFFF)));
        }

        let l0 = unsafe { &*(e1.phys_addr().0 as *const PageTable) };
        let e0 = l0.entry(vpn0);
        if !e0.is_valid() { return None; }
        Some(PhysAddr(e0.phys_addr().0 + (virt_addr & 0xFFF)))
    }

    // ─── VPN extraction ───────────────────────────────────────────────

    #[inline] pub fn vpn2(virt: usize) -> usize { (virt >> 30) & 0x1FF }
    #[inline] pub fn vpn1(virt: usize) -> usize { (virt >> 21) & 0x1FF }
    #[inline] pub fn vpn0(virt: usize) -> usize { (virt >> 12) & 0x1FF }

    /// Physical address of this page table (for satp CSR).
    #[inline]
    pub fn phys_addr(&self) -> PhysAddr {
        PhysAddr(self as *const Self as usize)
    }
}

// ─── Address Space ──────────────────────────────────────────────────────────

/// A process address space, backed by an Sv39 page table hierarchy.
///
/// Each address space has:
/// - A root page table (allocated from PMA)
/// - Copies of kernel mappings (shared physical sub-tables)
/// - Process-specific user-space mappings
///
/// # Lifecycle
///
/// 1. `AddressSpace::new_kernel()` — called once during boot
/// 2. `AddressSpace::new_user()` — called when creating a process
/// 3. `AddressSpace::map_page()` / `unmap_page()` — modify mappings
/// 4. `AddressSpace::switch_to()` — activate via satp CSR
/// 5. `AddressSpace::destroy()` — free all page table frames
pub struct AddressSpace {
    /// Physical address of the root page table (for satp CSR).
    root_phys: PhysAddr,
    /// Mutable pointer to the root table (for mapping operations).
    root_table: *mut PageTable,
    /// Number of sub-tables allocated (for diagnostics).
    sub_table_count: usize,
}

// SAFETY: AddressSpace is only accessed through the VMM mutex or
// during single-threaded boot. No concurrent access.
unsafe impl Send for AddressSpace {}

impl AddressSpace {
    /// Create the kernel address space from an existing root table.
    ///
    /// # Safety
    ///
    /// `root` must point to a valid, initialized page table with
    /// kernel mappings already set up.
    unsafe fn from_root(root: &'static mut PageTable) -> Self {
        let root_phys = root.phys_addr();
        AddressSpace {
            root_phys,
            root_table: root as *mut PageTable,
            sub_table_count: 0,
        }
    }

    /// Create a new user address space by cloning kernel mappings.
    ///
    /// Allocates a fresh root page table and copies kernel-mapped
    /// entries from the kernel address space. The resulting space
    /// can be used for a process that shares the kernel's mappings
    /// but has its own user-space pages.
    ///
    /// # Panics
    ///
    /// Panics if root page table frame allocation fails.
    fn new_user() -> Self {
        let root_frame = pma::alloc_frame()
            .expect("AddressSpace::new_user: failed to allocate root page table");

        // SAFETY: root_frame is freshly allocated, PMA guarantees exclusive ownership.
        unsafe {
            core::ptr::write_bytes(root_frame.0 as *mut u8, 0, PAGE_SIZE);
        }

        let root_ptr = root_frame.0 as *mut PageTable;

        // Clone kernel mappings from the current address space.
        // We read the kernel's root table entries and copy the kernel-region
        // entries to the new space. This shares the physical sub-tables —
        // the same physical page table frames are referenced by both spaces.
        {
            let current_root = current_address_space();
            let current = unsafe { &*current_root.root_table };
            let new = unsafe { &mut *root_ptr };

            for i in 0..512 {
                let virt = i << 30; // VPN[2] index → virtual address
                if is_kernel_region(virt) {
                    let entry = current.entry(i);
                    if entry.is_valid() {
                        new.entries[i] = *entry;
                    }
                }
            }
        }

        AddressSpace {
            root_phys: root_frame,
            root_table: root_ptr,
            sub_table_count: 0,
        }
    }

    /// Get the physical address of the root page table.
    ///
    /// Used when writing to the `satp` CSR to switch address spaces.
    pub fn root_phys(&self) -> PhysAddr {
        self.root_phys
    }

    /// Get a reference to the root page table.
    fn root(&self) -> &PageTable {
        // SAFETY: root_table is always valid — set during construction
        // and never freed while the AddressSpace exists.
        unsafe { &*self.root_table }
    }

    /// Get a mutable reference to the root page table.
    fn root_mut(&mut self) -> &mut PageTable {
        // SAFETY: root_table is always valid. Mutable access is safe because
        // operations are serialized through the VMM mutex.
        unsafe { &mut *self.root_table }
    }

    /// Map a single 4 KiB page in this address space.
    ///
    /// Walks the 3-level hierarchy, allocating intermediate page table
    /// frames from the PMA as needed.
    pub fn map_page(&mut self, virt_addr: usize, phys_addr: PhysAddr, flags: u64) {
        assert!(virt_addr % PAGE_SIZE == 0, "virt_addr not page-aligned");
        assert!(phys_addr.is_page_aligned(), "phys_addr not page-aligned");

        let root = self.root_mut();
        let l1 = get_or_create_table(root, PageTable::vpn2(virt_addr), &mut self.sub_table_count);
        let l0 = get_or_create_table(l1, PageTable::vpn1(virt_addr), &mut self.sub_table_count);

        let entry = l0.entry_mut(PageTable::vpn0(virt_addr));
        assert!(!entry.is_valid(),
            "map_page: VPN[0]={} already mapped at virt {:#x}",
            PageTable::vpn0(virt_addr), virt_addr
        );
        *entry = PageTableEntry::new(phys_addr, flags | PTE_V);
    }

    /// Unmap a single 4 KiB page.
    ///
    /// Sets the entry to invalid and flushes the TLB.
    /// Does NOT free the underlying physical frame.
    pub fn unmap_page(&mut self, virt_addr: usize) {
        let root = self.root_mut();
        let vpn2 = PageTable::vpn2(virt_addr);
        let vpn1 = PageTable::vpn1(virt_addr);
        let vpn0 = PageTable::vpn0(virt_addr);

        let e2 = root.entry(vpn2);
        assert!(e2.is_valid(), "unmap_page: level 2 invalid");
        assert!(!e2.is_leaf(), "unmap_page: level 2 is megapage");

        let l1 = unsafe { &mut *(e2.phys_addr().0 as *mut PageTable) };
        let e1 = l1.entry(vpn1);
        assert!(e1.is_valid(), "unmap_page: level 1 invalid");
        assert!(!e1.is_leaf(), "unmap_page: level 1 is megapage");

        let l0 = unsafe { &mut *(e1.phys_addr().0 as *mut PageTable) };
        let e0 = l0.entry(vpn0);
        assert!(e0.is_valid(), "unmap_page: page not mapped");

        l0.entries[vpn0] = PageTableEntry::empty();

        // Flush TLB for this address
        unsafe {
            core::arch::asm!("sfence.vma {}", in(reg) virt_addr);
        }
    }

    /// Translate a virtual address to a physical address.
    pub fn translate(&self, virt_addr: usize) -> Option<PhysAddr> {
        self.root().translate(virt_addr)
    }

    /// Activate this address space by writing to the `satp` CSR.
    ///
    /// After this call, all memory access goes through this
    /// address space's page tables.
    ///
    /// # Safety
    ///
    /// - Modifies the `satp` CSR
    /// - Must only be called with valid page tables
    /// - TLB is flushed before and after the switch
    pub fn switch_to(&self) {
        let ppn = self.root_phys.0 / PAGE_SIZE;
        let satp_value: u64 = (8u64 << 60) | (ppn as u64); // Mode 8 = Sv39

        unsafe {
            core::arch::asm!("sfence.vma");
            core::sync::atomic::fence(core::sync::atomic::Ordering::SeqCst);
            core::arch::asm!("csrw satp, {}", in(reg) satp_value);
            core::arch::asm!("sfence.vma");
        }
    }

    /// Destroy this address space, freeing all allocated page table frames.
    ///
    /// Frees intermediate page table frames (levels 1 and 2) but:
    /// - Does NOT free kernel-mapped sub-tables (shared with other spaces)
    /// - Does NOT free leaf page frames (caller's responsibility)
    ///
    /// After this call, the `AddressSpace` must not be used.
    ///
    /// # Safety
    ///
    /// The root page table frame is freed. The caller must ensure
    /// this address space is not currently active (switch away first).
    pub unsafe fn destroy(&mut self) {
        let root = self.root_mut();
        free_page_tables_recursive(root, 2);
        // Free the root frame itself
        pma::free_frame(self.root_phys);
    }
}

// ─── Kernel VMM State ───────────────────────────────────────────────────────

/// Global VMM state. Tracks the kernel address space and the
/// currently active address space.
static VMM: Mutex<KernelVmm> = Mutex::new(KernelVmm::new());

struct KernelVmm {
    /// The kernel's address space (never destroyed).
    kernel_space: AddressSpace,
    /// Pointer to the currently active address space.
    /// Points to either `kernel_space` or a heap-allocated process space.
    current_space: *const AddressSpace,
}

impl KernelVmm {
    const fn new() -> Self {
        KernelVmm {
            // SAFETY: placeholder — replaced during init()
            kernel_space: AddressSpace {
                root_phys: PhysAddr(0),
                root_table: core::ptr::null_mut(),
                sub_table_count: 0,
            },
            current_space: core::ptr::null(),
        }
    }
}

/// Get a reference to the currently active address space.
fn current_address_space() -> &'static AddressSpace {
    // SAFETY: current_space is always valid after VMM init.
    // It points to either the static kernel_space or a heap-allocated space
    // that is owned by the VMM and not freed while in use.
    unsafe { &*VMM.lock().current_space }
}

// ─── Initialization ─────────────────────────────────────────────────────────

/// Initialize the virtual memory subsystem.
///
/// 1. Allocates root page table for kernel
/// 2. Identity-maps MMIO (lower 512 MiB) and kernel region
/// 3. Enables Sv39 paging via satp CSR
/// 4. Sets up kernel AddressSpace wrapper
///
/// # Safety
///
/// Modifies `satp` CSR. Called once during boot.
pub fn init() {
    // ─── 1. Allocate root page table ──────────────────────────────────
    let root_frame = pma::alloc_frame()
        .expect("vmm: failed to allocate root page table frame");

    let root_ptr = root_frame.0 as *mut PageTable;
    let root_table: &'static mut PageTable = unsafe {
        core::ptr::write_bytes(root_ptr, 0, 1);
        &mut *root_ptr
    };

    crate::println!("  [vmm] Sv39 page tables allocated at {}", root_frame);

    // ─── 2. Identity-map lower 512 MiB (MMIO) ────────────────────────
    {
        map_megapage(root_table, 0, PhysAddr(0), PTE_RW | PTE_G);
        crate::println!("  [vmm] Identity-mapped lower 512 MiB (MMIO region)");
    }

    // ─── 3. Identity-map kernel region ────────────────────────────────
    {
        let ram_phys = PhysAddr(RAM_START);
        map_region(root_table, RAM_START, ram_phys, RAM_SIZE, PTE_RW | PTE_G);
        crate::println!(
            "  [vmm] Identity-mapped {} MiB kernel region ({:#x} - {:#x})",
            RAM_SIZE / (1024 * 1024), RAM_START, RAM_START + RAM_SIZE,
        );
    }

    // ─── 4. Enable Sv39 paging ────────────────────────────────────────
    enable_paging(root_frame);
    crate::println!("  [vmm] Sv39 paging enabled — virtual memory active");

    // ─── 5. Set up kernel AddressSpace ────────────────────────────────
    //
    // After paging is enabled, we can safely create the AddressSpace wrapper.
    // The kernel space uses the same root table we just set up.
    let kernel_space = unsafe { AddressSpace::from_root(root_table) };

    {
        let mut vmm = VMM.lock();
        vmm.kernel_space = kernel_space;
        vmm.current_space = &vmm.kernel_space as *const AddressSpace;
    }

    // ─── 6. Verify ────────────────────────────────────────────────────
    {
        let cs = current_address_space();
        let uart_virt = 0x0010_0000usize;
        match cs.translate(uart_virt) {
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
fn map_megapage(table: &mut PageTable, virt_addr: usize, phys_addr: PhysAddr, flags: u64) {
    assert!(virt_addr & 0x3FFF_FFFF == 0,
        "map_megapage: virt_addr {:#x} not 1 GiB aligned", virt_addr);
    let vpn2 = PageTable::vpn2(virt_addr);
    let entry = table.entry_mut(vpn2);
    assert!(!entry.is_valid(), "map_megapage: VPN[2] entry {} already in use", vpn2);
    *entry = PageTableEntry::new(phys_addr, flags | PTE_V);
}

/// Map a single 4 KiB page through the 3-level hierarchy.
fn map_page(table: &mut PageTable, virt_addr: usize, phys_addr: PhysAddr, flags: u64) {
    assert!(virt_addr % PAGE_SIZE == 0);
    assert!(phys_addr.is_page_aligned());

    let vpn2 = PageTable::vpn2(virt_addr);
    let vpn1 = PageTable::vpn1(virt_addr);
    let vpn0 = PageTable::vpn0(virt_addr);

    let l1 = get_or_create_table(table, vpn2, &mut 0);
    let l0 = get_or_create_table(l1, vpn1, &mut 0);
    let entry = l0.entry_mut(vpn0);
    assert!(!entry.is_valid(), "map_page: VPN[0]={} already mapped", vpn0);
    *entry = PageTableEntry::new(phys_addr, flags | PTE_V);
}

/// Map a range of 4 KiB pages.
fn map_region(table: &mut PageTable, virt_addr: usize, phys_addr: PhysAddr, size: usize, flags: u64) {
    assert!(virt_addr % PAGE_SIZE == 0);
    assert!(phys_addr.is_page_aligned());
    assert!(size % PAGE_SIZE == 0);

    for i in 0..(size / PAGE_SIZE) {
        let v = virt_addr + i * PAGE_SIZE;
        let p = PhysAddr(phys_addr.0 + i * PAGE_SIZE);
        map_page(table, v, p, flags);
    }
}

/// Get or create a sub-page table at the given index.
///
/// If the parent entry is valid and non-leaf, returns the existing sub-table.
/// If invalid, allocates a new frame, links it, and returns the new table.
///
/// `sub_table_count` is incremented for each newly allocated frame (for diagnostics).
fn get_or_create_table<'a>(
    parent: &'a mut PageTable,
    vpn_index: usize,
    sub_table_count: &mut usize,
) -> &'a mut PageTable {
    let entry = parent.entry(vpn_index);

    if entry.is_valid() {
        assert!(!entry.is_leaf(),
            "get_or_create_table: entry at VPN index {} is a megapage", vpn_index);
        let table_phys = entry.phys_addr().0;
        // SAFETY: entry points to a valid, previously allocated page table frame.
        unsafe { &mut *(table_phys as *mut PageTable) }
    } else {
        let frame = pma::alloc_frame()
            .expect("get_or_create_table: failed to allocate page table frame");
        // SAFETY: frame is freshly allocated by PMA, guaranteed exclusive.
        unsafe { core::ptr::write_bytes(frame.0 as *mut u8, 0, PAGE_SIZE); }

        *parent.entry_mut(vpn_index) = PageTableEntry::new(frame, PTE_V);
        *sub_table_count += 1;

        // SAFETY: frame is valid, freshly allocated, exclusively owned.
        unsafe { &mut *(frame.0 as *mut PageTable) }
    }
}

// ─── Paging Control ─────────────────────────────────────────────────────────

/// Enable Sv39 paging by writing the `satp` CSR.
fn enable_paging(root_table_phys: PhysAddr) {
    let ppn = root_table_phys.0 / PAGE_SIZE;
    let satp_value: u64 = (8u64 << 60) | (ppn as u64);

    unsafe {
        core::arch::asm!("sfence.vma");
        core::sync::atomic::fence(core::sync::atomic::Ordering::SeqCst);
        core::arch::asm!("csrw satp, {}", in(reg) satp_value);
        core::arch::asm!("sfence.vma");
    }
}

// ─── Page Table Cleanup ─────────────────────────────────────────────────────

/// Recursively free page table frames, preserving kernel-mapped tables.
///
/// Walks the page table at the given level. For each valid non-leaf entry:
/// - If the virtual address range is in the kernel region, the sub-table
///   is shared and must NOT be freed.
/// - Otherwise, recursively descend and free the sub-table frame.
///
/// # Safety
///
/// The caller must ensure `table` is a valid page table and that
/// this address space is not currently active (switched away first).
unsafe fn free_page_tables_recursive(table: &mut PageTable, level: usize) {
    if level == 0 { return; } // Don't free the root (caller does that)

    for i in 0..512 {
        let entry = &table.entries[i];
        if !entry.is_valid() || entry.is_leaf() { continue; }

        let virt = i << (level * 9 + 12);

        // Don't free kernel-mapped sub-tables
        if is_kernel_region(virt) { continue; }

        let sub_table_phys = entry.phys_addr().0;
        let sub_table = &mut *(sub_table_phys as *mut PageTable);

        // Recurse if this is a mid-level table (not level 0)
        if level > 1 {
            free_page_tables_recursive(sub_table, level - 1);
        }

        // Free the sub-table frame
        pma::free_frame(sub_table_phys as PhysAddr);

        // Invalidate the parent entry
        table.entries[i] = PageTableEntry::empty();
    }
}

// ─── Public API ─────────────────────────────────────────────────────────────

/// Create a new user address space.
///
/// Allocates a root page table and clones kernel mappings.
/// The returned space can be used for a new process.
///
/// # Panics
///
/// Panics if root page table allocation fails.
pub fn create_address_space() -> AddressSpace {
    AddressSpace::new_user()
}

/// Switch to a different address space.
///
/// Writes the address space's root table PPN to the `satp` CSR,
/// activating the new page tables for all subsequent memory access.
///
/// # Safety
///
/// - Modifies the `satp` CSR
/// - The target address space must have valid page tables
/// - The current address space must remain valid (not destroyed)
pub fn switch_address_space(space: &AddressSpace) {
    space.switch_to();
    // Update the VMM's current_space pointer
    // SAFETY: VMM is accessed through the mutex. The space pointer
    // remains valid for the lifetime of the AddressSpace.
    let mut vmm = VMM.lock();
    vmm.current_space = space as *const AddressSpace;
}

/// Get the kernel's address space (read-only reference).
pub fn kernel_address_space() -> &'static AddressSpace {
    let vmm = VMM.lock();
    // SAFETY: kernel_space lives inside the static VMM and is never moved.
    unsafe { &*core::ptr::addr_of!(vmm.kernel_space) }
}

/// Get the currently active address space.
pub fn current_address_space_ref() -> &'static AddressSpace {
    current_address_space()
}

/// Get the physical address of the currently active page table root.
///
/// Used for diagnostics and when constructing the satp CSR value.
pub fn active_page_table_phys() -> PhysAddr {
    current_address_space().root_phys()
}

/// Map a page in the currently active address space.
pub fn map_page_current(virt_addr: usize, phys_addr: PhysAddr, flags: u64) {
    let mut vmm = VMM.lock();
    let space = unsafe { &mut *vmm.current_space as *mut AddressSpace };
    // SAFETY: current_space points to a valid AddressSpace.
    // We need &mut but the VMM mutex ensures exclusive access.
    unsafe { (*space).map_page(virt_addr, phys_addr, flags); }
}

/// Unmap a page in the currently active address space.
pub fn unmap_page_current(virt_addr: usize) {
    let mut vmm = VMM.lock();
    let space = unsafe { &mut *vmm.current_space as *mut AddressSpace };
    unsafe { (*space).unmap_page(virt_addr); }
}

/// Translate a virtual address in the currently active address space.
pub fn translate_current(virt_addr: usize) -> Option<PhysAddr> {
    current_address_space().translate(virt_addr)
}

/// Destroy an address space, freeing all non-kernel page table frames.
///
/// # Safety
///
/// The address space must NOT be the currently active one.
/// Switch to another space before destroying.
pub unsafe fn destroy_address_space(space: &mut AddressSpace) {
    space.destroy();
}

/// Print page table statistics for the currently active address space.
pub fn print_stats() {
    let cs = current_address_space();
    let root = cs.root();
    let root_phys = cs.root_phys();

    crate::println!("  [vmm] Active page table at {}", root_phys);

    let mut l2_count = 0usize;
    let mut l1_count = 0usize;
    let mut l0_count = 0usize;

    for i in 0..512 {
        let e2 = root.entry(i);
        if e2.is_valid() {
            l2_count += 1;
            if !e2.is_leaf() {
                let l1 = unsafe { &*(e2.phys_addr().0 as *const PageTable) };
                for j in 0..512 {
                    let e1 = l1.entry(j);
                    if e1.is_valid() {
                        l1_count += 1;
                        if !e1.is_leaf() {
                            let l0 = unsafe { &*(e1.phys_addr().0 as *const PageTable) };
                            for k in 0..512 {
                                if l0.entry(k).is_valid() { l0_count += 1; }
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
        "  [vmm]   Sub-tables allocated: {}",
        cs.sub_table_count
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
        let va = 0xFFFF_FFC0_8000_1000usize;
        assert_eq!(PageTable::vpn2(va), 0x1FD);
        assert_eq!(PageTable::vpn1(va), 0x000);
        assert_eq!(PageTable::vpn0(va), 0x000);

        let va2 = 0x8000_0000usize;
        assert_eq!(PageTable::vpn2(va2), 2);
        assert_eq!(PageTable::vpn1(va2), 0);
        assert_eq!(PageTable::vpn0(va2), 0);
    }

    #[test]
    fn test_is_kernel_region() {
        assert!(is_kernel_region(0x8000_0000));
        assert!(is_kernel_region(0x8800_0000 - 1));
        assert!(!is_kernel_region(0x7FFF_FFFF));
        assert!(!is_kernel_region(0x8800_0000));
    }

    #[test]
    fn test_page_table_new() {
        let table = PageTable::new();
        for i in 0..512 {
            assert!(!table.entry(i).is_valid());
        }
    }
}
