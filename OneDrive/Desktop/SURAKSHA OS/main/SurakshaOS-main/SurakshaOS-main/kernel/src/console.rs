/// SurakshaOS Console Driver
/// Wraps the NS16550A UART for formatted, line-buffered I/O.
/// Provides print!/println! macros and blocking read_line().

use core::fmt::{self, Write};
use spin::Mutex;

// NS16550A register offsets (MMIO, 8-bit registers)
const UART_BASE: usize = 0x1000_0000;
const UART_RBR:  usize = UART_BASE + 0x00; // Receive Buffer Register  (read)
const UART_THR:  usize = UART_BASE + 0x00; // Transmit Holding Register (write)
const UART_LSR:  usize = UART_BASE + 0x05; // Line Status Register
const UART_LSR_DATA_READY: u8 = 0x01;
const UART_LSR_TX_EMPTY:   u8 = 0x20;

pub static CONSOLE: Mutex<Console> = Mutex::new(Console);

pub struct Console;

impl Console {
    #[inline]
    fn write_byte(&self, byte: u8) {
        // Spin until the TX FIFO has room
        loop {
            let lsr = unsafe { core::ptr::read_volatile(UART_LSR as *const u8) };
            if lsr & UART_LSR_TX_EMPTY != 0 { break; }
            core::hint::spin_loop();
        }
        unsafe { core::ptr::write_volatile(UART_THR as *mut u8, byte); }
    }

    #[inline]
    fn read_byte_blocking(&self) -> u8 {
        loop {
            let lsr = unsafe { core::ptr::read_volatile(UART_LSR as *const u8) };
            if lsr & UART_LSR_DATA_READY != 0 { break; }
            core::hint::spin_loop();
        }
        unsafe { core::ptr::read_volatile(UART_RBR as *const u8) }
    }

    pub fn write_str_raw(&self, s: &str) {
        for byte in s.bytes() {
            if byte == b'\n' { self.write_byte(b'\r'); }
            self.write_byte(byte);
        }
    }
}

impl Write for Console {
    fn write_str(&mut self, s: &str) -> fmt::Result {
        self.write_str_raw(s);
        Ok(())
    }
}

// ─── public API ──────────────────────────────────────────────────────────────

pub fn print_str(s: &str) {
    CONSOLE.lock().write_str_raw(s);
}

/// Read a line of input (blocking), with basic editing:
///   Backspace / DEL  — erase last character
///   Ctrl-C           — clear line
///   Enter            — submit
pub fn read_line() -> alloc::string::String {
    use alloc::string::String;
    let mut buf = String::new();
    let console = CONSOLE.lock();
    loop {
        let b = console.read_byte_blocking();
        match b {
            b'\r' | b'\n' => {
                // Echo newline and return
                drop(console);
                print_str("\n");
                return buf;
            }
            0x7F | 0x08 => {
                // Backspace / DEL
                if !buf.is_empty() {
                    buf.pop();
                    // Erase the character on screen: BS + space + BS
                    console.write_str_raw("\x08 \x08");
                }
            }
            0x03 => {
                // Ctrl-C: clear line
                buf.clear();
                console.write_str_raw("^C\n");
                return buf;
            }
            0x04 => {
                // Ctrl-D: EOF / exit
                drop(console);
                print_str("\n");
                return "exit".into();
            }
            b if b >= 0x20 && b < 0x7F => {
                // Printable ASCII: echo and append
                buf.push(b as char);
                console.write_byte(b);
            }
            _ => { /* ignore other control bytes */ }
        }
    }
}

pub fn read_char() -> char {
    let c = CONSOLE.lock().read_byte_blocking();
    c as char
}

// ─── fmt macros ──────────────────────────────────────────────────────────────

#[macro_export]
macro_rules! print {
    ($($arg:tt)*) => {{
        use core::fmt::Write;
        let _ = write!($crate::console::CONSOLE.lock(), $($arg)*);
    }};
}

#[macro_export]
macro_rules! println {
    ()            => { $crate::print!("\n") };
    ($($arg:tt)*) => { $crate::print!("{}\n", format_args!($($arg)*)) };
}

// ─── colour helper (ANSI) ─────────────────────────────────────────────────────

#[allow(dead_code)]
pub enum Color {
    Reset, Black, Red, Green, Yellow, Blue, Magenta, Cyan, White, BrightGreen,
}

pub fn set_color(c: Color) {
    let code = match c {
        Color::Reset        => "\x1b[0m",
        Color::Black        => "\x1b[30m",
        Color::Red          => "\x1b[31m",
        Color::Green        => "\x1b[32m",
        Color::Yellow       => "\x1b[33m",
        Color::Blue         => "\x1b[34m",
        Color::Magenta      => "\x1b[35m",
        Color::Cyan         => "\x1b[36m",
        Color::White        => "\x1b[37m",
        Color::BrightGreen  => "\x1b[92m",
    };
    print_str(code);
}
