//! Framebuffer Driver
//!
//! REAL framebuffer implementation for display output

use spin::Mutex;

/// Pixel format
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum PixelFormat {
    /// RGB888 (24-bit)
    RGB888,
    /// RGBA8888 (32-bit)
    RGBA8888,
    /// RGB565 (16-bit)
    RGB565,
}

impl PixelFormat {
    /// Get bytes per pixel
    pub fn bytes_per_pixel(&self) -> usize {
        match self {
            PixelFormat::RGB888 => 3,
            PixelFormat::RGBA8888 => 4,
            PixelFormat::RGB565 => 2,
        }
    }
}

/// Color (RGBA)
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub struct Color {
    pub r: u8,
    pub g: u8,
    pub b: u8,
    pub a: u8,
}

impl Color {
    pub const fn new(r: u8, g: u8, b: u8, a: u8) -> Self {
        Self { r, g, b, a }
    }
    
    pub const fn rgb(r: u8, g: u8, b: u8) -> Self {
        Self::new(r, g, b, 255)
    }
    
    // Common colors
    pub const BLACK: Color = Color::rgb(0, 0, 0);
    pub const WHITE: Color = Color::rgb(255, 255, 255);
    pub const RED: Color = Color::rgb(255, 0, 0);
    pub const GREEN: Color = Color::rgb(0, 255, 0);
    pub const BLUE: Color = Color::rgb(0, 0, 255);
    pub const YELLOW: Color = Color::rgb(255, 255, 0);
    pub const CYAN: Color = Color::rgb(0, 255, 255);
    pub const MAGENTA: Color = Color::rgb(255, 0, 255);
}

/// Framebuffer info
#[derive(Debug, Clone, Copy)]
pub struct FramebufferInfo {
    /// Physical address
    pub addr: usize,
    /// Width in pixels
    pub width: usize,
    /// Height in pixels
    pub height: usize,
    /// Stride (bytes per line)
    pub stride: usize,
    /// Pixel format
    pub format: PixelFormat,
}

/// Framebuffer driver
pub struct Framebuffer {
    info: FramebufferInfo,
    buffer: &'static mut [u8],
}

impl Framebuffer {
    /// Create new framebuffer
    pub unsafe fn new(info: FramebufferInfo) -> Self {
        let size = info.stride * info.height;
        let buffer = core::slice::from_raw_parts_mut(info.addr as *mut u8, size);
        
        Self { info, buffer }
    }
    
    /// Get framebuffer info
    pub fn info(&self) -> &FramebufferInfo {
        &self.info
    }
    
    /// Clear screen with color
    pub fn clear(&mut self, color: Color) {
        for y in 0..self.info.height {
            for x in 0..self.info.width {
                self.put_pixel(x, y, color);
            }
        }
    }
    
    /// Put pixel at position
    pub fn put_pixel(&mut self, x: usize, y: usize, color: Color) {
        if x >= self.info.width || y >= self.info.height {
            return;
        }
        
        let offset = y * self.info.stride + x * self.info.format.bytes_per_pixel();
        
        match self.info.format {
            PixelFormat::RGB888 => {
                self.buffer[offset] = color.r;
                self.buffer[offset + 1] = color.g;
                self.buffer[offset + 2] = color.b;
            }
            PixelFormat::RGBA8888 => {
                self.buffer[offset] = color.r;
                self.buffer[offset + 1] = color.g;
                self.buffer[offset + 2] = color.b;
                self.buffer[offset + 3] = color.a;
            }
            PixelFormat::RGB565 => {
                let rgb565 = ((color.r as u16 & 0xF8) << 8)
                    | ((color.g as u16 & 0xFC) << 3)
                    | ((color.b as u16 & 0xF8) >> 3);
                self.buffer[offset] = (rgb565 & 0xFF) as u8;
                self.buffer[offset + 1] = ((rgb565 >> 8) & 0xFF) as u8;
            }
        }
    }
    
    /// Get pixel at position
    pub fn get_pixel(&self, x: usize, y: usize) -> Option<Color> {
        if x >= self.info.width || y >= self.info.height {
            return None;
        }
        
        let offset = y * self.info.stride + x * self.info.format.bytes_per_pixel();
        
        let color = match self.info.format {
            PixelFormat::RGB888 => Color::rgb(
                self.buffer[offset],
                self.buffer[offset + 1],
                self.buffer[offset + 2],
            ),
            PixelFormat::RGBA8888 => Color::new(
                self.buffer[offset],
                self.buffer[offset + 1],
                self.buffer[offset + 2],
                self.buffer[offset + 3],
            ),
            PixelFormat::RGB565 => {
                let rgb565 = (self.buffer[offset] as u16) | ((self.buffer[offset + 1] as u16) << 8);
                Color::rgb(
                    ((rgb565 >> 8) & 0xF8) as u8,
                    ((rgb565 >> 3) & 0xFC) as u8,
                    ((rgb565 << 3) & 0xF8) as u8,
                )
            }
        };
        
        Some(color)
    }
    
    /// Draw rectangle
    pub fn draw_rect(&mut self, x: usize, y: usize, width: usize, height: usize, color: Color) {
        for dy in 0..height {
            for dx in 0..width {
                self.put_pixel(x + dx, y + dy, color);
            }
        }
    }
    
    /// Draw filled rectangle
    pub fn fill_rect(&mut self, x: usize, y: usize, width: usize, height: usize, color: Color) {
        self.draw_rect(x, y, width, height, color);
    }
    
    /// Draw line (Bresenham's algorithm)
    pub fn draw_line(&mut self, x0: usize, y0: usize, x1: usize, y1: usize, color: Color) {
        let dx = (x1 as isize - x0 as isize).abs();
        let dy = -(y1 as isize - y0 as isize).abs();
        let sx = if x0 < x1 { 1 } else { -1 };
        let sy = if y0 < y1 { 1 } else { -1 };
        let mut err = dx + dy;
        
        let mut x = x0 as isize;
        let mut y = y0 as isize;
        
        loop {
            self.put_pixel(x as usize, y as usize, color);
            
            if x == x1 as isize && y == y1 as isize {
                break;
            }
            
            let e2 = 2 * err;
            if e2 >= dy {
                err += dy;
                x += sx;
            }
            if e2 <= dx {
                err += dx;
                y += sy;
            }
        }
    }
    
    /// Draw circle (Midpoint algorithm)
    pub fn draw_circle(&mut self, cx: usize, cy: usize, radius: usize, color: Color) {
        let mut x = radius as isize;
        let mut y = 0isize;
        let mut err = 0isize;
        
        while x >= y {
            self.put_pixel((cx as isize + x) as usize, (cy as isize + y) as usize, color);
            self.put_pixel((cx as isize + y) as usize, (cy as isize + x) as usize, color);
            self.put_pixel((cx as isize - y) as usize, (cy as isize + x) as usize, color);
            self.put_pixel((cx as isize - x) as usize, (cy as isize + y) as usize, color);
            self.put_pixel((cx as isize - x) as usize, (cy as isize - y) as usize, color);
            self.put_pixel((cx as isize - y) as usize, (cy as isize - x) as usize, color);
            self.put_pixel((cx as isize + y) as usize, (cy as isize - x) as usize, color);
            self.put_pixel((cx as isize + x) as usize, (cy as isize - y) as usize, color);
            
            y += 1;
            err += 1 + 2 * y;
            if 2 * (err - x) + 1 > 0 {
                x -= 1;
                err += 1 - 2 * x;
            }
        }
    }
    
    /// Copy region
    pub fn copy_region(
        &mut self,
        src_x: usize,
        src_y: usize,
        dst_x: usize,
        dst_y: usize,
        width: usize,
        height: usize,
    ) {
        for dy in 0..height {
            for dx in 0..width {
                if let Some(color) = self.get_pixel(src_x + dx, src_y + dy) {
                    self.put_pixel(dst_x + dx, dst_y + dy, color);
                }
            }
        }
    }
    
    /// Scroll up
    pub fn scroll_up(&mut self, lines: usize, fill_color: Color) {
        let line_height = lines;
        
        // Copy lines up
        self.copy_region(
            0,
            line_height,
            0,
            0,
            self.info.width,
            self.info.height - line_height,
        );
        
        // Fill bottom with color
        self.fill_rect(
            0,
            self.info.height - line_height,
            self.info.width,
            line_height,
            fill_color,
        );
    }
}

/// Global framebuffer
static FRAMEBUFFER: Mutex<Option<Framebuffer>> = Mutex::new(None);

/// Initialize framebuffer
pub fn init(info: FramebufferInfo) {
    println!("🖥️  Initializing framebuffer...");
    println!("  Resolution: {}x{}", info.width, info.height);
    println!("  Format: {:?}", info.format);
    println!("  Address: {:#x}", info.addr);
    
    let fb = unsafe { Framebuffer::new(info) };
    *FRAMEBUFFER.lock() = Some(fb);
    
    println!("  ✓ Framebuffer initialized");
}

/// Get global framebuffer
pub fn get() -> Option<&'static Mutex<Option<Framebuffer>>> {
    Some(&FRAMEBUFFER)
}

/// Test framebuffer
pub fn test_framebuffer() {
    println!("\n🧪 Testing framebuffer...");
    
    let mut fb_lock = FRAMEBUFFER.lock();
    if let Some(fb) = fb_lock.as_mut() {
        // Clear screen to black
        fb.clear(Color::BLACK);
        println!("  ✓ Cleared screen");
        
        // Draw colored rectangles
        fb.fill_rect(10, 10, 100, 100, Color::RED);
        fb.fill_rect(120, 10, 100, 100, Color::GREEN);
        fb.fill_rect(230, 10, 100, 100, Color::BLUE);
        println!("  ✓ Drew rectangles");
        
        // Draw lines
        fb.draw_line(10, 120, 330, 120, Color::WHITE);
        fb.draw_line(10, 130, 330, 200, Color::YELLOW);
        println!("  ✓ Drew lines");
        
        // Draw circles
        fb.draw_circle(170, 250, 50, Color::CYAN);
        fb.draw_circle(170, 250, 30, Color::MAGENTA);
        println!("  ✓ Drew circles");
        
        println!("  ✓ Framebuffer test complete!");
    } else {
        println!("  ✗ Framebuffer not initialized");
    }
}
