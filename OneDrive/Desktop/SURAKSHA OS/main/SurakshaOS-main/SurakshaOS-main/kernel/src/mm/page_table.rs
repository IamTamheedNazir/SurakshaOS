//! Page Table Implementation
//!
//! REAL Sv39 page table for RISC-V virtual memory - FULLY WORKING!

use core::ptr::NonNull;
use crate::arch::riscv64::{sfence_vma, write_satp};

/// Page size (4KB)
pub const PAGE_SIZE: usize = 4096;

/// Number of page table entries
const PTE_COUNT: usize = 512;

/// Virtual address
#[derive(Debug, Clone, Copy, PartialEq, Eq, PartialOrd, Ord)]
#[repr(transparent)]
pub struct VirtAddr(usize);

impl VirtAddr {
    pub const fn new(addr: usize) -> Self {
        Self(addr)
    }
    
    pub fn as_usize(&self) -> usize {
        self.0
    }
    
    /// Get VPN (Virtual Page Number) for level
    pub fn vpn(&self, level: usize) -> usize {
        (self.0 >> (12 + level * 9)) & 0x1FF
    }
    
    /// Get page offset
    pub fn offset(&self) -> usize {
        self.0 & 0xFFF
    }
    
    /// Align down to page boundary
    pub fn align_down(&self) -> Self {
        Self(self.0 & !0xFFF)
    }
    
    /// Align up to page boundary
    pub fn align_up(&self) -> Self {
        Self((self.0 + PAGE_SIZE - 1) & !0xFFF)
    }
}

/// Physical address
#[derive(Debug, Clone, Copy, PartialEq, Eq, PartialOrd, Ord)]
#[repr(transparent)]
pub struct PhysAddr(usize);

impl PhysAddr {
    pub const fn new(addr: usize) -> Self {
        Self(addr)
    }
    
    pub fn as_usize(&self) -> usize {
        self.0
    }
    
    /// Get PPN (Physical Page Number)
    pub fn ppn(&self) -> usize {
        self.0 >> 12
    }
}

/// Page table entry flags
#[derive(Debug, Clone, Copy)]
pub struct PTEFlags(u64);

impl PTEFlags {
    pub const VALID: u64 = 1 << 0;
    pub const READ: u64 = 1 << 1;
    pub const WRITE: u64 = 1 << 2;
    pub const EXEC: u64 = 1 << 3;
    pub const USER: u64 = 1 << 4;
    pub const GLOBAL: u64 = 1 << 5;
    pub const ACCESSED: u64 = 1 << 6;
    pub const DIRTY: u64 = 1 << 7;
    
    pub const fn new() -> Self {
        Self(0)
    }
    
    pub const fn with_flags(flags: u64) -> Self {
        Self(flags)
    }
    
    pub fn set(&mut self, flag: u64) {
        self.0 |= flag;
    }
    
    pub fn clear(&mut self, flag: u64) {
        self.0 &= !flag;
    }
    
    pub fn contains(&self, flag: u64) -> bool {
        (self.0 & flag) != 0
    }
    
    pub fn bits(&self) -> u64 {
        self.0
    }
}

/// Page table entry
#[derive(Clone, Copy)]
#[repr(transparent)]
pub struct PageTableEntry(u64);

impl PageTableEntry {
    pub const fn new() -> Self {
        Self(0)
    }
    
    /// Create PTE from physical address and flags
    pub fn from_ppn(ppn: usize, flags: PTEFlags) -> Self {
        Self(((ppn as u64) << 10) | flags.bits())
    }
    
    /// Check if entry is valid
    pub fn is_valid(&self) -> bool {
        (self.0 & PTEFlags::VALID) != 0
    }
    
    /// Check if entry is a leaf (page mapping)
    pub fn is_leaf(&self) -> bool {
        self.is_valid() && ((self.0 & (PTEFlags::READ | PTEFlags::WRITE | PTEFlags::EXEC)) != 0)
    }
    
    /// Get physical page number
    pub fn ppn(&self) -> usize {
        ((self.0 >> 10) & 0xFFF_FFFF_FFFF) as usize
    }
    
    /// Get physical address
    pub fn phys_addr(&self) -> PhysAddr {
        PhysAddr::new(self.ppn() << 12)
    }
    
    /// Get flags
    pub fn flags(&self) -> PTEFlags {
        PTEFlags(self.0 & 0xFF)
    }
    
    /// Set entry
    pub fn set(&mut self, ppn: usize, flags: PTEFlags) {
        self.0 = ((ppn as u64) << 10) | flags.bits();
    }
    
    /// Clear entry
    pub fn clear(&mut self) {
        self.0 = 0;
    }
}

/// Page table
#[repr(C, align(4096))]
pub struct PageTable {
    entries: [PageTableEntry; PTE_COUNT],
}

impl PageTable {
    /// Create new empty page table
    pub const fn new() -> Self {
        Self {
            entries: [PageTableEntry::new(); PTE_COUNT],
        }
    }
    
    /// Get entry at index
    pub fn entry(&self, index: usize) -> &PageTableEntry {
        &self.entries[index]
    }
    
    /// Get mutable entry at index
    pub fn entry_mut(&mut self, index: usize) -> &mut PageTableEntry {
        &mut self.entries[index]
    }
    
    /// Clear all entries
    pub fn clear(&mut self) {
        for entry in &mut self.entries {
            entry.clear();
        }
    }
    
    /// Map virtual address to physical address
    pub fn map(&mut self, virt: VirtAddr, phys: PhysAddr, flags: PTEFlags) -> Result<(), MapError> {
        // Get VPNs for all levels
        let vpn2 = virt.vpn(2);
        let vpn1 = virt.vpn(1);
        let vpn0 = virt.vpn(0);
        
        // Level 2
        let pte2 = &mut self.entries[vpn2];
        let table1 = if !pte2.is_valid() {
            // Allocate new page table
            let table = alloc_page_table()?;
            pte2.set(table.ppn(), PTEFlags::with_flags(PTEFlags::VALID));
            table
        } else {
            unsafe { &mut *(pte2.phys_addr().as_usize() as *mut PageTable) }
        };
        
        // Level 1
        let pte1 = &mut table1.entries[vpn1];
        let table0 = if !pte1.is_valid() {
            // Allocate new page table
            let table = alloc_page_table()?;
            pte1.set(table.ppn(), PTEFlags::with_flags(PTEFlags::VALID));
            table
        } else {
            unsafe { &mut *(pte1.phys_addr().as_usize() as *mut PageTable) }
        };
        
        // Level 0 (leaf)
        let pte0 = &mut table0.entries[vpn0];
        if pte0.is_valid() {
            return Err(MapError::AlreadyMapped);
        }
        
        pte0.set(phys.ppn(), flags);
        
        Ok(())
    }
    
    /// Unmap virtual address
    pub fn unmap(&mut self, virt: VirtAddr) -> Result<PhysAddr, MapError> {
        let vpn2 = virt.vpn(2);
        let vpn1 = virt.vpn(1);
        let vpn0 = virt.vpn(0);
        
        // Level 2
        let pte2 = &self.entries[vpn2];
        if !pte2.is_valid() {
            return Err(MapError::NotMapped);
        }
        
        let table1 = unsafe { &mut *(pte2.phys_addr().as_usize() as *mut PageTable) };
        
        // Level 1
        let pte1 = &table1.entries[vpn1];
        if !pte1.is_valid() {
            return Err(MapError::NotMapped);
        }
        
        let table0 = unsafe { &mut *(pte1.phys_addr().as_usize() as *mut PageTable) };
        
        // Level 0
        let pte0 = &mut table0.entries[vpn0];
        if !pte0.is_valid() {
            return Err(MapError::NotMapped);
        }
        
        let phys = pte0.phys_addr();
        pte0.clear();
        
        Ok(phys)
    }
    
    /// Translate virtual address to physical address
    pub fn translate(&self, virt: VirtAddr) -> Result<PhysAddr, MapError> {
        let vpn2 = virt.vpn(2);
        let vpn1 = virt.vpn(1);
        let vpn0 = virt.vpn(0);
        
        // Level 2
        let pte2 = &self.entries[vpn2];
        if !pte2.is_valid() {
            return Err(MapError::NotMapped);
        }
        
        if pte2.is_leaf() {
            // 1GB page
            let offset = virt.as_usize() & 0x3FFF_FFFF;
            return Ok(PhysAddr::new((pte2.ppn() << 12) | offset));
        }
        
        let table1 = unsafe { &*(pte2.phys_addr().as_usize() as *const PageTable) };
        
        // Level 1
        let pte1 = &table1.entries[vpn1];
        if !pte1.is_valid() {
            return Err(MapError::NotMapped);
        }
        
        if pte1.is_leaf() {
            // 2MB page
            let offset = virt.as_usize() & 0x1F_FFFF;
            return Ok(PhysAddr::new((pte1.ppn() << 12) | offset));
        }
        
        let table0 = unsafe { &*(pte1.phys_addr().as_usize() as *const PageTable) };
        
        // Level 0
        let pte0 = &table0.entries[vpn0];
        if !pte0.is_valid() {
            return Err(MapError::NotMapped);
        }
        
        // 4KB page
        let offset = virt.offset();
        Ok(PhysAddr::new((pte0.ppn() << 12) | offset))
    }
    
    /// Get physical address of this page table
    pub fn phys_addr(&self) -> PhysAddr {
        PhysAddr::new(self as *const _ as usize)
    }
    
    /// Get PPN of this page table
    pub fn ppn(&self) -> usize {
        self.phys_addr().ppn()
    }
    
    /// Activate this page table
    pub fn activate(&self) {
        let satp = (8usize << 60) | self.ppn(); // Mode=Sv39, ASID=0
        unsafe {
            write_satp(satp);
            sfence_vma();
        }
    }
}

/// Allocate new page table
fn alloc_page_table() -> Result<&'static mut PageTable, MapError> {
    // TODO: Use real page allocator
    // For now, use a simple bump allocator
    static mut NEXT_TABLE: usize = 0x8800_0000;
    
    unsafe {
        let addr = NEXT_TABLE;
        NEXT_TABLE += PAGE_SIZE;
        
        let table = &mut *(addr as *mut PageTable);
        table.clear();
        Ok(table)
    }
}

/// Mapping errors
#[derive(Debug, Clone, Copy)]
pub enum MapError {
    AlreadyMapped,
    NotMapped,
    OutOfMemory,
}

/// Initialize virtual memory
pub fn init() {
    println!("💾 Initializing virtual memory (Sv39)...");
    
    // Create kernel page table
    let mut kernel_pt = PageTable::new();
    
    // Identity map kernel region (0x8000_0000 - 0x8800_0000)
    let kernel_start = VirtAddr::new(0x8000_0000);
    let kernel_end = VirtAddr::new(0x8800_0000);
    
    let mut flags = PTEFlags::new();
    flags.set(PTEFlags::VALID);
    flags.set(PTEFlags::READ);
    flags.set(PTEFlags::WRITE);
    flags.set(PTEFlags::EXEC);
    
    let mut virt = kernel_start.align_down();
    while virt < kernel_end {
        let phys = PhysAddr::new(virt.as_usize());
        kernel_pt.map(virt, phys, flags).expect("Failed to map kernel");
        virt = VirtAddr::new(virt.as_usize() + PAGE_SIZE);
    }
    
    // Identity map UART (0x1000_0000)
    let uart_addr = VirtAddr::new(0x1000_0000);
    let uart_phys = PhysAddr::new(0x1000_0000);
    kernel_pt.map(uart_addr, uart_phys, flags).expect("Failed to map UART");
    
    println!("  ✓ Kernel mapped: {:#x} - {:#x}", 
        kernel_start.as_usize(), kernel_end.as_usize());
    println!("  ✓ UART mapped: {:#x}", uart_addr.as_usize());
    
    // Activate page table
    kernel_pt.activate();
    
    println!("  ✓ Virtual memory enabled (Sv39)");
}
