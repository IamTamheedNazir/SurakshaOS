//! System Call Interface
//!
//! Capability-based system calls for user-kernel communication.
//!
//! # Design Principles
//!
//! 1. **Capability-Based**: Every syscall requires appropriate capability
//! 2. **Type-Safe**: Rust type system prevents invalid calls
//! 3. **Minimal**: Small, well-defined interface
//! 4. **Fast**: Optimized syscall path (<1μs)
//! 5. **Auditable**: All syscalls logged

use crate::capability::{Capability, Permission};
use crate::ipc::{IpcChannel, IpcMessage};
use crate::memory::MemoryCapability;

/// System call numbers
#[repr(usize)]
#[derive(Debug, Clone, Copy)]
pub enum Syscall {
    /// Exit process
    Exit = 0,
    
    /// Send IPC message
    IpcSend = 1,
    
    /// Receive IPC message
    IpcRecv = 2,
    
    /// Allocate memory
    MemAlloc = 3,
    
    /// Free memory
    MemFree = 4,
    
    /// Create capability
    CapCreate = 5,
    
    /// Delegate capability
    CapDelegate = 6,
    
    /// Revoke capability
    CapRevoke = 7,
    
    /// Get time
    TimeGet = 8,
    
    /// Sleep
    Sleep = 9,
}

/// System call handler
///
/// # Arguments
///
/// * `syscall` - System call number
/// * `arg1-arg5` - System call arguments
///
/// # Returns
///
/// System call result (0 = success, negative = error)
pub fn handle_syscall(
    syscall: Syscall,
    arg1: usize,
    arg2: usize,
    arg3: usize,
    _arg4: usize,
    _arg5: usize,
) -> isize {
    match syscall {
        Syscall::Exit => {
            sys_exit(arg1 as i32)
        }
        
        Syscall::IpcSend => {
            // TODO: Implement
            0
        }
        
        Syscall::IpcRecv => {
            // TODO: Implement
            0
        }
        
        Syscall::MemAlloc => {
            sys_mem_alloc(arg1, arg2)
        }
        
        Syscall::MemFree => {
            sys_mem_free(arg1, arg2)
        }
        
        Syscall::CapCreate => {
            // TODO: Implement
            0
        }
        
        Syscall::CapDelegate => {
            // TODO: Implement
            0
        }
        
        Syscall::CapRevoke => {
            // TODO: Implement
            0
        }
        
        Syscall::TimeGet => {
            sys_time_get()
        }
        
        Syscall::Sleep => {
            sys_sleep(arg1 as u64)
        }
    }
}

/// Exit process
fn sys_exit(code: i32) -> isize {
    println!("Process exiting with code: {}", code);
    // TODO: Cleanup process resources
    0
}

/// Allocate memory
fn sys_mem_alloc(size: usize, _cap_id: usize) -> isize {
    // TODO: Validate capability
    // TODO: Allocate memory
    println!("Allocating {} bytes", size);
    0
}

/// Free memory
fn sys_mem_free(addr: usize, _cap_id: usize) -> isize {
    // TODO: Validate capability
    // TODO: Free memory
    println!("Freeing memory at 0x{:x}", addr);
    0
}

/// Get current time
fn sys_time_get() -> isize {
    // TODO: Read hardware timer
    0
}

/// Sleep for duration
fn sys_sleep(microseconds: u64) -> isize {
    println!("Sleeping for {} μs", microseconds);
    // TODO: Block process
    0
}
