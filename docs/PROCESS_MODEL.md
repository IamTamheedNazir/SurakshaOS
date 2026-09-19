# SurakshaOS — Process Model

**Status:** M2.1 IMPLEMENTED (cooperative kernel tasks, hardware-verified)  
**Current milestone:** M2.2 (Preemptive Scheduler) → M2.3 (First U-mode Process)

---

## Overview

SurakshaOS implements a real process/thread execution model: processes own
resources (address space, exit status), threads are the schedulable entities
with dedicated kernel stacks, and the scheduler performs cooperative
round-robin context switches preserving the RISC-V ABI callee-saved state.

M2.1 (this document's implemented baseline) proves the model with two kernel
tasks alternating `A/B/A/B...` through real saved/restored contexts
(10+ switches per boot, verified in QEMU — see `docs/M1_VERIFICATION.md`
and `kernel/src/process.rs::spawn_demo_tasks`).

What is NOT yet implemented (honest status): preemption (timer-driven),
U-mode userland, per-process `satp` switching in the scheduler path, and
fork/exec. These are M2.2/M2.3.

---

## Process States

```
                 ┌──────────┐
       fork() ──→│ CREATED  │
                 └────┬─────┘
                      │ schedule()
                      ▼
                 ┌──────────┐
                 │  READY   │◄─────────────────┐
                 └────┬─────┘                  │
                      │ dispatch()             │
                      ▼                        │
                 ┌──────────┐                  │
                 │ RUNNING  │──── timer IRQ ───┘
                 └────┬─────┘
                      │
          ┌───────────┼───────────┐
          │           │           │
          ▼           ▼           ▼
    ┌──────────┐ ┌──────────┐ ┌──────────┐
    │ WAITING  │ │ STOPPED  │ │ ZOMBIE   │
    │ (sleep,  │ │ (SIGSTOP)│ │ (exited, │
    │  I/O)    │ │          │ │  waiting)│
    └────┬─────┘ └──────────┘ └────┬─────┘
         │                          │
         │ I/O complete / signal     │ wait()
         │                          ▼
         └──────► READY         ┌──────────┐
                                │   DEAD   │
                                │ (reaped) │
                                └──────────┘
```

---

## Process Control Block (PCB)

```rust
pub struct ProcessControlBlock {
    // Identity
    pid: ProcessId,
    ppid: ProcessId,
    name: String,

    // State
    state: ProcessState,
    exit_status: Option<i32>,

    // Memory
    address_space: AddressSpace,
    kernel_stack: VirtAddr,
    user_stack: VirtAddr,

    // Context
    context: TrapContext,  // Saved registers

    // Scheduling
    priority: Priority,
    time_slice: u64,
    times_cpu: u64,

    // Credentials
    uid: u32,
    gid: u32,
    capabilities: CapabilitySet,

    // File descriptors
    fd_table: FdTable,

    // Relationships
    children: Vec<ProcessId>,
    group: ProcessGroup,

    // Resources
    memory_usage: usize,
    open_files: usize,

    // Signal handling
    signal_mask: SignalSet,
    signal_handlers: [SignalHandler; MAX_SIGNALS],
    pending_signals: SignalSet,
}
```

---

## Thread Model

### Kernel Threads

- Run in S-mode (supervisor)
- Share kernel address space
- Can block on I/O
- Used for: interrupt handling, deferred work, kernel workers

### User Threads

- Run in U-mode (user)
- Each thread has its own stack
- Multiple threads per process share the process address space
- Thread-local storage (TLS) support

### Thread Structure

```rust
pub struct Thread {
    tid: ThreadId,
    process: ProcessId,
    state: ThreadState,
    context: TrapContext,
    kernel_stack: VirtAddr,
    user_stack: VirtAddr,
    tls: VirtAddr,
}
```

---

## Context Switching

### What Gets Saved

For each thread/process during a context switch:

1. **General-purpose registers** (x1-x31) — 31 × 8 bytes
2. **CSRs:**
   - `mepc` / `sepc` — program counter
   - `mstatus` / `sstatus` — status register
   - `mcause` — cause of trap (for debugging)
3. **Address space** — page table root (`satp` register)
4. **Kernel stack pointer** — for return from kernel

### Switch Sequence

```
1. Timer interrupt fires (while in U-mode)
2. Save user context to PCB
3. Switch to kernel stack
4. Update scheduler state (running → ready)
5. Select next process (scheduler)
6. Switch page table (satp)
7. Switch kernel stack
8. Restore next process context
9. Return to U-mode (mret/sret)
```

---

## Scheduler

### Design: Priority-Based Round-Robin

- Multiple run queues (one per priority level)
- Higher priority processes scheduled first
- Within same priority: round-robin with time slices
- Timer interrupt preempts running process

### Priority Levels

```
REALTIME    (highest)  — time-critical tasks
HIGH                     — interactive processes
NORMAL                   — default for applications
LOW                      — background tasks
IDLE                     (lowest) — when nothing else to run
```

### Scheduling Events

- **Timer tick:** check if current process exceeded time slice → preempt
- **Process exit:** wake parent, schedule next
- **I/O complete:** move waiting process to ready
- **Fork:** child starts in ready queue
- **Sleep:** move to waiting queue
- **Yield:** voluntary reschedule

---

## Process Creation

### fork()

1. Allocate new PCB
2. Copy address space (COW)
3. Copy file descriptors
4. Set parent/child relationship
5. Assign new PID
6. Add to ready queue
7. Return: parent gets child PID, child gets 0

### exec()

1. Parse ELF binary
2. Create new address space
3. Map ELF segments
4. Set up user stack with argc, argv, envp
5. Reset signal handlers
6. Set entry point
7. Return to user mode at new entry point

---

## Process Destruction

### exit(status)

1. Close all file descriptors
2. Release capabilities
3. Notify parent (if waiting)
4. Send SIGCHLD to parent
5. Become ZOMBIE
6. Schedule next process

### wait(pid, &status)

1. If no children: return ECHILD
2. If child is ZOMBIE: reap, return PID + status
3. Otherwise: block until child exits

---

## Resource Limits

| Resource | Default Limit | Description |
|----------|--------------|-------------|
| Memory | 256 MiB | Maximum virtual memory |
| Open files | 64 | Per-process FD limit |
| Processes | 256 | Max child processes |
| CPU time | unlimited | Can be set via ulimit |
| Stack size | 8 MiB | Default user stack |

---

## Signal Handling

Standard signals (subset):

| Signal | Number | Default Action | Description |
|--------|--------|----------------|-------------|
| SIGHUP | 1 | Terminate | Hangup |
| SIGINT | 2 | Terminate | Interrupt |
| SIGQUIT | 3 | Core dump | Quit |
| SIGKILL | 9 | Terminate (uncatchable) | Kill |
| SIGSEGV | 11 | Core dump | Segmentation fault |
| SIGTERM | 15 | Terminate | Terminate |
| SIGCHLD | 17 | Ignore | Child exited |
| SIGSTOP | 19 | Stop (uncatchable) | Stop process |
| SIGCONT | 18 | Continue | Continue stopped process |

---

## M2.1 Implemented Architecture (as built)

### Data Structures (kernel/src/process.rs)

| Structure | Purpose |
|-----------|---------|
| `ProcessId` / `ThreadId` | Monotonic, never-reused identifiers. TID 0 = boot context. |
| `SwitchContext` | Scheduler context: `ra, sp, s0-s11` (14 × 8 bytes, `#[repr(C)]`, layout asserted to match `switch_context_asm` in boot.S). |
| `KernelStack` | Per-thread owned stack: 16 contiguous PMA frames (64 KiB), page-aligned, freed on `Drop` at reap. |
| `Thread` | `tid, owner_pid, state, context, stack, entry, name`. Prepared context for new threads: `ra=thread_trampoline`, `sp=stack top`, `s0/s1/s2 = entry/arg/owner`. |
| `Process` | `pid, parent_pid, state, name, space, threads, exit_status, created_ms, yield_count`. |
| `ProcessSpace` | `Kernel` (shared, never freed) or `Owned(Box<AddressSpace>)` (freed at reap). The enum makes freeing the shared kernel space impossible by construction. |
| `TableInner` (in `static TABLE: Mutex<...>`) | Process table + PID/TID allocators. spin::Mutex, same convention as PMA/VMM/VFS. |

### Process States (implemented)

```
New ──▶ Ready ──▶ Running ──┐
          ▲                 │ (all threads exited)
          │  yield/preempt  ▼
          └────────────── Zombie ──(reap_exited)──▶ removed
```

Transitions are enforced by `set_state()`; illegal ones return
`ProcError::InvalidTransition`. Zombie is terminal (no resurrection).

### Thread States (implemented)

`New → Ready → Running → Exited`, plus `Blocked` (reserved for M2.2
blocking). An `Exited` thread is never re-marked `Ready` — schedule()
checks and refuses.

### Context Switch (cooperative)

```
yield_now()/schedule()
  ├─ TABLE.lock(): pick next Ready thread (round-robin after current TID)
  ├─ save current's callee-saved regs into its SwitchContext
  │    (boot context → BOOT_CONTEXT static; Exited threads are skipped)
  ├─ mark from-thread Ready (unless Exited), to-thread Running
  ├─ CURRENT_TID ← next;  DROP TABLE lock (single-hart; see TD-027)
  └─ switch_context_asm: restore next's ra/sp/s0-s11, ret
       first dispatch: ra = thread_trampoline → entry(s0)(s1)
       entry returns → thread_exit_hook: thread Exited, process Zombie,
                       schedule away forever (stack freed at reap)
```

### Why the scheduler context is separate from the trap context

The trap frame (`_s_trap_entry`, 256 bytes) exists only *inside* a trap;
the scheduler context is the persistent identity of a suspended thread.
They serve different purposes and different code paths; conflating them is
how double-save bugs happen. M2.2 preemption will store a trap frame on the
interrupted thread's kernel stack and a pointer to it, not merge the two
structures.

### Register justification (switch_context_asm)

| Register | Saved | Why |
|----------|-------|-----|
| `ra` | yes | Resume point (`ret` target). |
| `sp` | yes | Stack identity; without it no frame is reachable. |
| `s0-s11` | yes | ABI callee-saved — a thread's long-lived values; `switch_to` is a call. |
| `t0-t6`, `a0-a7` | no | ABI caller-saved: dead across the switch call. |
| `gp`, `tp` | no | Kernel-wide constants for kernel tasks (revisit for U-mode `tp`). |

### Locking and the switch window (TD-027)

The table lock is dropped before the register switch. Safe today because
the boot hart is the only executor and no trap handler locks the table.
M2.2 must introduce a per-hart scheduler lock held across the switch and
released by the resuming thread (standard pattern) before any SMP or
table-locking trap handler lands.

### Kernel stack overflow strategy

M2.1 stacks are physically contiguous PMA frames, not page-table mappings,
so MMU guard pages cannot be enforced yet. M2.2 will map thread stacks with
an unmapped guard page below; overflow then page-faults into a clean thread
kill. Tracked as TD-028.
