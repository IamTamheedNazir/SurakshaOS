# UmrahConnect 2.0 - Laravel Backend

Complete Laravel 10 backend API for UmrahConnect platform.

## 🚀 Features

- ✅ **JWT Authentication** - Secure token-based authentication
- ✅ **Role-Based Access Control** - Customer, Vendor, Admin roles
- ✅ **Package Management** - CRUD operations for Umrah packages
- ✅ **Booking System** - Complete booking workflow
- ✅ **Payment Integration** - Razorpay, Stripe, PayPal support
- ✅ **Review System** - Package reviews and ratings
- ✅ **File Upload** - Image and document handling
- ✅ **Email Notifications** - Automated email system
- ✅ **API Documentation** - Complete API endpoints
- ✅ **Database Migrations** - Easy database setup

## 📋 Requirements

- PHP 8.1 or higher
- MySQL 8.0 or higher
- Composer
- cPanel hosting (or any PHP hosting)

## 🔧 Installation

### Step 1: Upload Files

Upload the `backend-laravel` folder to your cPanel:

```
public_html/
└── backend/  ← Upload here
```

### Step 2: Install Dependencies

Via SSH (if available):
```bash
cd public_html/backend
composer install --optimize-autoloader --no-dev
```

Via cPanel Terminal:
```bash
cd ~/public_html/backend
/usr/local/bin/composer install --optimize-autoloader --no-dev
```

### Step 3: Configure Environment

1. Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

2. Edit `.env` file:
```env
APP_NAME=UmrahConnect
APP_URL=https://umrahconnect.in

DB_HOST=localhost
DB_DATABASE=your_database_name
DB_USERNAME=your_database_user
DB_PASSWORD=your_database_password

JWT_SECRET=your_jwt_secret_here
```

3. Generate application key:
```bash
php artisan key:generate
```

4. Generate JWT secret:
```bash
php artisan jwt:secret
```

### Step 4: Run Migrations

```bash
php artisan migrate --force
```

### Step 5: Seed Database (Optional)

```bash
php artisan db:seed
```

### Step 6: Set Permissions

```bash
chmod -R 755 storage bootstrap/cache
```

## 📁 Directory Structure

```
backend-laravel/
├── app/
│   ├── Http/
│   │   ├── Controllers/
│   │   │   ├── AuthController.php
│   │   │   ├── PackageController.php
│   │   │   ├── BookingController.php
│   │   │   └── ...
│   │   └── Middleware/
│   └── Models/
│       ├── User.php
│       ├── Package.php
│       ├── Booking.php
│       └── ...
├── database/
│   ├── migrations/
│   └── seeders/
├── routes/
│   └── api.php
├── config/
├── .env
└── composer.json
```

## 🔌 API Endpoints

### Authentication

```
POST   /api/auth/register      - Register new user
POST   /api/auth/login         - Login user
POST   /api/auth/logout        - Logout user
POST   /api/auth/refresh       - Refresh token
GET    /api/auth/me            - Get current user
PUT    /api/auth/profile       - Update profile
POST   /api/auth/change-password - Change password
```

### Packages

```
GET    /api/packages           - List all packages
GET    /api/packages/featured  - Get featured packages
GET    /api/packages/{id}      - Get package details
POST   /api/packages           - Create package (Vendor)
PUT    /api/packages/{id}      - Update package (Vendor)
DELETE /api/packages/{id}      - Delete package (Vendor)
```

### Bookings

```
GET    /api/bookings           - List bookings
POST   /api/bookings           - Create booking
GET    /api/bookings/{id}      - Get booking details
PATCH  /api/bookings/{id}/status - Update booking status
POST   /api/bookings/{id}/cancel - Cancel booking
GET    /api/bookings/statistics - Get booking stats
```

### Vendor Routes

```
GET    /api/vendor/dashboard   - Vendor dashboard
GET    /api/vendor/packages    - Vendor's packages
GET    /api/vendor/bookings    - Vendor's bookings
GET    /api/vendor/statistics  - Vendor statistics
```

### Admin Routes

```
GET    /api/admin/dashboard    - Admin dashboard
GET    /api/admin/users        - List all users
GET    /api/admin/packages     - List all packages
GET    /api/admin/bookings     - List all bookings
PATCH  /api/admin/packages/{id}/approve - Approve package
```

## 🔐 Authentication

All protected routes require JWT token in header:

```
Authorization: Bearer {your_token_here}
```

## 📊 Database Schema

### Users Table
- id (UUID)
- email
- password
- first_name
- last_name
- phone
- role (customer/vendor/admin)
- status (active/inactive/suspended)

### Packages Table
- id (UUID)
- vendor_id
- title
- description
- price
- duration
- destination
- status (active/inactive/pending)

### Bookings Table
- id (UUID)
- booking_number
- user_id
- package_id
- travelers
- travel_date
- total_amount
- status (pending/confirmed/cancelled/completed)

## 🚀 Deployment to cPanel

### Method 1: Direct Upload

1. **Zip the backend folder**
2. **Upload to cPanel File Manager**
3. **Extract in public_html**
4. **Run composer install**
5. **Configure .env**
6. **Run migrations**

### Method 2: Git Deployment

1. **SSH into cPanel**
```bash
cd public_html
git clone https://github.com/IamTamheedNazir/umrahconnect-2.0.git
cd umrahconnect-2.0/backend-laravel
composer install
cp .env.example .env
php artisan key:generate
php artisan jwt:secret
php artisan migrate --force
```

## 🔧 Configuration

### JWT Configuration

In `config/jwt.php`:
```php
'ttl' => env('JWT_TTL', 1440), // 24 hours
'refresh_ttl' => env('JWT_REFRESH_TTL', 20160), // 2 weeks
```

### CORS Configuration

In `config/cors.php`:
```php
'allowed_origins' => [env('FRONTEND_URL', 'https://umrahconnect.in')],
```

### Database Configuration

In `.env`:
```env
DB_CONNECTION=mysql
DB_HOST=localhost
DB_PORT=3306
DB_DATABASE=umrahconnect_db
DB_USERNAME=umrahconnect_user
DB_PASSWORD=your_password
```

## 📧 Email Configuration

In `.env`:
```env
MAIL_MAILER=smtp
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your_email@gmail.com
MAIL_PASSWORD=your_app_password
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=noreply@umrahconnect.in
MAIL_FROM_NAME=UmrahConnect
```

## 💳 Payment Gateway Configuration

### Razorpay

```env
RAZORPAY_KEY_ID=your_key_id
RAZORPAY_KEY_SECRET=your_key_secret
```

### Stripe

```env
STRIPE_KEY=your_publishable_key
STRIPE_SECRET=your_secret_key
```

## 🧪 Testing

Run tests:
```bash
php artisan test
```

## 📝 API Response Format

### Success Response
```json
{
    "success": true,
    "message": "Operation successful",
    "data": {
        // Response data
    }
}
```

### Error Response
```json
{
    "success": false,
    "message": "Error message",
    "errors": {
        // Validation errors
    }
}
```

## 🔒 Security

- ✅ JWT token authentication
- ✅ Password hashing (bcrypt)
- ✅ SQL injection protection (prepared statements)
- ✅ XSS protection
- ✅ CSRF protection
- ✅ Rate limiting
- ✅ Input validation

## 🐛 Troubleshooting

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
- Check user permissions
- Try `127.0.0.1` instead of `localhost`

### Issue: JWT Token Invalid

**Solution:**
```bash
php artisan jwt:secret
php artisan config:clear
```

## 📞 Support

- Email: support@umrahconnect.in
- Documentation: https://docs.umrahconnect.in
- GitHub: https://github.com/IamTamheedNazir/umrahconnect-2.0

## 📄 License

MIT License

---

**Built with ❤️ for UmrahConnect 2.0**
