//! SurakshaOS Kernel — v0.2.0
//! Entry point after RISC-V boot assembly.
//!
//! # Boot Flow
//!
//! 1. `_start` (boot.S): park harts, set stack, clear BSS
//! 2. `kernel_main()` (M-mode): init PMA, heap, VMM (Sv39 paging)
//! 3. `kernel_main()` returns → boot.S: medeleg, mideleg, mstatus.MPP=S, mret → S-mode
//! 4. `_s_mode_entry` (boot.S): set stvec, enable SSI, jump to S-mode kernel
//! 5. `kernel_main_s_mode()`: privilege verification, S-mode trap init, VFS, init, shell

#![no_std]
#![no_main]
#![feature(alloc_error_handler)]

extern crate alloc;

use core::arch::global_asm;

// Include RISC-V boot assembly (sets up stack, clears BSS, handles M→S transition)
global_asm!(include_str!("boot.S"));

// ─── kernel modules ───────────────────────────────────────────────────────────
pub mod arch; // RISC-V arch init, trap vectors (M-mode + S-mode)
pub mod console; // UART driver + print!/println! macros
pub mod fs; // VFS + in-memory filesystem
pub mod init;
pub mod memory; // Kernel heap allocator + PMA integration
pub mod pma; // Physical Memory Allocator (bitmap-based)
pub mod process; // Process table + scheduler stubs
pub mod shell; // Interactive sursh shell
pub mod vmm; // Virtual Memory Manager (Sv39 page tables) // Init system (PID 1)

use core::panic::PanicInfo;

// ─── M-mode kernel entry point ───────────────────────────────────────────────

/// Called from boot.S in M-mode after BSS is cleared and stack is set up.
///
/// Initializes: PMA, kernel heap, VMM (Sv39 paging).
/// After returning, boot.S switches to S-mode via medeleg/mideleg + mret.
///
/// The delegation CSRs are read here (while still in M-mode, where they are
/// fully readable) and reported to the S-mode continuation for verification.
#[no_mangle]
pub extern "C" fn kernel_main(hart_id: usize, dtb_ptr: usize) {
    // 1. Initialise the UART (console is usable after this point)
    //    The NS16550A is already configured by QEMU; we just start using it.

    // 2. Initialise physical memory allocator (marks reserved regions,
    //    makes free frames available for allocation)
    pma::init();

    // 3. Initialise kernel heap allocator (for dynamic allocations)
    memory::init_heap();

    // 4. Set up Sv39 page tables and enable virtual memory
    //    Identity-maps lower 1 GiB (MMIO) and the kernel region with RWX + A/D.
    //    After this point, all memory access goes through page tables.
    vmm::init();

    // 5. Print M-mode status
    println!();
    println!("  suraksha-kernel booting on hart {} (M-mode)", hart_id);
    if dtb_ptr != 0 {
        println!("  DTB at {:#x}", dtb_ptr);
    }

    // 6. Capture delegation CSRs before leaving M-mode (they are only fully
    //    readable in M-mode) so the S-mode stage can verify them.
    let medeleg = unsafe { arch::read_medeleg() };
    let mideleg = unsafe { arch::read_mideleg() };
    arch::store_delegation_values(medeleg, mideleg);

    println!("  [boot] M-mode init complete — transitioning to S-mode...");

    // 7. Return to boot.S, which will:
    //    - Configure medeleg/mideleg (delegate exceptions/interrupts to S-mode)
    //    - Set mstatus.MPP = Supervisor, MPIE = 1, FS = Dirty
    //    - Set mepc = _s_mode_entry
    //    - Execute mret (enters S-mode)
    //    Then _s_mode_entry in boot.S sets stvec and jumps to kernel_main_s_mode()
}

// ─── S-mode kernel entry point ───────────────────────────────────────────────

/// Called from boot.S after M→S transition. Runs in S-mode.
///
/// Initializes: S-mode trap handler, VFS, init system, and shell.
/// This function diverges (`-> !`) — the shell loop never returns.
#[no_mangle]
pub extern "C" fn kernel_main_s_mode() -> ! {
    // 1. Set up S-mode trap handler (stvec, sie)
    arch::trap_init();

    // 2. Initialise the VFS root
    fs::vfs_init();

    // 3. Print S-mode status
    println!();
    println!("  suraksha-kernel running in S-mode");
    println!("  [boot] S-mode trap handler configured");

    // 4. Verify the M→S transition using real CSR state
    arch::print_privilege_verification();

    // 5. Hand off to init (PID 1) — never returns
    let mut init = init::InitSystem::new();
    init.run()
}

// ─── panic handler ────────────────────────────────────────────────────────────

#[panic_handler]
fn panic(info: &PanicInfo) -> ! {
    println!();
    println!("╔══════════════════════════════════════╗");
    println!("║        KERNEL PANIC                  ║");
    println!("╚══════════════════════════════════════╝");
    if let Some(loc) = info.location() {
        println!("  at {}:{}:{}", loc.file(), loc.line(), loc.column());
    }
    println!("  {}", info);
    // Halt all harts
    loop {
        unsafe {
            core::arch::asm!("wfi", options(nomem, nostack));
        }
    }
}

// ─── OOM handler ─────────────────────────────────────────────────────────────

#[alloc_error_handler]
fn alloc_error(layout: core::alloc::Layout) -> ! {
    panic!(
        "out of memory: requested {} bytes align {}",
        layout.size(),
        layout.align()
    );
}
