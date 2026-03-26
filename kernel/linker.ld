/*
 * SurakshaOS Kernel Linker Script
 * Target: RISC-V 64-bit (QEMU virt machine)
 * Load address: 0x8000_0000 (RAM start on QEMU virt)
 */

OUTPUT_ARCH(riscv)
ENTRY(_start)

MEMORY {
    RAM (rwx) : ORIGIN = 0x80000000, LENGTH = 128M
}

SECTIONS {
    . = 0x80000000;

    /* Code — boot entry must come first */
    .text : {
        *(.text.entry)
        *(.text .text.*)
    } > RAM

    /* Read-only data */
    .rodata : ALIGN(4K) {
        *(.rodata .rodata.*)
        *(.srodata .srodata.*)
    } > RAM

    /* Initialised data */
    .data : ALIGN(4K) {
        *(.data .data.*)
        *(.sdata .sdata.*)
    } > RAM

    /* Kernel stack (16 KiB) */
    .stack : ALIGN(16) {
        _stack_bottom = .;
        . += 16384;
        _stack_top = .;
    } > RAM

    /* Uninitialised data */
    .bss : ALIGN(4K) {
        _bss_start = .;
        *(.bss .bss.*)
        *(.sbss .sbss.*)
        _bss_end = .;
    } > RAM

    /* Heap starts after BSS, extends to end of RAM */
    . = ALIGN(4K);
    _heap_start = .;
    _heap_end = ORIGIN(RAM) + LENGTH(RAM);

    /DISCARD/ : {
        *(.eh_frame)
        *(.eh_frame_hdr)
    }
}
