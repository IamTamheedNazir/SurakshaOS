#!/bin/bash

# UmrahConnect 2.0 - Pre-Built Package Builder
# This script creates a complete deployment package with vendor and built frontend

echo "=========================================="
echo "  UmrahConnect 2.0 Package Builder"
echo "=========================================="
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if we're in the right directory
if [ ! -f "package.json" ] && [ ! -d "backend-laravel" ]; then
    echo -e "${RED}✗ Error: Please run this script from the repository root${NC}"
    exit 1
fi

echo -e "${BLUE}Step 1: Preparing directories...${NC}"

# Create build directory
BUILD_DIR="umrahconnect-complete"
rm -rf "$BUILD_DIR"
mkdir -p "$BUILD_DIR"

echo -e "${GREEN}✓ Build directory created${NC}"
echo ""

# Step 2: Rename and copy backend
echo -e "${BLUE}Step 2: Preparing backend...${NC}"

if [ -d "backend-laravel" ]; then
    cp -r backend-laravel "$BUILD_DIR/backend"
    echo -e "${GREEN}✓ Backend copied${NC}"
elif [ -d "backend" ]; then
    cp -r backend "$BUILD_DIR/backend"
    echo -e "${GREEN}✓ Backend copied${NC}"
else
    echo -e "${RED}✗ Backend directory not found!${NC}"
    exit 1
fi

# Step 3: Install Composer dependencies
echo ""
echo -e "${BLUE}Step 3: Installing Composer dependencies...${NC}"
echo "This may take 2-5 minutes..."
echo ""

cd "$BUILD_DIR/backend"

if command -v composer &> /dev/null; then
    composer install --no-dev --optimize-autoloader --no-interaction
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ Composer dependencies installed${NC}"
    else
        echo -e "${RED}✗ Composer installation failed${NC}"
        exit 1
    fi
else
    echo -e "${RED}✗ Composer not found!${NC}"
    echo "Please install Composer: https://getcomposer.org/download/"
    exit 1
fi

cd ../..

# Step 4: Build frontend
echo ""
echo -e "${BLUE}Step 4: Building frontend...${NC}"
echo "This may take 2-5 minutes..."
echo ""

cd frontend

if [ ! -d "node_modules" ]; then
    echo "Installing npm dependencies..."
    npm install
fi

echo "Building production frontend..."
npm run build

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Frontend built successfully${NC}"
else
    echo -e "${RED}✗ Frontend build failed${NC}"
    exit 1
fi

# Copy built frontend to package
cp -r dist/* "../$BUILD_DIR/"

cd ..

echo -e "${GREEN}✓ Frontend copied to package${NC}"

# Step 5: Copy installer
echo ""
echo -e "${BLUE}Step 5: Copying installer...${NC}"

if [ -d "installer" ]; then
    cp -r installer "$BUILD_DIR/install"
    echo -e "${GREEN}✓ Installer copied${NC}"
elif [ -d "install" ]; then
    cp -r install "$BUILD_DIR/install"
    echo -e "${GREEN}✓ Installer copied${NC}"
else
    echo -e "${YELLOW}⚠ Installer directory not found (optional)${NC}"
fi

# Step 6: Copy database files
echo ""
echo -e "${BLUE}Step 6: Copying database files...${NC}"

if [ -d "database" ]; then
    cp -r database "$BUILD_DIR/"
    echo -e "${GREEN}✓ Database files copied${NC}"
else
    echo -e "${YELLOW}⚠ Database directory not found (optional)${NC}"
fi

# Step 7: Copy documentation
echo ""
echo -e "${BLUE}Step 7: Copying documentation...${NC}"

cp README.md "$BUILD_DIR/" 2>/dev/null || echo "README.md not found"
cp PRE_BUILT_PACKAGE_GUIDE.md "$BUILD_DIR/DEPLOYMENT_GUIDE.md" 2>/dev/null || echo "Guide not found"
cp LICENSE "$BUILD_DIR/" 2>/dev/null || echo "LICENSE not found"

echo -e "${GREEN}✓ Documentation copied${NC}"

# Step 8: Create .htaccess
echo ""
echo -e "${BLUE}Step 8: Creating .htaccess...${NC}"

cat > "$BUILD_DIR/.htaccess" << 'EOF'
<IfModule mod_rewrite.c>
    RewriteEngine On
    
    # Force HTTPS
    RewriteCond %{HTTPS} off
    RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
    
    # API requests to Laravel backend
    RewriteCond %{REQUEST_URI} ^/backend/
    RewriteRule ^backend/(.*)$ backend/public/$1 [L]
    
    # Frontend routing
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteRule ^(.*)$ index.html [L]
</IfModule>

# Security Headers
<IfModule mod_headers.c>
    Header set X-Content-Type-Options "nosniff"
    Header set X-Frame-Options "SAMEORIGIN"
    Header set X-XSS-Protection "1; mode=block"
</IfModule>

# Disable directory browsing
Options -Indexes

# Protect sensitive files
<FilesMatch "^\.">
    Order allow,deny
    Deny from all
</FilesMatch>
EOF

echo -e "${GREEN}✓ .htaccess created${NC}"

# Step 9: Create ZIP package
echo ""
echo -e "${BLUE}Step 9: Creating ZIP package...${NC}"
echo "This may take 1-2 minutes..."
echo ""

cd "$BUILD_DIR"
zip -r ../umrahconnect-complete.zip . -q

if [ $? -eq 0 ]; then
    cd ..
    PACKAGE_SIZE=$(du -h umrahconnect-complete.zip | cut -f1)
    echo -e "${GREEN}✓ Package created: umrahconnect-complete.zip ($PACKAGE_SIZE)${NC}"
else
    echo -e "${RED}✗ Failed to create ZIP package${NC}"
    exit 1
fi

# Step 10: Summary
echo ""
echo -e "${GREEN}=========================================="
echo "  ✓ Package Build Complete!"
echo "==========================================${NC}"
echo ""
echo "Package: umrahconnect-complete.zip"
echo "Size: $PACKAGE_SIZE"
echo ""
echo "What's included:"
echo "  ✓ Backend with vendor folder (Composer dependencies)"
echo "  ✓ Frontend built for production"
echo "  ✓ Installation wizard"
echo "  ✓ Database files"
echo "  ✓ Documentation"
echo "  ✓ .htaccess configured"
echo ""
echo "Next steps:"
echo "  1. Upload umrahconnect-complete.zip to cPanel"
echo "  2. Extract to public_html/"
echo "  3. Set permissions (775 for storage and cache)"
echo "  4. Create database in cPanel"
echo "  5. Visit https://umrahconnect.in/install/"
echo "  6. Follow installation wizard"
echo "  7. Delete install folder after installation"
echo ""
echo "Deployment time: ~20 minutes"
echo ""
echo -e "${BLUE}Read DEPLOYMENT_GUIDE.md in the package for detailed instructions!${NC}"
echo ""
