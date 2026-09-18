//! SurakshaOS Kernel — v0.2.0
//! Entry point after RISC-V boot assembly.
//! Initialises hardware, memory, scheduler, then launches init.

#![no_std]
#![no_main]
#![feature(alloc_error_handler)]

extern crate alloc;

use core::arch::global_asm;

// Include RISC-V boot assembly (sets up stack, clears BSS, calls kernel_main)
global_asm!(include_str!("boot.S"));

// ─── kernel modules ───────────────────────────────────────────────────────────
pub mod console;   // UART driver + print!/println! macros
pub mod pma;       // Physical Memory Allocator (bitmap-based)
pub mod memory;    // Kernel heap allocator + PMA integration
pub mod arch;      // RISC-V arch init, trap vector (existing)
pub mod process;   // Process table + scheduler stubs
pub mod fs;        // VFS + in-memory filesystem
pub mod shell;     // Interactive sursh shell
pub mod init;      // Init system (PID 1)

use core::panic::PanicInfo;

// ─── kernel entry point ───────────────────────────────────────────────────────

/// Called from boot.S after BSS is cleared, stack is set up,
/// and we are running in Rust with a 64 MB heap available.
#[no_mangle]
pub extern "C" fn kernel_main(hart_id: usize, dtb_ptr: usize) -> ! {
    // 1. Initialise the UART (console is usable after this point)
    //    The NS16550A is already configured by QEMU; we just start using it.

    // 2. Initialise physical memory allocator (marks reserved regions,
    //    makes free frames available for allocation)
    pma::init();

    // 3. Initialise kernel heap allocator (for dynamic allocations)
    memory::init_heap();

    // 4. Set up RISC-V trap/interrupt vector
    arch::trap_init();

    // 5. Initialise the VFS root
    fs::vfs_init();

    // 6. Print welcome line (before full init banner)
    println!("");
    println!("  suraksha-kernel booting on hart {}", hart_id);
    if dtb_ptr != 0 {
        println!("  DTB at {:#x}", dtb_ptr);
    }

    // 7. Hand off to init (PID 1) — never returns
    let mut init = init::InitSystem::new();
    init.run()
}

// ─── panic handler ────────────────────────────────────────────────────────────

#[panic_handler]
fn panic(info: &PanicInfo) -> ! {
    println!("");
    println!("╔══════════════════════════════════════╗");
    println!("║        KERNEL PANIC                  ║");
    println!("╚══════════════════════════════════════╝");
    if let Some(loc) = info.location() {
        println!("  at {}:{}:{}", loc.file(), loc.line(), loc.column());
    }
    println!("  {}", info);
    // Halt all harts
    loop {
        unsafe { core::arch::asm!("wfi", options(nomem, nostack)); }
    }
}

// ─── OOM handler ─────────────────────────────────────────────────────────────

#[alloc_error_handler]
fn alloc_error(layout: core::alloc::Layout) -> ! {
    panic!("out of memory: requested {} bytes align {}", layout.size(), layout.align());
}
