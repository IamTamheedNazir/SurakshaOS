# SurakshaOS — Current Status (Audit)

**Audit date:** September 18, 2026 (M1 verification update: September 19, 2026)  
**Version:** 0.2.0 (per README)  
**Reality:** v0.1.0-alpha — bootable prototype with in-memory shell  
**Verification status:** M1 **hardware-verified** on QEMU — see [M1_VERIFICATION.md](M1_VERIFICATION.md)

---

## Executive Summary

SurakshaOS is a **bare-metal RISC-V kernel prototype** that boots on QEMU, transitions from M-mode to S-mode, initializes a UART console, sets up Sv39 virtual memory with per-process address spaces, provides an in-memory filesystem, and runs an interactive shell. The kernel runs in **S-mode** (supervisor), with a minimal M-mode handler for timer interrupts and the ecall bridge. This is a **very early prototype**.

No feature listed in the README as "Implemented" is fully real. The kernel boots and runs a shell, but there is no process management, no user/kernel mode split, no capability system, no cryptographic implementation, and no hardware abstraction beyond the UART.

---

## Component Classification

### Boot Path

| Component | Status | Notes |
|-----------|--------|-------|
| `boot.S` — entry point | **IMPLEMENTED** | Parks non-zero harts, clears BSS, sets up stack, calls `kernel_main` (M-mode init), configures medeleg/mideleg, transitions to S-mode via mret. Works for single-core QEMU. |
| `linker.ld` — linker script | **IMPLEMENTED** | Correct for 64 MB QEMU virt. Loads at `0x8000_0000`. Defines `.text`, `.rodata`, `.data`, `.stack` (16 KiB), `.bss`, heap. Discards `.eh_frame`. |
| `kernel_main` — Rust entry (M-mode) | **IMPLEMENTED** | Initializes PMA, heap, VMM (Sv39 paging). Returns to boot.S for M→S transition. |
| `kernel_main_s_mode` — Rust entry (S-mode) | **IMPLEMENTED** | S-mode trap init, VFS, init system, shell. Diverges (never returns). |
| BSS clearing | **IMPLEMENTED** | Done in `boot.S`. |
| Stack setup | **IMPLEMENTED** | 16 KiB stack for kernel. |
| Multicore boot | **STUB** | `bnez a0, _park` parks hart 1+. No real SMP startup. |

### Console / UART

| Component | Status | Notes |
|-----------|--------|-------|
| NS16550A UART driver | **IMPLEMENTED** | MMIO-based, blocking TX/RX. Works on QEMU virt. |
| `print!` / `println!` macros | **IMPLEMENTED** | Global `CONSOLE` mutex. Functional. |
| `read_line()` | **IMPLEMENTED** | Blocking with backspace, Ctrl-C, Ctrl-D. No arrow keys, no line editing. |
| Color support | **IMPLEMENTED** | ANSI color codes via `set_color()`. |
| Interrupt-driven I/O | **MISSING** | All I/O is polling-based. |

### Memory Management

| Component | Status | Notes |
|-----------|--------|-------|
| Heap allocator | **PARTIALLY IMPLEMENTED** | Uses `linked_list_allocator::LockedHeap`. Fixed region from `_heap_start` to `_heap_end`. Capped at 64 MB. Physical page allocator (PMA) exists. Sv39 page tables active. |
| `#[global_allocator]` | **IMPLEMENTED** | Rust global allocator wired up. |
| `#[alloc_error_handler]` | **IMPLEMENTED** | Panics on OOM. |
| Heap stats (`heap_used`/`heap_total`) | **IMPLEMENTED** | Exposed via allocator API. |
| Physical memory manager | **IMPLEMENTED** | Bitmap-based frame allocator in `kernel/src/pma.rs`. Manages 256 MiB / 65536 frames. Marks kernel region as reserved. |
| Virtual memory / page tables | **IMPLEMENTED** | Sv39 page tables in `kernel/src/vmm.rs`. Identity-mapped kernel region. Map/unmap/translate API. `satp` CSR write. |
| Memory regions / protections | **MISSING** | No per-process regions yet. |
| Guard pages | **MISSING** | |
| Copy-on-write | **MISSING** | |
| Memory reclamation | **MISSING** | |
| Shared memory | **MISSING** | |

### Architecture Support (RISC-V)

| Component | Status | Notes |
|-----------|--------|-------|
| M-mode trap vector (`mtvec`) | **IMPLEMENTED** | Minimal M-mode handler: timer interrupts + ecall bridge. |
| S-mode trap vector (`stvec`) | **IMPLEMENTED** | Full S-mode handler: all exceptions + delegated interrupts. Uses `sepc`/`sstatus`/`scause`/`stval`. |
| Timer interrupt (CLINT) | **IMPLEMENTED** | M-mode handler re-arms `mtimecmp`, increments `TICK_COUNT`, triggers SSI via `mip`. |
| S-mode trap context save/restore | **IMPLEMENTED** | Saves ALL 31 general-purpose registers + sepc/sstatus/scause/stval (280 bytes). |
| M-mode trap context save/restore | **IMPLEMENTED** | Minimal: ra, t0-t2, a0-a2, a7 + mepc/mstatus (96 bytes). |
| Exception handling (S-mode) | **IMPLEMENTED** | All exception codes classified (0-15+). Page faults advance `sepc+4`. Future: process termination. |
| Exception delegation (`medeleg`) | **IMPLEMENTED (verified)** | 0x51FF: sync exceptions 0–8, 12–14 to S-mode; ecall-from-S (9) and ecall-from-M (11) stay in M-mode. QEMU WARL-clears bits 4/6. |
| Interrupt delegation (`mideleg`) | **IMPLEMENTED (verified)** | 0x2: SSI to S-mode. Timer + external stay in M-mode. |
| Ecall bridge (S→M) | **IMPLEMENTED (verified)** | S-mode kernel uses `ecall` for timer setup and reboot via M-mode. Uptime/timer chain verified in QEMU. |
| M→S transition | **IMPLEMENTED (verified)** | MPP=S, MPIE, PMP full-4 GiB NAPOT grant (required by QEMU 6.2 mret rule), trap entries 4-byte aligned. S-mode confirmed at runtime via mscratch illegal-instruction probe. |
| CSR helpers | **PARTIALLY IMPLEMENTED** | Inline `asm!` for CSR access. No abstraction module. |
| U-mode support | **MISSING** | No user-mode transition yet. All processes run in S-mode. |
| Interrupt controller (PLIC) | **MISSING** | No PLIC initialization. External interrupts unhandled. |
| FPU / vector state | **MISSING** | |
| `sbi_ecall` / SBI calls | **MISSING** | Reimplements CLINT access directly instead of using SBI. |

### Process Management

| Component | Status | Notes |
|-----------|--------|-------|
| `ProcessId` type | **STUB** | Newtype wrapper around `usize`. |
| PID allocator | **STUB** | Atomic counter starting at 10. |
| `spawn_process()` | **STUB** | Allocates a PID number only. No process structure, no page table, no stack, no context. |
| `current_pid()` | **STUB** | Returns hardcoded atomic value (7). |
| Process table | **MISSING** | No table, no PCB, no process states. |
| Process lifecycle (create/run/exit/wait) | **MISSING** | |
| Parent/child relationships | **MISSING** | |
| Process isolation | **PARTIALLY IMPLEMENTED** | Per-process AddressSpace API with create/switch/destroy. Kernel mappings cloned to each space. No S-mode/U-mode split yet. |
| Resource accounting | **MISSING** | |
| Process groups | **MISSING** | |

### Scheduler

| Component | Status | Notes |
|-----------|--------|-------|
| Scheduler | **MISSING** | The shell runs as an infinite loop in `kernel_main`. No preemption, no run queues, no task switching. |
| Timer preemption | **MISSING** | Timer ticks are counted but never used for scheduling. |
| Thread management | **MISSING** | |
| Context switching | **MISSING** | |

### Init / Service Manager

| Component | Status | Notes |
|-----------|--------|-------|
| `InitSystem` struct | **STUB** | Creates fake service PIDs (hardcoded 2-6). No actual processes spawned. |
| `start_service()` | **STUB** | Returns hardcoded `ProcessId` values. No binary loading, no process creation. |
| Service status tracking | **STUB** | In-memory `Vec<Service>` with status enum. No actual running processes behind them. |
| Service dependencies | **MISSING** | |
| Service restart/health checks | **MISSING** | |
| PID 1 as real process | **MISSING** | Runs as a function call, not as an isolated process. |

### Filesystem / VFS

| Component | Status | Notes |
|-----------|--------|-------|
| In-memory VFS | **PARTIALLY IMPLEMENTED** | Tree of `VfsNode::File` and `VfsNode::Dir`. Mutex-protected. Supports create, read, write, delete, list, stat. |
| Path resolution | **PARTIALLY IMPLEMENTED** | Splits on `/`, walks tree. No symlinks, no `.`, no `..` at VFS level (shell handles `..`). |
| Persistent storage | **MISSING** | All data lost on reboot. No block device layer. |
| File permissions / metadata | **MISSING** | No permissions, no timestamps, no ownership. |
| Mounting / unmounting | **MISSING** | |
| File descriptors | **MISSING** | No FD abstraction. Shell reads directly from VFS. |
| Caching | **MISSING** | |
| Journaling / recovery | **MISSING** | |

### Shell (`sursh`)

| Component | Status | Notes |
|-----------|--------|-------|
| Command parsing | **PARTIALLY IMPLEMENTED** | Simple whitespace splitting. No quoting, no escaping, no globbing. |
| Built-in commands | **PARTIALLY IMPLEMENTED** | `ls`, `cd`, `pwd`, `cat`, `echo`, `mkdir`, `rm`, `touch`, `write`, `ps`, `mem`, `uptime`, `uname`, `env`, `export`, `history`, `clear`, `reboot`, `halt`, `about`. Functional against in-memory VFS. |
| `ps` command | **SIMULATED** | Prints hardcoded process table. No real processes exist. |
| `mem` command | **IMPLEMENTED** | Reports both PMA frame stats and heap usage with visual bars. |
| `uptime` command | **IMPLEMENTED** | Reads CLINT mtime directly. |
| `uname` command | **IMPLEMENTED** | Returns hardcoded string. |
| Environment variables | **PARTIALLY IMPLEMENTED** | In-memory `Vec<(String,String)>`. `$VAR` expansion works. Not passed to subprocesses (no subprocesses). |
| `captest` command | **SIMULATED** | Prints fake capability test results. No capability system exists. |
| `pqtest` command | **SIMULATED** | Prints fake post-quantum crypto results. No crypto is implemented. |
| Pipes | **MISSING** | |
| Redirection | **MISSING** | |
| Command substitution | **MISSING** | |
| Job control | **MISSING** | |
| Signal handling | **MISSING** | |
| Tab completion | **MISSING** | |
| Arrow key history | **MISSING** | |

### Security

| Component | Status | Notes |
|-----------|--------|-------|
| Capability system | **NOT IMPLEMENTED** | `captest` now honestly reports "NOT IMPLEMENTED". No capability tokens, no enforcement. |
| Cryptography | **NOT IMPLEMENTED** | `pqtest` now honestly reports "NOT IMPLEMENTED". No crypto code exists. |
| Secure boot | **MISSING** | |
| Process isolation | **MISSING** | |
| Sandboxing | **MISSING** | |
| Permission system | **MISSING** | |
| Secure RNG | **MISSING** | |
| Signed packages | **MISSING** | |
| Secure IPC | **MISSING** | |
| Audit logging | **MISSING** | |
| Encryption | **MISSING** | |

### Drivers

| Component | Status | Notes |
|-----------|--------|-------|
| UART (NS16550A) | **IMPLEMENTED** | Polling-based. Works. |
| CLINT timer | **PARTIALLY IMPLEMENTED** | Direct MMIO. Works for QEMU. |
| PLIC | **MISSING** | |
| VirtIO block | **MISSING** | |
| VirtIO network | **MISSING** | |
| VirtIO GPU | **MISSING** | |
| Input (keyboard) | **MISSING** | Only UART input. |
| Display / framebuffer | **MISSING** | |
| Audio | **MISSING** | |
| USB | **MISSING** | |
| Sensors | **MISSING** | |
| Wi-Fi / Bluetooth | **MISSING** | |

### Networking

| Component | Status | Notes |
|-----------|--------|-------|
| Network stack | **MISSING** | |
| Ethernet / ARP / IP / TCP / UDP | **MISSING** | |
| DNS / DHCP | **MISSING** | |
| Sockets | **MISSING** | |
| TLS | **MISSING** | |
| Firewall | **MISSING** | |

### Graphics / GUI

| Component | Status | Notes |
|-----------|--------|-------|
| Framebuffer | **MISSING** | |
| Compositor | **MISSING** | |
| Window system | **MISSING** | |
| UI toolkit | **MISSING** | |
| Touch | **MISSING** | |

### Build System

| Component | Status | Notes |
|-----------|--------|-------|
| Cargo build | **IMPLEMENTED** | `cargo build --release` for `riscv64gc-unknown-none-elf`. |
| Makefile | **PARTIALLY IMPLEMENTED** | `build`, `debug`, `run`, `check`, `fmt`, `clean` targets. |
| `rust-toolchain.toml` | **IMPLEMENTED** | Nightly with `rust-src` component. |
| `.cargo/config.toml` | **IMPLEMENTED** | Target and build-std configuration. |
| QEMU run command | **IMPLEMENTED** | In Makefile. |
| Reproducible builds | **MISSING** | No pinned nightly version. |
| Cross-compilation setup | **PARTIALLY IMPLEMENTED** | Single target only. |

### Testing

| Component | Status | Notes |
|-----------|--------|-------|
| Unit tests | **MISSING** | No `#[cfg(test)]` modules. No test files. |
| Integration tests | **MISSING** | |
| QEMU boot tests | **MISSING** | |
| Fuzzing | **MISSING** | |
| CI | **MISSING** | Only a manual-trigger cleanup workflow. |

### Documentation

| Component | Status | Notes |
|-----------|--------|-------|
| README.md | **MISLEADING** | Claims "Implemented: Basic memory management, HAL, cryptographic primitives, Minimal system interface". These are stubs/simulated, not implemented. |
| Architecture docs | **MISSING** | |
| API docs | **MISSING** | Rustdoc comments exist but are minimal. |
| Boot docs | **MISSING** | |
| Security docs | **MISSING** | |
| Hardware support docs | **MISSING** | |
| License audit | **MISSING** | |

### Community / Governance

| Component | Status | Notes |
|-----------|--------|-------|
| LICENSE file | **MISSING** | README says GPLv3 but no LICENSE file. |
| CONTRIBUTING.md | **MISSING** | |
| CODE_OF_CONDUCT.md | **MISSING** | |
| SECURITY.md | **MISSING** | |
| GOVERNANCE.md | **MISSING** | |
| CHANGELOG.md | **MISSING** | |
| Issue templates | **MISSING** | |
| PR template | **MISSING** | |

---

## Honest README vs Reality

| README Claim | Reality |
|-------------|---------|
| "Kernel boot (Rust)" | ✅ **Partially true** — boots on QEMU, runs M-mode code. |
| "Basic memory management" | ⚠️ **Exaggerated** — only a linked-list heap allocator. No virtual memory, no physical frame allocator. |
| "Hardware abstraction layer" | ❌ **False** — direct UART MMIO and CLINT MMIO. No HAL abstraction. |
| "Cryptographic primitives" | ❌ **False** — `pqtest` prints hardcoded fake output. Zero crypto code. |
| "Minimal system interface" | ⚠️ **Exaggerated** — interactive shell with built-in commands against in-memory VFS. Not a system interface. |
| "Capability-based, post-quantum ready" | ❌ **False** — both are simulated print statements. |

---

## What Actually Works

1. **Boot:** Kernel boots on `qemu-system-riscv64 -machine virt -bios none`
2. **UART:** Console output and input via NS16550A polling
3. **Timer:** CLINT timer interrupt fires, tick count increments
4. **Physical memory:** Bitmap-based frame allocator manages 256 MiB, reserves kernel region
5. **Virtual memory:** Sv39 page tables active, identity-mapped kernel region + MMIO
6. **Heap:** `linked_list_allocator` provides malloc/free via Rust `alloc`
7. **Trap handling:** Full register save/restore, classified exception handling
8. **M→S transition:** Kernel boots in M-mode, transitions to S-mode via medeleg/mideleg + mret
9. **S-mode trap handler:** All exceptions delegated to S-mode, full context save/restore
10. **Ecall bridge:** S-mode kernel uses ecall for timer setup and reboot services
11. **VFS:** In-memory directory tree with CRUD operations
12. **Shell:** Interactive shell (`sursh`) with ~20 built-in commands, memory stats
13. **Init banner:** Boot banner and service startup simulation

## What Does NOT Work

1. No real processes — everything is one call stack
2. No scheduler — no preemption, no task switching
3. No per-process address spaces — kernel uses Sv39 but no user/kernel separation
4. No U-mode — all code runs in S-mode or M-mode
5. No persistent storage — all data lost on reboot
5. No real capability system
6. No cryptography
7. No networking
8. No device drivers beyond UART
9. No user/kernel mode separation
10. No tests
11. No CI
12. No real documentation

---

## Summary Classification

| Category | Count |
|----------|-------|
| IMPLEMENTED | 11 |
| PARTIALLY IMPLEMENTED | 7 |
| STUB | 5 |
| NOT IMPLEMENTED | 2 (honestly reported) |
| MISSING | 42+ |
| NEEDS REDESIGN | 2 (process model, init system) |
