/// SurakshaOS Shell (sursh)
/// A real interactive shell for SurakshaOS.
/// Handles: command parsing, built-in commands, environment variables,
/// command history, tab-completion stubs, and piping groundwork.
extern crate alloc;
use alloc::format;
use alloc::string::{String, ToString};
use alloc::vec::Vec;

use crate::console::read_line;
use crate::fs::{create_dir, list_dir, read_file, remove_file, stat, write_file};
use crate::memory::{heap_total, heap_used, pma_stats};
use crate::process::uptime_ms;
use crate::{print, println};

const SHELL_VERSION: &str = "0.2.0";
const MAX_HISTORY: usize = 64;
/// Maximum tokens per command line (defensive cap; see TD-021).
const MAX_ARGS: usize = 16;
/// Fallback prompt (the live prompt is coloured; see print_prompt).
#[allow(dead_code)]
const PROMPT: &str = "suraksha:~$ ";

pub struct Shell {
    cwd: String,
    history: Vec<String>,
    env: Vec<(String, String)>,
    running: bool,
    last_exit: i32,
}

// ─── built-in command table ───────────────────────────────────────────────────

struct BuiltIn {
    name: &'static str,
    usage: &'static str,
    help: &'static str,
}

const BUILTINS: &[BuiltIn] = &[
    BuiltIn {
        name: "help",
        usage: "help [cmd]",
        help: "Show help for commands",
    },
    BuiltIn {
        name: "ls",
        usage: "ls [path]",
        help: "List directory contents",
    },
    BuiltIn {
        name: "cd",
        usage: "cd <path>",
        help: "Change directory",
    },
    BuiltIn {
        name: "pwd",
        usage: "pwd",
        help: "Print working directory",
    },
    BuiltIn {
        name: "cat",
        usage: "cat <file>",
        help: "Print file contents",
    },
    BuiltIn {
        name: "echo",
        usage: "echo <text>",
        help: "Print text to console",
    },
    BuiltIn {
        name: "mkdir",
        usage: "mkdir <dir>",
        help: "Create directory",
    },
    BuiltIn {
        name: "rm",
        usage: "rm <file>",
        help: "Remove file",
    },
    BuiltIn {
        name: "touch",
        usage: "touch <file>",
        help: "Create empty file",
    },
    BuiltIn {
        name: "write",
        usage: "write <file> <text>",
        help: "Write text to file",
    },
    BuiltIn {
        name: "ps",
        usage: "ps",
        help: "List running processes",
    },
    BuiltIn {
        name: "mem",
        usage: "mem",
        help: "Show memory usage",
    },
    BuiltIn {
        name: "uptime",
        usage: "uptime",
        help: "Show system uptime",
    },
    BuiltIn {
        name: "uname",
        usage: "uname",
        help: "Show OS information",
    },
    BuiltIn {
        name: "env",
        usage: "env",
        help: "Show environment variables",
    },
    BuiltIn {
        name: "export",
        usage: "export KEY=VALUE",
        help: "Set environment variable",
    },
    BuiltIn {
        name: "history",
        usage: "history",
        help: "Show command history",
    },
    BuiltIn {
        name: "clear",
        usage: "clear",
        help: "Clear the terminal",
    },
    BuiltIn {
        name: "reboot",
        usage: "reboot",
        help: "Reboot the system",
    },
    BuiltIn {
        name: "halt",
        usage: "halt",
        help: "Halt the system",
    },
    BuiltIn {
        name: "captest",
        usage: "captest",
        help: "Test capability system",
    },
    BuiltIn {
        name: "pqtest",
        usage: "pqtest",
        help: "Test post-quantum crypto stubs",
    },
    BuiltIn {
        name: "about",
        usage: "about",
        help: "About SurakshaOS",
    },
];

// ─── Shell implementation ─────────────────────────────────────────────────────

impl Shell {
    pub fn new() -> Self {
        #[allow(clippy::vec_init_then_push)] // one row per variable reads clearly
        let env = {
            let mut env = Vec::new();
            env.push(("PATH".into(), "/bin:/usr/bin".into()));
            env.push(("HOME".into(), "/home/user".into()));
            env.push(("SHELL".into(), "/bin/sursh".into()));
            env.push(("TERM".into(), "vt100".into()));
            env.push(("USER".into(), "suraksha".into()));
            env.push(("HOSTNAME".into(), "suraksha".into()));
            env
        };

        Shell {
            cwd: "/home/user".into(),
            history: Vec::new(),
            env,
            running: true,
            last_exit: 0,
        }
    }

    /// Main loop — never returns under normal operation
    pub fn run(&mut self) -> ! {
        self.print_motd();
        loop {
            self.print_prompt();
            let line = self.read_line_with_history();
            if line.is_empty() {
                continue;
            }
            self.add_history(line.clone());
            let exit_code = self.execute(&line);
            self.last_exit = exit_code;
            if !self.running {
                self.do_halt();
            }
        }
    }

    fn print_motd(&self) {
        if let Ok(bytes) = read_file("/etc/motd") {
            if let Ok(s) = core::str::from_utf8(&bytes) {
                println!("{}", s.trim());
            }
        }
    }

    fn print_prompt(&self) {
        // Coloured prompt: user@host:cwd$
        print!(
            "\x1b[32msuraksha\x1b[0m@\x1b[34msuraksha-os\x1b[0m:\x1b[36m{}\x1b[0m$ ",
            self.cwd
        );
    }

    fn read_line_with_history(&self) -> String {
        // In a full impl this would handle arrow keys for history recall
        // and Tab for completion.  For now, plain line read.
        read_line()
    }

    fn add_history(&mut self, line: String) {
        if self.history.last().map(|l| l == &line).unwrap_or(false) {
            return; // deduplicate consecutive identical commands
        }
        if self.history.len() >= MAX_HISTORY {
            self.history.remove(0);
        }
        self.history.push(line);
    }

    // ─── command dispatch ────────────────────────────────────────────────────

    pub fn execute(&mut self, input: &str) -> i32 {
        let input = input.trim();
        if input.is_empty() || input.starts_with('#') {
            return 0;
        }

        // Variable expansion: $VAR
        let expanded = self.expand_vars(input);
        let input = expanded.as_str();

        // Split into tokens (naive, no quoting yet) — cap at MAX_ARGS tokens.
        // Words beyond the cap are dropped; a future parser (TD-021) will
        // report this properly.
        let tokens: Vec<&str> = input.split_whitespace().take(MAX_ARGS).collect();
        if tokens.is_empty() {
            return 0;
        }

        let cmd = tokens[0];
        let args = &tokens[1..];

        match cmd {
            "help" => self.cmd_help(args),
            "ls" => self.cmd_ls(args),
            "cd" => self.cmd_cd(args),
            "pwd" => self.cmd_pwd(),
            "cat" => self.cmd_cat(args),
            "echo" => self.cmd_echo(args),
            "mkdir" => self.cmd_mkdir(args),
            "rm" => self.cmd_rm(args),
            "touch" => self.cmd_touch(args),
            "write" => self.cmd_write(args),
            "ps" => self.cmd_ps(),
            "mem" => self.cmd_mem(),
            "uptime" => self.cmd_uptime(),
            "uname" => self.cmd_uname(),
            "env" => self.cmd_env(),
            "export" => self.cmd_export(args),
            "history" => self.cmd_history(),
            "clear" => self.cmd_clear(),
            "reboot" => self.cmd_reboot(),
            "halt" => {
                self.running = false;
                0
            }
            "captest" => self.cmd_captest(),
            "pqtest" => self.cmd_pqtest(),
            "about" => self.cmd_about(),
            "exit" => {
                self.running = false;
                0
            }
            _ => {
                println!("sursh: command not found: {}", cmd);
                println!("       Try 'help' to list available commands.");
                127
            }
        }
    }

    // ─── built-in commands ───────────────────────────────────────────────────

    fn cmd_help(&self, args: &[&str]) -> i32 {
        if let Some(&topic) = args.first() {
            if let Some(b) = BUILTINS.iter().find(|b| b.name == topic) {
                println!("  {}  —  {}", b.usage, b.help);
                return 0;
            }
            println!("help: no help entry for '{}'", topic);
            return 1;
        }
        println!("SurakshaOS Shell (sursh) v{}", SHELL_VERSION);
        println!("Built-in commands:");
        println!("");
        for b in BUILTINS {
            println!("  {:<22}  {}", b.usage, b.help);
        }
        println!("");
        println!("Variables: $VAR  |  Set with: export KEY=VALUE");
        0
    }

    fn cmd_ls(&self, args: &[&str]) -> i32 {
        let path = args.first().copied().unwrap_or(self.cwd.as_str());
        let path = self.resolve_path(path);
        match list_dir(&path) {
            Ok(entries) => {
                if entries.is_empty() {
                    println!("(empty directory)");
                } else {
                    let mut sorted = entries;
                    sorted.sort_by(|a, b| a.name.cmp(&b.name));
                    for e in &sorted {
                        if e.is_dir {
                            println!("  \x1b[34m{}/\x1b[0m", e.name);
                        } else {
                            println!("  {}  ({} bytes)", e.name, e.size);
                        }
                    }
                }
                0
            }
            Err(e) => {
                println!("ls: {}: {}", path, e);
                1
            }
        }
    }

    fn cmd_cd(&mut self, args: &[&str]) -> i32 {
        let target = match args.first() {
            Some(&p) => self.resolve_path(p),
            None => self.get_env("HOME").unwrap_or("/home/user".into()),
        };
        match stat(&target) {
            Ok(info) if info.is_dir => {
                self.cwd = target;
                0
            }
            Ok(_) => {
                println!("cd: not a directory: {}", target);
                1
            }
            Err(e) => {
                println!("cd: {}: {}", target, e);
                1
            }
        }
    }

    fn cmd_pwd(&self) -> i32 {
        println!("{}", self.cwd);
        0
    }

    fn cmd_cat(&self, args: &[&str]) -> i32 {
        if args.is_empty() {
            println!("cat: missing file argument");
            return 1;
        }
        let mut rc = 0;
        for &name in args {
            let path = self.resolve_path(name);
            match read_file(&path) {
                Ok(bytes) => match core::str::from_utf8(&bytes) {
                    Ok(s) => print!("{}", s),
                    Err(_) => println!("cat: {}: binary file ({} bytes)", name, bytes.len()),
                },
                Err(e) => {
                    println!("cat: {}: {}", name, e);
                    rc = 1;
                }
            }
        }
        rc
    }

    fn cmd_echo(&self, args: &[&str]) -> i32 {
        println!("{}", args.join(" "));
        0
    }

    fn cmd_mkdir(&self, args: &[&str]) -> i32 {
        if args.is_empty() {
            println!("mkdir: missing argument");
            return 1;
        }
        let path = self.resolve_path(args[0]);
        match create_dir(&path) {
            Ok(_) => 0,
            Err(e) => {
                println!("mkdir: {}: {}", args[0], e);
                1
            }
        }
    }

    fn cmd_rm(&self, args: &[&str]) -> i32 {
        if args.is_empty() {
            println!("rm: missing argument");
            return 1;
        }
        let path = self.resolve_path(args[0]);
        match remove_file(&path) {
            Ok(_) => 0,
            Err(e) => {
                println!("rm: {}: {}", args[0], e);
                1
            }
        }
    }

    fn cmd_touch(&self, args: &[&str]) -> i32 {
        if args.is_empty() {
            println!("touch: missing argument");
            return 1;
        }
        let path = self.resolve_path(args[0]);
        match write_file(&path, b"") {
            Ok(_) => 0,
            Err(e) => {
                println!("touch: {}: {}", args[0], e);
                1
            }
        }
    }

    fn cmd_write(&self, args: &[&str]) -> i32 {
        if args.len() < 2 {
            println!("write: usage: write <file> <text>");
            return 1;
        }
        let path = self.resolve_path(args[0]);
        let content = args[1..].join(" ");
        match write_file(&path, content.as_bytes()) {
            Ok(_) => 0,
            Err(e) => {
                println!("write: {}: {}", args[0], e);
                1
            }
        }
    }

    fn cmd_ps(&self) -> i32 {
        println!("  PID   NAME               STATUS         MODE");
        println!("  ────  ─────────────────  ────────       ─────");
        println!("  1     init               running        S-mode");
        println!("");
        println!("  [NOTE] No real process management exists yet.");
        println!("  All processes currently run on the kernel stack in S-mode.");
        println!("  See docs/ROADMAP.md → M2 for process implementation plan.");
        0
    }

    fn cmd_mem(&self) -> i32 {
        // Physical Memory Allocator stats
        let pma = pma_stats();
        println!(
            "  Physical Memory (PMA):  {} frames / {} frames used  ({} MiB / {} MiB)",
            pma.used_frames,
            pma.total_frames,
            pma.used_bytes / (1024 * 1024),
            pma.total_bytes / (1024 * 1024)
        );
        println!(
            "  Managed region: {:#x} - {:#x}",
            pma.region_base, pma.region_end
        );
        let pma_pct = (pma.used_frames * 100) / pma.total_frames.max(1);
        print!("  [");
        for i in 0..20 {
            if i < pma_pct / 5 {
                print!("█");
            } else {
                print!("░");
            }
        }
        println!("]");

        // Kernel heap stats
        let used = heap_used();
        let total = heap_total();
        let pct = (used * 100) / total.max(1);
        println!(
            "  Kernel heap: {} KB / {} KB  ({}%)",
            used / 1024,
            total / 1024,
            pct
        );
        let filled = pct / 5;
        print!("  [");
        for i in 0..20 {
            if i < filled {
                print!("█");
            } else {
                print!("░");
            }
        }
        println!("]");

        // Virtual memory stats
        let active_pt = crate::vmm::active_page_table_phys();
        println!("  Virtual Memory:  Sv39 (identity-mapped kernel, S-mode)");
        println!("  Active page table: {}", active_pt);
        crate::vmm::print_stats();
        0
    }

    fn cmd_uptime(&self) -> i32 {
        let ms = uptime_ms();
        let secs = ms / 1000;
        let mins = secs / 60;
        let hrs = mins / 60;
        println!(
            "  up {} hours, {} minutes, {} seconds",
            hrs,
            mins % 60,
            secs % 60
        );
        0
    }

    fn cmd_uname(&self) -> i32 {
        println!("SurakshaOS 0.2.0 RISC-V riscv64gc suraksha-kernel sv39");
        0
    }

    fn cmd_env(&self) -> i32 {
        for (k, v) in &self.env {
            println!("  {}={}", k, v);
        }
        0
    }

    fn cmd_export(&mut self, args: &[&str]) -> i32 {
        if args.is_empty() {
            return self.cmd_env();
        }
        for &arg in args {
            match arg.find('=') {
                Some(i) => {
                    let key = arg[..i].to_string();
                    let val = arg[i + 1..].to_string();
                    if let Some(entry) = self.env.iter_mut().find(|(k, _)| k == &key) {
                        entry.1 = val;
                    } else {
                        self.env.push((key, val));
                    }
                }
                None => {
                    println!("export: invalid syntax '{}' (use KEY=VALUE)", arg);
                    return 1;
                }
            }
        }
        0
    }

    fn cmd_history(&self) -> i32 {
        for (i, line) in self.history.iter().enumerate() {
            println!("  {:>3}  {}", i + 1, line);
        }
        0
    }

    fn cmd_clear(&self) -> i32 {
        // ANSI: clear screen + cursor to home
        print!("\x1b[2J\x1b[H");
        0
    }

    fn cmd_reboot(&self) -> i32 {
        println!("Rebooting SurakshaOS...");
        // On RISC-V QEMU: write to SiFive test device
        unsafe {
            let test_addr = 0x10_0000 as *mut u32;
            core::ptr::write_volatile(test_addr, 0x5555); // QEMU virt poweroff
        }
        // If poweroff failed, spin — but let the CPU idle instead of burning
        // cycles (clippy::empty_loop).
        loop {
            unsafe { core::arch::asm!("wfi", options(nomem, nostack)) }
        }
    }

    fn cmd_captest(&self) -> i32 {
        println!("Capability system test");
        println!("══════════════════════");
        println!("");
        println!("  NOT IMPLEMENTED — no capability system exists yet.");
        println!("");
        println!("  Planned: capability tokens that enforce least-privilege");
        println!("  resource access. Every resource access will require an");
        println!("  explicit, unforgeable token.");
        println!("");
        println!("  See docs/ROADMAP.md → M4 (Secure OS) for implementation plan.");
        1
    }

    fn cmd_pqtest(&self) -> i32 {
        println!("Post-quantum cryptography test");
        println!("══════════════════════════════");
        println!("");
        println!("  NOT IMPLEMENTED — no cryptographic code exists yet.");
        println!("");
        println!("  Planned algorithms:");
        println!("    - ML-KEM-768 (NIST FIPS 203) for key encapsulation");
        println!("    - ML-DSA-65 (NIST FIPS 204) for digital signatures");
        println!("");
        println!("  See docs/ROADMAP.md → M4 (Secure OS) for implementation plan.");
        1
    }

    fn cmd_about(&self) -> i32 {
        println!("");
        println!("  SurakshaOS — India's Sovereign Mobile Operating System");
        println!("  ─────────────────────────────────────────────────────");
        println!("  Version    : 0.2.0-alpha (prototype)");
        println!("  Kernel     : suraksha-kernel (Rust, no_std)");
        println!("  Target     : RISC-V riscv64gc (QEMU virt)");
        println!("  License    : GPLv3");
        println!("  Repository : github.com/IamTamheedNazir/SurakshaOS");
        println!("  Maintainer : Tamheed Nazir");
        println!("");
        println!("  Status: Early prototype — boots, runs shell, Sv39 active.");
        println!("  Privilege: kernel runs in S-mode (supervisor)");
        println!("  Virtual memory: Sv39, per-process address spaces available");
        println!("  M-mode: timer interrupts + ecall bridge (minimal)");
        println!("  No user-mode processes, no scheduler,");
        println!("  no persistent storage, no networking, no GUI.");
        println!("");
        println!("  \"Digital independence for every Indian.\"");
        println!("");
        0
    }

    // ─── helpers ─────────────────────────────────────────────────────────────

    fn resolve_path(&self, path: &str) -> String {
        if path.starts_with('/') {
            path.to_string()
        } else if path == "~" {
            self.get_env("HOME").unwrap_or("/home/user".into())
        } else if let Some(rest) = path.strip_prefix("~/") {
            let home = self.get_env("HOME").unwrap_or("/home/user".into());
            format!("{}/{}", home, rest)
        } else if path == ".." {
            let parts: Vec<&str> = self.cwd.split('/').filter(|s| !s.is_empty()).collect();
            if parts.is_empty() {
                "/".to_string()
            } else {
                let parent = &parts[..parts.len() - 1];
                if parent.is_empty() {
                    "/".into()
                } else {
                    format!("/{}", parent.join("/"))
                }
            }
        } else {
            format!("{}/{}", self.cwd.trim_end_matches('/'), path)
        }
    }

    fn get_env(&self, key: &str) -> Option<String> {
        self.env
            .iter()
            .find(|(k, _)| k == key)
            .map(|(_, v)| v.clone())
    }

    fn expand_vars(&self, input: &str) -> String {
        let mut out = String::new();
        let mut chars = input.chars().peekable();
        while let Some(c) = chars.next() {
            if c == '$' {
                let mut var = String::new();
                while let Some(&nc) = chars.peek() {
                    if nc.is_alphanumeric() || nc == '_' {
                        var.push(nc);
                        chars.next();
                    } else {
                        break;
                    }
                }
                if var == "?" {
                    out.push_str(&self.last_exit.to_string());
                } else if let Some(val) = self.get_env(&var) {
                    out.push_str(&val);
                }
                // unknown var → empty string (POSIX behaviour)
            } else {
                out.push(c);
            }
        }
        out
    }

    fn do_halt(&self) -> ! {
        println!("SurakshaOS halting. Goodbye.");
        unsafe {
            let test_addr = 0x10_0000 as *mut u32;
            core::ptr::write_volatile(test_addr, 0x5555);
        }
        loop {
            unsafe { core::arch::asm!("wfi", options(nomem, nostack)) }
        }
    }
}

impl Default for Shell {
    fn default() -> Self {
        Self::new()
    }
}
