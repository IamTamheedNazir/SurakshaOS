> Press `Ctrl-A X` to exit QEMU.

---

## 🗺️ Roadmap

| Version | Status | What's included |
|---------|--------|----------------|
| v0.1.0 | ✅ Done | RISC-V boot, memory, scheduler, VFS, syscalls |
| v0.2.0 | ✅ Done (March 2026) | sursh shell, PID 1 init, UART console driver |
| v0.3.0 | 🔄 Next | virtio-net driver, virtio-blk, real capability tokens |
| v0.4.0 | 📋 Planned | ML-KEM-768 PQC, encrypted filesystem |
| v0.5.0 | 📋 Planned | Kani model checking, Isabelle/HOL proofs |
| v1.0.0 | 📋 2027-2028 | SHAKTI FPGA port, physical device prototype |

---

## 🔒 Security Architecture

SurakshaOS is built on 5 security layers:

1. **Hardware** — SHAKTI PMP, HHAB secure boot, PUF authentication
2. **Kernel** — Formally verified microkernel, capability-based access
3. **Crypto** — Post-quantum (ML-KEM, ML-DSA, SLH-DSA) — roadmap
4. **Application** — Sandboxed execution, per-app encryption keys
5. **Network** — TLS 1.3 + PQC cipher suites — roadmap

---

## 🤝 Contributing

We welcome contributors! Areas to help:

- **Kernel** — virtio drivers, memory management, IPC
- **Security** — capability tokens, formal verification, cryptography
- **Hardware** — SHAKTI FPGA integration
- **Apps** — userspace applications in Rust
- **Docs** — documentation in 22 Indian languages

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

---

## 📜 License

| Component | License |
|-----------|---------|
| Microkernel | GPLv3 |
| System Services | Apache 2.0 |
| Security Modules | GPLv3 |
| Documentation | CC BY-SA 4.0 |

---

## 🙏 Acknowledgments

- **seL4 Team** — Formal verification inspiration
- **Rust Community** — Memory-safe systems programming
- **SHAKTI Team (IIT Madras)** — Indigenous RISC-V processors
- **NIST** — Post-quantum cryptography standards

---

**SurakshaOS — Digital Independence for Every Indian** 🇮🇳

*Built with ❤️ by Tamheed Nazir and the open source community*

*"The best way to predict the future is to invent it." — Alan Kay*
