//! Virtual Memory Support
//!
//! RISC-V virtual memory CSR access

use core::arch::asm;

/// Read SATP register
#[inline]
pub fn satp() -> usize {
    let value: usize;
    unsafe {
        asm!("csrr {}, satp", out(reg) value);
    }
    value
}

/// Write SATP register
#[inline]
pub fn write_satp(value: usize) {
    unsafe {
        asm!("csrw satp, {}", in(reg) value);
    }
}

/// Flush entire TLB
#[inline]
pub fn sfence_vma() {
    unsafe {
        asm!("sfence.vma");
    }
}

/// Flush TLB for specific virtual address
#[inline]
pub fn sfence_vma_addr(addr: usize) {
    unsafe {
        asm!("sfence.vma {}, zero", in(reg) addr);
    }
}

/// Flush TLB for specific ASID
#[inline]
pub fn sfence_vma_asid(asid: usize) {
    unsafe {
        asm!("sfence.vma zero, {}", in(reg) asid);
    }
}
