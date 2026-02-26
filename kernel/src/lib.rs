//! SurakshaOS Kernel Library
//!
//! Core kernel APIs for userspace and testing.

#![no_std]
#![feature(asm_const)]
#![deny(unsafe_code)]
#![warn(missing_docs)]

extern crate alloc;

// Re-export kernel modules
pub mod boot;
pub mod memory;
pub mod capability;
pub mod ipc;
pub mod scheduler;
pub mod syscall;
pub mod crypto;
pub mod fs;
pub mod drivers;
pub mod power;
pub mod ai;
pub mod net;
pub mod security;

// Re-export commonly used types
pub use capability::{Capability, CapabilityType, Permission};
pub use memory::{MemoryStats, PageSize};
pub use ipc::{Message, MessageType};
pub use scheduler::{ProcessId, Priority};

/// Kernel version
pub const VERSION: &str = env!("CARGO_PKG_VERSION");

/// Kernel name
pub const NAME: &str = "SurakshaOS";

/// Get kernel version string
pub fn version() -> &'static str {
    VERSION
}

/// Get kernel name
pub fn name() -> &'static str {
    NAME
}
