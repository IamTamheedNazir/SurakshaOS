use core::sync::atomic::{AtomicU64, AtomicUsize, Ordering};

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub struct ProcessId(pub u32);

static UPTIME_MS: AtomicU64 = AtomicU64::new(0);

pub fn tick_uptime() {
    UPTIME_MS.fetch_add(1, Ordering::Relaxed);
}

pub fn uptime_ms() -> u64 {
    UPTIME_MS.load(Ordering::Relaxed)
}

static CURRENT_PID: AtomicUsize = AtomicUsize::new(7);

pub fn current_pid() -> ProcessId {
    ProcessId(CURRENT_PID.load(Ordering::Relaxed) as u32)
}

pub fn spawn_process(_name: &str) -> Result<ProcessId, &'static str> {
    static NEXT: AtomicUsize = AtomicUsize::new(8);
    Ok(ProcessId(NEXT.fetch_add(1, Ordering::Relaxed) as u32))
}

pub static HEAP_TOTAL: AtomicUsize = AtomicUsize::new(67108864);

@'
use linked_list_allocator::LockedHeap;

#[global_allocator]
static ALLOCATOR: LockedHeap = LockedHeap::empty();

const HEAP_START: usize = 0x84000000;
const HEAP_SIZE:  usize = 64 * 1024 * 1024;

pub fn init_heap() {
    unsafe {
        ALLOCATOR.lock().init(HEAP_START as *mut u8, HEAP_SIZE);
    }
    crate::process::HEAP_TOTAL.store(HEAP_SIZE, core::sync::atomic::Ordering::Relaxed);
}

pub fn heap_used() -> usize {
    crate::process::heap_used()
}

pub fn heap_total() -> usize {
    HEAP_SIZE
}
