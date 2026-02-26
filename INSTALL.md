# SurakshaOS Installation Guide

Complete guide to install and run SurakshaOS.

## 📋 Prerequisites

### Hardware Requirements
- **CPU**: RISC-V or ARM 64-bit processor
- **RAM**: 8GB minimum (16GB recommended)
- **Storage**: 20GB free space
- **Display**: 1080p or higher

### Supported Platforms
- ✅ QEMU (emulator) - RISC-V, ARM
- ✅ SHAKTI C-Class FPGA
- ✅ ARM development boards (RaspberryPi 4+, etc.)
- 🔄 Production devices (coming soon)

---

## 🚀 Quick Install (QEMU)

### 1. Install Dependencies

**Ubuntu/Debian:**
```bash
sudo apt-get update
sudo apt-get install -y \
    curl git build-essential \
    qemu-system-riscv64 qemu-system-aarch64
```

**macOS:**
```bash
brew install qemu
```

**Fedora:**
```bash
sudo dnf install qemu-system-riscv qemu-system-aarch64
```

### 2. Clone Repository

```bash
git clone https://github.com/IamTamheedNazir/SurakshaOS.git
cd SurakshaOS
```

### 3. Run Automated Setup

```bash
chmod +x build.sh
./build.sh
```

This will:
- Install Rust toolchain
- Install required components
- Build the kernel
- Run tests

### 4. Boot in QEMU

```bash
# RISC-V
make ARCH=riscv64 qemu

# ARM
make ARCH=aarch64 qemu
```

**Exit QEMU**: Press `Ctrl+A` then `X`

---

## 🔧 Manual Installation

### 1. Install Rust

```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
source $HOME/.cargo/env
```

### 2. Install Rust Components

```bash
# RISC-V target
rustup target add riscv64gc-unknown-none-elf

# ARM target
rustup target add aarch64-unknown-none

# Additional components
rustup component add rust-src llvm-tools-preview rustfmt clippy
```

### 3. Build Kernel

```bash
cd kernel
cargo build --release --target riscv64gc-unknown-none-elf
```

### 4. Create Bootable Image

```bash
# Using Makefile
make kernel

# Output: build/suraksha-kernel
```

---

## 🖥️ SHAKTI FPGA Installation

### Prerequisites
- SHAKTI C-Class FPGA board
- OpenOCD
- JTAG debugger

### 1. Install OpenOCD

```bash
sudo apt-get install openocd
```

### 2. Build for SHAKTI

```bash
make ARCH=riscv64 FEATURES=shakti kernel
```

### 3. Flash to FPGA

```bash
./scripts/deploy.sh shakti riscv64
```

Or manually:
```bash
openocd -f shakti.cfg \
    -c "program build/suraksha-kernel verify reset exit"
```

---

## 📱 Physical Device Installation

### Prerequisites
- Unlocked bootloader
- fastboot/adb tools
- USB cable

### 1. Install Tools

```bash
sudo apt-get install android-tools-adb android-tools-fastboot
```

### 2. Boot Device to Fastboot

```bash
# Power off device
# Hold Volume Down + Power
# Select "Fastboot Mode"
```

### 3. Flash Kernel

```bash
./scripts/deploy.sh device
```

Or manually:
```bash
fastboot flash boot build/suraksha-kernel
fastboot reboot
```

---

## 🧪 Development Setup

### 1. Install Development Tools

```bash
# Kani verifier (formal verification)
cargo install --locked kani-verifier
cargo kani setup

# Additional tools
cargo install cargo-watch cargo-expand
```

### 2. Set Up IDE

**VS Code:**
```bash
# Install extensions
code --install-extension rust-lang.rust-analyzer
code --install-extension vadimcn.vscode-lldb
```

**Vim/Neovim:**
```bash
# Install rust.vim and coc-rust-analyzer
```

### 3. Run Development Server

```bash
# Watch for changes and rebuild
cargo watch -x build

# Run tests on change
cargo watch -x test
```

---

## 🔍 Verification

### Run Tests

```bash
# All tests
./scripts/test.sh

# Specific tests
make test
make verify
make bench
```

### Check Installation

```bash
# Kernel version
./build/suraksha-kernel --version

# System info
make qemu
# Inside QEMU, check boot messages
```

---

## 🐛 Troubleshooting

### Build Fails

**Error**: `target not found`
```bash
rustup target add riscv64gc-unknown-none-elf
```

**Error**: `linker not found`
```bash
sudo apt-get install gcc-riscv64-unknown-elf
```

### QEMU Issues

**Error**: `qemu-system-riscv64 not found`
```bash
sudo apt-get install qemu-system-riscv64
```

**Error**: `kernel doesn't boot`
- Check linker script
- Verify memory layout
- Check boot logs

### FPGA Issues

**Error**: `OpenOCD connection failed`
- Check JTAG connections
- Verify FPGA power
- Check OpenOCD configuration

---

## 📊 Performance Tuning

### Optimize Build

```bash
# Release build with LTO
cargo build --release

# Size optimization
RUSTFLAGS="-C opt-level=z" cargo build --release
```

### Enable Hardware Features

```bash
# SHAKTI-specific optimizations
make ARCH=riscv64 FEATURES=shakti kernel

# ARM RME support
make ARCH=aarch64 FEATURES=arm-rme kernel
```

---

## 🔄 Updates

### Update SurakshaOS

```bash
cd SurakshaOS
git pull origin main
./build.sh
```

### Update Rust Toolchain

```bash
rustup update
```

---

## 📚 Next Steps

After installation:

1. **Read Documentation**
   - [Quick Start Guide](QUICK_START.md)
   - [Developer Guide](CONTRIBUTING.md)
   - [API Documentation](https://docs.suraksha-os.in)

2. **Try Examples**
   ```bash
   cd examples/hello-world
   cargo build
   ```

3. **Join Community**
   - Discord: https://discord.gg/suraksha-os
   - Forum: https://forum.suraksha-os.in

4. **Contribute**
   - See [CONTRIBUTING.md](CONTRIBUTING.md)
   - Pick an issue from GitHub

---

## 🆘 Getting Help

- **Documentation**: https://docs.suraksha-os.in
- **Discord**: https://discord.gg/suraksha-os
- **GitHub Issues**: https://github.com/IamTamheedNazir/SurakshaOS/issues
- **Email**: support@suraksha-os.in

---

## 📄 License

SurakshaOS is licensed under GPL-3.0. See [LICENSE](LICENSE) for details.

---

**Welcome to SurakshaOS! 🇮🇳**
