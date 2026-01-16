# 🚀 DEPLOY BACKEND NOW - Step by Step

## Your backend API is not accessible. Let's fix it!

---

## 🎯 CURRENT STATUS

**Backend API Test:** https://umrahconnect.in/backend/api/health  
**Status:** ❌ Not accessible (404 or not deployed)

**This means:** Laravel backend is not deployed yet.

---

## ⚡ QUICK DEPLOYMENT (30 minutes)

### **STEP 1: Download Repository**

#### **Option A: Via Git**
```bash
git clone https://github.com/IamTamheedNazir/umrahconnect-2.0.git
cd umrahconnect-2.0
```

#### **Option B: Download ZIP**
1. Go to: https://github.com/IamTamheedNazir/umrahconnect-2.0
2. Click **Code** → **Download ZIP**
3. Extract the ZIP file

---

### **STEP 2: Prepare Backend Files**

1. **Navigate to backend folder:**
```bash
cd backend-laravel
```

2. **Create ZIP file:**
   - Right-click on `backend-laravel` folder
   - Select "Compress" or "Send to → Compressed folder"
   - Name it: `backend.zip`

---

### **STEP 3: Upload to cPanel**

1. **Login to cPanel:**
   - URL: https://umrahconnect.in:2083
   - Enter your cPanel username and password

2. **Open File Manager:**
   - Click **File Manager** icon
   - Navigate to `public_html`

3. **Create backend folder:**
   - Click **+ Folder** button
   - Name: `backend`
   - Click **Create New Folder**

4. **Upload ZIP:**
   - Click on `backend` folder to open it
   - Click **Upload** button
   - Select `backend.zip`
   - Wait for upload (may take 5-10 minutes)

5. **Extract ZIP:**
   - Go back to File Manager
   - Navigate to `public_html/backend`
   - Right-click on `backend.zip`
   - Click **Extract**
   - Click **Extract Files**

6. **Move files to correct location:**
   - After extraction, you'll have: `backend/backend-laravel/`
   - Select all files inside `backend-laravel` folder
   - Click **Move**
   - Move to: `public_html/backend`
   - Delete empty `backend-laravel` folder
   - Delete `backend.zip`

**Final structure:**
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

### **STEP 4: Create Database**

1. **In cPanel, find "MySQL Databases"**

2. **Create Database:**
   - Database Name: `umrahconnect_db`
   - Click **Create Database**
   - Note the full name (e.g., `cpanel_umrahconnect_db`)

3. **Create User:**
   - Username: `umrah_user`
   - Password: Click **Generate Password** (save it!)
   - Click **Create User**
   - Note the full username (e.g., `cpanel_umrah_user`)

4. **Add User to Database:**
   - Select user: `cpanel_umrah_user`
   - Select database: `cpanel_umrahconnect_db`
   - Check **ALL PRIVILEGES**
   - Click **Make Changes**

**Save these credentials:**
```
Database: cpanel_umrahconnect_db
Username: cpanel_umrah_user
Password: [your generated password]
```

---

### **STEP 5: Configure .env File**

1. **In File Manager, navigate to:**
   `public_html/backend`

2. **Copy .env.example to .env:**
   - Right-click `.env.example`
   - Click **Copy**
   - Name: `.env`
   - Click **Copy Files**

3. **Edit .env file:**
   - Right-click `.env`
   - Click **Edit**
   - Update these lines:

```env
APP_NAME=UmrahConnect
APP_ENV=production
APP_KEY=
APP_DEBUG=false
APP_URL=https://umrahconnect.in/backend

DB_CONNECTION=mysql
DB_HOST=localhost
DB_PORT=3306
DB_DATABASE=cpanel_umrahconnect_db
DB_USERNAME=cpanel_umrah_user
DB_PASSWORD=your_generated_password_here

FRONTEND_URL=https://umrahconnect.in
CORS_ALLOWED_ORIGINS=https://umrahconnect.in

JWT_SECRET=
JWT_TTL=1440
```

4. **Save the file**

**IMPORTANT:** Replace:
- `cpanel_umrahconnect_db` with your actual database name
- `cpanel_umrah_user` with your actual username
- `your_generated_password_here` with your actual password

---

### **STEP 6: Install Composer Dependencies**

1. **Open Terminal in cPanel:**
   - Find **Terminal** icon
   - Click to open

2. **Navigate to backend:**
```bash
cd public_html/backend
```

3. **Install dependencies:**
```bash
composer install --optimize-autoloader --no-dev
```

**If composer not found, try:**
```bash
/usr/local/bin/composer install --optimize-autoloader --no-dev
```

**Wait for installation (5-10 minutes)**

---

### **STEP 7: Generate Keys**

```bash
cd ~/public_html/backend
php artisan key:generate
php artisan jwt:secret
```

**Expected output:**
```
Application key set successfully.
jwt-auth secret set successfully.
```

---

### **STEP 8: Set Permissions**

```bash
chmod -R 755 storage
chmod -R 755 bootstrap/cache
```

---

### **STEP 9: Run Migrations**

```bash
php artisan migrate --force
```

**Expected output:**
```
Migration table created successfully.
Migrating: 2024_01_01_000001_create_users_table
Migrated:  2024_01_01_000001_create_users_table
...
```

**Then seed database:**
```bash
php artisan db:seed
```

**Expected output:**
```
Database seeding completed successfully.
```

---

### **STEP 10: Create .htaccess Files**

#### **A. Root .htaccess (public_html/.htaccess)**

Create or edit `public_html/.htaccess`:

```apache
<IfModule mod_rewrite.c>
    RewriteEngine On
    
    # Redirect to HTTPS
    RewriteCond %{HTTPS} off
    RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
    
    # Handle backend API requests
    RewriteCond %{REQUEST_URI} ^/backend
    RewriteRule ^backend/(.*)$ backend/public/$1 [L]
    
    # Handle frontend routes
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteCond %{REQUEST_URI} !^/backend
    RewriteRule . /index.html [L]
</IfModule>

Options -Indexes

<Files .env>
    Order allow,deny
    Deny from all
</Files>
```

#### **B. Backend .htaccess (public_html/backend/.htaccess)**

Create `public_html/backend/.htaccess`:

```apache
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteRule ^(.*)$ public/$1 [L]
</IfModule>
```

---

### **STEP 11: Test Backend**

**Open in browser:**
```
https://umrahconnect.in/backend/api/health
```

**Expected Response:**
```json
{
    "success": true,
    "message": "API is running",
    "timestamp": "2024-01-16 12:00:00"
}
```

✅ **If you see this → Backend is working!**

❌ **If you see 404 or error → Check troubleshooting below**

---

## 🔧 TROUBLESHOOTING

### **Issue: 404 Not Found**

**Check:**
1. .htaccess files exist in correct locations
2. Files uploaded to correct folder
3. Permissions set correctly

**Fix:**
```bash
cd ~/public_html/backend
ls -la  # Check files exist
cat .htaccess  # Check .htaccess content
```

---

### **Issue: 500 Internal Server Error**

**Check Laravel logs:**
```bash
cd ~/public_html/backend
tail -50 storage/logs/laravel.log
```

**Common fixes:**
```bash
# Clear cache
php artisan config:clear
php artisan cache:clear
php artisan route:clear

# Fix permissions
chmod -R 755 storage bootstrap/cache
```

---

### **Issue: Database Connection Error**

**Check:**
1. Database credentials in .env are correct
2. Database user has privileges
3. Database exists

**Test connection:**
```bash
php artisan tinker
DB::connection()->getPdo();
```

---

### **Issue: Composer Not Found**

**Try full path:**
```bash
/usr/local/bin/composer install --optimize-autoloader --no-dev
```

**Or contact hosting support to enable Composer**

---

## ✅ SUCCESS CHECKLIST

After deployment:
- [ ] Backend API accessible: https://umrahconnect.in/backend/api/health
- [ ] Returns JSON response
- [ ] No errors in Laravel logs
- [ ] Database tables created (10 tables)
- [ ] Sample data seeded

---

## 🎯 NEXT STEP

Once backend is working:
1. Update frontend .env
2. Rebuild frontend
3. Upload to cPanel
4. Test complete website

**Guide:** `FRONTEND_DEPLOYMENT_STEPS.md`

---

## 📞 NEED HELP?

**Stuck on a step?** Tell me:
1. Which step you're on
2. What error you see
3. What you've tried

**I'll help you fix it!** 🚀

---

**🚀 Let's get your backend deployed!** 🚀
