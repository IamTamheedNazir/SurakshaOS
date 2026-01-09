# 🚀 UmrahConnect 2.0 - Complete Backend API Documentation

## 📋 **API OVERVIEW**

Base URL: `https://api.umrahconnect.com` or `http://localhost:5000`

All API requests must include:
```
Content-Type: application/json
Authorization: Bearer {token} (for protected routes)
```

---

## 🔐 **AUTHENTICATION**

### **Register User**
```http
POST /api/auth/register
```
**Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "first_name": "John",
  "last_name": "Doe",
  "phone": "+911234567890"
}
```

### **Login**
```http
POST /api/auth/login
```
**Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

### **Get Current User**
```http
GET /api/auth/me
Authorization: Bearer {token}
```

---

## 👤 **VENDOR REGISTRATION (DYNAMIC)**

### **Get Registration Form**
```http
GET /api/vendor/registration-form
```
**Response:**
```json
{
  "success": true,
  "data": {
    "groups": [
      {
        "id": "uuid",
        "group_name": "basic_info",
        "group_label": "Basic Information",
        "fields": [
          {
            "id": "uuid",
            "field_name": "first_name",
            "field_label": "First Name",
            "field_type": "text",
            "is_required": true,
            "placeholder": "Enter first name",
            "validation_rules": {...}
          }
        ]
      }
    ]
  }
}
```

### **Register Vendor**
```http
POST /api/vendor/register
Content-Type: multipart/form-data
```
**Body (FormData):**
```
first_name: John
last_name: Doe
email: vendor@example.com
phone: +911234567890
company_name: ABC Tours
company_logo: [file]
gst_number: 22AAAAA0000A1Z5
gst_certificate: [file]
pan_number: ABCDE1234F
pan_card: [file]
hajj_certificate_number: HC123456
hajj_certificate: [file]
umrah_certificate_number: UC123456
umrah_certificate: [file]
tourism_license_number: TL123456
tourism_license: [file]
bank_name: HDFC Bank
account_number: 1234567890
ifsc_code: HDFC0001234
cancelled_cheque: [file]
... (all dynamic fields)
```

---

## ⚙️ **ADMIN - SETTINGS API**

### **Payment Gateways**

#### Get All Payment Gateways
```http
GET /api/admin/settings/payment-gateways
Authorization: Bearer {admin_token}
```

#### Update Payment Gateway
```http
PUT /api/admin/settings/payment-gateways/:id
Authorization: Bearer {admin_token}
```
**Body:**
```json
{
  "api_key": "rzp_live_xxxxx",
  "api_secret": "xxxxx",
  "mode": "live",
  "enabled": true,
  "transaction_fee_percentage": 2.5
}
```

### **Email Settings**

#### Get Email Settings
```http
GET /api/admin/settings/email
Authorization: Bearer {admin_token}
```

#### Update Email Settings
```http
PUT /api/admin/settings/email
Authorization: Bearer {admin_token}
```
**Body:**
```json
{
  "smtp_host": "smtp.gmail.com",
  "smtp_port": 587,
  "smtp_username": "your@email.com",
  "smtp_password": "app_password",
  "smtp_encryption": "tls",
  "from_name": "UmrahConnect",
  "from_email": "noreply@umrahconnect.com"
}
```

#### Test Email
```http
POST /api/admin/settings/email/test
Authorization: Bearer {admin_token}
```
**Body:**
```json
{
  "to_email": "test@example.com"
}
```

### **SMS Settings**

#### Get SMS Settings
```http
GET /api/admin/settings/sms
Authorization: Bearer {admin_token}
```

#### Update SMS Provider
```http
PUT /api/admin/settings/sms/:id
Authorization: Bearer {admin_token}
```
**Body:**
```json
{
  "provider": "twilio",
  "api_key": "ACxxxxx",
  "api_secret": "xxxxx",
  "sender_id": "UMRAHC",
  "phone_number": "+1234567890",
  "enabled": true
}
```

### **Storage Settings**

#### Get Storage Settings
```http
GET /api/admin/settings/storage
Authorization: Bearer {admin_token}
```

#### Update Storage Provider
```http
PUT /api/admin/settings/storage/:id
Authorization: Bearer {admin_token}
```
**Body:**
```json
{
  "provider": "aws_s3",
  "access_key": "AKIAXXXXX",
  "secret_key": "xxxxx",
  "bucket_name": "umrahconnect-uploads",
  "region": "us-east-1",
  "enabled": true
}
```

#### Set Default Storage
```http
PUT /api/admin/settings/storage/:id/set-default
Authorization: Bearer {admin_token}
```

---

## 📦 **VENDOR API**

### **Vendor Dashboard**
```http
GET /api/vendor/dashboard
Authorization: Bearer {vendor_token}
```
**Response:**
```json
{
  "success": true,
  "data": {
    "total_packages": 25,
    "total_bookings": 150,
    "total_revenue": 5000000,
    "pending_bookings": 10,
    "confirmed_bookings": 120,
    "cancelled_bookings": 20,
    "average_rating": 4.5,
    "total_reviews": 85,
    "recent_bookings": [...],
    "revenue_chart": [...]
  }
}
```

### **Create Package**
```http
POST /api/vendor/packages
Authorization: Bearer {vendor_token}
Content-Type: multipart/form-data
```
**Body:**
```
title: 7 Days Economy Umrah Package
description: Complete Umrah package with...
duration_days: 7
duration_nights: 6
price: 75000
currency: INR
max_people: 50
departure_city: Mumbai
departure_date: 2024-03-15
images: [file1, file2, file3]
inclusions: ["Hotel", "Flight", "Visa", "Transport"]
exclusions: ["Personal expenses", "Tips"]
```

### **Get Vendor Packages**
```http
GET /api/vendor/packages?status=published&page=1&limit=10
Authorization: Bearer {vendor_token}
```

### **Update Package**
```http
PUT /api/vendor/packages/:id
Authorization: Bearer {vendor_token}
```

### **Publish Package**
```http
PUT /api/vendor/packages/:id/publish
Authorization: Bearer {vendor_token}
```

### **Get Vendor Bookings**
```http
GET /api/vendor/bookings?status=confirmed&page=1&limit=20
Authorization: Bearer {vendor_token}
```

### **Confirm Booking**
```http
PUT /api/vendor/bookings/:id/confirm
Authorization: Bearer {vendor_token}
```

### **Get Earnings**
```http
GET /api/vendor/earnings?from=2024-01-01&to=2024-12-31
Authorization: Bearer {vendor_token}
```

---

## 📅 **BOOKING API**

### **Check Availability**
```http
POST /api/bookings/check-availability
```
**Body:**
```json
{
  "package_id": "uuid",
  "departure_date": "2024-03-15",
  "travelers": 4
}
```

### **Calculate Price**
```http
POST /api/bookings/calculate-price
```
**Body:**
```json
{
  "package_id": "uuid",
  "adults": 2,
  "children": 1,
  "infants": 1,
  "departure_date": "2024-03-15",
  "coupon_code": "UMRAH2024"
}
```

### **Create Booking**
```http
POST /api/bookings
Authorization: Bearer {token}
```
**Body:**
```json
{
  "package_id": "uuid",
  "departure_date": "2024-03-15",
  "return_date": "2024-03-22",
  "travelers": [
    {
      "type": "adult",
      "first_name": "John",
      "last_name": "Doe",
      "passport_number": "A1234567",
      "date_of_birth": "1990-01-01"
    }
  ],
  "special_requests": "Wheelchair assistance needed"
}
```

### **Get User Bookings**
```http
GET /api/bookings?status=confirmed&page=1
Authorization: Bearer {token}
```

### **Cancel Booking**
```http
POST /api/bookings/:id/cancel
Authorization: Bearer {token}
```
**Body:**
```json
{
  "reason": "Personal emergency",
  "request_refund": true
}
```

### **Upload Documents**
```http
POST /api/bookings/:id/documents
Authorization: Bearer {token}
Content-Type: multipart/form-data
```
**Body:**
```
documents: [passport.pdf, visa.pdf, vaccination.pdf]
```

### **Add Review**
```http
POST /api/bookings/:id/review
Authorization: Bearer {token}
```
**Body:**
```json
{
  "rating": 5,
  "title": "Excellent Experience",
  "comment": "Amazing service and great package!",
  "images": [...]
}
```

---

## 💳 **PAYMENT API**

### **Create Payment Order**
```http
POST /api/payments/create-order
Authorization: Bearer {token}
```
**Body:**
```json
{
  "booking_id": "uuid",
  "amount": 75000,
  "currency": "INR",
  "payment_method": "razorpay"
}
```

### **Verify Payment**
```http
POST /api/payments/verify
Authorization: Bearer {token}
```
**Body:**
```json
{
  "payment_id": "pay_xxxxx",
  "order_id": "order_xxxxx",
  "signature": "xxxxx",
  "booking_id": "uuid"
}
```

### **Get Available Payment Methods**
```http
GET /api/payments/methods/available
```
**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "gateway_name": "razorpay",
      "display_name": "Razorpay",
      "enabled": true,
      "transaction_fee_percentage": 2.5
    },
    {
      "id": "uuid",
      "gateway_name": "stripe",
      "display_name": "Stripe",
      "enabled": true,
      "transaction_fee_percentage": 2.9
    }
  ]
}
```

### **Request Refund**
```http
POST /api/payments/:id/refund
Authorization: Bearer {token}
```
**Body:**
```json
{
  "amount": 75000,
  "reason": "Booking cancelled"
}
```

### **Download Receipt**
```http
GET /api/payments/:id/receipt/download
Authorization: Bearer {token}
```

---

## 📊 **ADMIN - ANALYTICS API**

### **Dashboard Stats**
```http
GET /api/admin/analytics/dashboard
Authorization: Bearer {admin_token}
```

### **Revenue Report**
```http
GET /api/admin/analytics/revenue?from=2024-01-01&to=2024-12-31
Authorization: Bearer {admin_token}
```

### **Booking Report**
```http
GET /api/admin/analytics/bookings?from=2024-01-01&to=2024-12-31
Authorization: Bearer {admin_token}
```

### **Vendor Performance**
```http
GET /api/admin/analytics/vendors?sort=revenue&order=desc
Authorization: Bearer {admin_token}
```

---

## 🔔 **NOTIFICATIONS API**

### **Get User Notifications**
```http
GET /api/notifications?unread=true&page=1
Authorization: Bearer {token}
```

### **Mark as Read**
```http
PUT /api/notifications/:id/read
Authorization: Bearer {token}
```

### **Mark All as Read**
```http
PUT /api/notifications/read-all
Authorization: Bearer {token}
```

---

## 📝 **RESPONSE FORMAT**

### **Success Response:**
```json
{
  "success": true,
  "message": "Operation successful",
  "data": {...},
  "count": 10,
  "page": 1,
  "totalPages": 5
}
```

### **Error Response:**
```json
{
  "success": false,
  "message": "Error message",
  "error": "Detailed error description"
}
```

---

## 🔒 **AUTHENTICATION**

All protected routes require JWT token in header:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## 📈 **RATE LIMITING**

- 100 requests per 15 minutes per IP
- Webhook endpoints are excluded from rate limiting

---

## 🎯 **STATUS CODES**

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `422` - Validation Error
- `429` - Too Many Requests
- `500` - Internal Server Error

---

## 🚀 **TOTAL API ENDPOINTS: 150+**

- Authentication: 5 endpoints
- Vendor Registration: 3 endpoints
- Vendor Management: 25 endpoints
- Bookings: 20 endpoints
- Payments: 15 endpoints
- Admin Settings: 40 endpoints
- Admin Analytics: 10 endpoints
- Notifications: 5 endpoints
- Reviews: 8 endpoints
- Users: 10 endpoints
- Packages: 15 endpoints

---

**Complete, Production-Ready API System!** 🎉
