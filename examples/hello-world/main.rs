//! Hello World Example
//!
//! Simple SurakshaOS native application.

#![no_std]
#![no_main]

// Import SurakshaOS SDK (when available)
// use suraksha_sdk::prelude::*;

#[no_mangle]
pub extern "C" fn main() -> i32 {
    // Print hello message
    println!("🇮🇳 Hello from SurakshaOS!");
    println!("This is a native Rust application.");
    println!("Running on the world's most secure mobile OS!");
    
    // Request capability for file access
    // let file_cap = request_capability(
    //     CapabilityType::File,
    //     "/home/user/documents"
    // ).expect("Failed to get file capability");
    
    // Write to file
    // file_cap.write("hello.txt", b"Hello, SurakshaOS!")
    //     .expect("Failed to write file");
    
    println!("✅ Application completed successfully!");
    
    0 // Success
}

#[panic_handler]
fn panic(_info: &core::panic::PanicInfo) -> ! {
    loop {}
}

// Temporary println macro (until SDK is ready)
#[macro_export]
macro_rules! println {
    ($($arg:tt)*) => {{
        // TODO: Use actual syscall for output
    }};
}
