#!/bin/bash
# SurakshaOS Test Script
# Run comprehensive tests

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}"
echo "╔═══════════════════════════════════════════════════════════╗"
echo "║                                                           ║"
echo "║   🧪  SurakshaOS Test Suite  🧪                           ║"
echo "║                                                           ║"
echo "╚═══════════════════════════════════════════════════════════╝"
echo -e "${NC}\n"

FAILED=0
PASSED=0

# Function to run test
run_test() {
    local name=$1
    local command=$2
    
    echo -e "${BLUE}Running: $name${NC}"
    
    if eval $command; then
        echo -e "${GREEN}✓ $name passed${NC}\n"
        ((PASSED++))
    else
        echo -e "${RED}✗ $name failed${NC}\n"
        ((FAILED++))
    fi
}

# 1. Format check
run_test "Code formatting" "cd kernel && cargo fmt -- --check"

# 2. Linter
run_test "Clippy linter" "cd kernel && cargo clippy -- -D warnings"

# 3. Unit tests
run_test "Unit tests" "cd kernel && cargo test --lib"

# 4. Integration tests
run_test "Integration tests" "cd kernel && cargo test --test integration_test"

# 5. Benchmarks (dry run)
run_test "Benchmark compilation" "cd kernel && cargo bench --no-run"

# 6. Build check
run_test "Build check (RISC-V)" "make ARCH=riscv64 kernel"
run_test "Build check (ARM)" "make ARCH=aarch64 kernel"

# 7. Documentation
run_test "Documentation build" "cd kernel && cargo doc --no-deps"

# 8. Formal verification (if available)
if command -v cargo-kani &> /dev/null; then
    run_test "Formal verification" "cd kernel && cargo kani --tests"
else
    echo -e "${YELLOW}⚠ Kani not installed, skipping formal verification${NC}\n"
fi

# Summary
echo -e "${BLUE}"
echo "╔═══════════════════════════════════════════════════════════╗"
echo "║                    Test Summary                           ║"
echo "╚═══════════════════════════════════════════════════════════╝"
echo -e "${NC}"

echo -e "${GREEN}Passed: $PASSED${NC}"
echo -e "${RED}Failed: $FAILED${NC}"

if [ $FAILED -eq 0 ]; then
    echo -e "\n${GREEN}"
    echo "╔═══════════════════════════════════════════════════════════╗"
    echo "║                                                           ║"
    echo "║   ✅  All Tests Passed!                                   ║"
    echo "║                                                           ║"
    echo "╚═══════════════════════════════════════════════════════════╝"
    echo -e "${NC}"
    exit 0
else
    echo -e "\n${RED}"
    echo "╔═══════════════════════════════════════════════════════════╗"
    echo "║                                                           ║"
    echo "║   ✗  Some Tests Failed                                    ║"
    echo "║                                                           ║"
    echo "╚═══════════════════════════════════════════════════════════╝"
    echo -e "${NC}"
    exit 1
fi
