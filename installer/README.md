# 🎨 UmrahConnect 2.0 - Dynamic Installer

Beautiful, user-friendly installation wizard for easy cPanel deployment.

---

## ✨ **FEATURES**

- 🎨 **Beautiful UI** - Modern, gradient design
- ✅ **Auto Requirements Check** - Validates PHP, extensions, permissions
- 🗄️ **Database Testing** - Tests connection before proceeding
- ⚙️ **Smart Configuration** - Auto-generates .env file
- 🔑 **Key Generation** - Auto-generates APP_KEY and JWT_SECRET
- 📦 **Auto Migration** - Runs database migrations automatically
- 🌱 **Auto Seeding** - Seeds initial data
- 👤 **Admin Creation** - Creates admin account during install
- 🔒 **Security** - Creates lock file to prevent reinstallation

---

## 🚀 **USAGE**

### **Step 1: Upload Files**

Upload the entire project to your cPanel `public_html/` directory:
```
public_html/
├── backend/          (Laravel backend)
├── frontend/         (React frontend)
├── installer/        (This installer)
└── database/         (Database files)
```

### **Step 2: Install Composer Dependencies**

**Via SSH:**
```bash
cd public_html/backend
composer install --no-dev --optimize-autoloader
```

**Or upload vendor folder** if no SSH access.

### **Step 3: Run Installer**

Visit: `https://yourdomain.com/installer/`

Follow the 5-step wizard:
1. ✅ Requirements Check
2. 🗄️ Database Configuration
3. ⚙️ Application Configuration
4. 👤 Admin Account Creation
5. 🚀 Installation

### **Step 4: Delete Installer**

**IMPORTANT:** After successful installation, delete the installer folder:

```bash
rm -rf public_html/installer/
```

Or via cPanel File Manager: Delete `installer/` folder

---

## 📋 **REQUIREMENTS**

### **Server Requirements:**
- PHP 8.1 or higher
- MySQL 5.7 or higher
- Composer (or vendor folder uploaded)

### **Required PHP Extensions:**
- PDO
- PDO MySQL
- MBString
- OpenSSL
- Tokenizer
- XML
- CType
- JSON
- BCMath

### **Directory Permissions:**
- `backend/storage/` - 755 (writable)
- `backend/bootstrap/cache/` - 755 (writable)

---

## 🔧 **HOW IT WORKS**

### **Frontend (index.php)**

Beautiful step-by-step wizard interface:
- Modern gradient design
- Progress bar
- Real-time validation
- Loading animations
- Success/error messages

### **Backend (install-api.php)**

Handles all installation operations:

#### **API Endpoints:**

**1. Check Requirements**
```
GET /installer/install-api.php?action=check_requirements
```
Returns: PHP version, extensions, permissions status

**2. Test Database**
```
POST /installer/install-api.php?action=test_database
```
Body: Database credentials
Returns: Connection success/failure

**3. Create .env File**
```
POST /installer/install-api.php?action=create_env
```
Body: All configuration data
Returns: Success/failure

**4. Generate Keys**
```
POST /installer/install-api.php?action=generate_key
```
Returns: APP_KEY and JWT_SECRET generated

**5. Run Migrations**
```
POST /installer/install-api.php?action=run_migrations
```
Returns: Migration status

**6. Seed Database**
```
POST /installer/install-api.php?action=seed_database
```
Returns: Seeding status

**7. Create Admin**
```
POST /installer/install-api.php?action=create_admin
```
Body: Admin credentials
Returns: Admin creation status

**8. Set Permissions**
```
POST /installer/install-api.php?action=set_permissions
```
Returns: Permission setting status

**9. Finalize**
```
POST /installer/install-api.php?action=finalize
```
Returns: Final setup status, creates lock file

---

## 🎨 **CUSTOMIZATION**

### **Change Colors**

Edit `index.php` CSS:

```css
/* Primary gradient */
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);

/* Change to your brand colors */
background: linear-gradient(135deg, #YOUR_COLOR_1 0%, #YOUR_COLOR_2 100%);
```

### **Change Logo**

Add your logo in the header section:

```html
<div class="header">
    <img src="your-logo.png" alt="Logo" style="max-width: 200px;">
    <h1>🕌 Your Brand Name</h1>
    <p>Installation Wizard</p>
</div>
```

### **Add Custom Steps**

Add new steps in `index.php`:

```html
<!-- Step 6: Your Custom Step -->
<div class="step" id="step6">
    <h2>Custom Configuration</h2>
    <!-- Your custom form fields -->
</div>
```

Update `totalSteps` variable:
```javascript
const totalSteps = 6; // Changed from 5 to 6
```

---

## 🔒 **SECURITY FEATURES**

### **1. Installation Lock**

After successful installation, creates `.installed` file:
```
installer/.installed
```

Prevents reinstallation. To reinstall, delete this file.

### **2. Input Validation**

All inputs are validated:
- Database credentials tested before proceeding
- Password strength requirements
- Email format validation
- Required fields checked

### **3. Error Handling**

Comprehensive error handling:
- Database connection errors
- File permission errors
- Migration errors
- Seeding errors

### **4. Secure Password Storage**

Admin passwords are:
- Hashed using bcrypt
- Never stored in plain text
- Minimum 8 characters required

---

## 🐛 **TROUBLESHOOTING**

### **Issue: Requirements Check Fails**

**Solution:**
1. Check PHP version: `php -v`
2. Check extensions: `php -m`
3. Install missing extensions via cPanel or SSH
4. Set directory permissions to 755

### **Issue: Database Connection Fails**

**Solution:**
1. Verify database exists in cPanel
2. Verify user has access to database
3. Check DB_HOST (usually `localhost`)
4. Check DB_PORT (usually `3306`)
5. Verify credentials are correct

### **Issue: Migration Fails**

**Solution:**
1. Check database user has CREATE TABLE privileges
2. Check database is empty (or use fresh database)
3. Check Laravel logs: `backend/storage/logs/laravel.log`

### **Issue: Permission Errors**

**Solution:**
```bash
chmod -R 755 backend/storage
chmod -R 755 backend/bootstrap/cache
```

### **Issue: Composer Dependencies Missing**

**Solution:**
1. Run `composer install` in backend directory
2. Or upload `vendor/` folder from local machine

---

## 📝 **DEVELOPMENT**

### **Testing Locally**

1. Set up local environment (XAMPP, MAMP, etc.)
2. Create database
3. Navigate to: `http://localhost/installer/`
4. Follow wizard

### **Debugging**

Enable error display in `install-api.php`:

```php
error_reporting(E_ALL);
ini_set('display_errors', 1);
```

Check browser console for JavaScript errors.

---

## 🎯 **BEST PRACTICES**

1. ✅ **Always delete installer after installation**
2. ✅ **Use strong admin password**
3. ✅ **Test on staging before production**
4. ✅ **Backup database before reinstalling**
5. ✅ **Keep installer updated with main app**

---

## 📦 **FILES**

```
installer/
├── index.php           (Frontend wizard)
├── install-api.php     (Backend API)
├── README.md           (This file)
└── .installed          (Created after installation)
```

---

## 🚀 **FUTURE ENHANCEMENTS**

Planned features:
- [ ] Multi-language support
- [ ] Dark mode theme
- [ ] Installation progress export
- [ ] Rollback functionality
- [ ] Pre-installation system check
- [ ] One-click demo data import
- [ ] Email configuration wizard
- [ ] Payment gateway setup wizard

---

## 📞 **SUPPORT**

Need help with the installer?

- 📧 Email: support@umrahconnect.in
- 📚 Documentation: https://docs.umrahconnect.in
- 🐛 Report Issues: https://github.com/IamTamheedNazir/umrahconnect-2.0/issues

---

## 📄 **LICENSE**

This installer is part of UmrahConnect 2.0 and follows the same license.

---

**Made with ❤️ for easy deployment**
