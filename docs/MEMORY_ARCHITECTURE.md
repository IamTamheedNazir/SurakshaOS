# SurakshaOS — Memory Architecture

**Status:** PLANNED — not yet implemented  
**Target:** RISC-V 64-bit, Sv39 page tables  
**Current milestone:** M2 (Real Kernel)

---

## Overview

SurakshaOS will use RISC-V Sv39 virtual memory with separate user and kernel address spaces. This document describes the planned memory architecture.

---

## Physical Memory Layout

### QEMU virt Machine (256 MiB default)

```
Physical Address Range    Size    Description
─────────────────────────────────────────────
0x0000_0000 - 0x0000_FFFF  64 KiB  Reserved (firmware/ROM)
0x0010_0000 - 0x0010_FFFF  64 KiB  UART (NS16550A)
0x0200_0000 - 0x0201_FFFF  128 KiB CLINT (timer, IPI)
0x0C00_0000 - 0x0FFF_FFFF  64 MiB  PLIC (interrupt controller)
0x8000_0000 - 0x87FF_FFFF  128 MiB RAM (kernel + heap + user)
```

### Kernel Physical Memory Map

```
0x8000_0000 ┌────────────────────────┐
            │   .text (boot + code)  │
            ├────────────────────────┤
            │   .rodata              │
            ├────────────────────────┤
            │   .data                │
            ├────────────────────────┤
            │   .bss                 │
            ├────────────────────────┤
            │   Kernel heap          │
            │   (frame allocator)    │
            ├────────────────────────┤
            │   Kernel page tables   │
            ├────────────────────────┤
            │   Free frames          │
            ├────────────────────────┤
            │   User space starts    │
            │   (high physical addr) │
0x87FF_FFFF └────────────────────────┘
```

---

## Virtual Address Space (Sv39)

Sv39 supports 39-bit virtual addresses = 512 GiB per address space.

### Kernel Address Space

```
Virtual Address Range       Size     Description
──────────────────────────────────────────────────
0xFFFF_FFC0_0000_0000+     512 GiB  Kernel direct mapping
  (physical address + offset)
0xFFFF_FF80_0000_0000      4 MiB    Kernel text + rodata
0xFFFF_FF80_0040_0000      4 MiB    Kernel data + BSS
0xFFFF_FF80_0080_0000      ...      Kernel heap
0xFFFF_FFFF_8000_0000      2 GiB    Kernel logical mapping
```

### User Address Space (per process)

```
Virtual Address Range       Size     Description
──────────────────────────────────────────────────
0x0000_0000_0000_0000      2 GiB    User code, data, heap
0x0000_0040_0000_0000      ...      User stack (grows down)
0xFFFF_FF80_0000_0000      ...      Kernel mapping (read-only in U-mode)
```

---

## Physical Frame Allocator

### Design: Bitmap Allocator (initial)

```
┌─────────────────────────────────────────────┐
│ Bitmap: 1 bit per 4 KiB frame              │
│ 128 MiB / 4 KiB = 32768 frames = 4 KiB    │
│ bitmap                                       │
├─────────────────────────────────────────────┤
│ Operations:                                  │
│   alloc_frame() → Option<PhysAddr>          │
│   free_frame(PhysAddr)                      │
│   alloc_contiguous(n) → Option<PhysAddr>    │
└─────────────────────────────────────────────┘
```

### Future: Buddy Allocator

Replace bitmap with buddy allocator for efficient contiguous allocation.

---

## Kernel Heap

- Start: after `.bss` section
- Size: dynamic (up to remaining physical memory)
- Used for: kernel data structures, VFS cache, driver buffers
- Allocator: `linked_list_allocator` (current), custom slab allocator (future)

---

## Page Table Management

### Sv39 Page Table Structure

```
Level 0 (root)   → 512 entries × Level 1
Level 1          → 512 entries × Level 2
Level 2          → 512 entries × Level 3
Level 3 (leaf)   → 4 KiB pages

Each entry: 8 bytes
  [53:10] Physical page number (PPN)
  [7:0]   Flags (V, R, W, X, A, D, U, G, A/D)
```

### Page Permissions

| Flag | Meaning |
|------|---------|
| V | Valid entry |
| R | Readable |
| W | Writable |
| X | Executable |
| A | Accessed |
| D | Dirty |
| U | User-accessible |
| G | Global (kernel pages) |

### Address Translation

```
Virtual Address (39 bits):
  VPN[2] (9 bits) → Level 0 index
  VPN[1] (9 bits) → Level 1 index
  VPN[0] (9 bits) → Level 2 index
  Page Offset (12 bits) → byte within page

Physical Address (56 bits):
  PPN[2] (26 bits)
  PPN[1] (9 bits)
  PPN[0] (9 bits)
  Page Offset (12 bits)
```

---

## Memory Regions (Per Process)

Each process has a list of memory regions:

```
MemoryRegion {
    start: VirtAddr,
    size: usize,
    permissions: ProtFlags,  // READ | WRITE | EXEC
    backing: RegionBacking,  // Anonymous | File { fd, offset } | CopyOnWrite
}
```

### Region Types

1. **Code** — read+execute, backed by ELF segments
2. **Data** — read+write, initialized from ELF
3. **Heap** — read+write, grows via brk/mmap
4. **Stack** — read+write, grows downward with guard page
5. **Mapped** — mmap'd file or shared memory
6. **Guard** — no permissions, catches stack overflow

---

## Copy-on-Write (COW)

When `fork()` creates a child:
1. Mark all writable pages as COW (remove W bit, set COW flag)
2. Share physical frames between parent and child
3. On write fault: allocate new frame, copy data, update page table
4. Reduces fork overhead for processes that exec immediately

---

## Memory Protection

- Kernel pages are not accessible from U-mode
- User pages cannot be mapped as executable and writable simultaneously (W^X)
- Guard pages detect stack overflow
- Page faults are handled per-process (kill process or signal)

---

## Future: Large Pages

- Support 2 MiB superpages for kernel mapping
- Reduce TLB pressure for large memory workloads

---

## Implementation Phases

1. **Phase 1:** Physical frame allocator + Sv39 page tables + kernel mapping
2. **Phase 2:** Per-process address spaces + user/kernel separation
3. **Phase 3:** Memory regions + COW + mmap
4. **Phase 4:** Large pages + NUMA awareness (future)
