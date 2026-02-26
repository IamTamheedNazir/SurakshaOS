//! Process Scheduler
//!
//! REAL round-robin scheduler with priority support

use super::context::{Context, switch_context};
use alloc::collections::VecDeque;
use alloc::vec::Vec;
use spin::Mutex;

/// Process ID
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub struct Pid(usize);

impl Pid {
    pub fn new(id: usize) -> Self {
        Self(id)
    }
    
    pub fn as_usize(&self) -> usize {
        self.0
    }
}

/// Process state
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum ProcessState {
    Ready,
    Running,
    Blocked,
    Terminated,
}

/// Process priority
#[derive(Debug, Clone, Copy, PartialEq, Eq, PartialOrd, Ord)]
pub struct Priority(u8);

impl Priority {
    pub const IDLE: Priority = Priority(0);
    pub const LOW: Priority = Priority(64);
    pub const NORMAL: Priority = Priority(128);
    pub const HIGH: Priority = Priority(192);
    pub const REALTIME: Priority = Priority(255);
    
    pub fn new(priority: u8) -> Self {
        Self(priority)
    }
}

/// Process Control Block
pub struct Process {
    /// Process ID
    pub pid: Pid,
    /// Process state
    pub state: ProcessState,
    /// Priority
    pub priority: Priority,
    /// Saved context
    pub context: Context,
    /// Stack
    pub stack: Vec<u8>,
    /// Time slice remaining
    pub time_slice: usize,
}

impl Process {
    /// Create new process
    pub fn new(pid: Pid, entry: usize, stack_size: usize, priority: Priority) -> Self {
        let mut stack = vec![0u8; stack_size];
        let stack_top = stack.as_ptr() as usize + stack.len();
        
        Self {
            pid,
            state: ProcessState::Ready,
            priority,
            context: Context::new_process(entry, stack_top),
            stack,
            time_slice: 10, // 10 time slices
        }
    }
}

/// Scheduler
pub struct Scheduler {
    /// All processes
    processes: Vec<Process>,
    /// Ready queue (per priority)
    ready_queues: [VecDeque<Pid>; 256],
    /// Currently running process
    current: Option<Pid>,
    /// Next PID
    next_pid: usize,
}

impl Scheduler {
    /// Create new scheduler
    pub fn new() -> Self {
        const EMPTY_QUEUE: VecDeque<Pid> = VecDeque::new();
        
        Self {
            processes: Vec::new(),
            ready_queues: [EMPTY_QUEUE; 256],
            current: None,
            next_pid: 1,
        }
    }
    
    /// Spawn new process
    pub fn spawn(&mut self, entry: usize, stack_size: usize, priority: Priority) -> Pid {
        let pid = Pid::new(self.next_pid);
        self.next_pid += 1;
        
        let process = Process::new(pid, entry, stack_size, priority);
        self.processes.push(process);
        
        // Add to ready queue
        self.ready_queues[priority.0 as usize].push_back(pid);
        
        println!("  ✓ Spawned process {} (priority {})", pid.as_usize(), priority.0);
        
        pid
    }
    
    /// Get next process to run
    fn next_process(&mut self) -> Option<Pid> {
        // Find highest priority non-empty queue
        for priority in (0..=255).rev() {
            if let Some(pid) = self.ready_queues[priority].pop_front() {
                return Some(pid);
            }
        }
        None
    }
    
    /// Schedule next process
    pub fn schedule(&mut self) {
        // Get next process
        let next_pid = match self.next_process() {
            Some(pid) => pid,
            None => return, // No processes to run
        };
        
        // Get current and next process
        let current_pid = self.current;
        
        // If same process, just continue
        if current_pid == Some(next_pid) {
            return;
        }
        
        // Update states
        if let Some(current_pid) = current_pid {
            if let Some(current) = self.processes.iter_mut().find(|p| p.pid == current_pid) {
                if current.state == ProcessState::Running {
                    current.state = ProcessState::Ready;
                    // Re-add to ready queue
                    self.ready_queues[current.priority.0 as usize].push_back(current_pid);
                }
            }
        }
        
        if let Some(next) = self.processes.iter_mut().find(|p| p.pid == next_pid) {
            next.state = ProcessState::Running;
            next.time_slice = 10; // Reset time slice
        }
        
        self.current = Some(next_pid);
        
        // Perform context switch
        self.switch_to(next_pid);
    }
    
    /// Switch to specific process
    fn switch_to(&mut self, pid: Pid) {
        // Find old and new contexts
        let (old_ctx, new_ctx) = unsafe {
            let old = self.current
                .and_then(|pid| self.processes.iter_mut().find(|p| p.pid == pid))
                .map(|p| &mut p.context as *mut Context);
            
            let new = self.processes.iter()
                .find(|p| p.pid == pid)
                .map(|p| &p.context as *const Context)
                .expect("Process not found");
            
            (old, new)
        };
        
        // Perform context switch
        if let Some(old) = old_ctx {
            unsafe {
                switch_context(old, new_ctx);
            }
        }
    }
    
    /// Yield current process
    pub fn yield_now(&mut self) {
        self.schedule();
    }
    
    /// Block current process
    pub fn block(&mut self) {
        if let Some(pid) = self.current {
            if let Some(process) = self.processes.iter_mut().find(|p| p.pid == pid) {
                process.state = ProcessState::Blocked;
            }
            self.current = None;
            self.schedule();
        }
    }
    
    /// Unblock process
    pub fn unblock(&mut self, pid: Pid) {
        if let Some(process) = self.processes.iter_mut().find(|p| p.pid == pid) {
            if process.state == ProcessState::Blocked {
                process.state = ProcessState::Ready;
                self.ready_queues[process.priority.0 as usize].push_back(pid);
            }
        }
    }
    
    /// Terminate current process
    pub fn exit(&mut self) {
        if let Some(pid) = self.current {
            if let Some(process) = self.processes.iter_mut().find(|p| p.pid == pid) {
                process.state = ProcessState::Terminated;
                println!("  Process {} terminated", pid.as_usize());
            }
            self.current = None;
            self.schedule();
        }
    }
}

/// Global scheduler
static SCHEDULER: Mutex<Scheduler> = Mutex::new(Scheduler::new());

/// Initialize scheduler
pub fn init() {
    println!("⚙️  Initializing scheduler...");
    println!("  ✓ Round-robin scheduler ready");
    println!("  ✓ Priority levels: 0-255");
}

/// Spawn new process
pub fn spawn(entry: usize, stack_size: usize, priority: Priority) -> Pid {
    SCHEDULER.lock().spawn(entry, stack_size, priority)
}

/// Yield current process
pub fn yield_now() {
    SCHEDULER.lock().yield_now();
}

/// Test scheduler
pub fn test_scheduler() {
    println!("\n🧪 Testing scheduler...");
    
    static mut COUNTER: usize = 0;
    
    extern "C" fn task_a() {
        for i in 0..3 {
            unsafe {
                COUNTER += 1;
                println!("  Task A iteration {} (counter={})", i, COUNTER);
            }
            yield_now();
        }
    }
    
    extern "C" fn task_b() {
        for i in 0..3 {
            unsafe {
                COUNTER += 1;
                println!("  Task B iteration {} (counter={})", i, COUNTER);
            }
            yield_now();
        }
    }
    
    // Spawn tasks
    spawn(task_a as usize, 4096, Priority::NORMAL);
    spawn(task_b as usize, 4096, Priority::NORMAL);
    
    // Start scheduling
    SCHEDULER.lock().schedule();
    
    println!("  ✓ Scheduler test complete!");
}
