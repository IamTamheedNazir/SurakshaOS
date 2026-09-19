# SurakshaOS — Technical Debt

**Purpose:** Track all known issues, shortcuts, and design flaws that must be addressed.

---

## Critical (P0) — Correctness / Safety Issues

### TD-001: Incomplete Trap Context Save/Restore
- **File:** `kernel/src/arch.rs` (lines `_trap_entry`)
- **Issue:** Only saves 16 of 33 general-purpose registers. Missing: `s0-s11` (callee-saved), `gp`, `tp`, and CSR registers (`mepc`, `mstatus`, `mcause`, `mtval`).
- **Impact:** Any interrupt during kernel code that uses `s` registers will corrupt state. Cannot support context switching.
- **Fix:** Save all registers. Implement proper context switch structure.
- **Severity:** CRITICAL

### TD-002: Unsafe mepc Advancement for Exceptions
- **File:** `kernel/src/arch.rs` (line `_trap_handler_rust`)
- **Issue:** `mepc += 4` for all synchronous exceptions. Wrong for compressed instructions (2 bytes), wrong for access faults (no instruction to skip), wrong for breakpoints (should return to same PC).
- **Impact:** Kernel will crash or enter undefined state on any exception.
- **Fix:** Check instruction at `mepc` to determine length. Handle faults properly.
- **Severity:** CRITICAL

### TD-003: All Code Runs in M-mode
- **File:** All source files
- **Issue:** No user/kernel separation. Everything runs in the most privileged mode.
- **Impact:** No process isolation. Any code can access all memory and CSRs.
- **Fix:** Transition to S-mode kernel + U-mode userland (requires SBI or direct SBI calls).
- **Severity:** CRITICAL

### TD-004: No Virtual Memory
- **File:** `kernel/src/memory.rs`
- **Issue:** Flat address space. No page tables, no address space isolation.
- **Impact:** Cannot isolate processes. Any process can read/write kernel memory.
- **Fix:** Implement Sv39 page tables with per-process address spaces.
- **Severity:** CRITICAL
- **Partial progress:** Physical frame allocator (PMA) implemented in `kernel/src/pma.rs`. Bitmap-based, manages 256 MiB / 65536 frames. Sv39 page tables implemented in `kernel/src/vmm.rs` — identity-mapped kernel. Next step: higher-half kernel mapping + per-process address spaces + user/kernel separation.

### TD-005: Simulated Commands Print Fake Success
- **File:** `kernel/src/shell.rs` (lines `cmd_captest`, `cmd_pqtest`)
- **Issue:** `captest` prints "All capability tests passed" with fabricated token data. `pqtest` prints "All PQ crypto tests passed" with fabricated crypto operations. No actual capability or crypto code exists.
- **Impact:** Misleads users/developers about system capabilities.
- **Fix:** Either implement real functionality or remove/replace with honest "not implemented" messages.
- **Severity:** HIGH

---

## High (P1) — Design Issues

### TD-006: Hardcoded Service PIDs
- **File:** `kernel/src/init.rs` (method `start_service`)
- **Issue:** `start_service()` returns hardcoded `ProcessId(2)` through `ProcessId(6)`. No actual processes are spawned.
- **Impact:** Init system is a simulation. Services don't exist as real processes.
- **Fix:** Spawn actual processes when process management is implemented.
- **Severity:** HIGH

### TD-007: Hardcoded Process List in `ps`
- **File:** `kernel/src/shell.rs` (method `cmd_ps`)
- **Issue:** `ps` prints a hardcoded table with fixed PIDs and names.
- **Impact:** Misrepresents system state.
- **Fix:** Read from actual process table when implemented.
- **Severity:** HIGH

### TD-008: No DTB Parsing
- **File:** `kernel/src/main.rs`
- **Issue:** `dtb_ptr` is passed to `kernel_main` but never parsed. Memory map, device tree, and hardware configuration are all hardcoded.
- **Impact:** Cannot discover actual hardware. Hardcoded to QEMU virt.
- **Fix:** Implement Flattened Device Tree parser.
- **Severity:** HIGH

### TD-009: Polling-Based UART I/O
- **File:** `kernel/src/console.rs`
- **Issue:** All UART I/O is polling. No interrupt-driven or DMA transfers.
- **Impact:** CPU wasted spinning on UART status registers.
- **Fix:** Implement interrupt-driven I/O with buffering.
- **Severity:** MEDIUM

### TD-010: Heap Allocator Not Suitable for Kernel
- **File:** `kernel/src/memory.rs`
- **Issue:** `linked_list_allocator` is designed for userspace. No physical page management, no page table management, no buddy system.
- **Impact:** Cannot allocate page-aligned frames, cannot manage physical memory properly.
- **Fix:** Implement dedicated physical frame allocator and kernel heap allocator.
- **Severity:** HIGH

### TD-011: No Synchronization Primitives
- **File:** None (missing)
- **Issue:** Only `spin::Mutex` from external crate. No kernel-level mutex, semaphore, condition variable, or wait queue.
- **Impact:** Cannot implement proper blocking, scheduling, or IPC.
- **Fix:** Implement kernel synchronization primitives.
- **Severity:** HIGH

### TD-012: No Error Handling Strategy
- **File:** All files
- **Issue:** Mix of `Result<T, &'static str>`, `panic!`, and `unwrap()`. No consistent error type. Many operations just `.ok()` and ignore errors.
- **Impact:** Silent failures, debugging difficulty.
- **Fix:** Define `KernelError` enum, use `Result` consistently, implement logging.
- **Severity:** MEDIUM

---

## Medium (P2) — Code Quality

### TD-013: README Claims Don't Match Reality
- **File:** `README.md`
- **Issue:** Claims "Basic memory management", "Hardware abstraction layer", "Cryptographic primitives" as implemented. These are stubs or missing.
- **Impact:** Misleading for contributors and users.
- **Fix:** Rewrite README to accurately reflect current state.
- **Severity:** HIGH (trust/integrity)

### TD-014: No LICENSE File
- **File:** None (missing)
- **Issue:** README says GPLv3 but no LICENSE file exists in repository.
- **Impact:** Legal ambiguity for open-source contributions.
- **Fix:** Add GPLv3 LICENSE file.
- **Severity:** HIGH (legal)

### TD-015: Missing `.gitignore`
- **File:** None at root (only `kernel/.gitignore`)
- **Issue:** Root directory has no `.gitignore`. Build artifacts, editor files, OS files not ignored.
- **Impact:** Risk of committing unwanted files.
- **Fix:** Add comprehensive root `.gitignore`.
- **Severity:** MEDIUM

### TD-016: Unpinned Nightly Toolchain
- **File:** `kernel/rust-toolchain.toml`
- **Issue:** Uses `channel = "nightly"` without a date. Builds can break with nightly updates.
- **Impact:** Non-reproducible builds.
- **Fix:** Pin to specific nightly date (e.g., `nightly-2026-09-18`).
- **Severity:** MEDIUM

### TD-017: No Test Infrastructure
- **File:** None (missing)
- **Issue:** Zero tests. No unit tests, integration tests, or test runner configuration.
- **Impact:** No regression detection. Changes can silently break functionality.
- **Fix:** Add test framework, write tests for existing functionality.
- **Severity:** HIGH

### TD-018: No CI Pipeline
- **File:** `.github/workflows/cleanup-old-backend.yml` (irrelevant)
- **Issue:** No build/test/lint CI. Only a manual cleanup workflow.
- **Impact:** No automated verification of changes.
- **Fix:** Add CI with build, fmt check, clippy, and QEMU boot test.
- **Severity:** HIGH

### TD-019: `unsafe` Code Without Documentation
- **File:** `kernel/src/arch.rs`, `kernel/src/console.rs`, `kernel/src/memory.rs`
- **Issue:** Multiple `unsafe` blocks without `// SAFETY:` comments explaining invariants.
- **Impact:** Maintainability risk. Future developers may not understand safety requirements.
- **Fix:** Add safety comments to every `unsafe` block.
- **Severity:** MEDIUM

### TD-020: Static Mutable State
- **File:** `kernel/src/arch.rs` (`TICK_COUNT`)
- **Issue:** `static mut TICK_COUNT` accessed via `read_volatile`/direct mutation. No atomic or locked access.
- **Impact:** Potential data race if timer interrupt preempts code reading the tick count.
- **Fix:** Use `AtomicU64` or protect with a lock.
- **Severity:** MEDIUM

---

## Low (P3) — Enhancement Debt

### TD-021: Shell Lacks Quoting/Escaping
- **File:** `kernel/src/shell.rs`
- **Issue:** Commands split on whitespace only. No support for quoted strings, escaped characters, or glob patterns.
- **Impact:** Cannot handle filenames with spaces or complex arguments.
- **Fix:** Implement proper shell parser.
- **Severity:** LOW

### TD-022: No Arrow Key / History Navigation
- **File:** `kernel/src/shell.rs`
- **Issue:** `read_line_with_history()` calls plain `read_line()`. No VT100 arrow key handling.
- **Impact:** Minor UX issue.
- **Fix:** Implement escape sequence parsing for line editing.
- **Severity:** LOW

### TD-023: VFS Path Resolution Incomplete
- **File:** `kernel/src/fs.rs`
- **Issue:** No symlink support, no `.`/`..` handling at VFS level, no canonicalization.
- **Impact:** Path handling is fragile.
- **Fix:** Implement proper path resolution with `.` and `..`.
- **Severity:** LOW

### TD-024: Stale TD entries (updated 2026-09-19)
- **Issue:** TD-001/002/003/004 and TD-020 describe the pre-M1 state and
  are now resolved (full trap save/restore, classified mepc handling, S-mode
  kernel, Sv39 VMM, synchronized statics). Kept for history; superseded by
  docs/M1_VERIFICATION.md.
- **Severity:** INFO

### TD-025: Init Services Are Not Processes
- **File:** `kernel/src/init.rs`
- **Issue:** The five boot services print PIDs 2–6 but are in-kernel
  subsystem calls; no Process exists for them and those PIDs are not in the
  process table. `ps` shows only real processes (so services do not appear).
- **Impact:** `ps` output is honest but incomplete vs the boot log.
- **Fix:** Convert services to real kernel-task processes in M3.
- **Severity:** MEDIUM

### TD-026: Boot Context Is Not a Managed Thread
- **File:** `kernel/src/process.rs` (BOOT_CONTEXT, BOOT_TID)
- **Issue:** The shell/init execution runs on the global boot stack from
  boot.S with a saved boot `SwitchContext`, but it is not a `Thread` in the
  table (init shows THR=0).
- **Impact:** Slight asymmetry: the boot context cannot block/yield like a
  normal thread; scheduling to it is special-cased.
- **Fix:** Convert the boot execution into the init process's main thread
  (thread 0 → init's TID) in M2.2.
- **Severity:** MEDIUM

### TD-027: Scheduler Lock Window (pre-SMP constraint)
- **File:** `kernel/src/process.rs::schedule`
- **Issue:** The table lock is dropped before the register switch. Safe
  only because the boot hart is the sole executor and no trap handler locks
  the process table.
- **Impact:** Blocks SMP (M2.2+) and any trap handler that must touch the
  table (e.g. timer-driven preemption needs care).
- **Fix:** Per-hart scheduler lock held across the switch, released by the
  resuming thread. Required before SMP or preempting handlers.
- **Severity:** HIGH (gating M2.2)

### TD-028: No Kernel-Stack Guard Pages
- **File:** `kernel/src/process.rs` (KernelStack)
- **Issue:** Thread stacks are contiguous PMA frames, not page-table
  mappings; the MMU cannot trap on overflow.
- **Impact:** A stack overflow corrupts adjacent frames silently.
- **Fix:** M2.2: map thread stacks into the kernel region with an unmapped
  guard page below; overflow page-faults into a clean thread kill.
- **Severity:** HIGH

### TD-029: Cooperative Only
- **Issue:** `schedule()` runs from `yield_now()` only. A thread in a long
  loop without yields starves everything else (mitigated today because all
  kernel tasks yield by design).
- **Fix:** M2.2 timer-driven preemption through the delegated timer.
- **Severity:** HIGH (defining M2.2)

### TD-030: Test Infrastructure Is In-Kernel Only
- **Issue:** `no_std` + RISC-V boot assembly means `cargo test` cannot run
  kernel logic on the host; tests live in `run_self_tests()` behind the
  `ktest` shell command (executed in QEMU).
- **Fix:** Long-term: split architecture-independent logic (PID allocator,
  state machine) into a `no_std` lib crate testable on the host, keeping
  arch-specific parts (`asm!`, stacks) in the binary crate.
- **Severity:** MEDIUM

---

## Summary

| Priority | Count | Description |
|----------|-------|-------------|
| P0 (Critical) | 5 | Correctness, safety, security |
| P1 (High) | 7 | Design, architecture |
| P2 (Medium) | 5 | Code quality, tooling |
| P3 (Low) | 3 | Enhancements |
| **Total** | **20** | |

---

## Tracking

Each debt item should be addressed as part of the corresponding milestone:
- P0 items → M1 (Correct Kernel)
- P1 items → M2 (Real Kernel)
- P2 items → M1-M2 (alongside milestones)
- P3 items → M3+ (as needed)
