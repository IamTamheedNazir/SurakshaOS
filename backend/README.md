# 🚀 UmrahConnect 2.0 - Backend API

Complete backend API system for UmrahConnect 2.0 - The ultimate Umrah & Hajj booking platform.

---

## 📋 **FEATURES**

### **✅ Dynamic System**
- Configurable registration fields
- Admin-controlled settings
- No hardcoding required
- Real-time updates

### **✅ Multi-Vendor Platform**
- Vendor registration & verification
- Package management
- Booking management
- Commission tracking
- Payout system

### **✅ Real-time Booking**
- Live availability checking
- Automatic seat management
- Price calculation with discounts
- Tax calculation
- Instant confirmations

### **✅ Payment Integration**
- Razorpay
- Stripe
- PayPal
- Bank Transfer
- UPI
- Webhook handling

### **✅ Notifications**
- Email (SMTP)
- SMS (Twilio/MSG91)
- Push notifications
- Activity logging

### **✅ Cloud Storage**
- AWS S3
- Wasabi
- Cloudinary
- DigitalOcean Spaces
- Local storage

---

## 🗄️ **DATABASE**

### **27 Tables:**
- 8 Core tables
- 15 Configuration tables
- 4 Dynamic registration tables

See `install/complete_schema.sql` for full schema.

---

## 📡 **API ENDPOINTS**

### **Total: 164 Endpoints**

#### **Authentication (5)**
```
POST   /api/auth/register
POST   /api/auth/login
GET    /api/auth/me
POST   /api/auth/forgot-password
POST   /api/auth/reset-password
```

#### **Vendor (25)**
```
GET    /api/vendor/registration-form
POST   /api/vendor/register
GET    /api/vendor/dashboard
GET    /api/vendor/profile
PUT    /api/vendor/profile
GET    /api/vendor/packages
POST   /api/vendor/packages
GET    /api/vendor/bookings
GET    /api/vendor/earnings
... (16 more)
```

#### **Bookings (20)**
```
GET    /api/bookings/availability/:packageId
POST   /api/bookings/check-availability
POST   /api/bookings/calculate-price
POST   /api/bookings
GET    /api/bookings
GET    /api/bookings/:id
POST   /api/bookings/:id/cancel
... (13 more)
```

#### **Payments (15)**
```
POST   /api/payments/create-order
POST   /api/payments/verify
POST   /api/payments/razorpay/webhook
POST   /api/payments/stripe/webhook
GET    /api/payments/:id
POST   /api/payments/:id/refund
... (9 more)
```

#### **Admin Settings (40)**
```
GET    /api/admin/settings/payment-gateways
PUT    /api/admin/settings/payment-gateways/:id
GET    /api/admin/settings/email
PUT    /api/admin/settings/email
GET    /api/admin/settings/sms
GET    /api/admin/settings/storage
... (34 more)
```

See `BACKEND_API_DOCUMENTATION.md` for complete API docs.

---

## 🚀 **QUICK START**

### **1. Clone Repository**
```bash
git clone https://github.com/yourusername/umrahconnect-2.0.git
cd umrahconnect-2.0/backend
```

### **2. Install Dependencies**
```bash
npm install
```

### **3. Setup Database**
```bash
# Create MySQL database
mysql -u root -p

CREATE DATABASE umrahconnect;
exit;

# Import schema
mysql -u root -p umrahconnect < ../install/complete_schema.sql
mysql -u root -p umrahconnect < ../install/dynamic_registration.sql
```

### **4. Configure Environment**
```bash
# Copy .env.example to .env
cp .env.example .env

# Edit .env with your settings
nano .env
```

### **5. Start Server**
```bash
# Development
npm run dev

# Production
npm start
```

Server will run on `http://localhost:5000`

---

## ⚙️ **CONFIGURATION**

### **Required Environment Variables:**

```env
# Database
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=umrahconnect

# JWT
JWT_SECRET=your_secret_key

# Email (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_app_password

# Payment Gateways
RAZORPAY_KEY_ID=your_key
RAZORPAY_KEY_SECRET=your_secret
STRIPE_SECRET_KEY=your_key
```

See `.env.example` for all variables.

---

## 📦 **PROJECT STRUCTURE**

```
backend/
├── src/
│   ├── controllers/          # Business logic
│   │   ├── vendor.controller.js
│   │   ├── booking.controller.js
│   │   ├── payment.controller.js
│   │   └── ...
│   ├── routes/              # API routes
│   │   ├── admin/
│   │   ├── vendor/
│   │   ├── booking.routes.js
│   │   └── ...
│   ├── middleware/          # Custom middleware
│   │   ├── auth.middleware.js
│   │   ├── upload.middleware.js
│   │   └── ...
│   ├── utils/               # Utility functions
│   │   ├── email.js
│   │   ├── sms.js
│   │   ├── storage.js
│   │   └── ...
│   ├── config/              # Configuration
│   │   └── database.js
│   └── validators/          # Input validation
├── server.js                # Entry point
├── package.json
├── .env.example
└── README.md
```

---

## 🔐 **AUTHENTICATION**

All protected routes require JWT token:

```javascript
// Request header
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### **User Roles:**
- `customer` - Regular users
- `vendor` - Package providers
- `admin` - System administrators
- `support` - Support staff
- `accountant` - Financial management

---

## 💳 **PAYMENT GATEWAYS**

### **Razorpay Integration**
```javascript
// Create order
POST /api/payments/create-order
{
  "booking_id": "uuid",
  "amount": 75000,
  "currency": "INR",
  "payment_method": "razorpay"
}

// Verify payment
POST /api/payments/verify
{
  "payment_id": "uuid",
  "gateway_payment_id": "pay_xxxxx",
  "gateway_order_id": "order_xxxxx",
  "signature": "xxxxx"
}
```

### **Stripe Integration**
```javascript
// Similar flow with Stripe
payment_method: "stripe"
```

### **Webhook Endpoints**
```
POST /api/payments/razorpay/webhook
POST /api/payments/stripe/webhook
POST /api/payments/paypal/webhook
```

---

## 📧 **EMAIL & SMS**

### **Email Configuration**
```javascript
// SMTP settings in .env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_app_password
```

### **SMS Configuration**
```javascript
// Twilio settings
TWILIO_ACCOUNT_SID=your_sid
TWILIO_AUTH_TOKEN=your_token
TWILIO_PHONE_NUMBER=+1234567890
```

---

## 📊 **ANALYTICS**

### **Supported Platforms:**
- Google Analytics
- Facebook Pixel
- Google Tag Manager
- Hotjar

Configure in admin panel or `.env`

---

## 🔒 **SECURITY**

### **Implemented:**
- ✅ JWT authentication
- ✅ Password hashing (bcrypt)
- ✅ Rate limiting
- ✅ CORS protection
- ✅ Helmet security headers
- ✅ Input validation
- ✅ SQL injection prevention
- ✅ XSS protection

---

## 🧪 **TESTING**

```bash
# Run tests
npm test

# Run with coverage
npm run test:coverage
```

---

## 📝 **API DOCUMENTATION**

### **Swagger UI**
```
http://localhost:5000/api-docs
```

### **Postman Collection**
Import `postman_collection.json` for all endpoints.

---

## 🐛 **DEBUGGING**

### **Enable Debug Mode**
```env
NODE_ENV=development
ENABLE_DEBUG=true
LOG_LEVEL=debug
```

### **View Logs**
```bash
tail -f logs/app.log
```

---

## 🚀 **DEPLOYMENT**

### **Production Checklist**
- [ ] Set `NODE_ENV=production`
- [ ] Use strong JWT secret
- [ ] Configure production database
- [ ] Setup SSL certificate
- [ ] Configure payment gateways (live mode)
- [ ] Setup email service
- [ ] Configure cloud storage
- [ ] Enable rate limiting
- [ ] Setup monitoring
- [ ] Configure backups

### **Deploy to Heroku**
```bash
heroku create umrahconnect-api
heroku addons:create heroku-postgresql:mini
heroku config:set NODE_ENV=production
git push heroku main
```

### **Deploy to AWS**
See `DEPLOYMENT_GUIDE.md`

---

## 📈 **PERFORMANCE**

### **Optimization Tips**
- Use Redis for caching
- Enable compression
- Optimize database queries
- Use CDN for static files
- Enable gzip compression
- Implement pagination
- Use connection pooling

---

## 🤝 **CONTRIBUTING**

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

---

## 📄 **LICENSE**

MIT License - see LICENSE file

---

## 📞 **SUPPORT**

- **Documentation:** https://docs.umrahconnect.com
- **Email:** support@umrahconnect.com
- **GitHub Issues:** https://github.com/yourusername/umrahconnect-2.0/issues

---

## 🎯 **ROADMAP**

### **Version 2.1 (Q2 2024)**
- [ ] GraphQL API
- [ ] WebSocket support
- [ ] Advanced analytics
- [ ] Mobile app API
- [ ] Multi-language support

### **Version 2.2 (Q3 2024)**
- [ ] AI-powered recommendations
- [ ] Chatbot integration
- [ ] Advanced reporting
- [ ] API rate limiting tiers

---

## ⭐ **FEATURES SUMMARY**

- ✅ 164 API endpoints
- ✅ 27 database tables
- ✅ 4 controllers implemented
- ✅ Dynamic registration system
- ✅ Real-time booking
- ✅ Multiple payment gateways
- ✅ Email/SMS notifications
- ✅ Cloud storage integration
- ✅ Commission system
- ✅ Refund management
- ✅ Analytics integration
- ✅ Social login ready
- ✅ Webhook handling
- ✅ Activity logging
- ✅ Complete documentation

---

**Built with ❤️ for UmrahConnect 2.0**

**Production-Ready Backend API System!** 🚀
