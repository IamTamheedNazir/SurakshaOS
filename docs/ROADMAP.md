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

- [ ] **Fix trap context save/restore** — save ALL 33 general-purpose registers, mepc, mstatus, mcause, mtval
- [ ] **Fix mepc advancement** — do not blindly advance mepc+4; handle compressed instructions (C-extension) and faults properly
- [ ] **Remove simulated commands** — `captest` and `pqtest` must not print fake success
- [ ] **Fix `ps` command** — must reflect actual state (currently hardcoded)
- [ ] **Fix README claims** — remove false claims about implemented features
- [ ] **Add LICENSE file** — GPLv3 as stated in README
- [ ] **Pin Rust nightly** — add specific date to `rust-toolchain.toml`

### P1 — Required for M1

- [ ] **Document build prerequisites** in README (rustup, cargo, qemu-system-riscv64)
- [ ] **Add `rustfmt.toml`** with project formatting config
- [ ] **Verify build** — `cargo build --release` succeeds
- [ ] **Verify QEMU boot** — kernel boots and shell is accessible
- [ ] **Add .gitignore** — comprehensive for Rust projects

---

## M2 — Real Kernel (Phase 1 Core)

**Goal:** Processes, virtual memory, syscalls, proper scheduler.

### P0 — Kernel Memory

- [x] **Physical frame allocator** — bitmap allocator for physical frames (kernel/src/pma.rs)
- [ ] **Sv39 page table support** — create, map, unmap, permissions
- [ ] **Kernel address space** — separate kernel virtual memory
- [ ] **User address spaces** — isolated per-process
- [ ] **Page fault handler** — proper classification and response
- [ ] **Memory map discovery** — parse DTB memory node

### P0 — Process Model

- [ ] **Process Control Block (PCB)** — full process structure
- [ ] **Process states** — Created, Ready, Running, Waiting, Zombie, Dead
- [ ] **Process creation** — fork/exec equivalent
- [ ] **Process destruction** — exit, wait, cleanup
- [ ] **Process table** — indexed by PID
- [ ] **Parent/child relationships**
- [ ] **Process isolation** — via separate page tables

### P0 — Context Switching

- [ ] **Full register save/restore** — all 33 GP regs + CSRs
- [ ] **Per-process kernel stack**
- [ ] **Switch between user processes** — save user context, switch page table, restore
- [ ] **Timer preemption** — scheduler tick from timer interrupt

### P0 — Scheduler

- [ ] **Run queue** — linked list of ready processes
- [ ] **Process states in scheduler**
- [ ] **Preemptive scheduling** — round-robin initially
- [ ] **Sleep/wakeup** — blocking on I/O or events
- [ ] **CPU idle** — when no process is ready
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

- [ ] **Move to S-mode kernel** — kernel runs in supervisor mode
- [ ] **User processes run in U-mode** — unprivileged
- [ ] **Trap delegation** — S-mode handles traps from U-mode
- [ ] **User pointer validation** — never trust user addresses

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
| M1 — Correct Kernel | 🔄 In Progress | Next |
| M2 — Real Kernel | ⏳ Pending | After M1 |
| M3 — Persistent OS | ⏳ Pending | After M2 |
| M4 — Secure OS | ⏳ Pending | After M3 |
| M5 — Networked OS | ⏳ Pending | After M4 |
| M6 — Graphical OS | ⏳ Pending | After M5 |
| M7 — Mobile OS | ⏳ Pending | After M6 |
| M8 — App Platform | ⏳ Pending | After M7 |

---

## Known Blockers

1. **Trap context is broken** — cannot safely context-switch without saving all registers
2. **No virtual memory** — cannot isolate processes
3. **No real processes** — shell runs on kernel stack
4. **No scheduler** — no preemption
5. **Pinned nightly not set** — builds may break with toolchain updates
6. **No LICENSE file** — legal issue for open source
7. **No CI** — no automated verification
8. **No tests** — no regression detection
