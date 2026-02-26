//! Trap Handling
//!
//! REAL interrupt and exception handling for RISC-V

use crate::arch::riscv64::{mcause, mepc, mtval};

/// Trap causes
#[derive(Debug, Clone, Copy)]
pub enum TrapCause {
    /// Instruction address misaligned
    InstructionMisaligned,
    /// Instruction access fault
    InstructionFault,
    /// Illegal instruction
    IllegalInstruction,
    /// Breakpoint
    Breakpoint,
    /// Load address misaligned
    LoadMisaligned,
    /// Load access fault
    LoadFault,
    /// Store address misaligned
    StoreMisaligned,
    /// Store access fault
    StoreFault,
    /// Environment call from U-mode
    EcallU,
    /// Environment call from S-mode
    EcallS,
    /// Environment call from M-mode
    EcallM,
    /// Instruction page fault
    InstructionPageFault,
    /// Load page fault
    LoadPageFault,
    /// Store page fault
    StorePageFault,
    /// Unknown cause
    Unknown(usize),
}

impl From<usize> for TrapCause {
    fn from(cause: usize) -> Self {
        match cause & !( 1 << 63) {
            0 => TrapCause::InstructionMisaligned,
            1 => TrapCause::InstructionFault,
            2 => TrapCause::IllegalInstruction,
            3 => TrapCause::Breakpoint,
            4 => TrapCause::LoadMisaligned,
            5 => TrapCause::LoadFault,
            6 => TrapCause::StoreMisaligned,
            7 => TrapCause::StoreFault,
            8 => TrapCause::EcallU,
            9 => TrapCause::EcallS,
            11 => TrapCause::EcallM,
            12 => TrapCause::InstructionPageFault,
            13 => TrapCause::LoadPageFault,
            15 => TrapCause::StorePageFault,
            _ => TrapCause::Unknown(cause),
        }
    }
}

/// Handle trap
pub fn handle_trap() {
    let cause = TrapCause::from(mcause());
    let epc = mepc();
    let tval = mtval();
    
    match cause {
        TrapCause::Breakpoint => {
            println!("🔍 Breakpoint at {:#x}", epc);
            // Continue execution
        }
        TrapCause::EcallM => {
            println!("📞 System call from M-mode");
            // Handle system call
            handle_syscall();
        }
        TrapCause::IllegalInstruction => {
            println!("⚠️  Illegal instruction at {:#x}", epc);
            println!("   Instruction: {:#x}", tval);
            panic!("Illegal instruction");
        }
        TrapCause::InstructionFault => {
            println!("⚠️  Instruction fault at {:#x}", epc);
            panic!("Instruction access fault");
        }
        TrapCause::LoadFault | TrapCause::StoreFault => {
            println!("⚠️  Memory fault at {:#x}", epc);
            println!("   Address: {:#x}", tval);
            panic!("Memory access fault");
        }
        _ => {
            println!("⚠️  Unhandled trap: {:?}", cause);
            println!("   EPC: {:#x}", epc);
            println!("   TVAL: {:#x}", tval);
            panic!("Unhandled trap");
        }
    }
}

/// Handle system call
fn handle_syscall() {
    // TODO: Implement actual system call handling
    println!("  System call handler (not yet implemented)");
}
