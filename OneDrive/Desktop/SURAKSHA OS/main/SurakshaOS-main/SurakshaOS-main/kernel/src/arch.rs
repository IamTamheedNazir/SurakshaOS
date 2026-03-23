use core::arch::asm;

pub fn trap_init() {
    unsafe {
        asm!("la t0, _trap_vector", "csrw stvec, t0", options(nomem));
        asm!("li t0, 0x22", "csrs sie, t0", options(nomem));
        asm!("csrsi sstatus, 2", options(nomem));
    }
    set_timer_1ms();
}

pub fn set_timer_1ms() {
    let current = clint_mtime();
    sbi_set_timer(current + 10_000);
}

fn clint_mtime() -> u64 {
    unsafe { core::ptr::read_volatile(0x0200BFF8 as *const u64) }
}

fn sbi_set_timer(stime_value: u64) {
    unsafe {
        asm!(
            "li a7, 0x54494D45",
            "li a6, 0",
            "mv a0, {0}",
            "ecall",
            in(reg) stime_value,
            out("a0") _,
            options(nomem)
        );
    }
}

#[no_mangle]
pub extern "C" fn handle_timer_interrupt() {
    crate::process::tick_uptime();
    set_timer_1ms();
}
