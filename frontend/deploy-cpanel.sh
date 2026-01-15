#!/bin/bash

# UmrahConnect 2.0 - cPanel Deployment Script
# This script builds the project and prepares it for cPanel deployment

echo "🚀 UmrahConnect 2.0 - cPanel Deployment Script"
echo "=============================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if we're in the frontend directory
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ Error: package.json not found. Please run this script from the frontend directory.${NC}"
    exit 1
fi

echo -e "${YELLOW}📦 Step 1: Installing dependencies...${NC}"
npm install
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Failed to install dependencies${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Dependencies installed${NC}"
echo ""

echo -e "${YELLOW}🔨 Step 2: Building production bundle...${NC}"
npm run build
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Build failed${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Build completed${NC}"
echo ""

echo -e "${YELLOW}📋 Step 3: Preparing deployment files...${NC}"

# Create deployment directory
DEPLOY_DIR="cpanel-deploy"
rm -rf $DEPLOY_DIR
mkdir -p $DEPLOY_DIR

# Copy build files
cp -r dist/* $DEPLOY_DIR/

# Copy .htaccess
if [ -f ".htaccess.example" ]; then
    cp .htaccess.example $DEPLOY_DIR/.htaccess
    echo -e "${GREEN}✅ .htaccess file copied${NC}"
else
    echo -e "${YELLOW}⚠️  .htaccess.example not found, creating basic .htaccess${NC}"
    cat > $DEPLOY_DIR/.htaccess << 'EOF'
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule ^ index.html [L]
</IfModule>
EOF
fi

# Create robots.txt
cat > $DEPLOY_DIR/robots.txt << 'EOF'
User-agent: *
Allow: /

Sitemap: https://yourdomain.com/sitemap.xml
EOF
echo -e "${GREEN}✅ robots.txt created${NC}"

# Create a deployment info file
cat > $DEPLOY_DIR/DEPLOY_INFO.txt << EOF
UmrahConnect 2.0 - Deployment Package
======================================

Build Date: $(date)
Build Version: 2.0.0

Deployment Instructions:
1. Upload all files to your cPanel public_html directory
2. Ensure .htaccess file is present
3. Set file permissions: 644 for files, 755 for directories
4. Configure SSL certificate in cPanel
5. Test the deployment at your domain

Files included:
- index.html (main entry point)
- assets/ (JavaScript, CSS, images)
- .htaccess (Apache configuration)
- robots.txt (SEO)

For detailed instructions, see CPANEL_DEPLOYMENT.md

Support: support@umrahconnect.com
EOF

echo -e "${GREEN}✅ Deployment files prepared${NC}"
echo ""

# Create ZIP file for easy upload
echo -e "${YELLOW}📦 Step 4: Creating deployment package...${NC}"
cd $DEPLOY_DIR
zip -r ../umrahconnect-cpanel-deploy.zip . > /dev/null 2>&1
cd ..
echo -e "${GREEN}✅ Deployment package created: umrahconnect-cpanel-deploy.zip${NC}"
echo ""

# Display summary
echo -e "${GREEN}=============================================="
echo "🎉 Deployment package ready!"
echo "=============================================="
echo ""
echo "📁 Deployment files location:"
echo "   - Folder: ./$DEPLOY_DIR/"
echo "   - ZIP: ./umrahconnect-cpanel-deploy.zip"
echo ""
echo "📤 Next steps:"
echo "   1. Download umrahconnect-cpanel-deploy.zip"
echo "   2. Login to your cPanel"
echo "   3. Go to File Manager"
echo "   4. Navigate to public_html"
echo "   5. Upload and extract the ZIP file"
echo "   6. Verify .htaccess is present"
echo "   7. Test your deployment"
echo ""
echo "📖 For detailed instructions, see:"
echo "   CPANEL_DEPLOYMENT.md"
echo ""
echo "🌐 Your site will be live at:"
echo "   https://yourdomain.com"
echo ""
echo -e "${GREEN}Good luck with your deployment! 🚀${NC}"
