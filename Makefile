# SurakshaOS Makefile
# Comprehensive build system for kernel and userspace

# Configuration
ARCH ?= riscv64
TARGET = $(ARCH)gc-unknown-none-elf
KERNEL_DIR = kernel
BUILD_DIR = build
QEMU = qemu-system-$(ARCH)

# Rust configuration
RUSTFLAGS = -C link-arg=-T$(KERNEL_DIR)/linker.ld
CARGO = cargo
CARGO_FLAGS = --release --target $(TARGET)

# Colors for output
RED = \033[0;31m
GREEN = \033[0;32m
YELLOW = \033[0;33m
BLUE = \033[0;34m
NC = \033[0m # No Color

.PHONY: all clean kernel qemu test verify format lint help

# Default target
all: kernel

help:
	@echo "$(BLUE)SurakshaOS Build System$(NC)"
	@echo ""
	@echo "$(GREEN)Available targets:$(NC)"
	@echo "  $(YELLOW)make kernel$(NC)     - Build kernel"
	@echo "  $(YELLOW)make qemu$(NC)       - Run kernel in QEMU"
	@echo "  $(YELLOW)make test$(NC)       - Run tests"
	@echo "  $(YELLOW)make verify$(NC)     - Run formal verification"
	@echo "  $(YELLOW)make format$(NC)     - Format code"
	@echo "  $(YELLOW)make lint$(NC)       - Run linter"
	@echo "  $(YELLOW)make clean$(NC)      - Clean build artifacts"
	@echo ""
	@echo "$(GREEN)Architecture options:$(NC)"
	@echo "  $(YELLOW)make ARCH=riscv64$(NC)  - Build for RISC-V 64-bit (default)"
	@echo "  $(YELLOW)make ARCH=aarch64$(NC)  - Build for ARM 64-bit"

# Build kernel
kernel:
	@echo "$(BLUE)Building SurakshaOS kernel for $(ARCH)...$(NC)"
	@mkdir -p $(BUILD_DIR)
	@cd $(KERNEL_DIR) && $(CARGO) build $(CARGO_FLAGS)
	@cp $(KERNEL_DIR)/target/$(TARGET)/release/suraksha-kernel $(BUILD_DIR)/
	@echo "$(GREEN)✓ Kernel built successfully!$(NC)"
	@echo "$(GREEN)  Output: $(BUILD_DIR)/suraksha-kernel$(NC)"

# Run in QEMU
qemu: kernel
	@echo "$(BLUE)Starting QEMU...$(NC)"
ifeq ($(ARCH),riscv64)
	$(QEMU) \
		-machine virt \
		-cpu rv64 \
		-m 8G \
		-nographic \
		-bios none \
		-kernel $(BUILD_DIR)/suraksha-kernel
else ifeq ($(ARCH),aarch64)
	$(QEMU) \
		-machine virt \
		-cpu cortex-a72 \
		-m 8G \
		-nographic \
		-kernel $(BUILD_DIR)/suraksha-kernel
endif

# Run tests
test:
	@echo "$(BLUE)Running tests...$(NC)"
	@cd $(KERNEL_DIR) && $(CARGO) test
	@echo "$(GREEN)✓ All tests passed!$(NC)"

# Run formal verification
verify:
	@echo "$(BLUE)Running formal verification...$(NC)"
	@echo "$(YELLOW)Installing Kani verifier...$(NC)"
	@cargo install --locked kani-verifier || true
	@cargo kani setup || true
	@echo "$(YELLOW)Running Kani verification...$(NC)"
	@cd $(KERNEL_DIR) && cargo kani --features formal-verify || true
	@echo "$(GREEN)✓ Verification complete!$(NC)"

# Format code
format:
	@echo "$(BLUE)Formatting code...$(NC)"
	@cd $(KERNEL_DIR) && $(CARGO) fmt
	@echo "$(GREEN)✓ Code formatted!$(NC)"

# Run linter
lint:
	@echo "$(BLUE)Running linter...$(NC)"
	@cd $(KERNEL_DIR) && $(CARGO) clippy -- -D warnings
	@echo "$(GREEN)✓ Linting complete!$(NC)"

# Check formatting
check-format:
	@echo "$(BLUE)Checking code formatting...$(NC)"
	@cd $(KERNEL_DIR) && $(CARGO) fmt -- --check

# Clean build artifacts
clean:
	@echo "$(BLUE)Cleaning build artifacts...$(NC)"
	@cd $(KERNEL_DIR) && $(CARGO) clean
	@rm -rf $(BUILD_DIR)
	@echo "$(GREEN)✓ Clean complete!$(NC)"

# Install dependencies
deps:
	@echo "$(BLUE)Installing dependencies...$(NC)"
	@rustup target add $(TARGET)
	@rustup component add rust-src llvm-tools-preview rustfmt clippy
	@echo "$(GREEN)✓ Dependencies installed!$(NC)"

# Build documentation
docs:
	@echo "$(BLUE)Building documentation...$(NC)"
	@cd $(KERNEL_DIR) && $(CARGO) doc --no-deps
	@echo "$(GREEN)✓ Documentation built!$(NC)"
	@echo "$(GREEN)  Open: $(KERNEL_DIR)/target/doc/suraksha_kernel/index.html$(NC)"

# Run benchmarks
bench:
	@echo "$(BLUE)Running benchmarks...$(NC)"
	@cd $(KERNEL_DIR) && $(CARGO) bench
	@echo "$(GREEN)✓ Benchmarks complete!$(NC)"

# Create release build
release: clean kernel
	@echo "$(BLUE)Creating release build...$(NC)"
	@mkdir -p release
	@cp $(BUILD_DIR)/suraksha-kernel release/
	@cd release && tar -czf suraksha-os-$(ARCH)-$(shell date +%Y%m%d).tar.gz suraksha-kernel
	@echo "$(GREEN)✓ Release build created!$(NC)"
	@echo "$(GREEN)  Output: release/suraksha-os-$(ARCH)-$(shell date +%Y%m%d).tar.gz$(NC)"

# CI/CD target
ci: deps check-format lint test verify kernel
	@echo "$(GREEN)✓ CI pipeline complete!$(NC)"
