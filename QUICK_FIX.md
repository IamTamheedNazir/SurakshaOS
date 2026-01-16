# ⚡ QUICK FIX - Resolve "Backend API Not Running" Error

## 🎯 THE PROBLEM

Your website shows: **"Backend API Not Running"**

**Why?** Frontend is looking for Node.js backend at `http://localhost:5000`, but you need Laravel backend at `https://umrahconnect.in/backend/api`

---

## ✅ SOLUTION (3 Simple Steps)

### **Step 1: Create `.env` File**

In your `frontend` folder, create a file named `.env` with this content:

```env
VITE_API_URL=https://umrahconnect.in/backend/api
VITE_API_TIMEOUT=30000
VITE_APP_NAME=UmrahConnect
VITE_APP_VERSION=2.0.0
VITE_APP_ENV=production
```

### **Step 2: Rebuild Frontend**

Open terminal/command prompt and run:

```bash
cd frontend
npm install
npm run build
```

This creates a `dist` folder with updated files.

### **Step 3: Upload to cPanel**

1. Login to cPanel
2. Go to **File Manager**
3. Navigate to `public_html`
4. **Delete old files** (keep `backend` folder if it exists)
5. Upload all files from `frontend/dist` folder
6. Done!

---

## 🚀 ALTERNATIVE: Deploy Backend First

If you haven't deployed the Laravel backend yet, you need to do that first:

### **Quick Backend Deployment:**

1. **Download the repository**
2. **Upload `backend-laravel` folder to cPanel**
3. **Extract to `public_html/backend`**
4. **Configure `.env` file**
5. **Run migrations**

**Detailed guide:** See `DEPLOYMENT_FIX_GUIDE.md`

---

## 🔍 VERIFY IT WORKS

### **Test 1: Check Backend**
Visit: https://umrahconnect.in/backend/api/health

**Expected:**
```json
{
    "success": true,
    "message": "API is running"
}
```

### **Test 2: Check Frontend**
Visit: https://umrahconnect.in

**Expected:** Website loads without "Backend API Not Running" error

---

## ❓ STILL NOT WORKING?

### **Check 1: Is Backend Deployed?**
- Visit: https://umrahconnect.in/backend/api/health
- If you get 404 or error → Backend not deployed
- **Solution:** Deploy Laravel backend first

### **Check 2: Is Frontend Updated?**
- Open browser console (F12)
- Check Network tab
- Look for API calls
- Should call: `https://umrahconnect.in/backend/api`
- If calling `localhost:5000` → Frontend not rebuilt
- **Solution:** Rebuild and re-upload frontend

### **Check 3: CORS Error?**
- Check browser console for CORS errors
- **Solution:** Update `backend/config/cors.php`

---

## 📞 NEED HELP?

**Option 1:** Follow the detailed guide in `DEPLOYMENT_FIX_GUIDE.md`

**Option 2:** Let me know which step you're stuck on:
- Backend deployment?
- Frontend rebuild?
- cPanel upload?

---

## 🎉 SUCCESS CHECKLIST

After fixing:
- [ ] Backend health check works
- [ ] Frontend loads without error
- [ ] No "Backend API Not Running" message
- [ ] Can navigate the website
- [ ] API calls work (check browser console)

---

**Ready to fix it? Start with Step 1 above!** 🚀
