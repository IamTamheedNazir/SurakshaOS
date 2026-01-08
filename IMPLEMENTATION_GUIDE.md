# UmrahConnect 2.0 - Complete Implementation Guide

## 🎯 PROJECT OVERVIEW
A comprehensive Umrah marketplace platform connecting customers with travel vendors, featuring package management, booking system, CRM, payments, analytics, **multi-gateway payments**, **role-based access control**, **support ticket system**, **social authentication**, and **cloud storage management**.

---

## 📁 FRONTEND - COMPLETE FILE STRUCTURE (108 Files)

### **NEW ADDITIONS:**

#### **Payment Gateway System (3 Files)**
```
frontend/src/components/payment/
├── PaymentGateway.js          # Multi-gateway payment component
└── PaymentGateway.css
```

#### **Admin Panel (8 Files)**
```
frontend/src/pages/admin/
├── AdminPaymentSettings.js    # Payment gateway management
├── AdminPaymentSettings.css
├── AdminRoleManagement.js     # Role & permission system
├── AdminRoleManagement.css
├── SupportTicketSystem.js     # Support ticket management
├── SupportTicketSystem.css
├── CloudStorageSettings.js    # Cloud storage management
└── CloudStorageSettings.css
```

#### **Authentication (2 Files)**
```
frontend/src/components/auth/
├── SocialLogin.js             # Social login component
└── SocialLogin.css
```

---

## 💳 PAYMENT GATEWAY SYSTEM

### **Supported Payment Gateways:**

1. **Razorpay** 💳
   - Credit/Debit Cards
   - UPI
   - Net Banking
   - Wallets
   - Processing Fee: 2.0%

2. **Stripe** 💰
   - International Cards
   - Apple Pay
   - Google Pay
   - Processing Fee: 2.5%

3. **PayPal** 🅿️
   - PayPal Balance
   - Cards
   - Processing Fee: 3.0%

4. **Bank Transfer** 🏦
   - NEFT/RTGS/IMPS
   - Direct Bank Details Display
   - UPI with QR Code
   - Receipt Upload
   - Processing Fee: 0%

5. **UPI** 📱
   - Google Pay
   - PhonePe
   - Paytm
   - Processing Fee: 0%

6. **Cash Payment** 💵
   - Pay at Office
   - Processing Fee: 0%

### **Payment Gateway Features:**
- ✅ Dynamic gateway configuration
- ✅ Admin can enable/disable gateways
- ✅ API key management
- ✅ Processing fee configuration
- ✅ Test/Live mode toggle
- ✅ Webhook configuration
- ✅ Transaction tracking
- ✅ Receipt generation
- ✅ Refund management

---

## 🔐 ADMIN ROLE & PERMISSION SYSTEM

### **Predefined Roles:**

1. **Super Admin** 🔴
   - Full system access
   - All permissions (CRUD)
   - Cannot be deleted
   - System role

2. **Admin** 🟠
   - Administrative access
   - Most permissions
   - Limited delete access
   - System role

3. **Sales Manager** 🟢
   - Manage bookings & customers
   - Package management
   - Sales operations
   - Custom role

4. **Support Agent** 🔵
   - Handle support tickets
   - View bookings & customers
   - Limited edit access
   - Custom role

5. **Accountant** 🟣
   - Manage payments & invoices
   - Financial reports
   - View-only for other modules
   - Custom role

### **Permission Modules:**
- Dashboard (View, Create, Edit, Delete)
- Users (View, Create, Edit, Delete)
- Vendors (View, Create, Edit, Delete)
- Packages (View, Create, Edit, Delete)
- Bookings (View, Create, Edit, Delete)
- Payments (View, Create, Edit, Delete)
- Reports (View, Create, Edit, Delete)
- Settings (View, Create, Edit, Delete)
- Roles (View, Create, Edit, Delete)
- Support (View, Create, Edit, Delete)

### **Role Management Features:**
- ✅ Create custom roles
- ✅ Granular permissions (VCUD)
- ✅ Assign roles to team members
- ✅ Role-based access control
- ✅ Activity logging
- ✅ Team member management
- ✅ Invite system
- ✅ Status management (Active/Inactive)

---

## 🎫 SUPPORT TICKET SYSTEM

### **Ticket Categories:**
- Payment 💰
- Booking 📋
- Visa 📄
- Package 📦
- Technical 🔧
- Other ❓

### **Priority Levels:**
- Low (Green)
- Medium (Orange)
- High (Red)
- Urgent (Dark Red)

### **Ticket Status:**
- Open (Blue)
- In Progress (Orange)
- Resolved (Green)
- Closed (Gray)

### **Support Features:**
- ✅ Create & manage tickets
- ✅ Real-time messaging
- ✅ File attachments
- ✅ Ticket assignment
- ✅ Priority management
- ✅ Status tracking
- ✅ Customer information
- ✅ Response templates
- ✅ Email notifications
- ✅ Activity timeline
- ✅ Search & filters
- ✅ SLA tracking

---

## 🔑 SOCIAL AUTHENTICATION

### **Supported Login Methods:**

1. **Google Login** 🔴
   - OAuth 2.0
   - One-click login
   - Profile sync

2. **Facebook Login** 🔵
   - Facebook SDK
   - Profile import
   - Friend connections

3. **Apple Login** ⚫
   - Sign in with Apple
   - Privacy-focused
   - Email masking

4. **Phone Login** 📱
   - OTP verification
   - SMS/WhatsApp
   - 6-digit code
   - Country code support

5. **Twitter/X Login** ⚫
   - OAuth integration
   - Profile sync

6. **LinkedIn Login** 🔵
   - Professional network
   - Profile import

### **Authentication Features:**
- ✅ Multiple login options
- ✅ Account linking
- ✅ Profile synchronization
- ✅ Email verification
- ✅ Phone verification
- ✅ Two-factor authentication
- ✅ Session management
- ✅ Remember me
- ✅ Logout from all devices

---

## ☁️ CLOUD STORAGE MANAGEMENT

### **Supported Storage Providers:**

1. **Amazon S3** ☁️
   - AWS Simple Storage Service
   - Global CDN
   - Scalable storage
   - Configuration:
     - Access Key ID
     - Secret Access Key
     - Region
     - Bucket Name
     - Endpoint

2. **Wasabi** 🗄️
   - Hot Cloud Storage
   - S3-compatible
   - Lower cost
   - Configuration:
     - Access Key ID
     - Secret Access Key
     - Region
     - Bucket Name
     - Endpoint

3. **Cloudinary** 🖼️
   - Image & Video Management
   - Auto-optimization
   - Transformations
   - Configuration:
     - Cloud Name
     - API Key
     - API Secret
     - Upload Preset

4. **DigitalOcean Spaces** 🌊
   - Object Storage
   - S3-compatible
   - Built-in CDN
   - Configuration:
     - Access Key ID
     - Secret Access Key
     - Region
     - Space Name
     - Endpoint

5. **Backblaze B2** 💾
   - Cloud Storage
   - Cost-effective
   - S3-compatible
   - Configuration:
     - Application Key ID
     - Application Key
     - Bucket ID
     - Bucket Name

6. **Google Cloud Storage** ☁️
   - Google Cloud Platform
   - Global infrastructure
   - Configuration:
     - Project ID
     - Service Account Key
     - Bucket Name

### **Storage Features:**
- ✅ Multiple provider support
- ✅ Dynamic provider switching
- ✅ Default provider selection
- ✅ File categorization
- ✅ Auto-optimization
- ✅ Thumbnail generation
- ✅ CDN integration
- ✅ Bandwidth tracking
- ✅ Cost monitoring
- ✅ File sync
- ✅ Connection testing
- ✅ Upload limits
- ✅ Format restrictions
- ✅ Storage analytics

### **File Categories:**
- Package Images → Cloudinary
- User Documents → AWS S3
- Invoices & Receipts → AWS S3
- Backups → Wasabi

---

## 🗄️ DATABASE SCHEMA - UPDATED

### **16. Payment Gateways Table**
```sql
CREATE TABLE payment_gateways (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  gateway_id VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(50) UNIQUE NOT NULL,
  icon VARCHAR(10),
  description TEXT,
  enabled BOOLEAN DEFAULT TRUE,
  is_default BOOLEAN DEFAULT FALSE,
  test_mode BOOLEAN DEFAULT TRUE,
  
  -- Configuration (encrypted JSON)
  config JSON NOT NULL,
  
  -- Fees
  processing_fee DECIMAL(5,2) DEFAULT 0.00,
  fixed_fee DECIMAL(10,2) DEFAULT 0.00,
  pass_fee_to_customer BOOLEAN DEFAULT TRUE,
  
  -- Supported features
  supported_methods JSON,
  supported_currencies JSON,
  
  -- Stats
  total_transactions INT DEFAULT 0,
  total_amount DECIMAL(15,2) DEFAULT 0.00,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  INDEX idx_gateway_id (gateway_id),
  INDEX idx_enabled (enabled),
  INDEX idx_is_default (is_default)
);
```

### **17. Roles Table**
```sql
CREATE TABLE roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(50) UNIQUE NOT NULL,
  description TEXT,
  color VARCHAR(7),
  is_system BOOLEAN DEFAULT FALSE,
  permissions JSON NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_slug (slug),
  INDEX idx_is_system (is_system)
);
```

### **18. User Roles Table**
```sql
CREATE TABLE user_roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL,
  role_id UUID NOT NULL,
  assigned_by UUID,
  assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
  FOREIGN KEY (assigned_by) REFERENCES users(id) ON DELETE SET NULL,
  UNIQUE KEY unique_user_role (user_id, role_id),
  INDEX idx_user_id (user_id),
  INDEX idx_role_id (role_id)
);
```

### **19. Support Tickets Table**
```sql
CREATE TABLE support_tickets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ticket_id VARCHAR(50) UNIQUE NOT NULL,
  customer_id UUID NOT NULL,
  assigned_to UUID,
  subject VARCHAR(255) NOT NULL,
  category ENUM('Payment', 'Booking', 'Visa', 'Package', 'Technical', 'Other') NOT NULL,
  priority ENUM('low', 'medium', 'high', 'urgent') DEFAULT 'medium',
  status ENUM('open', 'in_progress', 'resolved', 'closed') DEFAULT 'open',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  resolved_at TIMESTAMP,
  FOREIGN KEY (customer_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (assigned_to) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_ticket_id (ticket_id),
  INDEX idx_customer_id (customer_id),
  INDEX idx_assigned_to (assigned_to),
  INDEX idx_status (status),
  INDEX idx_priority (priority)
);
```

### **20. Ticket Messages Table**
```sql
CREATE TABLE ticket_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ticket_id UUID NOT NULL,
  sender_id UUID NOT NULL,
  sender_type ENUM('customer', 'agent') NOT NULL,
  message TEXT NOT NULL,
  attachments JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (ticket_id) REFERENCES support_tickets(id) ON DELETE CASCADE,
  FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_ticket_id (ticket_id),
  INDEX idx_sender_id (sender_id)
);
```

### **21. Social Logins Table**
```sql
CREATE TABLE social_logins (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL,
  provider ENUM('google', 'facebook', 'apple', 'phone', 'twitter', 'linkedin') NOT NULL,
  provider_id VARCHAR(255) NOT NULL,
  provider_email VARCHAR(255),
  provider_data JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY unique_provider (provider, provider_id),
  INDEX idx_user_id (user_id),
  INDEX idx_provider (provider)
);
```

### **22. Storage Providers Table**
```sql
CREATE TABLE storage_providers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  provider_id VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(50) UNIQUE NOT NULL,
  description TEXT,
  enabled BOOLEAN DEFAULT TRUE,
  is_default BOOLEAN DEFAULT FALSE,
  config JSON NOT NULL,
  stats JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_provider_id (provider_id),
  INDEX idx_enabled (enabled),
  INDEX idx_is_default (is_default)
);
```

### **23. File Uploads Table**
```sql
CREATE TABLE file_uploads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL,
  provider_id VARCHAR(50) NOT NULL,
  category VARCHAR(100),
  file_name VARCHAR(255) NOT NULL,
  file_path TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_size BIGINT,
  mime_type VARCHAR(100),
  width INT,
  height INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id),
  INDEX idx_provider_id (provider_id),
  INDEX idx_category (category)
);
```

### **24. Activity Logs Table**
```sql
CREATE TABLE activity_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL,
  action VARCHAR(100) NOT NULL,
  entity_type VARCHAR(50),
  entity_id VARCHAR(100),
  description TEXT,
  ip_address VARCHAR(45),
  user_agent TEXT,
  metadata JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id),
  INDEX idx_action (action),
  INDEX idx_entity (entity_type, entity_id),
  INDEX idx_created_at (created_at)
);
```

---

## 🔧 BACKEND API ENDPOINTS - UPDATED (150+ Endpoints)

### **Payment Gateway APIs**
```
GET    /api/admin/payment-gateways
GET    /api/admin/payment-gateways/:id
POST   /api/admin/payment-gateways
PUT    /api/admin/payment-gateways/:id
DELETE /api/admin/payment-gateways/:id
PUT    /api/admin/payment-gateways/:id/toggle
PUT    /api/admin/payment-gateways/:id/set-default
POST   /api/admin/payment-gateways/:id/test
GET    /api/payment-gateways/active
POST   /api/payments/process/:gateway
POST   /api/payments/webhook/:gateway
```

### **Role & Permission APIs**
```
GET    /api/admin/roles
GET    /api/admin/roles/:id
POST   /api/admin/roles
PUT    /api/admin/roles/:id
DELETE /api/admin/roles/:id
GET    /api/admin/roles/:id/permissions
PUT    /api/admin/roles/:id/permissions
GET    /api/admin/team-members
POST   /api/admin/team-members/invite
PUT    /api/admin/team-members/:id/role
PUT    /api/admin/team-members/:id/status
DELETE /api/admin/team-members/:id
GET    /api/admin/activity-logs
```

### **Support Ticket APIs**
```
GET    /api/support/tickets
GET    /api/support/tickets/:id
POST   /api/support/tickets
PUT    /api/support/tickets/:id
DELETE /api/support/tickets/:id
PUT    /api/support/tickets/:id/status
PUT    /api/support/tickets/:id/priority
PUT    /api/support/tickets/:id/assign
GET    /api/support/tickets/:id/messages
POST   /api/support/tickets/:id/messages
POST   /api/support/tickets/:id/attachments
GET    /api/support/stats
```

### **Social Authentication APIs**
```
POST   /api/auth/google
POST   /api/auth/facebook
POST   /api/auth/apple
POST   /api/auth/twitter
POST   /api/auth/linkedin
POST   /api/auth/phone/send-otp
POST   /api/auth/phone/verify-otp
GET    /api/auth/social-accounts
DELETE /api/auth/social-accounts/:provider
POST   /api/auth/link-account
```

### **Cloud Storage APIs**
```
GET    /api/admin/storage-providers
GET    /api/admin/storage-providers/:id
POST   /api/admin/storage-providers
PUT    /api/admin/storage-providers/:id
DELETE /api/admin/storage-providers/:id
PUT    /api/admin/storage-providers/:id/toggle
PUT    /api/admin/storage-providers/:id/set-default
POST   /api/admin/storage-providers/:id/test
POST   /api/admin/storage-providers/:id/sync
POST   /api/upload
POST   /api/upload/:category
DELETE /api/files/:id
GET    /api/files/stats
```

---

## 📦 REQUIRED NPM PACKAGES - UPDATED

### **Frontend Dependencies**
```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.20.0",
    "react-query": "^3.39.3",
    "axios": "^1.6.2",
    "react-toastify": "^9.1.3",
    "date-fns": "^2.30.0",
    "react-icons": "^4.12.0",
    "framer-motion": "^10.16.16",
    "react-hook-form": "^7.49.2",
    "yup": "^1.3.3",
    "zustand": "^4.4.7",
    "@react-oauth/google": "^0.12.1",
    "react-facebook-login": "^4.1.1",
    "react-apple-login": "^1.1.6"
  }
}
```

### **Backend Dependencies**
```json
{
  "dependencies": {
    "express": "^4.18.2",
    "mysql2": "^3.6.5",
    "sequelize": "^6.35.2",
    "bcryptjs": "^2.4.3",
    "jsonwebtoken": "^9.0.2",
    "dotenv": "^16.3.1",
    "cors": "^2.8.5",
    "helmet": "^7.1.0",
    "express-validator": "^7.0.1",
    "multer": "^1.4.5-lts.1",
    "nodemailer": "^6.9.7",
    "uuid": "^9.0.1",
    "moment": "^2.30.1",
    "pdfkit": "^0.13.0",
    "razorpay": "^2.9.2",
    "stripe": "^14.10.0",
    "@paypal/checkout-server-sdk": "^1.0.3",
    "aws-sdk": "^2.1520.0",
    "cloudinary": "^1.41.1",
    "firebase-admin": "^12.0.0",
    "twilio": "^4.20.0",
    "passport": "^0.7.0",
    "passport-google-oauth20": "^2.0.0",
    "passport-facebook": "^3.0.0",
    "passport-apple": "^2.0.2"
  }
}
```

---

## 🔐 ENVIRONMENT VARIABLES - UPDATED

### **Backend (.env)**
```env
# Server
PORT=5000
NODE_ENV=development

# Database
DB_HOST=localhost
DB_PORT=3306
DB_NAME=umrahconnect
DB_USER=root
DB_PASSWORD=your_password

# JWT
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=7d

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_app_password

# Payment Gateways
RAZORPAY_KEY_ID=rzp_live_***
RAZORPAY_KEY_SECRET=***
STRIPE_SECRET_KEY=sk_live_***
STRIPE_WEBHOOK_SECRET=whsec_***
PAYPAL_CLIENT_ID=***
PAYPAL_CLIENT_SECRET=***

# Social Authentication
GOOGLE_CLIENT_ID=***
GOOGLE_CLIENT_SECRET=***
FACEBOOK_APP_ID=***
FACEBOOK_APP_SECRET=***
APPLE_CLIENT_ID=***
APPLE_TEAM_ID=***
APPLE_KEY_ID=***
APPLE_PRIVATE_KEY=***

# Phone Authentication
TWILIO_ACCOUNT_SID=***
TWILIO_AUTH_TOKEN=***
TWILIO_PHONE_NUMBER=***
FIREBASE_PROJECT_ID=***
FIREBASE_PRIVATE_KEY=***

# Cloud Storage
AWS_ACCESS_KEY_ID=***
AWS_SECRET_ACCESS_KEY=***
AWS_REGION=ap-south-1
AWS_BUCKET=umrahconnect-media

WASABI_ACCESS_KEY_ID=***
WASABI_SECRET_ACCESS_KEY=***
WASABI_REGION=ap-southeast-1
WASABI_BUCKET=umrahconnect-backup

CLOUDINARY_CLOUD_NAME=***
CLOUDINARY_API_KEY=***
CLOUDINARY_API_SECRET=***

DO_SPACES_KEY=***
DO_SPACES_SECRET=***
DO_SPACES_REGION=sgp1
DO_SPACES_BUCKET=umrahconnect-assets

# Frontend URL
FRONTEND_URL=http://localhost:3000
```

---

## 🎯 TOTAL PROJECT STATS - UPDATED

- **Total Files:** 108+
- **Total Commits:** 108+
- **Lines of Code:** 60,000+
- **Database Tables:** 24
- **API Endpoints:** 150+
- **Features:** 35+
- **Payment Gateways:** 6
- **Social Logins:** 6
- **Cloud Storage Providers:** 6
- **Admin Roles:** 5
- **Phases Completed:** 5/5 (100%)

---

## 🚀 NEW FEATURES SUMMARY

### ✅ **Payment Gateway System**
- 6 payment gateways
- Dynamic configuration
- Admin management
- Processing fees
- Test/Live modes

### ✅ **Role & Permission System**
- 5 predefined roles
- 10 permission modules
- Granular access control
- Team management
- Activity logging

### ✅ **Support Ticket System**
- 6 ticket categories
- 4 priority levels
- Real-time messaging
- File attachments
- Assignment system

### ✅ **Social Authentication**
- 6 login methods
- OAuth integration
- Phone OTP
- Account linking
- Profile sync

### ✅ **Cloud Storage Management**
- 6 storage providers
- Dynamic switching
- File categorization
- Auto-optimization
- Cost tracking

---

**Built with ❤️ for UmrahConnect 2.0**
**Version 2.0 - Enhanced Edition**
