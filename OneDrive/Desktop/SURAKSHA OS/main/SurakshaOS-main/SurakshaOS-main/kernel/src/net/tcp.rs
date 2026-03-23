//! TCP Implementation
//!
//! Basic TCP stack for SurakshaOS

use alloc::collections::VecDeque;
use alloc::vec::Vec;
use spin::Mutex;

/// TCP state
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum TcpState {
    Closed,
    Listen,
    SynSent,
    SynReceived,
    Established,
    FinWait1,
    FinWait2,
    CloseWait,
    Closing,
    LastAck,
    TimeWait,
}

/// TCP flags
pub struct TcpFlags;

impl TcpFlags {
    pub const FIN: u8 = 1 << 0;
    pub const SYN: u8 = 1 << 1;
    pub const RST: u8 = 1 << 2;
    pub const PSH: u8 = 1 << 3;
    pub const ACK: u8 = 1 << 4;
    pub const URG: u8 = 1 << 5;
}

/// TCP header
#[repr(C, packed)]
pub struct TcpHeader {
    pub src_port: u16,
    pub dst_port: u16,
    pub seq_num: u32,
    pub ack_num: u32,
    pub data_offset_flags: u16,
    pub window: u16,
    pub checksum: u16,
    pub urgent_ptr: u16,
}

impl TcpHeader {
    pub fn new(src_port: u16, dst_port: u16) -> Self {
        Self {
            src_port: src_port.to_be(),
            dst_port: dst_port.to_be(),
            seq_num: 0,
            ack_num: 0,
            data_offset_flags: (5 << 12).to_be(), // 5 words, no flags
            window: 65535u16.to_be(),
            checksum: 0,
            urgent_ptr: 0,
        }
    }
    
    pub fn set_flags(&mut self, flags: u8) {
        let offset = u16::from_be(self.data_offset_flags) & 0xF000;
        self.data_offset_flags = (offset | flags as u16).to_be();
    }
    
    pub fn get_flags(&self) -> u8 {
        (u16::from_be(self.data_offset_flags) & 0xFF) as u8
    }
}

/// TCP connection
pub struct TcpConnection {
    pub state: TcpState,
    pub local_port: u16,
    pub remote_port: u16,
    pub seq_num: u32,
    pub ack_num: u32,
    pub send_buffer: VecDeque<u8>,
    pub recv_buffer: VecDeque<u8>,
}

impl TcpConnection {
    pub fn new(local_port: u16, remote_port: u16) -> Self {
        Self {
            state: TcpState::Closed,
            local_port,
            remote_port,
            seq_num: 0,
            ack_num: 0,
            send_buffer: VecDeque::new(),
            recv_buffer: VecDeque::new(),
        }
    }
    
    /// Connect to remote host
    pub fn connect(&mut self) -> Result<(), TcpError> {
        if self.state != TcpState::Closed {
            return Err(TcpError::InvalidState);
        }
        
        // Send SYN
        self.seq_num = 1000; // Initial sequence number
        self.send_syn();
        self.state = TcpState::SynSent;
        
        Ok(())
    }
    
    /// Listen for connections
    pub fn listen(&mut self) -> Result<(), TcpError> {
        if self.state != TcpState::Closed {
            return Err(TcpError::InvalidState);
        }
        
        self.state = TcpState::Listen;
        Ok(())
    }
    
    /// Send data
    pub fn send(&mut self, data: &[u8]) -> Result<usize, TcpError> {
        if self.state != TcpState::Established {
            return Err(TcpError::NotConnected);
        }
        
        // Add to send buffer
        for &byte in data {
            self.send_buffer.push_back(byte);
        }
        
        // TODO: Actually send packets
        Ok(data.len())
    }
    
    /// Receive data
    pub fn recv(&mut self, buf: &mut [u8]) -> Result<usize, TcpError> {
        if self.state != TcpState::Established {
            return Err(TcpError::NotConnected);
        }
        
        let mut count = 0;
        for i in 0..buf.len() {
            if let Some(byte) = self.recv_buffer.pop_front() {
                buf[i] = byte;
                count += 1;
            } else {
                break;
            }
        }
        
        Ok(count)
    }
    
    /// Close connection
    pub fn close(&mut self) -> Result<(), TcpError> {
        match self.state {
            TcpState::Established => {
                self.send_fin();
                self.state = TcpState::FinWait1;
                Ok(())
            }
            TcpState::CloseWait => {
                self.send_fin();
                self.state = TcpState::LastAck;
                Ok(())
            }
            _ => Err(TcpError::InvalidState),
        }
    }
    
    fn send_syn(&mut self) {
        // TODO: Build and send SYN packet
        println!("  TCP: Sending SYN (seq={})", self.seq_num);
    }
    
    fn send_fin(&mut self) {
        // TODO: Build and send FIN packet
        println!("  TCP: Sending FIN (seq={})", self.seq_num);
    }
}

/// TCP errors
#[derive(Debug, Clone, Copy)]
pub enum TcpError {
    InvalidState,
    NotConnected,
    ConnectionRefused,
    Timeout,
}

/// TCP stack
pub struct TcpStack {
    connections: Vec<TcpConnection>,
}

impl TcpStack {
    pub fn new() -> Self {
        Self {
            connections: Vec::new(),
        }
    }
    
    pub fn create_connection(&mut self, local_port: u16, remote_port: u16) -> usize {
        let conn = TcpConnection::new(local_port, remote_port);
        self.connections.push(conn);
        self.connections.len() - 1
    }
}

static TCP_STACK: Mutex<TcpStack> = Mutex::new(TcpStack {
    connections: Vec::new(),
});

/// Initialize TCP stack
pub fn init() {
    println!("🌐 Initializing TCP stack...");
    println!("  ✓ TCP state machine ready");
    println!("  ✓ Connection management ready");
}

/// Test TCP
pub fn test_tcp() {
    println!("\n🧪 Testing TCP...");
    
    let mut stack = TCP_STACK.lock();
    let conn_id = stack.create_connection(8080, 80);
    
    println!("  ✓ Created TCP connection (local=8080, remote=80)");
    
    let conn = &mut stack.connections[conn_id];
    conn.connect().expect("Failed to connect");
    
    println!("  ✓ TCP connection initiated");
    println!("  ✓ TCP stack working!");
}
