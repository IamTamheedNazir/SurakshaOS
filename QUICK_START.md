# 🚀 SurakshaOS Quick Start Guide

Get up and running with SurakshaOS development in 5 minutes!

---

## Prerequisites

- **Linux** (Ubuntu 20.04+, Debian 11+, Fedora 35+) or **macOS** (11+)
- **8GB RAM** minimum (16GB recommended)
- **20GB disk space**
- **Internet connection** (for downloading dependencies)

---

## One-Command Setup

```bash
# Clone repository
git clone https://github.com/IamTamheedNazir/SurakshaOS.git
cd SurakshaOS

# Run automated build script
chmod +x build.sh
./build.sh
```

This script will:
1. ✅ Install Rust (if not already installed)
2. ✅ Install required Rust components
3. ✅ Install QEMU (if available)
4. ✅ Install Kani verifier (optional)
5. ✅ Build the kernel
6. ✅ Run tests
7. ✅ Check code formatting
8. ✅ Run linter

---

## Manual Setup

### 1. Install Rust

```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
source $HOME/.cargo/env
```

### 2. Install Rust Components

```bash
rustup target add riscv64gc-unknown-none-elf
rustup target add aarch64-unknown-none
rustup component add rust-src llvm-tools-preview rustfmt clippy
```

### 3. Install QEMU (Optional, for emulation)

**Ubuntu/Debian:**
```bash
sudo apt-get update
sudo apt-get install qemu-system-riscv64 qemu-system-aarch64
```

**macOS:**
```bash
brew install qemu
```

**Fedora:**
```bash
sudo dnf install qemu-system-riscv qemu-system-aarch64
```

### 4. Install Kani Verifier (Optional, for formal verification)

```bash
cargo install --locked kani-verifier
cargo kani setup
```

---

## Build Commands

### Build Kernel

```bash
make kernel
```

**Output**: `build/suraksha-kernel`

### Run in QEMU

```bash
make qemu
```

**Exit QEMU**: Press `Ctrl+A` then `X`

### Run Tests

```bash
make test
```

### Format Code

```bash
make format
```

### Run Linter

```bash
make lint
```

### Formal Verification

```bash
make verify
```

### Build Documentation

```bash
make docs
```

**Open**: `kernel/target/doc/suraksha_kernel/index.html`

### Clean Build

```bash
make clean
```

---

## Architecture Options

### Build for RISC-V (default)

```bash
make ARCH=riscv64 kernel
make ARCH=riscv64 qemu
```

### Build for ARM

```bash
make ARCH=aarch64 kernel
make ARCH=aarch64 qemu
```

---

## Project Structure

```
SurakshaOS/
├── kernel/                 # Kernel source code
│   ├── src/
│   │   ├── main.rs        # Kernel entry point
│   │   ├── boot.rs        # Boot subsystem
│   │   ├── memory.rs      # Memory management
│   │   ├── capability.rs  # Capability system
│   │   ├── ipc.rs         # Zero-copy IPC
│   │   ├── scheduler.rs   # Deterministic scheduler
│   │   ├── syscall.rs     # System calls
│   │   ├── crypto/        # Post-quantum crypto
│   │   │   ├── pqc.rs     # ML-KEM, ML-DSA, SLH-DSA
│   │   │   ├── symmetric.rs # AES-256-GCM
│   │   │   └── hash.rs    # SHAKE-256
│   │   ├── fs/            # Encrypted filesystem
│   │   │   ├── encrypted.rs
│   │   │   └── vfs.rs
│   │   └── drivers/       # Device drivers
│   └── Cargo.toml         # Rust configuration
├── Makefile               # Build system
├── build.sh               # Automated setup script
├── README.md              # Project overview
├── ROADMAP.md             # Development roadmap
├── CONTRIBUTING.md        # Contribution guidelines
└── DEVELOPMENT_STATUS.md  # Current progress
```

---

## Development Workflow

### 1. Create Feature Branch

```bash
git checkout -b feature/my-feature
```

### 2. Make Changes

Edit files in `kernel/src/`

### 3. Format Code

```bash
make format
```

### 4. Run Tests

```bash
make test
```

### 5. Run Linter

```bash
make lint
```

### 6. Commit Changes

```bash
git add .
git commit -s -m "feat: Add my feature"
```

**Note**: Use `-s` flag to sign commits (required)

### 7. Push to GitHub

```bash
git push origin feature/my-feature
```

### 8. Create Pull Request

Go to GitHub and create a pull request from your branch.

---

## Common Issues

### Issue: Rust not found

**Solution**:
```bash
source $HOME/.cargo/env
```

### Issue: Target not found

**Solution**:
```bash
rustup target add riscv64gc-unknown-none-elf
```

### Issue: QEMU not found

**Solution**: Install QEMU (see installation instructions above)

### Issue: Build fails with linker error

**Solution**: Make sure you have the correct target installed:
```bash
rustup target add riscv64gc-unknown-none-elf
rustup component add rust-src
```

---

## Next Steps

### For Developers

1. Read [CONTRIBUTING.md](CONTRIBUTING.md) for contribution guidelines
2. Check [DEVELOPMENT_STATUS.md](DEVELOPMENT_STATUS.md) for current progress
3. Join our [Discord](https://discord.gg/suraksha-os) community
4. Pick an issue from [GitHub Issues](https://github.com/IamTamheedNazir/SurakshaOS/issues)

### For Researchers

1. Read [RESEARCH.md](RESEARCH.md) for technical details
2. Review formal verification proofs (coming soon)
3. Check out our academic papers (coming soon)
4. Collaborate on research projects

### For Users

1. Follow development progress on GitHub
2. Try the kernel in QEMU
3. Report bugs and issues
4. Spread the word!

---

## Getting Help

- **Documentation**: [docs.suraksha-os.in](https://docs.suraksha-os.in)
- **Discord**: [Join Server](https://discord.gg/suraksha-os)
- **GitHub Discussions**: [Ask Questions](https://github.com/IamTamheedNazir/SurakshaOS/discussions)
- **Email**: dev@suraksha-os.in

---

## Performance Benchmarks

### IPC Performance

```bash
# Run IPC benchmarks
cd kernel
cargo bench --bench ipc
```

**Expected Results**:
- Latency: <500ns
- Throughput: >10M messages/second
- 7-13x faster than traditional IPC

### Memory Allocation

```bash
# Run memory benchmarks
cargo bench --bench memory
```

**Expected Results**:
- Allocation: <1μs
- Deallocation: <500ns
- Zero fragmentation (buddy allocator)

### Context Switch

```bash
# Run scheduler benchmarks
cargo bench --bench scheduler
```

**Expected Results**:
- Context switch: <1μs
- Scheduling decision: <100ns
- Deterministic timing

---

## Formal Verification

### Run Kani Verification

```bash
make verify
```

This will verify:
- ✅ Memory safety (no buffer overflows, use-after-free)
- ✅ Capability correctness (unforgeable tokens)
- ✅ IPC correctness (message delivery guarantees)
- ✅ Scheduler correctness (no starvation)

### View Verification Results

```bash
cd kernel
cargo kani --features formal-verify --verbose
```

---

## Contributing

We welcome contributions! See [CONTRIBUTING.md](CONTRIBUTING.md) for:

- Code style guidelines
- Commit message format
- Pull request process
- Testing requirements
- Formal verification requirements

---

## License

- **Kernel**: GPLv3
- **System Services**: Apache 2.0
- **Documentation**: CC BY-SA 4.0

See [LICENSE](LICENSE) for details.

---

<div align="center">

## 🇮🇳 **Building Digital Independence** 🌍

**Join us in creating the world's most advanced mobile operating system!**

[⭐ Star on GitHub](https://github.com/IamTamheedNazir/SurakshaOS) | 
[💬 Join Discord](https://discord.gg/suraksha-os) | 
[📧 Contact Us](mailto:dev@suraksha-os.in)

</div>
