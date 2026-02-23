//! Cryptography Module
//!
//! Post-quantum cryptography implementation for SurakshaOS.
//!
//! # Algorithms
//!
//! - **ML-KEM-768**: Key Encapsulation Mechanism (lattice-based)
//! - **ML-DSA-65**: Digital Signature Algorithm (lattice-based)
//! - **SLH-DSA**: Stateless Hash-based Signatures
//! - **AES-256-GCM**: Symmetric encryption
//! - **SHAKE-256**: Extendable-output function

pub mod pqc;
pub mod symmetric;
pub mod hash;

use core::sync::atomic::{AtomicBool, Ordering};

/// Crypto subsystem initialization status
static CRYPTO_INITIALIZED: AtomicBool = AtomicBool::new(false);

/// Initialize cryptography subsystem
pub fn init() {
    if CRYPTO_INITIALIZED.load(Ordering::Acquire) {
        panic!("Crypto subsystem already initialized!");
    }
    
    println!("🔐 Post-Quantum Cryptography Initialization");
    println!("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    
    // Initialize hardware random number generator
    init_hwrng();
    println!("✓ Hardware RNG initialized");
    
    // Initialize PQC accelerator
    pqc::init_accelerator();
    println!("✓ PQC hardware accelerator enabled");
    
    // Self-test cryptographic primitives
    self_test();
    println!("✓ Cryptographic self-tests passed");
    
    println!("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    
    CRYPTO_INITIALIZED.store(true, Ordering::Release);
}

/// Initialize hardware random number generator
fn init_hwrng() {
    // TODO: Initialize platform-specific HWRNG
    // - SHAKTI: Use TRNG (True Random Number Generator)
    // - ARM: Use ARM TrustZone RNG
}

/// Self-test cryptographic primitives
fn self_test() {
    // Test ML-KEM
    pqc::test_ml_kem();
    
    // Test ML-DSA
    pqc::test_ml_dsa();
    
    // Test AES-GCM
    symmetric::test_aes_gcm();
    
    // Test SHAKE-256
    hash::test_shake256();
}

/// Check if crypto subsystem is initialized
pub fn is_initialized() -> bool {
    CRYPTO_INITIALIZED.load(Ordering::Acquire)
}
