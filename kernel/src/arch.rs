//! SurakshaOS RISC-V Architecture Support
//! Trap/interrupt vector setup, timer management, and basic CSR helpers.
//! Targets M-mode execution (QEMU virt with -bios none).
//!
//! # Safety
//! This module contains direct CSR manipulation and MMIO access.
//! All `unsafe` blocks are documented with their safety invariants.

use core::arch::asm;

// ─── CLINT addresses (QEMU virt machine) ─────────────────────────────────────
const CLINT_MTIMECMP: usize = 0x0200_4000; // hart 0 mtimecmp
const CLINT_MTIME:    usize = 0x0200_BFF8; // mtime register

/// Timer interval in CLINT ticks (~1 s at 10 MHz default timebase)
const TIMER_INTERVAL: u64 = 10_000_000;

// ─── tick counter ────────────────────────────────────────────────────────────

/// Atomic tick counter — safe to read from any context.
static TICK_COUNT: core::sync::atomic::AtomicU64 = core::sync::atomic::AtomicU64::new(0);

/// Number of timer ticks since boot.
pub fn ticks() -> u64 {
    TICK_COUNT.load(core::sync::atomic::Ordering::Relaxed)
}

/// Approximate milliseconds since boot (based on CLINT mtime).
pub fn uptime_millis() -> u64 {
    // SAFETY: CLINT_MTIME is a memory-mapped register at a fixed physical address
    // on QEMU virt. Reading it via volatile load is the correct way to access MMIO.
    let mtime = unsafe { core::ptr::read_volatile(CLINT_MTIME as *const u64) };
    // QEMU virt default timebase-frequency = 10 MHz
    mtime / 10_000
}

// ─── trap initialisation ─────────────────────────────────────────────────────

/// Install the trap vector and enable machine-mode timer interrupts.
///
/// # Safety
/// - Modifies machine-mode CSRs (mtvec, mstatus, mie)
/// - Must be called exactly once during boot, before any interrupts are expected
/// - Sets direct mode (not vectored) for the trap handler
pub fn trap_init() {
    unsafe {
        // Set mtvec to our trap handler (direct mode)
        let handler = _trap_entry as *const () as usize;
        // SAFETY: Writing mtvec to point to our valid trap entry function.
        // Direct mode means all traps go to this single handler.
        asm!("csrw mtvec, {}" , in(reg) handler);

        // Enable machine-mode interrupts (MIE bit = bit 3 in mstatus)
        // SAFETY: Setting MIE enables global machine interrupt handling.
        // Safe to do here as we have set up the trap vector.
        asm!("csrsi mstatus, 0x8");

        // Enable machine timer interrupt (MTIE = bit 7 in mie)
        // SAFETY: Enabling the timer interrupt source. The handler is ready.
        asm!("csrs mie, {}" , in(reg) 1usize << 7);

        // Arm the first timer compare
        // SAFETY: CLINT_MTIMECMP is a memory-mapped register. We write the next
        // compare value to schedule the first timer interrupt.
        let mtime = core::ptr::read_volatile(CLINT_MTIME as *const u64);
        core::ptr::write_volatile(CLINT_MTIMECMP as *mut u64, mtime + TIMER_INTERVAL);
    }
}

// ─── trap entry (naked — saves/restores ALL context) ─────────────────────────

/// Low-level trap entry. Saves ALL 31 general-purpose registers (x1-x31),
/// plus mepc, mstatus, and mcause to the kernel stack before calling the
/// Rust handler, then restores everything and returns via `mret`.
///
/// Register layout on stack (each 8 bytes, 34 slots = 272 bytes):
///
/// ```text
///  sp+0   : ra      (x1)     sp+136: s8  (x24)
///  sp+8   : t0      (x5)     sp+144: s9  (x25)
///  sp+16  : t1      (x6)     sp+152: s10 (x26)
///  sp+24  : t2      (x7)     sp+160: s11 (x27)
///  sp+32  : s0/fp   (x8)     sp+168: t3  (x28)
///  sp+40  : s1      (x9)     sp+176: t4  (x29)
///  sp+48  : a0      (x10)    sp+184: t5  (x30)
///  sp+56  : a1      (x11)    sp+192: t6  (x31)
///  sp+64  : a2      (x12)    sp+200: mepc
///  sp+72  : a3      (x13)    sp+208: mstatus
///  sp+80  : a4      (x14)    sp+216: mcause
///  sp+88  : a5      (x15)    sp+224: (reserved for future use)
///  sp+96  : a6      (x16)    ...
///  sp+104 : a7      (x17)
///  sp+112 : s2      (x18)
///  sp+120 : s3      (x19)
///  sp+128 : s4      (x20)
///  sp+232 : gp      (x3)
///  sp+240 : tp      (x4)
/// ```
#[unsafe(naked)]
#[no_mangle]
#[link_section = ".text"]
extern "C" fn _trap_entry() {
    // Stack frame: 34 * 8 = 272 bytes
    core::arch::naked_asm!(
        // Allocate stack frame
        "addi sp, sp, -272",

        // Save all general-purpose registers
        "sd ra,    0(sp)",
        "sd t0,    8(sp)",
        "sd t1,   16(sp)",
        "sd t2,   24(sp)",
        "sd s0,   32(sp)",  // x8 / fp
        "sd s1,   40(sp)",  // x9
        "sd a0,   48(sp)",  // x10
        "sd a1,   56(sp)",  // x11
        "sd a2,   64(sp)",  // x12
        "sd a3,   72(sp)",  // x13
        "sd a4,   80(sp)",  // x14
        "sd a5,   88(sp)",  // x15
        "sd a6,   96(sp)",  // x16
        "sd a7,  104(sp)",  // x17
        "sd s2,  112(sp)",  // x18
        "sd s3,  120(sp)",  // x19
        "sd s4,  128(sp)",  // x20
        "sd s5,  136(sp)",  // x21
        "sd s6,  144(sp)",  // x22
        "sd s7,  152(sp)",  // x23
        "sd s8,  160(sp)",  // x24
        "sd s9,  168(sp)",  // x25
        "sd s10, 176(sp)",  // x26
        "sd s11, 184(sp)",  // x27
        "sd t3,  192(sp)",  // x28
        "sd t4,  200(sp)",  // x29
        "sd t5,  208(sp)",  // x30
        "sd t6,  216(sp)",  // x31

        // Save CSRs
        "csrr t0, mepc",
        "sd   t0, 224(sp)",
        "csrr t0, mstatus",
        "sd   t0, 232(sp)",
        "csrr t0, mcause",
        "sd   t0, 240(sp)",

        // Save gp and tp (they may be needed by the Rust code)
        "sd gp, 248(sp)",
        "sd tp, 256(sp)",

        // Call the Rust handler (a0 = pointer to saved context)
        "mv a0, sp",
        "call {handler}",

        // Restore CSRs
        "ld   t0, 224(sp)",
        "csrw mepc, t0",
        "ld   t0, 232(sp)",
        "csrw mstatus, t0",

        // Restore gp and tp
        "ld gp, 248(sp)",
        "ld tp, 256(sp)",

        // Restore all general-purpose registers
        "ld ra,    0(sp)",
        "ld t0,    8(sp)",
        "ld t1,   16(sp)",
        "ld t2,   24(sp)",
        "ld s0,   32(sp)",
        "ld s1,   40(sp)",
        "ld a0,   48(sp)",
        "ld a1,   56(sp)",
        "ld a2,   64(sp)",
        "ld a3,   72(sp)",
        "ld a4,   80(sp)",
        "ld a5,   88(sp)",
        "ld a6,   96(sp)",
        "ld a7,  104(sp)",
        "ld s2,  112(sp)",
        "ld s3,  120(sp)",
        "ld s4,  128(sp)",
        "ld s5,  136(sp)",
        "ld s6,  144(sp)",
        "ld s7,  152(sp)",
        "ld s8,  160(sp)",
        "ld s9,  168(sp)",
        "ld s10, 176(sp)",
        "ld s11, 184(sp)",
        "ld t3,  192(sp)",
        "ld t4,  200(sp)",
        "ld t5,  208(sp)",
        "ld t6,  216(sp)",

        // Deallocate stack frame
        "addi sp, sp, 272",

        "mret",
        handler = sym _trap_handler_rust,
    );
}

// ─── Saved trap context (passed to Rust handler) ─────────────────────────────

/// Layout of the saved register context on the kernel stack.
/// This MUST match the assembly above exactly.
#[repr(C)]
pub struct TrapContext {
    // General-purpose registers (in stack order)
    pub ra:  u64,  // offset 0
    pub t0:  u64,  // offset 8
    pub t1:  u64,  // offset 16
    pub t2:  u64,  // offset 24
    pub s0:  u64,  // offset 32  (frame pointer)
    pub s1:  u64,  // offset 40
    pub a0:  u64,  // offset 48
    pub a1:  u64,  // offset 56
    pub a2:  u64,  // offset 64
    pub a3:  u64,  // offset 72
    pub a4:  u64,  // offset 80
    pub a5:  u64,  // offset 88
    pub a6:  u64,  // offset 96
    pub a7:  u64,  // offset 104
    pub s2:  u64,  // offset 112
    pub s3:  u64,  // offset 120
    pub s4:  u64,  // offset 128
    pub s5:  u64,  // offset 136
    pub s6:  u64,  // offset 144
    pub s7:  u64,  // offset 152
    pub s8:  u64,  // offset 160
    pub s9:  u64,  // offset 168
    pub s10: u64,  // offset 176
    pub s11: u64,  // offset 184
    pub t3:  u64,  // offset 192
    pub t4:  u64,  // offset 200
    pub t5:  u64,  // offset 208
    pub t6:  u64,  // offset 216
    // CSRs
    pub mepc:    u64,  // offset 224
    pub mstatus: u64,  // offset 232
    pub mcause:  u64,  // offset 240
    // Extra
    pub gp:  u64,  // offset 248
    pub tp:  u64,  // offset 256
}

// ─── Rust-level trap dispatcher ──────────────────────────────────────────────

/// Rust-level trap handler. Receives a pointer to the saved context.
///
/// # Safety
/// `ctx` must be a valid pointer to a `TrapContext` on the kernel stack,
/// written by `_trap_entry`.
#[no_mangle]
extern "C" fn _trap_handler_rust(ctx: *mut TrapContext) {
    // SAFETY: ctx is passed from _trap_entry which sets sp (the stack pointer)
    // as a0 before calling this function. The context was just written by the
    // assembly above and is valid.
    let ctx = unsafe { &mut *ctx };

    let mcause = ctx.mcause;
    let mepc = ctx.mepc;

    let is_interrupt = (mcause >> 63) != 0;
    let code = mcause & 0x7FFF_FFFF_FFFF_FFFF;

    if is_interrupt {
        match code {
            7 => {
                // Machine timer interrupt
                handle_timer();
            }
            11 => {
                // Machine external interrupt (PLIC) — not yet handled
                crate::println!("  [trap] external interrupt (PLIC not initialized)");
            }
            _ => {
                crate::println!(
                    "  [trap] unknown interrupt code={} at pc={:#x}",
                    code, mepc
                );
            }
        }
    } else {
        // Synchronous exception
        match code {
            0 => {
                // Instruction address misaligned
                crate::println!(
                    "  [trap] instruction address misaligned at pc={:#x}, mtval={:#x}",
                    mepc, ctx.mepc /* mtval would be better but we don't save it yet */
                );
                // Cannot advance — the instruction is broken. Halt for now.
                halt_forever();
            }
            1 => {
                // Instruction access fault
                crate::println!(
                    "  [trap] instruction access fault at pc={:#x}",
                    mepc
                );
                halt_forever();
            }
            2 => {
                // Illegal instruction
                crate::println!(
                    "  [trap] illegal instruction at pc={:#x}",
                    mepc
                );
                // Advance past the illegal instruction (assume 4 bytes for now)
                // TODO: check for compressed (2-byte) instructions
                ctx.mepc = mepc.wrapping_add(4);
            }
            3 => {
                // Breakpoint
                crate::println!(
                    "  [trap] breakpoint at pc={:#x}",
                    mepc
                );
                // Return to the same instruction (mepc unchanged)
            }
            4 => {
                // Load address misaligned
                crate::println!(
                    "  [trap] load address misaligned at pc={:#x}",
                    mepc
                );
                ctx.mepc = mepc.wrapping_add(4);
            }
            5 => {
                // Load access fault
                crate::println!(
                    "  [trap] load access fault at pc={:#x}",
                    mepc
                );
                ctx.mepc = mepc.wrapping_add(4);
            }
            6 => {
                // Store/AMO address misaligned
                crate::println!(
                    "  [trap] store address misaligned at pc={:#x}",
                    mepc
                );
                ctx.mepc = mepc.wrapping_add(4);
            }
            7 => {
                // Store/AMO access fault
                crate::println!(
                    "  [trap] store access fault at pc={:#x}",
                    mepc
                );
                ctx.mepc = mepc.wrapping_add(4);
            }
            8 => {
                // Environment call from U-mode (ecall from user)
                // TODO: route to syscall handler
                crate::println!(
                    "  [trap] ecall from user at pc={:#x}",
                    mepc
                );
                ctx.mepc = mepc.wrapping_add(4);
            }
            9 => {
                // Environment call from S-mode
                crate::println!(
                    "  [trap] ecall from S-mode at pc={:#x}",
                    mepc
                );
                ctx.mepc = mepc.wrapping_add(4);
            }
            10 => {
                // Environment call from M-mode
                crate::println!(
                    "  [trap] ecall from M-mode at pc={:#x}",
                    mepc
                );
                ctx.mepc = mepc.wrapping_add(4);
            }
            12 => {
                // Instruction page fault
                crate::println!(
                    "  [trap] instruction page fault at pc={:#x}",
                    mepc
                );
                ctx.mepc = mepc.wrapping_add(4);
            }
            13 => {
                // Load page fault
                crate::println!(
                    "  [trap] load page fault at pc={:#x}",
                    mepc
                );
                ctx.mepc = mepc.wrapping_add(4);
            }
            15 => {
                // Store/AMO page fault
                crate::println!(
                    "  [trap] store page fault at pc={:#x}",
                    mepc
                );
                ctx.mepc = mepc.wrapping_add(4);
            }
            _ => {
                crate::println!(
                    "  [trap] unknown exception code={} at pc={:#x}",
                    code, mepc
                );
                // Unknown exception — advance past the faulting instruction
                ctx.mepc = mepc.wrapping_add(4);
            }
        }
    }
}

/// Reset the CLINT timer for the next tick.
fn handle_timer() {
    TICK_COUNT.fetch_add(1, core::sync::atomic::Ordering::Relaxed);
    // SAFETY: CLINT_MTIMECMP is a memory-mapped register. We write the next
    // compare value to re-arm the timer interrupt.
    unsafe {
        let mtime = core::ptr::read_volatile(CLINT_MTIME as *const u64);
        core::ptr::write_volatile(CLINT_MTIMECMP as *mut u64, mtime + TIMER_INTERVAL);
    }
}

/// Halt all harts forever. Used for unrecoverable errors.
fn halt_forever() -> ! {
    crate::println!("  [halt] unrecoverable error — halting all harts");
    loop {
        // SAFETY: wfi is a standard RISC-V instruction that waits for interrupt.
        // In a halt loop this is the intended behavior.
        unsafe { core::arch::asm!("wfi", options(nomem, nostack)); }
    }
}
