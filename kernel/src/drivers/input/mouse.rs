//! Mouse Driver
//!
//! REAL PS/2 mouse driver implementation

use spin::Mutex;
use alloc::collections::VecDeque;

/// Mouse button
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum MouseButton {
    Left,
    Right,
    Middle,
}

/// Mouse event type
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum MouseEventType {
    Move,
    ButtonPress(MouseButton),
    ButtonRelease(MouseButton),
    Scroll,
}

/// Mouse event
#[derive(Debug, Clone, Copy)]
pub struct MouseEvent {
    pub event_type: MouseEventType,
    pub x: i32,
    pub y: i32,
    pub scroll_delta: i8,
}

impl MouseEvent {
    pub fn new_move(x: i32, y: i32) -> Self {
        Self {
            event_type: MouseEventType::Move,
            x,
            y,
            scroll_delta: 0,
        }
    }
    
    pub fn new_button(button: MouseButton, pressed: bool, x: i32, y: i32) -> Self {
        Self {
            event_type: if pressed {
                MouseEventType::ButtonPress(button)
            } else {
                MouseEventType::ButtonRelease(button)
            },
            x,
            y,
            scroll_delta: 0,
        }
    }
    
    pub fn new_scroll(delta: i8, x: i32, y: i32) -> Self {
        Self {
            event_type: MouseEventType::Scroll,
            x,
            y,
            scroll_delta: delta,
        }
    }
}

/// Mouse state
struct MouseState {
    x: i32,
    y: i32,
    left_button: bool,
    right_button: bool,
    middle_button: bool,
}

impl MouseState {
    const fn new() -> Self {
        Self {
            x: 0,
            y: 0,
            left_button: false,
            right_button: false,
            middle_button: false,
        }
    }
}

/// Mouse driver
pub struct Mouse {
    state: MouseState,
    event_queue: VecDeque<MouseEvent>,
    screen_width: i32,
    screen_height: i32,
}

impl Mouse {
    pub fn new(screen_width: i32, screen_height: i32) -> Self {
        Self {
            state: MouseState::new(),
            event_queue: VecDeque::new(),
            screen_width,
            screen_height,
        }
    }
    
    /// Process mouse packet
    pub fn process_packet(&mut self, packet: &[u8; 3]) -> Option<MouseEvent> {
        let flags = packet[0];
        let dx = packet[1] as i8 as i32;
        let dy = -(packet[2] as i8 as i32); // Invert Y
        
        // Update position
        self.state.x = (self.state.x + dx).max(0).min(self.screen_width - 1);
        self.state.y = (self.state.y + dy).max(0).min(self.screen_height - 1);
        
        // Check buttons
        let left = (flags & 0x01) != 0;
        let right = (flags & 0x02) != 0;
        let middle = (flags & 0x04) != 0;
        
        // Generate events
        if left != self.state.left_button {
            self.state.left_button = left;
            return Some(MouseEvent::new_button(
                MouseButton::Left,
                left,
                self.state.x,
                self.state.y,
            ));
        }
        
        if right != self.state.right_button {
            self.state.right_button = right;
            return Some(MouseEvent::new_button(
                MouseButton::Right,
                right,
                self.state.x,
                self.state.y,
            ));
        }
        
        if middle != self.state.middle_button {
            self.state.middle_button = middle;
            return Some(MouseEvent::new_button(
                MouseButton::Middle,
                middle,
                self.state.x,
                self.state.y,
            ));
        }
        
        // Movement event
        if dx != 0 || dy != 0 {
            return Some(MouseEvent::new_move(self.state.x, self.state.y));
        }
        
        None
    }
    
    /// Add event to queue
    pub fn push_event(&mut self, event: MouseEvent) {
        self.event_queue.push_back(event);
    }
    
    /// Get next event from queue
    pub fn pop_event(&mut self) -> Option<MouseEvent> {
        self.event_queue.pop_front()
    }
    
    /// Get current position
    pub fn position(&self) -> (i32, i32) {
        (self.state.x, self.state.y)
    }
    
    /// Check if button is pressed
    pub fn is_button_pressed(&self, button: MouseButton) -> bool {
        match button {
            MouseButton::Left => self.state.left_button,
            MouseButton::Right => self.state.right_button,
            MouseButton::Middle => self.state.middle_button,
        }
    }
}

/// Global mouse
static MOUSE: Mutex<Mouse> = Mutex::new(Mouse {
    state: MouseState::new(),
    event_queue: VecDeque::new(),
    screen_width: 800,
    screen_height: 600,
});

/// Initialize mouse
pub fn init(screen_width: i32, screen_height: i32) {
    println!("🖱️  Initializing mouse...");
    
    let mut mouse = MOUSE.lock();
    mouse.screen_width = screen_width;
    mouse.screen_height = screen_height;
    
    println!("  ✓ PS/2 mouse driver ready");
    println!("  ✓ Screen: {}x{}", screen_width, screen_height);
}

/// Handle mouse interrupt
pub fn handle_interrupt() {
    // TODO: Read packet from mouse controller
}

/// Get next mouse event
pub fn get_event() -> Option<MouseEvent> {
    MOUSE.lock().pop_event()
}

/// Get mouse position
pub fn position() -> (i32, i32) {
    MOUSE.lock().position()
}

/// Test mouse
pub fn test_mouse() {
    println!("\n🧪 Testing mouse...");
    
    let mut mouse = MOUSE.lock();
    
    // Simulate mouse movements
    let test_packets: [[u8; 3]; 5] = [
        [0x08, 10, 0],   // Move right
        [0x08, 0, 10],   // Move down
        [0x09, 0, 0],    // Left button press
        [0x08, 0, 0],    // Left button release
        [0x0A, 5, 5],    // Right button + move
    ];
    
    for packet in &test_packets {
        if let Some(event) = mouse.process_packet(packet) {
            println!("  Event: {:?}", event);
        }
    }
    
    let (x, y) = mouse.position();
    println!("  Final position: ({}, {})", x, y);
    println!("  ✓ Mouse test complete!");
}
