# 🎨 FRONTEND DEPLOYMENT - Step-by-Step Guide

## 📋 PREREQUISITES

Before starting:
- ✅ Backend is deployed and working (Test: https://umrahconnect.in/backend/api/health)
- ✅ Node.js and npm installed on your local machine
- ✅ cPanel access to umrahconnect.in

---

## 🎯 DEPLOYMENT STEPS

### **STEP 1: Update Environment Configuration**

#### **On Your Local Machine:**

1. **Navigate to frontend folder:**
```bash
cd frontend
```

2. **Create .env file:**

Create a file named `.env` in the `frontend` folder with this content:

```env
# API Configuration - LARAVEL BACKEND
VITE_API_URL=https://umrahconnect.in/backend/api
VITE_API_TIMEOUT=30000

# App Configuration
VITE_APP_NAME=UmrahConnect
VITE_APP_VERSION=2.0.0
VITE_APP_ENV=production

# Features
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_CHAT=false

# Payment Gateway (Replace with your actual keys)
VITE_RAZORPAY_KEY=your_razorpay_key_here
VITE_STRIPE_PUBLIC_KEY=your_stripe_public_key_here

# Google Services (Optional)
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
VITE_GOOGLE_ANALYTICS_ID=your_google_analytics_id_here

# File Upload
VITE_MAX_FILE_SIZE=5242880
VITE_ALLOWED_FILE_TYPES=image/jpeg,image/png,image/jpg,application/pdf

# Pagination
VITE_DEFAULT_PAGE_SIZE=12
VITE_MAX_PAGE_SIZE=50

# Cache
VITE_CACHE_DURATION=3600000

# Debug
VITE_DEBUG_MODE=false
VITE_SHOW_CONSOLE_LOGS=false
```

**IMPORTANT:** The key line is:
```env
VITE_API_URL=https://umrahconnect.in/backend/api
```

This tells the frontend to use the Laravel backend instead of Node.js.

---

### **STEP 2: Install Dependencies**

```bash
npm install
```

**Expected output:**
```
added XXX packages in XXs
```

---

### **STEP 3: Build Frontend for Production**

```bash
npm run build
```

**Expected output:**
```
vite v4.x.x building for production...
✓ XXX modules transformed.
dist/index.html                  X.XX kB
dist/assets/index-XXXXX.css     XX.XX kB
dist/assets/index-XXXXX.js     XXX.XX kB
✓ built in XXs
```

This creates a `dist` folder with optimized production files.

---

### **STEP 4: Prepare Files for Upload**

#### **What's in the dist folder:**

```
dist/
├── index.html
├── assets/
│   ├── index-XXXXX.css
│   ├── index-XXXXX.js
│   └── [other assets]
├── images/
└── [other static files]
```

#### **Create ZIP (Optional):**

For easier upload, you can zip the dist folder:
```bash
cd dist
zip -r frontend-dist.zip .
```

---

### **STEP 5: Backup Current Frontend (Important!)**

#### **Via cPanel File Manager:**

1. **Login to cPanel**
2. **Go to File Manager**
3. **Navigate to public_html**
4. **Create backup folder:**
   - Click **+ Folder**
   - Name: `backup-frontend-old`
   - Click **Create**

5. **Move old files to backup:**
   - Select all files EXCEPT:
     - `backend` folder
     - `.htaccess` file
     - `backup-frontend-old` folder
   - Click **Move**
   - Destination: `public_html/backup-frontend-old`
   - Click **Move Files**

**Now public_html should only have:**
- `backend/` folder
- `.htaccess` file
- `backup-frontend-old/` folder

---

### **STEP 6: Upload New Frontend**

#### **Option A: Via cPanel File Manager (Recommended)**

1. **Navigate to public_html**

2. **Upload files:**
   - Click **Upload** button
   - Select all files from `frontend/dist` folder
   - OR upload `frontend-dist.zip` if you created it
   - Wait for upload to complete

3. **If uploaded ZIP:**
   - Right-click on `frontend-dist.zip`
   - Click **Extract**
   - Extract to: `public_html`
   - Click **Extract Files**
   - Delete `frontend-dist.zip` after extraction

4. **Verify structure:**
```
public_html/
├── index.html          ← Frontend
├── assets/             ← Frontend assets
├── images/             ← Frontend images
├── .htaccess          ← Keep existing
└── backend/           ← Keep existing
```

#### **Option B: Via FTP**

1. **Connect to your server via FTP:**
   - Host: `ftp.umrahconnect.in`
   - Username: Your cPanel username
   - Password: Your cPanel password
   - Port: 21

2. **Navigate to public_html**

3. **Upload all files from frontend/dist:**
   - Drag and drop all files
   - Overwrite if prompted

---

### **STEP 7: Verify .htaccess File**

Make sure `public_html/.htaccess` exists and contains:

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

# Enable CORS for API
<IfModule mod_headers.c>
    Header set Access-Control-Allow-Origin "*"
    Header set Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS"
    Header set Access-Control-Allow-Headers "Content-Type, Authorization, X-Requested-With"
</IfModule>
```

**If it doesn't exist or is different:**
1. Create/edit `public_html/.htaccess`
2. Paste the above content
3. Save

---

### **STEP 8: Test Frontend**

#### **Test 1: Website Loads**

Visit: **https://umrahconnect.in**

✅ **Expected:** Website loads without "Backend API Not Running" error

❌ **If you still see the error:**
- Clear browser cache (Ctrl+Shift+Delete)
- Try incognito/private mode
- Check browser console (F12) for errors

---

#### **Test 2: Check API Calls**

1. **Open browser console (F12)**
2. **Go to Network tab**
3. **Refresh the page**
4. **Look for API calls**

✅ **Expected:** API calls go to `https://umrahconnect.in/backend/api`

❌ **If calls go to `localhost:5000`:**
- Frontend wasn't rebuilt with new .env
- Rebuild and re-upload

---

#### **Test 3: Test Login**

1. **Click Login/Register**
2. **Try to login with:**
   - Email: `admin@umrahconnect.in`
   - Password: `admin123`

✅ **Expected:** Login successful, redirected to dashboard

❌ **If login fails:**
- Check browser console for errors
- Check Network tab for API response
- Verify backend is working

---

### **STEP 9: Configure Payment Gateways (Optional)**

If you want to enable payments:

#### **Update Backend .env:**

Edit `backend/.env`:
```env
RAZORPAY_KEY_ID=your_actual_razorpay_key
RAZORPAY_KEY_SECRET=your_actual_razorpay_secret

STRIPE_KEY=your_actual_stripe_key
STRIPE_SECRET=your_actual_stripe_secret
```

#### **Update Frontend .env and Rebuild:**

Edit `frontend/.env`:
```env
VITE_RAZORPAY_KEY=your_actual_razorpay_key
VITE_STRIPE_PUBLIC_KEY=your_actual_stripe_public_key
```

Then rebuild and re-upload:
```bash
npm run build
# Upload dist folder again
```

---

### **STEP 10: Enable SSL (If Not Already)**

#### **Via cPanel:**

1. **Go to SSL/TLS Status**
2. **Find umrahconnect.in**
3. **Click "Run AutoSSL"**
4. **Wait for completion**

✅ **Your site should now be on HTTPS**

---

## ✅ FRONTEND DEPLOYMENT COMPLETE!

### **What You've Accomplished:**

✅ Updated frontend configuration for Laravel backend  
✅ Built production-optimized frontend  
✅ Backed up old frontend  
✅ Uploaded new frontend to cPanel  
✅ Verified .htaccess configuration  
✅ Tested website loads correctly  
✅ Verified API calls work  
✅ Tested login functionality  

---

## 🎉 COMPLETE DEPLOYMENT SUCCESS!

### **Your Website is Now Live:**

🌐 **Website:** https://umrahconnect.in  
🔌 **Backend API:** https://umrahconnect.in/backend/api  
✅ **Status:** Fully Functional  

### **Test Accounts:**

**Admin:**
- Email: `admin@umrahconnect.in`
- Password: `admin123`

**Vendor:**
- Email: `vendor@umrahconnect.in`
- Password: `vendor123`

**Customer:**
- Email: `customer@umrahconnect.in`
- Password: `customer123`

**⚠️ IMPORTANT:** Change these passwords immediately after first login!

---

## 🔍 VERIFICATION CHECKLIST

After deployment, verify:

- [ ] Website loads: https://umrahconnect.in
- [ ] No "Backend API Not Running" error
- [ ] Backend health check works: https://umrahconnect.in/backend/api/health
- [ ] Login works
- [ ] Register works
- [ ] Browse packages works
- [ ] No CORS errors in console
- [ ] All pages load correctly
- [ ] Images load correctly
- [ ] Navigation works

---

## 🚀 NEXT STEPS

### **1. Change Default Passwords**

Login and change passwords for:
- Admin account
- Vendor account
- Customer account

### **2. Configure Payment Gateways**

Add your actual payment gateway keys:
- Razorpay
- Stripe
- PayPal

### **3. Configure Email**

Update backend `.env` with your SMTP details:
```env
MAIL_HOST=smtp.gmail.com
MAIL_USERNAME=your_email@gmail.com
MAIL_PASSWORD=your_app_password
```

### **4. Add Content**

- Create real packages
- Add vendor profiles
- Upload images
- Configure settings

### **5. Test Everything**

- Create test bookings
- Test payments
- Test email notifications
- Test all features

---

## 🔧 TROUBLESHOOTING

### **Issue: Still seeing "Backend API Not Running"**

**Solution:**
1. Clear browser cache completely
2. Try incognito/private mode
3. Check browser console for actual API URL being called
4. Verify .env file has correct API URL
5. Rebuild frontend if needed

### **Issue: CORS Error**

**Solution:**
1. Check backend `config/cors.php`
2. Verify `FRONTEND_URL` in backend `.env`
3. Clear backend cache: `php artisan config:clear`

### **Issue: 404 on API Calls**

**Solution:**
1. Verify .htaccess files are in place
2. Check backend is accessible: https://umrahconnect.in/backend/api/health
3. Verify file permissions

### **Issue: Images Not Loading**

**Solution:**
1. Check image paths in code
2. Verify images uploaded to correct location
3. Check file permissions

---

## 📞 NEED HELP?

If you encounter issues:
1. Check browser console (F12)
2. Check Network tab for failed requests
3. Check backend logs: `backend/storage/logs/laravel.log`
4. Let me know the specific error message

---

## 🎊 CONGRATULATIONS!

Your complete UmrahConnect 2.0 platform is now live with:

✅ **Laravel Backend** - Complete API system  
✅ **React Frontend** - Modern user interface  
✅ **PNR Inventory System** - Flight management  
✅ **Payment Integration** - Multiple gateways  
✅ **Booking System** - Complete workflow  
✅ **Admin Panel** - Full control  
✅ **Vendor Dashboard** - Business management  

**Total Features:** 65+ API endpoints, 10 database tables, complete booking platform!

---

**🚀 Your platform is ready for business!** 🚀
