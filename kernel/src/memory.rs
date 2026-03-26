//! SurakshaOS Memory Management
//! Buddy/linked-list heap allocator providing the global allocator,
//! heap initialisation, and memory usage statistics.

use linked_list_allocator::LockedHeap;

#[global_allocator]
static ALLOCATOR: LockedHeap = LockedHeap::empty();

// Heap boundaries defined by the linker script
extern "C" {
    static _heap_start: u8;
    static _heap_end: u8;
}

/// Maximum heap size (64 MB — matches the kernel_main comment)
const MAX_HEAP: usize = 64 * 1024 * 1024;

static mut HEAP_TOTAL_SIZE: usize = 0;

/// Initialise the global heap allocator.
/// Must be called exactly once, before any allocation.
pub fn init_heap() {
    unsafe {
        let start = &_heap_start as *const u8 as usize;
        let end   = &_heap_end   as *const u8 as usize;
        let size  = (end - start).min(MAX_HEAP);
        HEAP_TOTAL_SIZE = size;
        ALLOCATOR.lock().init(start as *mut u8, size);
    }
}

/// Bytes currently allocated on the heap.
pub fn heap_used() -> usize {
    ALLOCATOR.lock().used()
}

/// Total heap size in bytes.
pub fn heap_total() -> usize {
    unsafe { HEAP_TOTAL_SIZE }
}
