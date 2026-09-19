//! SurakshaOS Memory Management
//!
//! Provides the global kernel heap allocator (Rust `#[global_allocator]`)
//! and physical memory allocator (PMA) integration.
//!
//! # Memory Architecture
//!
//! The physical memory is managed by the PMA (`pma` module) using a bitmap
//! allocator. The kernel heap lives in the linker-script region
//! `[heap_start, heap_end)` — after BSS — and is managed by
//! `linked_list_allocator` for dynamic kernel allocations.
//!
//! **Important invariant:** the PMA reserves the exact same heap region
//! (`heap_start..heap_end`), so page-table frames allocated from the PMA
//! can never overlap heap memory. See `pma::init()`.

use linked_list_allocator::LockedHeap;

#[global_allocator]
static ALLOCATOR: LockedHeap = LockedHeap::empty();

// Heap boundaries defined by the linker script
extern "C" {
    static _heap_start: u8;
    static _heap_end: u8;
}

static mut HEAP_TOTAL_SIZE: usize = 0;

/// Initialise the global heap allocator.
///
/// Must be called exactly once, before any allocation.
/// The heap region is defined by the linker script symbols
/// `_heap_start` and `_heap_end` (after BSS to the linker RAM end).
///
/// # Safety
///
/// Reads linker symbols and initializes the global `ALLOCATOR`.
/// Must be called exactly once from `kernel_main`.
pub fn init_heap() {
    // SAFETY: linker-defined symbols; addresses are constant after link and
    // the region [heap_start, heap_end) is valid, page-aligned RAM that is
    // also reserved in the PMA (see pma::init).
    unsafe {
        let start = &_heap_start as *const u8 as usize;
        let end = &_heap_end as *const u8 as usize;
        assert!(
            end > start && start.is_multiple_of(8),
            "bad heap bounds from linker"
        );
        // SAFETY: one-time initialization of a boot-time-only static.
        core::ptr::addr_of_mut!(HEAP_TOTAL_SIZE).write_volatile(end - start);
        ALLOCATOR.lock().init(start as *mut u8, end - start);
    }
}

/// Bytes currently allocated on the heap.
pub fn heap_used() -> usize {
    ALLOCATOR.lock().used()
}

/// Total heap size in bytes.
pub fn heap_total() -> usize {
    // SAFETY: written once during init_heap before any reader runs.
    unsafe { core::ptr::addr_of!(HEAP_TOTAL_SIZE).read_volatile() }
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
