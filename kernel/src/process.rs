//! SurakshaOS Process & Thread Foundation (M2.1)
//!
//! First real process/thread execution model: a process control block with a
//! lifecycle, schedulable threads that each own a dedicated kernel stack, a
//! RISC-V scheduler context (callee-saved state only), and a cooperative
//! round-robin context switch verified in QEMU by two kernel tasks that
//! alternate on the same hart using real saved/restored execution contexts.
//!
//! # Deliberate scope boundaries (M2.1)
//!
//! - **Cooperative only** — switching happens in `yield_now()`/`schedule()`.
//!   Preemption via the timer arrives in M2.2.
//! - **Kernel tasks only** — every thread currently executes in S-mode on the
//!   shared kernel address space. U-mode + per-process `satp` switching is
//!   M2.3; the `Process` already owns an `AddressSpace` slot so the
//!   transition does not require a redesign.
//! - **Single hart** — non-boot harts are parked in `boot.S` and the S-mode
//!   interrupt handlers never touch the process table, so the lock can be
//!   dropped before the actual register switch (see `schedule()` for the
//!   full concurrency argument).
//!
//! # Contexts: scheduler vs. trap
//!
//! `SwitchContext` is deliberately separate from the trap frame saved by
//! `_s_trap_entry` (arch.rs/boot.S). The trap frame exists only *inside* a
//! trap; the scheduler context is the persistent identity of a suspended
//! thread and holds exactly the ABI callee-saved state (`ra`, `sp`, `s0–s11`).

extern crate alloc;

use alloc::{boxed::Box, vec::Vec};
use core::sync::atomic::{AtomicUsize, Ordering};
use spin::Mutex;

use crate::pma::{self, PhysAddr, PAGE_SIZE};
use crate::println;
use crate::vmm::AddressSpace;

// ─── Foreign functions provided by boot.S ────────────────────────────────────

extern "C" {
    /// Cooperative context switch. `a0 = &from.context`, `a1 = &to.context`.
    /// Saves `ra, sp, s0-s11` of the caller into `from`, then restores them
    /// from `to` and returns — landing on the caller-of-`to`'s resume point.
    fn switch_context_asm(from: *mut SwitchContext, to: *mut SwitchContext);

    /// First entry point of a new thread; its prepared context has
    /// `ra = thread_trampoline`, `s0 = entry`, `s1 = arg`, `s2 = owner`.
    /// Declared so the symbol is type-checked from Rust; never called
    /// directly (only through a restored context).
    fn thread_trampoline();
}

// ─── Identifiers ──────────────────────────────────────────────────────────────

/// Process identifier. PID 1 is the boot/init process. Monotonically
/// increasing, never reused (so a stale PID can never alias a new process).
#[derive(Debug, Clone, Copy, PartialEq, Eq, PartialOrd, Ord)]
pub struct ProcessId(pub usize);

impl core::fmt::Display for ProcessId {
    fn fmt(&self, f: &mut core::fmt::Formatter<'_>) -> core::fmt::Result {
        write!(f, "{}", self.0)
    }
}

/// Thread identifier. TID 0 is reserved for the boot context (the still
/// unconverted shell/boot stack — see TD-026). Real TIDs start at 1 and are
/// never reused.
#[derive(Debug, Clone, Copy, PartialEq, Eq, PartialOrd, Ord)]
pub struct ThreadId(pub usize);

// ─── Scheduler context ────────────────────────────────────────────────────────

/// Persistent scheduler context of a suspended thread: exactly the RISC-V
/// ABI callee-saved registers. Layout must match `switch_context_asm` in
/// boot.S (14 × 8 bytes).
///
/// Why only these registers?
/// - `ra` — the resume point. Restoring it and executing `ret` transfers
///   control to wherever the thread was (or, for a fresh thread, to the
///   trampoline).
/// - `sp` — the thread's stack identity. Without it, every local variable
///   and saved register of every active frame is unreachable.
/// - `s0–s11` — the ABI hands these to the *callee*. `switch_context_asm`
///   is a call, so a thread must keep its own copy of anything long-lived
///   it holds in s-registers.
/// - Caller-saved registers (`t0-t6`, `a0-a7`) are dead across a call per
///   the ABI and need no storage.
/// - `gp`/`tp` — kernel-wide constants in this kernel; they do not differ
///   between kernel threads (U-mode `tp` handling arrives with M2.3).
#[derive(Debug, Clone, Copy)]
#[repr(C)]
pub struct SwitchContext {
    pub ra: u64,
    pub sp: u64,
    pub s0: u64,
    pub s1: u64,
    pub s2: u64,
    pub s3: u64,
    pub s4: u64,
    pub s5: u64,
    pub s6: u64,
    pub s7: u64,
    pub s8: u64,
    pub s9: u64,
    pub s10: u64,
    pub s11: u64,
}

impl SwitchContext {
    pub const fn zeroed() -> Self {
        SwitchContext {
            ra: 0,
            sp: 0,
            s0: 0,
            s1: 0,
            s2: 0,
            s3: 0,
            s4: 0,
            s5: 0,
            s6: 0,
            s7: 0,
            s8: 0,
            s9: 0,
            s10: 0,
            s11: 0,
        }
    }
}

const SWITCH_CONTEXT_SIZE: usize = core::mem::size_of::<SwitchContext>();
const _: () = assert!(
    SWITCH_CONTEXT_SIZE == 112,
    "SwitchContext must match boot.S layout"
);

// ─── Kernel stacks ────────────────────────────────────────────────────────────

/// Frames (4 KiB pages) per thread kernel stack. 64 KiB is generous for the
/// current shallow kernel call depth but cheap; revisit with real drivers.
const KERNEL_STACK_FRAMES: usize = 16;

/// A dedicated, owned kernel stack for one thread.
///
/// Frames come from the PMA as one physically contiguous, page-aligned run,
/// so the stack is 4 KiB (hence 16-byte) aligned and hardware can never
/// fault on alignment. `Drop` returns the frames to the PMA — a thread's
/// stack outlives nothing after reaping.
///
/// # Overflow protection (TODO, M2.2)
///
/// Physical stacks are not mapped through the per-process page tables yet,
/// so a guard page cannot be enforced by the MMU. Strategy for M2.2: map
/// thread stacks into the kernel region with an unmapped guard page below
/// the stack; the resulting page fault on overflow then maps to a clean
/// thread kill instead of silent memory corruption.
#[derive(Debug)]
pub struct KernelStack {
    base: PhysAddr,
    frames: usize,
}

impl KernelStack {
    /// Allocate a new zeroed kernel stack. Returns `None` if the PMA cannot
    /// satisfy a contiguous run (never expected at current usage levels).
    pub fn new() -> Option<Self> {
        let base = pma::alloc_contiguous(KERNEL_STACK_FRAMES)?;
        // SAFETY: the run is freshly allocated and PMA-owned; zeroing makes
        // the stack deterministic (eases post-mortem debugging too).
        unsafe {
            core::ptr::write_bytes(base.0 as *mut u8, 0, KERNEL_STACK_FRAMES * PAGE_SIZE);
        }
        Some(KernelStack {
            base,
            frames: KERNEL_STACK_FRAMES,
        })
    }

    /// Lowest address of the stack (inclusive). This is where overflow
    /// would hit first — the future guard-page boundary.
    pub fn base(&self) -> usize {
        self.base.0
    }

    /// One-past-the-top address. The initial `sp` for a new thread.
    pub fn top(&self) -> usize {
        self.base.0 + self.frames * PAGE_SIZE
    }

    pub fn size(&self) -> usize {
        self.frames * PAGE_SIZE
    }

    /// True if `ptr` lies within `[base, top)`.
    ///
    /// Used by diagnostics and later by the overflow handler to identify the
    /// faulting thread from a faulting `sp`.
    pub fn contains(&self, ptr: usize) -> bool {
        (self.base.0..self.top()).contains(&ptr)
    }
}

impl Drop for KernelStack {
    fn drop(&mut self) {
        pma::free_contiguous(self.base, self.frames);
    }
}

// ─── Threads ──────────────────────────────────────────────────────────────────

/// Lifecycle of a schedulable thread. Threads are the schedulable entities;
/// processes group them and own resources (address space, exit status).
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum ThreadState {
    /// Created, context prepared, not yet on the run queue.
    New,
    /// On the run queue, waiting for the hart.
    Ready,
    /// Currently executing on the hart (at most one, the current thread).
    Running,
    /// Voluntarily parked (M2.2: waker/queue infra arrives with blocking).
    Blocked,
    /// Entry function returned; stack still intact until reaped.
    Exited,
}

/// A schedulable execution context owned by exactly one process.
#[derive(Debug)]
pub struct Thread {
    pub tid: ThreadId,
    pub owner_pid: ProcessId,
    pub state: ThreadState,
    /// Saved callee-saved state. For a `New` thread this is a *prepared*
    /// context: `ra = thread_trampoline`, `sp = stack top`,
    /// `s0/s1/s2 = entry/arg/owner`.
    pub context: SwitchContext,
    /// Dedicated kernel stack. Owned: freed exactly once, on drop at reap.
    stack: KernelStack,
    /// Entry function (also kept in `context.s0` for the trampoline).
    entry: usize,
    pub name: &'static str,
}

impl Thread {
    pub fn stack_base(&self) -> usize {
        self.stack.base()
    }

    pub fn stack_top(&self) -> usize {
        self.stack.top()
    }

    pub fn stack_size(&self) -> usize {
        self.stack.size()
    }

    /// True if `ptr` is inside this thread's kernel stack.
    pub fn stack_contains(&self, ptr: usize) -> bool {
        self.stack.contains(ptr)
    }

    /// The prepared entry point (diagnostics/tests).
    pub fn entry_addr(&self) -> usize {
        self.entry
    }
}

// ─── Processes ────────────────────────────────────────────────────────────────

/// Process lifecycle.
///
/// ```text
///   New ──▶ Ready ──▶ Running ──┐
///             ▲                 │ (all threads exited)
///             │   preemption    ▼
///             │              Zombie ──(reap)──▶ Dead (removed)
///             └── Running
/// ```
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum ProcessState {
    /// Created, not yet schedulable.
    New,
    /// Has at least one `Ready`/`Running` thread.
    Ready,
    /// Currently executing (its thread holds the hart).
    Running,
    /// Temporarily has no runnable thread (M2.2: blocking syscalls).
    Blocked,
    /// Exited; resources still held until a parent/reaper collects
    /// `exit_status` — the RISC-V analogue of a UNIX zombie.
    Zombie,
    /// Fully reaped. The `Process` is removed from the table; `Dead` exists
    /// as a transitional marker for diagnostics.
    Dead,
}

impl ProcessState {
    /// Names shown by `ps`.
    pub fn as_str(self) -> &'static str {
        match self {
            ProcessState::New => "New",
            ProcessState::Ready => "Ready",
            ProcessState::Running => "Running",
            ProcessState::Blocked => "Blocked",
            ProcessState::Zombie => "Zombie",
            ProcessState::Dead => "Dead",
        }
    }
}

/// Where a process's address space lives.
///
/// * `Kernel` — the shared kernel address space (kernel tasks, M2.1).
///   Destruction must NEVER free it; the enum makes that impossible by
///   construction (there is nothing to drop).
/// * `Owned` — a private space created via `vmm::create_address_space()`.
///   `AddressSpace::destroy()` already refuses to free the shared
///   kernel-region page tables; dropping the `Box` frees the process's own
///   root + private sub-tables. Heap-allocated so the `AddressSpace`
///   address stays stable even if the process table `Vec` reallocates.
enum ProcessSpace {
    Kernel,
    Owned(Box<AddressSpace>),
}

/// Process Control Block — the real thing, not a PID counter.
pub struct Process {
    pub pid: ProcessId,
    pub parent_pid: Option<ProcessId>,
    pub state: ProcessState,
    pub name: &'static str,
    space: ProcessSpace,
    /// Threads owned by this process. At least the main thread for every
    /// process created through `create_kernel_task`; multiple threads per
    /// process are supported by construction.
    threads: Vec<Thread>,
    /// Set when the process exits; collected by `reap`.
    pub exit_status: Option<i32>,
    /// Creation time, for diagnostics.
    pub created_ms: u64,
    /// CPU accounting (voluntary yields so far — preemption adds more).
    pub yield_count: u64,
}

impl Process {
    /// Number of threads currently owned.
    pub fn thread_count(&self) -> usize {
        self.threads.len()
    }

    /// Immutable view of the threads (shell, diagnostics, tests).
    pub fn threads(&self) -> &[Thread] {
        &self.threads
    }

    /// True if this process owns a private address space.
    pub fn owns_address_space(&self) -> bool {
        matches!(self.space, ProcessSpace::Owned(_))
    }

    /// Find a thread by TID within this process.
    pub fn thread(&self, tid: ThreadId) -> Option<&Thread> {
        self.threads.iter().find(|t| t.tid == tid)
    }

    fn thread_mut(&mut self, tid: ThreadId) -> Option<&mut Thread> {
        self.threads.iter_mut().find(|t| t.tid == tid)
    }
}

// ─── Process table ────────────────────────────────────────────────────────────

/// Global, synchronized process table + scheduler state.
///
/// Synchronization: a spin `Mutex`, same convention as PMA/VMM/VFS. On the
/// single boot hart this never contended; keeping state inside a Mutex (not
/// bare `static mut`) means SMP harts (M2.2+) inherit correct behaviour
/// without an audit, and `clippy` sees no unsynchronized globals.
struct TableInner {
    procs: Vec<Process>,
    next_pid: usize,
    next_tid: usize,
}

/// TID of the boot context (shell/boot stack — not yet a managed `Thread`).
const BOOT_TID: usize = 0;

static TABLE: Mutex<TableInner> = Mutex::new(TableInner {
    procs: Vec::new(),
    next_pid: 2, // PID 1 = init/boot process, registered at boot
    next_tid: 1, // TID 0 = boot context
});

/// TID of the thread currently holding the hart (0 = boot context).
static CURRENT_TID: AtomicUsize = AtomicUsize::new(BOOT_TID);

/// Saved context of the boot execution (the shell loop). The boot context is
/// not a `Thread` yet (TD-026): it runs on the global boot stack from
/// `boot.S`, and switching back to it must restore `ra`/`sp` as they were
/// when it first switched away. The first switch *saves into* this slot;
/// later switches *restore from* it.
static mut BOOT_CONTEXT: SwitchContext = SwitchContext::zeroed();

// ─── Public table operations ─────────────────────────────────────────────────

/// A lightweight snapshot row for `ps` and tests.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub struct ProcInfo {
    pub pid: usize,
    pub ppid: Option<usize>,
    pub state: &'static str,
    pub threads: usize,
    pub name: &'static str,
}

/// Errors returned by process operations.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum ProcError {
    /// PID/TID allocator or PMA failed.
    ResourceExhausted(&'static str),
    /// No process with this PID.
    NoSuchProcess,
    /// State transition not allowed by the lifecycle.
    InvalidTransition,
}

/// Register the boot execution (init/shell) as PID 1.
///
/// It has zero managed threads: it runs on the boot stack with the boot
/// context (TD-026 — converting it is M2.2 work). Everything else about it
/// (lookup, enumeration, future children) is real.
pub fn register_boot_process(name: &'static str) -> ProcessId {
    let mut table = TABLE.lock();
    let pid = ProcessId(1);
    table.procs.push(Process {
        pid,
        parent_pid: None,
        state: ProcessState::Running,
        name,
        space: ProcessSpace::Kernel,
        threads: Vec::new(),
        exit_status: None,
        created_ms: crate::arch::uptime_millis(),
        yield_count: 0,
    });
    pid
}

/// Create a real kernel-task process with one main thread.
///
/// The process starts in `New`, gains a `Ready` main thread, and becomes
/// `Ready` itself. It does NOT run until the scheduler picks it.
pub fn create_kernel_task(
    name: &'static str,
    parent: Option<ProcessId>,
    entry: fn(usize),
    arg: usize,
) -> Result<ProcessId, ProcError> {
    let mut table = TABLE.lock();

    let pid = table.next_pid;
    if pid >= usize::MAX / 2 {
        return Err(ProcError::ResourceExhausted("PID space exhausted"));
    }
    table.next_pid += 1;

    // Validate parent up-front so we fail before allocating anything.
    if let Some(ppid) = parent {
        if !table.procs.iter().any(|p| p.pid.0 == ppid.0) {
            return Err(ProcError::NoSuchProcess);
        }
    }

    // Reserve the TID for the main thread.
    let tid = table.next_tid;
    if tid >= usize::MAX / 2 {
        return Err(ProcError::ResourceExhausted("TID space exhausted"));
    }
    table.next_tid += 1;

    let process = Process {
        pid: ProcessId(pid),
        parent_pid: parent,
        state: ProcessState::New,
        name,
        space: ProcessSpace::Kernel,
        threads: Vec::new(),
        exit_status: None,
        created_ms: crate::arch::uptime_millis(),
        yield_count: 0,
    };

    // The thread address the trampoline receives must be computed after the
    // process is pushed into the table (Vec addresses are final then).
    table.procs.push(process);
    let pidx = table.procs.len() - 1;

    // Push a placeholder thread, then finalize its context with the stable
    // address (the process identity in the table is what the hook will see).
    let thread = Thread {
        tid: ThreadId(tid),
        owner_pid: ProcessId(pid),
        state: ThreadState::New,
        context: SwitchContext::zeroed(),
        stack: KernelStack::new().ok_or(ProcError::ResourceExhausted("kernel stack alloc"))?,
        entry: entry as usize,
        name: "main",
    };
    table.procs[pidx].threads.push(thread);

    let owner_addr = {
        let t: *const Thread = &table.procs[pidx].threads[0];
        t as usize
    };
    let stack_top = table.procs[pidx].threads[0].stack_top();
    let mut context = SwitchContext::zeroed();
    context.ra = (thread_trampoline as *const () as usize) as u64;
    context.sp = stack_top as u64;
    context.s0 = entry as usize as u64;
    context.s1 = arg as u64;
    context.s2 = owner_addr as u64;
    table.procs[pidx].threads[0].context = context;
    table.procs[pidx].threads[0].state = ThreadState::Ready;

    table.procs[pidx].state = ProcessState::Ready;
    Ok(ProcessId(pid))
}

/// Look up a process snapshot by PID.
pub fn lookup(pid: ProcessId) -> Option<ProcInfo> {
    let table = TABLE.lock();
    table.procs.iter().find(|p| p.pid == pid).map(|p| ProcInfo {
        pid: p.pid.0,
        ppid: p.parent_pid.map(|x| x.0),
        state: p.state.as_str(),
        threads: p.threads.len(),
        name: p.name,
    })
}

/// Enumerate all processes (for `ps`).
pub fn enumerate() -> Vec<ProcInfo> {
    let table = TABLE.lock();
    table
        .procs
        .iter()
        .map(|p| ProcInfo {
            pid: p.pid.0,
            ppid: p.parent_pid.map(|x| x.0),
            state: p.state.as_str(),
            threads: p.threads.len(),
            name: p.name,
        })
        .collect()
}

/// Apply a state transition if the lifecycle allows it.
///
/// Allowed transitions:
/// ```text
/// New     → Ready, Zombie
/// Ready   → Running, Blocked, Zombie
/// Running → Ready, Blocked, Zombie
/// Blocked → Ready, Zombie
/// Zombie  → (none; reaping removes the process)
/// Dead    → (none; dead processes are gone)
/// ```
pub fn set_state(pid: ProcessId, new_state: ProcessState) -> Result<ProcessState, ProcError> {
    let mut table = TABLE.lock();
    let p = table
        .procs
        .iter_mut()
        .find(|p| p.pid == pid)
        .ok_or(ProcError::NoSuchProcess)?;
    let allowed = matches!(
        (p.state, new_state),
        (ProcessState::New, ProcessState::Ready)
            | (ProcessState::New, ProcessState::Zombie)
            | (ProcessState::Ready, ProcessState::Running)
            | (ProcessState::Ready, ProcessState::Blocked)
            | (ProcessState::Ready, ProcessState::Zombie)
            | (ProcessState::Running, ProcessState::Ready)
            | (ProcessState::Running, ProcessState::Blocked)
            | (ProcessState::Running, ProcessState::Zombie)
            | (ProcessState::Blocked, ProcessState::Ready)
            | (ProcessState::Blocked, ProcessState::Zombie)
    );
    if !allowed {
        return Err(ProcError::InvalidTransition);
    }
    p.state = new_state;
    Ok(p.state)
}

/// Mark a process exited (→ `Zombie`) with a status. Idempotent for already
/// exited processes is NOT allowed — double-exit is a kernel bug.
pub fn mark_exited(pid: ProcessId, status: i32) -> Result<(), ProcError> {
    set_state(pid, ProcessState::Zombie).map(|_| {
        let mut table = TABLE.lock();
        if let Some(p) = table.procs.iter_mut().find(|p| p.pid == pid) {
            p.exit_status = Some(status);
        }
    })
}

/// Reap every `Zombie` process: free its address space (if private), drop
/// its threads (freeing their kernel stacks), and remove it from the table.
///
/// Never frees the shared kernel address space (enum-enforced) and never
/// frees page tables backing the shared kernel region (`AddressSpace::
/// destroy` skips kernel-region sub-tables by design).
///
/// If a reaped process's private space is the *currently active* one, switch
/// back to the kernel space first — destroying the live `satp` target would
/// fault the next instruction fetch.
pub fn reap_exited() -> usize {
    // Determine the active root, if a private space could be active.
    let active_root = crate::vmm::active_page_table_phys().0;
    let mut reaped = 0;
    let mut table = TABLE.lock();
    let mut i = 0;
    while i < table.procs.len() {
        if table.procs[i].state == ProcessState::Zombie {
            let mut proc = table.procs.swap_remove(i);
            for t in &proc.threads {
                debug_assert_eq!(
                    t.state,
                    ThreadState::Exited,
                    "reaping a process whose threads are not all Exited"
                );
            }
            if let ProcessSpace::Owned(ref mut space) = proc.space {
                if space.root_phys().0 == active_root {
                    crate::vmm::switch_address_space(crate::vmm::kernel_address_space());
                }
                // SAFETY: space is not active any more (switched away above
                // if it was) and is dropped right after.
                unsafe { space.destroy() };
            }
            drop(proc);
            reaped += 1;
            // Do not advance i: swap_remove pulled a new element into slot i.
        } else {
            i += 1;
        }
    }
    reaped
}

// ─── Scheduler ────────────────────────────────────────────────────────────────

/// Pick the next `Ready` thread, round-robin: table order, starting after
/// the current TID (wrap-around). Returns the TID, or `None` if nothing is
/// runnable.
fn pick_next_locked(table: &TableInner) -> Option<usize> {
    let current = CURRENT_TID.load(Ordering::Relaxed);
    // Collect (tid) of every Ready thread in table order.
    let mut ready: Vec<usize> = Vec::new();
    for p in &table.procs {
        for t in &p.threads {
            if t.state == ThreadState::Ready {
                ready.push(t.tid.0);
            }
        }
    }
    if ready.is_empty() {
        return None;
    }
    // Start scanning after the current TID for fairness.
    let pos = ready.iter().position(|&t| t > current);
    match pos {
        Some(i) => Some(ready[i]),
        None => Some(ready[0]),
    }
}

/// Run one scheduler decision. Returns:
/// * `true` — a thread is/was running (switched, or current continues)
/// * `false` — nothing runnable and the *boot context* may resume
///
/// # Lock discipline (important)
///
/// The table lock is held while selecting the next thread and preparing
/// context pointers, then **dropped before the register switch**. This is
/// safe under the current single-hart invariant because:
/// 1. Non-boot harts are parked in `boot.S`; nothing else executes
///    concurrently.
/// 2. The only interrupts that can fire are the delegated SSI and (still
///    M-mode) timer tick. Their handlers never lock the process table
///    (SSI: clears `sip`; timer: M-mode, re-arms mtimecmp), and the S-mode
///    trap entry saves/restores all registers transparently — so a trap
///    inside the switch window cannot observe or mutate table state.
/// 3. `switch_context_asm` touches only the two context structs and the
///    register file, not the table.
///
/// When M2.2 adds SMP or table-locking trap handlers, this window must
/// become a per-hart scheduler lock (spin lock held across the switch,
/// released by the *resuming* thread) — noted in TECHNICAL_DEBT TD-027.
pub fn schedule() -> bool {
    // Phase 1 (locked): decide and prepare.
    enum Action {
        Switch(*mut SwitchContext, *mut SwitchContext),
        Continue,
        Nothing,
    }
    let action = {
        let mut table = TABLE.lock();
        let current = CURRENT_TID.load(Ordering::Relaxed);
        let next = pick_next_locked(&table);
        match next {
            Some(n) if n == current => Action::Continue,
            Some(n) => {
                // Locate from/to contexts.
                // From: boot context or current thread.
                //
                // CRITICAL: a current thread that is Exited must NOT be
                // re-marked Ready — its hook has declared it dead and it
                // must never be scheduled again. Saving its registers into
                // its context is still safe here (the stack is freed only
                // later, from the boot context, via reap_exited).
                //
                // SAFETY (BOOT_CONTEXT): only touched here, under the table
                // lock, on the single boot hart — no aliasing possible.
                let current_exited = current != BOOT_TID
                    && find_thread(&table, ThreadId(current))
                        .map(|t| t.state == ThreadState::Exited)
                        .unwrap_or(true);
                let from_ctx: *mut SwitchContext = if current == BOOT_TID {
                    core::ptr::addr_of_mut!(BOOT_CONTEXT)
                } else {
                    find_thread_ctx_mut(&mut table, ThreadId(current))
                        .expect("CURRENT_TID points to a missing thread")
                };
                // Mark the from-thread Ready (boot context needs no state;
                // an Exited thread stays Exited).
                if current != BOOT_TID && !current_exited {
                    set_thread_state(&mut table, ThreadId(current), ThreadState::Ready);
                    bump_yield(&mut table, ThreadId(current));
                }
                // Mark to-thread Running and grab its context.
                let to_ctx = {
                    let ctx = find_thread_ctx_mut(&mut table, ThreadId(n))
                        .expect("pick_next returned a missing thread");
                    set_thread_state(&mut table, ThreadId(n), ThreadState::Running);
                    // Reflect the owning process's Running state as well.
                    set_process_running(&mut table, ThreadId(n));
                    ctx
                };
                CURRENT_TID.store(n, Ordering::Relaxed);
                Action::Switch(from_ctx, to_ctx)
            }
            None => {
                // Nothing ready to run. Three cases:
                // 1. Current is a live (Ready→this can't happen here) or
                //    non-exited managed thread (e.g. Blocked): resume it —
                //    nothing to switch to.
                // 2. Current is an Exited thread: switch back to the boot
                //    context (the shell/init loop), never resume the dead
                //    stack. The boot context resumes inside `run_until_idle`
                //    / `yield_now` and proceeds normally.
                // 3. Current IS the boot context: nothing to do.
                if current != BOOT_TID {
                    let exited = find_thread(&table, ThreadId(current))
                        .map(|t| t.state == ThreadState::Exited)
                        .unwrap_or(false);
                    if exited {
                        // Switch back to the boot context. BOOT_CONTEXT was
                        // saved on the first switch away and never changes.
                        CURRENT_TID.store(BOOT_TID, Ordering::Relaxed);
                        Action::Switch(
                            find_thread_ctx_mut(&mut table, ThreadId(current))
                                .expect("exited thread missing from table"),
                            core::ptr::addr_of_mut!(BOOT_CONTEXT),
                        )
                    } else {
                        Action::Continue
                    }
                } else {
                    Action::Nothing
                }
            }
        }
        // `action` carries raw pointers derived under the lock; the lock is
        // dropped here (end of scope) before the switch — see the lock
        // discipline note above for the single-hart safety argument.
    };

    // Phase 2 (unlocked): perform the switch.
    match action {
        Action::Switch(from, to) => {
            // SAFETY: both pointers are valid, table-stable context structs
            // (see the lock-discipline comment); switch_context_asm only
            // reads/writes these two structs and the register file.
            unsafe { switch_context_asm(from, to) };
            true
        }
        Action::Continue => true,
        Action::Nothing => false,
    }
}

/// Voluntary yield: give up the hart for one scheduling decision.
pub fn yield_now() {
    schedule();
}

/// Drive the scheduler from the boot context until every spawned task has
/// run to completion, then return to the caller (boot context only).
///
/// Semantics: `schedule()` from the boot context never returns while managed
/// threads are runnable — control comes back only via the Exited→boot switch
/// inside `schedule()`, at which point all tasks are done. So one call
/// suffices; the loop re-checks in case new tasks appeared.
pub fn run_until_idle() {
    if CURRENT_TID.load(Ordering::Relaxed) != BOOT_TID {
        return; // only meaningful from the boot context
    }
    while has_runnable() {
        // Returns (back here) only when the queue drains or the last task
        // exits back to us.
        schedule();
    }
}

/// True if any managed thread is Ready or Running.
fn has_runnable() -> bool {
    let table = TABLE.lock();
    table.procs.iter().any(|p| {
        p.threads
            .iter()
            .any(|t| matches!(t.state, ThreadState::Ready | ThreadState::Running))
    })
}

// ─── Table helpers (callers must hold the TABLE lock) ────────────────────────

fn find_thread(table: &TableInner, tid: ThreadId) -> Option<&Thread> {
    table
        .procs
        .iter()
        .find_map(|p| p.threads.iter().find(|t| t.tid == tid))
}

/// # Safety
/// Callers must hold the TABLE lock and must not alias the returned pointer.
fn find_thread_ctx_mut(table: &mut TableInner, tid: ThreadId) -> Option<*mut SwitchContext> {
    table.procs.iter_mut().find_map(|p| {
        p.threads
            .iter_mut()
            .find(|t| t.tid == tid)
            .map(|t| &mut t.context as *mut SwitchContext)
    })
}

fn set_thread_state(table: &mut TableInner, tid: ThreadId, state: ThreadState) {
    for p in table.procs.iter_mut() {
        if let Some(t) = p.thread_mut(tid) {
            t.state = state;
            return;
        }
    }
}

fn bump_yield(table: &mut TableInner, tid: ThreadId) {
    for p in table.procs.iter_mut() {
        if p.threads.iter().any(|t| t.tid == tid) {
            p.yield_count += 1;
            return;
        }
    }
}

fn set_process_running(table: &mut TableInner, tid: ThreadId) {
    for p in table.procs.iter_mut() {
        if p.threads.iter().any(|t| t.tid == tid) {
            if p.state == ProcessState::Ready {
                p.state = ProcessState::Running;
            }
            return;
        }
    }
}

/// Termination path for a thread whose entry function returned.
///
/// Called from `thread_trampoline` (boot.S) with `a0 = &Thread`. Marks the
/// thread `Exited` and the process `Zombie`, then schedules away — never
/// returning to the dead stack. The thread's stack and the process's
/// resources are freed later by `reap_exited()`.
///
/// # Safety
///
/// `owner` must be the table-stable address of a live `Thread` in the
/// process table, as placed in `context.s2` by `create_kernel_task`. It is
/// only dereferenced once, read-only, before any table mutation.
#[no_mangle]
pub unsafe extern "C" fn thread_exit_hook(owner: *const Thread) -> ! {
    // SAFETY: see the Safety contract above; single read of tid/owner_pid.
    let (tid, pid) = {
        let t = unsafe { &*owner };
        (t.tid, t.owner_pid)
    };
    {
        let mut table = TABLE.lock();
        set_thread_state(&mut table, tid, ThreadState::Exited);
        println!(
            "  [task] thread {} of process {} exited (stack released at reap)",
            tid.0, pid.0
        );
    }
    let _ = mark_exited(pid, 0);
    // Schedule away. We can never return onto this stack — it will be
    // freed. Two outcomes:
    // - Another task is Ready: schedule() switches to it and this context
    //   is never resumed (state was already set to Exited above).
    // - Nothing is Ready: schedule() switches straight back to the boot
    //   context (the Exited→boot path), which resumes inside run_until_idle
    //   and continues the system. The dead context simply disappears.
    loop {
        schedule();
    }
}

// ─── Misc public helpers ──────────────────────────────────────────────────────

/// PID of the currently running context (boot context → PID 1).
pub fn current_pid() -> ProcessId {
    let tid = CURRENT_TID.load(Ordering::Relaxed);
    if tid == BOOT_TID {
        return ProcessId(1);
    }
    let table = TABLE.lock();
    find_thread(&table, ThreadId(tid))
        .map(|t| t.owner_pid)
        .unwrap_or(ProcessId(1))
}

/// TID of the current execution context (0 = boot context).
pub fn current_tid() -> usize {
    CURRENT_TID.load(Ordering::Relaxed)
}

/// Approximate milliseconds since boot.
pub fn uptime_ms() -> u64 {
    crate::arch::uptime_millis()
}

// ─── M2.1 proof: two kernel tasks alternating via real context switches ──────

/// Total context switches performed (diagnostics).
static SWITCH_COUNT: AtomicUsize = AtomicUsize::new(0);

pub fn switch_count() -> usize {
    SWITCH_COUNT.load(Ordering::Relaxed)
}

/// Task A body: prints `A <n>` and yields, `iterations` times, then returns
/// (exercising the exit hook). The loop is bounded so the demo returns the
/// hart to the boot context and the shell can start.
fn task_a(arg: usize) {
    let iterations = arg;
    for i in 0..iterations {
        println!("A {}", i);
        SWITCH_COUNT.fetch_add(1, Ordering::Relaxed);
        yield_now();
    }
    // Returning exercises thread_exit_hook → Zombie → reap path.
}

/// Task B body: same contract as Task A, printing `B <n>`.
fn task_b(arg: usize) {
    let iterations = arg;
    for i in 0..iterations {
        println!("B {}", i);
        SWITCH_COUNT.fetch_add(1, Ordering::Relaxed);
        yield_now();
    }
}

/// Create the two demo processes. Called from init before the shell starts.
pub fn spawn_demo_tasks(iterations: usize) -> (ProcessId, ProcessId) {
    let pa = create_kernel_task("task-a", Some(ProcessId(1)), task_a, iterations)
        .expect("create task-a");
    let pb = create_kernel_task("task-b", Some(ProcessId(1)), task_b, iterations)
        .expect("create task-b");
    (pa, pb)
}

// ─── In-kernel self tests ─────────────────────────────────────────────────────
//
// The kernel is a `no_std` binary whose boot code is RISC-V assembly; the
// host cannot link it, so `cargo test` cannot run these on x86. Instead the
// suite runs inside the booted kernel (via the `ktest` shell command), which
// is the environment where the behaviour actually matters. See TD-017.

/// Run the process-model self tests. Returns the number of failures.
pub fn run_self_tests() -> usize {
    let mut fails = 0usize;
    macro_rules! check {
        ($cond:expr, $($msg:tt)*) => {
            if !$cond {
                fails += 1;
                println!("    ✗ FAIL: {}", format_args!($($msg)*));
            }
        };
    }

    println!("  [ktest] process model:");

    // 1. PID uniqueness/monotonicity.
    let pid_a = create_kernel_task("test-a", Some(ProcessId(1)), task_a, 0).expect("test create a");
    let pid_b = create_kernel_task("test-b", Some(ProcessId(1)), task_b, 0).expect("test create b");
    check!(pid_a != pid_b, "PIDs must be unique");
    check!(pid_b > pid_a, "PIDs must be monotonic");

    // 2. Lookup + fields.
    let info = lookup(pid_a).expect("lookup created process");
    check!(info.name == "test-a", "name round-trips");
    check!(info.ppid == Some(1), "parent is init");
    check!(info.state == "Ready", "new task is Ready");
    check!(info.threads == 1, "one main thread");

    // 3. Invalid PID lookup.
    check!(lookup(ProcessId(999_999)).is_none(), "bogus PID not found");

    // 4. Thread context preparation.
    {
        let table = TABLE.lock();
        let p = table
            .procs
            .iter()
            .find(|p| p.pid == pid_a)
            .expect("process present");
        let t = &p.threads[0];
        check!(
            t.context.ra == (thread_trampoline as *const () as usize) as u64,
            "context.ra == trampoline"
        );
        check!(
            t.context.sp == t.stack_top() as u64,
            "context.sp == stack top"
        );
        check!(
            t.context.s0 == (task_a as *const () as usize) as u64,
            "context.s0 == entry"
        );
        check!(t.stack_size() == 64 * 1024, "kernel stack is 64 KiB");
        check!(t.stack_top() % 16 == 0, "stack top 16-byte aligned");
        check!(t.stack_contains(t.stack_top() - 8), "bounds check hit");
        check!(
            !t.stack_contains(t.stack_top()),
            "bounds check miss above top"
        );
        check!(
            !t.stack_contains(t.stack_base() - 8),
            "bounds check miss below base"
        );
    }

    // 5. State transitions: valid and invalid.
    check!(
        set_state(pid_a, ProcessState::Running).is_ok(),
        "Ready→Running allowed"
    );
    check!(
        set_state(pid_a, ProcessState::New).is_err(),
        "Running→New rejected"
    );
    check!(
        set_state(pid_a, ProcessState::Blocked).is_ok(),
        "Running→Blocked allowed"
    );
    check!(
        set_state(pid_a, ProcessState::Blocked).is_err(),
        "Blocked→Blocked rejected"
    );
    check!(
        set_state(pid_a, ProcessState::Ready).is_ok(),
        "Blocked→Ready allowed"
    );

    // 6. Scheduler rotation: with both tasks Ready and neither running, the
    // picker must alternate across successive picks when interleaved with
    // state updates (simulates what schedule() does on the real hart).
    {
        let mut table = TABLE.lock();
        let ta = table
            .procs
            .iter()
            .find(|p| p.pid == pid_a)
            .and_then(|p| p.threads.first().map(|t| t.tid.0))
            .expect("task a tid");
        let tb = table
            .procs
            .iter()
            .find(|p| p.pid == pid_b)
            .and_then(|p| p.threads.first().map(|t| t.tid.0))
            .expect("task b tid");
        // Simulate: a runs → pick returns b; b runs → pick returns a.
        let first = pick_next_locked(&table)
            .expect("rotation test: both tasks must be Ready at this point");
        set_thread_state(&mut table, ThreadId(first), ThreadState::Running);
        CURRENT_TID.store(first, Ordering::Relaxed);
        let second = pick_next_locked(&table).expect("rotation test: second task must be Ready");
        set_thread_state(&mut table, ThreadId(second), ThreadState::Running);
        CURRENT_TID.store(second, Ordering::Relaxed);
        // Yield from `second`: both tasks return to the queue, exactly as
        // schedule() leaves them after a voluntary yield. The next pick must
        // wrap around to `first`.
        set_thread_state(&mut table, ThreadId(second), ThreadState::Ready);
        set_thread_state(&mut table, ThreadId(first), ThreadState::Ready);
        let third = pick_next_locked(&table)
            .expect("rotation test: a task must be pickable on the third round");
        check!(
            (first, second, third) == (ta, tb, ta) || (first, second, third) == (tb, ta, tb),
            "round-robin alternation a→b→a (got {}→{}→{})",
            first,
            second,
            third
        );
        // Restore Ready for both so the exit path below is consistent.
        set_thread_state(&mut table, ThreadId(ta), ThreadState::Ready);
        set_thread_state(&mut table, ThreadId(tb), ThreadState::Ready);
        CURRENT_TID.store(BOOT_TID, Ordering::Relaxed);
    }

    // 7. Exit + reap.
    check!(mark_exited(pid_a, 7).is_ok(), "mark_exited ok");
    check!(lookup(pid_a).unwrap().state == "Zombie", "exited → Zombie");
    check!(
        set_state(pid_a, ProcessState::Ready).is_err(),
        "Zombie is terminal"
    );
    // Also retire pid_b so the table returns to just init (the test tasks
    // were never meant to run; leaving them Ready would pollute `ps`).
    check!(mark_exited(pid_b, 0).is_ok(), "mark_exited b ok");
    let reaped = reap_exited();
    check!(reaped >= 2, "reaped both zombies, got {}", reaped);
    check!(lookup(pid_a).is_none(), "reaped process removed from table");
    check!(lookup(pid_b).is_none(), "second zombie removed too");
    check!(lookup(ProcessId(1)).is_some(), "init survives reap");

    // 8. Stack alloc/free round-trip (exercises PMA contiguity + Drop).
    {
        let before = pma::stats().free_frames;
        let s = KernelStack::new().expect("test stack alloc");
        check!(s.top() - s.base() == 64 * 1024, "stack size math");
        check!(s.base().is_multiple_of(PAGE_SIZE), "stack page aligned");
        drop(s);
        let after = pma::stats().free_frames;
        check!(after == before, "stack free returns exactly its frames");
    }

    // 9. Private AddressSpace lifecycle: create an Owned space, verify the
    // ProcessSpace::Owned path (owns_address_space), then destroy (kernel
    // region tables must survive — vmm guarantees that in destroy()).
    {
        let kern_root = crate::vmm::kernel_address_space().root_phys().0;
        let space = crate::vmm::create_address_space();
        check!(
            space.root_phys().0 != kern_root,
            "private space has its own root table"
        );
        let mut owned = ProcessSpace::Owned(Box::new(space));
        let owns = match &owned {
            ProcessSpace::Owned(_) => true,
            ProcessSpace::Kernel => false,
        };
        check!(owns, "Owned variant recognized");
        if let ProcessSpace::Owned(ref mut s) = owned {
            // SAFETY: test-owned space, never activated.
            unsafe { s.destroy() };
        }
    }

    if fails == 0 {
        println!("    ✓ all process-model tests passed");
    } else {
        println!("    {} failure(s)", fails);
    }
    fails
}
