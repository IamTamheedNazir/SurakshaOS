# 🚀 UmrahConnect 2.0 - One-Click Installation Guide

## 📋 **EASY INSTALLATION LIKE CODECANYON**

Install UmrahConnect 2.0 in just 5 minutes with our beautiful installation wizard!

---

## 🎯 **INSTALLATION METHODS**

### **Method 1: One-Click Installer (Recommended)** ⭐
- Beautiful installation wizard
- Automatic database setup
- No technical knowledge required
- Takes 5 minutes

### **Method 2: Manual Installation**
- For advanced users
- Full control over setup
- Takes 15-20 minutes

---

## 🚀 **METHOD 1: ONE-CLICK INSTALLER**

### **Step 1: Download & Extract**

1. **Download** the UmrahConnect 2.0 package
2. **Extract** the ZIP file
3. You'll see this structure:
```
umrahconnect-2.0/
├── frontend/          (React application)
├── backend/           (Node.js API)
├── install/           (Installation wizard)
├── docs/              (Documentation)
└── README.md
```

### **Step 2: Upload to Server**

#### **Option A: cPanel File Manager**
1. Login to cPanel
2. Go to **File Manager**
3. Navigate to `public_html`
4. Upload the ZIP file
5. Click **Extract**
6. Move all files from extracted folder to `public_html`

#### **Option B: FTP (FileZilla)**
1. Connect to your server via FTP
2. Navigate to `public_html` or `www` folder
3. Upload all extracted files
4. Wait for upload to complete

### **Step 3: Set Permissions**

Set these folder permissions to **755**:
```
public_html/
├── storage/           (755)
├── public/            (755)
├── uploads/           (755)
└── install/           (755)
```

**Via cPanel:**
- Right-click folder → Change Permissions → Set to 755

**Via FTP:**
- Right-click folder → File Permissions → Set to 755

### **Step 4: Create Database**

1. **cPanel → MySQL Databases**
2. **Create Database:**
   - Database Name: `umrahconnect`
   - Click "Create Database"

3. **Create User:**
   - Username: `umrah_admin`
   - Password: (generate strong password)
   - Click "Create User"

4. **Add User to Database:**
   - Select user: `umrah_admin`
   - Select database: `umrahconnect`
   - Check "ALL PRIVILEGES"
   - Click "Add"

**Save these details - you'll need them!**

### **Step 5: Run Installation Wizard**

1. **Open your browser**
2. **Navigate to:** `https://yourdomain.com/install`
3. **Follow the 5-step wizard:**

#### **Step 1: Requirements Check** ✅
- System automatically checks requirements
- All items should show green checkmarks
- Click "Next Step"

#### **Step 2: Database Configuration** 🗄️
Fill in your database details:
- **Database Type:** MySQL (or PostgreSQL)
- **Database Host:** localhost
- **Database Port:** 3306
- **Database Name:** umrahconnect
- **Database Username:** umrah_admin
- **Database Password:** (your password)

Click **"Test Connection"** to verify
- ✅ Green = Success, click "Next Step"
- ❌ Red = Check your details

#### **Step 3: Application Configuration** ⚙️
Configure your application:
- **Application Name:** UmrahConnect
- **Application URL:** https://yourdomain.com
- **API URL:** https://yourdomain.com/api
- **Default Currency:** INR (or your choice)
- **Default Language:** English
- **Timezone:** Asia/Kolkata (or your timezone)

Click "Next Step"

#### **Step 4: Admin Account** 👤
Create your admin account:
- **First Name:** Your first name
- **Last Name:** Your last name
- **Email:** admin@yourdomain.com
- **Password:** (strong password, min 8 characters)
- **Confirm Password:** (same password)

Click **"Install Now"**

#### **Step 5: Installation** 🎉
Watch the magic happen:
- Creating database tables... ✓
- Running migrations... ✓
- Seeding initial data... ✓
- Creating admin account... ✓
- Configuring application... ✓
- Setting up file permissions... ✓
- Finalizing installation... ✓

**Installation Complete!** 🎊

### **Step 6: Security (IMPORTANT!)** 🔒

**Delete the install folder:**
```bash
# Via cPanel File Manager
Delete: public_html/install/

# Via FTP
Delete: /public_html/install/

# Via SSH
rm -rf /path/to/public_html/install/
```

**Why?** For security - prevents unauthorized reinstallation.

### **Step 7: Access Your Site** 🌐

**Frontend (Customer Site):**
- URL: `https://yourdomain.com`
- Browse packages, make bookings

**Admin Dashboard:**
- URL: `https://yourdomain.com/admin`
- Email: (your admin email)
- Password: (your admin password)

**Vendor Dashboard:**
- URL: `https://yourdomain.com/vendor`
- Create vendor account from admin

---

## 🎯 **POST-INSTALLATION SETUP**

### **1. Configure Email (SMTP)**

Admin Dashboard → Settings → Email Settings
```
SMTP Host: smtp.gmail.com
SMTP Port: 587
SMTP User: your-email@gmail.com
SMTP Password: your-app-password
From Name: UmrahConnect
From Email: noreply@yourdomain.com
```

**Gmail Setup:**
1. Enable 2-Factor Authentication
2. Generate App Password
3. Use App Password in SMTP settings

### **2. Configure Payment Gateways**

Admin Dashboard → Settings → Payment Gateways

**Razorpay:**
```
Key ID: rzp_test_xxxxx
Key Secret: xxxxx
Mode: Test (change to Live later)
```

**Stripe:**
```
Publishable Key: pk_test_xxxxx
Secret Key: sk_test_xxxxx
Mode: Test (change to Live later)
```

**PayPal:**
```
Client ID: xxxxx
Client Secret: xxxxx
Mode: Sandbox (change to Live later)
```

### **3. Configure SMS/WhatsApp**

Admin Dashboard → Settings → Notifications

**Twilio (SMS/WhatsApp):**
```
Account SID: ACxxxxx
Auth Token: xxxxx
Phone Number: +1234567890
WhatsApp Number: +1234567890
```

**MSG91 (SMS):**
```
Auth Key: xxxxx
Sender ID: UMRAHC
```

### **4. Configure Cloud Storage**

Admin Dashboard → Settings → Storage

**AWS S3:**
```
Access Key: xxxxx
Secret Key: xxxxx
Bucket: umrahconnect-uploads
Region: us-east-1
```

**Cloudinary:**
```
Cloud Name: xxxxx
API Key: xxxxx
API Secret: xxxxx
```

### **5. Setup SSL Certificate**

**Via cPanel:**
1. cPanel → SSL/TLS Status
2. Enable AutoSSL (free Let's Encrypt)
3. Wait for certificate to be issued

**Via Cloudflare (Free):**
1. Add your domain to Cloudflare
2. Update nameservers
3. Enable SSL (Full)
4. Enable "Always Use HTTPS"

### **6. Configure Cron Jobs**

cPanel → Cron Jobs

**Add these cron jobs:**

```bash
# Update exchange rates (daily at 2 AM)
0 2 * * * cd /path/to/public_html && php artisan currency:update

# Process subscription renewals (daily at 3 AM)
0 3 * * * cd /path/to/public_html && php artisan subscriptions:renew

# Send booking reminders (daily at 9 AM)
0 9 * * * cd /path/to/public_html && php artisan bookings:remind

# Process commission payouts (1st of month at 1 AM)
0 1 1 * * cd /path/to/public_html && php artisan commissions:payout
```

---

## 🔧 **TROUBLESHOOTING**

### **Issue 1: Installation Page Not Loading**

**Solution:**
```bash
# Check .htaccess exists in public_html
# Add this if missing:
RewriteEngine On
RewriteBase /
RewriteRule ^index\.php$ - [L]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.php [L]
```

### **Issue 2: Database Connection Failed**

**Check:**
- Database name is correct
- Username has privileges
- Password is correct
- Host is 'localhost' (not 127.0.0.1)

**Test connection:**
```bash
mysql -u umrah_admin -p umrahconnect
# Enter password when prompted
```

### **Issue 3: 500 Internal Server Error**

**Solutions:**
1. Check file permissions (755 for folders, 644 for files)
2. Check .htaccess syntax
3. Enable error display:
```php
// Add to index.php temporarily
ini_set('display_errors', 1);
error_reporting(E_ALL);
```
4. Check error logs:
```bash
# cPanel → Errors → Error Log
# Or check: /home/username/logs/error_log
```

### **Issue 4: Blank Page After Installation**

**Solutions:**
1. Clear browser cache
2. Check if .env file was created
3. Check storage folder permissions
4. Regenerate application key:
```bash
php artisan key:generate
```

### **Issue 5: Images Not Uploading**

**Solutions:**
1. Check uploads folder permissions (755)
2. Check PHP upload limits:
```php
// php.ini
upload_max_filesize = 10M
post_max_size = 10M
```
3. Restart web server

---

## 📊 **SYSTEM REQUIREMENTS**

### **Minimum Requirements:**
- PHP 7.4 or higher
- MySQL 5.7+ or PostgreSQL 12+
- Node.js 14+ (for backend API)
- 512 MB RAM
- 1 GB Disk Space
- cURL, OpenSSL, PDO extensions

### **Recommended Requirements:**
- PHP 8.1 or higher
- MySQL 8.0+ or PostgreSQL 14+
- Node.js 18+
- 2 GB RAM
- 5 GB Disk Space
- SSD Storage
- SSL Certificate

---

## 🎯 **QUICK START CHECKLIST**

After installation, complete these tasks:

### **Immediate (Day 1):**
- [ ] Delete install folder
- [ ] Change admin password
- [ ] Configure email (SMTP)
- [ ] Setup SSL certificate
- [ ] Test email sending
- [ ] Create test booking

### **Within Week 1:**
- [ ] Configure payment gateways (test mode)
- [ ] Setup SMS/WhatsApp
- [ ] Configure cloud storage
- [ ] Add currencies
- [ ] Add languages
- [ ] Create vendor accounts
- [ ] Add sample packages

### **Before Going Live:**
- [ ] Test all features
- [ ] Switch payment gateways to live mode
- [ ] Setup backup system
- [ ] Configure cron jobs
- [ ] Setup monitoring
- [ ] Test on mobile devices
- [ ] Create documentation for team

---

## 🌟 **FEATURES AVAILABLE AFTER INSTALLATION**

### **Customer Features:**
✅ Browse packages
✅ Search & filter
✅ Book packages
✅ Multiple payment options
✅ Track bookings
✅ Upload documents
✅ Submit reviews
✅ Support tickets

### **Vendor Features:**
✅ Vendor dashboard
✅ Package management
✅ Booking management
✅ Customer management
✅ Payment tracking
✅ Commission tracking
✅ Reports & analytics

### **Admin Features:**
✅ Complete admin dashboard
✅ User management
✅ Vendor management
✅ Package management
✅ Booking management
✅ Payment management
✅ Commission management
✅ Subscription management
✅ Advertisement management
✅ Email templates
✅ SMS/WhatsApp settings
✅ Currency settings
✅ Language settings
✅ Referral & loyalty
✅ Support tickets
✅ Reports & analytics

---

## 📞 **SUPPORT**

### **Need Help?**

**Documentation:**
- Installation Guide: `/docs/INSTALLATION.md`
- User Guide: `/docs/USER_GUIDE.md`
- Admin Guide: `/docs/ADMIN_GUIDE.md`
- API Documentation: `/docs/API.md`

**Contact:**
- Email: support@umrahconnect.com
- Website: https://umrahconnect.com
- GitHub: https://github.com/IamTamheedNazir/umrahconnect-2.0

**Community:**
- Discord: (coming soon)
- Forum: (coming soon)

---

## 🎉 **CONGRATULATIONS!**

**Your UmrahConnect 2.0 platform is now live!** 🚀

**Next Steps:**
1. Explore the admin dashboard
2. Create your first package
3. Test the booking process
4. Invite vendors
5. Start marketing!

**Welcome to the future of Umrah travel booking!** 🕌✨

---

**Built with ❤️ for UmrahConnect 2.0**
**Version 3.0 - Installation Edition**
