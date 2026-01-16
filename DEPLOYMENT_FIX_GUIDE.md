# 🔧 DEPLOYMENT FIX GUIDE - Laravel Backend Integration

## ⚠️ ISSUE: "Backend API Not Running"

Your frontend is trying to connect to the **old Node.js backend** (`http://localhost:5000`), but we've built a **new Laravel backend** to replace it.

---

## 🎯 SOLUTION: Update Frontend to Use Laravel Backend

### **Step 1: Update Frontend Environment Variables**

#### **On Your Local Machine:**

1. Navigate to the frontend folder:
```bash
cd frontend
```

2. Create a `.env` file (copy from `.env.production`):
```bash
cp .env.production .env
```

3. Edit `.env` and update the API URL:
```env
VITE_API_URL=https://umrahconnect.in/backend/api
```

#### **Or Manually Create `.env` File:**

Create `frontend/.env` with this content:
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

# Payment Gateway (Replace with actual keys)
VITE_RAZORPAY_KEY=your_razorpay_key_here
VITE_STRIPE_PUBLIC_KEY=your_stripe_public_key_here

# File Upload
VITE_MAX_FILE_SIZE=5242880
VITE_ALLOWED_FILE_TYPES=image/jpeg,image/png,image/jpg,application/pdf

# Pagination
VITE_DEFAULT_PAGE_SIZE=12
VITE_MAX_PAGE_SIZE=50

# Debug
VITE_DEBUG_MODE=false
VITE_SHOW_CONSOLE_LOGS=false
```

---

### **Step 2: Rebuild Frontend**

```bash
cd frontend
npm install
npm run build
```

This will create a `dist` folder with the updated frontend.

---

### **Step 3: Deploy Updated Frontend to cPanel**

#### **Option A: Via cPanel File Manager**

1. Login to cPanel
2. Go to **File Manager**
3. Navigate to `public_html`
4. **Delete old files** (except `backend` folder)
5. Upload new files from `frontend/dist` folder
6. Extract if needed

#### **Option B: Via FTP**

1. Connect to your server via FTP
2. Navigate to `public_html`
3. Delete old frontend files (keep `backend` folder)
4. Upload all files from `frontend/dist`

---

### **Step 4: Verify Backend is Deployed**

Check if Laravel backend is accessible:

**Test URL:** https://umrahconnect.in/backend/api/health

**Expected Response:**
```json
{
    "success": true,
    "message": "API is running",
    "timestamp": "2024-01-16 12:00:00"
}
```

If you get an error, the backend needs to be deployed first.

---

## 🚀 COMPLETE DEPLOYMENT STEPS

### **A. Deploy Laravel Backend First**

1. **Download Repository:**
```bash
git clone https://github.com/IamTamheedNazir/umrahconnect-2.0.git
cd umrahconnect-2.0
```

2. **Prepare Backend:**
```bash
cd backend-laravel
composer install --optimize-autoloader --no-dev
```

3. **Upload to cPanel:**
   - Zip the `backend-laravel` folder
   - Upload to cPanel File Manager
   - Extract to `public_html/backend`

4. **Configure Backend:**
   - Rename `.env.example` to `.env`
   - Edit `.env` with database credentials:
   ```env
   DB_HOST=localhost
   DB_DATABASE=your_database_name
   DB_USERNAME=your_database_user
   DB_PASSWORD=your_database_password
   
   APP_URL=https://umrahconnect.in/backend
   FRONTEND_URL=https://umrahconnect.in
   ```

5. **Run Migrations:**
   - Via cPanel Terminal:
   ```bash
   cd ~/public_html/backend
   php artisan key:generate
   php artisan jwt:secret
   php artisan migrate --force
   php artisan db:seed
   ```

6. **Set Permissions:**
   ```bash
   chmod -R 755 storage bootstrap/cache
   ```

7. **Test Backend:**
   Visit: https://umrahconnect.in/backend/api/health

---

### **B. Deploy Updated Frontend**

1. **Update Environment:**
   - Create `frontend/.env` with production settings (see Step 1 above)

2. **Build Frontend:**
   ```bash
   cd frontend
   npm install
   npm run build
   ```

3. **Upload to cPanel:**
   - Upload all files from `frontend/dist` to `public_html`
   - **Important:** Don't delete the `backend` folder!

4. **Create/Update `.htaccess`:**

Create `public_html/.htaccess`:
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

---

## 🔍 TROUBLESHOOTING

### **Issue 1: "Backend API Not Running"**

**Cause:** Frontend is still pointing to old Node.js backend

**Solution:**
1. Update `frontend/.env` with Laravel backend URL
2. Rebuild frontend: `npm run build`
3. Re-upload to cPanel

---

### **Issue 2: "404 Not Found" on API Calls**

**Cause:** Backend not properly deployed or .htaccess not configured

**Solution:**
1. Check backend is in `public_html/backend`
2. Verify `.htaccess` in both root and backend folders
3. Test: https://umrahconnect.in/backend/api/health

---

### **Issue 3: "CORS Error"**

**Cause:** Backend CORS not configured for frontend domain

**Solution:**
1. Edit `backend-laravel/config/cors.php`
2. Add your domain to `allowed_origins`:
   ```php
   'allowed_origins' => [
       'https://umrahconnect.in',
       'http://localhost:5173',
   ],
   ```
3. Clear config cache:
   ```bash
   php artisan config:clear
   ```

---

### **Issue 4: "500 Internal Server Error"**

**Cause:** Laravel configuration or permissions issue

**Solution:**
1. Check Laravel logs: `backend-laravel/storage/logs/laravel.log`
2. Set permissions:
   ```bash
   chmod -R 755 storage bootstrap/cache
   ```
3. Clear cache:
   ```bash
   php artisan config:clear
   php artisan cache:clear
   php artisan route:clear
   ```

---

## 📁 FINAL DIRECTORY STRUCTURE

```
public_html/
├── index.html              ← Frontend (React)
├── assets/                 ← Frontend assets
├── .htaccess              ← Root htaccess (routing)
│
└── backend/               ← Laravel backend
    ├── app/
    ├── database/
    ├── routes/
    ├── public/
    │   └── .htaccess      ← Backend htaccess
    ├── .env               ← Backend config
    └── composer.json
```

---

## ✅ VERIFICATION CHECKLIST

After deployment, verify:

- [ ] Backend health check works: https://umrahconnect.in/backend/api/health
- [ ] Frontend loads: https://umrahconnect.in
- [ ] Frontend can call backend API (check browser console)
- [ ] No CORS errors
- [ ] Login/Register works
- [ ] API endpoints respond correctly

---

## 🎯 QUICK FIX (If You're in a Hurry)

### **Fastest Solution:**

1. **Create `.env` file in frontend folder:**
```env
VITE_API_URL=https://umrahconnect.in/backend/api
```

2. **Rebuild frontend:**
```bash
cd frontend
npm run build
```

3. **Upload `dist` folder contents to `public_html`**

4. **Test:** Visit https://umrahconnect.in

---

## 📞 NEED HELP?

If you're still seeing the error:

1. **Check Backend First:**
   - Visit: https://umrahconnect.in/backend/api/health
   - Should return JSON response
   - If not, backend needs deployment

2. **Check Frontend Config:**
   - Open browser console (F12)
   - Check what API URL it's trying to call
   - Should be: `https://umrahconnect.in/backend/api`
   - If it's `http://localhost:5000`, rebuild frontend

3. **Check .htaccess:**
   - Verify root `.htaccess` exists
   - Verify backend `.htaccess` exists
   - Check rewrite rules

---

## 🎉 SUCCESS!

Once fixed, you should see:
- ✅ Frontend loads without errors
- ✅ No "Backend API Not Running" message
- ✅ API calls work
- ✅ Login/Register functional
- ✅ All features working

---

**Need the backend deployed first? Let me know and I'll guide you through the Laravel backend deployment!**
