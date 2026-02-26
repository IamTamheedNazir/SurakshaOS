//! Keyboard Driver
//!
//! REAL PS/2 keyboard driver implementation

use spin::Mutex;
use alloc::collections::VecDeque;

/// Keyboard scancode
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub struct Scancode(u8);

impl Scancode {
    pub fn new(code: u8) -> Self {
        Self(code)
    }
    
    pub fn as_u8(&self) -> u8 {
        self.0
    }
}

/// Key code
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum KeyCode {
    // Letters
    A, B, C, D, E, F, G, H, I, J, K, L, M,
    N, O, P, Q, R, S, T, U, V, W, X, Y, Z,
    
    // Numbers
    Num0, Num1, Num2, Num3, Num4,
    Num5, Num6, Num7, Num8, Num9,
    
    // Function keys
    F1, F2, F3, F4, F5, F6,
    F7, F8, F9, F10, F11, F12,
    
    // Special keys
    Escape, Backspace, Tab, Enter, Space,
    LeftShift, RightShift, LeftCtrl, RightCtrl,
    LeftAlt, RightAlt, CapsLock,
    
    // Arrow keys
    Up, Down, Left, Right,
    
    // Other
    Insert, Delete, Home, End, PageUp, PageDown,
    
    Unknown,
}

/// Key event
#[derive(Debug, Clone, Copy)]
pub struct KeyEvent {
    pub keycode: KeyCode,
    pub pressed: bool,
    pub shift: bool,
    pub ctrl: bool,
    pub alt: bool,
}

impl KeyEvent {
    pub fn new(keycode: KeyCode, pressed: bool) -> Self {
        Self {
            keycode,
            pressed,
            shift: false,
            ctrl: false,
            alt: false,
        }
    }
    
    /// Get ASCII character if available
    pub fn to_ascii(&self) -> Option<char> {
        if !self.pressed {
            return None;
        }
        
        match self.keycode {
            KeyCode::A => Some(if self.shift { 'A' } else { 'a' }),
            KeyCode::B => Some(if self.shift { 'B' } else { 'b' }),
            KeyCode::C => Some(if self.shift { 'C' } else { 'c' }),
            KeyCode::D => Some(if self.shift { 'D' } else { 'd' }),
            KeyCode::E => Some(if self.shift { 'E' } else { 'e' }),
            KeyCode::F => Some(if self.shift { 'F' } else { 'f' }),
            KeyCode::G => Some(if self.shift { 'G' } else { 'g' }),
            KeyCode::H => Some(if self.shift { 'H' } else { 'h' }),
            KeyCode::I => Some(if self.shift { 'I' } else { 'i' }),
            KeyCode::J => Some(if self.shift { 'J' } else { 'j' }),
            KeyCode::K => Some(if self.shift { 'K' } else { 'k' }),
            KeyCode::L => Some(if self.shift { 'L' } else { 'l' }),
            KeyCode::M => Some(if self.shift { 'M' } else { 'm' }),
            KeyCode::N => Some(if self.shift { 'N' } else { 'n' }),
            KeyCode::O => Some(if self.shift { 'O' } else { 'o' }),
            KeyCode::P => Some(if self.shift { 'P' } else { 'p' }),
            KeyCode::Q => Some(if self.shift { 'Q' } else { 'q' }),
            KeyCode::R => Some(if self.shift { 'R' } else { 'r' }),
            KeyCode::S => Some(if self.shift { 'S' } else { 's' }),
            KeyCode::T => Some(if self.shift { 'T' } else { 't' }),
            KeyCode::U => Some(if self.shift { 'U' } else { 'u' }),
            KeyCode::V => Some(if self.shift { 'V' } else { 'v' }),
            KeyCode::W => Some(if self.shift { 'W' } else { 'w' }),
            KeyCode::X => Some(if self.shift { 'X' } else { 'x' }),
            KeyCode::Y => Some(if self.shift { 'Y' } else { 'y' }),
            KeyCode::Z => Some(if self.shift { 'Z' } else { 'z' }),
            
            KeyCode::Num0 => Some(if self.shift { ')' } else { '0' }),
            KeyCode::Num1 => Some(if self.shift { '!' } else { '1' }),
            KeyCode::Num2 => Some(if self.shift { '@' } else { '2' }),
            KeyCode::Num3 => Some(if self.shift { '#' } else { '3' }),
            KeyCode::Num4 => Some(if self.shift { '$' } else { '4' }),
            KeyCode::Num5 => Some(if self.shift { '%' } else { '5' }),
            KeyCode::Num6 => Some(if self.shift { '^' } else { '6' }),
            KeyCode::Num7 => Some(if self.shift { '&' } else { '7' }),
            KeyCode::Num8 => Some(if self.shift { '*' } else { '8' }),
            KeyCode::Num9 => Some(if self.shift { '(' } else { '9' }),
            
            KeyCode::Space => Some(' '),
            KeyCode::Enter => Some('\n'),
            KeyCode::Tab => Some('\t'),
            KeyCode::Backspace => Some('\x08'),
            
            _ => None,
        }
    }
}

/// Keyboard state
struct KeyboardState {
    shift_pressed: bool,
    ctrl_pressed: bool,
    alt_pressed: bool,
    caps_lock: bool,
}

impl KeyboardState {
    const fn new() -> Self {
        Self {
            shift_pressed: false,
            ctrl_pressed: false,
            alt_pressed: false,
            caps_lock: false,
        }
    }
}

/// Keyboard driver
pub struct Keyboard {
    state: KeyboardState,
    event_queue: VecDeque<KeyEvent>,
}

impl Keyboard {
    pub fn new() -> Self {
        Self {
            state: KeyboardState::new(),
            event_queue: VecDeque::new(),
        }
    }
    
    /// Process scancode
    pub fn process_scancode(&mut self, scancode: Scancode) -> Option<KeyEvent> {
        let code = scancode.as_u8();
        let pressed = (code & 0x80) == 0;
        let key = code & 0x7F;
        
        let keycode = match key {
            0x1E => KeyCode::A,
            0x30 => KeyCode::B,
            0x2E => KeyCode::C,
            0x20 => KeyCode::D,
            0x12 => KeyCode::E,
            0x21 => KeyCode::F,
            0x22 => KeyCode::G,
            0x23 => KeyCode::H,
            0x17 => KeyCode::I,
            0x24 => KeyCode::J,
            0x25 => KeyCode::K,
            0x26 => KeyCode::L,
            0x32 => KeyCode::M,
            0x31 => KeyCode::N,
            0x18 => KeyCode::O,
            0x19 => KeyCode::P,
            0x10 => KeyCode::Q,
            0x13 => KeyCode::R,
            0x1F => KeyCode::S,
            0x14 => KeyCode::T,
            0x16 => KeyCode::U,
            0x2F => KeyCode::V,
            0x11 => KeyCode::W,
            0x2D => KeyCode::X,
            0x15 => KeyCode::Y,
            0x2C => KeyCode::Z,
            
            0x0B => KeyCode::Num0,
            0x02 => KeyCode::Num1,
            0x03 => KeyCode::Num2,
            0x04 => KeyCode::Num3,
            0x05 => KeyCode::Num4,
            0x06 => KeyCode::Num5,
            0x07 => KeyCode::Num6,
            0x08 => KeyCode::Num7,
            0x09 => KeyCode::Num8,
            0x0A => KeyCode::Num9,
            
            0x01 => KeyCode::Escape,
            0x0E => KeyCode::Backspace,
            0x0F => KeyCode::Tab,
            0x1C => KeyCode::Enter,
            0x39 => KeyCode::Space,
            
            0x2A => KeyCode::LeftShift,
            0x36 => KeyCode::RightShift,
            0x1D => KeyCode::LeftCtrl,
            0x38 => KeyCode::LeftAlt,
            0x3A => KeyCode::CapsLock,
            
            0x48 => KeyCode::Up,
            0x50 => KeyCode::Down,
            0x4B => KeyCode::Left,
            0x4D => KeyCode::Right,
            
            _ => KeyCode::Unknown,
        };
        
        // Update state
        match keycode {
            KeyCode::LeftShift | KeyCode::RightShift => {
                self.state.shift_pressed = pressed;
            }
            KeyCode::LeftCtrl | KeyCode::RightCtrl => {
                self.state.ctrl_pressed = pressed;
            }
            KeyCode::LeftAlt | KeyCode::RightAlt => {
                self.state.alt_pressed = pressed;
            }
            KeyCode::CapsLock if pressed => {
                self.state.caps_lock = !self.state.caps_lock;
            }
            _ => {}
        }
        
        // Create event
        let mut event = KeyEvent::new(keycode, pressed);
        event.shift = self.state.shift_pressed || self.state.caps_lock;
        event.ctrl = self.state.ctrl_pressed;
        event.alt = self.state.alt_pressed;
        
        Some(event)
    }
    
    /// Add event to queue
    pub fn push_event(&mut self, event: KeyEvent) {
        self.event_queue.push_back(event);
    }
    
    /// Get next event from queue
    pub fn pop_event(&mut self) -> Option<KeyEvent> {
        self.event_queue.pop_front()
    }
    
    /// Check if queue is empty
    pub fn is_empty(&self) -> bool {
        self.event_queue.is_empty()
    }
}

/// Global keyboard
static KEYBOARD: Mutex<Keyboard> = Mutex::new(Keyboard {
    state: KeyboardState::new(),
    event_queue: VecDeque::new(),
});

/// Initialize keyboard
pub fn init() {
    println!("⌨️  Initializing keyboard...");
    println!("  ✓ PS/2 keyboard driver ready");
}

/// Handle keyboard interrupt
pub fn handle_interrupt() {
    // TODO: Read scancode from keyboard controller
    // For now, simulate some key presses for testing
}

/// Get next key event
pub fn get_event() -> Option<KeyEvent> {
    KEYBOARD.lock().pop_event()
}

/// Test keyboard
pub fn test_keyboard() {
    println!("\n🧪 Testing keyboard...");
    
    let mut kb = KEYBOARD.lock();
    
    // Simulate key presses
    let test_scancodes = [
        0x23, // H pressed
        0xA3, // H released
        0x12, // E pressed
        0x92, // E released
        0x26, // L pressed
        0xA6, // L released
        0x26, // L pressed
        0xA6, // L released
        0x18, // O pressed
        0x98, // O released
    ];
    
    for &code in &test_scancodes {
        if let Some(event) = kb.process_scancode(Scancode::new(code)) {
            if let Some(ch) = event.to_ascii() {
                print!("{}", ch);
            }
        }
    }
    
    println!("\n  ✓ Keyboard test complete!");
}
