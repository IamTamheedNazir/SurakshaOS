# 🚀 UmrahConnect 2.0 - Installation Guide

Complete guide to install UmrahConnect 2.0 on cPanel shared hosting with our new dynamic installer!

---

## 📋 **PREREQUISITES**

Before you begin, make sure you have:

### **1. Hosting Requirements**
- ✅ cPanel shared hosting account
- ✅ PHP 8.1 or higher
- ✅ MySQL 5.7 or higher
- ✅ Composer installed (or ability to upload vendor folder)
- ✅ SSH access (optional but recommended)

### **2. Required PHP Extensions**
- PDO, PDO MySQL, MBString, OpenSSL, Tokenizer, XML, CType, JSON, BCMath

### **3. What You'll Need**
- Domain name (e.g., umrahconnect.in)
- Database credentials
- Admin email and password

---

## 🎯 **INSTALLATION METHODS**

### **Method 1: Dynamic Installer (Recommended)** ⚡
**Time: 5 minutes** - Beautiful wizard interface, automatic setup

### **Method 2: Manual Installation** 🛠️
**Time: 15 minutes** - Full control, command-line based

---

## 📦 **METHOD 1: DYNAMIC INSTALLER (RECOMMENDED)**

### **Step 1: Download Repository**

Download from GitHub:
```
https://github.com/IamTamheedNazir/umrahconnect-2.0/archive/refs/heads/main.zip
```

Or clone:
```bash
git clone https://github.com/IamTamheedNazir/umrahconnect-2.0.git
```

---

### **Step 2: Prepare Files**

1. Extract the ZIP file
2. Rename `backend-laravel` to `backend`
3. Your structure:
   ```
   umrahconnect-2.0/
   ├── backend/          (Laravel backend)
   ├── frontend/         (React frontend)
   ├── installer/        (Installation wizard)
   └── database/         (Database files)
   ```

---

### **Step 3: Upload to cPanel**

**Via File Manager:**
1. Login to cPanel → File Manager
2. Navigate to `public_html/`
3. Upload all folders: `backend/`, `frontend/`, `installer/`, `database/`

**Via FTP:**
1. Connect via FTP client
2. Upload to `public_html/`

---

### **Step 4: Install Composer Dependencies**

**Option A: Via SSH**
```bash
cd public_html/backend
composer install --no-dev --optimize-autoloader
```

**Option B: Upload vendor folder**
1. On local machine: `cd backend && composer install --no-dev`
2. Upload `vendor/` folder to `public_html/backend/vendor/`

---

### **Step 5: Run Installation Wizard** 🎨

1. **Visit:** `https://yourdomain.com/installer/`

2. **Follow 5 steps:**

   **Step 1: Requirements Check** ✅
   - Auto-checks PHP version, extensions, permissions
   - All green = ready to proceed

   **Step 2: Database Configuration** 🗄️
   - Enter MySQL credentials
   - Test connection
   - Auto-validates

   **Step 3: Application Configuration** ⚙️
   - Set app name, URL
   - Choose environment (production)
   - Configure debug mode

   **Step 4: Admin Account** 👤
   - Create admin credentials
   - Set email and password

   **Step 5: Installation** 🚀
   - Auto creates .env file
   - Generates app keys
   - Runs migrations
   - Seeds database
   - Creates admin account
   - Sets permissions

3. **Done!** 🎉

---

### **Step 6: Post-Installation**

1. **Delete installer** (security):
   ```bash
   rm -rf public_html/installer/
   ```

2. **Login to admin:**
   ```
   https://yourdomain.com/backend/admin
   ```

3. **Configure site:**
   - Add packages
   - Customize theme
   - Set up payments

---

## 🛠️ **METHOD 2: MANUAL INSTALLATION**

### **Step 1-3:** Same as Method 1

### **Step 4: Create Database**

cPanel → MySQL Databases:
1. Create database: `umrahconnect_db`
2. Create user: `umrahconnect_user`
3. Add user to database with ALL PRIVILEGES

---

### **Step 5: Configure .env**

1. Copy `.env.example` to `.env`
2. Edit values:

```env
APP_NAME=UmrahConnect
APP_ENV=production
APP_KEY=
APP_DEBUG=false
APP_URL=https://yourdomain.com

DB_CONNECTION=mysql
DB_HOST=localhost
DB_PORT=3306
DB_DATABASE=umrahconnect_db
DB_USERNAME=umrahconnect_user
DB_PASSWORD=your_password

JWT_SECRET=
```

---

### **Step 6: Run Artisan Commands**

**Via SSH:**
```bash
cd public_html/backend
php artisan key:generate
php artisan jwt:secret
php artisan migrate --force
php artisan db:seed --force
php artisan config:clear
php artisan cache:clear
```

**Without SSH - Create setup.php:**
```php
<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);

$kernel->call('key:generate', ['--force' => true]);
$kernel->call('jwt:secret', ['--force' => true]);
$kernel->call('migrate', ['--force' => true]);
$kernel->call('db:seed', ['--force' => true]);
$kernel->call('config:clear');
$kernel->call('cache:clear');

echo "Setup complete!";
```

Visit: `https://yourdomain.com/backend/setup.php`
**Delete after running!**

---

### **Step 7: Set Permissions**

```bash
chmod -R 755 backend/storage
chmod -R 755 backend/bootstrap/cache
```

---

### **Step 8: Create Admin**

**Via Tinker:**
```bash
php artisan tinker
```

```php
\App\Models\User::create([
    'name' => 'Admin',
    'email' => 'admin@yourdomain.com',
    'password' => bcrypt('password'),
    'role' => 'admin',
    'email_verified_at' => now()
]);
```

**Via SQL:**
```sql
INSERT INTO users (name, email, password, role, email_verified_at, created_at, updated_at)
VALUES ('Admin', 'admin@yourdomain.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin', NOW(), NOW(), NOW());
```
Default password: `password`

---

## 🔧 **TROUBLESHOOTING**

### **500 Error**
- Check `.env` exists
- Check `APP_KEY` generated
- Check database credentials
- Check logs: `backend/storage/logs/laravel.log`

### **Database Connection Failed**
- Verify database exists
- Check user has access
- Verify DB_HOST (usually `localhost`)
- Verify DB_PORT (usually `3306`)

### **Permission Denied**
```bash
chmod -R 755 backend/storage
chmod -R 755 backend/bootstrap/cache
```

---

## 📱 **TESTING**

### **Test Backend API**
```
https://yourdomain.com/backend/api/health
```

Expected:
```json
{
  "success": true,
  "message": "API is running"
}
```

### **Test Admin Panel**
```
https://yourdomain.com/backend/admin
```

### **Test Frontend**
```
https://yourdomain.com
```

---

## 🎯 **NEXT STEPS**

1. ✅ Configure site settings
2. ✅ Add Umrah packages
3. ✅ Customize theme
4. ✅ Set up payment gateway
5. ✅ Configure email (SMTP)
6. ✅ Test booking flow

---

## 🔒 **SECURITY CHECKLIST**

- [ ] Delete `installer/` folder
- [ ] Delete `setup.php` (if created)
- [ ] Change default admin password
- [ ] Set `APP_DEBUG=false`
- [ ] Set `APP_ENV=production`
- [ ] Enable HTTPS (SSL)
- [ ] Set up backups

---

## 📞 **SUPPORT**

- 📧 Email: support@umrahconnect.in
- 📚 Docs: https://docs.umrahconnect.in
- 🐛 Issues: https://github.com/IamTamheedNazir/umrahconnect-2.0/issues

---

## 🎉 **CONGRATULATIONS!**

UmrahConnect 2.0 is now installed and ready!

Your Umrah booking platform is live. Happy selling! 🕌
