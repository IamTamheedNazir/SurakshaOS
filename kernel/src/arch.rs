//! SurakshaOS RISC-V Architecture Support
//! Trap/interrupt vector setup, timer management, and basic CSR helpers.
//! Targets M-mode execution (QEMU virt with -bios none).

use core::arch::asm;

// ─── CLINT addresses (QEMU virt machine) ─────────────────────────────────────
const CLINT_MTIMECMP: usize = 0x0200_4000; // hart 0 mtimecmp
const CLINT_MTIME:    usize = 0x0200_BFF8; // mtime register

/// Timer interval in CLINT ticks (~1 s at 10 MHz default timebase)
const TIMER_INTERVAL: u64 = 10_000_000;

// ─── tick counter ────────────────────────────────────────────────────────────
static mut TICK_COUNT: u64 = 0;

/// Number of timer ticks since boot.
pub fn ticks() -> u64 {
    unsafe { core::ptr::read_volatile(&raw const TICK_COUNT) }
}

/// Approximate milliseconds since boot (based on CLINT mtime).
pub fn uptime_millis() -> u64 {
    let mtime = unsafe { core::ptr::read_volatile(CLINT_MTIME as *const u64) };
    // QEMU virt default timebase-frequency = 10 MHz
    mtime / 10_000
}

// ─── trap initialisation ─────────────────────────────────────────────────────

/// Install the trap vector and enable machine-mode timer interrupts.
pub fn trap_init() {
    unsafe {
        // Set mtvec to our trap handler (direct mode)
        let handler = _trap_entry as *const () as usize;
        asm!("csrw mtvec, {}", in(reg) handler);

        // Enable machine-mode interrupts (MIE bit = bit 3 in mstatus)
        asm!("csrsi mstatus, 0x8");

        // Enable machine timer interrupt (MTIE = bit 7 in mie)
        asm!("csrs mie, {}", in(reg) 1usize << 7);

        // Arm the first timer compare
        let mtime = core::ptr::read_volatile(CLINT_MTIME as *const u64);
        core::ptr::write_volatile(CLINT_MTIMECMP as *mut u64, mtime + TIMER_INTERVAL);
    }
}

// ─── trap entry (naked — saves/restores context) ─────────────────────────────

/// Low-level trap entry written as a naked function so we control the
/// prologue/epilogue exactly.  Saves caller-saved registers, calls the
/// Rust handler, then restores and returns via `mret`.
#[unsafe(naked)]
#[no_mangle]
#[link_section = ".text"]
extern "C" fn _trap_entry() {
    core::arch::naked_asm!(
        // Reserve stack space for 16 registers (16 * 8 = 128 bytes)
        "addi sp, sp, -128",
        "sd ra,   0(sp)",
        "sd t0,   8(sp)",
        "sd t1,  16(sp)",
        "sd t2,  24(sp)",
        "sd t3,  32(sp)",
        "sd t4,  40(sp)",
        "sd t5,  48(sp)",
        "sd t6,  56(sp)",
        "sd a0,  64(sp)",
        "sd a1,  72(sp)",
        "sd a2,  80(sp)",
        "sd a3,  88(sp)",
        "sd a4,  96(sp)",
        "sd a5, 104(sp)",
        "sd a6, 112(sp)",
        "sd a7, 120(sp)",

        // Call the Rust handler
        "call {handler}",

        // Restore registers
        "ld ra,   0(sp)",
        "ld t0,   8(sp)",
        "ld t1,  16(sp)",
        "ld t2,  24(sp)",
        "ld t3,  32(sp)",
        "ld t4,  40(sp)",
        "ld t5,  48(sp)",
        "ld t6,  56(sp)",
        "ld a0,  64(sp)",
        "ld a1,  72(sp)",
        "ld a2,  80(sp)",
        "ld a3,  88(sp)",
        "ld a4,  96(sp)",
        "ld a5, 104(sp)",
        "ld a6, 112(sp)",
        "ld a7, 120(sp)",
        "addi sp, sp, 128",

        "mret",
        handler = sym _trap_handler_rust,
    );
}

// ─── Rust-level trap dispatcher ──────────────────────────────────────────────

#[no_mangle]
extern "C" fn _trap_handler_rust() {
    let mcause: usize;
    let mepc: usize;
    unsafe {
        asm!("csrr {}, mcause", out(reg) mcause);
        asm!("csrr {}, mepc",   out(reg) mepc);
    }

    let is_interrupt = (mcause >> 63) != 0;
    let code = mcause & 0x7FFF_FFFF_FFFF_FFFF;

    if is_interrupt {
        match code {
            7 => handle_timer(),   // Machine timer interrupt
            _ => { /* ignore */ }
        }
    } else {
        // Synchronous exception — log and skip the faulting instruction
        crate::println!("  [trap] exception code={} at pc={:#x}", code, mepc);
        unsafe {
            asm!("csrw mepc, {}", in(reg) mepc + 4);
        }
    }
}

/// Reset the CLINT timer for the next tick.
fn handle_timer() {
    unsafe {
        TICK_COUNT += 1;
        let mtime = core::ptr::read_volatile(CLINT_MTIME as *const u64);
        core::ptr::write_volatile(CLINT_MTIMECMP as *mut u64, mtime + TIMER_INTERVAL);
    }
}
