#!/bin/bash

# UmrahConnect 2.0 - cPanel Composer Installation Script
# Run this in cPanel Terminal or via SSH

echo "=========================================="
echo "  UmrahConnect 2.0 - Composer Setup"
echo "=========================================="
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Detect backend directory
if [ -d "backend" ]; then
    BACKEND_DIR="backend"
elif [ -d "backend-laravel" ]; then
    BACKEND_DIR="backend-laravel"
else
    echo -e "${RED}✗ Backend directory not found!${NC}"
    echo "Please run this script from the root directory (public_html/)"
    exit 1
fi

echo -e "${GREEN}✓ Found backend directory: $BACKEND_DIR${NC}"
echo ""

# Check if composer is available
if command -v composer &> /dev/null; then
    echo -e "${GREEN}✓ Composer is installed${NC}"
    COMPOSER_CMD="composer"
elif command -v /usr/local/bin/composer &> /dev/null; then
    echo -e "${GREEN}✓ Composer found at /usr/local/bin/composer${NC}"
    COMPOSER_CMD="/usr/local/bin/composer"
elif command -v /opt/cpanel/composer/bin/composer &> /dev/null; then
    echo -e "${GREEN}✓ Composer found at /opt/cpanel/composer/bin/composer${NC}"
    COMPOSER_CMD="/opt/cpanel/composer/bin/composer"
else
    echo -e "${RED}✗ Composer not found!${NC}"
    echo ""
    echo "Options:"
    echo "1. Ask your hosting provider to install Composer"
    echo "2. Use SSH to install Composer manually"
    echo "3. Upload vendor folder manually"
    echo ""
    echo "To install Composer manually:"
    echo "curl -sS https://getcomposer.org/installer | php"
    echo "mv composer.phar /usr/local/bin/composer"
    echo ""
    exit 1
fi

echo ""
echo "=========================================="
echo "  Installing Dependencies"
echo "=========================================="
echo ""

# Navigate to backend directory
cd "$BACKEND_DIR" || exit 1

echo -e "${BLUE}Current directory: $(pwd)${NC}"
echo ""

# Check if composer.json exists
if [ ! -f "composer.json" ]; then
    echo -e "${RED}✗ composer.json not found!${NC}"
    exit 1
fi

echo -e "${GREEN}✓ composer.json found${NC}"
echo ""

# Check if vendor directory already exists
if [ -d "vendor" ]; then
    echo -e "${YELLOW}⚠ vendor directory already exists${NC}"
    echo "Do you want to reinstall? (y/n)"
    read -r response
    if [[ "$response" != "y" ]]; then
        echo "Skipping installation."
        exit 0
    fi
    echo "Removing old vendor directory..."
    rm -rf vendor
fi

echo ""
echo "Installing Composer dependencies..."
echo "This may take 2-5 minutes..."
echo ""

# Run composer install
$COMPOSER_CMD install --no-dev --optimize-autoloader --no-interaction

# Check if installation was successful
if [ $? -eq 0 ]; then
    echo ""
    echo -e "${GREEN}=========================================="
    echo "  ✓ Installation Successful!"
    echo "==========================================${NC}"
    echo ""
    echo "Next steps:"
    echo "1. Set permissions:"
    echo "   chmod -R 775 storage bootstrap/cache"
    echo ""
    echo "2. Visit installer:"
    echo "   https://yourdomain.com/install/"
    echo ""
else
    echo ""
    echo -e "${RED}=========================================="
    echo "  ✗ Installation Failed!"
    echo "==========================================${NC}"
    echo ""
    echo "Possible solutions:"
    echo "1. Check PHP version (requires 8.1+)"
    echo "2. Check available disk space"
    echo "3. Try running: composer install --no-dev"
    echo "4. Upload vendor folder manually"
    echo ""
    exit 1
fi

# Set permissions
echo "Setting permissions..."
chmod -R 775 storage 2>/dev/null || echo "Could not set storage permissions (may need manual fix)"
chmod -R 775 bootstrap/cache 2>/dev/null || echo "Could not set cache permissions (may need manual fix)"

echo ""
echo -e "${GREEN}✓ Setup complete!${NC}"
echo ""
echo "Visit: https://yourdomain.com/install/"
echo ""
