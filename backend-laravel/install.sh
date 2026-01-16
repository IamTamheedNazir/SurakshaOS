#!/bin/bash

echo "========================================="
echo "UmrahConnect 2.0 - Laravel Backend Setup"
echo "========================================="
echo ""

# Check if composer is installed
if ! command -v composer &> /dev/null
then
    echo "❌ Composer is not installed. Please install Composer first."
    exit 1
fi

echo "✅ Composer found"
echo ""

# Install dependencies
echo "📦 Installing Composer dependencies..."
composer install --optimize-autoloader --no-dev

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo "✅ Dependencies installed"
echo ""

# Copy .env file
if [ ! -f .env ]; then
    echo "📝 Creating .env file..."
    cp .env.example .env
    echo "✅ .env file created"
else
    echo "⚠️  .env file already exists, skipping..."
fi

echo ""

# Generate application key
echo "🔑 Generating application key..."
php artisan key:generate

if [ $? -ne 0 ]; then
    echo "❌ Failed to generate application key"
    exit 1
fi

echo "✅ Application key generated"
echo ""

# Generate JWT secret
echo "🔐 Generating JWT secret..."
php artisan jwt:secret

if [ $? -ne 0 ]; then
    echo "❌ Failed to generate JWT secret"
    exit 1
fi

echo "✅ JWT secret generated"
echo ""

# Set permissions
echo "🔒 Setting permissions..."
chmod -R 755 storage bootstrap/cache
echo "✅ Permissions set"
echo ""

# Ask if user wants to run migrations
read -p "Do you want to run database migrations now? (y/n) " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Yy]$ ]]
then
    echo "🗄️  Running migrations..."
    php artisan migrate --force
    
    if [ $? -ne 0 ]; then
        echo "❌ Failed to run migrations"
        echo "⚠️  Please configure your database in .env file and run: php artisan migrate"
    else
        echo "✅ Migrations completed"
        echo ""
        
        # Ask if user wants to seed database
        read -p "Do you want to seed the database with sample data? (y/n) " -n 1 -r
        echo ""
        if [[ $REPLY =~ ^[Yy]$ ]]
        then
            echo "🌱 Seeding database..."
            php artisan db:seed
            
            if [ $? -ne 0 ]; then
                echo "❌ Failed to seed database"
            else
                echo "✅ Database seeded successfully"
                echo ""
                echo "📧 Default Login Credentials:"
                echo "   Admin: admin@umrahconnect.in / admin123"
                echo "   Vendor: vendor@umrahconnect.in / vendor123"
                echo "   Customer: customer@umrahconnect.in / customer123"
            fi
        fi
    fi
fi

echo ""
echo "========================================="
echo "✅ Installation Complete!"
echo "========================================="
echo ""
echo "📝 Next Steps:"
echo "1. Configure your database in .env file"
echo "2. Update FRONTEND_URL in .env"
echo "3. Configure payment gateways (Razorpay, Stripe)"
echo "4. Configure email settings"
echo "5. Run: php artisan migrate (if not done)"
echo "6. Run: php artisan db:seed (if not done)"
echo ""
echo "🚀 Your Laravel backend is ready!"
echo "📖 See README.md for more information"
echo ""
