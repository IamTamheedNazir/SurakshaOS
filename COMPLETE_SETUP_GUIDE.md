# 🚀 UmrahConnect 2.0 - Complete Setup Guide

**Everything you need to deploy UmrahConnect 2.0 on cPanel in 10 minutes!**

---

## 📦 **WHAT YOU'LL GET**

After following this guide:
- ✅ Fully working UmrahConnect 2.0 installation
- ✅ Laravel backend configured
- ✅ React frontend ready
- ✅ Database setup complete
- ✅ Admin account created
- ✅ Ready to accept bookings!

---

## 🎯 **QUICK START (3 STEPS)**

### **Step 1: Download & Prepare** (2 minutes)

**Option A: Automated (Recommended)**
```bash
# Download repository
git clone https://github.com/IamTamheedNazir/umrahconnect-2.0.git
cd umrahconnect-2.0

# Run setup script
chmod +x setup.sh
./setup.sh

# Install Composer dependencies
cd backend
composer install --no-dev --optimize-autoloader
```

**Option B: Manual**
1. Download ZIP from GitHub
2. Extract files
3. Rename folders:
   - `backend-laravel` → `backend`
   - `installer` → `install`

---

### **Step 2: Upload to cPanel** (3 minutes)

1. **Zip the entire folder**
2. **Login to cPanel**
3. **Go to File Manager** → `public_html/`
4. **Upload ZIP file**
5. **Extract** (right-click → Extract)
6. **Move files** from extracted folder to `public_html/`

**Your structure should be:**
```
public_html/
├── backend/
├── frontend/
├── install/
└── database/
```

---

### **Step 3: Run Installer** (5 minutes)

1. **Visit:** `https://yourdomain.com/install/`
2. **Follow 5-step wizard:**
   - ✅ Requirements check
   - 🗄️ Database setup
   - ⚙️ App configuration
   - 👤 Admin account
   - 🚀 Installation

3. **Done!** 🎉

---

## 🔧 **FIXING COMMON ISSUES**

### **Issue 1: Composer Dependencies Missing** ❌

**Symptoms:**
- Installer shows "Composer Dependencies: Not installed"
- 500 error on installer page

**Fix Option A - Via SSH:**
```bash
cd /home/yourusername/public_html/backend
composer install --no-dev --optimize-autoloader
```

**Fix Option B - Upload vendor folder:**

1. **On your local machine:**
   ```bash
   cd backend
   composer install --no-dev --optimize-autoloader
   ```

2. **Upload to cPanel:**
   - Upload `vendor/` folder
   - Place at: `public_html/backend/vendor/`

**Fix Option C - Download pre-built:**

If you don't have Composer:
1. Ask someone with Composer to run it
2. Get the `vendor/` folder from them
3. Upload to cPanel

---

### **Issue 2: Storage Not Writable** ❌

**Symptoms:**
- Installer shows "Storage Directory Writable: Not writable"

**Fix via cPanel File Manager:**

1. Navigate to `public_html/backend/storage/`
2. Right-click **storage** folder
3. Click **Change Permissions**
4. Enter **775** (or check all boxes)
5. ✅ Check **"Recurse into subdirectories"**
6. Click **Change Permissions**

**Fix via SSH:**
```bash
chmod -R 775 /home/yourusername/public_html/backend/storage
chmod -R 775 /home/yourusername/public_html/backend/bootstrap/cache
```

---

### **Issue 3: Bootstrap Cache Not Writable** ❌

**Symptoms:**
- Installer shows "Bootstrap Cache Writable: Not writable"

**Fix via cPanel File Manager:**

1. Navigate to `public_html/backend/bootstrap/cache/`
2. Right-click **cache** folder
3. Click **Change Permissions**
4. Enter **775**
5. ✅ Check **"Recurse into subdirectories"**
6. Click **Change Permissions**

---

### **Issue 4: PHP Version Too Old** ❌

**Symptoms:**
- Installer shows "PHP Version: 7.x (Required: 8.1+)"

**Fix:**

1. **cPanel** → **Select PHP Version** or **MultiPHP Manager**
2. Select **PHP 8.1** or **8.2** or **8.3**
3. Click **Apply**
4. Refresh installer page

---

### **Issue 5: Missing PHP Extensions** ❌

**Symptoms:**
- Installer shows "PHP Extension: xxx: Not installed"

**Fix:**

1. **cPanel** → **Select PHP Version**
2. Click **Extensions** tab
3. Enable these extensions:
   - ✅ pdo
   - ✅ pdo_mysql
   - ✅ mbstring
   - ✅ openssl
   - ✅ tokenizer
   - ✅ xml
   - ✅ ctype
   - ✅ json
   - ✅ bcmath
4. Click **Save**
5. Refresh installer page

---

## 📋 **COMPLETE CHECKLIST**

Before running installer, verify:

- [ ] Folders renamed: `backend-laravel` → `backend`, `installer` → `install`
- [ ] Files uploaded to `public_html/`
- [ ] Composer dependencies installed (`backend/vendor/` exists)
- [ ] PHP version 8.1 or higher
- [ ] All required PHP extensions enabled
- [ ] Storage directory writable (775)
- [ ] Bootstrap cache writable (775)
- [ ] Database created in cPanel
- [ ] Database user created with ALL PRIVILEGES

---

## 🎯 **STEP-BY-STEP DETAILED GUIDE**

### **Part 1: Prepare Files Locally**

#### **1.1 Download Repository**

**Via Git:**
```bash
git clone https://github.com/IamTamheedNazir/umrahconnect-2.0.git
cd umrahconnect-2.0
```

**Via ZIP:**
1. Go to: https://github.com/IamTamheedNazir/umrahconnect-2.0
2. Click **Code** → **Download ZIP**
3. Extract ZIP file

#### **1.2 Run Setup Script**

**On Linux/Mac:**
```bash
chmod +x setup.sh
./setup.sh
```

**On Windows:**
Double-click `setup.bat`

This will:
- ✅ Rename folders automatically
- ✅ Check directory structure
- ✅ Verify required files exist

#### **1.3 Install Composer Dependencies**

```bash
cd backend
composer install --no-dev --optimize-autoloader
```

**If you don't have Composer:**
- Download from: https://getcomposer.org/download/
- Or skip this step and upload vendor folder later

---

### **Part 2: Upload to cPanel**

#### **2.1 Create ZIP File**

**On Linux/Mac:**
```bash
cd ..
zip -r umrahconnect.zip .
```

**On Windows:**
- Right-click folder → Send to → Compressed (zipped) folder

#### **2.2 Upload to cPanel**

1. **Login to cPanel**
2. **File Manager** → Navigate to `public_html/`
3. Click **Upload**
4. Select `umrahconnect.zip`
5. Wait for upload to complete

#### **2.3 Extract Files**

1. Right-click `umrahconnect.zip`
2. Click **Extract**
3. Extract to `public_html/`
4. **Move files** from extracted folder to root:
   ```
   public_html/umrahconnect-2.0/* → public_html/
   ```
5. Delete empty `umrahconnect-2.0/` folder
6. Delete `umrahconnect.zip`

---

### **Part 3: Create Database**

#### **3.1 Create Database**

1. **cPanel** → **MySQL Databases**
2. **Create New Database:**
   - Database Name: `umrahconnect_db`
   - Click **Create Database**

#### **3.2 Create Database User**

1. **Create New User:**
   - Username: `umrahconnect_user`
   - Password: (generate strong password)
   - Click **Create User**

#### **3.3 Add User to Database**

1. **Add User To Database:**
   - User: `umrahconnect_user`
   - Database: `umrahconnect_db`
   - Click **Add**

2. **Set Privileges:**
   - Check **ALL PRIVILEGES**
   - Click **Make Changes**

**💾 Save these credentials - you'll need them!**

---

### **Part 4: Run Installer**

#### **4.1 Visit Installer**

Open browser: `https://yourdomain.com/install/`

#### **4.2 Step 1: Requirements Check**

The installer will automatically check:
- ✅ PHP version (8.1+)
- ✅ PHP extensions
- ✅ Directory permissions
- ✅ Composer dependencies

**If any checks fail:**
- See "Fixing Common Issues" section above
- Fix the issues
- Refresh the page

**When all green ✅:**
- Click **"Next: Database Setup →"**

#### **4.3 Step 2: Database Configuration**

Enter your database details:
- **Database Host:** `localhost`
- **Database Port:** `3306`
- **Database Name:** `umrahconnect_db`
- **Database Username:** `umrahconnect_user`
- **Database Password:** (your password)

Click **"Test Connection"**
- ✅ Green = Success → Click **"Next Step"**
- ❌ Red = Check credentials and try again

#### **4.4 Step 3: Application Configuration**

Configure your app:
- **Application Name:** `UmrahConnect`
- **Application URL:** `https://yourdomain.com`
- **Environment:** `production`
- **Debug Mode:** `Disabled`

Click **"Next: Admin Account →"**

#### **4.5 Step 4: Create Admin Account**

Create your admin:
- **Admin Name:** Your full name
- **Admin Email:** admin@yourdomain.com
- **Password:** (strong password, min 8 chars)
- **Confirm Password:** (same password)

Click **"Install Now"**

#### **4.6 Step 5: Installation**

Watch the magic happen! ✨

The installer will:
1. ✅ Create .env file
2. ✅ Generate application keys
3. ✅ Run database migrations
4. ✅ Seed initial data
5. ✅ Create admin account
6. ✅ Set permissions
7. ✅ Finalize installation

**Installation Complete!** 🎉

---

### **Part 5: Post-Installation**

#### **5.1 Delete Installer (IMPORTANT!)**

**For security, delete the install folder:**

**Via cPanel File Manager:**
1. Navigate to `public_html/`
2. Right-click `install/` folder
3. Click **Delete**
4. Confirm deletion

**Via SSH:**
```bash
rm -rf /home/yourusername/public_html/install/
```

#### **5.2 Access Your Site**

**Frontend (Customer Site):**
```
https://yourdomain.com
```

**Admin Dashboard:**
```
https://yourdomain.com/backend/admin
```
- Email: (your admin email)
- Password: (your admin password)

#### **5.3 Configure Your Site**

In Admin Dashboard:

1. **Settings** → Configure site name, logo, contact info
2. **Packages** → Add your first Umrah package
3. **Themes** → Customize appearance
4. **Payments** → Set up Razorpay/Stripe
5. **Email** → Configure SMTP settings

---

## 🎉 **CONGRATULATIONS!**

Your UmrahConnect 2.0 is now live and ready to accept bookings!

---

## 📞 **NEED HELP?**

### **Quick Diagnostic**

Visit: `https://yourdomain.com/install/check.php`

This will show you exactly what's wrong and how to fix it.

### **Support**

- 📧 Email: support@umrahconnect.in
- 📚 Documentation: https://docs.umrahconnect.in
- 🐛 Issues: https://github.com/IamTamheedNazir/umrahconnect-2.0/issues

---

## 🔒 **SECURITY CHECKLIST**

After installation:

- [ ] Delete `install/` folder
- [ ] Change default admin password
- [ ] Set `APP_DEBUG=false` in `.env`
- [ ] Set `APP_ENV=production` in `.env`
- [ ] Enable HTTPS (SSL certificate)
- [ ] Set up regular backups
- [ ] Update `.htaccess` for security headers
- [ ] Configure firewall rules

---

## 🚀 **NEXT STEPS**

1. ✅ Add Umrah packages
2. ✅ Customize theme and branding
3. ✅ Set up payment gateways
4. ✅ Configure email notifications
5. ✅ Test booking flow
6. ✅ Go live and start selling!

---

**Made with ❤️ for easy deployment**

**Happy selling! 🕌**
