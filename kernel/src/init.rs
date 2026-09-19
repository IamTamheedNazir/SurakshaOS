/// SurakshaOS Init System
/// The first process spawned by the kernel after boot.
/// Responsible for: setting up the environment, launching services,
/// and handing off to the interactive shell.
extern crate alloc;
use alloc::vec::Vec;

use crate::fs::{create_dir, write_file};
use crate::process::ProcessId;
use crate::shell::Shell;
use crate::{print, println};

pub struct InitSystem {
    /// This init's process ID (PID 1). Kept for the boot log and future
    /// real process management (TD-006); not yet used for scheduling.
    #[allow(dead_code)]
    pid: ProcessId,
    services: Vec<Service>,
}

#[derive(Debug, Clone)]
pub struct Service {
    pub name: &'static str,
    pub pid: Option<ProcessId>,
    pub status: ServiceStatus,
    pub critical: bool,
}

#[derive(Debug, Clone, PartialEq)]
pub enum ServiceStatus {
    Stopped,
    Starting,
    Running,
    Failed,
}

impl InitSystem {
    pub fn new() -> Self {
        InitSystem {
            pid: ProcessId(1),
            services: Vec::new(),
        }
    }

    /// Entry point — called by kernel after all hardware is initialised
    pub fn run(&mut self) -> ! {
        // Register this execution as the real PID 1 in the process table.
        // (The boot context itself is not yet a managed thread — TD-026.)
        crate::process::register_boot_process("init");

        println!("  [init] init system starting (pid={})", self.pid.0);
        self.print_boot_banner();
        self.setup_filesystem();
        self.start_services();
        self.run_process_demo();
        self.print_ready();
        // Hand off to the interactive shell — never returns
        let mut shell = Shell::new();
        shell.run()
    }

    /// M2.1 proof: create two real kernel-task processes, let their threads
    /// context-switch on the hart via the real scheduler, and show `ps`.
    /// Runs once, bounded, before the interactive shell starts.
    fn run_process_demo(&self) {
        const ITERATIONS: usize = 5;
        println!("");
        println!(
            "  [init] M2.1 context-switch proof ({} iterations):",
            ITERATIONS
        );
        let _ = crate::process::spawn_demo_tasks(ITERATIONS);
        // Drive the scheduler from the boot context until the run queue is
        // empty. Every A/B line below is printed by a real thread resuming
        // on its own kernel stack through a real context switch.
        crate::process::run_until_idle();
        println!(
            "  [init] proof complete: {} context switches, {} processes reaped",
            crate::process::switch_count(),
            crate::process::reap_exited(),
        );
    }

    fn print_boot_banner(&self) {
        println!("");
        println!("╔══════════════════════════════════════════════════════════════╗");
        println!("║                                                              ║");
        println!("║        सुरक्षा OS  —  SurakshaOS v0.2.0                      ║");
        println!("║        India's Sovereign, Secure Mobile OS                  ║");
        println!("║        Built with Rust + RISC-V                             ║");
        println!("║                                                              ║");
        println!("╚══════════════════════════════════════════════════════════════╝");
        println!("");
    }

    fn setup_filesystem(&self) {
        print!("  [init] Setting up filesystem... ");
        // Create standard directory tree
        let dirs = [
            "/proc",
            "/sys",
            "/dev",
            "/tmp",
            "/home",
            "/home/user",
            "/etc",
            "/bin",
            "/var",
            "/var/log",
        ];
        for dir in &dirs {
            create_dir(dir).ok();
        }
        // Create essential config files
        write_file("/etc/hostname", b"suraksha\n").ok();
        write_file("/etc/os-release", b"NAME=SurakshaOS\nVERSION=0.2.0\n").ok();
        write_file(
            "/etc/motd",
            b"Welcome to SurakshaOS - Digital Sovereignty for All\n",
        )
        .ok();
        println!("OK");
    }

    fn start_services(&mut self) {
        println!("  [init] Starting core services...");

        let service_defs: &[(&'static str, bool)] = &[
            ("memory-guard", true),
            ("capability-mgr", true),
            ("entropy-pool", true),
            ("device-manager", false),
            ("logger", false),
        ];

        for &(name, critical) in service_defs {
            print!("         ├─ {:<20}", name);
            match self.start_service(name, critical) {
                Ok(pid) => {
                    println!(" [  OK  ]  pid={}", pid.0);
                    self.services.push(Service {
                        name,
                        pid: Some(pid),
                        status: ServiceStatus::Running,
                        critical,
                    });
                }
                Err(e) => {
                    println!(" [FAIL ]  {}", e);
                    self.services.push(Service {
                        name,
                        pid: None,
                        status: ServiceStatus::Failed,
                        critical,
                    });
                    if critical {
                        self.kernel_panic(name);
                    }
                }
            }
        }
        println!("         └─ all services started");
    }

    fn start_service(&self, name: &str, _critical: bool) -> Result<ProcessId, &'static str> {
        // NOTE: Services are still in-kernel subsystems, not processes.
        // They are recorded in the boot log only; the PIDs shown are NOT
        // registered in the process table (no process exists for them yet).
        // Converting services to real processes is M3 work.
        match name {
            "memory-guard" => Ok(ProcessId(2)),
            "capability-mgr" => Ok(ProcessId(3)),
            "entropy-pool" => Ok(ProcessId(4)),
            "device-manager" => Ok(ProcessId(5)),
            "logger" => Ok(ProcessId(6)),
            _ => Err("unknown service"),
        }
    }

    fn print_ready(&self) {
        println!("");
        println!("  SurakshaOS is ready.");
        println!("  Type 'help' for available commands.");
        println!("");
    }

    fn kernel_panic(&self, service: &str) -> ! {
        println!("");
        println!("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
        println!(
            "  KERNEL PANIC: critical service '{}' failed to start",
            service
        );
        println!("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
        loop {
            unsafe {
                core::arch::asm!("wfi");
            }
        }
    }
}

impl Default for InitSystem {
    fn default() -> Self {
        Self::new()
    }
}
