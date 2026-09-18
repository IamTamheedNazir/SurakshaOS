# Contributing to SurakshaOS

Thank you for your interest in contributing to SurakshaOS — India's sovereign mobile operating system.

## Getting Started

### Prerequisites

1. **Rust nightly toolchain** — install via [rustup](https://rustup.rs/):
   ```bash
   curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
   rustup install nightly
   rustup component add rust-src --toolchain nightly
   ```

2. **QEMU** (for testing):
   ```bash
   # Ubuntu/Debian
   sudo apt install qemu-system-misc
   
   # macOS
   brew install qemu
   ```

### Building

```bash
cd kernel
cargo build --release
```

### Running

```bash
cd kernel
cargo build --release && qemu-system-riscv64 \
  -machine virt -bios none -nographic \
  -serial mon:stdio -m 256M \
  -target/riscv64gc-unknown-none-elf/release/suraksha-kernel
```

Or use the Makefile: `make run`

## Development Workflow

1. **Fork** the repository
2. **Create a branch** from `main`:
   - `feature/description` for new features
   - `fix/description` for bug fixes
   - `security/description` for security-sensitive changes
3. **Make changes** in logical commits
4. **Verify** your changes:
   ```bash
   cargo fmt --check   # Formatting
   cargo clippy -- -D warnings  # Lints
   cargo build --release  # Build
   ```
5. **Test** in QEMU if applicable
6. **Submit a Pull Request** against `main`

## Code Standards

### Rust Style
- Follow `rustfmt` defaults (run `cargo fmt` before committing)
- Address all `clippy` warnings (run `cargo clippy -- -D warnings`)
- Use idiomatic Rust conventions

### Unsafe Code
- **Minimize `unsafe`** — only use when absolutely necessary
- **Every `unsafe` block must have a `// SAFETY:` comment** explaining:
  - What invariants must hold
  - Why the code is correct given those invariants
  - What could go wrong if invariants are violated

### Commit Messages
Use clear, descriptive commit messages:
```
kernel: implement physical frame allocator

Add bitmap-based physical frame allocator for 64-bit address space.
Supports alloc/free with O(1) average case.

Implements P0 item from ROADMAP.md.
```

Format: `area: description` where area is one of:
`kernel`, `mm`, `process`, `fs`, `driver`, `net`, `security`, `shell`, `ci`, `docs`, `build`

### Architecture
- Keep architecture-specific code in `kernel/src/arch/<target>/`
- Never add `#[cfg(target_arch = "...")]` to generic kernel code when a module boundary would work
- Document architectural decisions in `docs/adr/`

## What We Need

Priority areas for contribution:

1. **Kernel correctness** — fix known bugs (see `docs/TECHNICAL_DEBT.md`)
2. **Virtual memory** — Sv39 page table implementation
3. **Process management** — PCB, scheduler, context switching
4. **Syscalls** — syscall ABI and initial syscall set
5. **Testing** — unit tests, integration tests, QEMU boot tests
6. **Documentation** — architecture docs, API docs

## Security-Sensitive Code

Changes to security-critical code require additional review:

- Trap handling
- Memory management
- Process isolation
- Capability enforcement
- Cryptographic code
- Syscall handling

Tag such PRs with `security` and they will receive expedited review.

## Questions?

Open a GitHub issue or join the Discord: https://discord.gg/suraksha-os
