/*
 * SurakshaOS RISC-V Boot Assembly
 * Entry point: _start
 *
 * Called by QEMU (no BIOS/OpenSBI) with:
 *   a0 = hart ID
 *   a1 = pointer to device tree blob (DTB)
 *
 * Execution flow:
 *   M-mode: park harts, set stack, clear BSS, call kernel_main
 *   kernel_main: init PMA, heap, VMM (Sv39 paging), then return here
 *   M-mode: configure medeleg/mideleg, set MPP=S, mret → S-mode
 *   S-mode: configure stvec, enable interrupts → kernel_main_s_mode()
 */

/* ── Constants ──────────────────────────────────────────────────────────── */
.set MSTATUS_MPP_S,       (1 << 11)       /* mstatus.MPP = Supervisor (binary 01; 11 = Machine!) */
.set MSTATUS_MPP_SHIFT,   11              /* mstatus.MPP field: bits [12:11] */
.set MSTATUS_MPP_MASK,    0x3             /* both MPP bits */
.set MSTATUS_MPIE,        (1 << 7)        /* mstatus.MPIE = enable after mret */
.set MSTATUS_FS_DIRTY,    (3 << 13)       /* mstatus.FS = Dirty (enable FPU, mark state valid) */
.set MIE_MTIE,            (1 << 7)        /* mie.MTIE = machine timer interrupt enable */
.set SIE_SSIE,            (1 << 1)        /* sie.SSIE = supervisor software interrupt enable */
.set MIP_SSIP,            (1 << 1)        /* mip.SSIP — S-mode software interrupt pending (S-mode bit) */
.set CLINT_MTIMECMP,      0x02004000      /* CLINT hart 0 mtimecmp */
.set CLINT_MTIME,         0x0200BFF8      /* CLINT mtime */
.set TIMER_INTERVAL,      10000000        /* ~1 s at 10 MHz timebase */
.set UART0_BASE,          0x10000000      /* NS16550A THR */

.section .text.entry
.globl _start

/* ══════════════════════════════════════════════════════════════════════════
 * M-mode entry point (first code executed after QEMU loads the kernel)
 * ══════════════════════════════════════════════════════════════════════════ */
_start:
    /* Park all harts except hart 0 */
    bnez    a0, _park

    /* Set up the kernel stack */
    la      sp, _stack_top

    /* Clear the BSS section */
    la      t0, _bss_start
    la      t1, _bss_end
_clear_bss:
    bgeu    t0, t1, _bss_done
    sd      zero, 0(t0)
    addi    t0, t0, 8
    j       _clear_bss
_bss_done:

    /*
     * Call Rust kernel_main(hart_id, dtb_ptr) in M-mode.
     * kernel_main initializes: PMA, heap, VMM (Sv39 paging).
     * After kernel_main returns, we switch to S-mode.
     */
    call    kernel_main

    /* ══════════════════════════════════════════════════════════════════════
     * M-mode → S-mode transition
     * ══════════════════════════════════════════════════════════════════════ */

    /*
     * Configure exception delegation to S-mode.
     *
     * Each bit = one delegated exception (RISC-V Privileged Spec, Table 3.6).
     * 0 = handled in M-mode, 1 = delegated to S-mode.
     *
     * Target value 0x71FF (bits 0-8 and 12-14):
     *   0  instruction address misaligned
     *   1  instruction access fault
     *   2  illegal instruction
     *   3  breakpoint
     *   4  load address misaligned
     *   5  load access fault
     *   6  store/AMO address misaligned
     *   7  store/AMO access fault
     *   8  ecall from U-mode      → future syscall path
     *  12  instruction page fault
     *  13  load page fault
     *  14  store/AMO page fault
     *
     * Explicitly retained in M-mode (bit = 0):
     *   bit 9  ecall from S-mode  — must stay in M-mode: this is the S→M
     *          ecall bridge (timer setup / reboot). Delegating it would trap
     *          into the S-mode handler, which treats code 9 as a kernel bug.
     *   bit 11 ecall from M-mode  — hardwired 0 by the spec (WARL).
     *
     * QEMU enforces spec: bit 9 and bit 11 read back 0 regardless of what
     * we write, but we keep them 0 explicitly for clarity and auditability.
     */
    li      t0, 0x71FF              /* bits 0-8, 12-14 (bits 9/11 excluded) */
    csrw    medeleg, t0

    /*
     * Configure interrupt delegation to S-mode.
     *
     * mideleg bit 1 = Supervisor Software Interrupt (SSI).
     * M-mode interrupt bits (MSIP=3, MTIP=7, MEIP=11) are hardwired to 0 in
     * mideleg per spec — writing 1 there is silently ignored by hardware.
     * We only delegate SSI; the machine timer stays in M-mode (its handler
     * re-arms the CLINT comparator and raises SSI for S-mode work).
     */
    li      t0, MIP_SSIP
    csrw    mideleg, t0

    /*
     * Capture the effective (WARL-filtered) delegation values NOW, while
     * M-mode CSRs are still readable. The readback shows what the hardware
     * actually accepted, which the S-mode verification block then reports.
     * (kernel_main cannot do this — it returns before these writes.)
     */
    call    capture_delegation_from_mmode

    /*
     * Configure one PMP entry granting R/W/X over the entire physical
     * address space (NAPOT encoding, pmpaddr0 = all ones).
     *
     * REQUIRED before mret to S/U-mode: per the RISC-V privileged spec,
     * PMP is the only mechanism M-mode can use to grant memory access to
     * lower privilege modes. With ZERO PMP rules, all S/U-mode accesses
     * would fail — so QEMU (verified in 6.2 op_helper.c helper_mret) raises
     * illegal-instruction on `mret` when MPP != M and no PMP rules exist.
     * Without this, the M→S transition traps at the mret itself.
     *
     * This is the same setup OpenSBI's firmware performs before handing
     * control to an S-mode kernel; we replicate it because we run with
     * -bios none (no firmware).
     *
     * pmpcfg0 = A=NAPOT (0b11 << 3) | R | W | X = 0x1F  (L=0, no lock)
     * pmpaddr0 = all ones → NAPOT covers the full 56-bit physical space
     */
    li      t0, 0x1F
    csrw    pmpcfg0, t0
    li      t0, -1
    csrw    pmpaddr0, t0

    /*
     * Set mstatus.MPP = Supervisor (01₂) so mret enters S-mode.
     * Set mstatus.MPIE = 1 so interrupts are re-enabled after mret.
     * Set mstatus.FS = Dirty so the FPU is usable in S/U-mode and A/D
     * hardware updates for FP loads/stores are not blocked by FS=Off.
     *
     * CRITICAL: MPP is bits 12 and 11. Supervisor = binary 01 → (1 << 11).
     * The previous value (3 << 11) = binary 11 = Machine mode, which made
     * mret re-enter M-mode — the kernel silently ran in M-mode.
     *
     * We use read-modify-write (csrc then csrs) so MPP is *replaced* rather
     * than OR-ed: the boot CPU starts with MPP possibly already containing
     * bits, and OR-ing could leave stale bits set. Clear both MPP bits, then
     * set the Supervisor pattern; MPIE and FS are set-bits, safe to OR.
     */
    li      t0, MSTATUS_MPP_MASK << MSTATUS_MPP_SHIFT
    /* clear both MPP bits */
    csrc    mstatus, t0
    li      t0, MSTATUS_MPP_S | MSTATUS_MPIE | MSTATUS_FS_DIRTY
    /* set MPP=Supervisor, MPIE=1, FS=Dirty */
    csrs    mstatus, t0

    /*
     * Set mepc = _s_mode_entry (where mret jumps to in S-mode)
     */
    la      t0, _s_mode_entry
    csrw    mepc, t0

    /*
     * Enable machine timer interrupt for M-mode handler.
     */
    li      t0, MIE_MTIE
    csrs    mie, t0

    /*
     * CRITICAL: install the M-mode trap vector BEFORE enabling interrupts.
     * Without this, the (always-pending) timer interrupt traps to mtvec=0
     * and the kernel hangs in an infinite fault loop.
     */
    la      t0, _m_trap_entry
    csrw    mtvec, t0

    /*
     * Arm the first timer interrupt: mtimecmp = mtime + TIMER_INTERVAL.
     * mtimecmp resets to 0, so without arming it the timer interrupt is
     * pending from the moment MIE+MTIE are enabled.
     */
    li      t0, CLINT_MTIME
    ld      t1, 0(t0)
    li      t2, TIMER_INTERVAL
    add     t1, t1, t2
    li      t0, CLINT_MTIMECMP
    sd      t1, 0(t0)

    /* Debug: write 'M' to UART — about to mret. */
    li      t0, UART0_BASE + 5   /* UART LSR */
1:  lb      t1, 0(t0)
    andi    t1, t1, 0x20         /* TX empty? */
    beqz    t1, 1b
    li      t0, UART0_BASE      /* UART THR */
    li      t1, 'M'
    sb      t1, 0(t0)

    /*
     * Return to S-mode via mret.
     */
    mret

/* ══════════════════════════════════════════════════════════════════════════
 * S-mode entry point (first code executed in S-mode after mret)
 *
 * MUST be 4-byte aligned: mepc/stvec-style PC targets must be
 * instruction-boundary aligned, and compressed (C-extension) code before
 * this label can leave it on a 2-byte boundary.
 * ══════════════════════════════════════════════════════════════════════════ */
    .balign 4
_s_mode_entry:
    /*
     * Set stvec to point to our S-mode trap handler.
     * The trap handler is identity-mapped at its physical address.
     */
    la      t0, _s_trap_entry
    csrw    stvec, t0

    /*
     * Enable supervisor software interrupt (SSI) for S-mode.
     * sie.SSIE is bit 1.
     */
    li      t0, SIE_SSIE
    csrs    sie, t0

    /* Enable global S-mode interrupts (sstatus.SIE = mstatus bit 1).
       mret only copies MPIE into MIE (machine level); without setting
       sstatus.SIE, S-mode would never take the delegated SSI. */
    li      t0, 2
    csrs    sstatus, t0

    /* Debug: write 'S' to UART — S-mode setup done. */
    li      t0, UART0_BASE      /* UART THR */
    li      t1, 'S'
    sb      t1, 0(t0)

    /*
     * Jump to the S-mode kernel continuation.
     * This calls kernel_main_s_mode() in Rust, which never returns.
     */
    call    kernel_main_s_mode

    /* kernel_main_s_mode diverges (-> !); if it ever returns, park. */
    j       _park

/* ─────────────────────────────────────────────────────────────────────────
 * Capture delegation CSRs from M-mode (called while still in M-mode).
 * Tail-calls the Rust helper with a0 = medeleg, a1 = mideleg.
 * ───────────────────────────────────────────────────────────────────────── */
    .text
    .globl capture_delegation_from_mmode
capture_delegation_from_mmode:
    csrr    a0, medeleg
    csrr    a1, mideleg
    tail    store_delegation_values_abi

/* ══════════════════════════════════════════════════════════════════════════
 * S-mode trap entry (full register save/restore)
 *
 * Handles all exceptions delegated by medeleg and SSI from mideleg.
 * Saves ALL general-purpose registers + CSRs for potential future
 * context switching.
 *
 * MUST be 4-byte aligned: stvec's low bits are the MODE field, not part of
 * the base address — hardware/QEMU clears them before dispatching, so a
 * 2-byte-aligned handler would be entered 2 bytes early (mid-instruction).
 * ══════════════════════════════════════════════════════════════════════════ */
    .balign 4
_s_trap_entry:
    /* Allocate stack frame: 32 slots × 8 bytes = 256 bytes */
    addi    sp, sp, -256

    /* Save all general-purpose registers (x1-x31) */
    sd      ra,    0(sp)
    sd      gp,    8(sp)
    sd      tp,   16(sp)
    sd      t0,   24(sp)
    sd      t1,   32(sp)
    sd      t2,   40(sp)
    sd      s0,   48(sp)
    sd      s1,   56(sp)
    sd      a0,   64(sp)
    sd      a1,   72(sp)
    sd      a2,   80(sp)
    sd      a3,   88(sp)
    sd      a4,   96(sp)
    sd      a5,  104(sp)
    sd      a6,  112(sp)
    sd      a7,  120(sp)
    sd      s2,  128(sp)
    sd      s3,  136(sp)
    sd      s4,  144(sp)
    sd      s5,  152(sp)
    sd      s6,  160(sp)
    sd      s7,  168(sp)
    sd      s8,  176(sp)
    sd      s9,  184(sp)
    sd      s10, 192(sp)
    sd      s11, 200(sp)
    sd      t3,  208(sp)
    sd      t4,  216(sp)
    sd      t5,  224(sp)
    sd      t6,  232(sp)

    /* Save CSRs (sepc handled by hardware on sret) */
    csrr    t0, sstatus
    sd      t0,  240(sp)

    /* Call Rust handler (a0 = pointer to saved context) */
    mv      a0, sp
    call    _s_trap_handler_rust

    /* Restore CSRs */
    ld      t0,  240(sp)
    csrw    sstatus, t0

    /* Restore all general-purpose registers */
    ld      ra,    0(sp)
    ld      gp,    8(sp)
    ld      tp,   16(sp)
    ld      t0,   24(sp)
    ld      t1,   32(sp)
    ld      t2,   40(sp)
    ld      s0,   48(sp)
    ld      s1,   56(sp)
    ld      a0,   64(sp)
    ld      a1,   72(sp)
    ld      a2,   80(sp)
    ld      a3,   88(sp)
    ld      a4,   96(sp)
    ld      a5,  104(sp)
    ld      a6,  112(sp)
    ld      a7,  120(sp)
    ld      s2,  128(sp)
    ld      s3,  136(sp)
    ld      s4,  144(sp)
    ld      s5,  152(sp)
    ld      s6,  160(sp)
    ld      s7,  168(sp)
    ld      s8,  176(sp)
    ld      s9,  184(sp)
    ld      s10, 192(sp)
    ld      s11, 200(sp)
    ld      t3,  208(sp)
    ld      t4,  216(sp)
    ld      t5,  224(sp)
    ld      t6,  232(sp)

    /* Deallocate stack frame */
    addi    sp, sp, 256

    sret

/* ══════════════════════════════════════════════════════════════════════════
 * M-mode trap entry (full register save/restore)
 *
 * Handles all traps not delegated to S-mode:
 *   - Machine timer interrupt (code 7): re-arm timer, increment tick
 *   - Ecall from S-mode (code 9): timer setup, reboot services
 *   - Machine external interrupt (code 11): PLIC (future)
 *
 * Saves ALL caller-saved registers (ra, t0-t6, a0-a7, gp, tp) plus
 * mepc/mstatus. Callee-saved regs (s0-s11) are the Rust handler's
 * responsibility (standard ABI), so they need no explicit save here.
 *
 * MUST be 4-byte aligned for the same stvec/mtvec BASE-alignment reason as
 * _s_trap_entry above.
 * ══════════════════════════════════════════════════════════════════════════ */
    .balign 4
_m_trap_entry:
    /* Allocate stack frame: 20 slots × 8 bytes = 160 bytes */
    addi    sp, sp, -160

    /* Save caller-saved registers + gp/tp */
    sd      ra,    0(sp)
    sd      gp,    8(sp)
    sd      tp,   16(sp)
    sd      t0,   24(sp)
    sd      t1,   32(sp)
    sd      t2,   40(sp)
    sd      a0,   48(sp)
    sd      a1,   56(sp)
    sd      a2,   64(sp)
    sd      a3,   72(sp)
    sd      a4,   80(sp)
    sd      a5,   88(sp)
    sd      a6,   96(sp)
    sd      a7,  104(sp)
    sd      t3,  112(sp)
    sd      t4,  120(sp)
    sd      t5,  128(sp)
    sd      t6,  136(sp)

    /* Save mepc and mstatus */
    csrr    t0, mepc
    sd      t0,  144(sp)
    csrr    t0, mstatus
    sd      t0,  152(sp)

    /* Call Rust handler (a0 = pointer to saved context) */
    mv      a0, sp
    call    _m_trap_handler_rust

    /* Restore mepc and mstatus */
    ld      t0,  144(sp)
    csrw    mepc, t0
    ld      t0,  152(sp)
    csrw    mstatus, t0

    /* Restore caller-saved registers + gp/tp */
    ld      ra,    0(sp)
    ld      gp,    8(sp)
    ld      tp,   16(sp)
    ld      t0,   24(sp)
    ld      t1,   32(sp)
    ld      t2,   40(sp)
    ld      a0,   48(sp)
    ld      a1,   56(sp)
    ld      a2,   64(sp)
    ld      a3,   72(sp)
    ld      a4,   80(sp)
    ld      a5,   88(sp)
    ld      a6,   96(sp)
    ld      a7,  104(sp)
    ld      t3,  112(sp)
    ld      t4,  120(sp)
    ld      t5,  128(sp)
    ld      t6,  136(sp)

    /* Deallocate stack frame */
    addi    sp, sp, 160

    mret

/* ══════════════════════════════════════════════════════════════════════════
 * Park non-boot harts (spin forever)
 * ══════════════════════════════════════════════════════════════════════════ */
_park:
    wfi
    j       _park
