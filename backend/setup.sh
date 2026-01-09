#!/bin/bash

# UmrahConnect 2.0 - Complete Setup Script
# This script will set up the entire backend system

echo "================================================"
echo "🚀 UmrahConnect 2.0 - Backend Setup"
echo "================================================"
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if Node.js is installed
echo "📦 Checking Node.js installation..."
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed${NC}"
    echo "Please install Node.js from https://nodejs.org/"
    exit 1
fi
echo -e "${GREEN}✅ Node.js $(node -v) found${NC}"
echo ""

# Check if MySQL is installed
echo "🗄️  Checking MySQL installation..."
if ! command -v mysql &> /dev/null; then
    echo -e "${RED}❌ MySQL is not installed${NC}"
    echo "Please install MySQL from https://dev.mysql.com/downloads/"
    exit 1
fi
echo -e "${GREEN}✅ MySQL found${NC}"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Dependencies installed successfully${NC}"
else
    echo -e "${RED}❌ Failed to install dependencies${NC}"
    exit 1
fi
echo ""

# Create .env file
echo "⚙️  Setting up environment variables..."
if [ ! -f .env ]; then
    cp .env.example .env
    echo -e "${GREEN}✅ .env file created${NC}"
    echo -e "${YELLOW}⚠️  Please edit .env file with your configuration${NC}"
else
    echo -e "${YELLOW}⚠️  .env file already exists${NC}"
fi
echo ""

# Database setup
echo "🗄️  Database Setup"
echo "================================================"
read -p "Enter MySQL username (default: root): " DB_USER
DB_USER=${DB_USER:-root}

read -sp "Enter MySQL password: " DB_PASSWORD
echo ""

read -p "Enter database name (default: umrahconnect): " DB_NAME
DB_NAME=${DB_NAME:-umrahconnect}

# Create database
echo "Creating database..."
mysql -u $DB_USER -p$DB_PASSWORD -e "CREATE DATABASE IF NOT EXISTS $DB_NAME;" 2>/dev/null
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Database created successfully${NC}"
else
    echo -e "${RED}❌ Failed to create database${NC}"
    exit 1
fi

# Import schema
echo "Importing database schema..."
mysql -u $DB_USER -p$DB_PASSWORD $DB_NAME < ../install/complete_schema.sql 2>/dev/null
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Core schema imported (23 tables)${NC}"
else
    echo -e "${RED}❌ Failed to import core schema${NC}"
    exit 1
fi

mysql -u $DB_USER -p$DB_PASSWORD $DB_NAME < ../install/dynamic_registration.sql 2>/dev/null
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Dynamic registration schema imported (4 tables)${NC}"
else
    echo -e "${RED}❌ Failed to import dynamic registration schema${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Total 27 tables created successfully${NC}"
echo ""

# Update .env file
echo "Updating .env file with database credentials..."
sed -i.bak "s/DB_USER=.*/DB_USER=$DB_USER/" .env
sed -i.bak "s/DB_PASSWORD=.*/DB_PASSWORD=$DB_PASSWORD/" .env
sed -i.bak "s/DB_NAME=.*/DB_NAME=$DB_NAME/" .env
rm .env.bak 2>/dev/null
echo -e "${GREEN}✅ .env file updated${NC}"
echo ""

# Create required directories
echo "📁 Creating required directories..."
mkdir -p uploads temp logs
echo -e "${GREEN}✅ Directories created${NC}"
echo ""

# Generate JWT secret
echo "🔐 Generating JWT secret..."
JWT_SECRET=$(openssl rand -base64 32)
sed -i.bak "s/JWT_SECRET=.*/JWT_SECRET=$JWT_SECRET/" .env
rm .env.bak 2>/dev/null
echo -e "${GREEN}✅ JWT secret generated${NC}"
echo ""

# Summary
echo "================================================"
echo "✅ Setup Complete!"
echo "================================================"
echo ""
echo "📊 Summary:"
echo "  - Database: $DB_NAME"
echo "  - Tables: 27"
echo "  - API Endpoints: 164"
echo "  - Controllers: 5"
echo "  - Utilities: 3"
echo ""
echo "🚀 Next Steps:"
echo "  1. Edit .env file with your configuration:"
echo "     - Email (SMTP) settings"
echo "     - SMS provider settings"
echo "     - Payment gateway keys"
echo "     - Cloud storage credentials"
echo ""
echo "  2. Start the server:"
echo "     npm run dev    (development)"
echo "     npm start      (production)"
echo ""
echo "  3. Test the API:"
echo "     curl http://localhost:5000/health"
echo ""
echo "📚 Documentation:"
echo "  - API Docs: BACKEND_API_DOCUMENTATION.md"
echo "  - Setup Guide: SIMPLE_SETUP.md"
echo "  - Backend README: backend/README.md"
echo ""
echo "================================================"
echo "🎉 Happy Coding!"
echo "================================================"
