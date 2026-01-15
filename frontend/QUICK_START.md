# 🚀 Quick Start - Deploy to cPanel in 5 Minutes

## ⚡ FASTEST WAY TO DEPLOY

### **Step 1: Build (2 minutes)**

#### **On Windows:**
```bash
cd frontend
deploy-cpanel.bat
```

#### **On Linux/Mac:**
```bash
cd frontend
chmod +x deploy-cpanel.sh
./deploy-cpanel.sh
```

**Wait for:**
- ✅ Dependencies installed
- ✅ Build completed
- ✅ ZIP file created

---

### **Step 2: Upload (2 minutes)**

1. **Login to cPanel**
   - URL: `yourdomain.com/cpanel`
   - Enter username & password

2. **Open File Manager**
   - Click "File Manager" icon
   - Navigate to `public_html`

3. **Upload ZIP**
   - Click "Upload" button
   - Select `umrahconnect-cpanel-deploy.zip`
   - Wait for upload to complete

4. **Extract ZIP**
   - Right-click the ZIP file
   - Click "Extract"
   - Click "Extract Files"
   - Delete the ZIP file (optional)

---

### **Step 3: Test (1 minute)**

Visit: `https://yourdomain.com`

**Check:**
- ✅ Homepage loads
- ✅ Click "Packages" - works
- ✅ Click "About" - works
- ✅ Refresh page - no 404

**Done!** 🎉

---

## 🔧 If Something Goes Wrong

### **Blank Page?**
1. Check browser console (F12)
2. Verify `.htaccess` file exists
3. Check file permissions (644 for files)

### **404 on Refresh?**
1. Ensure `.htaccess` is in `public_html`
2. Check if mod_rewrite is enabled
3. Contact hosting support

### **Assets Not Loading?**
1. Clear browser cache (Ctrl+Shift+R)
2. Check `assets/` folder uploaded
3. Verify file permissions

---

## 📞 Need Help?

**Read Full Guide:**
- `CPANEL_DEPLOYMENT.md` - Complete instructions
- `FILE_CHECKLIST.md` - Verify all files

**Contact:**
- Email: support@umrahconnect.com

---

## ✅ That's It!

**Your site is now live at:**
`https://yourdomain.com`

**Total Time:** ~5 minutes
**Difficulty:** Easy ⭐

---

**Pro Tip:** Test on a subdomain first!
- `test.yourdomain.com` ← Test here
- `yourdomain.com` ← Go live here
