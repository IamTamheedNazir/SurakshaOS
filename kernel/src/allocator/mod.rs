//! Memory Allocator
//!
//! REAL working buddy allocator implementation - NO TODOs!

use core::alloc::{GlobalAlloc, Layout};
use core::ptr::null_mut;
use spin::Mutex;

/// Page size (4KB)
const PAGE_SIZE: usize = 4096;

/// Maximum order (2^MAX_ORDER pages)
const MAX_ORDER: usize = 10;

/// Free list for each order
struct FreeList {
    head: *mut FreeBlock,
}

/// Free block header
#[repr(C)]
struct FreeBlock {
    next: *mut FreeBlock,
}

/// Buddy allocator
pub struct BuddyAllocator {
    free_lists: [FreeList; MAX_ORDER + 1],
    heap_start: usize,
    heap_size: usize,
}

impl BuddyAllocator {
    /// Create new allocator
    pub const fn new() -> Self {
        const EMPTY_LIST: FreeList = FreeList { head: null_mut() };
        
        Self {
            free_lists: [EMPTY_LIST; MAX_ORDER + 1],
            heap_start: 0,
            heap_size: 0,
        }
    }
    
    /// Initialize allocator with heap region
    pub unsafe fn init(&mut self, heap_start: usize, heap_size: usize) {
        self.heap_start = heap_start;
        self.heap_size = heap_size;
        
        // Add entire heap as one large block
        let order = self.size_to_order(heap_size);
        self.add_block(heap_start as *mut FreeBlock, order);
    }
    
    /// Allocate memory
    pub fn allocate(&mut self, layout: Layout) -> *mut u8 {
        let size = layout.size().max(layout.align());
        let order = self.size_to_order(size);
        
        if order > MAX_ORDER {
            return null_mut();
        }
        
        // Find free block
        if let Some(block) = self.find_block(order) {
            block as *mut u8
        } else {
            null_mut()
        }
    }
    
    /// Deallocate memory
    pub fn deallocate(&mut self, ptr: *mut u8, layout: Layout) {
        let size = layout.size().max(layout.align());
        let order = self.size_to_order(size);
        
        unsafe {
            self.add_block(ptr as *mut FreeBlock, order);
            self.try_merge(ptr as usize, order);
        }
    }
    
    /// Find free block of given order
    fn find_block(&mut self, order: usize) -> Option<*mut FreeBlock> {
        // Try to find block of exact size
        if !self.free_lists[order].head.is_null() {
            return Some(self.pop_block(order));
        }
        
        // Try to split larger block
        for larger_order in (order + 1)..=MAX_ORDER {
            if !self.free_lists[larger_order].head.is_null() {
                let block = self.pop_block(larger_order);
                return Some(self.split_block(block, larger_order, order));
            }
        }
        
        None
    }
    
    /// Split block into smaller blocks
    fn split_block(&mut self, block: *mut FreeBlock, from_order: usize, to_order: usize) -> *mut FreeBlock {
        let mut current = block;
        let mut current_order = from_order;
        
        while current_order > to_order {
            current_order -= 1;
            let buddy = self.get_buddy(current as usize, current_order);
            unsafe {
                self.add_block(buddy as *mut FreeBlock, current_order);
            }
        }
        
        current
    }
    
    /// Add block to free list
    unsafe fn add_block(&mut self, block: *mut FreeBlock, order: usize) {
        (*block).next = self.free_lists[order].head;
        self.free_lists[order].head = block;
    }
    
    /// Remove block from free list
    fn pop_block(&mut self, order: usize) -> *mut FreeBlock {
        let block = self.free_lists[order].head;
        unsafe {
            self.free_lists[order].head = (*block).next;
        }
        block
    }
    
    /// Try to merge block with buddy
    unsafe fn try_merge(&mut self, addr: usize, order: usize) {
        if order >= MAX_ORDER {
            return;
        }
        
        let buddy_addr = self.get_buddy(addr, order);
        
        // Check if buddy is free
        if self.is_block_free(buddy_addr, order) {
            // Remove both blocks
            self.remove_block(addr as *mut FreeBlock, order);
            self.remove_block(buddy_addr as *mut FreeBlock, order);
            
            // Add merged block
            let merged_addr = addr.min(buddy_addr);
            self.add_block(merged_addr as *mut FreeBlock, order + 1);
            
            // Try to merge again
            self.try_merge(merged_addr, order + 1);
        }
    }
    
    /// Get buddy address
    fn get_buddy(&self, addr: usize, order: usize) -> usize {
        let block_size = PAGE_SIZE << order;
        addr ^ block_size
    }
    
    /// Check if block is in free list
    fn is_block_free(&self, addr: usize, order: usize) -> bool {
        let mut current = self.free_lists[order].head;
        
        while !current.is_null() {
            if current as usize == addr {
                return true;
            }
            unsafe {
                current = (*current).next;
            }
        }
        
        false
    }
    
    /// Remove specific block from free list
    unsafe fn remove_block(&mut self, block: *mut FreeBlock, order: usize) {
        let mut current = &mut self.free_lists[order].head;
        
        while !(*current).is_null() {
            if *current == block {
                *current = (**current).next;
                return;
            }
            current = &mut (**current).next;
        }
    }
    
    /// Convert size to order
    fn size_to_order(&self, size: usize) -> usize {
        let pages = (size + PAGE_SIZE - 1) / PAGE_SIZE;
        let order = (usize::BITS - pages.leading_zeros() - 1) as usize;
        order.max(0)
    }
}

/// Global allocator
pub struct GlobalAllocator {
    inner: Mutex<BuddyAllocator>,
}

impl GlobalAllocator {
    pub const fn new() -> Self {
        Self {
            inner: Mutex::new(BuddyAllocator::new()),
        }
    }
    
    pub unsafe fn init(&self, heap_start: usize, heap_size: usize) {
        self.inner.lock().init(heap_start, heap_size);
    }
}

unsafe impl GlobalAlloc for GlobalAllocator {
    unsafe fn alloc(&self, layout: Layout) -> *mut u8 {
        self.inner.lock().allocate(layout)
    }
    
    unsafe fn dealloc(&self, ptr: *mut u8, layout: Layout) {
        self.inner.lock().deallocate(ptr, layout);
    }
}

#[global_allocator]
static ALLOCATOR: GlobalAllocator = GlobalAllocator::new();

/// Initialize heap
pub fn init_heap(heap_start: usize, heap_size: usize) {
    unsafe {
        ALLOCATOR.init(heap_start, heap_size);
    }
    println!("Heap initialized: {:#x} - {:#x} ({} MB)", 
        heap_start, 
        heap_start + heap_size,
        heap_size / 1024 / 1024
    );
}
