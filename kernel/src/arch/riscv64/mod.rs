//! RISC-V Architecture Support
//!
//! REAL hardware abstraction for RISC-V 64-bit

pub mod uart;

use core::arch::asm;

/// Read mhartid CSR (hardware thread ID)
#[inline]
pub fn mhartid() -> usize {
    let id: usize;
    unsafe {
        asm!("csrr {}, mhartid", out(reg) id);
    }
    id
}

/// Read mstatus CSR
#[inline]
pub fn mstatus() -> usize {
    let status: usize;
    unsafe {
        asm!("csrr {}, mstatus", out(reg) status);
    }
    status
}

/// Write mstatus CSR
#[inline]
pub fn write_mstatus(status: usize) {
    unsafe {
        asm!("csrw mstatus, {}", in(reg) status);
    }
}

/// Read mcause CSR (trap cause)
#[inline]
pub fn mcause() -> usize {
    let cause: usize;
    unsafe {
        asm!("csrr {}, mcause", out(reg) cause);
    }
    cause
}

/// Read mepc CSR (exception program counter)
#[inline]
pub fn mepc() -> usize {
    let epc: usize;
    unsafe {
        asm!("csrr {}, mepc", out(reg) epc);
    }
    epc
}

/// Write mepc CSR
#[inline]
pub fn write_mepc(epc: usize) {
    unsafe {
        asm!("csrw mepc, {}", in(reg) epc);
    }
}

/// Read mtval CSR (trap value)
#[inline]
pub fn mtval() -> usize {
    let val: usize;
    unsafe {
        asm!("csrr {}, mtval", out(reg) val);
    }
    val
}

/// Wait for interrupt
#[inline]
pub fn wfi() {
    unsafe {
        asm!("wfi");
    }
}

/// Memory fence
#[inline]
pub fn fence() {
    unsafe {
        asm!("fence");
    }
}

/// Instruction fence
#[inline]
pub fn fence_i() {
    unsafe {
        asm!("fence.i");
    }
}

/// Supervisor fence for virtual memory
#[inline]
pub fn sfence_vma() {
    unsafe {
        asm!("sfence.vma");
    }
}

/// Initialize architecture-specific features
pub fn init() {
    uart::init();
    println!("RISC-V architecture initialized");
    println!("Hart ID: {}", mhartid());
}
