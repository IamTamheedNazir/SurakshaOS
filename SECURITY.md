# Security Policy

## Supported Versions

| Version | Supported |
|---------|-----------|
| 0.2.x (prototype) | ⚠️ Security features not yet implemented |
| < 0.2 | ❌ Not supported |

> **Important:** SurakshaOS is in early prototype stage. No security features (capabilities, sandboxing, encryption, secure boot) are implemented yet. Do NOT use SurakshaOS for any security-sensitive purpose at this stage.

## Reporting a Vulnerability

If you discover a security vulnerability in SurakshaOS, please report it responsibly.

### How to Report

1. **Do NOT open a public GitHub issue** for security vulnerabilities
2. **Email** the maintainer directly at: [maintainer email — add here]
3. **Include** in your report:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if any)

### What to Expect

- **Acknowledgment** within 48 hours
- **Assessment** within 1 week
- **Fix timeline** based on severity
- **Credit** in the release notes (unless you prefer anonymity)

### Scope

Currently in-scope for security reports:
- Kernel code (Rust and assembly)
- Boot path
- Memory management
- Any future security features as they are implemented

Out of scope:
- Theoretical vulnerabilities in features that don't exist yet
- Issues in documentation only
- Build system issues (unless they can compromise the build output)

## Security Design Principles

SurakshaOS is designed with these security principles:

1. **Memory safety** — Rust eliminates most memory corruption bugs
2. **Minimal unsafe** — `unsafe` blocks are documented and auditable
3. **Least privilege** — capability-based access control (planned)
4. **Defense in depth** — multiple security layers
5. **No security through comments** — security must be enforced by code

## Future Security Features

See `docs/ROADMAP.md → M4 (Secure OS)` for planned security features:
- Capability-based access control
- Process isolation via virtual memory
- Cryptographic primitives (post-quantum)
- Secure boot chain
- Signed packages
- Sandboxing
- Audit logging
