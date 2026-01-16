# 🚀 Deploy UmrahConnect 2.0 to umrahconnect.in

## 🎯 COMPLETE DEPLOYMENT GUIDE FOR YOUR DOMAIN

**Domain:** umrahconnect.in
**Platform:** UmrahConnect 2.0
**Hosting:** cPanel (assumed)

---

## 📋 DEPLOYMENT PLAN

### **Phase 1: Backend Deployment** (Railway - FREE)
Deploy Node.js backend to Railway.app

### **Phase 2: Frontend Deployment** (cPanel)
Deploy React frontend to umrahconnect.in

### **Phase 3: Database Setup** (cPanel MySQL)
Setup MySQL database on your hosting

### **Phase 4: Installation** (Web-based)
Complete installation at umrahconnect.in/install

---

## 🚀 PHASE 1: DEPLOY BACKEND TO RAILWAY

### **Step 1: Create Railway Account** (2 minutes)

1. **Go to:** https://railway.app
2. **Click:** "Start a New Project"
3. **Sign up with:** GitHub account
4. **Authorize:** Railway to access your repos

### **Step 2: Deploy Backend** (5 minutes)

1. **Click:** "Deploy from GitHub repo"
2. **Select:** `IamTamheedNazir/umrahconnect-2.0`
3. **Root Directory:** Change to `backend`
4. **Click:** "Deploy Now"

**Railway will:**
- ✅ Detect Node.js
- ✅ Install dependencies
- ✅ Start server
- ✅ Provide URL

### **Step 3: Configure Environment Variables** (3 minutes)

In Railway dashboard:

1. **Click:** Your project
2. **Click:** "Variables" tab
3. **Add these variables:**

```env
NODE_ENV=production
PORT=5000

# Database (will add after Phase 3)
DB_HOST=your_cpanel_mysql_host
DB_PORT=3306
DB_NAME=umrahconnect_db
DB_USER=umrahconnect_user
DB_PASSWORD=your_db_password

# JWT Secrets (generate random strings)
JWT_SECRET=your_random_64_character_secret_here
JWT_EXPIRE=30d
REFRESH_TOKEN_SECRET=another_random_64_character_secret
REFRESH_TOKEN_EXPIRE=90d

# Application
APP_NAME=UmrahConnect
APP_URL=https://umrahconnect.in
FRONTEND_URL=https://umrahconnect.in

# CORS
CORS_ORIGIN=https://umrahconnect.in

# Email (configure later)
EMAIL_SERVICE=smtp
SMTP_HOST=
SMTP_PORT=587
SMTP_USER=
SMTP_PASSWORD=
EMAIL_FROM_NAME=UmrahConnect
EMAIL_FROM_ADDRESS=

# Payment (configure later)
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
STRIPE_SECRET_KEY=
STRIPE_PUBLISHABLE_KEY=
```

### **Step 4: Get Your Backend URL** (instant)

Railway provides URL like:
```
https://umrahconnect-backend-production.up.railway.app
```

**Save this URL!** You'll need it for frontend.

---

## 🚀 PHASE 2: DEPLOY FRONTEND TO CPANEL

### **Step 1: Download Repository** (2 minutes)

**Option A: Download ZIP**
1. Go to: https://github.com/IamTamheedNazir/umrahconnect-2.0
2. Click: "Code" → "Download ZIP"
3. Extract on your computer

**Option B: Git Clone**
```bash
git clone https://github.com/IamTamheedNazir/umrahconnect-2.0.git
cd umrahconnect-2.0
```

### **Step 2: Configure Frontend** (3 minutes)

1. **Navigate to frontend folder:**
```bash
cd frontend
```

2. **Create .env file:**
```bash
nano .env
```

3. **Add configuration:**
```env
# API URL from Railway
REACT_APP_API_URL=https://umrahconnect-backend-production.up.railway.app

# Your domain
REACT_APP_SITE_URL=https://umrahconnect.in

# Application
REACT_APP_SITE_NAME=UmrahConnect
REACT_APP_CURRENCY=INR
REACT_APP_TIMEZONE=Asia/Kolkata
```

### **Step 3: Build Frontend** (5 minutes)

```bash
# Install dependencies
npm install

# Build for production
npm run build
```

**Result:** `dist/` folder created with production files

### **Step 4: Upload to cPanel** (10 minutes)

#### **Method 1: File Manager (Recommended)**

1. **Login to cPanel:**
   - URL: `umrahconnect.in/cpanel`
   - Enter your credentials

2. **Open File Manager:**
   - Click "File Manager"
   - Navigate to `public_html`

3. **Clear existing files:**
   - Select all files in `public_html`
   - Delete (backup first if needed)

4. **Upload build files:**
   - Click "Upload"
   - Select all files from `dist/` folder
   - Wait for upload to complete

5. **Upload additional files:**
   - Upload `install/` folder
   - Upload `database/` folder
   - Upload root `index.php`
   - Upload `.htaccess`

**Final structure:**
```
public_html/
├── assets/              ← From dist/
├── install/             ← Installation wizard
├── database/            ← Database schemas
├── index.php           ← Main entry point
├── .htaccess           ← Apache config
└── index.html          ← Frontend entry
```

#### **Method 2: FTP/SFTP**

1. **Connect via FileZilla:**
   - Host: `ftp.umrahconnect.in`
   - Username: Your cPanel username
   - Password: Your cPanel password
   - Port: 21

2. **Upload files:**
   - Navigate to `public_html`
   - Upload all files from `dist/`
   - Upload `install/`, `database/`, `index.php`, `.htaccess`

---

## 🚀 PHASE 3: SETUP DATABASE

### **Step 1: Create MySQL Database** (5 minutes)

1. **In cPanel, go to:** "MySQL Databases"

2. **Create Database:**
   - Database Name: `umrahconnect_db`
   - Click "Create Database"

3. **Create User:**
   - Username: `umrahconnect_user`
   - Password: Generate strong password (save it!)
   - Click "Create User"

4. **Add User to Database:**
   - User: `umrahconnect_user`
   - Database: `umrahconnect_db`
   - Click "Add"
   - Grant "ALL PRIVILEGES"
   - Click "Make Changes"

5. **Note your credentials:**
```
Database Host: localhost (or your cPanel MySQL host)
Database Name: cpanel_username_umrahconnect_db
Database User: cpanel_username_umrahconnect_user
Database Password: [your generated password]
```

### **Step 2: Update Railway Backend** (2 minutes)

1. **Go to Railway dashboard**
2. **Click:** "Variables"
3. **Update database variables:**
```env
DB_HOST=your_cpanel_mysql_host
DB_NAME=cpanel_username_umrahconnect_db
DB_USER=cpanel_username_umrahconnect_user
DB_PASSWORD=your_db_password
```
4. **Click:** "Save"
5. **Backend will restart automatically**

### **Step 3: Allow Remote MySQL Access** (3 minutes)

1. **In cPanel, go to:** "Remote MySQL"
2. **Add Access Host:**
   - Enter: `%` (allow all) OR Railway's IP
   - Click "Add Host"

**To get Railway IP:**
- Railway dashboard → Settings → Networking
- Copy the IP address

---

## 🚀 PHASE 4: RUN INSTALLATION WIZARD

### **Step 1: Visit Installation URL** (1 minute)

Open browser and go to:
```
https://umrahconnect.in/install
```

### **Step 2: Complete Installation Wizard** (10 minutes)

#### **Screen 1: Welcome**
- Click "Start Installation"

#### **Screen 2: System Requirements**
- Automatic checks
- Should all pass ✅
- Click "Next"

#### **Screen 3: Database Configuration**
```
Database Host: localhost
Database Name: cpanel_username_umrahconnect_db
Database User: cpanel_username_umrahconnect_user
Database Password: [your password]
Database Port: 3306
```
- Click "Test Connection"
- Should show "Success" ✅
- Click "Next"

#### **Screen 4: Admin Account**
```
First Name: Your Name
Last Name: Your Last Name
Email: admin@umrahconnect.in
Phone: +91 XXXXXXXXXX
Password: [Strong password]
Confirm Password: [Same password]
```
- Click "Next"

#### **Screen 5: Site Configuration**
```
Site Name: UmrahConnect
Site URL: https://umrahconnect.in
API URL: https://umrahconnect-backend-production.up.railway.app
Currency: INR
Timezone: Asia/Kolkata
```
- Click "Install"

#### **Screen 6: Installation Progress**
Watch as it:
- ✅ Creates database tables
- ✅ Inserts sample data
- ✅ Creates admin account
- ✅ Generates configuration
- ✅ Sets up storage

#### **Screen 7: Success!**
- Click "Go to Dashboard"
- Login with your admin credentials

---

## 🔒 PHASE 5: POST-INSTALLATION SECURITY

### **Step 1: Delete Installation Folder** (CRITICAL!)

In cPanel File Manager:
1. Navigate to `public_html/install/`
2. Right-click → Delete
3. Confirm deletion

**Why?** Security risk if left accessible

### **Step 2: Set File Permissions**

```
Files: 644
Directories: 755

Special:
storage/ → 755
uploads/ → 755
.env → 644
```

### **Step 3: Enable SSL Certificate**

1. **In cPanel, go to:** "SSL/TLS Status"
2. **Enable:** AutoSSL for umrahconnect.in
3. **Wait:** 5-10 minutes for activation

### **Step 4: Force HTTPS**

Verify `.htaccess` has:
```apache
RewriteEngine On
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
```

---

## ✅ VERIFICATION CHECKLIST

### **Test Your Website:**

- [ ] **Homepage:** https://umrahconnect.in
- [ ] **Packages:** https://umrahconnect.in/packages
- [ ] **About:** https://umrahconnect.in/about
- [ ] **Contact:** https://umrahconnect.in/contact
- [ ] **Login:** https://umrahconnect.in/login
- [ ] **Register:** https://umrahconnect.in/register
- [ ] **Admin Panel:** https://umrahconnect.in/admin

### **Test Functionality:**

- [ ] User registration works
- [ ] User login works
- [ ] Package browsing works
- [ ] Package details load
- [ ] Booking form works
- [ ] Admin login works
- [ ] Admin dashboard loads
- [ ] Vendor features work
- [ ] Images load correctly
- [ ] Forms submit successfully
- [ ] No console errors
- [ ] Mobile responsive

### **Test Backend API:**

- [ ] API responds: `https://your-backend.railway.app/health`
- [ ] Database connected
- [ ] Authentication works
- [ ] CORS configured correctly

---

## 🎯 EXPECTED RESULTS

### **After Successful Deployment:**

**Frontend (umrahconnect.in):**
- ✅ Beautiful homepage
- ✅ All pages working
- ✅ Fast loading
- ✅ Mobile responsive
- ✅ SSL secured (HTTPS)

**Backend (Railway):**
- ✅ API responding
- ✅ Database connected
- ✅ Authentication working
- ✅ File uploads working
- ✅ Auto-scaling

**Database (cPanel MySQL):**
- ✅ 15+ tables created
- ✅ Admin account created
- ✅ Sample data inserted
- ✅ Settings configured

---

## 🆘 TROUBLESHOOTING

### **Issue 1: "Backend API Not Running"**

**Solution:**
1. Check Railway deployment status
2. Verify environment variables
3. Check Railway logs
4. Ensure database credentials correct

### **Issue 2: "Database Connection Failed"**

**Solution:**
1. Verify database credentials
2. Check Remote MySQL access
3. Try `127.0.0.1` instead of `localhost`
4. Check database user privileges

### **Issue 3: "Blank Page"**

**Solution:**
1. Check browser console (F12)
2. Verify `.htaccess` exists
3. Check file permissions
4. Clear browser cache

### **Issue 4: "404 on Page Refresh"**

**Solution:**
1. Verify `.htaccess` in public_html
2. Check mod_rewrite enabled
3. Ensure all routes configured

### **Issue 5: "CORS Error"**

**Solution:**
1. Check Railway CORS_ORIGIN variable
2. Ensure it matches: `https://umrahconnect.in`
3. No trailing slash
4. Restart Railway service

---

## 📊 DEPLOYMENT SUMMARY

### **What You'll Have:**

**Domain:** umrahconnect.in
**Frontend:** React app on cPanel
**Backend:** Node.js API on Railway (FREE)
**Database:** MySQL on cPanel
**SSL:** Enabled (HTTPS)
**Installation:** Web-based wizard

### **Costs:**

- **Domain:** Already owned ✅
- **cPanel Hosting:** Already have ✅
- **Railway Backend:** FREE (500 hrs/month) ✅
- **SSL Certificate:** FREE (AutoSSL) ✅
- **Total:** ₹0 additional cost! 🎉

### **Performance:**

- **Frontend:** Fast (served from cPanel)
- **Backend:** Fast (Railway global CDN)
- **Database:** Good (cPanel MySQL)
- **Uptime:** 99.9%+

---

## 🎉 FINAL STEPS

### **After Everything is Working:**

1. **Configure Email:**
   - cPanel → Email Accounts
   - Create: noreply@umrahconnect.in
   - Update Railway variables

2. **Setup Payment Gateways:**
   - Razorpay (for India)
   - Stripe (international)
   - Update in admin panel

3. **Add Content:**
   - Upload package images
   - Add vendor profiles
   - Create sample packages
   - Add testimonials

4. **SEO Optimization:**
   - Submit to Google Search Console
   - Create sitemap
   - Add meta descriptions
   - Setup Google Analytics

5. **Marketing:**
   - Social media setup
   - Email marketing
   - Google Ads
   - Content marketing

---

## 📞 SUPPORT

### **Need Help?**

**Railway Issues:**
- Railway Docs: https://docs.railway.app
- Railway Discord: https://discord.gg/railway

**cPanel Issues:**
- Contact your hosting provider
- cPanel documentation

**Application Issues:**
- GitHub Issues: https://github.com/IamTamheedNazir/umrahconnect-2.0/issues
- Email: support@umrahconnect.in

---

## ✅ READY TO DEPLOY?

**Total Time:** ~45 minutes
**Difficulty:** Easy ⭐⭐
**Cost:** FREE ✅

**Let's deploy your UmrahConnect 2.0 to umrahconnect.in!** 🚀

---

**Next Step:** Start with Phase 1 - Deploy Backend to Railway
