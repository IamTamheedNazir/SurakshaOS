# ADR-0002: Process/Thread Ownership and Context Model

**Status:** Accepted
**Date:** 2026-09-19
**Deciders:** SurakshaOS maintainers
**Implemented in:** `kernel/src/process.rs`, `kernel/src/boot.S` (M2.1)

---

## Context

M1 delivered a verified S-mode kernel with Sv39, a physical frame
allocator, and full trap handling — but no real execution model: the
"process table" was a PID counter, `ps` printed a hardcoded line, and
everything ran on one global boot stack. Building a scheduler, syscalls, or
U-mode on that foundation was impossible.

The design had to:

1. Keep processes and schedulable entities as distinct concepts (a process
   owns resources; threads execute).
2. Give every schedulable entity a private kernel stack (never share the
   boot stack across tasks).
3. Preserve the verified M1 boundary (S-mode kernel, delegation, Sv39,
   PMA) without redesign.
4. Support multiple threads per process and per-process address spaces
   from day one, even though M2.1 exercises one thread per kernel task.
5. Be provably correct in QEMU — no simulated context switching.

## Decision

### 1. Process = resource owner; Thread = execution context

`Process` holds identity (`pid`, `parent_pid`), lifecycle (`ProcessState`),
the address space (`ProcessSpace`), the thread list, and exit status.
`Thread` holds `tid`, owner PID, thread state, the saved scheduler context,
the owned `KernelStack`, and the entry point. Multiple threads per process
are supported by construction (`Process.threads: Vec<Thread>`).

### 2. Scheduler context is callee-saved state only, separate from trap frames

`SwitchContext` = `ra, sp, s0-s11` (`#[repr(C)]`, 112 bytes, layout
asserted against `switch_context_asm` in boot.S). Rationale:

- `ra`/`sp` are the minimum to resume a suspended call chain.
- `s0-s11` are ABI callee-saved: `switch_to()` is a call, so anything a
  thread keeps long-term in s-registers must survive it.
- Caller-saved registers are dead across a call per the ABI — storing them
  would double-manage state the compiler already assumes is gone.
- Trap frames (`_s_trap_entry`) are separate structures used only inside
  traps; conflating the two is the classic double-save bug.

Fresh threads receive their arguments through the *restored* s-registers
(`s0=entry, s1=arg, s2=owner`) rather than caller-saved registers, which
the switch does not preserve.

### 3. Threads own their kernel stacks; the PMA hands them out contiguously

Each thread allocates 16 contiguous PMA frames (64 KiB, page-aligned) at
creation and frees them exactly once, at reap, via `Drop`. Overflow
protection via MMU guard pages is deferred (TD-028) because M2.1 stacks
are physical, not mapped; the guard-page strategy is documented in
`docs/PROCESS_MODEL.md`.

### 4. Address-space ownership is enum-enforced

`ProcessSpace::Kernel` (shared kernel space — nothing to free, so freeing
it is unrepresentable) or `ProcessSpace::Owned(Box<AddressSpace>)` (freed
at reap through the existing `AddressSpace::destroy()`, which already
skips shared kernel-region page tables). `Box` keeps the `AddressSpace`
address stable while the table `Vec` grows. If a reaped process's private
space is active in `satp`, `reap_exited()` switches back to the kernel
space before destroying it.

### 5. One synchronized table; lock dropped before the switch

All process state lives in `static TABLE: Mutex<TableInner>` (spin::Mutex,
matching PMA/VMM/VFS conventions) — no unsynchronized globals. The
scheduler drops the lock before `switch_context_asm` because the switch
cannot be undone; this is safe on the single boot hart because non-boot
harts are parked and no trap handler locks the table. This constraint is
explicitly recorded as TD-027 and gates M2.2 (a per-hart scheduler lock
released by the resuming thread is required for SMP/preemption).

### 6. Exit is a hook; reaping is explicit

A thread whose entry returns lands in `thread_exit_hook` (boot.S tail),
which marks the thread `Exited` and its process `Zombie`, then schedules
away — it can never return onto a stack that will be freed. A dead thread
is never re-marked `Ready`. `reap_exited()` frees stacks and private
address spaces and removes Zombie processes. The boot context resumes
automatically when the last task exits (the Exited→boot switch path), so
the shell regains control deterministically.

## Consequences

**Positive**

- The A/B context-switch proof (10+ real switches per boot, alternating
  output, verified in QEMU) demonstrates the saved/restored execution
  contexts work without register, stack, or page-table corruption.
- `ps` reports the real table (`PID PPID STATE THR NAME`); `ktest` runs
  9 in-kernel self-tests covering PIDs, transitions, lookup, contexts,
  stacks, rotation, exit/reap, and address-space lifecycle.
- M2.2 preemption only needs to add: a trap-frame pointer per thread,
  timer-driven `schedule()`, and the TD-027 scheduler lock.
- M2.3 U-mode needs only: per-process `satp` switching in the switch path
  (the `ProcessSpace::Owned` slot exists), U-mode trap-frame handling, and
  the syscall table.

**Negative / deferred**

- The boot context (shell) is not yet a managed thread (TD-026) — init
  shows `THR=0`, and scheduling to it is special-cased.
- Boot services are still in-kernel subsystems, not processes (TD-025).
- Cooperative only (TD-029): a non-yielding loop starves the system until
  M2.2 preemption lands.
- In-kernel tests only (TD-030); host-side `cargo test` requires splitting
  the crate later.

## Alternatives considered

- **Trap-frame-as-context** (save all 31 registers in the scheduler):
  rejected — doubles switch cost and mixes trap-time and schedule-time
  state; the callee-saved set is the standard, correct minimal model.
- **Per-process stack in the process (not per-thread)**: rejected —
  threads are the schedulable entities; per-thread stacks are required for
  M2.2+ multithreading and avoid the shared-stack corruption class
  entirely.
- **Green threads on a single global stack**: rejected — fundamentally
  unsafe and un-auditable; explicitly forbidden by the M2.1 requirements.
- **Freeing address spaces eagerly at exit**: rejected — the UNIX-style
  Zombie→reap split preserves exit status for a future `wait()` and keeps
  destruction off the dying thread's stack.
