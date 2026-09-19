# SurakshaOS — Roadmap

**Living document — updated with every milestone completion.**

---

## Priority Legend

- **P0** — Blocks OS correctness/security (must fix before anything else)
- **P1** — Required for a usable OS
- **P2** — Required for mobile/desktop maturity
- **P3** — Future ecosystem features

---

## M0 — Bootable Prototype ✅ (Current State)

- [x] Boot on QEMU RISC-V virt
- [x] BSS clearing in boot assembly
- [x] Stack setup
- [x] UART console I/O (polling)
- [x] Basic heap allocator
- [x] Timer interrupt (CLINT)
- [x] In-memory VFS with shell
- [x] Interactive shell with built-in commands
- [x] Makefile build system

**Status:** COMPLETE (with caveats — see CURRENT_STATUS.md)

---

## M1 — Correct Kernel Foundation

**Goal:** Fix correctness issues. No new features — just make what exists safe and honest.

### P0 — Blocking Issues

- [x] **Fix trap context save/restore** — save ALL 31 general-purpose registers + sepc/sstatus/scause/stval (S-mode); M-mode handler saves minimal context
- [x] **Fix mepc advancement** — classify exceptions properly (access faults halt, breakpoints return to same PC, others advance sepc+4). Compressed instruction detection TODO.
- [x] **Remove simulated commands** — `captest` and `pqtest` report "NOT IMPLEMENTED" honestly
- [x] **Fix `ps` command** — reflects actual state (no real processes, says so honestly)
- [x] **Fix README claims** — rewritten to honestly reflect actual state
- [x] **Add LICENSE file** — GPLv3 as stated in README
- [x] **Pin Rust nightly** — pinned to nightly-2026-09-17 in `rust-toolchain.toml`

### P1 — Required for M1

- [x] **M-mode → S-mode transition** — boot.S configures `medeleg`/`mideleg`, `mret` to S-mode, S-mode trap handler with `stvec`
- [x] **M-mode trap delegation** — timer interrupts + ecall bridge handled in M-mode, exceptions delegated to S-mode
- [x] **S-mode trap handler** — full save/restore with sepc/sstatus/scause/stval, exception classification
- [x] **Ecall bridge (S→M)** — S-mode kernel uses `ecall` for timer and reboot services
- [ ] **Document build prerequisites** in README (rustup, cargo, qemu-system-riscv64)
- [x] **Add `rustfmt.toml`** with project formatting config
- [x] **Verify build** — `cargo build --release` succeeds, 0 warnings; `cargo fmt --check` and `cargo clippy -D warnings` pass (toolchain: nightly-2026-09-17, rust-src, riscv64gc target)
- [x] **Verify QEMU boot** — kernel boots and shell is accessible; M→S transition hardware-verified via mscratch illegal-instruction probe; delegated timer chain verified via uptime; see docs/M1_VERIFICATION.md
- [x] **Add .gitignore** — comprehensive for Rust projects
- [x] **M1 hardening fixes (2026-09-19)** — mstatus.MPP encoding (was M, now S), medeleg 0x51FF (bit 9/11 corrected), PMP full-memory NAPOT grant before mret (QEMU 6.2 requirement), stvec 4-byte alignment (.balign 4 on trap entries), sstatus SIE/SPP bit fixes in verification block

---

## M2 — Real Kernel (Phase 1 Core)

**Goal:** Processes, virtual memory, syscalls, proper scheduler.

### P0 — Kernel Memory

- [x] **Physical frame allocator** — bitmap allocator for physical frames (kernel/src/pma.rs)
- [x] **Sv39 page table support** — create, map, unmap, permissions (kernel/src/vmm.rs)
- [x] **Kernel address space** — identity-mapped for boot (kernel + MMIO), higher-half TODO
- [x] **User address spaces** — per-process page tables with kernel mapping clone (AddressSpace API)
- [ ] **Page fault handler** — proper classification (page faults classified in arch.rs, not yet handling VM faults)
- [ ] **Memory map discovery** — parse DTB memory node

### P0 — Process Model

- [x] **Process Control Block (PCB)** — real Process struct with ProcessSpace field (M2.1, kernel/src/process.rs)
- [x] **Process states** — New, Ready, Running, Blocked, Zombie, Dead with enforced transitions (M2.1)
- [ ] **Process creation** — fork/exec equivalent (M2.1 has direct `create_kernel_task`; fork/exec in M2.3+)
- [x] **Process destruction** — exit hook → Zombie → reap_exited frees stacks + private spaces (M2.1)
- [x] **Process table** — synchronized Mutex registry with create/lookup/enumerate/set_state/reap (M2.1)
- [x] **Parent/child relationships** — parent_pid recorded and validated (M2.1); wait() syscall M2.3
- [ ] **Process isolation** — via separate page tables (ownership exists; activation M2.3)

### P0 — Context Switching

- [x] **Scheduler context save/restore** — callee-saved ra/sp/s0-s11 via switch_context_asm; trap frames remain separate (M2.1)
- [x] **Per-thread kernel stack** — owned 64 KiB contiguous PMA allocation, freed at reap (M2.1; guard pages TD-028)
- [x] **Cooperative switch proof** — two kernel tasks alternate A/B through 10 real switches/boot, verified in QEMU (M2.1)
- [ ] **Switch between user processes** — save user context, switch page table, restore (M2.3)
- [ ] **Timer preemption** — scheduler tick from timer interrupt (M2.2)

### P0 — Scheduler

- [x] **Run queue** — implicit round-robin over the table's Ready threads, fair rotation after current TID (M2.1; explicit queue M2.2)
- [x] **Process states in scheduler** — enforced lifecycle drives scheduling (M2.1)
- [ ] **Preemptive scheduling** — round-robin via timer tick (M2.2; cooperative round-robin works now)
- [ ] **Sleep/wakeup** — blocking on I/O or events (M2.2; Blocked state reserved)
- [ ] **CPU idle** — when no process is ready (M2.2; boot-context resume works now)
- [ ] **Priority levels** (basic)

### P0 — Syscalls

- [ ] **Syscall ABI** — `ecall` → S-mode, register-based arguments
- [ ] **Syscall dispatcher** — route by syscall number
- [ ] **Initial syscall set:**
  - [ ] `exit` — terminate process
  - [ ] `wait` — wait for child
  - [ ] `read` / `write` — file descriptors
  - [ ] `open` / `close` — file descriptors
  - [ ] `brk` / `mmap` — memory management
  - [ ] `fork` — process creation
  - [ ] `getpid` / `getppid`
  - [ ] `sleep` — time-based wait
  - [ ] `yield` — voluntary reschedule

### P1 — Kernel Structure

- [ ] **Reorganize module hierarchy** — separate `arch/`, `mm/`, `process/`, `syscall/`, `fs/`, `drivers/`
- [ ] **Kernel log subsystem** — structured logging with levels
- [ ] **Error handling** — proper error enum, no panics for recoverable errors
- [ ] **Documentation** — document every module's purpose and interface

### P1 — User/Kernel Separation

- [x] **Move to S-mode kernel** — kernel runs in supervisor mode
- [ ] **User processes run in U-mode** — unprivileged
- [x] **Trap delegation** — S-mode handles traps from U-mode (via medeleg)
- [ ] **User pointer validation** — never trust user addresses (requires S-mode)

---

## M3 — Persistent OS (Phase 2)

**Goal:** File descriptors, persistent storage, ELF loader.

### P1 — File Descriptors

- [ ] **FD table per process**
- [ ] **Standard streams** — stdin, stdout, stderr
- [ ] **FD operations** — open, close, read, write, seek, dup
- [ ] **Pipe support** — inter-process communication via pipes
- [ ] **Device FDs** — UART as `/dev/console`

### P1 — Block Layer

- [ ] **Block device abstraction**
- [ ] **VirtIO block driver** — read/write blocks from QEMU disk image
- [ ] **Buffer cache** — cache recently accessed blocks

### P1 — Persistent Filesystem

- [ ] **Simple filesystem** — FAT32 or custom for initial support
- [ ] **Mount/unmount** — filesystem mounting
- [ ] **File permissions** (basic)
- [ ] **File metadata** — timestamps, size

### P1 — Executable Loader

- [ ] **ELF parser** — load ELF64 executables
- [ ] **Program header loading** — map segments into user address space
- [ ] **Stack setup** — user stack with arguments and environment
- [ ] **Entry point** — jump to user-mode entry

### P1 — Init

- [ ] **PID 1 as real process** — proper init process, not a function call
- [ ] **Service management** — spawn services as processes
- [ ] **Reap zombies** — wait for child processes

---

## M4 — Secure OS (Phase 4)

**Goal:** Capabilities, sandboxing, crypto, secure boot.

### P0 — Security Foundation

- [ ] **Secure RNG** — hardware RNG or deterministic RNG from entropy sources
- [ ] **Capability tokens** — real capability system with enforcement
- [ ] **Capability checks** — every resource access verified
- [ ] **Process credentials** — UID/GID equivalent
- [ ] **File permissions** — basic access control

### P1 — Cryptography

- [ ] **Hashing** — SHA-256 via well-reviewed implementation
- [ ] **Signing** — Ed25519 or equivalent
- [ ] **Symmetric encryption** — AES or ChaCha20
- [ ] **TLS architecture** — for future network security

### P1 — Sandboxing

- [ ] **Per-process sandbox** — restrict filesystem, network, devices
- [ ] **Resource limits** — memory, CPU, FD count
- [ ] **Audit logging** — security event logging

### P1 — Secure Boot

- [ ] **Boot chain verification** — signed kernel image
- [ ] **Rollback protection** — version anti-rollback
- [ ] **Verified system services**

---

## M5 — Networked OS (Phase 5)

### P1 — Networking

- [ ] **VirtIO-net driver**
- [ ] **Ethernet frame handling**
- [ ] **ARP**
- [ ] **IPv4 stack** — IP, ICMP, UDP, TCP
- [ ] **DHCP client**
- [ ] **DNS resolver**
- [ ] **Socket API** — BSD-style sockets
- [ ] **Basic firewall**

---

## M6 — Graphical OS (Phase 7)

### P2 — Graphics

- [ ] **Framebuffer driver**
- [ ] **Display abstraction**
- [ ] **Input events** — keyboard, mouse
- [ ] **Simple compositor**
- [ ] **Window management**
- [ ] **Basic UI toolkit** — buttons, text, layouts
- [ ] **Desktop shell** — home screen, app launcher, status bar

---

## M7 — Mobile OS (Phase 8)

### P2 — Mobile

- [ ] **Touchscreen driver**
- [ ] **Multitouch / gestures**
- [ ] **Wi-Fi driver**
- [ ] **Bluetooth stack**
- [ ] **Camera abstraction**
- [ ] **Sensors** (accelerometer, gyroscope, etc.)
- [ ] **Power management** — battery, charging, suspend/resume
- [ ] **Orientation / rotation**
- [ ] **Mobile shell** — notification center, quick settings, lock screen

---

## M8 — App Platform (Phase 9)

### P2 — Application Ecosystem

- [ ] **Application manifest format**
- [ ] **Permission system** — per-app permissions
- [ ] **Package format** — signed, versioned packages
- [ ] **Package manager CLI**
- [ ] **System libraries** — libsuraksha
- [ ] **Application SDK**
- [ ] **Sandbox enforcement** — filesystem, network, device restrictions

### P3 — Future

- [ ] **App store** — signed repository
- [ ] **OTA updates** — signed, verifiable, A/B
- [ ] **Recovery system** — diagnostics, factory reset
- [ ] **Android compatibility** — compatibility layer (long-term investigation)

---

## Milestone Status

| Milestone | Status | Target |
|-----------|--------|--------|
| M0 — Bootable Prototype | ✅ Complete | Done |
| M1 — Correct Kernel | ✅ Verified | Hardware-verified on QEMU (see docs/M1_VERIFICATION.md) |
| M2 — Real Kernel | 🔄 M2.1 Done | Process/thread foundation verified; next M2.2 preemption |
| M3 — Persistent OS | ⏳ Pending | After M2 |
| M4 — Secure OS | ⏳ Pending | After M3 |
| M5 — Networked OS | ⏳ Pending | After M4 |
| M6 — Graphical OS | ⏳ Pending | After M5 |
| M7 — Mobile OS | ⏳ Pending | After M6 |
| M8 — App Platform | ⏳ Pending | After M7 |

---

## Known Blockers

1. **No virtual memory protection** — kernel and user share address space (no U-mode yet)
2. **No real processes** — shell runs on kernel stack in S-mode
3. **No scheduler** — no preemption, no task switching
4. **No U-mode** — all code runs in S-mode, no user/kernel mode split
5. **No CI** — no automated verification
6. **No tests** — no regression detection
