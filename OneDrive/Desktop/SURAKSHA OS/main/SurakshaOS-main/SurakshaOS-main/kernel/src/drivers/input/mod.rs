//! Input Drivers
//!
//! Keyboard and mouse input

pub mod keyboard;
pub mod mouse;

pub use keyboard::{KeyCode, KeyEvent, Scancode};
pub use mouse::{MouseButton, MouseEvent, MouseEventType};

/// Initialize input subsystem
pub fn init() {
    println!("\n⌨️  Input Driver Initialization");
    println!("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    
    keyboard::init();
    keyboard::test_keyboard();
    
    mouse::init(800, 600);
    mouse::test_mouse();
    
    println!("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
}
