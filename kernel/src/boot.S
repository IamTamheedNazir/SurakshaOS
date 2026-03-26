/*
 * SurakshaOS RISC-V Boot Assembly
 * Entry point: _start
 *
 * Called by QEMU (or OpenSBI) with:
 *   a0 = hart ID
 *   a1 = pointer to device tree blob (DTB)
 *
 * Sets up the stack, clears BSS, then jumps to kernel_main().
 */

.section .text.entry
.globl _start

_start:
    /* Park all harts except hart 0 */
    bnez    a0, _park

    /* Set up the kernel stack (defined in linker.ld) */
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
     * Jump to Rust kernel entry point.
     * a0 = hart_id, a1 = dtb_ptr (preserved from firmware/QEMU)
     */
    call    kernel_main

    /* kernel_main diverges (-> !); if it ever returns, park. */
    j       _park

_park:
    wfi
    j       _park
