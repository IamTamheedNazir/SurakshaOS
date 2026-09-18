# SurakshaOS — Architecture Document

**Version:** 0.2.0 (prototype)  
**Target Architecture:** RISC-V 64-bit (riscv64gc)  
**Primary Platform:** QEMU RISC-V virt machine  
**Language:** Rust (no_std, nightly)

---

## 1. Design Philosophy

SurakshaOS is a ground-up operating system built in Rust targeting RISC-V. It is designed with sovereignty, security, and memory safety as first principles. No Android base, no iOS components, no external control layers.

**Core principles:**
- Security-first design with minimal attack surface
- Memory safety via Rust (minimal `unsafe`, documented when required)
- Modular architecture enabling future mobile and desktop targets
- Transparent, auditable, open-source development

---

## 2. Target Architecture (Complete)

```
┌─────────────────────────────────────────────────┐
│                  APPLICATIONS                    │
├─────────────────────────────────────────────────┤
│                Application SDK                    │
├─────────────────────────────────────────────────┤
│              App Runtime / ABI                    │
├─────────────────────────────────────────────────┤
│           Package Manager / Store                 │
├─────────────────────────────────────────────────┤
│            Permission / Sandbox                   │
├─────────────────────────────────────────────────┤
│               System Services                    │
│     ┌──────────┬──────────┬──────────┐          │
│  Graphics  Networking   Storage     Audio       │
│     │          │          │           │          │
│ Compositor  Sockets      VFS        Mixer       │
│     │          │          │           │          │
│  Display   Firewall   Block Layer   Devices     │
├─────────────────────────────────────────────────┤
│                  Syscalls                         │
├─────────────────────────────────────────────────┤
│                     IPC                           │
├─────────────────────────────────────────────────┤
│              User Processes                      │
│         ┌──────────────────┐                    │
│   Process/Thread Manager  File Descriptors      │
│         └──────────────────┘                    │
├─────────────────────────────────────────────────┤
│                  Scheduler                        │
│          ┌──────────────────┐                    │
│   Run Queues  Priority  Preemption              │
│         └──────────────────┘                    │
├─────────────────────────────────────────────────┤
│               Virtual Memory                     │
│   Page Tables │ ASIDs │ COW │ Shared Memory     │
├─────────────────────────────────────────────────┤
│              Physical Memory                     │
│   Frame Allocator │ Memory Map │ Reserved       │
├─────────────────────────────────────────────────┤
│                   Kernel                         │
│   Libc-like API │ Crypto │ Logging │ Error      │
├─────────────────────────────────────────────────┤
│                    HAL                           │
│   Arch-specific │ Device Tree │ Platform        │
├─────────────────────────────────────────────────┤
│                   Drivers                        │
│   Storage │ Network │ Input │ Display │ Audio   │
├─────────────────────────────────────────────────┤
│                  Hardware                        │
│   RISC-V │ PLIC │ CLINT │ UART │ VirtIO │ ...  │
└─────────────────────────────────────────────────┘
```

---

## 3. Current Architecture (What Exists)

```
┌──────────────────────────────────┐
│          Shell (sursh)            │ ← Single-threaded, runs in kernel
├──────────────────────────────────┤
│        Init System               │ ← Stub: fake service PIDs
├──────────────────────────────────┤
│     In-Memory VFS                │ ← Working, no persistence
├──────────────────────────────────┤
│     Process (stub)               │ ← PID counter only
├──────────────────────────────────┤
│     Memory (heap only)           │ ← linked_list_allocator
├──────────────────────────────────┤
│     Arch (RISC-V trap)           │ ← Timer + incomplete context save
├──────────────────────────────────┤
│     Console (UART)               │ ← Working polling driver
├──────────────────────────────────┤
│     Boot (boot.S)                │ ← Working for QEMU single-core
└──────────────────────────────────┘
Everything runs in RISC-V M-mode, flat address space, single call stack.
```

---

## 4. Boot Flow

```
QEMU powers on
    │
    ├── Loads kernel ELF at 0x8000_0000
    │
    └── Jumps to _start (boot.S)
         │
         ├── Park harts > 0 (spin with wfi)
         │
         ├── Set sp = _stack_top (16 KiB stack)
         │
         ├── Clear BSS section
         │
         └── call kernel_main(hart_id, dtb_ptr)
              │
              ├── memory::init_heap()      — init linked-list allocator
              ├── arch::trap_init()        — set mtvec, enable timer IRQ
              ├── fs::vfs_init()           — create empty VFS root
              ├── Print boot banner
              └── init::InitSystem::new().run()
                   │
                   ├── Print banner
                   ├── Setup filesystem dirs
                   ├── Start fake services
                   └── Shell::new().run()  — infinite shell loop
```

---

## 5. Memory Layout

```
Physical Memory (128 MiB starting at 0x8000_0000):
┌──────────────────────┐ 0x8000_0000
│   .text (code)       │
│   .text.entry        │  ← _start lives here
├──────────────────────┤
│   .rodata            │  (read-only data)
├──────────────────────┤
│   .data              │  (initialized globals)
├──────────────────────┤
│   .stack             │  (16 KiB kernel stack)
│     _stack_bottom    │
│     _stack_top       │
├──────────────────────┤
│   .bss               │  (zeroed by boot.S)
│     _bss_start       │
│     _bss_end         │
├──────────────────────┤
│   heap               │  (remaining ~64 MiB)
│     _heap_start      │
│     _heap_end        │  (0x8800_0000)
└──────────────────────┘ 0x8800_0000 (128 MiB boundary)

CLINT: 0x0200_0000 (timer, IPI)
UART:  0x1000_0000 (NS16550A)
PLIC:  0x0C00_0000 (not yet used)
```

---

## 6. RISC-V Execution Mode

All code currently runs in **Machine Mode (M-mode)**.

Future target:
- M-mode: bootloader, firmware, secure monitor
- S-mode: kernel
- U-mode: user applications

The current approach (M-mode only) is acceptable for QEMU prototyping but must transition to S-mode kernel + U-mode userland for security.

---

## 7. Trap / Interrupt Handling

### Current State

- `mtvec` set to `_trap_entry` (direct mode)
- Timer interrupt (M-mode timer) handled, tick count incremented
- Unknown exceptions: `mepc += 4` (UNSAFE — wrong for compressed instructions and faults)
- No PLIC initialization — external interrupts unhandled
- No S-mode trap delegation

### Target State

- M-mode: firmware/bootloader only
- S-mode kernel with `stvec` trap vector
- U-mode userland with `ecall` → S-mode transition
- Proper exception classification (page fault, illegal instruction, breakpoint, etc.)
- PLIC for external interrupt routing
- Timer preemption for scheduler

---

## 8. Module Structure (Current)

```
kernel/
├── .cargo/config.toml     ← target + build-std
├── Cargo.toml              ← deps: spin, linked_list_allocator
├── build.rs                ← linker script path
├── linker.ld               ← memory layout + sections
├── rust-toolchain.toml     ← nightly
└── src/
    ├── main.rs             ← entry point, panic/OOM handlers
    ├── boot.S              ← assembly entry, BSS clear, stack
    ├── arch.rs             ← RISC-V trap vector, timer, CSR access
    ├── console.rs          ← NS16550A UART, print macros, read_line
    ├── memory.rs           ← heap allocator wrapper
    ├── process.rs          ← PID type + stub spawn/current
    ├── fs.rs               ← in-memory VFS
    ├── init.rs             ← init system (stub services)
    └── shell.rs            ← interactive shell with built-ins
```

---

## 9. Target Module Structure

```
kernel/
├── src/
│   ├── main.rs
│   ├── lib.rs                    ← crate root, feature gates
│   ├── arch/
│   │   ├── mod.rs
│   │   ├── riscv/
│   │   │   ├── mod.rs
│   │   │   ├── boot.S
│   │   │   ├── trap.rs           ← trap vector + dispatcher
│   │   │   ├── context.rs        ← register save/restore
│   │   │   ├── page_table.rs     ← Sv39 page tables
│   │   │   ├── csr.rs            ← CSR abstractions
│   │   │   └── timer.rs          ← CLINT timer
│   │   ├── x86_64/               ← (future)
│   │   └── aarch64/              ← (future)
│   ├── mm/
│   │   ├── mod.rs
│   │   ├── physical.rs           ← frame allocator
│   │   ├── virtual.rs            ← page tables, address spaces
│   │   ├── heap.rs               ← kernel heap
│   │   ├── regions.rs            ← memory regions
│   │   └── cow.rs                ← copy-on-write
│   ├── process/
│   │   ├── mod.rs
│   │   ├── pcb.rs                ← process control block
│   │   ├── thread.rs             ← thread management
│   │   ├── scheduler.rs          ← scheduler
│   │   ├── fork.rs               ← process creation
│   │   ├── exit.rs               ← process cleanup
│   │   └── wait.rs               ← wait/exit status
│   ├── ipc/
│   │   ├── mod.rs
│   │   ├── channel.rs
│   │   └── shared_mem.rs
│   ├── sync/
│   │   ├── mod.rs
│   │   ├── spinlock.rs
│   │   ├── mutex.rs
│   │   ├── semaphore.rs
│   │   └── condvar.rs
│   ├── syscall/
│   │   ├── mod.rs                ← syscall dispatcher
│   │   ├── process.rs
│   │   ├── memory.rs
│   │   ├── filesystem.rs
│   │   └── ipc.rs
│   ├── fs/
│   │   ├── mod.rs
│   │   ├── vfs.rs                ← VFS abstraction
│   │   ├── inode.rs
│   │   ├── fd.rs                 ← file descriptors
│   │   ├── ramfs.rs              ← in-memory FS
│   │   └── ext2/                 ← (future: persistent)
│   ├── drivers/
│   │   ├── mod.rs
│   │   ├── uart/
│   │   ├── timer/
│   │   ├── virtio/
│   │   └── ...
│   ├── net/
│   │   ├── mod.rs
│   │   └── ...
│   ├── security/
│   │   ├── mod.rs
│   │   ├── capabilities.rs
│   │   ├── crypto.rs
│   │   └── sandbox.rs
│   ├── console.rs
│   ├── shell/
│   │   ├── mod.rs
│   │   ├── parser.rs
│   │   ├── builtins.rs
│   │   └── execute.rs
│   └── init/
│       ├── mod.rs
│       ├── service.rs
│       └── loader.rs
```

---

## 10. Dependencies

### Current

| Crate | Version | Purpose | License |
|-------|---------|---------|---------|
| `spin` | 0.9 | Spinlock primitive | MIT/Apache-2.0 |
| `linked_list_allocator` | 0.10 | Heap allocator | MIT/Apache-2.0 |

### Planned

| Crate | Purpose | When |
|-------|---------|------|
| `bitflags` | Type-safe flag sets | Phase 1 |
| `spin` (keep) | Already present | — |
| `linked_list_allocator` (replace) | Replace with custom frame allocator | Phase 1 |

---

## 11. Build Targets

### QEMU RISC-V virt (Primary)

```
qemu-system-riscv64 \
  -machine virt \
  -bios none \
  -nographic \
  -serial mon:stdio \
  -m 256M \
  -kernel kernel/target/riscv64gc-unknown-none-elf/release/suraksha-kernel
```

### Future Targets

1. **Real RISC-V boards** — SiFive HiFive Unmatched, StarFive VisionFive 2
2. **RISC-V Android reference** — via HAL abstraction
3. **x86_64** — desktop support (long-term)
4. **AArch64** — mobile/ARM support (long-term)

---

## 12. Security Model (Target)

- Process isolation via virtual memory
- Capability-based access control
- Signed kernel and system images
- Secure boot chain
- Encrypted storage
- Per-app sandboxing with granular permissions
- No ambient authority — every resource access requires a capability

---

## 13. Concurrency Model (Target)

- Preemptive multitasking with priority scheduling
- Kernel threads (preemptible) and user threads
- Spinlocks for short critical sections
- Mutexes for longer waits
- Per-CPU run queues (future SMP)
- Lock ordering discipline documented in `docs/CONCURRENCY.md`
