//! Display Driver
//!
//! Display output subsystem

pub mod framebuffer;

pub use framebuffer::{Framebuffer, FramebufferInfo, Color, PixelFormat};

/// Initialize display subsystem
pub fn init() {
    println!("\n🖥️  Display Driver Initialization");
    println!("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    
    // For QEMU, we'll use a simple framebuffer
    // In real hardware, this would detect and initialize the actual display
    
    // QEMU virt machine doesn't have a framebuffer by default
    // We'll simulate one for testing
    let info = FramebufferInfo {
        addr: 0x5000_0000, // Simulated framebuffer address
        width: 800,
        height: 600,
        stride: 800 * 4, // RGBA8888
        format: PixelFormat::RGBA8888,
    };
    
    framebuffer::init(info);
    framebuffer::test_framebuffer();
    
    println!("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
}
