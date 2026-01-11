# 🚀 UmrahConnect 2.0 - cPanel Hosting Guide

## ✅ **YES, YOU CAN HOST ON CPANEL!**

This guide will help you deploy the complete UmrahConnect 2.0 platform on cPanel hosting.

---

## 📋 **PREREQUISITES**

### **What You Need:**
- ✅ cPanel hosting account with:
  - Node.js support (v14+ or v16+)
  - MongoDB support OR MongoDB Atlas account
  - SSH access (recommended)
  - At least 1GB RAM
  - 5GB storage minimum
- ✅ Domain name pointed to your hosting
- ✅ FTP/SFTP access
- ✅ SSL certificate (Let's Encrypt free SSL)

### **Recommended Hosting Providers:**
- ✅ **Hostinger** - Node.js + MongoDB support
- ✅ **A2 Hosting** - Node.js optimized
- ✅ **SiteGround** - Good Node.js support
- ✅ **Namecheap** - Affordable with Node.js
- ✅ **Bluehost** - Popular choice

---

## 🗄️ **DATABASE SETUP**

### **Option 1: MongoDB Atlas (Recommended - Free Tier)**

**Why Atlas?**
- ✅ Free 512MB storage
- ✅ No cPanel MongoDB needed
- ✅ Better performance
- ✅ Automatic backups
- ✅ Easy to manage

**Setup Steps:**

1. **Create MongoDB Atlas Account**
   ```
   Visit: https://www.mongodb.com/cloud/atlas
   Sign up for free
   ```

2. **Create Cluster**
   ```
   - Choose FREE tier (M0)
   - Select region closest to your server
   - Click "Create Cluster"
   - Wait 3-5 minutes for deployment
   ```

3. **Configure Network Access**
   ```
   - Go to "Network Access"
   - Click "Add IP Address"
   - Select "Allow Access from Anywhere" (0.0.0.0/0)
   - Click "Confirm"
   ```

4. **Create Database User**
   ```
   - Go to "Database Access"
   - Click "Add New Database User"
   - Username: umrahconnect_user
   - Password: Generate strong password
   - Role: Read and write to any database
   - Click "Add User"
   ```

5. **Get Connection String**
   ```
   - Go to "Clusters"
   - Click "Connect"
   - Choose "Connect your application"
   - Copy connection string:
   
   mongodb+srv://umrahconnect_user:<password>@cluster0.xxxxx.mongodb.net/umrahconnect?retryWrites=true&w=majority
   
   - Replace <password> with your actual password
   ```

---

### **Option 2: cPanel MongoDB (If Available)**

**Check if your hosting has MongoDB:**
```
1. Login to cPanel
2. Search for "MongoDB" in search bar
3. If available, create database:
   - Database name: umrahconnect
   - Username: umrah_user
   - Password: strong_password
```

**Connection String:**
```
mongodb://umrah_user:password@localhost:27017/umrahconnect
```

---

## 📦 **BACKEND DEPLOYMENT**

### **Step 1: Prepare Files**

**On Your Local Machine:**

1. **Navigate to backend folder**
   ```bash
   cd backend
   ```

2. **Install production dependencies**
   ```bash
   npm install --production
   ```

3. **Create production .env file**
   ```bash
   # Create .env file with production settings
   nano .env
   ```

   **Production .env:**
   ```env
   # Server
   NODE_ENV=production
   PORT=3000
   FRONTEND_URL=https://yourdomain.com
   
   # Database (MongoDB Atlas)
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/umrahconnect
   
   # JWT
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   JWT_EXPIRE=7d
   
   # Cloudinary (for image uploads)
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   
   # Email (Optional - for notifications)
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-app-password
   SMTP_FROM=noreply@yourdomain.com
   
   # Payment Gateways (Optional)
   RAZORPAY_KEY_ID=your_razorpay_key
   RAZORPAY_KEY_SECRET=your_razorpay_secret
   ```

4. **Create .cpanel.yml for auto-deployment (Optional)**
   ```yaml
   ---
   deployment:
     tasks:
       - export DEPLOYPATH=/home/username/umrahconnect-backend
       - /bin/cp -R * $DEPLOYPATH
       - cd $DEPLOYPATH
       - npm install --production
   ```

---

### **Step 2: Upload Backend to cPanel**

**Method A: Using File Manager (Easy)**

1. **Login to cPanel**
2. **Open File Manager**
3. **Navigate to home directory** (usually `/home/username/`)
4. **Create folder:** `umrahconnect-backend`
5. **Upload files:**
   - Click "Upload"
   - Select all backend files (or upload as ZIP)
   - Extract if uploaded as ZIP
6. **Upload .env file separately** (important!)

**Method B: Using FTP/SFTP (Recommended)**

```bash
# Using FileZilla or any FTP client
Host: ftp.yourdomain.com
Username: your_cpanel_username
Password: your_cpanel_password
Port: 21 (FTP) or 22 (SFTP)

# Upload entire backend folder to:
/home/username/umrahconnect-backend/
```

**Method C: Using SSH (Best)**

```bash
# Connect via SSH
ssh username@yourdomain.com

# Navigate to home directory
cd ~

# Clone from GitHub (if using Git)
git clone https://github.com/IamTamheedNazir/umrahconnect-2.0.git
cd umrahconnect-2.0/backend

# Or upload via SCP from local machine
scp -r backend/* username@yourdomain.com:~/umrahconnect-backend/
```

---

### **Step 3: Setup Node.js Application in cPanel**

1. **Login to cPanel**

2. **Find "Setup Node.js App"**
   - Search for "Node.js" in cPanel search
   - Click "Setup Node.js App"

3. **Create Application**
   ```
   Node.js Version: 16.x or 18.x (latest available)
   Application Mode: Production
   Application Root: umrahconnect-backend
   Application URL: api.yourdomain.com (or yourdomain.com/api)
   Application Startup File: server.js
   ```

4. **Set Environment Variables**
   - Click "Edit" on your app
   - Scroll to "Environment Variables"
   - Add all variables from .env file:
     ```
     NODE_ENV = production
     MONGODB_URI = mongodb+srv://...
     JWT_SECRET = your-secret
     CLOUDINARY_CLOUD_NAME = your-name
     ... (add all variables)
     ```

5. **Install Dependencies**
   ```bash
   # In cPanel Node.js App interface
   Click "Run NPM Install"
   
   # Or via SSH
   cd ~/umrahconnect-backend
   npm install --production
   ```

6. **Start Application**
   ```
   Click "Start" button in cPanel
   
   # Or via SSH
   npm start
   ```

7. **Verify Application**
   ```
   Visit: https://api.yourdomain.com/health
   
   Should return:
   {
     "success": true,
     "message": "UmrahConnect API is running",
     "database": "connected"
   }
   ```

---

### **Step 4: Setup Subdomain for API (Recommended)**

1. **Create Subdomain**
   - Go to cPanel → Domains → Subdomains
   - Subdomain: `api`
   - Domain: `yourdomain.com`
   - Document Root: `/home/username/umrahconnect-backend`
   - Click "Create"

2. **Configure .htaccess for Node.js**
   
   Create `.htaccess` in subdomain root:
   ```apache
   RewriteEngine On
   RewriteRule ^$ http://127.0.0.1:3000/ [P,L]
   RewriteCond %{REQUEST_FILENAME} !-f
   RewriteCond %{REQUEST_FILENAME} !-d
   RewriteRule ^(.*)$ http://127.0.0.1:3000/$1 [P,L]
   ```

3. **Enable SSL**
   - Go to cPanel → SSL/TLS Status
   - Enable AutoSSL for api.yourdomain.com
   - Wait for certificate installation

---

## 🎨 **FRONTEND DEPLOYMENT**

### **Step 1: Build Frontend**

**On Your Local Machine:**

1. **Navigate to frontend folder**
   ```bash
   cd frontend
   ```

2. **Update API URL**
   ```bash
   # Edit .env or .env.production
   REACT_APP_API_URL=https://api.yourdomain.com/api
   ```

3. **Build for production**
   ```bash
   npm run build
   ```
   
   This creates a `build` folder with optimized files.

---

### **Step 2: Upload Frontend to cPanel**

1. **Login to cPanel**

2. **Navigate to public_html**
   - File Manager → public_html
   - This is your main domain root

3. **Upload build files**
   - Upload all files from `build` folder
   - Or upload as ZIP and extract
   
   **Files to upload:**
   ```
   public_html/
   ├── index.html
   ├── static/
   │   ├── css/
   │   ├── js/
   │   └── media/
   ├── manifest.json
   ├── favicon.ico
   └── asset-manifest.json
   ```

4. **Create .htaccess for React Router**
   
   Create `.htaccess` in public_html:
   ```apache
   <IfModule mod_rewrite.c>
     RewriteEngine On
     RewriteBase /
     RewriteRule ^index\.html$ - [L]
     RewriteCond %{REQUEST_FILENAME} !-f
     RewriteCond %{REQUEST_FILENAME} !-d
     RewriteCond %{REQUEST_FILENAME} !-l
     RewriteRule . /index.html [L]
   </IfModule>
   ```

---

## 🔒 **SSL CERTIFICATE SETUP**

### **Enable HTTPS (Free with Let's Encrypt)**

1. **Go to cPanel → SSL/TLS Status**

2. **Enable AutoSSL**
   - Check boxes for:
     - yourdomain.com
     - www.yourdomain.com
     - api.yourdomain.com
   - Click "Run AutoSSL"

3. **Force HTTPS Redirect**
   
   Add to `.htaccess` in public_html:
   ```apache
   # Force HTTPS
   RewriteEngine On
   RewriteCond %{HTTPS} off
   RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
   ```

---

## 🗃️ **DATABASE SEEDING**

### **Seed Initial Data**

**Via SSH:**
```bash
cd ~/umrahconnect-backend
npm run seed
```

**Or manually via MongoDB Compass:**
1. Download MongoDB Compass
2. Connect using Atlas connection string
3. Import seed data from `backend/scripts/seed.js`

---

## 📊 **MONITORING & MAINTENANCE**

### **Check Application Status**

1. **cPanel Node.js App Manager**
   - View logs
   - Restart application
   - Check resource usage

2. **Error Logs**
   ```bash
   # Via SSH
   cd ~/umrahconnect-backend
   tail -f logs/error.log
   
   # Or in cPanel
   File Manager → logs folder
   ```

3. **Health Check**
   ```
   Visit: https://api.yourdomain.com/health
   ```

---

## 🔧 **COMMON ISSUES & SOLUTIONS**

### **Issue 1: Application Won't Start**

**Solution:**
```bash
# Check Node.js version
node --version

# Reinstall dependencies
cd ~/umrahconnect-backend
rm -rf node_modules
npm install --production

# Check logs
tail -f logs/error.log
```

---

### **Issue 2: Database Connection Failed**

**Solution:**
```bash
# Verify MongoDB Atlas connection
# Check:
1. IP whitelist (0.0.0.0/0)
2. Database user credentials
3. Connection string format
4. Network connectivity

# Test connection
node -e "const mongoose = require('mongoose'); mongoose.connect('your-connection-string').then(() => console.log('Connected')).catch(err => console.log(err));"
```

---

### **Issue 3: 502 Bad Gateway**

**Solution:**
```bash
# Restart Node.js app in cPanel
# Or via SSH
cd ~/umrahconnect-backend
npm restart

# Check if port is correct in .htaccess
# Should match Node.js app port (usually 3000)
```

---

### **Issue 4: Images Not Uploading**

**Solution:**
```bash
# Verify Cloudinary credentials in .env
# Check file permissions
chmod 755 ~/umrahconnect-backend/uploads

# Test Cloudinary connection
# Visit: https://api.yourdomain.com/api/test-upload
```

---

### **Issue 5: CORS Errors**

**Solution:**
```javascript
// Update backend/server.js
app.use(cors({
  origin: [
    'https://yourdomain.com',
    'https://www.yourdomain.com'
  ],
  credentials: true
}));
```

---

## 📈 **PERFORMANCE OPTIMIZATION**

### **1. Enable Compression**
Already included in server.js with `compression` middleware.

### **2. Enable Caching**

Add to `.htaccess`:
```apache
# Cache static files
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType image/jpg "access plus 1 year"
  ExpiresByType image/jpeg "access plus 1 year"
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType text/css "access plus 1 month"
  ExpiresByType application/javascript "access plus 1 month"
</IfModule>
```

### **3. Enable Gzip Compression**

Add to `.htaccess`:
```apache
# Gzip compression
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css text/javascript application/javascript
</IfModule>
```

---

## 🔐 **SECURITY CHECKLIST**

- ✅ SSL certificate installed
- ✅ HTTPS forced
- ✅ Strong JWT secret
- ✅ MongoDB Atlas IP whitelist configured
- ✅ Environment variables secured
- ✅ Rate limiting enabled
- ✅ Helmet.js security headers
- ✅ CORS properly configured
- ✅ File upload limits set
- ✅ Regular backups enabled

---

## 📱 **POST-DEPLOYMENT CHECKLIST**

- ✅ Backend API accessible at https://api.yourdomain.com
- ✅ Frontend accessible at https://yourdomain.com
- ✅ Health check returns success
- ✅ Database connected
- ✅ Image uploads working
- ✅ Login/Register working
- ✅ CMS pages accessible
- ✅ SSL certificate active
- ✅ Email notifications working (if configured)
- ✅ Payment gateways configured (if using)

---

## 🆘 **SUPPORT RESOURCES**

### **cPanel Documentation:**
- https://docs.cpanel.net/

### **Node.js on cPanel:**
- https://docs.cpanel.net/cpanel/software/application-manager/

### **MongoDB Atlas:**
- https://docs.atlas.mongodb.com/

### **Cloudinary:**
- https://cloudinary.com/documentation

---

## 📞 **NEED HELP?**

**Common Hosting Support:**
- Check your hosting provider's knowledge base
- Contact hosting support for Node.js setup
- Use cPanel's built-in chat support

**Developer Support:**
- Email: tnsolution1s@gmail.com
- GitHub: [@IamTamheedNazir](https://github.com/IamTamheedNazir)

---

## 🎉 **CONGRATULATIONS!**

Your UmrahConnect 2.0 platform is now live on cPanel! 🚀

**Access your platform:**
- 🌐 Frontend: https://yourdomain.com
- 🔌 API: https://api.yourdomain.com
- 🔐 Admin: https://yourdomain.com/admin

**Default Login:**
- Email: admin@umrahconnect.com
- Password: password123
- **⚠️ CHANGE THIS IMMEDIATELY!**

---

**Made with ❤️ for the Muslim community**

**May your platform help thousands perform their sacred journeys! 🕌**
