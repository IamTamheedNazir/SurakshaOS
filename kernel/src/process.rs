//! SurakshaOS Process Management
//! Provides the process ID type, a simple process table, and
//! scheduler stubs for future preemptive multitasking.

use core::sync::atomic::{AtomicUsize, Ordering};

// ─── process identifier ──────────────────────────────────────────────────────

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub struct ProcessId(pub usize);

impl core::fmt::Display for ProcessId {
    fn fmt(&self, f: &mut core::fmt::Formatter<'_>) -> core::fmt::Result {
        write!(f, "{}", self.0)
    }
}

// ─── PID allocator ──────────────────────────────────────────────────────────

/// Next PID to hand out (start above the boot-time service PIDs)
static NEXT_PID: AtomicUsize = AtomicUsize::new(10);

/// Current running process (the shell after init hands off)
static CURRENT_PID: AtomicUsize = AtomicUsize::new(7);

// ─── public API ──────────────────────────────────────────────────────────────

/// Spawn a new (stub) process and return its PID.
/// In a full OS this would allocate a process control block,
/// set up a page table, and add the process to the scheduler queue.
pub fn spawn_process(_name: &str) -> Result<ProcessId, &'static str> {
    let pid = NEXT_PID.fetch_add(1, Ordering::SeqCst);
    Ok(ProcessId(pid))
}

/// Return the PID of the currently executing process.
pub fn current_pid() -> ProcessId {
    ProcessId(CURRENT_PID.load(Ordering::Relaxed))
}

/// Approximate milliseconds since boot.
/// Reads the RISC-V CLINT mtime register directly.
pub fn uptime_ms() -> u64 {
    crate::arch::uptime_millis()
}
