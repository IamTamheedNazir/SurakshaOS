# 🌐 UmrahConnect 2.0 - cPanel Hosting Guide

## 📋 **COMPLETE CPANEL DEPLOYMENT GUIDE**

Step-by-step guide to deploy UmrahConnect 2.0 on cPanel shared hosting.

---

## ⚠️ **IMPORTANT NOTES**

### **cPanel Limitations:**
- ❌ Limited Node.js support (some hosts don't support it)
- ❌ No PM2 process manager
- ❌ Limited memory (usually 512MB - 2GB)
- ❌ No Redis support on most shared hosting
- ❌ Limited database connections
- ❌ No root access

### **Recommended Hosting:**
For full features, we recommend:
1. **VPS Hosting** (DigitalOcean, Linode, Vultr)
2. **Cloud Hosting** (AWS, Google Cloud)
3. **Managed Node.js Hosting** (Heroku, Render, Railway)

### **For cPanel Hosting:**
We'll deploy a **simplified version** with:
- ✅ Frontend (React) - Static files
- ✅ Backend (Node.js) - If supported
- ✅ MySQL Database (instead of PostgreSQL)
- ✅ Basic features only

---

## 🎯 **DEPLOYMENT OPTIONS**

### **Option 1: Frontend Only (Recommended for cPanel)**
Deploy React frontend as static files, use external API service.

### **Option 2: Full Stack (If Node.js Supported)**
Deploy both frontend and backend on cPanel.

---

## 📦 **OPTION 1: FRONTEND ONLY DEPLOYMENT**

### **Step 1: Build React App**

```bash
# On your local machine
cd frontend
npm install
npm run build
```

This creates a `build` folder with static files.

### **Step 2: Upload to cPanel**

#### **Method A: File Manager**
1. Login to cPanel
2. Go to **File Manager**
3. Navigate to `public_html` folder
4. Delete default files (index.html, etc.)
5. Upload all files from `build` folder
6. Extract if uploaded as zip

#### **Method B: FTP**
```bash
# Using FileZilla or any FTP client
Host: ftp.yourdomain.com
Username: your_cpanel_username
Password: your_cpanel_password
Port: 21

# Upload build folder contents to public_html
```

### **Step 3: Configure .htaccess**

Create `.htaccess` in `public_html`:

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  
  # Handle React Router
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteCond %{REQUEST_FILENAME} !-l
  RewriteRule . /index.html [L]
  
  # Force HTTPS
  RewriteCond %{HTTPS} off
  RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
  
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
</IfModule>
```

### **Step 4: Setup External Backend**

Since cPanel has limitations, use external services:

#### **Option A: Use Heroku for Backend**
```bash
# Install Heroku CLI
npm install -g heroku

# Login
heroku login

# Create app
cd backend
heroku create umrahconnect-api

# Add PostgreSQL
heroku addons:create heroku-postgresql:mini

# Add Redis
heroku addons:create heroku-redis:mini

# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=your_secret
# ... (set all env variables)

# Deploy
git init
git add .
git commit -m "Initial commit"
git push heroku main

# Your API URL: https://umrahconnect-api.herokuapp.com
```

#### **Option B: Use Railway**
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Create project
cd backend
railway init

# Add PostgreSQL
railway add postgresql

# Add Redis
railway add redis

# Deploy
railway up

# Your API URL: https://umrahconnect-api.up.railway.app
```

### **Step 5: Update Frontend API URL**

Update `frontend/src/config.js`:
```javascript
const config = {
  API_URL: 'https://umrahconnect-api.herokuapp.com/api',
  // or
  API_URL: 'https://umrahconnect-api.up.railway.app/api',
};

export default config;
```

Rebuild and re-upload:
```bash
npm run build
# Upload to cPanel again
```

---

## 🔧 **OPTION 2: FULL STACK ON CPANEL (If Node.js Supported)**

### **Prerequisites:**
- cPanel with Node.js support
- SSH access
- MySQL database

### **Step 1: Check Node.js Support**

Login to cPanel → **Setup Node.js App**

If available, proceed. If not, use Option 1.

### **Step 2: Create MySQL Database**

1. cPanel → **MySQL Databases**
2. Create database: `cpanel_umrahconnect`
3. Create user: `cpanel_umrah`
4. Set password
5. Add user to database with ALL PRIVILEGES

### **Step 3: Upload Backend Code**

#### **Via File Manager:**
1. Upload backend folder as zip
2. Extract in `public_html/api`

#### **Via SSH:**
```bash
# Connect via SSH
ssh username@yourdomain.com

# Navigate to directory
cd public_html
mkdir api
cd api

# Clone repository
git clone https://github.com/IamTamheedNazir/umrahconnect-2.0.git .
cd backend
```

### **Step 4: Setup Node.js Application**

1. cPanel → **Setup Node.js App**
2. Click **Create Application**
3. Configure:
   - **Node.js version:** 18.x
   - **Application mode:** Production
   - **Application root:** public_html/api/backend
   - **Application URL:** api.yourdomain.com (or subdomain)
   - **Application startup file:** server.js

### **Step 5: Install Dependencies**

```bash
# Via SSH
cd ~/public_html/api/backend
npm install --production
```

Or use cPanel Node.js interface:
- Click **Run NPM Install**

### **Step 6: Configure Environment Variables**

Create `.env` file in backend folder:

```bash
# Via SSH
nano .env
```

```env
NODE_ENV=production
PORT=3000

# Database (MySQL instead of PostgreSQL)
DB_HOST=localhost
DB_PORT=3306
DB_NAME=cpanel_umrahconnect
DB_USER=cpanel_umrah
DB_PASSWORD=your_database_password
DB_DIALECT=mysql

# No Redis (not available on shared hosting)
# REDIS_HOST=localhost
# REDIS_PORT=6379

# JWT
JWT_SECRET=your_super_secret_jwt_key_change_this
JWT_EXPIRE=7d

# API URL
API_URL=https://api.yourdomain.com
FRONTEND_URL=https://yourdomain.com

# Email (Use cPanel email or external SMTP)
SMTP_HOST=mail.yourdomain.com
SMTP_PORT=465
SMTP_USER=noreply@yourdomain.com
SMTP_PASSWORD=your_email_password
EMAIL_FROM_NAME=UmrahConnect
EMAIL_FROM_ADDRESS=noreply@yourdomain.com

# Payment Gateways
RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_KEY_SECRET=your_razorpay_secret

STRIPE_SECRET_KEY=your_stripe_secret
STRIPE_PUBLISHABLE_KEY=your_stripe_publishable

# File Upload (Use cPanel storage)
UPLOAD_DIR=/home/username/public_html/uploads
MAX_FILE_SIZE=10485760

# Other settings...
```

### **Step 7: Modify Backend for MySQL**

Update `backend/src/config/database.js`:

```javascript
const { Sequelize } = require('sequelize');
const logger = require('../utils/logger');

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'mysql', // Changed from 'postgres'
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    pool: {
      max: 5, // Reduced for shared hosting
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  }
);

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    logger.info('✅ Database connected successfully');
    
    if (process.env.NODE_ENV === 'development') {
      await sequelize.sync({ alter: true });
      logger.info('✅ Database synchronized');
    }
  } catch (error) {
    logger.error('❌ Database connection failed:', error);
    process.exit(1);
  }
};

module.exports = { sequelize, connectDB };
```

### **Step 8: Remove Redis Dependencies**

Comment out Redis code in:
- `backend/src/config/redis.js`
- `backend/src/app.js`
- Any controllers using Redis

```javascript
// Comment out Redis imports and usage
// const { client } = require('./config/redis');
// await client.get(cacheKey);
```

### **Step 9: Run Database Migrations**

```bash
# Via SSH
cd ~/public_html/api/backend

# Install Sequelize CLI
npm install -g sequelize-cli

# Run migrations
npx sequelize-cli db:migrate

# Run seeders (optional)
npx sequelize-cli db:seed:all
```

### **Step 10: Start Application**

In cPanel Node.js interface:
- Click **Start App**
- Check status (should show "Running")

Or via SSH:
```bash
node server.js
```

### **Step 11: Setup Subdomain for API**

1. cPanel → **Subdomains**
2. Create subdomain: `api`
3. Document Root: `public_html/api/backend`
4. Create subdomain

### **Step 12: Configure .htaccess for API**

Create `.htaccess` in `public_html/api/backend`:

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  
  # Proxy to Node.js app
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule ^(.*)$ http://localhost:3000/$1 [P,L]
</IfModule>
```

### **Step 13: Deploy Frontend**

Follow Option 1 steps to deploy frontend.

Update API URL in frontend:
```javascript
const config = {
  API_URL: 'https://api.yourdomain.com/api',
};
```

---

## 🔐 **SECURITY SETUP**

### **1. SSL Certificate**

cPanel → **SSL/TLS Status**
- Enable AutoSSL (free Let's Encrypt)
- Or install custom SSL certificate

### **2. Secure .env File**

Add to `.htaccess`:
```apache
<Files .env>
  Order allow,deny
  Deny from all
</Files>
```

### **3. Disable Directory Listing**

Add to `.htaccess`:
```apache
Options -Indexes
```

### **4. Protect Admin Routes**

Add to `.htaccess`:
```apache
<FilesMatch "^(admin)">
  AuthType Basic
  AuthName "Admin Area"
  AuthUserFile /home/username/.htpasswd
  Require valid-user
</FilesMatch>
```

---

## 📊 **MONITORING**

### **1. Check Application Status**

cPanel → **Setup Node.js App** → View logs

### **2. Check Error Logs**

cPanel → **Errors** → View error logs

### **3. Monitor Resource Usage**

cPanel → **CPU and Concurrent Connection Usage**

---

## 🔧 **TROUBLESHOOTING**

### **Issue 1: Node.js App Not Starting**

```bash
# Check logs
cd ~/public_html/api/backend
cat logs/error.log

# Check Node.js version
node --version

# Restart app
# Via cPanel Node.js interface: Stop → Start
```

### **Issue 2: Database Connection Failed**

```bash
# Test MySQL connection
mysql -u cpanel_umrah -p cpanel_umrahconnect

# Check credentials in .env
cat .env | grep DB_
```

### **Issue 3: 500 Internal Server Error**

```bash
# Check .htaccess syntax
# Check file permissions
chmod 644 .htaccess
chmod 755 public_html

# Check error logs
tail -f ~/logs/error_log
```

### **Issue 4: Frontend Not Loading**

```bash
# Check .htaccess for React Router
# Clear browser cache
# Check file permissions
chmod -R 755 public_html
```

### **Issue 5: API CORS Errors**

Update `backend/src/app.js`:
```javascript
app.use(cors({
  origin: ['https://yourdomain.com', 'https://www.yourdomain.com'],
  credentials: true,
}));
```

---

## 📈 **PERFORMANCE OPTIMIZATION**

### **1. Enable Gzip Compression**

Add to `.htaccess`:
```apache
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css text/javascript application/javascript application/json
</IfModule>
```

### **2. Enable Browser Caching**

Add to `.htaccess`:
```apache
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

### **3. Optimize Images**

```bash
# Use image optimization tools
# Compress images before upload
# Use WebP format
```

### **4. Use CDN**

- Cloudflare (Free)
- BunnyCDN
- KeyCDN

---

## 🚀 **DEPLOYMENT CHECKLIST**

### **Pre-Deployment:**
- [ ] Node.js supported on cPanel
- [ ] MySQL database created
- [ ] Environment variables configured
- [ ] Dependencies installed
- [ ] Database migrations run
- [ ] SSL certificate installed

### **Post-Deployment:**
- [ ] Frontend loading correctly
- [ ] API responding
- [ ] Database connected
- [ ] File uploads working
- [ ] Email sending working
- [ ] Payment gateways working
- [ ] SSL working (HTTPS)

---

## 💡 **RECOMMENDED APPROACH**

### **For Production:**

**Best Option: VPS Hosting**
- DigitalOcean ($6/month)
- Linode ($5/month)
- Vultr ($6/month)

**Why?**
- Full Node.js support
- PostgreSQL + Redis
- PM2 process manager
- Better performance
- More control
- Scalable

### **For cPanel:**

**Use Hybrid Approach:**
1. **Frontend** → cPanel (static files)
2. **Backend** → Heroku/Railway (free tier)
3. **Database** → Heroku Postgres (free tier)
4. **Redis** → Redis Labs (free tier)

**Benefits:**
- Free to start
- Better performance
- Full features
- Easy to scale

---

## 📞 **SUPPORT**

### **cPanel Issues:**
- Contact your hosting provider
- Check cPanel documentation
- Community forums

### **Application Issues:**
- GitHub: https://github.com/IamTamheedNazir/umrahconnect-2.0/issues
- Email: support@umrahconnect.com

---

## 🎉 **DEPLOYMENT COMPLETE!**

Your UmrahConnect 2.0 is now live on cPanel! 🚀

**Access URLs:**
- Frontend: https://yourdomain.com
- API: https://api.yourdomain.com
- Admin: https://yourdomain.com/admin

---

## ⚠️ **IMPORTANT NOTES**

1. **Shared Hosting Limitations:**
   - Limited resources
   - No Redis caching
   - Slower performance
   - Limited concurrent connections

2. **Recommended Upgrade Path:**
   - Start with cPanel (testing)
   - Move to VPS (production)
   - Scale to Cloud (growth)

3. **Cost Comparison:**
   - cPanel: $5-20/month (limited)
   - VPS: $6-20/month (full control)
   - Cloud: $20-100/month (scalable)

---

**Built with ❤️ for UmrahConnect 2.0**
**Now deployable on any hosting platform!** 🌐✨
