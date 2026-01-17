#!/bin/bash

# UmrahConnect 2.0 - Automated Setup Script
# This script prepares the project for deployment

echo "🚀 UmrahConnect 2.0 - Automated Setup"
echo "======================================"
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Step 1: Rename folders
echo "📁 Step 1: Renaming folders..."
if [ -d "backend-laravel" ]; then
    mv backend-laravel backend
    echo -e "${GREEN}✓ Renamed backend-laravel → backend${NC}"
else
    echo -e "${YELLOW}⚠ backend-laravel not found (already renamed?)${NC}"
fi

if [ -d "installer" ]; then
    mv installer install
    echo -e "${GREEN}✓ Renamed installer → install${NC}"
else
    echo -e "${YELLOW}⚠ installer not found (already renamed?)${NC}"
fi

echo ""

# Step 2: Check if backend exists
echo "🔍 Step 2: Checking backend directory..."
if [ -d "backend" ]; then
    echo -e "${GREEN}✓ Backend directory found${NC}"
    
    # Check for vendor directory
    if [ -d "backend/vendor" ]; then
        echo -e "${GREEN}✓ Composer dependencies already installed${NC}"
    else
        echo -e "${YELLOW}⚠ Composer dependencies not found${NC}"
        echo "  Run: cd backend && composer install --no-dev --optimize-autoloader"
    fi
    
    # Check for .env.example
    if [ -f "backend/.env.example" ]; then
        echo -e "${GREEN}✓ .env.example found${NC}"
    else
        echo -e "${RED}✗ .env.example not found${NC}"
    fi
else
    echo -e "${RED}✗ Backend directory not found${NC}"
    exit 1
fi

echo ""

# Step 3: Set permissions
echo "🔒 Step 3: Setting permissions..."
if [ -d "backend/storage" ]; then
    chmod -R 775 backend/storage
    echo -e "${GREEN}✓ Set permissions for storage directory${NC}"
else
    echo -e "${RED}✗ Storage directory not found${NC}"
fi

if [ -d "backend/bootstrap/cache" ]; then
    chmod -R 775 backend/bootstrap/cache
    echo -e "${GREEN}✓ Set permissions for bootstrap/cache directory${NC}"
else
    echo -e "${RED}✗ Bootstrap cache directory not found${NC}"
fi

echo ""

# Step 4: Check install directory
echo "🔍 Step 4: Checking install directory..."
if [ -d "install" ]; then
    echo -e "${GREEN}✓ Install directory found${NC}"
    
    if [ -f "install/index.php" ]; then
        echo -e "${GREEN}✓ Installer found${NC}"
    else
        echo -e "${RED}✗ Installer index.php not found${NC}"
    fi
else
    echo -e "${RED}✗ Install directory not found${NC}"
fi

echo ""

# Step 5: Summary
echo "📊 Setup Summary"
echo "================"
echo ""
echo "Directory Structure:"
ls -la | grep "^d" | awk '{print "  " $9}'
echo ""

# Check if composer is installed
if command -v composer &> /dev/null; then
    echo -e "${GREEN}✓ Composer is installed${NC}"
    echo "  Run: cd backend && composer install --no-dev --optimize-autoloader"
else
    echo -e "${YELLOW}⚠ Composer not found${NC}"
    echo "  Install Composer or upload vendor folder manually"
fi

echo ""
echo "🎯 Next Steps:"
echo "=============="
echo ""
echo "1. Install Composer dependencies:"
echo "   cd backend"
echo "   composer install --no-dev --optimize-autoloader"
echo ""
echo "2. Upload to cPanel:"
echo "   - Upload all files to public_html/"
echo "   - Or upload as ZIP and extract in cPanel"
echo ""
echo "3. Visit installer:"
echo "   https://yourdomain.com/install/"
echo ""
echo "4. After installation, delete install folder:"
echo "   rm -rf install/"
echo ""
echo -e "${GREEN}✅ Setup complete!${NC}"
