# 🚀 LARAVEL BACKEND DEPLOYMENT - Step-by-Step Guide

## 📋 PREREQUISITES

Before starting, make sure you have:
- ✅ cPanel access to umrahconnect.in
- ✅ MySQL database access
- ✅ SSH/Terminal access (optional but recommended)
- ✅ FTP client (optional - FileZilla, WinSCP)

---

## 🎯 DEPLOYMENT STEPS

### **STEP 1: Download the Repository**

#### **Option A: Via Git (Recommended)**
```bash
git clone https://github.com/IamTamheedNazir/umrahconnect-2.0.git
cd umrahconnect-2.0
```

#### **Option B: Download ZIP**
1. Go to: https://github.com/IamTamheedNazir/umrahconnect-2.0
2. Click **Code** → **Download ZIP**
3. Extract the ZIP file
4. Navigate to the extracted folder

---

### **STEP 2: Prepare Backend Files**

#### **On Your Local Machine:**

1. **Navigate to backend folder:**
```bash
cd backend-laravel
```

2. **Install Composer dependencies:**
```bash
composer install --optimize-autoloader --no-dev
```

**Note:** If you don't have Composer installed locally, you can skip this and install on the server later.

3. **Create ZIP file:**
   - Zip the entire `backend-laravel` folder
   - Name it: `backend-laravel.zip`

---

### **STEP 3: Upload to cPanel**

#### **Via cPanel File Manager:**

1. **Login to cPanel:**
   - Go to: https://umrahconnect.in:2083
   - Enter your cPanel credentials

2. **Navigate to File Manager:**
   - Click **File Manager** icon
   - Navigate to `public_html`

3. **Create backend folder (if not exists):**
   - Click **+ Folder** button
   - Name: `backend`
   - Click **Create New Folder**

4. **Upload ZIP file:**
   - Click **Upload** button
   - Select `backend-laravel.zip`
   - Wait for upload to complete

5. **Extract ZIP:**
   - Right-click on `backend-laravel.zip`
   - Click **Extract**
   - Extract to: `public_html/backend`
   - Click **Extract Files**

6. **Move files to correct location:**
   - After extraction, you'll have: `public_html/backend/backend-laravel/`
   - Move all files from `backend-laravel` folder to `backend` folder
   - Delete empty `backend-laravel` folder
   - Delete `backend-laravel.zip`

**Final structure should be:**
```
public_html/
└── backend/
    ├── app/
    ├── bootstrap/
    ├── config/
    ├── database/
    ├── public/
    ├── routes/
    ├── storage/
    ├── .env.example
    ├── composer.json
    └── artisan
```

---

### **STEP 4: Install Composer Dependencies (If Not Done)**

#### **Via cPanel Terminal:**

1. **Open Terminal in cPanel:**
   - Find **Terminal** icon in cPanel
   - Click to open

2. **Navigate to backend:**
```bash
cd public_html/backend
```

3. **Install dependencies:**
```bash
composer install --optimize-autoloader --no-dev
```

**Note:** If `composer` command not found, you may need to use full path:
```bash
/usr/local/bin/composer install --optimize-autoloader --no-dev
```

Or contact your hosting provider to enable Composer.

---

### **STEP 5: Create Database**

#### **Via cPanel MySQL Databases:**

1. **Go to MySQL Databases:**
   - In cPanel, find **MySQL Databases** icon
   - Click to open

2. **Create New Database:**
   - Database Name: `umrahconnect_db` (or your choice)
   - Click **Create Database**
   - Note the full database name (usually: `cpanelusername_umrahconnect_db`)

3. **Create Database User:**
   - Username: `umrah_user` (or your choice)
   - Password: Generate strong password
   - Click **Create User**
   - **IMPORTANT:** Save the username and password!

4. **Add User to Database:**
   - Select the user you created
   - Select the database you created
   - Check **ALL PRIVILEGES**
   - Click **Make Changes**

**Note down:**
- Database name: `cpanelusername_umrahconnect_db`
- Database user: `cpanelusername_umrah_user`
- Database password: `your_password_here`

---

### **STEP 6: Configure Environment File**

#### **Via cPanel File Manager:**

1. **Navigate to backend folder:**
   - Go to `public_html/backend`

2. **Copy .env.example to .env:**
   - Right-click on `.env.example`
   - Click **Copy**
   - Name: `.env`
   - Click **Copy Files**

3. **Edit .env file:**
   - Right-click on `.env`
   - Click **Edit**
   - Update the following:

```env
APP_NAME=UmrahConnect
APP_ENV=production
APP_KEY=
APP_DEBUG=false
APP_URL=https://umrahconnect.in/backend

LOG_CHANNEL=stack
LOG_LEVEL=error

DB_CONNECTION=mysql
DB_HOST=localhost
DB_PORT=3306
DB_DATABASE=cpanelusername_umrahconnect_db
DB_USERNAME=cpanelusername_umrah_user
DB_PASSWORD=your_database_password_here

BROADCAST_DRIVER=log
CACHE_DRIVER=file
FILESYSTEM_DISK=local
QUEUE_CONNECTION=sync
SESSION_DRIVER=file
SESSION_LIFETIME=120

# Frontend URL
FRONTEND_URL=https://umrahconnect.in
CORS_ALLOWED_ORIGINS=https://umrahconnect.in

# JWT Configuration
JWT_SECRET=
JWT_TTL=1440
JWT_REFRESH_TTL=20160

# Payment Gateways (Add your keys later)
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
RAZORPAY_WEBHOOK_SECRET=

STRIPE_KEY=
STRIPE_SECRET=
STRIPE_WEBHOOK_SECRET=

PAYPAL_MODE=sandbox
PAYPAL_CLIENT_ID=
PAYPAL_SECRET=

# Mail Configuration (Add your SMTP details)
MAIL_MAILER=smtp
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your_email@gmail.com
MAIL_PASSWORD=your_app_password
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=noreply@umrahconnect.in
MAIL_FROM_NAME="${APP_NAME}"
```

4. **Save the file**

**IMPORTANT:** Replace:
- `cpanelusername_umrahconnect_db` with your actual database name
- `cpanelusername_umrah_user` with your actual database user
- `your_database_password_here` with your actual database password

---

### **STEP 7: Generate Application Keys**

#### **Via cPanel Terminal:**

1. **Navigate to backend:**
```bash
cd ~/public_html/backend
```

2. **Generate Application Key:**
```bash
php artisan key:generate
```

**Expected output:**
```
Application key set successfully.
```

3. **Generate JWT Secret:**
```bash
php artisan jwt:secret
```

**Expected output:**
```
jwt-auth secret [your-secret-here] set successfully.
```

4. **Verify .env updated:**
```bash
cat .env | grep APP_KEY
cat .env | grep JWT_SECRET
```

Both should now have values.

---

### **STEP 8: Set Permissions**

#### **Via cPanel Terminal:**

```bash
cd ~/public_html/backend
chmod -R 755 storage
chmod -R 755 bootstrap/cache
```

#### **Or via File Manager:**

1. Right-click on `storage` folder
2. Click **Change Permissions**
3. Set to: `755` (or check: Owner: Read/Write/Execute, Group: Read/Execute, World: Read/Execute)
4. Check **Recurse into subdirectories**
5. Click **Change Permissions**

Repeat for `bootstrap/cache` folder.

---

### **STEP 9: Run Database Migrations**

#### **Via cPanel Terminal:**

1. **Run migrations:**
```bash
cd ~/public_html/backend
php artisan migrate --force
```

**Expected output:**
```
Migration table created successfully.
Migrating: 2024_01_01_000001_create_users_table
Migrated:  2024_01_01_000001_create_users_table (XX.XXms)
Migrating: 2024_01_01_000002_create_packages_table
Migrated:  2024_01_01_000002_create_packages_table (XX.XXms)
...
```

2. **Seed database with sample data:**
```bash
php artisan db:seed
```

**Expected output:**
```
Database seeding completed successfully.
```

This creates:
- Admin user: `admin@umrahconnect.in` / `admin123`
- Vendor user: `vendor@umrahconnect.in` / `vendor123`
- Customer user: `customer@umrahconnect.in` / `customer123`
- Default settings

**⚠️ IMPORTANT:** Change these passwords after first login!

---

### **STEP 10: Configure .htaccess Files**

#### **A. Root .htaccess (public_html/.htaccess):**

Create or update `public_html/.htaccess`:

```apache
<IfModule mod_rewrite.c>
    RewriteEngine On
    
    # Redirect to HTTPS
    RewriteCond %{HTTPS} off
    RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
    
    # Handle backend API requests
    RewriteCond %{REQUEST_URI} ^/backend
    RewriteRule ^backend/(.*)$ backend/public/$1 [L]
    
    # Handle frontend routes (React Router)
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteCond %{REQUEST_URI} !^/backend
    RewriteRule . /index.html [L]
</IfModule>

# Disable directory browsing
Options -Indexes

# Prevent access to .env files
<Files .env>
    Order allow,deny
    Deny from all
</Files>
```

#### **B. Backend .htaccess (public_html/backend/.htaccess):**

Create `public_html/backend/.htaccess`:

```apache
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteRule ^(.*)$ public/$1 [L]
</IfModule>
```

#### **C. Backend Public .htaccess (public_html/backend/public/.htaccess):**

This should already exist. Verify it contains:

```apache
<IfModule mod_rewrite.c>
    <IfModule mod_negotiation.c>
        Options -MultiViews -Indexes
    </IfModule>

    RewriteEngine On

    # Handle Authorization Header
    RewriteCond %{HTTP:Authorization} .
    RewriteRule .* - [E=HTTP_AUTHORIZATION:%{HTTP:Authorization}]

    # Redirect Trailing Slashes If Not A Folder...
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteCond %{REQUEST_URI} (.+)/$
    RewriteRule ^ %1 [L,R=301]

    # Send Requests To Front Controller...
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteRule ^ index.php [L]
</IfModule>
```

---

### **STEP 11: Clear Cache**

#### **Via cPanel Terminal:**

```bash
cd ~/public_html/backend
php artisan config:clear
php artisan cache:clear
php artisan route:clear
php artisan view:clear
```

---

### **STEP 12: Test Backend**

#### **Test 1: Health Check**

Visit: **https://umrahconnect.in/backend/api/health**

**Expected Response:**
```json
{
    "success": true,
    "message": "API is running",
    "timestamp": "2024-01-16 12:00:00"
}
```

✅ **If you see this, backend is working!**

❌ **If you see 404 or error, check:**
- .htaccess files are in place
- Permissions are correct
- .env file is configured

---

#### **Test 2: Login API**

Use Postman or curl:

```bash
curl -X POST https://umrahconnect.in/backend/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@umrahconnect.in",
    "password": "admin123"
  }'
```

**Expected Response:**
```json
{
    "success": true,
    "message": "Login successful",
    "data": {
        "user": { ... },
        "token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
        "token_type": "bearer",
        "expires_in": 86400
    }
}
```

✅ **If you see this, authentication is working!**

---

### **STEP 13: Verify Database**

#### **Via cPanel phpMyAdmin:**

1. Open **phpMyAdmin** in cPanel
2. Select your database
3. Check tables exist:
   - users
   - packages
   - bookings
   - reviews
   - payments
   - vendor_profiles
   - settings
   - customers
   - pnr_inventory
   - pnr_sales

✅ **All 10 tables should be there!**

---

## ✅ BACKEND DEPLOYMENT COMPLETE!

### **What You've Accomplished:**

✅ Uploaded Laravel backend to cPanel  
✅ Installed Composer dependencies  
✅ Created MySQL database  
✅ Configured environment variables  
✅ Generated application keys  
✅ Set correct permissions  
✅ Ran database migrations  
✅ Seeded sample data  
✅ Configured .htaccess files  
✅ Tested API endpoints  

---

## 🎯 NEXT STEP: Deploy Frontend

Now that backend is working, we need to update and deploy the frontend.

**Continue to:** `FRONTEND_DEPLOYMENT_STEPS.md`

---

## 🔍 TROUBLESHOOTING

### **Issue: 500 Internal Server Error**

**Check:**
1. Laravel logs: `backend/storage/logs/laravel.log`
2. Permissions: `chmod -R 755 storage bootstrap/cache`
3. .env file: Verify database credentials

### **Issue: 404 Not Found**

**Check:**
1. .htaccess files exist in correct locations
2. mod_rewrite is enabled (contact hosting if not)
3. File paths are correct

### **Issue: Database Connection Error**

**Check:**
1. Database name, username, password in .env
2. Database user has privileges
3. Database host is `localhost`

### **Issue: JWT Secret Error**

**Run:**
```bash
php artisan jwt:secret --force
php artisan config:clear
```

---

## 📞 NEED HELP?

If you encounter any issues:
1. Check the error message
2. Look in Laravel logs
3. Verify each step was completed
4. Let me know which step failed

---

**🎉 Backend is now live! Ready to deploy frontend?**
