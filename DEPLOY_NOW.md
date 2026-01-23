# 🚀 Deploy UmrahConnect 2.0 NOW!

**30-Minute Complete Deployment Guide**

---

## ⚡ **FASTEST METHOD: SSH + Composer**

### **Step 1: Upload Code** (5 min)

1. Download from GitHub
2. Rename: `backend-laravel` → `backend`, `installer` → `install`
3. Zip and upload to cPanel `public_html/`
4. Extract

---

### **Step 2: Install Backend** (5 min)

**Connect via SSH:**
```bash
ssh umrahconnect@umrahconnect.in
```

**Run:**
```bash
cd public_html/backend
composer install --no-dev --optimize-autoloader
chmod -R 775 storage bootstrap/cache
exit
```

---

### **Step 3: Create Database** (2 min)

cPanel → MySQL Databases:
- Database: `umrahconnect_db`
- User: `umrahconnect_user`
- Grant ALL PRIVILEGES

---

### **Step 4: Run Installer** (5 min)

Visit: `https://umrahconnect.in/install/`

Follow wizard → Complete!

---

### **Step 5: Build Frontend** (10 min)

**On your computer:**
```bash
cd frontend
npm install
npm run build
```

Upload `dist/` contents to `public_html/`

---

### **Step 6: Delete Installer** (1 min)

```bash
ssh umrahconnect@umrahconnect.in
cd public_html
rm -rf install
exit
```

---

## ✅ **DONE!**

Visit: `https://umrahconnect.in`

---

## 🔧 **TROUBLESHOOTING**

**Composer not found?**
```bash
/usr/local/bin/composer install --no-dev
```

**Storage not writable?**
```bash
chmod -R 775 backend/storage backend/bootstrap/cache
```

**Frontend blank?**
Check `.env.production`:
```
VITE_API_URL=https://umrahconnect.in/backend/api
```

---

**Total Time: 30 minutes** ⚡
