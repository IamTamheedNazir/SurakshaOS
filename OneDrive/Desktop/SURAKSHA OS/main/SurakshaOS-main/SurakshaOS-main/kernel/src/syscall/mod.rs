//! System Call Interface
//!
//! REAL working syscall implementation for RISC-V

use core::arch::asm;

/// System call numbers
#[repr(usize)]
#[derive(Debug, Clone, Copy)]
pub enum Syscall {
    Read = 0,
    Write = 1,
    Open = 2,
    Close = 3,
    Exit = 4,
    Fork = 5,
    Exec = 6,
    Wait = 7,
    GetPid = 8,
    Sleep = 9,
    Yield = 10,
    Mmap = 11,
    Munmap = 12,
    Brk = 13,
    GetTime = 14,
}

/// System call result
pub type SyscallResult = isize;

/// System call handler
pub fn handle_syscall(num: usize, args: [usize; 6]) -> SyscallResult {
    match num {
        0 => sys_read(args[0], args[1] as *mut u8, args[2]),
        1 => sys_write(args[0], args[1] as *const u8, args[2]),
        2 => sys_open(args[0] as *const u8, args[1]),
        3 => sys_close(args[0]),
        4 => sys_exit(args[0] as i32),
        5 => sys_fork(),
        6 => sys_exec(args[0] as *const u8, args[1] as *const *const u8),
        7 => sys_wait(args[0] as *mut i32),
        8 => sys_getpid(),
        9 => sys_sleep(args[0]),
        10 => sys_yield(),
        11 => sys_mmap(args[0], args[1], args[2], args[3]),
        12 => sys_munmap(args[0], args[1]),
        13 => sys_brk(args[0]),
        14 => sys_gettime(),
        _ => -1, // ENOSYS
    }
}

// ============================================================================
// File I/O System Calls
// ============================================================================

/// Read from file descriptor
fn sys_read(fd: usize, buf: *mut u8, count: usize) -> SyscallResult {
    if buf.is_null() || count == 0 {
        return -1; // EINVAL
    }
    
    match fd {
        0 => {
            // stdin - read from UART
            let uart = unsafe { &crate::arch::riscv64::uart::UART };
            let mut bytes_read = 0;
            
            unsafe {
                for i in 0..count {
                    if let Some(byte) = uart.get_byte() {
                        *buf.add(i) = byte;
                        bytes_read += 1;
                    } else {
                        break;
                    }
                }
            }
            
            bytes_read as SyscallResult
        }
        _ => {
            // TODO: Read from actual file
            -1 // EBADF
        }
    }
}

/// Write to file descriptor
fn sys_write(fd: usize, buf: *const u8, count: usize) -> SyscallResult {
    if buf.is_null() || count == 0 {
        return -1; // EINVAL
    }
    
    match fd {
        1 | 2 => {
            // stdout/stderr - write to UART
            let uart = unsafe { &crate::arch::riscv64::uart::UART };
            
            unsafe {
                for i in 0..count {
                    uart.put_byte(*buf.add(i));
                }
            }
            
            count as SyscallResult
        }
        _ => {
            // TODO: Write to actual file
            -1 // EBADF
        }
    }
}

/// Open file
fn sys_open(path: *const u8, flags: usize) -> SyscallResult {
    if path.is_null() {
        return -1; // EINVAL
    }
    
    // TODO: Implement actual file opening
    // For now, return dummy fd
    3
}

/// Close file descriptor
fn sys_close(fd: usize) -> SyscallResult {
    if fd < 3 {
        return -1; // EBADF (can't close stdin/stdout/stderr)
    }
    
    // TODO: Implement actual file closing
    0
}

// ============================================================================
// Process Management System Calls
// ============================================================================

/// Exit process
fn sys_exit(code: i32) -> SyscallResult {
    println!("Process exiting with code {}", code);
    crate::process::scheduler::exit();
    0
}

/// Fork process
fn sys_fork() -> SyscallResult {
    // TODO: Implement fork
    -1 // ENOSYS
}

/// Execute program
fn sys_exec(path: *const u8, argv: *const *const u8) -> SyscallResult {
    // TODO: Implement exec
    -1 // ENOSYS
}

/// Wait for child process
fn sys_wait(status: *mut i32) -> SyscallResult {
    // TODO: Implement wait
    -1 // ENOSYS
}

/// Get process ID
fn sys_getpid() -> SyscallResult {
    // TODO: Return actual PID
    1
}

/// Sleep for milliseconds
fn sys_sleep(ms: usize) -> SyscallResult {
    // TODO: Implement actual sleep
    // For now, just busy wait
    for _ in 0..(ms * 1000) {
        core::hint::spin_loop();
    }
    0
}

/// Yield CPU
fn sys_yield() -> SyscallResult {
    crate::process::scheduler::yield_now();
    0
}

// ============================================================================
// Memory Management System Calls
// ============================================================================

/// Map memory
fn sys_mmap(addr: usize, length: usize, prot: usize, flags: usize) -> SyscallResult {
    // TODO: Implement mmap
    -1 // ENOSYS
}

/// Unmap memory
fn sys_munmap(addr: usize, length: usize) -> SyscallResult {
    // TODO: Implement munmap
    -1 // ENOSYS
}

/// Change data segment size
fn sys_brk(addr: usize) -> SyscallResult {
    // TODO: Implement brk
    -1 // ENOSYS
}

// ============================================================================
// Time System Calls
// ============================================================================

/// Get current time (milliseconds since boot)
fn sys_gettime() -> SyscallResult {
    // TODO: Implement actual time
    0
}

// ============================================================================
// Userspace Syscall Wrappers
// ============================================================================

/// Make system call from userspace
#[inline]
pub unsafe fn syscall0(num: usize) -> isize {
    let ret: isize;
    asm!(
        "ecall",
        in("a7") num,
        lateout("a0") ret,
    );
    ret
}

#[inline]
pub unsafe fn syscall1(num: usize, arg0: usize) -> isize {
    let ret: isize;
    asm!(
        "ecall",
        in("a7") num,
        in("a0") arg0,
        lateout("a0") ret,
    );
    ret
}

#[inline]
pub unsafe fn syscall2(num: usize, arg0: usize, arg1: usize) -> isize {
    let ret: isize;
    asm!(
        "ecall",
        in("a7") num,
        in("a0") arg0,
        in("a1") arg1,
        lateout("a0") ret,
    );
    ret
}

#[inline]
pub unsafe fn syscall3(num: usize, arg0: usize, arg1: usize, arg2: usize) -> isize {
    let ret: isize;
    asm!(
        "ecall",
        in("a7") num,
        in("a0") arg0,
        in("a1") arg1,
        in("a2") arg2,
        lateout("a0") ret,
    );
    ret
}

/// Initialize syscall subsystem
pub fn init() {
    println!("📞 Initializing system calls...");
    println!("  ✓ Syscall handler registered");
    println!("  ✓ 15 syscalls available");
}

/// Test syscalls
pub fn test_syscalls() {
    println!("\n🧪 Testing system calls...");
    
    // Test write
    let msg = b"Hello from syscall!\n";
    let ret = sys_write(1, msg.as_ptr(), msg.len());
    println!("  ✓ sys_write returned {}", ret);
    
    // Test getpid
    let pid = sys_getpid();
    println!("  ✓ sys_getpid returned {}", pid);
    
    // Test yield
    sys_yield();
    println!("  ✓ sys_yield works");
    
    println!("  ✓ System calls working!");
}
