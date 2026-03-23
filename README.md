

```markdown
<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=6,11,20&height=200&section=header&text=SurakshaOS&fontSize=80&fontColor=fff&animation=twinkling&fontAlignY=35&desc=🇮🇳%20India's%20Sovereign%20Mobile%20OS&descAlignY=55&descSize=20" width="100%"/>

# सुरक्षा OS

### India's Hyper-Secure, Sovereign Mobile Operating System
### Built with Rust · RISC-V · Post-Quantum Cryptography

<br/>

[![Version](https://img.shields.io/badge/Version-0.2.0-brightgreen?style=for-the-badge&logo=rust)](https://github.com/IamTamheedNazir/SurakshaOS)
[![Language](https://img.shields.io/badge/Language-Rust-orange?style=for-the-badge&logo=rust)](https://rust-lang.org)
[![Architecture](https://img.shields.io/badge/Arch-RISC--V-blue?style=for-the-badge)](https://riscv.org)
[![License](https://img.shields.io/badge/License-GPLv3-red?style=for-the-badge)](https://www.gnu.org/licenses/gpl-3.0)
[![Status](https://img.shields.io/badge/Status-Active%20Dev-yellow?style=for-the-badge)](https://github.com/IamTamheedNazir/SurakshaOS)
[![Made in India](https://img.shields.io/badge/Made%20in-India%20🇮🇳-green?style=for-the-badge)](https://github.com/IamTamheedNazir/SurakshaOS)

<br/>

> **"Digital Independence for Every Indian"**
> 
> Not just an OS. A movement.

<br/>

[⭐ Star this repo](https://github.com/IamTamheedNazir/SurakshaOS) • 
[🐛 Report Bug](https://github.com/IamTamheedNazir/SurakshaOS/issues) • 
[💡 Request Feature](https://github.com/IamTamheedNazir/SurakshaOS/issues) • 
[💬 Join Discord](https://discord.gg/suraksha-os)

</div>

---

## 🎯 What is SurakshaOS?

SurakshaOS is India's first open-source sovereign mobile operating system — built from **zero** in Rust, targeting RISC-V SHAKTI processors, with post-quantum cryptography and formal verification baked in from day one.

No Android. No iOS. No foreign dependencies. **Pure Indian digital sovereignty.**

---

## ✅ What Works Right Now — v0.2.0

> Honest status. No hype. Only what actually boots and runs.

```
┌─────────────────────────────────────────┬──────────┬─────────────────────────────┐
│ Component                               │ Status   │ Details                     │
├─────────────────────────────────────────┼──────────┼─────────────────────────────┤
│ RISC-V boot + assembly init             │ ✅ Done  │ Boots in QEMU               │
│ NS16550A UART driver                    │ ✅ Done  │ Full bidirectional I/O      │
│ Buddy memory allocator                  │ ✅ Done  │ Tested to 1MB+              │
│ Sv39 virtual memory (3-level paging)    │ ✅ Done  │ TLB flush, identity map     │
│ Context switching + round-robin sched   │ ✅ Done  │ 256 priority levels         │
│ Trap + interrupt handler                │ ✅ Done  │ Timer, exceptions, ecall    │
│ System calls (~15)                      │ ✅ Done  │ read, write, exit, yield    │
│ In-memory VFS + filesystem              │ ✅ Done  │ Full file operations        │
│ PID 1 Init system              🆕 v0.2 │ ✅ Done  │ Services + shell launcher   │
│ sursh interactive shell        🆕 v0.2 │ ✅ Done  │ 22 built-in commands        │
│ UART console driver            🆕 v0.2 │ ✅ Done  │ Line editing, history       │
│ TCP stack                               │ 🔄 50%  │ State machine, no driver    │
│ Device drivers (display, input, net)    │ ❌ Next  │ v0.3.0                      │
│ Post-quantum cryptography               │ ❌ Next  │ v0.3.0                      │
│ Formal verification proofs              │ ❌ Later │ v0.4.0+                     │
│ On-device AI / LLM                      │ ❌ Later │ v0.5.0+                     │
└─────────────────────────────────────────┴──────────┴─────────────────────────────┘
```

---

## 🖥️ sursh Shell — Live Demo

When you boot SurakshaOS v0.2.0 you get a real interactive shell:

```bash
╔══════════════════════════════════════════════════════════════╗
║        सुरक्षा OS  —  SurakshaOS v0.2.0                      ║
║        India's Sovereign, Secure Mobile OS                  ║
║        Built with Rust + RISC-V                             ║
╚══════════════════════════════════════════════════════════════╝

  [init] Setting up filesystem........... OK
  [init] Starting core services...
         ├─ memory-guard          [  OK  ]  pid=2
         ├─ capability-mgr        [  OK  ]  pid=3
         ├─ entropy-pool          [  OK  ]  pid=4
         ├─ device-manager        [  OK  ]  pid=5
         ├─ logger                [  OK  ]  pid=6
         └─ all services started

  SurakshaOS is ready. Type 'help' for commands.

suraksha@suraksha-os:~$ uname
SurakshaOS 0.2.0 RISC-V riscv64gc suraksha-kernel

suraksha@suraksha-os:~$ mem
  Heap used:  1 KB / 65536 KB  (0%)
  [░░░░░░░░░░░░░░░░░░░░]

suraksha@suraksha-os:~$ ps
  PID   NAME               STATUS
  ────  ─────────────────  ────────
  1     init               running
  2     memory-guard       running
  3     capability-mgr     running
  7     sursh              running  ← you are here
```

### 22 Built-in Commands

| Category | Commands |
|----------|----------|
| 📁 Files | `ls` `cd` `pwd` `cat` `mkdir` `rm` `touch` `write` |
| ⚙️ System | `ps` `mem` `uptime` `uname` `env` `export` |
| 🖥️ Shell | `history` `clear` `echo` `help` |
| 🔒 Security | `captest` `pqtest` |
| 📱 OS | `about` `reboot` `halt` |

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────┐
│                  USER SPACE                         │
│   sursh shell  │  init (PID 1)  │  system services  │
├─────────────────────────────────────────────────────┤
│              SURAKSHA KERNEL (SMK)                  │
│   Scheduler  │  Memory  │  IPC  │  Capabilities     │
├─────────────────────────────────────────────────────┤
│              HARDWARE ABSTRACTION                   │
│   RISC-V (QEMU virt)  →  SHAKTI C-Class (roadmap)  │
└─────────────────────────────────────────────────────┘
        100% Rust · no_std · riscv64gc target
```

### File Structure

```
SurakshaOS/
├── kernel/src/
│   ├── main.rs       — Kernel entry point
│   ├── console.rs    — UART driver + macros    🆕 v0.2.0
│   ├── fs.rs         — VFS + in-memory FS      ✨ updated
│   ├── init.rs       — PID 1 init system       🆕 v0.2.0
│   └── shell.rs      — sursh (22 commands)     🆕 v0.2.0
├── examples/         — Example Rust programs
├── scripts/          — Build automation
├── sdk/              — Developer SDK
└── userspace/        — Userspace app stubs
```

---

## 🚀 Run It Now

```bash
# 1. Install Rust + RISC-V target
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
rustup target add riscv64gc-unknown-none-elf

# 2. Install QEMU
sudo apt-get install qemu-system-riscv64   # Linux
brew install qemu                           # macOS

# 3. Clone + build
git clone https://github.com/IamTamheedNazir/SurakshaOS.git
cd SurakshaOS/kernel
cargo build --release --target riscv64gc-unknown-none-elf

# 4. Boot it
qemu-system-riscv64 \
  -machine virt -cpu rv64 -m 128M \
  -nographic -serial mon:stdio \
  -bios default \
  -kernel target/riscv64gc-unknown-none-elf/release/suraksha-kernel
```

> Press `Ctrl-A X` to exit QEMU

---

## 🗺️ Roadmap

```
2026 Q1  ██████████  v0.1.0 ✅  Kernel foundation (boot, memory, scheduler, VFS)
2026 Q1  ██████████  v0.2.0 ✅  sursh shell + PID 1 init + UART console
2026 Q2  ░░░░░░░░░░  v0.3.0 🔄  virtio-net, virtio-blk, real capability tokens
2026 Q3  ░░░░░░░░░░  v0.4.0 📋  ML-KEM-768 PQC + encrypted filesystem
2026 Q4  ░░░░░░░░░░  v0.5.0 📋  Kani model checking + Isabelle/HOL proofs
2027+    ░░░░░░░░░░  v1.0.0 📋  SHAKTI FPGA + physical device prototype
```

---

## 🔒 Security Vision

| Layer | Feature | Status |
|-------|---------|--------|
| Hardware | SHAKTI PMP, HHAB secure boot | 📋 Roadmap |
| Kernel | Capability-based access control | 🔄 In progress |
| Crypto | ML-KEM-768, ML-DSA-65, SLH-DSA | 📋 v0.3.0 |
| Application | Sandboxed execution, per-app keys | 📋 Roadmap |
| Network | TLS 1.3 + PQC cipher suites | 📋 Roadmap |

---

## 🤝 Contributing

```bash
# Pick an area and start contributing!
```

| Area | What to work on |
|------|----------------|
| 🔧 Kernel | virtio drivers, IPC, scheduling |
| 🔒 Security | capability tokens, PQC integration |
| 🖥️ Hardware | SHAKTI FPGA, device drivers |
| 📱 Apps | userspace applications in Rust |
| 📝 Docs | guides in 22 Indian languages |

See **[CONTRIBUTING.md](CONTRIBUTING.md)** to get started.

---

## 📜 License

| Component | License |
|-----------|---------|
| Kernel | GPLv3 |
| System Services | Apache 2.0 |
| Security Modules | GPLv3 |
| Documentation | CC BY-SA 4.0 |

---

<div align="center">

## 🙏 Built on the shoulders of giants

**seL4** · **Rust** · **SHAKTI (IIT Madras)** · **NIST PQC** · **RISC-V Foundation**

<br/>

**SurakshaOS — Digital Independence for Every Indian** 🇮🇳

*Built with ❤️ by Tamheed Nazir and the open source community*

<br/>

<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=6,11,20&height=100&section=footer" width="100%"/>

</div>
```

