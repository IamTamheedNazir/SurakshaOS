# 🎯 COMPLETE DEPLOYMENT PLAN

## Fix "Backend API Not Running" Error - Step by Step

---

## 🔍 CURRENT SITUATION

**Problem:** Website shows "Backend API Not Running"  
**Reason:** Frontend is looking for Node.js backend at `http://localhost:5000`  
**Solution:** Deploy Laravel backend + Update frontend

---

## 📋 DEPLOYMENT PLAN (2 Phases)

### **PHASE 1: DEPLOY BACKEND** ⭐ (Do First)
**Time:** 30-45 minutes  
**Result:** Backend API working at https://umrahconnect.in/backend/api

### **PHASE 2: UPDATE FRONTEND** ⭐ (Do Second)
**Time:** 15-20 minutes  
**Result:** Website connects to Laravel backend

---

## 🚀 PHASE 1: DEPLOY BACKEND

### **Step 1.1: Download Repository**

**Option A: Download ZIP**
1. Go to: https://github.com/IamTamheedNazir/umrahconnect-2.0
2. Click **Code** → **Download ZIP**
3. Extract on your computer

**Option B: Git Clone**
```bash
git clone https://github.com/IamTamheedNazir/umrahconnect-2.0.git
```

---

### **Step 1.2: Prepare Backend Files**

1. Navigate to extracted folder
2. Find `backend-laravel` folder
3. Zip it (right-click → compress)
4. Name: `backend.zip`

---

### **Step 1.3: Upload to cPanel**

1. **Login to cPanel:**
   - URL: https://umrahconnect.in:2083
   - Enter credentials

2. **Open File Manager:**
   - Click File Manager icon
   - Navigate to `public_html`

3. **Create backend folder:**
   - Click **+ Folder**
   - Name: `backend`
   - Click Create

4. **Upload ZIP:**
   - Open `backend` folder
   - Click **Upload**
   - Select `backend.zip`
   - Wait for upload

5. **Extract:**
   - Right-click `backend.zip`
   - Click **Extract**
   - Extract to current directory

6. **Move files:**
   - After extraction: `backend/backend-laravel/[files]`
   - Move all files from `backend-laravel` to `backend`
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

### **Step 1.4: Create Database**

1. **In cPanel, find "MySQL Databases"**

2. **Create Database:**
   - Name: `umrahconnect_db`
   - Click **Create Database**
   - **Note the full name** (e.g., `cpanel_umrahconnect_db`)

3. **Create User:**
   - Username: `umrah_user`
   - Click **Generate Password** (save it!)
   - Click **Create User**
   - **Note the full username** (e.g., `cpanel_umrah_user`)

4. **Add User to Database:**
   - Select user
   - Select database
   - Check **ALL PRIVILEGES**
   - Click **Make Changes**

**Save these:**
```
Database: cpanel_umrahconnect_db
Username: cpanel_umrah_user
Password: [generated password]
```

---

### **Step 1.5: Configure .env**

1. **In File Manager, go to:** `public_html/backend`

2. **Copy .env.example to .env:**
   - Right-click `.env.example`
   - Click **Copy**
   - Name: `.env`

3. **Edit .env:**
   - Right-click `.env`
   - Click **Edit**
   - Update these lines:

```env
APP_NAME=UmrahConnect
APP_ENV=production
APP_KEY=
APP_DEBUG=false
APP_URL=https://umrahconnect.in/backend

LOG_CHANNEL=stack
LOG_LEVEL=error

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

MAIL_MAILER=smtp
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=
MAIL_PASSWORD=
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=noreply@umrahconnect.in
MAIL_FROM_NAME="${APP_NAME}"
```

4. **Save the file**

---

### **Step 1.6: Install Dependencies & Setup**

1. **Open Terminal in cPanel**

2. **Navigate to backend:**
```bash
cd ~/public_html/backend
```

3. **Install Composer dependencies:**
```bash
composer install --optimize-autoloader --no-dev
```

**If composer not found:**
```bash
/usr/local/bin/composer install --optimize-autoloader --no-dev
```

4. **Generate keys:**
```bash
php artisan key:generate
php artisan jwt:secret
```

5. **Set permissions:**
```bash
chmod -R 755 storage
chmod -R 755 bootstrap/cache
```

6. **Run migrations:**
```bash
php artisan migrate --force
php artisan db:seed
```

7. **Clear cache:**
```bash
php artisan config:clear
php artisan cache:clear
php artisan route:clear
```

---

### **Step 1.7: Create .htaccess Files**

#### **A. Root .htaccess** (`public_html/.htaccess`)

Create or update:

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

#### **B. Backend .htaccess** (`public_html/backend/.htaccess`)

Create:

```apache
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteRule ^(.*)$ public/$1 [L]
</IfModule>
```

---

### **Step 1.8: Test Backend**

**Open in browser:**
```
https://umrahconnect.in/backend/api/health
```

**Expected:**
```json
{
    "success": true,
    "message": "API is running",
    "timestamp": "2024-01-16 12:00:00"
}
```

✅ **If you see this → Backend is working! Proceed to Phase 2**

❌ **If error → Check troubleshooting section**

---

## 🎨 PHASE 2: UPDATE FRONTEND

### **Step 2.1: Update Frontend .env**

**On your local computer:**

1. Navigate to: `frontend` folder

2. Create `.env` file with this content:

```env
VITE_API_URL=https://umrahconnect.in/backend/api
VITE_API_TIMEOUT=30000
VITE_APP_NAME=UmrahConnect
VITE_APP_VERSION=2.0.0
VITE_APP_ENV=production
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_CHAT=false
VITE_MAX_FILE_SIZE=5242880
VITE_ALLOWED_FILE_TYPES=image/jpeg,image/png,image/jpg,application/pdf
VITE_DEFAULT_PAGE_SIZE=12
VITE_MAX_PAGE_SIZE=50
VITE_CACHE_DURATION=3600000
VITE_DEBUG_MODE=false
VITE_SHOW_CONSOLE_LOGS=false
```

**CRITICAL LINE:**
```env
VITE_API_URL=https://umrahconnect.in/backend/api
```

---

### **Step 2.2: Build Frontend**

**In terminal/command prompt:**

```bash
cd frontend
npm install
npm run build
```

**This creates `dist` folder with updated files**

---

### **Step 2.3: Backup Current Frontend**

**In cPanel File Manager:**

1. Navigate to `public_html`
2. Create folder: `backup-old-frontend`
3. Move all files EXCEPT:
   - `backend` folder
   - `.htaccess` file
4. Move to backup folder

---

### **Step 2.4: Upload New Frontend**

1. **In cPanel File Manager:**
   - Navigate to `public_html`

2. **Upload files from `frontend/dist`:**
   - Click **Upload**
   - Select all files from `dist` folder
   - Upload

3. **Verify structure:**
```
public_html/
├── index.html          ← New frontend
├── assets/             ← New assets
├── .htaccess          ← Keep existing
└── backend/           ← Keep existing
```

---

### **Step 2.5: Test Website**

**Open in browser:**
```
https://umrahconnect.in
```

**Expected:**
- ✅ Website loads
- ✅ No "Backend API Not Running" error
- ✅ Can browse pages

**Test login:**
```
Email: admin@umrahconnect.in
Password: admin123
```

✅ **If login works → Deployment complete!** 🎉

---

## ✅ VERIFICATION CHECKLIST

### **Backend Verification:**
- [ ] Backend API accessible: https://umrahconnect.in/backend/api/health
- [ ] Returns JSON response
- [ ] Database has 10 tables
- [ ] Sample data exists

### **Frontend Verification:**
- [ ] Website loads: https://umrahconnect.in
- [ ] No "Backend API Not Running" error
- [ ] No console errors (F12)
- [ ] Can login
- [ ] Can browse packages

### **Integration Verification:**
- [ ] API calls go to correct URL (check Network tab)
- [ ] No CORS errors
- [ ] Login works
- [ ] Data loads from backend

---

## 🔧 TROUBLESHOOTING

### **Backend Issues:**

**404 on API:**
- Check .htaccess files exist
- Verify file paths correct
- Check mod_rewrite enabled

**500 Error:**
- Check Laravel logs: `backend/storage/logs/laravel.log`
- Fix permissions: `chmod -R 755 storage bootstrap/cache`
- Clear cache: `php artisan config:clear`

**Database Error:**
- Verify credentials in .env
- Check database user has privileges
- Test connection: `php artisan tinker` → `DB::connection()->getPdo();`

---

### **Frontend Issues:**

**Still shows "Backend API Not Running":**
- Clear browser cache (Ctrl+Shift+Delete)
- Try incognito mode
- Check browser console (F12)
- Verify .env has correct API URL
- Rebuild frontend: `npm run build`

**CORS Error:**
- Update `backend/config/cors.php`
- Add frontend domain to `allowed_origins`
- Clear backend cache: `php artisan config:clear`

---

## 📊 PROGRESS TRACKER

### **Phase 1: Backend**
- [ ] Repository downloaded
- [ ] Backend uploaded to cPanel
- [ ] Database created
- [ ] .env configured
- [ ] Dependencies installed
- [ ] Keys generated
- [ ] Migrations run
- [ ] .htaccess created
- [ ] Backend API tested ✅

### **Phase 2: Frontend**
- [ ] Frontend .env updated
- [ ] Frontend built
- [ ] Old frontend backed up
- [ ] New frontend uploaded
- [ ] Website tested ✅

---

## 🎯 ESTIMATED TIME

**Phase 1 (Backend):** 30-45 minutes
- Upload: 10 min
- Database: 5 min
- Configuration: 10 min
- Installation: 10 min
- Testing: 5 min

**Phase 2 (Frontend):** 15-20 minutes
- Update .env: 2 min
- Build: 5 min
- Upload: 5 min
- Testing: 3 min

**Total:** 45-65 minutes

---

## 📞 SUPPORT

**After Phase 1 (Backend):**
- Tell me: "Backend deployed, testing now"
- Or: "Stuck on step X"

**After Phase 2 (Frontend):**
- Tell me: "Frontend deployed, testing now"
- Or: "Still seeing error"

**I'll help you troubleshoot!** 🚀

---

## 🎉 SUCCESS!

**When both phases complete:**
- ✅ Backend API working
- ✅ Frontend connecting to backend
- ✅ Website fully functional
- ✅ Can login and use all features
- ✅ Ready for production!

---

**🚀 Follow this plan step-by-step and your website will work!** 🚀
