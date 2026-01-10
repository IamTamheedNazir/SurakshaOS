# 🌐 SHARED HOSTING / cPanel SETUP GUIDE
## UmrahConnect 2.0 - For Shared Hosting Environments

---

## 🎯 FOR USERS WITH:
- ✅ Shared hosting (Hostinger, Bluehost, GoDaddy, etc.)
- ✅ cPanel access
- ✅ phpMyAdmin access
- ✅ Existing database already created

---

## 📋 WHAT YOU HAVE:

Based on your error, you have:
```
Database User: cpses_umobqbuylw
Database Name: (created by your hosting)
```

---

## 🚀 STEP-BY-STEP SETUP

### **STEP 1: Find Your Database Name**

1. Login to **cPanel**
2. Go to **MySQL® Databases**
3. Look for **Current Databases** section
4. Note down your database name (e.g., `cpses_umrahconnect` or similar)

**Example:**
```
Database Name: cpses_umrahconnect
Database User: cpses_umobqbuylw
```

---

### **STEP 2: Import Database Schema**

#### **Method A: Using phpMyAdmin (Recommended)**

1. **Login to cPanel**
2. **Click phpMyAdmin**
3. **Select your database** from left sidebar
4. **Click "Import" tab**
5. **Click "Choose File"**
6. **Select:** `database/schema-shared-hosting.sql`
7. **Click "Go" button**
8. **Wait for success message** ✅

#### **Method B: Using SQL Tab**

1. **Login to phpMyAdmin**
2. **Select your database**
3. **Click "SQL" tab**
4. **Copy entire content** from `database/schema-shared-hosting.sql`
5. **Paste in SQL box**
6. **Click "Go"**
7. **Wait for success** ✅

---

### **STEP 3: Verify Tables Created**

In phpMyAdmin, you should see **17 tables**:

```
✓ users
✓ vendors
✓ vendor_documents
✓ packages
✓ package_images
✓ package_inclusions
✓ package_exclusions
✓ bookings
✓ booking_travelers
✓ payments
✓ refunds
✓ reviews
✓ notifications
✓ booking_documents
✓ settings
✓ activity_logs
```

---

### **STEP 4: Configure Your Application**

Create `.env` file with your database details:

```env
# Server
NODE_ENV=production
PORT=3000

# Database (IMPORTANT: Use YOUR details!)
DB_HOST=localhost
DB_PORT=3306
DB_NAME=cpses_umrahconnect  # Your database name
DB_USER=cpses_umobqbuylw     # Your database user
DB_PASSWORD=your_db_password  # Your database password

# JWT Secret (Generate random string)
JWT_SECRET=your_super_secret_jwt_key_min_32_characters_long
JWT_EXPIRE=30d
REFRESH_TOKEN_SECRET=your_refresh_token_secret_key
REFRESH_TOKEN_EXPIRE=90d

# Frontend URL
FRONTEND_URL=https://yourdomain.com

# Email Configuration
EMAIL_SERVICE=smtp
SMTP_HOST=smtp.yourdomain.com
SMTP_PORT=587
SMTP_USER=noreply@yourdomain.com
SMTP_PASSWORD=your_email_password
EMAIL_FROM=noreply@yourdomain.com
EMAIL_FROM_NAME=UmrahConnect
```

---

### **STEP 5: Upload Backend Files**

#### **Using cPanel File Manager:**

1. **Login to cPanel**
2. **Go to File Manager**
3. **Navigate to** `public_html` or your domain folder
4. **Create folder:** `api` or `backend`
5. **Upload all backend files** to this folder
6. **Extract if uploaded as ZIP**

#### **Using FTP (FileZilla):**

1. **Connect via FTP**
   - Host: ftp.yourdomain.com
   - Username: Your cPanel username
   - Password: Your cPanel password
   - Port: 21

2. **Upload backend folder** to:
   - `/public_html/api/` or
   - `/public_html/backend/`

---

### **STEP 6: Install Node.js (if not installed)**

#### **For cPanel with Node.js Selector:**

1. **Go to cPanel**
2. **Find "Setup Node.js App"**
3. **Click "Create Application"**
4. **Configure:**
   - Node.js version: 18.x or higher
   - Application mode: Production
   - Application root: `/home/username/public_html/api`
   - Application URL: `yourdomain.com/api`
   - Application startup file: `server.js`

5. **Click "Create"**

#### **For cPanel without Node.js:**

Contact your hosting provider to:
- Enable Node.js
- Or upgrade to a plan with Node.js support
- Or use VPS/Cloud hosting instead

---

### **STEP 7: Install Dependencies**

#### **Via cPanel Terminal (if available):**

```bash
cd public_html/api
npm install --production
```

#### **Via SSH (if available):**

```bash
ssh username@yourdomain.com
cd public_html/api
npm install --production
```

---

### **STEP 8: Start Application**

#### **Using Node.js Selector:**

1. **Go to "Setup Node.js App"**
2. **Click "Start" button**
3. **Application should start** ✅

#### **Using PM2 (if available):**

```bash
cd public_html/api
pm2 start server.js --name umrahconnect-api
pm2 save
```

---

### **STEP 9: Setup .htaccess (Important!)**

Create `.htaccess` in your API folder:

```apache
# .htaccess for Node.js API
RewriteEngine On
RewriteRule ^$ http://127.0.0.1:3000/ [P,L]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.*)$ http://127.0.0.1:3000/$1 [P,L]
```

---

### **STEP 10: Test Your API**

Visit: `https://yourdomain.com/api/health`

**Expected Response:**
```json
{
  "success": true,
  "message": "API is running",
  "timestamp": "2024-01-07T10:00:00.000Z"
}
```

---

## ✅ VERIFICATION CHECKLIST

```
□ Database created in cPanel
□ Database user has permissions
□ Schema imported successfully
□ 17 tables visible in phpMyAdmin
□ Backend files uploaded
□ .env file configured
□ Node.js installed/enabled
□ Dependencies installed
□ Application started
□ .htaccess configured
□ API responding
□ Admin user created
```

---

## 🔍 TROUBLESHOOTING

### **Issue 1: "Access denied to database"**

**Solution:**
1. Go to cPanel → MySQL® Databases
2. Scroll to "Add User To Database"
3. Select your user and database
4. Click "Add"
5. Check "ALL PRIVILEGES"
6. Click "Make Changes"

---

### **Issue 2: "Table already exists"**

**Solution:**
1. Go to phpMyAdmin
2. Select your database
3. Click "Check All"
4. Select "Drop" from dropdown
5. Click "Yes" to confirm
6. Re-import schema

---

### **Issue 3: "Cannot find module"**

**Solution:**
```bash
cd public_html/api
rm -rf node_modules package-lock.json
npm install --production
```

---

### **Issue 4: "Port already in use"**

**Solution:**
Change PORT in `.env`:
```env
PORT=3001
```

---

### **Issue 5: "Node.js not available"**

**Solutions:**
1. Contact hosting support to enable Node.js
2. Use Node.js Selector in cPanel
3. Upgrade to VPS/Cloud hosting
4. Use services like Heroku, Railway, or Render

---

## 📊 SHARED HOSTING LIMITATIONS

### **What Works:**
- ✅ MySQL database
- ✅ File uploads (limited)
- ✅ Basic API operations
- ✅ Authentication
- ✅ CRUD operations

### **What May Not Work:**
- ⚠️ WebSockets (real-time features)
- ⚠️ Background jobs
- ⚠️ Heavy processing
- ⚠️ High traffic (limited resources)
- ⚠️ Custom server configurations

### **Recommended Alternatives:**
- **VPS Hosting:** DigitalOcean, Linode, Vultr
- **Cloud Hosting:** AWS, Google Cloud, Azure
- **Platform as a Service:** Heroku, Railway, Render
- **Managed Node.js:** Cloudways, Kinsta

---

## 🎯 ALTERNATIVE: DEPLOY TO CLOUD

If shared hosting doesn't work well, consider:

### **Option 1: Railway (Easiest)**
```bash
npm install -g @railway/cli
railway login
railway init
railway add mysql
railway up
```
**Cost:** ~$5-10/month

### **Option 2: Heroku**
```bash
heroku create umrahconnect-api
heroku addons:create jawsdb:kitefin
git push heroku main
```
**Cost:** ~$7-25/month

### **Option 3: DigitalOcean**
- Create Droplet ($6/month)
- Follow `PRODUCTION_DEPLOYMENT_GUIDE.md`
- Full control, better performance

---

## 📞 NEED HELP?

### **Check These Files:**
- `PRODUCTION_DEPLOYMENT_GUIDE.md` - Full deployment guide
- `QUICK_SETUP_MYSQL.md` - Quick setup for local/VPS
- `INSTALLATION_GUIDE.md` - Detailed installation

### **Common Issues:**
1. Database permissions
2. Node.js not available
3. Port conflicts
4. File permissions
5. Module not found

---

## 🎉 SUCCESS!

**Once everything is working:**

1. ✅ Test all API endpoints
2. ✅ Change admin password
3. ✅ Configure email/SMS
4. ✅ Setup payment gateways
5. ✅ Deploy frontend
6. ✅ Go live!

---

## 💡 PRO TIPS

### **For Better Performance:**

1. **Use VPS instead of shared hosting**
   - Better performance
   - More control
   - Scalable
   - Cost: $5-10/month

2. **Use managed services**
   - Railway, Heroku, Render
   - No server management
   - Auto-scaling
   - Easy deployment

3. **Optimize database**
   - Regular backups
   - Index optimization
   - Query caching

---

## 📧 SUPPORT

**Still having issues?**

1. Check error logs in cPanel
2. Check Node.js app logs
3. Check phpMyAdmin for tables
4. Verify database permissions
5. Contact hosting support

---

**Good luck with your deployment!** 🚀

**Remember:** Shared hosting has limitations. For production, consider VPS or cloud hosting for better performance and reliability.
