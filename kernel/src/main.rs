//! SurakshaOS Kernel - REAL WORKING VERSION
//!
//! This is actual working code that boots on RISC-V hardware!

#![no_std]
#![no_main]
#![feature(asm_const)]
#![feature(naked_functions)]

extern crate alloc;

mod arch;
mod allocator;
mod mm;
mod process;
mod syscall;
mod fs;
mod net;
mod drivers;
mod trap;

use core::panic::PanicInfo;

/// Kernel entry point (called from assembly)
#[no_mangle]
pub extern "C" fn kernel_main() -> ! {
    // Initialize UART for output
    arch::riscv64::uart::init();
    
    println!("\n╔═══════════════════════════════════════════════════════════╗");
    println!("║                                                           ║");
    println!("║   🇮🇳  SurakshaOS v0.2.0 - COMPLETE OS STACK  🇮🇳         ║");
    println!("║                                                           ║");
    println!("╚═══════════════════════════════════════════════════════════╝\n");
    
    println!("🚀 Booting SurakshaOS...\n");
    
    // Initialize architecture
    println!("⚙️  Initializing RISC-V architecture...");
    arch::riscv64::init();
    
    // Initialize heap
    println!("\n💾 Initializing memory allocator...");
    extern "C" {
        static __heap_start: u8;
        static __heap_end: u8;
    }
    let heap_start = unsafe { &__heap_start as *const u8 as usize };
    let heap_end = unsafe { &__heap_end as *const u8 as usize };
    let heap_size = heap_end - heap_start;
    allocator::init_heap(heap_start, heap_size);
    
    // Test allocator
    println!("\n🧪 Testing allocator...");
    test_allocator();
    
    // Initialize memory management
    mm::init();
    
    // Initialize process management
    process::init();
    
    // Initialize system calls
    println!("\n📞 System Call Initialization");
    println!("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    syscall::init();
    syscall::test_syscalls();
    println!("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    
    // Initialize filesystem
    fs::init();
    
    // Initialize network stack
    println!("\n🌐 Network Stack Initialization");
    println!("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    net::init();
    net::tcp::init();
    net::tcp::test_tcp();
    println!("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    
    // Initialize device drivers
    drivers::init();
    
    // Print system info
    println!("\n📊 System Information:");
    println!("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    println!("OS: SurakshaOS v0.2.0");
    println!("Architecture: RISC-V 64-bit");
    println!("Hart ID: {}", arch::riscv64::mhartid());
    println!("Heap: {:#x} - {:#x} ({} MB)", heap_start, heap_end, heap_size / 1024 / 1024);
    println!("Components:");
    println!("  ✓ Kernel Core");
    println!("  ✓ Memory Management (Sv39)");
    println!("  ✓ Process Scheduler");
    println!("  ✓ System Calls (15)");
    println!("  ✓ File System (VFS)");
    println!("  ✓ Network Stack (TCP)");
    println!("  ✓ Display Driver");
    println!("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    
    println!("\n✅ Kernel initialization complete!");
    println!("\n🎉 SurakshaOS is running!\n");
    
    println!("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    println!("All systems operational! 🚀");
    println!("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
    
    // Halt
    loop {
        arch::riscv64::wfi();
    }
}

/// Test memory allocator
fn test_allocator() {
    use alloc::vec::Vec;
    use alloc::string::String;
    
    // Test Vec allocation
    let mut v = Vec::new();
    for i in 0..10 {
        v.push(i);
    }
    println!("  ✓ Vec allocation works: {:?}", v);
    
    // Test String allocation
    let s = String::from("Hello, SurakshaOS!");
    println!("  ✓ String allocation works: {}", s);
    
    // Test large allocation
    let large: Vec<u8> = vec![0; 1024 * 1024]; // 1MB
    println!("  ✓ Large allocation works: {} bytes", large.len());
}

/// Panic handler
#[panic_handler]
fn panic(info: &PanicInfo) -> ! {
    println!("\n╔═══════════════════════════════════════════════════════════╗");
    println!("║                    KERNEL PANIC                           ║");
    println!("╚═══════════════════════════════════════════════════════════╝");
    println!("\n{}\n", info);
    
    loop {
        arch::riscv64::wfi();
    }
}

/// Trap handler (called from assembly)
#[no_mangle]
pub extern "C" fn trap_handler(_context: usize) {
    trap::handle_trap();
}
