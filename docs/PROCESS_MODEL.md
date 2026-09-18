# SurakshaOS — Process Model

**Status:** PLANNED — not yet implemented  
**Current milestone:** M2 (Real Kernel)

---

## Overview

SurakshaOS will implement a preemptive multitasking process model with kernel and user threads, per-process address spaces, and a priority-based scheduler.

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
