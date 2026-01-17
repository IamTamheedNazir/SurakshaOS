# 🕌 UmrahConnect 2.0

**Complete Umrah Booking & Management Platform**

A modern, full-featured platform for managing Umrah bookings, packages, customers, and operations.

---

## ✨ **FEATURES**

- 🎫 **Package Management** - Create and manage Umrah packages
- 👥 **Customer Management** - Track customers and bookings
- 💳 **Payment Integration** - Razorpay, Stripe, PayPal
- 📧 **Email Notifications** - Automated booking confirmations
- 📱 **Responsive Design** - Works on all devices
- 🔐 **Secure Authentication** - JWT-based auth system
- 📊 **Admin Dashboard** - Complete control panel
- 🌍 **Multi-language Support** - English, Arabic, Urdu
- 📈 **Analytics & Reports** - Track bookings and revenue

---

## 🚀 **QUICK START**

### **1. Download & Prepare**

```bash
# Clone repository
git clone https://github.com/IamTamheedNazir/umrahconnect-2.0.git
cd umrahconnect-2.0

# Run automated setup
chmod +x setup.sh
./setup.sh

# Install dependencies
cd backend
composer install --no-dev --optimize-autoloader
```

### **2. Upload to cPanel**

1. Zip the entire folder
2. Upload to `public_html/`
3. Extract files
4. Set permissions (775 for storage and cache)

### **3. Run Installer**

Visit: `https://yourdomain.com/install/`

Follow the 5-step wizard to complete installation.

---

## 📁 **IMPORTANT: FOLDER RENAMING**

After downloading, rename these folders:

```bash
backend-laravel  →  backend
installer        →  install
```

**Automated rename:**
```bash
./setup.sh  # Linux/Mac
setup.bat   # Windows
```

**Manual rename:**
```bash
mv backend-laravel backend
mv installer install
```

See [RENAME_FOLDERS_GUIDE.md](RENAME_FOLDERS_GUIDE.md) for details.

---

## 📚 **DOCUMENTATION**

### **Installation Guides**

- 📖 [**COMPLETE_SETUP_GUIDE.md**](COMPLETE_SETUP_GUIDE.md) - **START HERE!** Complete step-by-step guide
- 📖 [INSTALLATION_GUIDE.md](INSTALLATION_GUIDE.md) - Quick installation guide
- 📖 [RENAME_FOLDERS_GUIDE.md](RENAME_FOLDERS_GUIDE.md) - Folder renaming instructions

### **Deployment**

- 🚀 [CPANEL_DEPLOYMENT_GUIDE.md](CPANEL_DEPLOYMENT_GUIDE.md) - cPanel deployment
- 🚀 [SHARED_HOSTING_SETUP.md](SHARED_HOSTING_SETUP.md) - Shared hosting setup

### **Technical Documentation**

- 🔧 [LARAVEL_BACKEND_COMPLETE.md](LARAVEL_BACKEND_COMPLETE.md) - Backend documentation
- 🗄️ [DATABASE_SCHEMA.md](DATABASE_SCHEMA.md) - Database structure
- 📡 [BACKEND_API_DOCUMENTATION.md](BACKEND_API_DOCUMENTATION.md) - API endpoints

---

## 🔧 **REQUIREMENTS**

### **Server Requirements**

- PHP 8.1 or higher
- MySQL 5.7 or higher
- Composer
- Apache/Nginx web server

### **PHP Extensions**

- PDO, PDO MySQL
- MBString, OpenSSL
- Tokenizer, XML
- CType, JSON, BCMath

---

## 📦 **PROJECT STRUCTURE**

```
umrahconnect-2.0/
├── backend/              ← Laravel backend (rename from backend-laravel)
│   ├── app/
│   ├── config/
│   ├── database/
│   ├── routes/
│   └── ...
├── frontend/             ← React frontend
│   ├── src/
│   ├── public/
│   └── ...
├── install/              ← Installation wizard (rename from installer)
│   ├── index.php
│   ├── install-api.php
│   └── ...
├── database/             ← Database files
│   └── schema.sql
├── setup.sh              ← Automated setup script (Linux/Mac)
├── setup.bat             ← Automated setup script (Windows)
└── README.md             ← This file
```

---

## 🎯 **INSTALLATION STEPS**

### **Step 1: Prepare Files**

```bash
# Download
git clone https://github.com/IamTamheedNazir/umrahconnect-2.0.git
cd umrahconnect-2.0

# Rename folders
./setup.sh  # or setup.bat on Windows

# Install Composer dependencies
cd backend
composer install --no-dev --optimize-autoloader
```

### **Step 2: Upload to Server**

1. Zip the entire folder
2. Upload to cPanel → `public_html/`
3. Extract files
4. Ensure folder structure:
   ```
   public_html/
   ├── backend/
   ├── frontend/
   ├── install/
   └── database/
   ```

### **Step 3: Set Permissions**

```bash
chmod -R 775 backend/storage
chmod -R 775 backend/bootstrap/cache
```

Or via cPanel File Manager:
- Right-click folder → Change Permissions → 775
- Check "Recurse into subdirectories"

### **Step 4: Create Database**

In cPanel → MySQL Databases:
1. Create database: `umrahconnect_db`
2. Create user: `umrahconnect_user`
3. Add user to database with ALL PRIVILEGES

### **Step 5: Run Installer**

Visit: `https://yourdomain.com/install/`

The installer will:
- ✅ Check requirements
- ✅ Configure database
- ✅ Set up application
- ✅ Create admin account
- ✅ Complete installation

### **Step 6: Delete Installer**

**IMPORTANT:** After installation, delete the install folder:

```bash
rm -rf install/
```

Or via cPanel File Manager: Delete `install/` folder

---

## 🔍 **TROUBLESHOOTING**

### **Issue: Composer Dependencies Missing**

**Fix:**
```bash
cd backend
composer install --no-dev --optimize-autoloader
```

Or upload `vendor/` folder manually.

### **Issue: Storage Not Writable**

**Fix:**
```bash
chmod -R 775 backend/storage
chmod -R 775 backend/bootstrap/cache
```

### **Issue: 500 Error**

**Check:**
1. `.env` file exists
2. `APP_KEY` is generated
3. Database credentials are correct
4. Check logs: `backend/storage/logs/laravel.log`

### **Diagnostic Tool**

Visit: `https://yourdomain.com/install/check.php`

This will show you exactly what's wrong and how to fix it.

---

## 🎨 **TECH STACK**

### **Backend**
- Laravel 10.x
- PHP 8.1+
- MySQL
- JWT Authentication

### **Frontend**
- React 18
- Tailwind CSS
- Axios
- React Router

### **Deployment**
- cPanel compatible
- Shared hosting ready
- Easy installation wizard

---

## 📱 **ACCESS POINTS**

After installation:

**Frontend (Customer Site):**
```
https://yourdomain.com
```

**Admin Dashboard:**
```
https://yourdomain.com/backend/admin
```

**API Endpoint:**
```
https://yourdomain.com/backend/api
```

---

## 🔒 **SECURITY**

- JWT-based authentication
- Password hashing (bcrypt)
- CSRF protection
- SQL injection prevention
- XSS protection
- Rate limiting
- Secure session management

---

## 📞 **SUPPORT**

- 📧 Email: support@umrahconnect.in
- 📚 Documentation: https://docs.umrahconnect.in
- 🐛 Issues: https://github.com/IamTamheedNazir/umrahconnect-2.0/issues

---

## 📄 **LICENSE**

This project is proprietary software. All rights reserved.

---

## 🙏 **ACKNOWLEDGMENTS**

Built with:
- Laravel Framework
- React
- Tailwind CSS
- And many other amazing open-source projects

---

## 🎉 **GET STARTED NOW!**

1. **Read:** [COMPLETE_SETUP_GUIDE.md](COMPLETE_SETUP_GUIDE.md)
2. **Download:** Clone this repository
3. **Setup:** Run `./setup.sh`
4. **Upload:** To your cPanel
5. **Install:** Visit `/install/`
6. **Launch:** Start accepting bookings!

---

**Made with ❤️ for Umrah operators worldwide**

**Happy selling! 🕌**
