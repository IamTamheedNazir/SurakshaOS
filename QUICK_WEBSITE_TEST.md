# ⚡ QUICK WEBSITE TEST - 5 Minutes

## Fast functionality check for UmrahConnect 2.0

---

## 🎯 CRITICAL TESTS (Must Pass)

### **Test 1: Website Loads** ✅
**URL:** https://umrahconnect.in

**Expected:**
- ✅ Website loads (no blank screen)
- ✅ No "Backend API Not Running" error
- ✅ Home page displays

**If Failed:**
- Check if backend is deployed
- Check frontend .env configuration
- Clear browser cache

---

### **Test 2: Backend API Works** ✅
**URL:** https://umrahconnect.in/backend/api/health

**Expected:**
```json
{
    "success": true,
    "message": "API is running",
    "timestamp": "2024-01-16 12:00:00"
}
```

**If Failed:**
- Backend not deployed correctly
- Check .htaccess files
- Check Laravel logs

---

### **Test 3: Browser Console** ✅
**Action:** Press F12 → Console tab

**Expected:**
- ✅ No red errors
- ✅ No CORS errors
- ✅ API calls successful

**If Failed:**
- Check Network tab for failed requests
- Check API URL in frontend .env
- Verify backend CORS configuration

---

### **Test 4: Login Works** ✅
**Action:** Click Login → Enter credentials

**Test Credentials:**
```
Email: admin@umrahconnect.in
Password: admin123
```

**Expected:**
- ✅ Login successful
- ✅ Redirected to dashboard
- ✅ User menu shows logged in state

**If Failed:**
- Check backend database seeded
- Check JWT configuration
- Check API response in Network tab

---

### **Test 5: Browse Packages** ✅
**Action:** Navigate to Packages page

**Expected:**
- ✅ Packages page loads
- ✅ Packages display (if any exist)
- ✅ Can click on package
- ✅ Package details load

**If Failed:**
- Check if packages exist in database
- Check API endpoint: /api/packages
- Verify frontend routing

---

## 🔍 DETAILED BROWSER CONSOLE CHECK

### **Open Developer Tools:**
1. Press **F12** (or Right-click → Inspect)
2. Go to **Console** tab
3. Refresh page

### **Check for Errors:**

**✅ GOOD - No errors:**
```
[No errors shown]
```

**❌ BAD - API Error:**
```
Error: Network Error
Failed to fetch: https://umrahconnect.in/backend/api/...
```
**Fix:** Backend not accessible

**❌ BAD - CORS Error:**
```
Access to fetch at 'https://umrahconnect.in/backend/api/...' 
from origin 'https://umrahconnect.in' has been blocked by CORS policy
```
**Fix:** Update backend CORS configuration

**❌ BAD - 404 Error:**
```
GET https://umrahconnect.in/backend/api/... 404 (Not Found)
```
**Fix:** Check .htaccess routing

---

## 🌐 NETWORK TAB CHECK

### **Open Network Tab:**
1. Press **F12**
2. Go to **Network** tab
3. Refresh page

### **Check API Calls:**

**✅ GOOD:**
```
GET /backend/api/packages    200 OK    [time]ms
GET /backend/api/settings    200 OK    [time]ms
```

**❌ BAD:**
```
GET /backend/api/packages    404 Not Found
GET /backend/api/packages    500 Internal Server Error
GET /backend/api/packages    Failed (CORS)
```

---

## 📱 MOBILE TEST

### **Test on Mobile:**
1. Open on phone: https://umrahconnect.in
2. Check if responsive
3. Try navigation
4. Try login

**Expected:**
- ✅ Mobile menu works
- ✅ All content visible
- ✅ No horizontal scroll
- ✅ Buttons clickable

---

## 🎯 QUICK FUNCTIONALITY TEST

### **1. Registration**
- [ ] Click Register
- [ ] Fill form
- [ ] Submit
- [ ] Success message

### **2. Login**
- [ ] Click Login
- [ ] Enter credentials
- [ ] Submit
- [ ] Redirected to dashboard

### **3. Browse Packages**
- [ ] Go to Packages
- [ ] Packages display
- [ ] Click on package
- [ ] Details load

### **4. Search**
- [ ] Use search bar
- [ ] Enter search term
- [ ] Results display

### **5. Profile**
- [ ] Click profile icon
- [ ] View profile
- [ ] Edit profile
- [ ] Save changes

---

## 🚨 COMMON ISSUES & FIXES

### **Issue 1: "Backend API Not Running"**

**Cause:** Frontend pointing to wrong API URL

**Fix:**
1. Check `frontend/.env`:
   ```env
   VITE_API_URL=https://umrahconnect.in/backend/api
   ```
2. Rebuild frontend: `npm run build`
3. Re-upload to cPanel

---

### **Issue 2: 404 on API Calls**

**Cause:** .htaccess not configured

**Fix:**
1. Check `public_html/.htaccess` exists
2. Check `public_html/backend/.htaccess` exists
3. Verify rewrite rules

---

### **Issue 3: CORS Error**

**Cause:** Backend not allowing frontend domain

**Fix:**
1. Edit `backend/config/cors.php`
2. Add frontend domain to `allowed_origins`
3. Run: `php artisan config:clear`

---

### **Issue 4: Login Fails**

**Cause:** Database not seeded or JWT not configured

**Fix:**
1. Run: `php artisan db:seed`
2. Run: `php artisan jwt:secret`
3. Check `.env` has `JWT_SECRET`

---

### **Issue 5: Blank Page**

**Cause:** JavaScript error or build issue

**Fix:**
1. Check browser console for errors
2. Rebuild frontend: `npm run build`
3. Clear browser cache
4. Try incognito mode

---

## ✅ PASS CRITERIA

**Website is working if:**
- ✅ All 5 critical tests pass
- ✅ No console errors
- ✅ API calls successful (200 status)
- ✅ Can login
- ✅ Can browse packages

**If any test fails:**
- Note which test failed
- Check the "Fix" section
- Refer to `WEBSITE_FUNCTIONALITY_AUDIT.md` for detailed testing

---

## 📊 TEST RESULTS

**Date:** ___________

**Tester:** ___________

**Results:**
- [ ] Test 1: Website Loads
- [ ] Test 2: Backend API Works
- [ ] Test 3: No Console Errors
- [ ] Test 4: Login Works
- [ ] Test 5: Browse Packages

**Issues Found:**
1. ___________________________________________
2. ___________________________________________
3. ___________________________________________

**Status:** 
- [ ] ✅ All tests passed - Ready for use
- [ ] ⚠️ Some issues - Needs fixes
- [ ] ❌ Critical issues - Needs immediate attention

---

## 🎯 NEXT STEPS

**If All Tests Pass:**
- ✅ Website is functional
- ✅ Proceed with full audit
- ✅ Add content and go live

**If Tests Fail:**
- ❌ Fix issues found
- ❌ Re-run tests
- ❌ Check deployment guides

---

**⚡ Run this test after every deployment!** ⚡
