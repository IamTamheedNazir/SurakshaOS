#!/bin/bash
# SurakshaOS Build Script
# Automated setup and build for development

set -e  # Exit on error

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Print banner
echo -e "${BLUE}"
echo "╔═══════════════════════════════════════════════════════════╗"
echo "║                                                           ║"
echo "║   🇮🇳  SurakshaOS Build Script  🇮🇳                        ║"
echo "║                                                           ║"
echo "╚═══════════════════════════════════════════════════════════╝"
echo -e "${NC}"

# Check if Rust is installed
if ! command -v rustc &> /dev/null; then
    echo -e "${RED}✗ Rust is not installed!${NC}"
    echo -e "${YELLOW}Installing Rust...${NC}"
    curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
    source $HOME/.cargo/env
    echo -e "${GREEN}✓ Rust installed successfully!${NC}"
else
    echo -e "${GREEN}✓ Rust is already installed${NC}"
fi

# Check Rust version
RUST_VERSION=$(rustc --version)
echo -e "${BLUE}  $RUST_VERSION${NC}"

# Install required components
echo -e "\n${YELLOW}Installing required Rust components...${NC}"
rustup target add riscv64gc-unknown-none-elf
rustup target add aarch64-unknown-none
rustup component add rust-src
rustup component add llvm-tools-preview
rustup component add rustfmt
rustup component add clippy
echo -e "${GREEN}✓ Rust components installed${NC}"

# Check for QEMU
if ! command -v qemu-system-riscv64 &> /dev/null; then
    echo -e "\n${YELLOW}⚠ QEMU is not installed${NC}"
    echo -e "${YELLOW}Install QEMU to run the kernel in emulation:${NC}"
    echo -e "${BLUE}  Ubuntu/Debian: sudo apt-get install qemu-system-riscv64${NC}"
    echo -e "${BLUE}  macOS: brew install qemu${NC}"
else
    echo -e "\n${GREEN}✓ QEMU is installed${NC}"
    QEMU_VERSION=$(qemu-system-riscv64 --version | head -n1)
    echo -e "${BLUE}  $QEMU_VERSION${NC}"
fi

# Install Kani verifier (optional)
echo -e "\n${YELLOW}Installing Kani verifier (for formal verification)...${NC}"
if cargo install --list | grep -q "kani-verifier"; then
    echo -e "${GREEN}✓ Kani verifier is already installed${NC}"
else
    cargo install --locked kani-verifier || echo -e "${YELLOW}⚠ Kani installation failed (optional)${NC}"
    cargo kani setup || echo -e "${YELLOW}⚠ Kani setup failed (optional)${NC}"
fi

# Build kernel
echo -e "\n${BLUE}Building SurakshaOS kernel...${NC}"
make kernel

# Run tests
echo -e "\n${BLUE}Running tests...${NC}"
make test || echo -e "${YELLOW}⚠ Some tests failed${NC}"

# Format check
echo -e "\n${BLUE}Checking code formatting...${NC}"
make check-format || echo -e "${YELLOW}⚠ Code needs formatting (run 'make format')${NC}"

# Lint check
echo -e "\n${BLUE}Running linter...${NC}"
make lint || echo -e "${YELLOW}⚠ Linter found issues${NC}"

# Success message
echo -e "\n${GREEN}"
echo "╔═══════════════════════════════════════════════════════════╗"
echo "║                                                           ║"
echo "║   ✅  Build Complete!                                     ║"
echo "║                                                           ║"
echo "╚═══════════════════════════════════════════════════════════╝"
echo -e "${NC}"

echo -e "${BLUE}Next steps:${NC}"
echo -e "  ${YELLOW}make qemu${NC}       - Run kernel in QEMU"
echo -e "  ${YELLOW}make verify${NC}     - Run formal verification"
echo -e "  ${YELLOW}make docs${NC}       - Build documentation"
echo -e "  ${YELLOW}make help${NC}       - Show all available commands"
echo ""
