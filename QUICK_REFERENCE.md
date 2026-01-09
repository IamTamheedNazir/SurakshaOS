# 🚀 UmrahConnect 2.0 - Quick Reference Guide

## ⚡ **INSTANT SETUP (5 MINUTES)**

```bash
# 1. Clone & Navigate
git clone https://github.com/yourusername/umrahconnect-2.0.git
cd umrahconnect-2.0/backend

# 2. Run Setup Script
chmod +x setup.sh
./setup.sh

# 3. Start Server
npm run dev

# ✅ Done! Server running on http://localhost:5000
```

---

## 📡 **QUICK API REFERENCE**

### **Test Server:**
```bash
curl http://localhost:5000/health
```

### **Get Registration Form:**
```bash
curl http://localhost:5000/api/vendor/registration-form
```

### **Check Availability:**
```bash
curl -X POST http://localhost:5000/api/bookings/check-availability \
  -H "Content-Type: application/json" \
  -d '{"package_id":"uuid","departure_date":"2024-03-15","travelers":4}'
```

### **Calculate Price:**
```bash
curl -X POST http://localhost:5000/api/bookings/calculate-price \
  -H "Content-Type: application/json" \
  -d '{"package_id":"uuid","adults":2,"children":1,"infants":1}'
```

---

## 🔑 **AUTHENTICATION**

### **Register:**
```javascript
POST /api/auth/register
{
  "email": "user@example.com",
  "password": "password123",
  "first_name": "John",
  "last_name": "Doe",
  "phone": "+911234567890"
}
```

### **Login:**
```javascript
POST /api/auth/login
{
  "email": "user@example.com",
  "password": "password123"
}
// Returns: { token: "jwt_token_here" }
```

### **Use Token:**
```javascript
Authorization: Bearer {token}
```

---

## 📦 **VENDOR QUICK START**

### **1. Register Vendor:**
```javascript
POST /api/vendor/register
Content-Type: multipart/form-data

// Form fields:
first_name: John
last_name: Doe
email: vendor@example.com
company_name: ABC Tours
company_logo: [file]
gst_certificate: [file]
pan_card: [file]
// ... all dynamic fields
```

### **2. Get Dashboard:**
```javascript
GET /api/vendor/dashboard
Authorization: Bearer {vendor_token}

// Returns:
{
  stats: {
    total_packages: 25,
    total_bookings: 150,
    total_revenue: 5000000,
    average_rating: 4.5
  },
  recent_bookings: [...],
  revenue_chart: [...]
}
```

### **3. Create Package:**
```javascript
POST /api/vendor/packages
Authorization: Bearer {vendor_token}
Content-Type: multipart/form-data

title: 7 Days Economy Umrah Package
price: 75000
duration_days: 7
images: [file1, file2, file3]
```

---

## 🎫 **BOOKING QUICK START**

### **1. Check Availability:**
```javascript
POST /api/bookings/check-availability
{
  "package_id": "uuid",
  "departure_date": "2024-03-15",
  "travelers": 4
}

// Returns:
{
  available: true,
  remaining_seats: 46
}
```

### **2. Calculate Price:**
```javascript
POST /api/bookings/calculate-price
{
  "package_id": "uuid",
  "adults": 2,
  "children": 1,
  "infants": 1
}

// Returns:
{
  subtotal: 150000,
  discount: 7500,
  tax: 25650,
  total_amount: 168150
}
```

### **3. Create Booking:**
```javascript
POST /api/bookings
Authorization: Bearer {token}
{
  "package_id": "uuid",
  "departure_date": "2024-03-15",
  "travelers": [
    {
      "type": "adult",
      "first_name": "John",
      "last_name": "Doe",
      "passport_number": "A1234567"
    }
  ],
  "total_amount": 168150
}
```

---

## 💳 **PAYMENT QUICK START**

### **1. Create Payment Order:**
```javascript
POST /api/payments/create-order
Authorization: Bearer {token}
{
  "booking_id": "uuid",
  "amount": 168150,
  "currency": "INR",
  "payment_method": "razorpay"
}

// Returns:
{
  gateway_order_id: "order_xxxxx",
  api_key: "rzp_live_xxxxx"
}
```

### **2. Verify Payment:**
```javascript
POST /api/payments/verify
Authorization: Bearer {token}
{
  "payment_id": "uuid",
  "gateway_payment_id": "pay_xxxxx",
  "gateway_order_id": "order_xxxxx",
  "signature": "xxxxx"
}

// Returns:
{
  status: "completed",
  booking_status: "confirmed"
}
```

---

## ⚙️ **SETTINGS QUICK START**

### **Configure Payment Gateway:**
```javascript
POST /api/admin/settings/payment-gateways
Authorization: Bearer {admin_token}
{
  "gateway_name": "razorpay",
  "display_name": "Razorpay",
  "api_key": "rzp_live_xxxxx",
  "api_secret": "xxxxx",
  "enabled": true
}
```

### **Configure Email:**
```javascript
PUT /api/admin/settings/email
Authorization: Bearer {admin_token}
{
  "smtp_host": "smtp.gmail.com",
  "smtp_port": 587,
  "smtp_username": "your@email.com",
  "smtp_password": "app_password",
  "from_name": "UmrahConnect",
  "from_email": "noreply@umrahconnect.com"
}
```

### **Test Email:**
```javascript
POST /api/admin/settings/email/test
Authorization: Bearer {admin_token}
{
  "to_email": "test@example.com"
}
```

---

## 🗄️ **DATABASE QUICK REFERENCE**

### **Tables (27):**
```
Core (8):
- users, vendors, packages, bookings
- payments, settings, currencies, languages

Configuration (15):
- payment_gateway_settings, email_settings
- sms_settings, storage_settings
- analytics_settings, social_login_settings
- vendor_documents, commission_rules
- booking_availability, refund_policies
- email_templates, sms_templates
- notifications, activity_logs, reviews

Dynamic Registration (4):
- registration_fields
- vendor_registration_data
- registration_field_groups
- registration_field_group_mapping
```

---

## 📊 **COMMON QUERIES**

### **Get All Bookings:**
```sql
SELECT * FROM bookings 
WHERE user_id = 'user_uuid' 
ORDER BY created_at DESC;
```

### **Get Vendor Revenue:**
```sql
SELECT SUM(total_amount) as revenue
FROM bookings
WHERE vendor_id = 'vendor_uuid'
AND payment_status = 'paid';
```

### **Get Available Packages:**
```sql
SELECT * FROM packages
WHERE status = 'published'
AND available_seats > 0
ORDER BY created_at DESC;
```

---

## 🔧 **TROUBLESHOOTING**

### **Database Connection Error:**
```bash
# Check MySQL is running
sudo systemctl status mysql

# Check credentials in .env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=umrahconnect
```

### **Port Already in Use:**
```bash
# Change port in .env
PORT=5001

# Or kill process on port 5000
lsof -ti:5000 | xargs kill -9
```

### **JWT Token Invalid:**
```bash
# Generate new secret in .env
JWT_SECRET=$(openssl rand -base64 32)
```

---

## 📝 **ENVIRONMENT VARIABLES**

### **Essential:**
```env
# Database
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=umrahconnect

# JWT
JWT_SECRET=your_secret_key

# Server
PORT=5000
NODE_ENV=development
```

### **Optional:**
```env
# Email
SMTP_HOST=smtp.gmail.com
SMTP_USER=your@email.com
SMTP_PASSWORD=app_password

# Payment
RAZORPAY_KEY_ID=rzp_xxxxx
RAZORPAY_KEY_SECRET=xxxxx

# Storage
AWS_ACCESS_KEY_ID=xxxxx
AWS_SECRET_ACCESS_KEY=xxxxx
```

---

## 🎯 **USEFUL COMMANDS**

```bash
# Development
npm run dev

# Production
npm start

# Install dependencies
npm install

# Database migration
mysql -u root -p umrahconnect < schema.sql

# Check logs
tail -f logs/app.log

# Test API
curl http://localhost:5000/health
```

---

## 📚 **DOCUMENTATION FILES**

```
PROJECT_SUMMARY.md              - Complete overview
BACKEND_API_DOCUMENTATION.md    - All 164 endpoints
backend/README.md               - Backend setup
SIMPLE_SETUP.md                 - Easy setup
INSTALLATION_GUIDE.md           - Installation wizard
DEPLOYMENT_GUIDE.md             - AWS deployment
complete_schema.sql             - Database schema
.env.example                    - Environment variables
```

---

## 🚀 **DEPLOYMENT CHECKLIST**

```
□ Set NODE_ENV=production
□ Use strong JWT_SECRET
□ Configure production database
□ Setup SSL certificate
□ Configure payment gateways (live mode)
□ Setup email service
□ Configure cloud storage
□ Enable rate limiting
□ Setup monitoring
□ Configure backups
□ Test all endpoints
□ Load testing
```

---

## 💡 **QUICK TIPS**

1. **Always use transactions** for critical operations
2. **Validate input** on both client and server
3. **Use environment variables** for sensitive data
4. **Enable CORS** only for trusted domains
5. **Implement rate limiting** to prevent abuse
6. **Log everything** for debugging
7. **Use connection pooling** for database
8. **Compress responses** for better performance
9. **Cache frequently accessed data**
10. **Monitor server health** regularly

---

## 🎉 **SUCCESS INDICATORS**

✅ Server starts without errors
✅ Database connection successful
✅ Health endpoint returns 200
✅ Registration form loads
✅ Booking creation works
✅ Payment processing works
✅ Emails/SMS sending
✅ File uploads working
✅ All tests passing

---

## 📞 **NEED HELP?**

1. Check **PROJECT_SUMMARY.md** for overview
2. Check **BACKEND_API_DOCUMENTATION.md** for API details
3. Check **SIMPLE_SETUP.md** for setup issues
4. Check logs in `logs/app.log`
5. Check database connection
6. Check environment variables

---

**🎊 QUICK REFERENCE COMPLETE! 🎊**

**Everything you need at your fingertips!**
