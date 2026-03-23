# 🇮🇳 SurakshaOS: India's Hyper-Secure Mobile Operating System

> **Building Digital Independence Through Formally Verified Security**

[![License: GPLv3](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)
[![RISC-V](https://img.shields.io/badge/ISA-RISC--V-orange.svg)](https://riscv.org/)
[![Rust](https://img.shields.io/badge/Language-Rust-red.svg)](https://www.rust-lang.org/)
[![Version](https://img.shields.io/badge/Version-0.2.0-brightgreen.svg)](https://github.com/IamTamheedNazir/SurakshaOS)
[![Status](https://img.shields.io/badge/Status-Active%20Development-blue.svg)](https://github.com/IamTamheedNazir/SurakshaOS)

---

## 🚀 What is SurakshaOS?

**SurakshaOS** is India's open-source, sovereign mobile operating system built from the ground up in **Rust** for **RISC-V (SHAKTI)** processors. It is designed to be:

- 🔒 **Hyper-Secure** — Capability-based security, post-quantum cryptography
- 🇮🇳 **Sovereign** — No foreign dependencies, runs on Indian SHAKTI hardware
- 🧠 **AI-Native** — On-device AI with 22 Indian languages (roadmap)
- 🔬 **Formally Verified** — Mathematical proof of kernel correctness (roadmap)
- 📱 **Mobile-First** — Designed for smartphones, not adapted from desktop

---

## ✅ Current Status — v0.2.0 (March 2026)

### What is actually working RIGHT NOW (boots in QEMU):

| Component | Status | Details |
|-----------|--------|---------|
| RISC-V boot + assembly init | ✅ Working | BSS clear, stack setup, trap vector |
| NS16550A UART driver | ✅ Working | Full bidirectional I/O |
| Buddy memory allocator | ✅ Working | Vec, String, Box — tested to 1MB+ |
| Sv39 virtual memory | ✅ Working | 3-level page tables, TLB flush |
| Context switching + scheduler | ✅ Working | 256 priority levels, round-robin |
| Trap + interrupt handler | ✅ Working | Exceptions, timer, ecall |
| System calls (~15) | ✅ Working | read, write, exit, yield |
| In-memory VFS + filesystem | ✅ Working | create, read, write, stat, list |
| **PID 1 Init system** | ✅ **NEW v0.2.0** | Starts services, launches shell |
| **sursh interactive shell** | ✅ **NEW v0.2.0** | 22 built-in commands |
| **UART console driver** | ✅ **NEW v0.2.0** | Line editing, Ctrl-C, Ctrl-D |
| TCP stack (state machine) | 🔄 Partial | No network driver yet |
| Device drivers | ❌ Planned | v0.3.0 |
| Post-quantum crypto | ❌ Planned | v0.3.0 |
| Formal verification | ❌ Planned | v0.4.0+ |

---

## 🖥️ sursh — The SurakshaOS Shell (NEW in v0.2.0)

SurakshaOS now has a fully interactive shell. When you boot the OS you get:

```
╔══════════════════════════════════════════════════════════════╗
║        सुरक्षा OS  —  SurakshaOS v0.2.0                      ║
║        India's Sovereign, Secure Mobile OS                  ║
║        Built with Rust + RISC-V                             ║
╚══════════════════════════════════════════════════════════════╝

  [init] Setting up filesystem... OK
  [init] Starting core services...
         ├─ memory-guard          [  OK  ]  pid=2
         ├─ capability-mgr        [  OK  ]  pid=3
         ├─ entropy-pool          [  OK  ]  pid=4
         ├─ device-manager        [  OK  ]  pid=5
         ├─ logger                [  OK  ]  pid=6
         └─ all services started

suraksha@suraksha-os:~$
```

### Shell commands

```
ls, cd, pwd, cat, echo, mkdir, rm, touch, write
ps, mem, uptime, uname, env, export
history, clear, reboot, halt
captest, pqtest, about
```

---

## 🏗️ Project Structure

```
SurakshaOS/
├── kernel/
│   └── src/
│       ├── main.rs          — Kernel entry point
│       ├── arch.rs          — RISC-V trap + timer
│       ├── memory.rs        — Buddy allocator
│       ├── process.rs       — PID, uptime, heap stats
│       ├── console.rs       — UART driver + print!/println!
│       ├── fs.rs            — VFS (create/read/write/stat/list)
│       ├── init.rs          — PID 1 init system  [NEW v0.2.0]
│       ├── shell.rs         — sursh interactive shell [NEW v0.2.0]
│       ├── capability.rs    — Capability-based security
│       ├── crypto/          — PQC stubs (ML-KEM, ML-DSA)
│       ├── drivers/         — Device driver stubs
│       ├── net/             — TCP/IP stack
│       └── scheduler.rs     — Process scheduler
├── sdk/                     — Developer SDK
├── userspace/               — Userspace apps
├── scripts/                 — Build scripts
└── examples/                — Example programs
```

---

## 🚀 Quick Start — Run SurakshaOS in QEMU

### 1. Install dependencies

```bash
# Install Rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# Add RISC-V target
rustup target add riscv64gc-unknown-none-elf

# Install QEMU (Ubuntu/Debian)
sudo apt-get install qemu-system-riscv64

# Install QEMU (macOS)
brew install qemu
```

### 2. Build

```bash
cd kernel
cargo build --release --target riscv64gc-unknown-none-elf
```

### 3. Run

```bash
qemu-system-riscv64 \
  -machine virt \
  -cpu rv64 \
  -m 128M \
  -nographic \
  -serial mon:stdio \
  -bios default \
  -kernel target/riscv64gc-unknown-none-elf/release/suraksha-kernel
```

> Press `Ctrl-A X` to exit QEMU.

---

## 🗺️ Roadmap

### ✅ v0.1.0 — Kernel Foundation (Done)
- RISC-V boot, memory management, scheduler, VFS, syscalls

### ✅ v0.2.0 — Interactive Shell (Done — March 2026)
- PID 1 init system
- sursh shell with 22 commands
- UART console driver with line editing

### 🔄 v0.3.0 — Networking (Next)
- virtio-net driver (real packet TX/RX)
- virtio-blk driver (persistent storage)
- Kernel-enforced capability tokens

### 📋 v0.4.0 — Security
- ML-KEM-768 post-quantum key exchange
- ML-DSA-65 digital signatures
- Encrypted filesystem

### 📋 v0.5.0 — Formal Verification
- Kani model checking on scheduler + allocator
- Isabelle/HOL proofs for kernel core

### 📋 v1.0.0 — Hardware (2027-2028)
- SHAKTI FPGA port
- Physical device prototype

---

## 🔒 Security Architecture

SurakshaOS is built on 5 security layers:

1. **Hardware** — SHAKTI PMP, HHAB secure boot, PUF authentication
2. **Kernel** — Formally verified microkernel, capability-based access
3. **Crypto** — Post-quantum (ML-KEM, ML-DSA, SLH-DSA)
4. **Application** — Sandboxed execution, per-app encryption keys
5. **Network** — TLS 1.3 + PQC cipher suites

---

## 🤝 Contributing

We welcome contributors! Areas to help:

- **Kernel** — drivers, memory management, IPC
- **Security** — formal verification, cryptography
- **Hardware** — SHAKTI FPGA integration
- **Apps** — userspace applications
- **Docs** — documentation in 22 Indian languages

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

---

## 📜 License

| Component | License |
|-----------|---------|
| Microkernel | GPLv3 |
| System Services | Apache 2.0 |
| Security Modules | GPLv3 |
| Documentation | CC BY-SA 4.0 |

---

## 🙏 Acknowledgments

- **seL4 Team** — Formal verification inspiration
- **Rust Community** — Memory-safe systems programming
- **SHAKTI Team (IIT Madras)** — Indigenous RISC-V processors
- **NIST** — Post-quantum cryptography standards

---

**SurakshaOS — Digital Independence for Every Indian** 🇮🇳

*Made with ❤️ by Tamheed Nazir and the open source community*
