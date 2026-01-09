# 📦 UmrahConnect 2.0 - Setup from GitHub ZIP

## 🎯 **COMPLETE SETUP GUIDE - FROM DOWNLOAD TO LIVE SITE**

Follow these steps to set up UmrahConnect 2.0 from the GitHub ZIP file.

---

## 📥 **STEP 1: DOWNLOAD & EXTRACT**

### **Download from GitHub:**
1. Go to: https://github.com/IamTamheedNazir/umrahconnect-2.0
2. Click green **"Code"** button
3. Click **"Download ZIP"**
4. Save `umrahconnect-2.0-main.zip`

### **Extract on Your Computer:**
1. Right-click the ZIP file
2. Select "Extract All" or "Extract Here"
3. You'll get a folder: `umrahconnect-2.0-main/`

**Folder Structure:**
```
umrahconnect-2.0-main/
├── frontend/              (React source code)
├── backend/               (Node.js source code)
├── install/               (Installation wizard)
│   ├── index.html        (Installation wizard UI)
│   ├── install.php       (Installation backend)
│   └── database_schema.sql (Database tables)
├── docs/                  (Documentation files)
├── index.html            (Temporary success page)
└── README.md
```

---

## 🗄️ **STEP 2: SETUP DATABASE**

### **2.1 Create Database in cPanel:**

1. **Login to cPanel**
2. **MySQL Databases** → Create Database
   - Database Name: `umrahconnect`
   - Click "Create Database"

3. **Create Database User:**
   - Username: `umrah_admin`
   - Password: (generate strong password)
   - Click "Create User"

4. **Add User to Database:**
   - User: `umrah_admin`
   - Database: `umrahconnect`
   - Privileges: **ALL PRIVILEGES**
   - Click "Add"

**Save these details - you'll need them!**

### **2.2 Import Database Schema:**

1. **Open phpMyAdmin** (from cPanel)
2. **Select database:** `umrahconnect` (left sidebar)
3. Click **"Import"** tab
4. Click **"Choose File"**
5. **Upload:** `install/database_schema.sql` (from extracted folder)
6. Click **"Import"** button
7. Wait for success message

**Result:** 8 tables created with default data!

### **2.3 Create Admin Account:**

In phpMyAdmin, click **"SQL"** tab and run:

```sql
INSERT INTO `users` (`id`, `email`, `password`, `first_name`, `last_name`, `role`, `email_verified`, `status`) 
VALUES (
  UUID(),
  'admin@yourdomain.com',
  '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
  'Admin',
  'User',
  'admin',
  TRUE,
  'active'
);
```

**Admin Login:**
- Email: `admin@yourdomain.com`
- Password: `password`
- ⚠️ Change after first login!

---

## 📤 **STEP 3: UPLOAD FILES TO SERVER**

### **3.1 What to Upload:**

**Upload ONLY these files/folders to `public_html`:**

```
public_html/
├── install/              ← Upload this folder
│   ├── index.html
│   ├── install.php
│   └── database_schema.sql
├── index.html           ← Upload this file (temporary landing page)
└── .htaccess            ← Create this file (see below)
```

**DO NOT upload these (they're source code):**
- ❌ `frontend/` folder
- ❌ `backend/` folder
- ❌ `docs/` folder
- ❌ `.md` documentation files

### **3.2 Upload via cPanel File Manager:**

1. **Login to cPanel**
2. **File Manager** → `public_html`
3. **Upload** button
4. **Select files:**
   - `install/` folder (as ZIP, then extract)
   - `index.html` file
5. Click **"Upload"**
6. Wait for completion

### **3.3 Create .htaccess File:**

In `public_html`, create `.htaccess` with this content:

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  
  # Disable directory browsing
  Options -Indexes
  
  # Handle React Router (when frontend is deployed)
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteCond %{REQUEST_FILENAME} !-l
  RewriteRule . /index.html [L]
  
  # Force HTTPS
  RewriteCond %{HTTPS} off
  RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
</IfModule>

# Compression
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css text/javascript application/javascript application/json
</IfModule>

# Browser Caching
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType image/jpg "access plus 1 year"
  ExpiresByType image/jpeg "access plus 1 year"
  ExpiresByType image/gif "access plus 1 year"
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType text/css "access plus 1 month"
  ExpiresByType application/javascript "access plus 1 month"
</IfModule>
```

### **3.4 Set Permissions:**

Set folder permissions to **755**:
- `public_html/install/` → 755
- `public_html/` → 755

---

## 🎨 **STEP 4: BUILD & DEPLOY FRONTEND**

### **4.1 Build React App (On Your Computer):**

```bash
# Open terminal/command prompt
cd path/to/umrahconnect-2.0-main/frontend

# Install dependencies
npm install

# Build for production
npm run build
```

This creates a `build/` folder with compiled files.

### **4.2 Upload Build Files:**

**Upload contents of `build/` folder to `public_html`:**

Files to upload:
- `index.html` (replace existing)
- `static/` folder
- `asset-manifest.json`
- `manifest.json`
- `robots.txt`
- `favicon.ico`
- All other files from build folder

**Via cPanel File Manager:**
1. Zip the `build` folder contents
2. Upload ZIP to `public_html`
3. Extract ZIP
4. Delete ZIP file

**Final structure:**
```
public_html/
├── static/              ← React build files
│   ├── css/
│   ├── js/
│   └── media/
├── install/             ← Installation wizard
├── index.html          ← React entry point
├── asset-manifest.json
├── manifest.json
├── .htaccess
└── favicon.ico
```

---

## 🔧 **STEP 5: SETUP BACKEND API**

### **Option A: Deploy to Heroku (Free & Recommended)**

```bash
# On your computer, in backend folder
cd path/to/umrahconnect-2.0-main/backend

# Install Heroku CLI (if not installed)
# Download from: https://devcenter.heroku.com/articles/heroku-cli

# Login to Heroku
heroku login

# Create app
heroku create umrahconnect-api

# Add PostgreSQL database
heroku addons:create heroku-postgresql:mini

# Add Redis
heroku addons:create heroku-redis:mini

# Deploy
git init
git add .
git commit -m "Initial deploy"
git push heroku main

# Your API URL will be:
# https://umrahconnect-api.herokuapp.com
```

### **Option B: Deploy to Railway (Alternative)**

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Initialize project
cd path/to/umrahconnect-2.0-main/backend
railway init

# Add PostgreSQL
railway add postgresql

# Add Redis
railway add redis

# Deploy
railway up

# Your API URL will be shown after deployment
```

### **Option C: Same Server (If Node.js Supported)**

1. Create subdomain: `api.yourdomain.com`
2. Upload `backend/` folder to subdomain root
3. Install dependencies: `npm install --production`
4. Start with PM2 or Node.js Selector in cPanel

---

## ⚙️ **STEP 6: CONFIGURE FRONTEND**

### **Create config.js in public_html:**

```javascript
window.APP_CONFIG = {
  // If using Heroku:
  API_URL: 'https://umrahconnect-api.herokuapp.com/api',
  
  // If using Railway:
  // API_URL: 'https://umrahconnect-api.up.railway.app/api',
  
  // If using same server:
  // API_URL: 'https://api.yourdomain.com/api',
  
  APP_NAME: 'UmrahConnect',
  APP_URL: 'https://yourdomain.com',
  DEFAULT_CURRENCY: 'INR',
  DEFAULT_LANGUAGE: 'en',
};
```

---

## 🔐 **STEP 7: SECURITY**

### **7.1 Delete Install Folder:**

```bash
# Via cPanel File Manager
Delete: public_html/install/

# Or via SSH
rm -rf /path/to/public_html/install/
```

### **7.2 Setup SSL Certificate:**

**Via cPanel:**
1. cPanel → **SSL/TLS Status**
2. Enable **AutoSSL** (free Let's Encrypt)
3. Wait for certificate

**Via Cloudflare (Free):**
1. Add domain to Cloudflare
2. Update nameservers
3. Enable SSL (Full)
4. Enable "Always Use HTTPS"

### **7.3 Change Admin Password:**

1. Login to admin panel
2. Go to Profile/Settings
3. Change password from `password` to strong password

---

## ✅ **STEP 8: VERIFY EVERYTHING WORKS**

### **Test Checklist:**

- [ ] Homepage loads (https://yourdomain.com)
- [ ] No directory listing
- [ ] Admin login works (https://yourdomain.com/admin)
- [ ] Dashboard loads
- [ ] Database connected
- [ ] API responding
- [ ] SSL working (HTTPS)
- [ ] Install folder deleted

---

## 📁 **FINAL FOLDER STRUCTURE**

```
public_html/
├── static/              (React build - CSS, JS, images)
├── uploads/             (User uploads - create if needed)
├── storage/             (App storage - create if needed)
├── index.html          (React entry point)
├── asset-manifest.json
├── manifest.json
├── robots.txt
├── favicon.ico
├── .htaccess           (Routing & security)
├── .env                (Backend config - if on same server)
└── config.js           (Frontend config)
```

---

## 🎯 **QUICK REFERENCE**

### **What Each Folder Does:**

| Folder/File | Purpose | Upload? |
|------------|---------|---------|
| `frontend/` | React source code | ❌ No (build it first) |
| `frontend/build/` | Compiled React app | ✅ Yes (contents only) |
| `backend/` | Node.js source | ❌ No (deploy to Heroku) |
| `install/` | Installation wizard | ✅ Yes (delete after use) |
| `docs/` | Documentation | ❌ No |
| `index.html` | Landing page | ✅ Yes |
| `.htaccess` | Server config | ✅ Yes (create manually) |

---

## 🆘 **TROUBLESHOOTING**

### **Issue: Directory Listing Shows**
**Solution:** 
- Upload `index.html` to `public_html`
- Create `.htaccess` with `Options -Indexes`

### **Issue: 404 on Admin Page**
**Solution:**
- Deploy React build files
- Check `.htaccess` has React Router rules

### **Issue: Database Empty**
**Solution:**
- Import `install/database_schema.sql` in phpMyAdmin
- Run admin user INSERT query

### **Issue: API Not Working**
**Solution:**
- Deploy backend to Heroku/Railway
- Update `config.js` with correct API URL
- Check CORS settings in backend

---

## 📞 **NEED HELP?**

**Documentation:**
- Installation Guide: `INSTALLATION_GUIDE.md`
- Post-Installation: `POST_INSTALLATION_SETUP.md`
- cPanel Guide: `CPANEL_HOSTING_GUIDE.md`

**Support:**
- GitHub Issues: https://github.com/IamTamheedNazir/umrahconnect-2.0/issues
- Email: support@umrahconnect.com

---

## 🎉 **SUCCESS!**

Once complete, your site will be live at:
- **Homepage:** https://yourdomain.com
- **Admin:** https://yourdomain.com/admin
- **API:** https://umrahconnect-api.herokuapp.com

**Welcome to UmrahConnect 2.0!** 🕌✨

---

## 📋 **QUICK SETUP CHECKLIST**

- [ ] Download GitHub ZIP
- [ ] Extract files
- [ ] Create database in cPanel
- [ ] Import database_schema.sql
- [ ] Create admin account (SQL)
- [ ] Upload install folder & index.html
- [ ] Create .htaccess
- [ ] Build React app (npm run build)
- [ ] Upload build files to public_html
- [ ] Deploy backend to Heroku
- [ ] Create config.js with API URL
- [ ] Setup SSL certificate
- [ ] Delete install folder
- [ ] Change admin password
- [ ] Test everything works

**Estimated Time: 30-45 minutes**

---

**Built with ❤️ for UmrahConnect 2.0**
**From GitHub ZIP to Live Site in Under 1 Hour!** 🚀
