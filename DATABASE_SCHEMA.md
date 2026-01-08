# UmrahConnect 2.0 - Complete Database Schema

## 🗄️ **POSTGRESQL DATABASE SCHEMA**

Complete SQL schema for all 33 tables with relationships, indexes, and constraints.

---

## 📋 **TABLE OF CONTENTS**

1. [Core Tables](#core-tables) (10 tables)
2. [Financial Tables](#financial-tables) (5 tables)
3. [Subscription Tables](#subscription-tables) (3 tables)
4. [Advertisement Tables](#advertisement-tables) (3 tables)
5. [Communication Tables](#communication-tables) (3 tables)
6. [Internationalization Tables](#internationalization-tables) (2 tables)
7. [Referral & Loyalty Tables](#referral--loyalty-tables) (4 tables)
8. [Support Tables](#support-tables) (2 tables)
9. [Access Control Tables](#access-control-tables) (3 tables)
10. [Storage Tables](#storage-tables) (2 tables)

---

## 🔧 **CORE TABLES (10)**

### **1. users**
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255),
  phone VARCHAR(20),
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  avatar TEXT,
  role ENUM('customer', 'vendor', 'admin', 'support', 'accountant') DEFAULT 'customer',
  email_verified BOOLEAN DEFAULT FALSE,
  phone_verified BOOLEAN DEFAULT FALSE,
  status ENUM('active', 'inactive', 'suspended', 'banned') DEFAULT 'active',
  language VARCHAR(5) DEFAULT 'en',
  currency VARCHAR(3) DEFAULT 'INR',
  timezone VARCHAR(50) DEFAULT 'Asia/Kolkata',
  referral_code VARCHAR(20) UNIQUE,
  referred_by UUID REFERENCES users(id),
  loyalty_points INT DEFAULT 0,
  loyalty_tier VARCHAR(20) DEFAULT 'Bronze',
  last_login TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  INDEX idx_email (email),
  INDEX idx_phone (phone),
  INDEX idx_role (role),
  INDEX idx_status (status),
  INDEX idx_referral_code (referral_code),
  INDEX idx_referred_by (referred_by)
);
```

### **2. vendors**
```sql
CREATE TABLE vendors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  company_name VARCHAR(255) NOT NULL,
  company_logo TEXT,
  description TEXT,
  license_number VARCHAR(100),
  tax_id VARCHAR(50),
  website VARCHAR(255),
  address TEXT,
  city VARCHAR(100),
  state VARCHAR(100),
  country VARCHAR(100),
  postal_code VARCHAR(20),
  bank_name VARCHAR(255),
  bank_account_number VARCHAR(50),
  bank_ifsc VARCHAR(20),
  bank_account_holder VARCHAR(255),
  verification_status ENUM('pending', 'verified', 'rejected') DEFAULT 'pending',
  verification_documents JSON,
  rating DECIMAL(3,2) DEFAULT 0.00,
  total_reviews INT DEFAULT 0,
  total_bookings INT DEFAULT 0,
  total_revenue DECIMAL(15,2) DEFAULT 0.00,
  subscription_plan VARCHAR(50) DEFAULT 'free',
  subscription_status ENUM('active', 'expired', 'cancelled') DEFAULT 'active',
  subscription_expires_at TIMESTAMP,
  commission_rate DECIMAL(5,2) DEFAULT 15.00,
  featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  INDEX idx_user_id (user_id),
  INDEX idx_verification_status (verification_status),
  INDEX idx_subscription_plan (subscription_plan),
  INDEX idx_featured (featured),
  INDEX idx_rating (rating)
);
```

### **3. packages**
```sql
CREATE TABLE packages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id UUID NOT NULL REFERENCES vendors(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  short_description TEXT,
  images JSON,
  category VARCHAR(50),
  duration_days INT NOT NULL,
  duration_nights INT NOT NULL,
  departure_city VARCHAR(100),
  departure_date DATE,
  return_date DATE,
  price DECIMAL(15,2) NOT NULL,
  original_price DECIMAL(15,2),
  discount_percentage DECIMAL(5,2) DEFAULT 0.00,
  currency VARCHAR(3) DEFAULT 'INR',
  max_people INT,
  available_seats INT,
  min_age INT,
  max_age INT,
  inclusions JSON,
  exclusions JSON,
  itinerary JSON,
  hotels JSON,
  flights JSON,
  visa_included BOOLEAN DEFAULT FALSE,
  insurance_included BOOLEAN DEFAULT FALSE,
  meal_plan VARCHAR(50),
  transportation VARCHAR(50),
  status ENUM('draft', 'published', 'archived') DEFAULT 'draft',
  featured BOOLEAN DEFAULT FALSE,
  sponsored BOOLEAN DEFAULT FALSE,
  views INT DEFAULT 0,
  bookings INT DEFAULT 0,
  rating DECIMAL(3,2) DEFAULT 0.00,
  total_reviews INT DEFAULT 0,
  seo_title VARCHAR(255),
  seo_description TEXT,
  seo_keywords TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  INDEX idx_vendor_id (vendor_id),
  INDEX idx_slug (slug),
  INDEX idx_category (category),
  INDEX idx_status (status),
  INDEX idx_featured (featured),
  INDEX idx_sponsored (sponsored),
  INDEX idx_departure_date (departure_date),
  INDEX idx_price (price),
  INDEX idx_rating (rating),
  FULLTEXT idx_search (title, description, short_description)
);
```

### **4. bookings**
```sql
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_number VARCHAR(20) UNIQUE NOT NULL,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  vendor_id UUID NOT NULL REFERENCES vendors(id) ON DELETE CASCADE,
  package_id UUID NOT NULL REFERENCES packages(id) ON DELETE CASCADE,
  travelers JSON NOT NULL,
  total_travelers INT NOT NULL,
  adults INT DEFAULT 0,
  children INT DEFAULT 0,
  infants INT DEFAULT 0,
  departure_date DATE NOT NULL,
  return_date DATE NOT NULL,
  package_price DECIMAL(15,2) NOT NULL,
  discount_amount DECIMAL(15,2) DEFAULT 0.00,
  tax_amount DECIMAL(15,2) DEFAULT 0.00,
  total_amount DECIMAL(15,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'INR',
  payment_status ENUM('pending', 'partial', 'paid', 'refunded', 'failed') DEFAULT 'pending',
  booking_status ENUM('pending', 'confirmed', 'cancelled', 'completed') DEFAULT 'pending',
  special_requests TEXT,
  documents JSON,
  visa_status ENUM('not_applied', 'applied', 'approved', 'rejected') DEFAULT 'not_applied',
  cancellation_reason TEXT,
  cancelled_at TIMESTAMP,
  confirmed_at TIMESTAMP,
  completed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  INDEX idx_booking_number (booking_number),
  INDEX idx_user_id (user_id),
  INDEX idx_vendor_id (vendor_id),
  INDEX idx_package_id (package_id),
  INDEX idx_payment_status (payment_status),
  INDEX idx_booking_status (booking_status),
  INDEX idx_departure_date (departure_date)
);
```

### **5. payments**
```sql
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  payment_id VARCHAR(100) UNIQUE NOT NULL,
  booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  vendor_id UUID NOT NULL REFERENCES vendors(id) ON DELETE CASCADE,
  amount DECIMAL(15,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'INR',
  payment_method ENUM('razorpay', 'stripe', 'paypal', 'bank_transfer', 'upi', 'cash') NOT NULL,
  payment_gateway VARCHAR(50),
  gateway_payment_id VARCHAR(255),
  gateway_order_id VARCHAR(255),
  gateway_signature VARCHAR(255),
  status ENUM('pending', 'processing', 'completed', 'failed', 'refunded') DEFAULT 'pending',
  payment_date TIMESTAMP,
  refund_amount DECIMAL(15,2) DEFAULT 0.00,
  refund_date TIMESTAMP,
  refund_reason TEXT,
  transaction_fee DECIMAL(15,2) DEFAULT 0.00,
  net_amount DECIMAL(15,2),
  metadata JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  INDEX idx_payment_id (payment_id),
  INDEX idx_booking_id (booking_id),
  INDEX idx_user_id (user_id),
  INDEX idx_vendor_id (vendor_id),
  INDEX idx_status (status),
  INDEX idx_payment_method (payment_method),
  INDEX idx_payment_date (payment_date)
);
```

### **6. reviews**
```sql
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  package_id UUID NOT NULL REFERENCES packages(id) ON DELETE CASCADE,
  vendor_id UUID NOT NULL REFERENCES vendors(id) ON DELETE CASCADE,
  booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title VARCHAR(255),
  comment TEXT,
  images JSON,
  helpful_count INT DEFAULT 0,
  verified_purchase BOOLEAN DEFAULT FALSE,
  status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
  admin_response TEXT,
  responded_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  INDEX idx_user_id (user_id),
  INDEX idx_package_id (package_id),
  INDEX idx_vendor_id (vendor_id),
  INDEX idx_booking_id (booking_id),
  INDEX idx_rating (rating),
  INDEX idx_status (status)
);
```

### **7. itineraries**
```sql
CREATE TABLE itineraries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  package_id UUID NOT NULL REFERENCES packages(id) ON DELETE CASCADE,
  day_number INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  activities JSON,
  meals JSON,
  accommodation JSON,
  transportation JSON,
  images JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  INDEX idx_package_id (package_id),
  INDEX idx_day_number (day_number)
);
```

### **8. documents**
```sql
CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
  document_type ENUM('passport', 'visa', 'photo', 'vaccination', 'other') NOT NULL,
  document_name VARCHAR(255) NOT NULL,
  file_url TEXT NOT NULL,
  file_size INT,
  file_type VARCHAR(50),
  status ENUM('pending', 'verified', 'rejected') DEFAULT 'pending',
  rejection_reason TEXT,
  verified_by UUID REFERENCES users(id),
  verified_at TIMESTAMP,
  expires_at DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  INDEX idx_user_id (user_id),
  INDEX idx_booking_id (booking_id),
  INDEX idx_document_type (document_type),
  INDEX idx_status (status)
);
```

### **9. notifications**
```sql
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  data JSON,
  channel ENUM('email', 'sms', 'whatsapp', 'push', 'in_app') NOT NULL,
  status ENUM('pending', 'sent', 'failed', 'read') DEFAULT 'pending',
  sent_at TIMESTAMP,
  read_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  INDEX idx_user_id (user_id),
  INDEX idx_type (type),
  INDEX idx_channel (channel),
  INDEX idx_status (status),
  INDEX idx_sent_at (sent_at)
);
```

### **10. settings**
```sql
CREATE TABLE settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key VARCHAR(100) UNIQUE NOT NULL,
  value TEXT,
  type VARCHAR(50),
  category VARCHAR(50),
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  INDEX idx_key (key),
  INDEX idx_category (category)
);
```

---

## 💰 **FINANCIAL TABLES (5)**

### **11. payment_gateways**
```sql
CREATE TABLE payment_gateways (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(50) UNIQUE NOT NULL,
  provider VARCHAR(50) NOT NULL,
  api_key TEXT,
  api_secret TEXT,
  webhook_secret TEXT,
  mode ENUM('test', 'live') DEFAULT 'test',
  enabled BOOLEAN DEFAULT TRUE,
  processing_fee_percentage DECIMAL(5,2) DEFAULT 0.00,
  processing_fee_fixed DECIMAL(10,2) DEFAULT 0.00,
  pass_fee_to_customer BOOLEAN DEFAULT FALSE,
  supported_currencies JSON,
  config JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  INDEX idx_slug (slug),
  INDEX idx_enabled (enabled)
);
```

### **12. currencies**
```sql
CREATE TABLE currencies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(3) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  symbol VARCHAR(10) NOT NULL,
  flag VARCHAR(10),
  exchange_rate DECIMAL(15,6) NOT NULL,
  is_default BOOLEAN DEFAULT FALSE,
  enabled BOOLEAN DEFAULT TRUE,
  position ENUM('before', 'after') DEFAULT 'before',
  decimal_places INT DEFAULT 2,
  thousands_separator VARCHAR(1) DEFAULT ',',
  decimal_separator VARCHAR(1) DEFAULT '.',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  INDEX idx_code (code),
  INDEX idx_enabled (enabled),
  INDEX idx_is_default (is_default)
);
```

### **13. commission_transactions**
```sql
CREATE TABLE commission_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id UUID NOT NULL REFERENCES vendors(id) ON DELETE CASCADE,
  booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  booking_amount DECIMAL(15,2) NOT NULL,
  commission_rate DECIMAL(5,2) NOT NULL,
  commission_amount DECIMAL(15,2) NOT NULL,
  status ENUM('pending', 'paid', 'processing', 'failed') DEFAULT 'pending',
  payout_date DATE,
  payment_method VARCHAR(50),
  transaction_id VARCHAR(100),
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  INDEX idx_vendor_id (vendor_id),
  INDEX idx_booking_id (booking_id),
  INDEX idx_status (status),
  INDEX idx_payout_date (payout_date)
);
```

### **14. vendor_payouts**
```sql
CREATE TABLE vendor_payouts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id UUID NOT NULL REFERENCES vendors(id) ON DELETE CASCADE,
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  total_bookings INT DEFAULT 0,
  total_revenue DECIMAL(15,2) DEFAULT 0.00,
  total_commission DECIMAL(15,2) DEFAULT 0.00,
  tax_deduction DECIMAL(15,2) DEFAULT 0.00,
  processing_fee DECIMAL(15,2) DEFAULT 0.00,
  net_payout DECIMAL(15,2) NOT NULL,
  status ENUM('pending', 'processing', 'paid', 'failed') DEFAULT 'pending',
  payment_method VARCHAR(50),
  transaction_id VARCHAR(100),
  paid_date DATE,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  INDEX idx_vendor_id (vendor_id),
  INDEX idx_status (status),
  INDEX idx_period (period_start, period_end),
  INDEX idx_paid_date (paid_date)
);
```

### **15. invoices**
```sql
CREATE TABLE invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_number VARCHAR(50) UNIQUE NOT NULL,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  vendor_id UUID REFERENCES vendors(id) ON DELETE CASCADE,
  booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
  type ENUM('booking', 'subscription', 'advertisement') NOT NULL,
  amount DECIMAL(15,2) NOT NULL,
  tax_amount DECIMAL(15,2) DEFAULT 0.00,
  discount_amount DECIMAL(15,2) DEFAULT 0.00,
  total_amount DECIMAL(15,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'INR',
  status ENUM('draft', 'sent', 'paid', 'cancelled') DEFAULT 'draft',
  due_date DATE,
  paid_date DATE,
  items JSON,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  INDEX idx_invoice_number (invoice_number),
  INDEX idx_user_id (user_id),
  INDEX idx_vendor_id (vendor_id),
  INDEX idx_booking_id (booking_id),
  INDEX idx_status (status),
  INDEX idx_due_date (due_date)
);
```

---

## 💳 **SUBSCRIPTION TABLES (3)**

### **16. subscription_plans**
```sql
CREATE TABLE subscription_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(50) UNIQUE NOT NULL,
  description TEXT,
  icon VARCHAR(10),
  color VARCHAR(7),
  price_monthly DECIMAL(10,2) NOT NULL,
  price_yearly DECIMAL(10,2) NOT NULL,
  features JSON NOT NULL,
  limits JSON NOT NULL,
  commission_rate DECIMAL(5,2) NOT NULL,
  popular BOOLEAN DEFAULT FALSE,
  active BOOLEAN DEFAULT TRUE,
  trial_days INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  INDEX idx_slug (slug),
  INDEX idx_popular (popular),
  INDEX idx_active (active)
);
```

### **17. subscriptions**
```sql
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id UUID NOT NULL REFERENCES vendors(id) ON DELETE CASCADE,
  plan_id UUID NOT NULL REFERENCES subscription_plans(id),
  billing_cycle ENUM('monthly', 'yearly') NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  status ENUM('active', 'cancelled', 'expired', 'trial') DEFAULT 'active',
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  next_billing_date DATE,
  auto_renew BOOLEAN DEFAULT TRUE,
  trial_ends_at DATE,
  cancelled_at TIMESTAMP,
  cancellation_reason TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  INDEX idx_vendor_id (vendor_id),
  INDEX idx_plan_id (plan_id),
  INDEX idx_status (status),
  INDEX idx_end_date (end_date),
  INDEX idx_next_billing_date (next_billing_date)
);
```

### **18. subscription_invoices**
```sql
CREATE TABLE subscription_invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subscription_id UUID NOT NULL REFERENCES subscriptions(id) ON DELETE CASCADE,
  invoice_id UUID REFERENCES invoices(id),
  amount DECIMAL(10,2) NOT NULL,
  status ENUM('pending', 'paid', 'failed') DEFAULT 'pending',
  billing_date DATE NOT NULL,
  paid_date DATE,
  payment_method VARCHAR(50),
  transaction_id VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  INDEX idx_subscription_id (subscription_id),
  INDEX idx_status (status),
  INDEX idx_billing_date (billing_date)
);
```

---

## 📢 **ADVERTISEMENT TABLES (3)**

### **19. advertisements**
```sql
CREATE TABLE advertisements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id UUID NOT NULL REFERENCES vendors(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  image_url TEXT,
  target_url TEXT,
  position VARCHAR(50),
  duration ENUM('daily', 'weekly', 'monthly') NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  status ENUM('active', 'paused', 'expired', 'pending') DEFAULT 'pending',
  impressions INT DEFAULT 0,
  clicks INT DEFAULT 0,
  ctr DECIMAL(5,2) DEFAULT 0.00,
  amount_paid DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  INDEX idx_vendor_id (vendor_id),
  INDEX idx_type (type),
  INDEX idx_status (status),
  INDEX idx_dates (start_date, end_date)
);
```

### **20. ad_types**
```sql
CREATE TABLE ad_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(50) UNIQUE NOT NULL,
  description TEXT,
  positions JSON,
  price_daily DECIMAL(10,2) NOT NULL,
  price_weekly DECIMAL(10,2) NOT NULL,
  price_monthly DECIMAL(10,2) NOT NULL,
  dimensions VARCHAR(50),
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  INDEX idx_slug (slug),
  INDEX idx_active (active)
);
```

### **21. promotion_boosts**
```sql
CREATE TABLE promotion_boosts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id UUID NOT NULL REFERENCES vendors(id) ON DELETE CASCADE,
  package_id UUID REFERENCES packages(id) ON DELETE CASCADE,
  boost_type VARCHAR(50) NOT NULL,
  duration_days INT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  amount_paid DECIMAL(10,2) NOT NULL,
  status ENUM('active', 'expired', 'cancelled') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  INDEX idx_vendor_id (vendor_id),
  INDEX idx_package_id (package_id),
  INDEX idx_status (status),
  INDEX idx_dates (start_date, end_date)
);
```

---

**Continued in next message...**
