# 🔧 Post-Installation Setup Guide

## ⚠️ IMPORTANT: After Installation Wizard Completes

The installation wizard only sets up the database and configuration. You still need to deploy the frontend and backend.

---

## 🚀 QUICK FIX (5 Minutes)

### **Step 1: Build & Deploy Frontend**

```bash
# On your local machine
cd frontend
npm install
npm run build

# This creates a 'build' folder
```

**Upload the `build` folder contents to your server:**

#### **Via cPanel File Manager:**
1. Go to File Manager
2. Navigate to `public_html`
3. **Delete or move these folders:**
   - `backend/`
   - `frontend/`
   - `database/`
   - `umrahconnect-2.0-main/`
   - All documentation files

4. **Upload contents of `build` folder** to `public_html`
   - Upload `index.html`
   - Upload `static/` folder
   - Upload `asset-manifest.json`
   - Upload all other files from build

5. **Keep only:**
   - `install/` folder (delete after first use)
   - `.env` file (created by installer)
   - `storage/` folder
   - `uploads/` folder

---

### **Step 2: Create .htaccess for React Router**

Create `.htaccess` in `public_html`:

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  
  # Don't rewrite files or directories
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteCond %{REQUEST_FILENAME} !-l
  
  # Rewrite everything else to index.html
  RewriteRule . /index.html [L]
  
  # Force HTTPS
  RewriteCond %{HTTPS} off
  RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
</IfModule>

# Disable directory browsing
Options -Indexes

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
  ExpiresByType image/webp "access plus 1 year"
  ExpiresByType text/css "access plus 1 month"
  ExpiresByType application/javascript "access plus 1 month"
  ExpiresByType application/json "access plus 1 week"
</IfModule>

# Security Headers
<IfModule mod_headers.c>
  Header set X-Content-Type-Options "nosniff"
  Header set X-Frame-Options "SAMEORIGIN"
  Header set X-XSS-Protection "1; mode=block"
</IfModule>
```

---

### **Step 3: Setup Backend API**

#### **Option A: Use External Backend (Recommended for cPanel)**

Deploy backend to **Heroku** (Free):

```bash
# On your local machine
cd backend
heroku create umrahconnect-api
heroku addons:create heroku-postgresql:mini
git init
git add .
git commit -m "Initial commit"
git push heroku main
```

Then update frontend API URL:
```javascript
// In your React app config
API_URL: 'https://umrahconnect-api.herokuapp.com/api'
```

#### **Option B: Deploy Backend on Same Server (If Node.js Supported)**

1. **Create subdomain:** `api.yourdomain.com`
2. **Upload backend folder** to subdomain root
3. **Install dependencies:**
```bash
cd /path/to/api.yourdomain.com
npm install --production
```

4. **Start with PM2 or Node.js Selector in cPanel**

---

### **Step 4: Update Frontend Configuration**

Create `public_html/config.js`:

```javascript
window.APP_CONFIG = {
  API_URL: 'https://api.yourdomain.com/api',
  // or if using Heroku:
  // API_URL: 'https://umrahconnect-api.herokuapp.com/api',
  
  APP_NAME: 'UmrahConnect',
  APP_URL: 'https://yourdomain.com',
  DEFAULT_CURRENCY: 'INR',
  DEFAULT_LANGUAGE: 'en',
};
```

---

### **Step 5: Delete Install Folder (Security)**

```bash
# Via cPanel File Manager
Delete: public_html/install/

# Via SSH
rm -rf /path/to/public_html/install/
```

---

## 📁 **CORRECT FOLDER STRUCTURE AFTER SETUP**

```
public_html/
├── static/              (React build files)
│   ├── css/
│   ├── js/
│   └── media/
├── uploads/             (User uploads)
├── storage/             (App storage)
├── index.html           (React entry point)
├── asset-manifest.json
├── manifest.json
├── robots.txt
├── .htaccess           (React Router config)
├── .env                (Created by installer)
└── config.js           (Frontend config)
```

---

## 🔧 **ALTERNATIVE: SIMPLE STATIC DEMO**

If you just want to see the UI working without backend:

### **Create a simple index.html:**

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>UmrahConnect 2.0</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
        }
        .container {
            max-width: 600px;
            background: white;
            border-radius: 20px;
            padding: 40px;
            text-align: center;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
        }
        h1 { color: #667eea; margin-bottom: 20px; font-size: 36px; }
        p { color: #6c757d; margin-bottom: 30px; line-height: 1.6; }
        .success-icon {
            width: 80px;
            height: 80px;
            background: #10b981;
            color: white;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 40px;
            margin: 0 auto 20px;
        }
        .btn {
            display: inline-block;
            padding: 12px 30px;
            background: #667eea;
            color: white;
            text-decoration: none;
            border-radius: 8px;
            margin: 10px;
            transition: all 0.3s;
        }
        .btn:hover {
            background: #5568d3;
            transform: translateY(-2px);
        }
        .info-box {
            background: #f8f9fa;
            padding: 20px;
            border-radius: 10px;
            margin-top: 30px;
            text-align: left;
        }
        .info-box h3 { color: #333; margin-bottom: 10px; }
        .info-box ul { list-style: none; }
        .info-box li { padding: 8px 0; color: #6c757d; }
        .info-box li:before { content: "✓ "; color: #10b981; font-weight: bold; }
    </style>
</head>
<body>
    <div class="container">
        <div class="success-icon">✓</div>
        <h1>🕌 UmrahConnect 2.0</h1>
        <p><strong>Installation Successful!</strong></p>
        <p>Your database has been configured and the system is ready. To complete the setup, you need to deploy the React frontend.</p>
        
        <div class="info-box">
            <h3>Next Steps:</h3>
            <ul>
                <li>Build the React frontend</li>
                <li>Upload build files to this directory</li>
                <li>Configure .htaccess for routing</li>
                <li>Setup backend API</li>
                <li>Delete install folder</li>
            </ul>
        </div>
        
        <a href="/install" class="btn">Back to Installer</a>
        <a href="https://github.com/IamTamheedNazir/umrahconnect-2.0" class="btn" target="_blank">View Documentation</a>
    </div>
</body>
</html>
```

Save this as `public_html/index.html` temporarily.

---

## 🎯 **QUICK DEPLOYMENT CHECKLIST**

- [ ] Installation wizard completed
- [ ] Database created and configured
- [ ] .env file generated
- [ ] React app built (`npm run build`)
- [ ] Build files uploaded to public_html
- [ ] .htaccess created for React Router
- [ ] Backend deployed (Heroku/Railway/Same server)
- [ ] Frontend config updated with API URL
- [ ] Install folder deleted
- [ ] Test homepage loads
- [ ] Test admin login works

---

## 🆘 **TROUBLESHOOTING**

### **Issue: Directory Listing Showing**
**Solution:** Upload React build files and create .htaccess

### **Issue: 404 on /admin route**
**Solution:** .htaccess not configured properly for React Router

### **Issue: API calls failing**
**Solution:** Backend not deployed or wrong API URL in config

### **Issue: Blank page**
**Solution:** Check browser console for errors, verify build files uploaded

---

## 📞 **NEED HELP?**

1. **Check Documentation:** `/docs/INSTALLATION_GUIDE.md`
2. **GitHub Issues:** https://github.com/IamTamheedNazir/umrahconnect-2.0/issues
3. **Email Support:** support@umrahconnect.com

---

## 🎉 **ONCE COMPLETE**

Your site will be fully functional at:
- **Homepage:** https://yourdomain.com
- **Admin:** https://yourdomain.com/admin
- **Vendor:** https://yourdomain.com/vendor
- **API:** https://api.yourdomain.com (or Heroku URL)

---

**The installation wizard is just step 1. Follow this guide to complete the deployment!** 🚀
