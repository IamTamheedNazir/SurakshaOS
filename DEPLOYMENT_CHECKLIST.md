# ✅ DEPLOYMENT CHECKLIST

Use this checklist to track your deployment progress.

---

## 📦 BACKEND DEPLOYMENT

### **Preparation**
- [ ] Downloaded repository from GitHub
- [ ] Have cPanel access
- [ ] Have database credentials ready

### **Upload & Setup**
- [ ] Uploaded backend-laravel folder to cPanel
- [ ] Extracted to `public_html/backend`
- [ ] Installed Composer dependencies
- [ ] Files in correct structure

### **Database**
- [ ] Created MySQL database
- [ ] Created database user
- [ ] Added user to database with all privileges
- [ ] Noted database name, username, password

### **Configuration**
- [ ] Copied `.env.example` to `.env`
- [ ] Updated database credentials in `.env`
- [ ] Updated `APP_URL` in `.env`
- [ ] Updated `FRONTEND_URL` in `.env`
- [ ] Generated application key (`php artisan key:generate`)
- [ ] Generated JWT secret (`php artisan jwt:secret`)

### **Permissions**
- [ ] Set `storage` folder to 755
- [ ] Set `bootstrap/cache` folder to 755

### **Database Migration**
- [ ] Ran `php artisan migrate --force`
- [ ] Ran `php artisan db:seed`
- [ ] Verified 10 tables created
- [ ] Verified sample data exists

### **.htaccess Files**
- [ ] Created/verified `public_html/.htaccess`
- [ ] Created/verified `public_html/backend/.htaccess`
- [ ] Verified `public_html/backend/public/.htaccess` exists

### **Testing**
- [ ] Backend health check works: https://umrahconnect.in/backend/api/health
- [ ] Returns JSON: `{"success": true, "message": "API is running"}`
- [ ] Login API works (tested with Postman/curl)
- [ ] No errors in Laravel logs

---

## 🎨 FRONTEND DEPLOYMENT

### **Preparation**
- [ ] Backend is deployed and working
- [ ] Node.js and npm installed locally
- [ ] Have repository downloaded

### **Configuration**
- [ ] Created `frontend/.env` file
- [ ] Set `VITE_API_URL=https://umrahconnect.in/backend/api`
- [ ] Updated other environment variables

### **Build**
- [ ] Ran `npm install` successfully
- [ ] Ran `npm run build` successfully
- [ ] `dist` folder created with files

### **Backup**
- [ ] Backed up old frontend files
- [ ] Created `backup-frontend-old` folder
- [ ] Moved old files to backup

### **Upload**
- [ ] Uploaded new frontend files to `public_html`
- [ ] Verified `index.html` exists in root
- [ ] Verified `assets` folder exists
- [ ] Kept `backend` folder intact
- [ ] Kept `.htaccess` file intact

### **Testing**
- [ ] Website loads: https://umrahconnect.in
- [ ] No "Backend API Not Running" error
- [ ] Browser console shows no errors
- [ ] API calls go to correct URL (check Network tab)
- [ ] Login works
- [ ] Register works
- [ ] Navigation works
- [ ] All pages load

---

## 🔐 SECURITY

- [ ] Changed admin password from default
- [ ] Changed vendor password from default
- [ ] Changed customer password from default
- [ ] SSL certificate active (HTTPS)
- [ ] `.env` files not publicly accessible
- [ ] Directory browsing disabled

---

## ⚙️ CONFIGURATION

### **Payment Gateways**
- [ ] Added Razorpay keys (if using)
- [ ] Added Stripe keys (if using)
- [ ] Added PayPal keys (if using)
- [ ] Tested payment flow

### **Email**
- [ ] Configured SMTP settings in backend `.env`
- [ ] Tested email sending
- [ ] Verified emails received

### **Settings**
- [ ] Updated company information
- [ ] Configured commission rates
- [ ] Set booking prefix
- [ ] Configured other settings

---

## 🧪 TESTING

### **Authentication**
- [ ] Register new user works
- [ ] Login works
- [ ] Logout works
- [ ] Password reset works (if implemented)
- [ ] Profile update works

### **Packages**
- [ ] Can view packages
- [ ] Can create package (vendor)
- [ ] Can edit package (vendor)
- [ ] Can delete package (vendor)
- [ ] Search works
- [ ] Filters work

### **Bookings**
- [ ] Can create booking
- [ ] Can view bookings
- [ ] Can update booking status
- [ ] Can cancel booking
- [ ] Email notifications sent

### **Payments**
- [ ] Payment gateway loads
- [ ] Can process payment
- [ ] Payment verification works
- [ ] Transaction recorded
- [ ] Receipt generated

### **Reviews**
- [ ] Can submit review
- [ ] Can view reviews
- [ ] Rating system works
- [ ] Can mark helpful

### **Admin Panel**
- [ ] Dashboard loads
- [ ] Statistics display correctly
- [ ] Can manage users
- [ ] Can approve packages
- [ ] Can view all bookings
- [ ] Can view payments
- [ ] Settings work

### **Vendor Dashboard**
- [ ] Dashboard loads
- [ ] Statistics display correctly
- [ ] Can manage packages
- [ ] Can view bookings
- [ ] Revenue tracking works

### **PNR Inventory** (if using)
- [ ] Can add PNR
- [ ] Dashboard shows stats
- [ ] Can sell seats
- [ ] Voucher generates
- [ ] Email sends
- [ ] WhatsApp sends (if configured)
- [ ] TTL alerts work

---

## 📊 MONITORING

- [ ] Set up error monitoring
- [ ] Check Laravel logs regularly
- [ ] Monitor server resources
- [ ] Track API response times
- [ ] Monitor database performance

---

## 📝 DOCUMENTATION

- [ ] Read README.md
- [ ] Read INSTALLATION.md
- [ ] Read API_TESTING.md
- [ ] Read PNR_INVENTORY_SYSTEM.md (if using)
- [ ] Documented custom changes
- [ ] Created user guide (optional)

---

## 🚀 GO LIVE

- [ ] All tests passed
- [ ] All features working
- [ ] Security measures in place
- [ ] Backups configured
- [ ] Monitoring set up
- [ ] Team trained
- [ ] **READY FOR PRODUCTION!** 🎉

---

## 📞 SUPPORT

If any item is not checked and you need help:
1. Note which step failed
2. Check the error message
3. Review the relevant guide:
   - `BACKEND_DEPLOYMENT_STEPS.md`
   - `FRONTEND_DEPLOYMENT_STEPS.md`
   - `DEPLOYMENT_FIX_GUIDE.md`
4. Check troubleshooting sections
5. Ask for help with specific error

---

## 🎊 COMPLETION

When all items are checked:
- ✅ Backend deployed
- ✅ Frontend deployed
- ✅ All features tested
- ✅ Security configured
- ✅ Ready for users

**Congratulations! Your UmrahConnect 2.0 platform is live!** 🚀

---

**Current Status:** ___% Complete

**Last Updated:** ___________

**Notes:**
_________________________________
_________________________________
_________________________________
