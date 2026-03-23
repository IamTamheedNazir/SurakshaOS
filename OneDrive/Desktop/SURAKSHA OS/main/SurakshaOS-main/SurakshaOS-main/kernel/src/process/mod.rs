//! Process Management
//!
//! Complete process management subsystem

pub mod context;
pub mod scheduler;

pub use context::Context;
pub use scheduler::{Pid, Priority, ProcessState};

/// Initialize process management
pub fn init() {
    println!("\n⚙️  Process Management Initialization");
    println!("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    
    scheduler::init();
    
    // Test context switching
    context::test_context_switch();
    
    println!("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
}
