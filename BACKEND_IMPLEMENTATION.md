# UmrahConnect 2.0 - Backend Implementation Guide

## 🚀 **COMPLETE BACKEND SETUP**

This guide covers the complete Node.js + Express backend implementation for UmrahConnect 2.0.

---

## 📋 **TABLE OF CONTENTS**

1. [Tech Stack](#tech-stack)
2. [Project Structure](#project-structure)
3. [Installation](#installation)
4. [Environment Variables](#environment-variables)
5. [Database Setup](#database-setup)
6. [API Implementation](#api-implementation)
7. [Authentication](#authentication)
8. [Payment Integration](#payment-integration)
9. [Email & SMS](#email--sms)
10. [File Upload](#file-upload)
11. [Deployment](#deployment)

---

## 🛠️ **TECH STACK**

### **Core:**
- Node.js (v18+)
- Express.js (v4.18+)
- PostgreSQL (v14+)
- Redis (v7+)

### **Authentication:**
- JWT (jsonwebtoken)
- Passport.js
- bcrypt

### **Payment:**
- Razorpay SDK
- Stripe SDK
- PayPal SDK

### **Communication:**
- Nodemailer (Email)
- Twilio (SMS/WhatsApp)
- Firebase Admin (Push)

### **Storage:**
- AWS SDK (S3)
- Cloudinary SDK
- Multer

### **Others:**
- Express Validator
- Helmet (Security)
- CORS
- Morgan (Logging)
- Winston (Advanced Logging)
- node-cron (Scheduling)

---

## 📁 **PROJECT STRUCTURE**

```
backend/
├── src/
│   ├── config/
│   │   ├── database.js
│   │   ├── redis.js
│   │   ├── passport.js
│   │   ├── cloudinary.js
│   │   ├── aws.js
│   │   └── firebase.js
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── user.controller.js
│   │   ├── vendor.controller.js
│   │   ├── package.controller.js
│   │   ├── booking.controller.js
│   │   ├── payment.controller.js
│   │   ├── subscription.controller.js
│   │   ├── advertisement.controller.js
│   │   ├── commission.controller.js
│   │   ├── referral.controller.js
│   │   ├── loyalty.controller.js
│   │   ├── notification.controller.js
│   │   ├── language.controller.js
│   │   └── admin.controller.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Vendor.js
│   │   ├── Package.js
│   │   ├── Booking.js
│   │   ├── Payment.js
│   │   ├── Subscription.js
│   │   ├── Advertisement.js
│   │   ├── Commission.js
│   │   ├── Referral.js
│   │   ├── Loyalty.js
│   │   └── ... (33 models total)
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── user.routes.js
│   │   ├── vendor.routes.js
│   │   ├── package.routes.js
│   │   ├── booking.routes.js
│   │   ├── payment.routes.js
│   │   ├── subscription.routes.js
│   │   ├── advertisement.routes.js
│   │   ├── commission.routes.js
│   │   ├── referral.routes.js
│   │   ├── loyalty.routes.js
│   │   ├── notification.routes.js
│   │   ├── language.routes.js
│   │   └── admin.routes.js
│   ├── middleware/
│   │   ├── auth.middleware.js
│   │   ├── role.middleware.js
│   │   ├── validation.middleware.js
│   │   ├── upload.middleware.js
│   │   ├── rateLimit.middleware.js
│   │   └── error.middleware.js
│   ├── services/
│   │   ├── email.service.js
│   │   ├── sms.service.js
│   │   ├── whatsapp.service.js
│   │   ├── push.service.js
│   │   ├── payment.service.js
│   │   ├── storage.service.js
│   │   ├── currency.service.js
│   │   └── translation.service.js
│   ├── utils/
│   │   ├── logger.js
│   │   ├── helpers.js
│   │   ├── constants.js
│   │   └── validators.js
│   ├── jobs/
│   │   ├── commission.job.js
│   │   ├── subscription.job.js
│   │   ├── currency.job.js
│   │   └── notification.job.js
│   └── app.js
├── tests/
│   ├── unit/
│   └── integration/
├── .env.example
├── .gitignore
├── package.json
├── README.md
└── server.js
```

---

## 📦 **INSTALLATION**

### **1. Clone Repository**
```bash
git clone https://github.com/IamTamheedNazir/umrahconnect-2.0.git
cd umrahconnect-2.0/backend
```

### **2. Install Dependencies**
```bash
npm install
```

### **3. Required NPM Packages**
```json
{
  "dependencies": {
    "express": "^4.18.2",
    "pg": "^8.11.3",
    "pg-hstore": "^2.3.4",
    "sequelize": "^6.35.2",
    "redis": "^4.6.11",
    "jsonwebtoken": "^9.0.2",
    "bcrypt": "^5.1.1",
    "passport": "^0.7.0",
    "passport-jwt": "^4.0.1",
    "passport-google-oauth20": "^2.0.0",
    "passport-facebook": "^3.0.0",
    "express-validator": "^7.0.1",
    "helmet": "^7.1.0",
    "cors": "^2.8.5",
    "morgan": "^1.10.0",
    "winston": "^3.11.0",
    "dotenv": "^16.3.1",
    "nodemailer": "^6.9.7",
    "twilio": "^4.20.0",
    "firebase-admin": "^12.0.0",
    "razorpay": "^2.9.2",
    "stripe": "^14.10.0",
    "@paypal/checkout-server-sdk": "^1.0.3",
    "aws-sdk": "^2.1505.0",
    "cloudinary": "^1.41.0",
    "multer": "^1.4.5-lts.1",
    "axios": "^1.6.2",
    "node-cron": "^3.0.3",
    "express-rate-limit": "^7.1.5",
    "compression": "^1.7.4",
    "cookie-parser": "^1.4.6"
  },
  "devDependencies": {
    "nodemon": "^3.0.2",
    "jest": "^29.7.0",
    "supertest": "^6.3.3",
    "eslint": "^8.55.0"
  }
}
```

---

## 🔐 **ENVIRONMENT VARIABLES**

Create `.env` file in backend root:

```env
# Server Configuration
NODE_ENV=development
PORT=5000
API_URL=http://localhost:5000
FRONTEND_URL=http://localhost:3000

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=umrahconnect
DB_USER=postgres
DB_PASSWORD=your_password

# Redis Configuration
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRE=7d
JWT_REFRESH_SECRET=your_refresh_token_secret
JWT_REFRESH_EXPIRE=30d

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback

# Facebook OAuth
FACEBOOK_APP_ID=your_facebook_app_id
FACEBOOK_APP_SECRET=your_facebook_app_secret
FACEBOOK_CALLBACK_URL=http://localhost:5000/api/auth/facebook/callback

# Apple OAuth
APPLE_CLIENT_ID=your_apple_client_id
APPLE_TEAM_ID=your_apple_team_id
APPLE_KEY_ID=your_apple_key_id
APPLE_PRIVATE_KEY=your_apple_private_key

# Email Configuration (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=noreply@umrahconnect.com
SMTP_PASSWORD=your_smtp_password
EMAIL_FROM_NAME=UmrahConnect
EMAIL_FROM_ADDRESS=noreply@umrahconnect.com

# Twilio (SMS/WhatsApp)
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=+1234567890
TWILIO_WHATSAPP_NUMBER=+1234567890

# MSG91 (SMS)
MSG91_AUTH_KEY=your_msg91_auth_key
MSG91_SENDER_ID=UMRAHC

# Firebase (Push Notifications)
FIREBASE_PROJECT_ID=your_firebase_project_id
FIREBASE_PRIVATE_KEY=your_firebase_private_key
FIREBASE_CLIENT_EMAIL=your_firebase_client_email

# Razorpay
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

# Stripe
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret

# PayPal
PAYPAL_CLIENT_ID=your_paypal_client_id
PAYPAL_CLIENT_SECRET=your_paypal_client_secret
PAYPAL_MODE=sandbox

# AWS S3
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_REGION=us-east-1
AWS_S3_BUCKET=umrahconnect-uploads

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Currency Exchange API
EXCHANGE_RATE_API_KEY=your_exchange_rate_api_key
FIXER_API_KEY=your_fixer_api_key

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Session
SESSION_SECRET=your_session_secret

# Logging
LOG_LEVEL=info
```

---

## 🗄️ **DATABASE SETUP**

### **1. Install PostgreSQL**
```bash
# Ubuntu/Debian
sudo apt-get install postgresql postgresql-contrib

# macOS
brew install postgresql

# Windows
# Download from https://www.postgresql.org/download/windows/
```

### **2. Create Database**
```bash
# Login to PostgreSQL
sudo -u postgres psql

# Create database
CREATE DATABASE umrahconnect;

# Create user
CREATE USER umrah_admin WITH PASSWORD 'your_password';

# Grant privileges
GRANT ALL PRIVILEGES ON DATABASE umrahconnect TO umrah_admin;

# Exit
\q
```

### **3. Run Migrations**
```bash
# Install Sequelize CLI
npm install -g sequelize-cli

# Run migrations
npx sequelize-cli db:migrate

# Run seeders (optional)
npx sequelize-cli db:seed:all
```

---

## 🔧 **API IMPLEMENTATION**

### **server.js**
```javascript
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const compression = require('compression');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const app = require('./src/app');
const logger = require('./src/utils/logger');
const { connectDB } = require('./src/config/database');
const { connectRedis } = require('./src/config/redis');

const PORT = process.env.PORT || 5000;

// Connect to Database
connectDB();

// Connect to Redis
connectRedis();

// Start Server
app.listen(PORT, () => {
  logger.info(`🚀 Server running on port ${PORT}`);
  logger.info(`📍 Environment: ${process.env.NODE_ENV}`);
  logger.info(`🌐 API URL: ${process.env.API_URL}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  logger.error('Unhandled Rejection:', err);
  process.exit(1);
});
```

### **src/app.js**
```javascript
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const compression = require('compression');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');

const errorMiddleware = require('./middleware/error.middleware');
const logger = require('./utils/logger');

// Import routes
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const vendorRoutes = require('./routes/vendor.routes');
const packageRoutes = require('./routes/package.routes');
const bookingRoutes = require('./routes/booking.routes');
const paymentRoutes = require('./routes/payment.routes');
const subscriptionRoutes = require('./routes/subscription.routes');
const advertisementRoutes = require('./routes/advertisement.routes');
const commissionRoutes = require('./routes/commission.routes');
const referralRoutes = require('./routes/referral.routes');
const loyaltyRoutes = require('./routes/loyalty.routes');
const notificationRoutes = require('./routes/notification.routes');
const languageRoutes = require('./routes/language.routes');
const adminRoutes = require('./routes/admin.routes');

const app = express();

// Security middleware
app.use(helmet());

// CORS
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
}));

// Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Cookie parser
app.use(cookieParser());

// Compression
app.use(compression());

// Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined', {
    stream: { write: (message) => logger.info(message.trim()) }
  }));
}

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  message: 'Too many requests from this IP, please try again later.',
});
app.use('/api/', limiter);

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is healthy',
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/vendors', vendorRoutes);
app.use('/api/packages', packageRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/advertisements', advertisementRoutes);
app.use('/api/commissions', commissionRoutes);
app.use('/api/referrals', referralRoutes);
app.use('/api/loyalty', loyaltyRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/languages', languageRoutes);
app.use('/api/admin', adminRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

// Error handler
app.use(errorMiddleware);

module.exports = app;
```

### **src/config/database.js**
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
    dialect: 'postgres',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    pool: {
      max: 10,
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

### **src/config/redis.js**
```javascript
const redis = require('redis');
const logger = require('../utils/logger');

const client = redis.createClient({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  password: process.env.REDIS_PASSWORD,
});

const connectRedis = async () => {
  try {
    await client.connect();
    logger.info('✅ Redis connected successfully');
  } catch (error) {
    logger.error('❌ Redis connection failed:', error);
  }
};

client.on('error', (err) => {
  logger.error('Redis error:', err);
});

module.exports = { client, connectRedis };
```

---

## 🔐 **AUTHENTICATION**

### **src/middleware/auth.middleware.js**
```javascript
const jwt = require('jsonwebtoken');
const { User } = require('../models');

const protect = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this route',
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findByPk(decoded.id);

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'User not found',
      });
    }

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route',
    });
  }
};

module.exports = { protect };
```

---

## 💳 **PAYMENT INTEGRATION**

### **src/services/payment.service.js**
```javascript
const Razorpay = require('razorpay');
const Stripe = require('stripe');
const paypal = require('@paypal/checkout-server-sdk');

// Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// PayPal
const paypalClient = new paypal.core.PayPalHttpClient(
  process.env.PAYPAL_MODE === 'sandbox'
    ? new paypal.core.SandboxEnvironment(
        process.env.PAYPAL_CLIENT_ID,
        process.env.PAYPAL_CLIENT_SECRET
      )
    : new paypal.core.LiveEnvironment(
        process.env.PAYPAL_CLIENT_ID,
        process.env.PAYPAL_CLIENT_SECRET
      )
);

module.exports = {
  razorpay,
  stripe,
  paypalClient,
};
```

---

## 📧 **EMAIL & SMS**

### **src/services/email.service.js**
```javascript
const nodemailer = require('nodemailer');
const logger = require('../utils/logger');

const transporter = nodemailer.createTransporter({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

const sendEmail = async (options) => {
  try {
    const mailOptions = {
      from: `${process.env.EMAIL_FROM_NAME} <${process.env.EMAIL_FROM_ADDRESS}>`,
      to: options.to,
      subject: options.subject,
      html: options.html,
    };

    await transporter.sendMail(mailOptions);
    logger.info(`Email sent to ${options.to}`);
  } catch (error) {
    logger.error('Email send error:', error);
    throw error;
  }
};

module.exports = { sendEmail };
```

### **src/services/sms.service.js**
```javascript
const twilio = require('twilio');
const logger = require('../utils/logger');

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

const sendSMS = async (to, message) => {
  try {
    await client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: to,
    });
    logger.info(`SMS sent to ${to}`);
  } catch (error) {
    logger.error('SMS send error:', error);
    throw error;
  }
};

module.exports = { sendSMS };
```

---

## 📤 **FILE UPLOAD**

### **src/middleware/upload.middleware.js**
```javascript
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|pdf|doc|docx/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type'));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
});

module.exports = upload;
```

---

## 🚀 **DEPLOYMENT**

### **Production Checklist:**
- [ ] Set NODE_ENV=production
- [ ] Use strong JWT secrets
- [ ] Enable HTTPS
- [ ] Setup SSL certificates
- [ ] Configure firewall
- [ ] Setup monitoring (PM2, New Relic)
- [ ] Enable logging (Winston, Loggly)
- [ ] Setup backups
- [ ] Configure CDN
- [ ] Enable caching (Redis)
- [ ] Setup load balancer
- [ ] Configure auto-scaling

### **Deployment Commands:**
```bash
# Install PM2
npm install -g pm2

# Start application
pm2 start server.js --name umrahconnect

# Save PM2 configuration
pm2 save

# Setup PM2 startup
pm2 startup
```

---

**Backend Implementation Complete!** ✅

Next: Database Schema & Migrations
