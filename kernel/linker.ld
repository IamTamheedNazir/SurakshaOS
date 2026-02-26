/* SurakshaOS Kernel Linker Script
 * 
 * Memory layout for RISC-V and ARM platforms
 */

OUTPUT_ARCH(riscv)
ENTRY(_start)

MEMORY
{
    /* RISC-V QEMU virt machine */
    RAM (rwx) : ORIGIN = 0x80000000, LENGTH = 128M
}

SECTIONS
{
    . = 0x80000000;
    
    /* Kernel code section */
    .text : ALIGN(4K)
    {
        KEEP(*(.text.boot))
        *(.text .text.*)
    } > RAM
    
    /* Read-only data */
    .rodata : ALIGN(4K)
    {
        *(.rodata .rodata.*)
    } > RAM
    
    /* Initialized data */
    .data : ALIGN(4K)
    {
        *(.data .data.*)
        *(.sdata .sdata.*)
    } > RAM
    
    /* BSS (uninitialized data) */
    .bss : ALIGN(4K)
    {
        __bss_start = .;
        *(.bss .bss.*)
        *(.sbss .sbss.*)
        __bss_end = .;
    } > RAM
    
    /* Stack */
    .stack : ALIGN(4K)
    {
        . = . + 1M; /* 1MB stack */
        __stack_top = .;
    } > RAM
    
    /* Heap */
    .heap : ALIGN(4K)
    {
        __heap_start = .;
        . = . + 64M; /* 64MB heap */
        __heap_end = .;
    } > RAM
    
    /* Kernel end marker */
    __kernel_end = .;
    
    /* Discard sections */
    /DISCARD/ :
    {
        *(.comment)
        *(.eh_frame)
        *(.note.*)
    }
}
