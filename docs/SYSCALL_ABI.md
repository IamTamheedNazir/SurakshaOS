# SurakshaOS — Syscall ABI

**Status:** PLANNED — not yet implemented  
**Target:** RISC-V 64-bit  
**Current milestone:** M2 (Real Kernel)

---

## Overview

This document describes the planned syscall interface for SurakshaOS. Syscalls will use the RISC-V `ecall` instruction to transition from U-mode (user) to S-mode (supervisor).

---

## Syscall Convention

### Register Usage

| Register | Purpose |
|----------|---------|
| `a7` | Syscall number |
| `a0` | Argument 1 / Return value 1 |
| `a1` | Argument 2 / Return value 2 |
| `a2` | Argument 3 |
| `a3` | Argument 4 |
| `a4` | Argument 5 |
| `a5` | Argument 6 |
| `a0` | Return value (on success) |
| `a1` | Error code (on failure, non-zero) |

### Return Values

- `a0` = result (or negative errno on failure)
- `a1` = 0 on success, error code on failure

### Error Handling

All syscalls return an error code in `a1`:
- `0` = success
- Non-zero = error (see Error Codes below)

---

## Syscall Numbers

### Process Management (0-19)

| Number | Name | Arguments | Description |
|--------|------|-----------|-------------|
| 0 | `exit` | `a0: status` | Terminate current process |
| 1 | `wait` | `a0: pid, a1: status_ptr` | Wait for child process |
| 2 | `fork` | — | Create child process |
| 3 | `exec` | `a0: path_ptr, a1: argv_ptr, a2: envp_ptr` | Execute program |
| 4 | `getpid` | — | Get current process ID |
| 5 | `getppid` | — | Get parent process ID |
| 6 | `setuid` | `a0: uid` | Set user ID |
| 7 | `getuid` | — | Get user ID |

### Memory Management (20-39)

| Number | Name | Arguments | Description |
|--------|------|-----------|-------------|
| 20 | `brk` | `a0: addr` | Set program break |
| 21 | `mmap` | `a0: addr, a1: len, a2: prot, a3: flags, a4: fd, a5: offset` | Map memory |
| 22 | `munmap` | `a0: addr, a1: len` | Unmap memory |
| 23 | `mprotect` | `a0: addr, a1: len, a2: prot` | Change memory protection |

### File Descriptors (40-59)

| Number | Name | Arguments | Description |
|--------|------|-----------|-------------|
| 40 | `open` | `a0: path_ptr, a1: flags, a2: mode` | Open file |
| 41 | `close` | `a0: fd` | Close file descriptor |
| 42 | `read` | `a0: fd, a1: buf_ptr, a2: count` | Read from FD |
| 43 | `write` | `a0: fd, a1: buf_ptr, a2: count` | Write to FD |
| 44 | `seek` | `a0: fd, a1: offset, a2: whence` | Seek in file |
| 45 | `dup` | `a0: fd` | Duplicate FD |
| 46 | `dup2` | `a0: old_fd, a1: new_fd` | Duplicate FD to specific number |
| 47 | `pipe` | `a0: pipefd_ptr` | Create pipe |

### IPC (60-79)

| Number | Name | Arguments | Description |
|--------|------|-----------|-------------|
| 60 | `ipc_create` | `a0: name_ptr, a1: size` | Create IPC channel |
| 61 | `ipc_open` | `a0: name_ptr` | Open IPC channel |
| 62 | `ipc_send` | `a0: channel_id, a1: buf_ptr, a2: len` | Send message |
| 63 | `ipc_recv` | `a0: channel_id, a1: buf_ptr, a2: len` | Receive message |
| 64 | `ipc_close` | `a0: channel_id` | Close IPC channel |

### Time (80-89)

| Number | Name | Arguments | Description |
|--------|------|-----------|-------------|
| 80 | `sleep` | `a0: ms` | Sleep for milliseconds |
| 81 | `get_time` | `a0: time_ptr` | Get monotonic time |
| 82 | `yield` | — | Yield CPU to scheduler |

### Device / Misc (100-119)

| Number | Name | Arguments | Description |
|--------|------|-----------|-------------|
| 100 | `ioctl` | `a0: fd, a1: request, a2: arg` | Device control |
| 101 | `reboot` | `a0: cmd` | Reboot/halt system |

---

## Error Codes

| Code | Name | Description |
|------|------|-------------|
| 0 | `SUCCESS` | No error |
| 1 | `EPERM` | Operation not permitted |
| 2 | `ENOENT` | No such file or directory |
| 3 | `EIO` | I/O error |
| 4 | `ENOMEM` | Out of memory |
| 5 | `EACCES` | Permission denied |
| 6 | `EBADF` | Bad file descriptor |
| 7 | `EINVAL` | Invalid argument |
| 8 | `EMFILE` | Too many open files |
| 9 | `EPIPE` | Broken pipe |
| 10 | `ESRCH` | No such process |
| 11 | `ECHILD` | No child processes |
| 12 | `EAGAIN` | Try again |
| 13 | `EEXIST` | File exists |
| 14 | `ENOSPC` | No space left on device |
| 15 | `EPIPE` | Broken pipe |

---

## Pointer Rules

- All pointers from user space are validated before kernel access
- User pointers must point to user-space memory (no kernel addresses)
- User pointers must be properly aligned
- Buffer lengths are bounds-checked against user address space limits

---

## Compatibility Policy

- Syscall numbers are stable within major versions
- New syscalls are appended at the end of each family
- Deprecated syscalls are marked but not removed until next major version
- Binary compatibility is maintained for the current major version

---

## Implementation Notes

- Trap handler reads `a7` to determine syscall number
- Arguments validated before any kernel data structure access
- Return values written to `a0`/`a1` before `mret`
- No kernel structures are exposed to user space
