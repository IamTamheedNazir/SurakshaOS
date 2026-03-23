/// SurakshaOS Init System
/// The first process spawned by the kernel after boot.
/// Responsible for: setting up the environment, launching services,
/// and handing off to the interactive shell.

use crate::process::{ProcessId, spawn_process};
use crate::console::{print, println, set_color, Color};
use crate::fs::{create_dir, create_file, write_file};
use crate::shell::Shell;

pub struct InitSystem {
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
        self.print_boot_banner();
        self.setup_filesystem();
        self.start_services();
        self.print_ready();
        // Hand off to the interactive shell — never returns
        let mut shell = Shell::new();
        shell.run()
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
            b"Welcome to SurakshaOS — Digital Sovereignty for All\n",
        )
        .ok();
        println!("OK");
    }

    fn start_services(&mut self) {
        println!("  [init] Starting core services...");

        let service_defs: &[(&'static str, bool)] = &[
            ("memory-guard",  true),
            ("capability-mgr", true),
            ("entropy-pool",   true),
            ("device-manager", false),
            ("logger",         false),
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
        // In a real OS this would exec a binary from /bin/
        // For now we simulate with in-kernel service stubs
        match name {
            "memory-guard"   => Ok(ProcessId(2)),
            "capability-mgr" => Ok(ProcessId(3)),
            "entropy-pool"   => Ok(ProcessId(4)),
            "device-manager" => Ok(ProcessId(5)),
            "logger"         => Ok(ProcessId(6)),
            _                => Err("unknown service"),
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
        println!("  KERNEL PANIC: critical service '{}' failed to start", service);
        println!("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
        loop { unsafe { core::arch::asm!("wfi"); } }
    }
}
