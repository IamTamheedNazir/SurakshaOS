# 🤝 Contributing to SurakshaOS

Thank you for your interest in contributing to SurakshaOS! This document provides guidelines and information for contributors.

---

## Table of Contents

1. [Code of Conduct](#code-of-conduct)
2. [How Can I Contribute?](#how-can-i-contribute)
3. [Development Setup](#development-setup)
4. [Coding Standards](#coding-standards)
5. [Commit Guidelines](#commit-guidelines)
6. [Pull Request Process](#pull-request-process)
7. [Security](#security)
8. [Community](#community)

---

## Code of Conduct

### Our Pledge

We are committed to providing a welcoming and inspiring community for all. Please read and follow our [Code of Conduct](CODE_OF_CONDUCT.md).

### Our Standards

- **Be respectful** of differing viewpoints and experiences
- **Be collaborative** and work together
- **Be inclusive** and welcoming to all
- **Be professional** in all interactions
- **Be constructive** in feedback and criticism

---

## How Can I Contribute?

### 🐛 Reporting Bugs

**Before submitting a bug report:**
- Check existing issues to avoid duplicates
- Collect relevant information (OS version, hardware, logs)
- Create a minimal reproducible example

**Bug Report Template:**
```markdown
**Description:**
Clear description of the bug

**Steps to Reproduce:**
1. Step one
2. Step two
3. Step three

**Expected Behavior:**
What should happen

**Actual Behavior:**
What actually happens

**Environment:**
- SurakshaOS Version:
- Hardware:
- SHAKTI/ARM:

**Logs:**
```
Paste relevant logs here
```
```

### 💡 Suggesting Enhancements

**Enhancement Proposal Template:**
```markdown
**Feature Name:**
Brief name for the feature

**Problem Statement:**
What problem does this solve?

**Proposed Solution:**
How should it work?

**Alternatives Considered:**
What other approaches did you consider?

**Additional Context:**
Any other relevant information
```

### 📝 Documentation

Documentation improvements are always welcome:
- Fix typos and grammatical errors
- Improve clarity and examples
- Add missing documentation
- Translate to Indian languages

### 🔧 Code Contributions

We welcome code contributions in these areas:

#### Kernel Development
- Microkernel improvements
- Driver development
- Memory management
- Scheduling algorithms

#### Security
- Cryptography implementations
- Security audits
- Formal verification
- Penetration testing

#### Hardware Integration
- SHAKTI processor support
- ARM RME integration
- Device drivers
- Hardware abstraction layers

#### Applications
- System services
- Native apps
- Developer tools
- UI/UX improvements

---

## Development Setup

### Prerequisites

```bash
# Install Rust (latest stable)
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
source $HOME/.cargo/env

# Install RISC-V toolchain
rustup target add riscv64gc-unknown-none-elf
rustup component add rust-src
rustup component add llvm-tools-preview

# Install QEMU for emulation
sudo apt-get update
sudo apt-get install qemu-system-riscv64 qemu-system-arm

# Install formal verification tools
cargo install kani-verifier
cargo install prusti-dev

# Install build dependencies
sudo apt-get install build-essential git cmake ninja-build
```

### Clone Repository

```bash
git clone https://github.com/IamTamheedNazir/SurakshaOS.git
cd SurakshaOS
```

### Build Kernel

```bash
cd kernel
cargo build --release --target riscv64gc-unknown-none-elf
```

### Run in QEMU

```bash
make qemu
```

### Run Tests

```bash
cargo test
cargo test --target riscv64gc-unknown-none-elf
```

### Formal Verification

```bash
# Run Kani verification
cargo kani

# Run Prusti verification
cargo prusti
```

---

## Coding Standards

### Rust Style Guide

We follow the official [Rust Style Guide](https://doc.rust-lang.org/nightly/style-guide/) with these additions:

#### Formatting

```bash
# Format code before committing
cargo fmt

# Check formatting
cargo fmt -- --check
```

#### Linting

```bash
# Run Clippy
cargo clippy -- -D warnings

# Fix Clippy warnings
cargo clippy --fix
```

#### Naming Conventions

```rust
// Module names: snake_case
mod memory_management;

// Type names: PascalCase
struct MemoryRegion;
enum PageSize;

// Function names: snake_case
fn allocate_page() -> Result<Page, Error>;

// Constants: SCREAMING_SNAKE_CASE
const MAX_PAGES: usize = 1024;

// Lifetimes: short, descriptive
fn process<'a, 'b>(input: &'a str, output: &'b mut String);
```

### Safety Requirements

#### No Unsafe Code in Kernel Core

```rust
// ❌ AVOID in kernel core
unsafe {
    ptr::write(addr, value);
}

// ✅ PREFER safe abstractions
capability.write(value)?;
```

#### Document All Unsafe Code

```rust
// ✅ REQUIRED for necessary unsafe code
/// # Safety
///
/// This function is safe if:
/// - `ptr` is valid and properly aligned
/// - `ptr` points to initialized memory
/// - No other references to this memory exist
unsafe fn read_hardware_register(ptr: *const u32) -> u32 {
    ptr.read_volatile()
}
```

### Documentation

#### Module Documentation

```rust
//! Memory management subsystem
//!
//! This module provides capability-based memory management
//! with formal verification guarantees.
//!
//! # Safety
//!
//! All memory operations are verified to be:
//! - Spatially safe (no buffer overflows)
//! - Temporally safe (no use-after-free)
//! - Thread-safe (no data races)
```

#### Function Documentation

```rust
/// Allocates a new page of memory
///
/// # Arguments
///
/// * `size` - Size of the page in bytes
/// * `capability` - Capability token for allocation
///
/// # Returns
///
/// * `Ok(Page)` - Successfully allocated page
/// * `Err(OutOfMemory)` - No memory available
///
/// # Examples
///
/// ```
/// let cap = get_allocation_capability();
/// let page = allocate_page(4096, cap)?;
/// ```
///
/// # Safety
///
/// This function is safe because it uses capability-based
/// access control verified by the kernel.
fn allocate_page(size: usize, capability: &AllocCap) -> Result<Page, Error>;
```

### Error Handling

```rust
// ✅ PREFER Result types
fn parse_config(path: &Path) -> Result<Config, ConfigError>;

// ✅ PREFER custom error types
#[derive(Debug)]
enum ConfigError {
    FileNotFound(PathBuf),
    ParseError(String),
    InvalidFormat,
}

// ✅ PREFER ? operator
fn load_config() -> Result<Config, Error> {
    let content = fs::read_to_string("config.toml")?;
    let config = toml::from_str(&content)?;
    Ok(config)
}
```

### Testing

```rust
#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_page_allocation() {
        let cap = create_test_capability();
        let page = allocate_page(4096, &cap).unwrap();
        assert_eq!(page.size(), 4096);
    }

    #[test]
    #[should_panic(expected = "OutOfMemory")]
    fn test_allocation_failure() {
        let cap = create_limited_capability(0);
        allocate_page(4096, &cap).unwrap();
    }
}
```

---

## Commit Guidelines

### Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- **feat**: New feature
- **fix**: Bug fix
- **docs**: Documentation changes
- **style**: Code style changes (formatting)
- **refactor**: Code refactoring
- **perf**: Performance improvements
- **test**: Adding or updating tests
- **chore**: Build process or auxiliary tool changes
- **security**: Security improvements
- **verify**: Formal verification updates

### Examples

```
feat(kernel): Add zero-copy IPC implementation

Implements shared memory-based IPC with capability-based
access control. Achieves 7-13x performance improvement
over traditional message passing.

Closes #123
```

```
fix(security): Patch capability delegation vulnerability

Fixed issue where capabilities could be delegated without
proper attenuation, potentially granting excessive privileges.

Security-Impact: Medium
Fixes #456
```

```
verify(kernel): Complete IPC fastpath verification

Added Isabelle/HOL proofs for IPC fastpath correctness.
All properties verified including:
- Message delivery guarantee
- Capability preservation
- Temporal safety

Verification-Status: Complete
```

### Commit Signing

All commits must be signed with GPG:

```bash
# Configure Git to sign commits
git config --global user.signingkey YOUR_GPG_KEY_ID
git config --global commit.gpgsign true

# Commit with signature
git commit -S -m "feat: Add new feature"
```

---

## Pull Request Process

### Before Submitting

1. **Update your fork**
   ```bash
   git remote add upstream https://github.com/IamTamheedNazir/SurakshaOS.git
   git fetch upstream
   git rebase upstream/main
   ```

2. **Run all checks**
   ```bash
   cargo fmt -- --check
   cargo clippy -- -D warnings
   cargo test
   cargo kani  # If applicable
   ```

3. **Update documentation**
   - Add/update relevant docs
   - Update CHANGELOG.md
   - Add examples if needed

4. **Write tests**
   - Unit tests for new functions
   - Integration tests for features
   - Verification proofs if applicable

### PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update
- [ ] Security improvement

## Testing
- [ ] Unit tests added/updated
- [ ] Integration tests added/updated
- [ ] Formal verification updated
- [ ] Manual testing performed

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex code
- [ ] Documentation updated
- [ ] No new warnings
- [ ] Tests pass
- [ ] Commits are signed

## Related Issues
Closes #(issue number)

## Screenshots (if applicable)
```

### Review Process

1. **Automated Checks**
   - CI/CD pipeline runs
   - Format check
   - Lint check
   - Test suite
   - Security scan

2. **Code Review**
   - At least 2 approvals required
   - Security team review for security changes
   - Verification team review for kernel changes

3. **Merge**
   - Squash and merge for features
   - Rebase and merge for fixes
   - Merge commit for releases

---

## Security

### Reporting Security Vulnerabilities

**DO NOT** open public issues for security vulnerabilities.

Instead, email: **security@suraksha-os.in**

Include:
- Description of vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (if any)

### Bug Bounty Program

We offer rewards for security vulnerabilities:

| Severity | Reward |
|----------|--------|
| **Critical** | ₹1,00,00,000 (₹1 Crore) |
| **High** | ₹25,00,000 |
| **Medium** | ₹5,00,000 |
| **Low** | ₹1,00,000 |

See [SECURITY.md](SECURITY.md) for details.

---

## Community

### Communication Channels

- **Discord**: [Join Server](https://discord.gg/suraksha-os)
- **Mailing List**: dev@suraksha-os.in
- **Twitter**: [@SurakshaOS](https://twitter.com/SurakshaOS)
- **Forum**: [discuss.suraksha-os.in](https://discuss.suraksha-os.in)

### Weekly Meetings

- **Kernel Dev Meeting**: Mondays 10:00 AM IST
- **Security Review**: Wednesdays 2:00 PM IST
- **Community Call**: Fridays 4:00 PM IST

### Getting Help

- **Documentation**: [docs.suraksha-os.in](https://docs.suraksha-os.in)
- **Discord #help**: For quick questions
- **GitHub Discussions**: For detailed discussions
- **Stack Overflow**: Tag `suraksha-os`

---

## Recognition

### Contributors

All contributors are recognized in:
- CONTRIBUTORS.md file
- Release notes
- Annual report
- Project website

### Significant Contributions

Major contributors may receive:
- Invitation to join core team
- Speaking opportunities at conferences
- Recommendation letters
- Swag and merchandise

---

## License

By contributing to SurakshaOS, you agree that your contributions will be licensed under the project's license (see [LICENSE](LICENSE)).

For kernel contributions: GPLv3  
For system services: Apache 2.0  
For security modules: GPLv3

---

## Questions?

If you have questions about contributing, please:
1. Check the [FAQ](docs/FAQ.md)
2. Ask in Discord #contributors channel
3. Email: contribute@suraksha-os.in

---

**Thank you for contributing to India's digital independence!** 🇮🇳

---

**Last Updated**: February 23, 2026  
**Version**: 1.0
