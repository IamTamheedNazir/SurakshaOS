# 🚀 QUICK SETUP GUIDE - MySQL Version
## UmrahConnect 2.0 - Get Started in 10 Minutes

---

## ✅ PREREQUISITES

```bash
✓ Node.js 18+ installed
✓ MySQL 8.0+ or MariaDB 10.5+ installed
✓ Git installed
```

---

## 📦 STEP 1: CLONE REPOSITORY

```bash
git clone https://github.com/IamTamheedNazir/umrahconnect-2.0.git
cd umrahconnect-2.0/backend
```

---

## 🗄️ STEP 2: SETUP DATABASE

### **Option A: Using MySQL Command Line**

```bash
# Login to MySQL
mysql -u root -p

# Run the schema file
source database/schema.sql

# Exit MySQL
exit
```

### **Option B: Using phpMyAdmin**

1. Open phpMyAdmin
2. Click "New" to create database
3. Name it `umrahconnect`
4. Click "Import" tab
5. Choose file: `database/schema.sql`
6. Click "Go"

### **Option C: Using MySQL Workbench**

1. Open MySQL Workbench
2. Connect to your server
3. File → Run SQL Script
4. Select `database/schema.sql`
5. Click "Run"

---

## ⚙️ STEP 3: CONFIGURE ENVIRONMENT

```bash
# Copy environment file
cp .env.example .env

# Edit .env file
nano .env
```

### **Minimum Required Configuration:**

```env
# Server
NODE_ENV=development
PORT=3000

# Database (IMPORTANT: Update these!)
DB_HOST=localhost
DB_PORT=3306
DB_NAME=umrahconnect
DB_USER=root
DB_PASSWORD=your_mysql_password

# JWT Secret (Generate a random string)
JWT_SECRET=your_super_secret_jwt_key_min_32_characters_long
JWT_EXPIRE=30d

# Frontend URL
FRONTEND_URL=http://localhost:3001
```

---

## 📦 STEP 4: INSTALL DEPENDENCIES

```bash
npm install
```

---

## 🚀 STEP 5: START SERVER

```bash
# Development mode
npm run dev

# Production mode
npm start
```

---

## ✅ STEP 6: VERIFY INSTALLATION

### **Test API:**

```bash
# Health check
curl http://localhost:3000/api/health

# Expected response:
{
  "success": true,
  "message": "API is running",
  "timestamp": "2024-01-07T10:00:00.000Z"
}
```

### **Test in Browser:**

Open: `http://localhost:3000/api/health`

---

## 🎯 STEP 7: CREATE ADMIN USER

The schema automatically creates a default admin user:

```
Email: admin@umrahconnect.com
Password: Admin@123
```

**⚠️ IMPORTANT: Change this password immediately after first login!**

---

## 📝 STEP 8: TEST AUTHENTICATION

### **Register a new user:**

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test@1234",
    "first_name": "Test",
    "last_name": "User",
    "phone": "+1234567890"
  }'
```

### **Login:**

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test@1234"
  }'
```

---

## 🎉 SUCCESS!

**Your UmrahConnect 2.0 backend is now running!**

**API Base URL:** `http://localhost:3000/api`

---

## 📚 NEXT STEPS

1. **Read Documentation:**
   - API Docs: `BACKEND_API_DOCUMENTATION.md`
   - Deployment: `PRODUCTION_DEPLOYMENT_GUIDE.md`
   - Testing: `TESTING_GUIDE.md`

2. **Configure Services:**
   - Email (SendGrid/SMTP)
   - SMS (Twilio)
   - Storage (AWS S3/Cloudinary)
   - Payment Gateways

3. **Run Tests:**
   ```bash
   npm test
   ```

4. **Deploy to Production:**
   - See `PRODUCTION_DEPLOYMENT_GUIDE.md`

---

## 🔧 TROUBLESHOOTING

### **Database Connection Error:**

```bash
# Check MySQL is running
sudo systemctl status mysql

# Check credentials in .env
# Make sure DB_USER and DB_PASSWORD are correct
```

### **Port Already in Use:**

```bash
# Change PORT in .env file
PORT=3001
```

### **Module Not Found:**

```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### **Permission Denied:**

```bash
# On Linux/Mac, you might need sudo
sudo npm install -g pm2
```

---

## 📞 SUPPORT

**Issues?** Check these files:
- `INSTALLATION_GUIDE.md` - Detailed installation
- `TROUBLESHOOTING.md` - Common issues
- `FAQ.md` - Frequently asked questions

**Still stuck?** Create an issue on GitHub

---

## ✅ QUICK CHECKLIST

```
□ Node.js installed
□ MySQL installed and running
□ Repository cloned
□ Database created (umrahconnect)
□ Schema imported successfully
□ .env file configured
□ Dependencies installed
□ Server started successfully
□ Health check passing
□ Admin login working
```

---

**🎊 Congratulations! You're ready to build amazing Umrah booking experiences!** 🚀
