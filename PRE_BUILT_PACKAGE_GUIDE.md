# 📦 Pre-Built Package Deployment Guide

**Deploy UmrahConnect 2.0 without Composer or npm - Just upload and install!**

---

## 🎉 **WHAT'S INCLUDED**

This pre-built package includes:

✅ **Backend (Laravel)**
- All source code
- **Vendor folder included** (Composer dependencies)
- All migrations and seeders
- Configuration files
- Ready to run!

✅ **Frontend (React)**
- **Production build included** (dist folder)
- Optimized and minified
- All assets compiled
- Ready to serve!

✅ **Installer**
- Web-based installation wizard
- Auto-configuration
- Database setup
- Admin account creation

✅ **Documentation**
- Complete deployment guide
- Troubleshooting tips
- Configuration examples

---

## 📥 **DOWNLOAD THE PACKAGE**

### **Option 1: GitHub Release (Recommended)**

Visit: https://github.com/IamTamheedNazir/umrahconnect-2.0/releases

Download: **UmrahConnect-2.0-Complete-Package.zip**

### **Option 2: Direct Build**

Since GitHub has file size limits, I'll provide instructions to build it yourself:

```bash
# 1. Clone repository
git clone https://github.com/IamTamheedNazir/umrahconnect-2.0.git
cd umrahconnect-2.0

# 2. Rename folders
mv backend-laravel backend
mv installer install

# 3. Install backend dependencies
cd backend
composer install --no-dev --optimize-autoloader
cd ..

# 4. Build frontend
cd frontend
npm install
npm run build
cd ..

# 5. Create package structure
mkdir umrahconnect-complete
cp -r backend umrahconnect-complete/
cp -r frontend/dist/* umrahconnect-complete/
cp -r install umrahconnect-complete/
cp -r database umrahconnect-complete/

# 6. Zip it
cd umrahconnect-complete
zip -r ../umrahconnect-complete.zip .
cd ..

# Done! Upload umrahconnect-complete.zip
```

---

## 🚀 **DEPLOYMENT STEPS**

### **Step 1: Upload Package** (5 minutes)

1. **Login to cPanel**
2. **File Manager** → Navigate to `public_html/`
3. **Upload** the ZIP file
4. **Extract** the ZIP file
5. **Move files** to root if needed

**Your structure should be:**
```
public_html/
├── backend/              ← Laravel backend WITH vendor folder
│   ├── vendor/          ← Composer dependencies (included!)
│   ├── app/
│   ├── config/
│   ├── database/
│   └── ...
├── install/             ← Installation wizard
├── database/            ← Database files
├── index.html           ← Frontend (built)
├── assets/              ← Frontend assets
└── ...
```

---

### **Step 2: Set Permissions** (2 minutes)

**Via cPanel File Manager:**

1. **Navigate to `backend/storage/`**
   - Right-click → Change Permissions
   - Enter: `775`
   - Check: "Recurse into subdirectories"
   - Click: Change Permissions

2. **Navigate to `backend/bootstrap/cache/`**
   - Right-click → Change Permissions
   - Enter: `775`
   - Check: "Recurse into subdirectories"
   - Click: Change Permissions

**Via SSH (if available):**
```bash
chmod -R 775 backend/storage
chmod -R 775 backend/bootstrap/cache
```

---

### **Step 3: Create Database** (3 minutes)

**cPanel → MySQL Databases:**

1. **Create Database:**
   - Database Name: `umrahconnect_db`
   - Click: Create Database

2. **Create User:**
   - Username: `umrahconnect_user`
   - Password: (generate strong password)
   - Click: Create User

3. **Add User to Database:**
   - User: `umrahconnect_user`
   - Database: `umrahconnect_db`
   - Click: Add
   - Privileges: **ALL PRIVILEGES**
   - Click: Make Changes

**💾 IMPORTANT: Save these credentials!**

```
Database Host: localhost
Database Name: umrahconnect_db
Database User: umrahconnect_user
Database Password: [your password]
```

---

### **Step 4: Run Installer** (5 minutes)

Visit: **https://umrahconnect.in/install/**

**Follow the installation wizard:**

#### **Screen 1: Requirements Check**
- ✅ PHP Version (8.1+)
- ✅ PHP Extensions
- ✅ Directory Permissions
- ✅ Composer Dependencies (already installed!)

Click: **Next: Database Setup →**

#### **Screen 2: Database Configuration**
Enter your database credentials:
- **Database Host:** `localhost`
- **Database Port:** `3306`
- **Database Name:** `umrahconnect_db`
- **Database Username:** `umrahconnect_user`
- **Database Password:** [your password]

Click: **Test Connection** (should show green ✅)

Click: **Next: App Configuration →**

#### **Screen 3: Application Configuration**
- **App Name:** `UmrahConnect`
- **App URL:** `https://umrahconnect.in`
- **Environment:** `production`
- **Debug Mode:** `Disabled`

Click: **Next: Admin Account →**

#### **Screen 4: Create Admin Account**
- **Name:** Your name
- **Email:** admin@umrahconnect.in
- **Password:** (strong password)
- **Confirm Password:** (same password)

**💾 IMPORTANT: Save these credentials!**

Click: **Install Now**

#### **Screen 5: Installation Progress**
Watch the installation:
- ✅ Creating .env file
- ✅ Generating app key
- ✅ Running migrations
- ✅ Seeding database
- ✅ Creating admin account
- ✅ Finalizing installation

**Installation Complete!** 🎉

---

### **Step 5: Delete Installer** (1 minute)

**CRITICAL SECURITY STEP:**

After successful installation, **DELETE** the installer folder!

**Via cPanel File Manager:**
1. Navigate to `public_html/`
2. Right-click `install/` folder
3. Click: **Delete**
4. Confirm deletion

**Via SSH:**
```bash
cd public_html
rm -rf install
```

---

### **Step 6: Configure .htaccess** (2 minutes)

**Create/Update `public_html/.htaccess`:**

```apache
<IfModule mod_rewrite.c>
    RewriteEngine On
    
    # Force HTTPS
    RewriteCond %{HTTPS} off
    RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
    
    # API requests to Laravel backend
    RewriteCond %{REQUEST_URI} ^/backend/
    RewriteRule ^backend/(.*)$ backend/public/$1 [L]
    
    # Frontend routing
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteRule ^(.*)$ index.html [L]
</IfModule>

# Security Headers
<IfModule mod_headers.c>
    Header set X-Content-Type-Options "nosniff"
    Header set X-Frame-Options "SAMEORIGIN"
    Header set X-XSS-Protection "1; mode=block"
</IfModule>

# Disable directory browsing
Options -Indexes

# Protect sensitive files
<FilesMatch "^\.">
    Order allow,deny
    Deny from all
</FilesMatch>
```

---

### **Step 7: Test Everything** (5 minutes)

#### **Test Frontend:**
Visit: **https://umrahconnect.in**

You should see:
- ✅ Homepage loads
- ✅ Navigation works
- ✅ Packages page loads
- ✅ Login page accessible

#### **Test Backend API:**
Visit: **https://umrahconnect.in/backend/api/health**

You should see:
```json
{
  "success": true,
  "message": "API is running",
  "timestamp": "2026-01-17 08:30:00"
}
```

#### **Test Admin Dashboard:**
Visit: **https://umrahconnect.in/backend/admin**

Login with your admin credentials.

You should see:
- ✅ Admin dashboard
- ✅ Statistics
- ✅ User management
- ✅ Package management

---

## ✅ **DEPLOYMENT COMPLETE!**

Congratulations! UmrahConnect 2.0 is now live! 🎉

---

## 🎯 **WHAT YOU HAVE NOW**

### **Customer Portal:**
- Browse Umrah packages
- Search and filter
- View package details
- Book packages
- Track bookings
- Manage profile

### **Vendor Dashboard:**
- Create packages
- Manage bookings
- View analytics
- Business settings

### **Admin Panel:**
- User management
- Vendor approval
- Package moderation
- Platform analytics
- CMS management
- PNR inventory system

---

## 🔧 **POST-DEPLOYMENT CONFIGURATION**

### **1. Configure Email (SMTP)**

Edit `backend/.env`:

```env
MAIL_MAILER=smtp
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-password
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=noreply@umrahconnect.in
MAIL_FROM_NAME="UmrahConnect"
```

### **2. Configure Payment Gateways**

**Razorpay:**
```env
RAZORPAY_KEY=your_razorpay_key
RAZORPAY_SECRET=your_razorpay_secret
```

**Stripe:**
```env
STRIPE_KEY=your_stripe_key
STRIPE_SECRET=your_stripe_secret
```

**PayPal:**
```env
PAYPAL_CLIENT_ID=your_paypal_client_id
PAYPAL_SECRET=your_paypal_secret
PAYPAL_MODE=live
```

### **3. Configure Google Services**

```env
GOOGLE_MAPS_API_KEY=your_google_maps_key
GOOGLE_ANALYTICS_ID=your_google_analytics_id
```

### **4. Set Up SSL Certificate**

**cPanel → SSL/TLS:**
1. Install Let's Encrypt SSL (free)
2. Or upload your SSL certificate
3. Force HTTPS (already in .htaccess)

---

## 🔒 **SECURITY CHECKLIST**

After deployment, verify:

- [ ] `APP_DEBUG=false` in `backend/.env`
- [ ] `APP_ENV=production` in `backend/.env`
- [ ] Strong database password
- [ ] Strong admin password
- [ ] Installer folder deleted
- [ ] `.env` files not publicly accessible
- [ ] HTTPS enabled and forced
- [ ] Security headers configured
- [ ] File upload restrictions in place
- [ ] Regular backups configured

---

## 🐛 **TROUBLESHOOTING**

### **Issue: 500 Internal Server Error**

**Check:**
1. `.env` file exists in `backend/`
2. `APP_KEY` is set in `.env`
3. Database credentials are correct
4. Storage permissions are 775

**View logs:**
```
backend/storage/logs/laravel.log
```

---

### **Issue: Frontend shows blank page**

**Check:**
1. Browser console for errors
2. Network tab for failed API calls
3. `.htaccess` is configured correctly
4. `index.html` exists in root

---

### **Issue: API not responding**

**Check:**
1. Backend URL in frontend: `https://umrahconnect.in/backend/api`
2. `.htaccess` rewrite rules
3. Backend logs for errors

**Test API directly:**
```
https://umrahconnect.in/backend/api/health
```

---

### **Issue: Database connection failed**

**Check:**
1. Database exists
2. User has ALL PRIVILEGES
3. Credentials in `.env` are correct
4. Database host is `localhost`

---

### **Issue: Storage not writable**

**Fix permissions:**
```bash
chmod -R 775 backend/storage
chmod -R 775 backend/bootstrap/cache
```

Or via cPanel File Manager (775, recursive)

---

## 📊 **MONITORING & MAINTENANCE**

### **Regular Tasks:**

**Daily:**
- Check error logs
- Monitor bookings
- Review new registrations

**Weekly:**
- Backup database
- Review analytics
- Update content

**Monthly:**
- Update dependencies
- Security audit
- Performance optimization

---

## 🎉 **SUCCESS METRICS**

After deployment, you should see:

- ✅ Frontend loads in < 2 seconds
- ✅ API responds in < 500ms
- ✅ No console errors
- ✅ All pages accessible
- ✅ Login/registration works
- ✅ Booking flow works
- ✅ Admin panel accessible
- ✅ Email notifications sent
- ✅ Payment integration ready

---

## 📞 **SUPPORT**

**Need help?**

1. Check logs: `backend/storage/logs/laravel.log`
2. Check browser console
3. Check network tab
4. Review this guide
5. Check GitHub issues

---

## 🚀 **NEXT STEPS**

After successful deployment:

1. ✅ Add your Umrah packages
2. ✅ Configure payment gateways
3. ✅ Set up email notifications
4. ✅ Customize branding
5. ✅ Add content (About, FAQ, etc.)
6. ✅ Test booking flow
7. ✅ Invite vendors
8. ✅ Launch marketing!

---

## 📋 **QUICK REFERENCE**

### **Important URLs:**
```
Frontend:        https://umrahconnect.in
Backend API:     https://umrahconnect.in/backend/api
Admin Dashboard: https://umrahconnect.in/backend/admin
API Health:      https://umrahconnect.in/backend/api/health
```

### **Important Paths:**
```
Backend:   /home/umrahconnect/public_html/backend
Frontend:  /home/umrahconnect/public_html/
Logs:      /home/umrahconnect/public_html/backend/storage/logs
Uploads:   /home/umrahconnect/public_html/backend/storage/app/public
```

### **Important Files:**
```
Backend Config:  backend/.env
Frontend Config: (built into assets)
Logs:           backend/storage/logs/laravel.log
Database:       (MySQL via cPanel)
```

---

## 💡 **ADVANTAGES OF PRE-BUILT PACKAGE**

✅ **No Composer needed** - Vendor folder included  
✅ **No npm needed** - Frontend already built  
✅ **No commands** - Just upload and install  
✅ **Faster deployment** - No build time  
✅ **Less errors** - Pre-tested and working  
✅ **Beginner friendly** - No technical knowledge needed  

---

## ⏱️ **DEPLOYMENT TIME**

| Step | Time |
|------|------|
| Upload package | 5 min |
| Set permissions | 2 min |
| Create database | 3 min |
| Run installer | 5 min |
| Delete installer | 1 min |
| Configure .htaccess | 2 min |
| Test everything | 5 min |
| **TOTAL** | **23 min** |

---

**Your UmrahConnect 2.0 is ready to go live!** 🚀

**Just upload, install, and launch!** 🎉
