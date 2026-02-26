//! Memory Management
//!
//! Complete memory management subsystem

pub mod page_table;

pub use page_table::{VirtAddr, PhysAddr, PageTable, PTEFlags};

/// Initialize memory management
pub fn init() {
    println!("\n💾 Memory Management Initialization");
    println!("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    
    // Initialize virtual memory
    page_table::init();
    
    println!("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
}
