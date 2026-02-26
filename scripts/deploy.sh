#!/bin/bash
# SurakshaOS Deployment Script
# Deploy kernel to device or emulator

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Configuration
DEVICE=${1:-qemu}
ARCH=${2:-riscv64}

echo -e "${BLUE}"
echo "╔═══════════════════════════════════════════════════════════╗"
echo "║                                                           ║"
echo "║   🚀  SurakshaOS Deployment Script  🚀                    ║"
echo "║                                                           ║"
echo "╚═══════════════════════════════════════════════════════════╝"
echo -e "${NC}"

echo -e "${YELLOW}Target Device: $DEVICE${NC}"
echo -e "${YELLOW}Architecture: $ARCH${NC}\n"

# Build kernel
echo -e "${BLUE}Building kernel...${NC}"
make ARCH=$ARCH kernel

if [ $? -ne 0 ]; then
    echo -e "${RED}✗ Build failed!${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Build successful${NC}\n"

# Deploy based on target
case $DEVICE in
    qemu)
        echo -e "${BLUE}Deploying to QEMU emulator...${NC}"
        make ARCH=$ARCH qemu
        ;;
    
    shakti)
        echo -e "${BLUE}Deploying to SHAKTI FPGA...${NC}"
        
        # Check if FPGA is connected
        if ! command -v openocd &> /dev/null; then
            echo -e "${RED}✗ OpenOCD not found!${NC}"
            echo -e "${YELLOW}Install: sudo apt-get install openocd${NC}"
            exit 1
        fi
        
        # Flash to FPGA
        echo -e "${YELLOW}Flashing kernel to SHAKTI FPGA...${NC}"
        openocd -f shakti.cfg -c "program build/suraksha-kernel verify reset exit"
        
        echo -e "${GREEN}✓ Deployed to SHAKTI FPGA${NC}"
        ;;
    
    device)
        echo -e "${BLUE}Deploying to physical device...${NC}"
        
        # Check if device is connected
        if ! command -v fastboot &> /dev/null; then
            echo -e "${RED}✗ fastboot not found!${NC}"
            echo -e "${YELLOW}Install: sudo apt-get install fastboot${NC}"
            exit 1
        fi
        
        # Check device connection
        if ! fastboot devices | grep -q "fastboot"; then
            echo -e "${RED}✗ No device found in fastboot mode!${NC}"
            echo -e "${YELLOW}Put device in fastboot mode and try again${NC}"
            exit 1
        fi
        
        # Flash kernel
        echo -e "${YELLOW}Flashing kernel to device...${NC}"
        fastboot flash boot build/suraksha-kernel
        fastboot reboot
        
        echo -e "${GREEN}✓ Deployed to device${NC}"
        ;;
    
    *)
        echo -e "${RED}✗ Unknown device: $DEVICE${NC}"
        echo -e "${YELLOW}Supported devices: qemu, shakti, device${NC}"
        exit 1
        ;;
esac

echo -e "\n${GREEN}"
echo "╔═══════════════════════════════════════════════════════════╗"
echo "║                                                           ║"
echo "║   ✅  Deployment Complete!                                ║"
echo "║                                                           ║"
echo "╚═══════════════════════════════════════════════════════════╝"
echo -e "${NC}"
