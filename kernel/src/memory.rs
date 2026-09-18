//! SurakshaOS Memory Management
//!
//! Provides the global kernel heap allocator (Rust `#[global_allocator]`)
//! and physical memory allocator (PMA) integration.
//!
//! # Memory Architecture
//!
//! The physical memory is managed by the PMA (`pma` module) using a bitmap
//! allocator. The kernel heap lives in a region after the BSS section and
//! is managed by `linked_list_allocator` for dynamic kernel allocations.
//!
//! Future work:
//! - Replace `linked_list_allocator` with a dedicated slab/buddy allocator
//! - Size the heap dynamically based on PMA free frame statistics
//! - Add page-granularity kernel heap (for page table allocations, etc.)

use linked_list_allocator::LockedHeap;

#[global_allocator]
static ALLOCATOR: LockedHeap = LockedHeap::empty();

// Heap boundaries defined by the linker script
extern "C" {
    static _heap_start: u8;
    static _heap_end: u8;
}

/// Maximum heap size.
///
/// Currently capped at 64 MiB to avoid the heap consuming all free
/// physical frames. Once DTB parsing is implemented, this should be
/// computed dynamically from the available memory reported by the PMA.
const MAX_HEAP: usize = 64 * 1024 * 1024;

static mut HEAP_TOTAL_SIZE: usize = 0;

/// Initialise the global heap allocator.
///
/// Must be called exactly once, before any allocation.
/// The heap region is defined by the linker script symbols
/// `_heap_start` and `_heap_end`, which span from after BSS
/// to the end of the RAM region defined in `linker.ld`.
///
/// # Safety
///
/// Reads linker symbols and initializes the global `ALLOCATOR`.
/// Must be called exactly once from `kernel_main`.
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

/// Bytes currently available on the heap.
pub fn heap_free() -> usize {
    heap_total() - heap_used()
}

/// Physical memory allocator statistics.
///
/// Delegates to the PMA module for accurate physical frame accounting.
pub fn pma_stats() -> crate::pma::PmaStats {
    crate::pma::stats()
}
