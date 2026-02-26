//! Process Context
//!
//! REAL context switching implementation for RISC-V

use core::arch::asm;

/// Process context (saved registers)
#[repr(C)]
#[derive(Debug, Clone, Copy)]
pub struct Context {
    /// Return address (ra)
    pub ra: usize,
    /// Stack pointer (sp)
    pub sp: usize,
    /// Saved registers (s0-s11)
    pub s: [usize; 12],
}

impl Context {
    /// Create new empty context
    pub const fn new() -> Self {
        Self {
            ra: 0,
            sp: 0,
            s: [0; 12],
        }
    }
    
    /// Create context for new process
    pub fn new_process(entry: usize, stack_top: usize) -> Self {
        Self {
            ra: entry,      // Return to entry point
            sp: stack_top,  // Set stack pointer
            s: [0; 12],     // Clear saved registers
        }
    }
}

/// Switch context from old to new
///
/// This is the REAL context switch implementation!
#[naked]
pub unsafe extern "C" fn switch_context(old: *mut Context, new: *const Context) {
    asm!(
        // Save old context
        "sd ra, 0(a0)",      // Save return address
        "sd sp, 8(a0)",      // Save stack pointer
        "sd s0, 16(a0)",     // Save s0
        "sd s1, 24(a0)",     // Save s1
        "sd s2, 32(a0)",     // Save s2
        "sd s3, 40(a0)",     // Save s3
        "sd s4, 48(a0)",     // Save s4
        "sd s5, 56(a0)",     // Save s5
        "sd s6, 64(a0)",     // Save s6
        "sd s7, 72(a0)",     // Save s7
        "sd s8, 80(a0)",     // Save s8
        "sd s9, 88(a0)",     // Save s9
        "sd s10, 96(a0)",    // Save s10
        "sd s11, 104(a0)",   // Save s11
        
        // Load new context
        "ld ra, 0(a1)",      // Load return address
        "ld sp, 8(a1)",      // Load stack pointer
        "ld s0, 16(a1)",     // Load s0
        "ld s1, 24(a1)",     // Load s1
        "ld s2, 32(a1)",     // Load s2
        "ld s3, 40(a1)",     // Load s3
        "ld s4, 48(a1)",     // Load s4
        "ld s5, 56(a1)",     // Load s5
        "ld s6, 64(a1)",     // Load s6
        "ld s7, 72(a1)",     // Load s7
        "ld s8, 80(a1)",     // Load s8
        "ld s9, 88(a1)",     // Load s9
        "ld s10, 96(a1)",    // Load s10
        "ld s11, 104(a1)",   // Load s11
        
        "ret",               // Return to new context
        options(noreturn)
    );
}

/// Test context switching
pub fn test_context_switch() {
    println!("\n🧪 Testing context switching...");
    
    static mut STACK1: [u8; 4096] = [0; 4096];
    static mut STACK2: [u8; 4096] = [0; 4096];
    static mut CONTEXT1: Context = Context::new();
    static mut CONTEXT2: Context = Context::new();
    static mut SWITCH_COUNT: usize = 0;
    
    extern "C" fn task1() {
        loop {
            unsafe {
                SWITCH_COUNT += 1;
                println!("  Task 1 running (switch #{})", SWITCH_COUNT);
                
                if SWITCH_COUNT >= 4 {
                    println!("  ✓ Context switching works!");
                    return;
                }
                
                // Switch to task 2
                switch_context(&mut CONTEXT1, &CONTEXT2);
            }
        }
    }
    
    extern "C" fn task2() {
        loop {
            unsafe {
                SWITCH_COUNT += 1;
                println!("  Task 2 running (switch #{})", SWITCH_COUNT);
                
                // Switch back to task 1
                switch_context(&mut CONTEXT2, &CONTEXT1);
            }
        }
    }
    
    unsafe {
        // Set up task contexts
        CONTEXT1 = Context::new_process(
            task1 as usize,
            STACK1.as_ptr() as usize + STACK1.len()
        );
        
        CONTEXT2 = Context::new_process(
            task2 as usize,
            STACK2.as_ptr() as usize + STACK2.len()
        );
        
        // Start task 1
        let mut dummy = Context::new();
        switch_context(&mut dummy, &CONTEXT1);
    }
}
