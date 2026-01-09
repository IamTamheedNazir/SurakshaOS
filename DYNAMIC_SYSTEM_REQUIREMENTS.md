# 🔥 UmrahConnect 2.0 - Dynamic Configuration System

## 🎯 **COMPLETE DYNAMIC SYSTEM REQUIREMENTS**

Making everything configurable from Admin Panel - NO hardcoding!

---

## 📋 **WHAT NEEDS TO BE DYNAMIC**

### **1. Payment Gateways (Admin Configurable)**
- ✅ Razorpay (API Key, Secret)
- ✅ Stripe (Publishable Key, Secret Key)
- ✅ PayPal (Client ID, Secret)
- ✅ Bank Transfer (Account details)
- ✅ UPI (UPI ID)
- ✅ Cash on Delivery
- ✅ Enable/Disable per gateway
- ✅ Test/Live mode toggle
- ✅ Transaction fees configuration

### **2. Email Configuration (SMTP)**
- ✅ SMTP Host
- ✅ SMTP Port
- ✅ SMTP Username
- ✅ SMTP Password
- ✅ From Name
- ✅ From Email
- ✅ Encryption (SSL/TLS)
- ✅ Test email functionality

### **3. SMS/WhatsApp Configuration**
- ✅ Twilio (Account SID, Auth Token, Phone)
- ✅ MSG91 (Auth Key, Sender ID)
- ✅ AWS SNS (Access Key, Secret)
- ✅ Nexmo (API Key, Secret)
- ✅ WhatsApp Business API
- ✅ Enable/Disable per provider

### **4. Cloud Storage Configuration**
- ✅ AWS S3 (Access Key, Secret, Bucket, Region)
- ✅ Wasabi (Access Key, Secret, Bucket)
- ✅ DigitalOcean Spaces
- ✅ Cloudinary (Cloud Name, API Key, Secret)
- ✅ Google Cloud Storage
- ✅ Local Storage
- ✅ Choose default provider
- ✅ Automatic failover

### **5. Analytics & Tracking**
- ✅ Google Analytics (Tracking ID)
- ✅ Facebook Pixel (Pixel ID)
- ✅ Google Tag Manager (Container ID)
- ✅ Hotjar (Site ID)
- ✅ Custom scripts

### **6. Social Media Integration**
- ✅ Facebook (App ID, Secret)
- ✅ Google (Client ID, Secret)
- ✅ Twitter (API Key, Secret)
- ✅ Instagram (Access Token)
- ✅ LinkedIn (Client ID, Secret)
- ✅ Apple (Client ID, Team ID, Key ID)

### **7. Vendor Registration Requirements**
- ✅ Business Name
- ✅ Business Logo
- ✅ Business Description
- ✅ GST Number
- ✅ PAN Number
- ✅ Hajj Certificate
- ✅ Umrah Certificate
- ✅ Tourism License
- ✅ Trade License
- ✅ Bank Details
- ✅ Address Proof
- ✅ Identity Proof
- ✅ Auto-verification rules

### **8. Booking System**
- ✅ Real-time availability
- ✅ Instant booking confirmation
- ✅ Payment gateway selection
- ✅ Booking cancellation rules
- ✅ Refund policies
- ✅ Booking modifications
- ✅ Traveler document upload
- ✅ Visa processing
- ✅ Insurance options

### **9. Commission System**
- ✅ Tiered commission rates
- ✅ Vendor-specific rates
- ✅ Category-based rates
- ✅ Automatic calculation
- ✅ Payout schedules
- ✅ Payment methods

### **10. Sample Data**
- ✅ 50+ Sample packages
- ✅ 20+ Sample vendors
- ✅ 100+ Sample users
- ✅ 50+ Sample bookings
- ✅ Reviews & ratings
- ✅ Transactions
- ✅ Complete demo data

---

## 🗄️ **ADDITIONAL DATABASE TABLES NEEDED**

### **New Tables to Add:**

```sql
-- 1. Payment Gateway Settings
CREATE TABLE payment_gateway_settings (
  id VARCHAR(36) PRIMARY KEY,
  gateway_name VARCHAR(50) NOT NULL,
  display_name VARCHAR(100),
  api_key TEXT,
  api_secret TEXT,
  webhook_secret TEXT,
  mode ENUM('test', 'live') DEFAULT 'test',
  enabled BOOLEAN DEFAULT TRUE,
  transaction_fee_percentage DECIMAL(5,2) DEFAULT 0,
  transaction_fee_fixed DECIMAL(10,2) DEFAULT 0,
  config JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 2. Email Settings
CREATE TABLE email_settings (
  id VARCHAR(36) PRIMARY KEY,
  smtp_host VARCHAR(255),
  smtp_port INT,
  smtp_username VARCHAR(255),
  smtp_password TEXT,
  smtp_encryption ENUM('ssl', 'tls', 'none') DEFAULT 'tls',
  from_name VARCHAR(255),
  from_email VARCHAR(255),
  enabled BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 3. SMS Settings
CREATE TABLE sms_settings (
  id VARCHAR(36) PRIMARY KEY,
  provider VARCHAR(50) NOT NULL,
  api_key TEXT,
  api_secret TEXT,
  sender_id VARCHAR(20),
  phone_number VARCHAR(20),
  enabled BOOLEAN DEFAULT TRUE,
  config JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 4. Storage Settings
CREATE TABLE storage_settings (
  id VARCHAR(36) PRIMARY KEY,
  provider VARCHAR(50) NOT NULL,
  access_key TEXT,
  secret_key TEXT,
  bucket_name VARCHAR(255),
  region VARCHAR(50),
  endpoint VARCHAR(255),
  is_default BOOLEAN DEFAULT FALSE,
  enabled BOOLEAN DEFAULT TRUE,
  config JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 5. Analytics Settings
CREATE TABLE analytics_settings (
  id VARCHAR(36) PRIMARY KEY,
  provider VARCHAR(50) NOT NULL,
  tracking_id VARCHAR(255),
  config JSON,
  enabled BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 6. Social Login Settings
CREATE TABLE social_login_settings (
  id VARCHAR(36) PRIMARY KEY,
  provider VARCHAR(50) NOT NULL,
  client_id TEXT,
  client_secret TEXT,
  redirect_url VARCHAR(255),
  enabled BOOLEAN DEFAULT TRUE,
  config JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 7. Vendor Documents
CREATE TABLE vendor_documents (
  id VARCHAR(36) PRIMARY KEY,
  vendor_id VARCHAR(36) NOT NULL,
  document_type ENUM('gst', 'pan', 'hajj_certificate', 'umrah_certificate', 'tourism_license', 'trade_license', 'bank_statement', 'address_proof', 'identity_proof') NOT NULL,
  document_number VARCHAR(100),
  document_file TEXT,
  issue_date DATE,
  expiry_date DATE,
  verification_status ENUM('pending', 'verified', 'rejected') DEFAULT 'pending',
  verified_by VARCHAR(36),
  verified_at TIMESTAMP NULL,
  rejection_reason TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (vendor_id) REFERENCES vendors(id) ON DELETE CASCADE
);

-- 8. Commission Rules
CREATE TABLE commission_rules (
  id VARCHAR(36) PRIMARY KEY,
  rule_name VARCHAR(100) NOT NULL,
  rule_type ENUM('global', 'vendor', 'category', 'package') NOT NULL,
  target_id VARCHAR(36),
  commission_percentage DECIMAL(5,2) NOT NULL,
  min_booking_amount DECIMAL(15,2) DEFAULT 0,
  max_booking_amount DECIMAL(15,2),
  priority INT DEFAULT 0,
  enabled BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 9. Booking Availability
CREATE TABLE booking_availability (
  id VARCHAR(36) PRIMARY KEY,
  package_id VARCHAR(36) NOT NULL,
  date DATE NOT NULL,
  available_seats INT NOT NULL,
  booked_seats INT DEFAULT 0,
  price DECIMAL(15,2),
  status ENUM('available', 'limited', 'sold_out') DEFAULT 'available',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (package_id) REFERENCES packages(id) ON DELETE CASCADE,
  UNIQUE KEY unique_package_date (package_id, date)
);

-- 10. Refund Policies
CREATE TABLE refund_policies (
  id VARCHAR(36) PRIMARY KEY,
  policy_name VARCHAR(100) NOT NULL,
  days_before_departure INT NOT NULL,
  refund_percentage DECIMAL(5,2) NOT NULL,
  cancellation_fee DECIMAL(10,2) DEFAULT 0,
  description TEXT,
  is_default BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 11. Email Templates
CREATE TABLE email_templates (
  id VARCHAR(36) PRIMARY KEY,
  template_name VARCHAR(100) NOT NULL,
  template_slug VARCHAR(100) UNIQUE NOT NULL,
  subject VARCHAR(255) NOT NULL,
  body TEXT NOT NULL,
  variables JSON,
  category VARCHAR(50),
  enabled BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 12. SMS Templates
CREATE TABLE sms_templates (
  id VARCHAR(36) PRIMARY KEY,
  template_name VARCHAR(100) NOT NULL,
  template_slug VARCHAR(100) UNIQUE NOT NULL,
  message TEXT NOT NULL,
  variables JSON,
  category VARCHAR(50),
  enabled BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 13. Notifications
CREATE TABLE notifications (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  type VARCHAR(50) NOT NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  data JSON,
  read_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id),
  INDEX idx_read_at (read_at)
);

-- 14. Activity Logs
CREATE TABLE activity_logs (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36),
  action VARCHAR(100) NOT NULL,
  entity_type VARCHAR(50),
  entity_id VARCHAR(36),
  ip_address VARCHAR(45),
  user_agent TEXT,
  data JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_user_id (user_id),
  INDEX idx_entity (entity_type, entity_id)
);

-- 15. Reviews
CREATE TABLE reviews (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  package_id VARCHAR(36) NOT NULL,
  vendor_id VARCHAR(36) NOT NULL,
  booking_id VARCHAR(36),
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title VARCHAR(255),
  comment TEXT,
  images JSON,
  helpful_count INT DEFAULT 0,
  verified_purchase BOOLEAN DEFAULT FALSE,
  status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
  admin_response TEXT,
  responded_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (package_id) REFERENCES packages(id) ON DELETE CASCADE,
  FOREIGN KEY (vendor_id) REFERENCES vendors(id) ON DELETE CASCADE,
  INDEX idx_package_id (package_id),
  INDEX idx_vendor_id (vendor_id),
  INDEX idx_status (status)
);
```

---

## 🎨 **ADMIN PANEL MODULES TO ADD**

### **1. Settings Module**
```
Admin → Settings
├── General Settings
│   ├── Site Name
│   ├── Site Logo
│   ├── Favicon
│   ├── Contact Info
│   ├── Social Links
│   └── Maintenance Mode
├── Payment Gateways
│   ├── Razorpay Configuration
│   ├── Stripe Configuration
│   ├── PayPal Configuration
│   ├── Bank Transfer Details
│   └── Test/Live Mode Toggle
├── Email Configuration
│   ├── SMTP Settings
│   ├── Email Templates
│   └── Test Email
├── SMS/WhatsApp
│   ├── Provider Selection
│   ├── API Configuration
│   └── SMS Templates
├── Cloud Storage
│   ├── AWS S3 Settings
│   ├── Wasabi Settings
│   ├── Cloudinary Settings
│   └── Default Provider
├── Analytics
│   ├── Google Analytics
│   ├── Facebook Pixel
│   └── Custom Scripts
└── Social Login
    ├── Google OAuth
    ├── Facebook Login
    ├── Apple Sign In
    └── Twitter Login
```

### **2. Vendor Management Module**
```
Admin → Vendors
├── All Vendors
├── Pending Approval
├── Verified Vendors
├── Rejected Vendors
├── Vendor Documents
│   ├── GST Certificate
│   ├── PAN Card
│   ├── Hajj Certificate
│   ├── Umrah Certificate
│   ├── Tourism License
│   └── Bank Details
├── Commission Settings
│   ├── Global Commission
│   ├── Vendor-specific
│   └── Category-based
└── Payout Management
    ├── Pending Payouts
    ├── Completed Payouts
    └── Payout History
```

### **3. Booking Management Module**
```
Admin → Bookings
├── All Bookings
├── Pending Bookings
├── Confirmed Bookings
├── Cancelled Bookings
├── Completed Bookings
├── Real-time Availability
├── Booking Calendar
├── Cancellation Requests
└── Refund Management
```

### **4. Package Management Module**
```
Admin → Packages
├── All Packages
├── Published Packages
├── Draft Packages
├── Featured Packages
├── Package Categories
├── Availability Calendar
├── Pricing Management
└── Bulk Operations
```

### **5. User Management Module**
```
Admin → Users
├── All Users
├── Customers
├── Vendors
├── Admins
├── Support Staff
├── User Roles
├── Permissions
└── Activity Logs
```

### **6. Financial Module**
```
Admin → Finance
├── Dashboard
├── Revenue Reports
├── Commission Tracking
├── Vendor Payouts
├── Refunds
├── Invoices
├── Tax Reports
└── Payment Gateway Logs
```

### **7. Marketing Module**
```
Admin → Marketing
├── Email Campaigns
├── SMS Campaigns
├── Push Notifications
├── Discount Coupons
├── Referral Program
├── Loyalty Program
└── Advertisements
```

### **8. Reports & Analytics**
```
Admin → Reports
├── Sales Reports
├── Booking Reports
├── Vendor Performance
├── User Analytics
├── Revenue Analytics
├── Package Performance
└── Custom Reports
```

---

## 📊 **SAMPLE DATA TO ADD**

### **1. Sample Packages (50+)**
```sql
-- Umrah Packages
- 7 Days Economy Umrah Package
- 10 Days Premium Umrah Package
- 14 Days Luxury Umrah Package
- Ramadan Special Umrah Package
- Family Umrah Package
- Group Umrah Package
- VIP Umrah Package
- Budget Umrah Package

-- Hajj Packages
- Standard Hajj Package
- Premium Hajj Package
- Luxury Hajj Package
- Group Hajj Package

-- Combo Packages
- Umrah + Dubai Tour
- Umrah + Turkey Tour
- Umrah + Egypt Tour
```

### **2. Sample Vendors (20+)**
```sql
- Al-Haramain Tours & Travels
- Makkah Express
- Madinah Travels
- Umrah Experts
- Holy Journey Tours
- Islamic Travel Services
- Ziyarat Tours
- Blessed Travels
- Sacred Journey
- Pilgrimage Plus
```

### **3. Sample Users (100+)**
```sql
- 80 Customers
- 15 Vendors
- 3 Admins
- 2 Support Staff
```

### **4. Sample Bookings (50+)**
```sql
- 30 Completed
- 10 Confirmed
- 5 Pending
- 5 Cancelled
```

---

## 🔧 **MISSING FEATURES TO ADD**

### **1. Real-time Features**
- ✅ Live booking availability
- ✅ Real-time seat updates
- ✅ Live price changes
- ✅ Instant notifications
- ✅ Live chat support

### **2. Document Management**
- ✅ Passport upload
- ✅ Visa documents
- ✅ Vaccination certificates
- ✅ Travel insurance
- ✅ Document verification

### **3. Communication**
- ✅ Email notifications
- ✅ SMS alerts
- ✅ WhatsApp messages
- ✅ Push notifications
- ✅ In-app messaging

### **4. Payment Features**
- ✅ Partial payments
- ✅ EMI options
- ✅ Wallet system
- ✅ Refund processing
- ✅ Invoice generation

### **5. Vendor Features**
- ✅ Vendor dashboard
- ✅ Package management
- ✅ Booking management
- ✅ Customer management
- ✅ Financial reports
- ✅ Commission tracking

---

## 🚀 **IMPLEMENTATION PLAN**

### **Phase 1: Database (Week 1)**
- Add all new tables
- Create indexes
- Add sample data
- Test relationships

### **Phase 2: Backend API (Week 2-3)**
- Settings API endpoints
- Payment gateway integration
- Email/SMS integration
- Storage integration
- Booking system API

### **Phase 3: Admin Panel (Week 4-5)**
- Settings modules
- Vendor management
- Booking management
- Financial module
- Reports module

### **Phase 4: Frontend (Week 6)**
- Vendor registration
- Real-time booking
- Payment integration
- Document upload
- User dashboard

### **Phase 5: Testing (Week 7)**
- Unit testing
- Integration testing
- User acceptance testing
- Performance testing
- Security testing

### **Phase 6: Deployment (Week 8)**
- Production setup
- Data migration
- Go live
- Monitoring
- Support

---

## ✅ **CHECKLIST**

### **Configuration**
- [ ] Payment gateways configurable
- [ ] Email SMTP configurable
- [ ] SMS providers configurable
- [ ] Storage providers configurable
- [ ] Analytics configurable
- [ ] Social login configurable

### **Vendor System**
- [ ] Registration with documents
- [ ] Document verification
- [ ] Commission system
- [ ] Payout management
- [ ] Vendor dashboard

### **Booking System**
- [ ] Real-time availability
- [ ] Instant confirmation
- [ ] Payment processing
- [ ] Document upload
- [ ] Cancellation/Refund

### **Sample Data**
- [ ] 50+ packages
- [ ] 20+ vendors
- [ ] 100+ users
- [ ] 50+ bookings
- [ ] Reviews & ratings

### **Admin Features**
- [ ] Complete settings module
- [ ] Vendor management
- [ ] Booking management
- [ ] Financial reports
- [ ] User management

---

**This is the complete roadmap for a fully dynamic, production-ready system!** 🚀

**Should I start implementing these features?** 😊
