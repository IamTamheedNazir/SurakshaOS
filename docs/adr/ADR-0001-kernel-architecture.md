# ADR-0001: Kernel Architecture

**Status:** Accepted  
**Date:** 2026-09-18  
**Deciders:** SurakshaOS maintainers

---

## Context

SurakshaOS needs a kernel architecture decision. The current prototype runs everything in RISC-V M-mode with no process isolation. We need to decide on the long-term kernel architecture.

## Decision

**Monolithic kernel with module boundaries, running in S-mode (supervisor mode).**

### Kernel runs in S-mode

- M-mode: reserved for firmware/bootloader only
- S-mode: kernel with full hardware access via SBI
- U-mode: user applications with restricted access

Rationale:
- M-mode has unrestricted access — too powerful for a kernel that should be auditable
- S-mode provides hardware-enforced privilege separation
- SBI provides a stable interface for hardware access
- Aligns with Linux/RISC-V convention

### Monolithic (with modules)

The kernel is a single address space with logical module boundaries.

Rationale:
- Simpler to implement than microkernel for an initial OS
- Better performance (no IPC overhead for kernel services)
- Module boundaries provide logical separation
- Can evolve toward microkernel later if needed

### Language: Rust (no_std)

- Memory safety without garbage collection
- Zero-cost abstractions
- Minimal runtime
- Good RISC-V support via `riscv64gc-unknown-none-elf` target

## Consequences

### Positive
- Hardware-enforced process isolation
- Auditable code with minimal unsafe
- Standard RISC-V S-mode model
- Can use SBI for hardware abstraction

### Negative
- Larger kernel attack surface than microkernel
- All kernel modules share address space
- Bug in one module can affect entire kernel

### Risks
- S-mode transition requires SBI or custom firmware
- Some hardware features may require M-mode (certain CSR accesses)
