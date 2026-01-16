# 🚀 Quick Installation Guide

## Prerequisites

- PHP 8.1 or higher
- MySQL 8.0 or higher
- Composer
- cPanel or any PHP hosting

---

## Method 1: Automatic Installation (Linux/Mac)

```bash
chmod +x install.sh
./install.sh
```

This will:
- Install Composer dependencies
- Create .env file
- Generate application key
- Generate JWT secret
- Set permissions
- Optionally run migrations and seeders

---

## Method 2: Manual Installation

### Step 1: Install Dependencies

```bash
composer install --optimize-autoloader --no-dev
```

### Step 2: Environment Configuration

```bash
cp .env.example .env
```

Edit `.env` and configure:

```env
DB_HOST=localhost
DB_DATABASE=your_database_name
DB_USERNAME=your_database_user
DB_PASSWORD=your_database_password

FRONTEND_URL=https://umrahconnect.in

JWT_SECRET=
```

### Step 3: Generate Keys

```bash
php artisan key:generate
php artisan jwt:secret
```

### Step 4: Set Permissions

```bash
chmod -R 755 storage bootstrap/cache
```

### Step 5: Run Migrations

```bash
php artisan migrate --force
```

### Step 6: Seed Database (Optional)

```bash
php artisan db:seed
```

This creates:
- Admin user: `admin@umrahconnect.in` / `admin123`
- Vendor user: `vendor@umrahconnect.in` / `vendor123`
- Customer user: `customer@umrahconnect.in` / `customer123`
- Default settings

---

## Method 3: cPanel Installation

### Step 1: Upload Files

1. Zip the `backend-laravel` folder
2. Upload to cPanel File Manager
3. Extract in `public_html/backend`

### Step 2: Install Composer Dependencies

Via Terminal:
```bash
cd ~/public_html/backend
composer install --optimize-autoloader --no-dev
```

Or upload pre-installed `vendor` folder

### Step 3: Configure Environment

1. Rename `.env.example` to `.env`
2. Edit `.env` in File Manager
3. Update database credentials

### Step 4: Generate Keys

```bash
php artisan key:generate
php artisan jwt:secret
```

### Step 5: Create Database

1. Go to MySQL Databases in cPanel
2. Create database: `umrahconnect_db`
3. Create user and grant privileges
4. Update `.env` with credentials

### Step 6: Run Migrations

```bash
php artisan migrate --force
php artisan db:seed
```

### Step 7: Set Permissions

```bash
chmod -R 755 storage bootstrap/cache
```

---

## Verification

### Test API Health

Visit: `https://yourdomain.com/backend/api/health`

Expected response:
```json
{
    "success": true,
    "message": "API is running",
    "timestamp": "2024-01-16 12:00:00"
}
```

### Test Authentication

**Register:**
```bash
POST /api/auth/register
{
    "first_name": "Test",
    "last_name": "User",
    "email": "test@example.com",
    "password": "password123",
    "password_confirmation": "password123"
}
```

**Login:**
```bash
POST /api/auth/login
{
    "email": "test@example.com",
    "password": "password123"
}
```

---

## Configuration

### Payment Gateways

**Razorpay:**
```env
RAZORPAY_KEY_ID=your_key_id
RAZORPAY_KEY_SECRET=your_key_secret
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret
```

**Stripe:**
```env
STRIPE_KEY=your_publishable_key
STRIPE_SECRET=your_secret_key
STRIPE_WEBHOOK_SECRET=your_webhook_secret
```

### Email Configuration

```env
MAIL_MAILER=smtp
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your_email@gmail.com
MAIL_PASSWORD=your_app_password
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=noreply@umrahconnect.in
```

### CORS Configuration

```env
FRONTEND_URL=https://umrahconnect.in
CORS_ALLOWED_ORIGINS=https://umrahconnect.in
```

---

## Troubleshooting

### Issue: 500 Internal Server Error

**Solution:**
```bash
php artisan config:clear
php artisan cache:clear
php artisan route:clear
chmod -R 755 storage bootstrap/cache
```

### Issue: Database Connection Failed

**Solution:**
- Check database credentials in `.env`
- Verify database exists
- Try `127.0.0.1` instead of `localhost`
- Check user has proper privileges

### Issue: JWT Token Invalid

**Solution:**
```bash
php artisan jwt:secret
php artisan config:clear
```

### Issue: Permission Denied

**Solution:**
```bash
chmod -R 755 storage
chmod -R 755 bootstrap/cache
chown -R www-data:www-data storage bootstrap/cache
```

---

## Default Credentials

After running `php artisan db:seed`:

- **Admin:** admin@umrahconnect.in / admin123
- **Vendor:** vendor@umrahconnect.in / vendor123
- **Customer:** customer@umrahconnect.in / customer123

**⚠️ Change these passwords in production!**

---

## Next Steps

1. ✅ Configure payment gateways
2. ✅ Configure email settings
3. ✅ Update frontend API URL
4. ✅ Test all endpoints
5. ✅ Deploy frontend
6. ✅ Go live!

---

## Support

- **Documentation:** See README.md
- **Deployment Guide:** See LARAVEL_DEPLOYMENT_GUIDE.md
- **GitHub:** https://github.com/IamTamheedNazir/umrahconnect-2.0

---

**🎉 Installation Complete! Your Laravel backend is ready!**
