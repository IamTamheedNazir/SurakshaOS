# 🔧 Frontend-Backend Connection Fix

## ❌ **ISSUE FOUND**

The frontend `api.js` file uses **wrong environment variable**:

```javascript
// WRONG (Line 5 in frontend/src/services/api.js)
baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
```

Should be:

```javascript
// CORRECT (for Vite)
baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
```

---

## ✅ **QUICK FIX**

### **Option 1: Manual Fix (2 minutes)**

Edit `frontend/src/services/api.js` line 5:

**Change from:**
```javascript
baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
```

**Change to:**
```javascript
baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
```

Also change line 9 timeout:
```javascript
timeout: import.meta.env.VITE_API_TIMEOUT || 30000,
```

---

### **Option 2: Use PowerShell (30 seconds)**

```powershell
cd frontend\src\services

# Read the file
$content = Get-Content api.js -Raw

# Replace REACT_APP with Vite syntax
$content = $content -replace 'process\.env\.REACT_APP_API_URL', 'import.meta.env.VITE_API_URL'
$content = $content -replace "http://localhost:5000/api", "http://localhost:8000/api"
$content = $content -replace "timeout: 10000", "timeout: import.meta.env.VITE_API_TIMEOUT || 30000"

# Save the file
$content | Set-Content api.js -NoNewline

cd ..\..\..
```

---

## 🔍 **VERIFICATION CHECKLIST**

After fixing, verify these connections:

### **1. Environment Variables** ✅
- ✅ `.env.example` uses `VITE_API_URL`
- ✅ `.env.production` uses `VITE_API_URL`
- ⚠️ `api.js` needs to use `import.meta.env.VITE_API_URL`

### **2. API Endpoints Match** ✅
Backend routes (`backend-laravel/routes/api.php`):
- ✅ `/auth/register`
- ✅ `/auth/login`
- ✅ `/packages`
- ✅ `/packages/featured`
- ✅ `/bookings`
- ✅ `/banners/active`
- ✅ `/testimonials`
- ✅ `/themes/active`
- ✅ `/settings`

Frontend API calls (`frontend/src/services/api.js`):
- ✅ `authAPI.register()` → `/auth/register`
- ✅ `authAPI.login()` → `/auth/login`
- ✅ `packagesAPI.getAllPackages()` → `/packages`
- ✅ `packagesAPI.getFeaturedPackages()` → `/packages/featured`
- ✅ `bookingsAPI.createBooking()` → `/bookings`
- ✅ `bannersAPI.getActiveBanners()` → `/banners/active`
- ✅ `testimonialsAPI.getAllTestimonials()` → `/testimonials`
- ✅ `themesAPI.getActiveTheme()` → `/themes/active`
- ✅ `settingsAPI.getPublicSettings()` → `/settings/public`

### **3. CORS Configuration** ✅
Backend (`backend-laravel/config/cors.php`):
- ✅ Should allow frontend origin
- ✅ Should allow credentials
- ✅ Should allow required headers

---

## 🚀 **AFTER FIX - BUILD STEPS**

```powershell
# 1. Pull latest changes (if I push the fix)
git pull

# 2. Go to frontend
cd frontend

# 3. Build
npm run build

# 4. Copy to package
Copy-Item -Recurse dist\* ..\umrahconnect-complete\

# 5. Go back
cd ..

# 6. Recreate ZIP
Compress-Archive -Path "umrahconnect-complete\*" -DestinationPath "umrahconnect-complete.zip" -Force

# 7. Check size
(Get-Item umrahconnect-complete.zip).length/1MB
```

---

## 📊 **CONNECTION FLOW**

```
Frontend (React + Vite)
    ↓
import.meta.env.VITE_API_URL
    ↓
https://umrahconnect.in/backend/api
    ↓
.htaccess rewrite
    ↓
backend/public/index.php
    ↓
Laravel Router (routes/api.php)
    ↓
Controllers
    ↓
Database
```

---

## ✅ **WHAT'S WORKING**

1. ✅ Backend API routes are complete
2. ✅ Frontend API service has all endpoints
3. ✅ Environment variables are configured
4. ✅ CORS should work (need to verify config)
5. ⚠️ Just need to fix the environment variable syntax

---

## ⚠️ **WHAT NEEDS FIXING**

1. ⚠️ `api.js` line 5: Change `process.env.REACT_APP_API_URL` to `import.meta.env.VITE_API_URL`
2. ⚠️ `api.js` line 5: Change default from `localhost:5000` to `localhost:8000`
3. ⚠️ `api.js` line 9: Change timeout to use `import.meta.env.VITE_API_TIMEOUT`

---

## 🎯 **SUMMARY**

**Issue:** Frontend using wrong environment variable syntax  
**Impact:** API calls won't connect to backend  
**Fix:** Change `process.env.REACT_APP_*` to `import.meta.env.VITE_*`  
**Time:** 2 minutes manual fix OR 30 seconds PowerShell  

---

**After this fix, frontend will properly connect to backend!** ✅
