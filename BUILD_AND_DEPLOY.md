# 🚀 UMRAHCONNECT 2.0 - BUILD & DEPLOY GUIDE

**Status:** ✅ ALL FIXES COMPLETE - READY TO BUILD

---

## ⚡ QUICK START (5 MINUTES)

### **Step 1: Pull Latest Fixes**
```powershell
cd C:\Users\tamhe\umrahconnect-2.0
git pull
```

**What this does:**
- ✅ Gets the fixed `api.js` file
- ✅ Gets the fixed `App.jsx` file
- ✅ Removes duplicate page files
- ✅ Updates all configurations

---

### **Step 2: Build Frontend**
```powershell
cd frontend
npm install
npm run build
```

**Expected output:**
```
✓ 12 modules transformed.
✓ built in 2.5s
dist/index.html                   2.1 kB
dist/assets/index-abc123.js     150.2 kB
dist/assets/index-def456.css     45.8 kB
```

**If build fails:** Check the error message and report it

---

### **Step 3: Create Deployment Package**
```powershell
# Copy frontend build to package
Copy-Item -Recurse dist\* ..\umrahconnect-complete\

# Go back to root
cd ..

# Create final ZIP
Compress-Archive -Path "umrahconnect-complete\*" -DestinationPath "umrahconnect-complete.zip" -Force

# Check size (should be 100-150 MB)
Write-Host "Package size:" -ForegroundColor Cyan
(Get-Item umrahconnect-complete.zip).length/1MB
Write-Host "MB" -ForegroundColor Cyan
```

---

### **Step 4: Verify Package Contents**
```powershell
# Check what's in the package
Expand-Archive -Path "umrahconnect-complete.zip" -DestinationPath "temp-check" -Force
dir temp-check
Remove-Item -Recurse -Force temp-check
```

**Should contain:**
- ✅ `backend/` - Laravel backend with vendor folder
- ✅ `install/` - Installation wizard
- ✅ `database/` - SQL files
- ✅ `index.html` - Frontend entry point
- ✅ `assets/` - Frontend JS/CSS
- ✅ `.htaccess` - Apache configuration

---

## 📦 WHAT'S IN THE PACKAGE

### **Backend (backend/)**
- ✅ Laravel 10.x application
- ✅ 65+ API endpoints
- ✅ JWT authentication
- ✅ All controllers, models, migrations
- ✅ Vendor dependencies included
- ✅ `.env.example` template

### **Frontend (root)**
- ✅ Built React application
- ✅ Optimized JS bundles
- ✅ Optimized CSS
- ✅ All assets (images, fonts, etc.)
- ✅ SPA routing configured

### **Installer (install/)**
- ✅ Web-based installation wizard
- ✅ Database setup
- ✅ Environment configuration
- ✅ Admin account creation

### **Database (database/)**
- ✅ SQL schema files
- ✅ Seed data
- ✅ Sample packages

---

## 🌐 DEPLOYMENT TO CPANEL

### **Step 1: Upload Package**
1. Login to cPanel at `https://umrahconnect.in:2083`
2. Go to **File Manager**
3. Navigate to `public_html/`
4. Upload `umrahconnect-complete.zip`
5. Extract the ZIP file
6. Delete the ZIP file

---

### **Step 2: Run Installer**
1. Visit `https://umrahconnect.in/install`
2. Follow the installation wizard:
   - ✅ Check requirements
   - ✅ Configure database
   - ✅ Set up admin account
   - ✅ Configure site settings

---

### **Step 3: Configure Environment**

**Backend (.env):**
```bash
# Navigate to backend folder in File Manager
# Edit backend/.env file

APP_URL=https://umrahconnect.in
FRONTEND_URL=https://umrahconnect.in

DB_CONNECTION=mysql
DB_HOST=localhost
DB_PORT=3306
DB_DATABASE=your_database_name
DB_USERNAME=your_database_user
DB_PASSWORD=your_database_password

# Generate these:
APP_KEY=base64:... (run: php artisan key:generate)
JWT_SECRET=... (run: php artisan jwt:secret)

# Add your payment gateway keys
RAZORPAY_KEY_ID=your_key
RAZORPAY_KEY_SECRET=your_secret

# Configure email
MAIL_MAILER=smtp
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your_email@gmail.com
MAIL_PASSWORD=your_app_password
MAIL_FROM_ADDRESS=noreply@umrahconnect.in
```

---

### **Step 4: Set Permissions**
```bash
# In cPanel Terminal or SSH
cd public_html/backend
chmod -R 775 storage bootstrap/cache
```

---

### **Step 5: Run Migrations**
```bash
# In cPanel Terminal or SSH
cd public_html/backend
php artisan migrate
php artisan db:seed
```

---

### **Step 6: Test Everything**

**Backend API:**
- Visit: `https://umrahconnect.in/backend/api/health`
- Should return: `{"success":true,"message":"API is running"}`

**Frontend:**
- Visit: `https://umrahconnect.in`
- Should load the homepage

**Admin Panel:**
- Visit: `https://umrahconnect.in/login`
- Login with admin credentials
- Check dashboard

---

## 🔧 TROUBLESHOOTING

### **Build Fails**

**Error:** `Could not resolve "./pages/..."`
**Solution:** Make sure you pulled latest changes (`git pull`)

**Error:** `npm ERR! code ELIFECYCLE`
**Solution:** Delete `node_modules` and run `npm install` again

---

### **Frontend Shows Blank Page**

**Check:**
1. Browser console for errors (F12)
2. `.htaccess` file exists in root
3. `index.html` exists in root

**Fix:**
```apache
# Add to .htaccess if missing
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteBase /
    RewriteRule ^index\.html$ - [L]
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteRule . /index.html [L]
</IfModule>
```

---

### **API Not Connecting**

**Check:**
1. Backend `.env` file has correct `APP_URL`
2. Frontend is using correct API URL
3. CORS is configured in `backend/config/cors.php`

**Test API:**
```bash
curl https://umrahconnect.in/backend/api/health
```

---

### **500 Internal Server Error**

**Check:**
1. `storage/` and `bootstrap/cache/` permissions (775)
2. `.env` file exists and is configured
3. `APP_KEY` is generated
4. Database credentials are correct

**View Logs:**
```bash
tail -f backend/storage/logs/laravel.log
```

---

## 📊 POST-DEPLOYMENT CHECKLIST

### **Functionality Testing**

- [ ] Homepage loads
- [ ] Packages page shows packages
- [ ] Package detail page works
- [ ] User registration works
- [ ] User login works
- [ ] User dashboard loads
- [ ] Booking creation works
- [ ] Payment integration works
- [ ] Email notifications work
- [ ] Vendor dashboard works
- [ ] Admin dashboard works

### **Security**

- [ ] HTTPS is enabled
- [ ] SSL certificate is valid
- [ ] `.env` files are not publicly accessible
- [ ] Database credentials are secure
- [ ] Admin password is strong

### **Performance**

- [ ] Page load time < 3 seconds
- [ ] Images are optimized
- [ ] Caching is enabled
- [ ] Gzip compression is enabled

---

## 🎯 WHAT WAS FIXED

### **Critical Fixes Applied:**

1. ✅ **Frontend API Service**
   - Changed `process.env.REACT_APP_API_URL` to `import.meta.env.VITE_API_URL`
   - Changed default URL from `localhost:5000` to `localhost:8000`
   - Changed timeout to use environment variable

2. ✅ **Duplicate Files**
   - Removed 17 duplicate `.js` files
   - Kept only `.jsx` versions

3. ✅ **Import Paths**
   - Fixed `App.jsx` imports to use correct paths
   - Updated to use `.jsx` extensions

4. ✅ **Configuration**
   - Verified CORS configuration
   - Verified environment variables
   - Verified API endpoint mapping

---

## 📞 SUPPORT

**If you encounter issues:**

1. Check `DEEP_AUDIT_REPORT.md` for detailed analysis
2. Check `FRONTEND_BACKEND_CONNECTION_FIX.md` for connection issues
3. Check Laravel logs: `backend/storage/logs/laravel.log`
4. Check browser console (F12) for frontend errors

---

## 🎉 SUCCESS INDICATORS

**You'll know it's working when:**

1. ✅ Frontend loads at `https://umrahconnect.in`
2. ✅ API responds at `https://umrahconnect.in/backend/api/health`
3. ✅ You can register a new user
4. ✅ You can login
5. ✅ You can view packages
6. ✅ You can create a booking
7. ✅ Admin panel is accessible

---

**🚀 READY TO BUILD AND DEPLOY!**

**Estimated Time:**
- Build: 5 minutes
- Upload: 10 minutes
- Configure: 10 minutes
- Test: 10 minutes
- **Total: ~35 minutes**

---

**Last Updated:** January 23, 2026  
**Status:** ✅ ALL SYSTEMS GO
