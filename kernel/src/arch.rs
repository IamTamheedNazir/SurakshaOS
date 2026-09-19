//! SurakshaOS RISC-V Architecture Support
//!
//! M-mode trap handler (timer + ecall bridge) and S-mode trap handler
//! (exceptions + delegated interrupts). CSR helpers for privilege management.
//!
//! # Privilege Model
//!
//! - **M-mode** (Machine): handles timer interrupts and ecall bridge services.
//! - **S-mode** (Supervisor): kernel runs here. Handles exceptions, ecalls
//!   from U-mode, and software interrupts.
//! - **U-mode** (User): not yet implemented. Future user processes.
//!
//! # Trap Delegation
//!
//! M-mode retains (medeleg bit = 0):
//! - Ecall from M-mode (code 11) — the S→M ecall bridge target
//!
//! S-mode handles (medeleg bit = 1):
//! - Instruction address misaligned (0), fault (1), illegal instruction (2),
//!   breakpoint (3), load/store misaligned (4, 6), load/store access fault
//!   (5, 7), ecall from U-mode (8), page faults (12-15)
//!
//! mideleg: SSI (bit 1) delegated to S-mode; MTI/MSI/MEI stay in M-mode.
//!
//! # Safety
//!
//! This module directly manipulates CSRs, MMIO registers, and the
//! hardware privilege state. All `unsafe` blocks document their safety
//! invariants.

use core::arch::asm;

// ─── Constants ───────────────────────────────────────────────────────────────

// CLINT addresses (QEMU virt machine)
const CLINT_MTIMECMP: usize = 0x0200_4000; // hart 0 mtimecmp
const CLINT_MTIME: usize = 0x0200_BFF8; // mtime register

/// Timer interval in CLINT ticks (~1 s at 10 MHz default timebase)
const TIMER_INTERVAL: u64 = 10_000_000;

// ─── RISC-V CSR constants ───────────────────────────────────────────────────

/// sstatus.SPP (bit 8) — previous privilege: 1 = S-mode, 0 = U-mode.
/// (sstatus is a restricted view of mstatus: SPP lives at mstatus bit 8,
/// while bit 1 is SIE — the interrupt-enable bit.)
const SSTATUS_SPP: u64 = 1 << 8;

/// sstatus.SIE (mstatus bit 1) — S-mode global interrupt enable.
/// NOTE: this is NOT mstatus.MIE (bit 3); MIE is an M-mode field that reads
/// as 0 through the sstatus restricted view. Reading bit 3 via `csrr sstatus`
/// always yields 0 in S-mode — a classic trap-vector of confusion.
const SSTATUS_SIE: u64 = 1 << 1;
/// sip.SSIP (bit 1) — supervisor software interrupt pending
const SIP_SSIP: u64 = 1 << 1;
/// scause interrupt bit (bit 63)
const SCAUSE_INTERRUPT: u64 = 1 << 63;
/// scause/mcause code mask (strip interrupt bit)
const SCAUSE_CODE_MASK: u64 = !SCAUSE_INTERRUPT;

// ─── CSR accessors ──────────────────────────────────────────────────────────

/// Read the `mstatus` CSR.
///
/// # Safety
/// Reads a machine-mode CSR. Only valid when executing in M-mode.
#[inline]
pub unsafe fn read_mstatus() -> u64 {
    let val: u64;
    unsafe { asm!("csrr {}, mstatus", out(reg) val) };
    val
}

/// Write the `mstatus` CSR.
///
/// # Safety
/// Writes a machine-mode CSR. Only valid when executing in M-mode.
/// Incorrect values can corrupt the privilege state.
#[inline]
pub unsafe fn write_mstatus(val: u64) {
    unsafe { asm!("csrw mstatus, {}", in(reg) val) };
}

/// Read the `sstatus` CSR.
///
/// # Safety
/// Reads a supervisor-mode CSR. Only valid when executing in S-mode or M-mode.
#[inline]
pub unsafe fn read_sstatus() -> u64 {
    let val: u64;
    unsafe { asm!("csrr {}, sstatus", out(reg) val) };
    val
}

/// Read the `mcause` CSR (machine trap cause).
///
/// # Safety
/// Only valid in M-mode.
#[inline]
pub unsafe fn read_mcause() -> u64 {
    let val: u64;
    unsafe { asm!("csrr {}, mcause", out(reg) val) };
    val
}

/// Read the `scause` CSR (supervisor trap cause).
///
/// # Safety
/// Only valid in S-mode or M-mode.
#[inline]
pub unsafe fn read_scause() -> u64 {
    let val: u64;
    unsafe { asm!("csrr {}, scause", out(reg) val) };
    val
}

/// Read the `stval` CSR (supervisor trap value — faulting address/instruction).
///
/// # Safety
/// Only valid in S-mode or M-mode.
#[inline]
pub unsafe fn read_stval() -> u64 {
    let val: u64;
    unsafe { asm!("csrr {}, stval", out(reg) val) };
    val
}

/// Read the `sepc` CSR (supervisor exception PC).
///
/// # Safety
/// Only valid in S-mode or M-mode.
#[inline]
pub unsafe fn read_sepc() -> u64 {
    let val: u64;
    unsafe { asm!("csrr {}, sepc", out(reg) val) };
    val
}

/// Write the `sepc` CSR.
///
/// # Safety
/// Only valid in S-mode or M-mode.
#[inline]
pub unsafe fn write_sepc(val: u64) {
    unsafe { asm!("csrw sepc, {}", in(reg) val) };
}

/// Read the `medeleg` CSR (machine exception delegation register).
///
/// # Safety
/// Only valid in M-mode.
#[inline]
pub unsafe fn read_medeleg() -> u64 {
    let val: u64;
    unsafe { asm!("csrr {}, medeleg", out(reg) val) };
    val
}

/// Read the `mideleg` CSR (machine interrupt delegation register).
///
/// # Safety
/// Only valid in M-mode.
#[inline]
pub unsafe fn read_mideleg() -> u64 {
    let val: u64;
    unsafe { asm!("csrr {}, mideleg", out(reg) val) };
    val
}

// ─── tick counter ───────────────────────────────────────────────────────────

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

// ─── M-mode timer service ──────────────────────────────────────────────────

/// Re-arm the CLINT timer for the next tick. Called from M-mode trap handler.
fn rearm_timer_with_interval(interval: u64) {
    // SAFETY: CLINT_MTIMECMP is a memory-mapped register. We write the next
    // compare value to schedule the next timer interrupt.
    unsafe {
        let mtime = core::ptr::read_volatile(CLINT_MTIME as *const u64);
        core::ptr::write_volatile(CLINT_MTIMECMP as *mut u64, mtime + interval);
    }
}

// ═══════════════════════════════════════════════════════════════════════════
// M-mode trap handler (minimal — timer + ecall bridge)
// ═══════════════════════════════════════════════════════════════════════════

/// Saved M-mode trap context. Layout matches `_m_trap_entry` in boot.S.
///
/// Stack frame: 20 slots × 8 bytes = 160 bytes
///
/// ```text
///  sp+0   : ra        sp+80 : a4
///  sp+8   : gp        sp+88 : a5
///  sp+16  : tp        sp+96 : a6
///  sp+24  : t0        sp+104: a7
///  sp+32  : t1        sp+112: t3
///  sp+40  : t2        sp+120: t4
///  sp+48  : a0        sp+128: t5
///  sp+56  : a1        sp+136: t6
///  sp+64  : a2        sp+144: mepc
///  sp+72  : a3        sp+152: mstatus
/// ```
#[repr(C)]
pub struct MModeTrapContext {
    pub ra: u64,
    pub gp: u64,
    pub tp: u64,
    pub t0: u64,
    pub t1: u64,
    pub t2: u64,
    pub a0: u64,
    pub a1: u64,
    pub a2: u64,
    pub a3: u64,
    pub a4: u64,
    pub a5: u64,
    pub a6: u64,
    pub a7: u64,
    pub t3: u64,
    pub t4: u64,
    pub t5: u64,
    pub t6: u64,
    pub mepc: u64,
    pub mstatus: u64,
}

/// M-mode trap handler (called from `_m_trap_entry` in boot.S).
///
/// Handles:
/// - Code 7 (Machine timer interrupt): re-arm timer, increment tick
/// - Code 9 (Ecall from S-mode): ecall bridge for timer/reboot
/// - Code 11 (Machine external interrupt): PLIC (future)
///
/// # Safety
/// `ctx` must be a valid pointer to an `MModeTrapContext` on the stack,
/// written by `_m_trap_entry` in boot.S.
#[no_mangle]
extern "C" fn _m_trap_handler_rust(ctx: *mut MModeTrapContext) {
    // SAFETY: ctx is passed from _m_trap_entry which sets sp as a0.
    let ctx = unsafe { &mut *ctx };

    let mcause = unsafe { read_mcause() };
    let is_interrupt = mcause & SCAUSE_INTERRUPT != 0;
    let code = mcause & SCAUSE_CODE_MASK;

    if is_interrupt {
        match code {
            7 => {
                // Machine timer interrupt — re-arm timer and count tick
                TICK_COUNT.fetch_add(1, core::sync::atomic::Ordering::Relaxed);
                rearm_timer_with_interval(TIMER_INTERVAL);
            }
            11 => {
                // Machine external interrupt (PLIC) — not yet handled
            }
            _ => {
                // Unknown M-mode interrupt — log and ignore
                crate::println!(
                    "  [m-trap] unknown M interrupt code={} at mepc={:#x}",
                    code,
                    ctx.mepc
                );
            }
        }
    } else {
        // Synchronous exception in M-mode
        match code {
            9 => {
                // Ecall from S-mode — ecall bridge
                //
                // a7 = service number:
                //   0 = timer setup
                //   1 = reboot
                match ctx.a7 {
                    0 => {
                        // Timer setup: arm the first timer compare
                        // a0 = interval in ticks (0 = default)
                        let interval = if ctx.a0 == 0 { TIMER_INTERVAL } else { ctx.a0 };
                        rearm_timer_with_interval(interval);
                        ctx.a0 = 0; // success
                    }
                    1 => {
                        // Reboot: write to SiFive test device
                        // SAFETY: SiFive test device is at 0x100000 on QEMU virt.
                        unsafe {
                            let test_addr = 0x10_0000 as *mut u32;
                            core::ptr::write_volatile(test_addr, 0x5555);
                        }
                        // If we get here, the reboot failed
                        ctx.a0 = 1; // error
                    }
                    _ => {
                        // Unknown ecall service
                        crate::println!(
                            "  [m-trap] unknown ecall service {} at mepc={:#x}",
                            ctx.a7,
                            ctx.mepc
                        );
                        ctx.a0 = usize::MAX as u64; // error
                    }
                }
                // Advance past the ecall instruction (4 bytes)
                ctx.mepc = ctx.mepc.wrapping_add(4);
            }
            _ => {
                // Other M-mode exceptions (access faults, illegal instructions)
                // These should not normally occur since most exceptions are
                // delegated to S-mode via medeleg.
                crate::println!(
                    "  [m-trap] M-mode exception code={} at mepc={:#x}",
                    code,
                    ctx.mepc
                );
                halt_forever();
            }
        }
    }
}

// ═══════════════════════════════════════════════════════════════════════════
// S-mode trap handler (full — exceptions + delegated interrupts)
// ═══════════════════════════════════════════════════════════════════════════

/// Saved S-mode trap context. Layout matches `_s_trap_entry` in boot.S.
///
/// Stack frame: 32 slots × 8 bytes = 256 bytes
///
/// ```text
///  sp+0   : ra      sp+112: a6      sp+208: t3
///  sp+8   : gp      sp+120: a7      sp+216: t4
///  sp+16  : tp      sp+128: s2      sp+224: t5
///  sp+24  : t0      sp+136: s3      sp+232: t6
///  sp+32  : t1      sp+144: s4      sp+240: sstatus
///  sp+40  : t2      sp+152: s5      sp+248: (reserved for future scause)
///  sp+48  : s0      sp+160: s6
///  sp+56  : s1      sp+168: s7
///  sp+64  : a0      sp+176: s8
///  sp+72  : a1      sp+184: s9
///  sp+80  : a2      sp+192: s10
///  sp+88  : a3      sp+200: s11
///  sp+96  : a4
///  sp+104 : a5
/// ```
#[repr(C)]
pub struct SModeTrapContext {
    pub ra: u64,
    pub gp: u64,
    pub tp: u64,
    pub t0: u64,
    pub t1: u64,
    pub t2: u64,
    pub s0: u64, // also fp
    pub s1: u64,
    pub a0: u64,
    pub a1: u64,
    pub a2: u64,
    pub a3: u64,
    pub a4: u64,
    pub a5: u64,
    pub a6: u64,
    pub a7: u64,
    pub s2: u64,
    pub s3: u64,
    pub s4: u64,
    pub s5: u64,
    pub s6: u64,
    pub s7: u64,
    pub s8: u64,
    pub s9: u64,
    pub s10: u64,
    pub s11: u64,
    pub t3: u64,
    pub t4: u64,
    pub t5: u64,
    pub t6: u64,
    pub sstatus: u64,
    pub _reserved: u64,
}

/// S-mode trap handler (called from `_s_trap_entry` in boot.S).
///
/// Dispatches to exception or interrupt handler based on scause.
///
/// # Safety
/// `ctx` must be a valid pointer to an `SModeTrapContext` on the stack,
/// written by `_s_trap_entry` in boot.S.
#[no_mangle]
extern "C" fn _s_trap_handler_rust(ctx: *mut SModeTrapContext) {
    // SAFETY: ctx is passed from _s_trap_entry which sets sp as a0.
    let _ctx = unsafe { &mut *ctx };

    let scause = unsafe { read_scause() };
    let is_interrupt = scause & SCAUSE_INTERRUPT != 0;
    let code = scause & SCAUSE_CODE_MASK;

    if is_interrupt {
        handle_s_interrupt(code);
    } else {
        handle_s_exception(code);
    }
}

/// Handle S-mode interrupts.
fn handle_s_interrupt(code: u64) {
    match code {
        1 => {
            // Supervisor software interrupt (SSI) — used for IPI / ecall bridge
            // Clear the interrupt pending bit: sip.SSIP is bit 1.
            // (csrw sip with only the S-mode bits set is safe; M-mode bits are
            // read-only for S-mode and unaffected.)
            unsafe {
                asm!("csrc sip, {}", in(reg) SIP_SSIP);
            }
        }
        5 => {
            // Supervisor timer interrupt — not yet implemented
            // (delegated from M-mode timer)
        }
        9 => {
            // Supervisor external interrupt (PLIC) — not yet implemented
        }
        _ => {
            crate::println!("  [s-trap] unknown S interrupt code={}", code);
        }
    }
}

/// Handle S-mode synchronous exceptions.
///
/// Classifies the exception and handles it appropriately:
/// - Ecall from U-mode (code 8): future syscall dispatch
/// - Ecall from S-mode (code 9): kernel internal error (halt)
/// - Page faults (codes 12-15): halt — the kernel runs identity-mapped, so a
///   page fault during kernel execution is a real bug, not a recoverable event
/// - Illegal instruction (code 2): halt — advancing past it would corrupt state
/// - Breakpoint (code 3): return to the same instruction
fn handle_s_exception(code: u64) {
    let sepc = unsafe { read_sepc() };

    match code {
        0 => {
            // Instruction address misaligned
            crate::println!(
                "  [s-trap] instruction address misaligned at sepc={:#x}",
                sepc
            );
            halt_forever();
        }
        1 => {
            // Instruction access fault
            crate::println!("  [s-trap] instruction access fault at sepc={:#x}", sepc);
            halt_forever();
        }
        2 => {
            // Illegal instruction. Special case: the boot privilege probe
            // (probe_mmode_access) intentionally executes an M-mode CSR
            // instruction; when running in S-mode it traps here. We recognise
            // it by the magic marker in sscratch, clear the marker, advance
            // sepc past the 4-byte csrw, and resume normally.
            let sscratch_val: u64;
            // SAFETY: sscratch is readable in S-mode.
            unsafe { asm!("csrr {}, sscratch", out(reg) sscratch_val, options(nomem, nostack)) };
            if sscratch_val == PROBE_MAGIC {
                // SAFETY: sscratch is writable in S-mode; clearing the probe marker.
                unsafe { asm!("csrw sscratch, x0", options(nomem, nostack)) };
                // SAFETY: the faulting csrw is a 4-byte instruction; skip it.
                unsafe { write_sepc(sepc.wrapping_add(4)) };
                return;
            }
            // Real illegal instruction — kernel bug; do NOT advance the PC (that
            // would skip instructions and corrupt state).
            let stval = unsafe { read_stval() };
            crate::println!(
                "  [s-trap] illegal instruction at sepc={:#x}, stval={:#x}",
                sepc,
                stval
            );
            halt_forever();
        }
        3 => {
            // Breakpoint — return to the same instruction
            crate::println!("  [s-trap] breakpoint at sepc={:#x}", sepc);
        }
        4 | 6 => {
            // Load / store-AMO address misaligned
            let stval = unsafe { read_stval() };
            crate::println!(
                "  [s-trap] misaligned access (code {}) at sepc={:#x}, stval={:#x}",
                code,
                sepc,
                stval
            );
            halt_forever();
        }
        5 | 7 => {
            // Load / store-AMO access fault
            let stval = unsafe { read_stval() };
            crate::println!(
                "  [s-trap] access fault (code {}) at sepc={:#x}, stval={:#x}",
                code,
                sepc,
                stval
            );
            halt_forever();
        }
        8 => {
            // Environment call from U-mode (ecall from user)
            // TODO: route to syscall dispatcher
            crate::println!(
                "  [s-trap] ecall from U-mode at sepc={:#x} (no syscalls yet)",
                sepc
            );
            unsafe { write_sepc(sepc.wrapping_add(4)) };
        }
        9 => {
            // Environment call from S-mode (kernel internal error)
            crate::println!("  [s-trap] ecall from S-mode at sepc={:#x}", sepc);
            halt_forever();
        }
        12..=14 => {
            // Page faults (instruction / load / store-AMO). Code 15 is the
            // Sv32-only page-fault code and never occurs on RV64; code 14
            // (store/AMO page fault) is the one that does occur on RV64.
            let stval = unsafe { read_stval() };
            crate::println!(
                "  [s-trap] page fault (code {}) at sepc={:#x}, stval={:#x}",
                code,
                sepc,
                stval
            );
            halt_forever();
        }
        _ => {
            crate::println!(
                "  [s-trap] unhandled exception code={} at sepc={:#x}",
                code,
                sepc
            );
            halt_forever();
        }
    }
}

// ─── Ecall bridge (S-mode → M-mode) ────────────────────────────────────────

/// Trigger an ecall from S-mode to M-mode.
///
/// # Arguments
///
/// * `service` — Service number (0 = timer, 1 = reboot)
/// * `arg0` — First argument (service-specific)
///
/// # Returns
///
/// Returns the value in `a0` after the ecall (set by the M-mode handler).
///
/// # Safety
///
/// Executes an `ecall` instruction, transitioning from S-mode to M-mode.
/// The M-mode trap handler processes the request. The M-mode handler must
/// remain reachable (bit 11 of medeleg must be 0).
pub unsafe fn ecall_to_mmode(service: usize, arg0: usize) -> usize {
    let result: usize;
    unsafe {
        asm!(
            "ecall",
            inlateout("a0") arg0 => result,
            in("a7") service,
        );
    }
    result
}

/// Set up the first timer interrupt via the ecall bridge.
pub fn timer_setup_ecall(interval_ticks: u64) {
    unsafe {
        ecall_to_mmode(0, interval_ticks as usize);
    }
}

/// Trigger a system reboot via the ecall bridge.
pub fn reboot_ecall() -> ! {
    unsafe {
        ecall_to_mmode(1, 0);
    }
    // If ecall returns, reboot failed
    halt_forever();
}

// ─── Trap initialisation (S-mode) ──────────────────────────────────────────

/// Initialize S-mode trap handling.
///
/// Called from `kernel_main_s_mode` after the M-mode → S-mode transition.
/// The stvec is already set by boot.S, so this function verifies
/// and configures S-mode interrupt state.
///
/// # Safety
/// Called once from kernel_main in S-mode. Modifies S-mode CSRs.
pub fn trap_init() {
    // Verify stvec is set (boot.S should have set it)
    let _stvec_val: usize;
    // SAFETY: stvec is readable in S-mode; value used only for diagnostics.
    unsafe { asm!("csrr {}, stvec", out(reg) _stvec_val) };

    // Enable supervisor software interrupt (SSI) in sie.
    // SSIE is bit 1 of sie. This allows S-mode to receive SSIs (ecall bridge).
    const SSIE_BIT: usize = 1 << 1; // sie.SSIE
                                    // SAFETY: csrs on sie is a set-bit write; only SSIE is touched.
    unsafe {
        asm!("csrs sie, {}", in(reg) SSIE_BIT);
    }

    crate::println!("  [arch] S-mode trap handler configured (stvec + sie.SSIE)");
}

/// Halt all harts forever. Used for unrecoverable errors.
pub fn halt_forever() -> ! {
    crate::println!("  [halt] unrecoverable error — halting all harts");
    loop {
        // SAFETY: wfi is a standard RISC-V instruction that waits for interrupt.
        unsafe {
            core::arch::asm!("wfi", options(nomem, nostack));
        }
    }
}

// ─── Privilege verification ────────────────────────────────────────────────

/// Delegation CSR values captured in M-mode before the transition.
/// Stored here (instead of being passed as arguments) because they are
/// only fully readable in M-mode.
static MEDELEG_VALUE: core::sync::atomic::AtomicU64 = core::sync::atomic::AtomicU64::new(0);
static MIDELEG_VALUE: core::sync::atomic::AtomicU64 = core::sync::atomic::AtomicU64::new(0);

/// Record the delegation CSR values observed in M-mode (called from
/// `capture_delegation_from_mmode` in boot.S, which runs in M-mode after
/// the delegation CSRs are written — kernel_main returns before that).
pub fn store_delegation_values(medeleg: u64, mideleg: u64) {
    MEDELEG_VALUE.store(medeleg, core::sync::atomic::Ordering::Relaxed);
    MIDELEG_VALUE.store(mideleg, core::sync::atomic::Ordering::Relaxed);
}

/// Assembly entry from boot.S (a0 = medeleg readback, a1 = mideleg readback).
/// SAFETY: called once from M-mode boot code before the mret; no state yet.
#[no_mangle]
pub extern "C" fn store_delegation_values_abi(medeleg: u64, mideleg: u64) {
    store_delegation_values(medeleg, mideleg);
}

/// Magic value used by the privilege probe (stored in `sscratch` before the
/// probe so the illegal-instruction handler can recognise it).
const PROBE_MAGIC: u64 = 0x5A5A_5A5A_5A5A_5A5A;

/// Probe the current privilege mode by attempting an M-mode CSR access.
///
/// Writes a magic value into `sscratch` (accessible in both M- and S-mode),
/// then attempts to write `mscratch` (M-mode only). Per the privileged spec,
/// executing an M-mode CSR instruction in S-mode raises an illegal-instruction
/// exception — it does NOT silently succeed.
///
/// - **S-mode (expected):** the write traps into the S-mode illegal-instruction
///   handler, which recognises the marker in `sscratch`, clears it, advances
///   `sepc` past the `csrw`, and resumes execution. We detect this by reading
///   `sscratch` back: it is 0 only if the handler ran → we ARE in S-mode.
/// - **M-mode (transition bug):** the write succeeds silently, no trap occurs,
///   and `sscratch` still holds the magic → we are STILL in M-mode.
///
/// Returns `true` if the probe trapped (kernel is in S-mode), `false` if the
/// M-mode CSR access succeeded (kernel is still in M-mode — a boot bug).
///
/// # Safety
///
/// Clobbers the `sscratch` CSR. Must only be called from boot-time code
/// before `sscratch` is used for anything else (it is currently unused).
#[inline(never)]
pub unsafe fn probe_mmode_access() -> bool {
    // SAFETY: sscratch is unused at boot; boot-time probe only.
    unsafe {
        asm!("csrw sscratch, {}", in(reg) PROBE_MAGIC, options(nomem, nostack));
        // In S-mode this traps; the handler clears sscratch and resumes here.
        asm!("csrw mscratch, {}", in(reg) PROBE_MAGIC, options(nomem, nostack));
    }
    let marker: u64;
    // SAFETY: sscratch is readable in both M- and S-mode.
    unsafe { asm!("csrr {}, sscratch", out(reg) marker, options(nomem, nostack)) };
    marker == 0 // handler cleared it → the probe trapped → S-mode
}

/// Print the privilege-verification block for the M→S transition.
///
/// Proves the kernel is really executing in S-mode with hardware state:
/// - `mscratch` probe — an M-mode CSR access from S-mode must raise an
///   illegal-instruction exception. If this function prints anything after
///   "probing...", the kernel is (incorrectly) still running in M-mode.
///   The honest boot path therefore NEVER reaches the SPP lines below.
/// - `sstatus.SPP` — NOT set by mret. `mret` consumes and clears `mstatus.MPP`;
///   `SPP` is hardware-managed on the S-mode trap/sret stack (set on trap
///   entry, cleared by `sret`). After a plain M→S transition SPP=0 is the
///   expected steady state.
/// - `sstatus.SIE` — set by `_s_mode_entry` (boot.S) before the probe; a
///   probe trap briefly clears it, and `sret` restores it from SPIE.
/// - `medeleg`/`mideleg` — values captured in M-mode before mret.
pub fn print_privilege_verification() {
    let medeleg = MEDELEG_VALUE.load(core::sync::atomic::Ordering::Relaxed);
    let mideleg = MIDELEG_VALUE.load(core::sync::atomic::Ordering::Relaxed);

    crate::println!("  [arch] privilege verification (S-mode):");
    crate::println!("    medeleg (captured in M-mode) = {:#x}", medeleg);
    crate::println!("    mideleg (captured in M-mode) = {:#x}", mideleg);

    crate::println!("    probing mscratch (M-mode-only CSR)...");
    // SAFETY: boot-time probe; sscratch is not used for anything else yet.
    let in_s_mode = unsafe { probe_mmode_access() };
    if in_s_mode {
        crate::println!(
            "    mscratch probe trapped (illegal instruction) → CONFIRMED: running in S-mode"
        );
    } else {
        // The M-mode CSR access succeeded — the mret did NOT change privilege.
        crate::println!(
            "    [boot] CRITICAL: mscratch access succeeded — kernel is STILL IN M-MODE, M→S transition FAILED!"
        );
        crate::println!("    [boot] Check boot.S: mstatus.MPP must be Supervisor (0b01, bit 11 set) before mret.");
        halt_forever();
    }

    let sstatus = unsafe { read_sstatus() };
    let spp = (sstatus & SSTATUS_SPP) != 0;
    let sie = (sstatus & SSTATUS_SIE) != 0;
    crate::println!(
        "    sstatus.SPP = {} (expected 0: mret manages MPP, not SPP)",
        spp as u64
    );
    crate::println!(
        "    sstatus.SIE = {} — {}",
        sie as u64,
        if sie {
            "interrupts enabled"
        } else {
            "interrupts DISABLED"
        }
    );
    crate::println!("    sstatus.SPIE = {}", (sstatus >> 5) & 1);
    if !sie {
        crate::println!(
            "    [boot] WARNING: SIE=0 — S-mode interrupts are disabled (check boot.S)"
        );
    }
}

// ─── Debug / diagnostic helpers ────────────────────────────────────────────

/// Read the current `satp` CSR value (for debugging).
pub fn read_satp() -> u64 {
    let val: u64;
    // SAFETY: satp is readable in S-mode.
    unsafe { asm!("csrr {}, satp", out(reg) val) };
    val
}
