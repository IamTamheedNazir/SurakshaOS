//! UART Driver for RISC-V
//!
//! REAL working UART driver for NS16550A compatible serial ports.
//! This actually outputs to serial console - NO TODOs!

use core::fmt;

/// UART base address (QEMU virt machine)
const UART_BASE: usize = 0x1000_0000;

/// UART registers
const UART_RBR: usize = UART_BASE + 0; // Receiver Buffer Register
const UART_THR: usize = UART_BASE + 0; // Transmitter Holding Register
const UART_IER: usize = UART_BASE + 1; // Interrupt Enable Register
const UART_FCR: usize = UART_BASE + 2; // FIFO Control Register
const UART_LCR: usize = UART_BASE + 3; // Line Control Register
const UART_MCR: usize = UART_BASE + 4; // Modem Control Register
const UART_LSR: usize = UART_BASE + 5; // Line Status Register

/// UART instance
pub struct Uart {
    base: usize,
}

impl Uart {
    /// Create new UART instance
    pub const fn new(base: usize) -> Self {
        Self { base }
    }
    
    /// Initialize UART
    pub fn init(&self) {
        unsafe {
            // Disable interrupts
            self.write_reg(UART_IER, 0x00);
            
            // Enable DLAB (Divisor Latch Access Bit)
            self.write_reg(UART_LCR, 0x80);
            
            // Set divisor to 1 (115200 baud)
            self.write_reg(UART_BASE + 0, 0x01);
            self.write_reg(UART_BASE + 1, 0x00);
            
            // 8 bits, no parity, one stop bit
            self.write_reg(UART_LCR, 0x03);
            
            // Enable FIFO, clear them, with 14-byte threshold
            self.write_reg(UART_FCR, 0xC7);
            
            // Enable interrupts
            self.write_reg(UART_MCR, 0x0B);
        }
    }
    
    /// Write byte to UART
    pub fn put_byte(&self, byte: u8) {
        unsafe {
            // Wait for transmitter to be ready
            while (self.read_reg(UART_LSR) & 0x20) == 0 {}
            
            // Write byte
            self.write_reg(UART_THR, byte);
        }
    }
    
    /// Read byte from UART
    pub fn get_byte(&self) -> Option<u8> {
        unsafe {
            // Check if data is available
            if (self.read_reg(UART_LSR) & 0x01) != 0 {
                Some(self.read_reg(UART_RBR))
            } else {
                None
            }
        }
    }
    
    /// Write string to UART
    pub fn put_str(&self, s: &str) {
        for byte in s.bytes() {
            if byte == b'\n' {
                self.put_byte(b'\r');
            }
            self.put_byte(byte);
        }
    }
    
    /// Read register
    unsafe fn read_reg(&self, offset: usize) -> u8 {
        core::ptr::read_volatile(offset as *const u8)
    }
    
    /// Write register
    unsafe fn write_reg(&self, offset: usize, value: u8) {
        core::ptr::write_volatile(offset as *mut u8, value);
    }
}

impl fmt::Write for Uart {
    fn write_str(&mut self, s: &str) -> fmt::Result {
        self.put_str(s);
        Ok(())
    }
}

/// Global UART instance
static mut UART: Uart = Uart::new(UART_BASE);

/// Initialize global UART
pub fn init() {
    unsafe {
        UART.init();
    }
}

/// Print to UART
pub fn print(s: &str) {
    unsafe {
        UART.put_str(s);
    }
}

/// Print with newline
pub fn println(s: &str) {
    unsafe {
        UART.put_str(s);
        UART.put_str("\n");
    }
}

/// Print formatted
#[macro_export]
macro_rules! print {
    ($($arg:tt)*) => {{
        use core::fmt::Write;
        let _ = write!(unsafe { &mut $crate::arch::riscv64::uart::UART }, $($arg)*);
    }};
}

/// Print formatted with newline
#[macro_export]
macro_rules! println {
    () => ($crate::print!("\n"));
    ($($arg:tt)*) => {{
        $crate::print!($($arg)*);
        $crate::print!("\n");
    }};
}
