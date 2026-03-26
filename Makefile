# SurakshaOS Build System
# ──────────────────────────────────────────────────────────────────────────────

KERNEL_DIR   := kernel
TARGET       := riscv64gc-unknown-none-elf
PROFILE      := release
KERNEL_ELF   := $(KERNEL_DIR)/target/$(TARGET)/$(PROFILE)/suraksha-kernel

QEMU         := qemu-system-riscv64
QEMU_ARGS    := -machine virt \
                -bios none \
                -nographic \
                -serial mon:stdio \
                -m 256M \
                -kernel $(KERNEL_ELF)

.PHONY: all build run clean fmt check

all: build

## Build the kernel ELF binary
build:
	cd $(KERNEL_DIR) && cargo build --release

## Build in debug mode
debug:
	cd $(KERNEL_DIR) && cargo build
	$(QEMU) $(subst release,debug,$(QEMU_ARGS))

## Run the kernel in QEMU (release mode)
run: build
	$(QEMU) $(QEMU_ARGS)

## Run clippy lints
check:
	cd $(KERNEL_DIR) && cargo clippy -- -D warnings

## Format all Rust source
fmt:
	cd $(KERNEL_DIR) && cargo fmt

## Remove build artefacts
clean:
	cd $(KERNEL_DIR) && cargo clean
