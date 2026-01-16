# 🧪 API Testing Guide

Complete guide to test all UmrahConnect API endpoints.

---

## Base URL

```
Local: http://localhost:8000/api
Production: https://umrahconnect.in/api
```

---

## 1. Authentication Endpoints

### Register User

```http
POST /auth/register
Content-Type: application/json

{
    "first_name": "John",
    "last_name": "Doe",
    "email": "john@example.com",
    "password": "password123",
    "password_confirmation": "password123",
    "phone": "+91 9876543210",
    "role": "customer"
}
```

**Response:**
```json
{
    "success": true,
    "message": "User registered successfully",
    "data": {
        "user": { ... },
        "token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
        "token_type": "bearer",
        "expires_in": 86400
    }
}
```

### Login

```http
POST /auth/login
Content-Type: application/json

{
    "email": "john@example.com",
    "password": "password123"
}
```

### Get Current User

```http
GET /auth/me
Authorization: Bearer {token}
```

### Logout

```http
POST /auth/logout
Authorization: Bearer {token}
```

### Refresh Token

```http
POST /auth/refresh
Authorization: Bearer {token}
```

### Update Profile

```http
PUT /auth/profile
Authorization: Bearer {token}
Content-Type: application/json

{
    "first_name": "John",
    "last_name": "Smith",
    "phone": "+91 9876543210",
    "address": "123 Main St",
    "city": "Mumbai",
    "state": "Maharashtra",
    "country": "India",
    "postal_code": "400001"
}
```

### Change Password

```http
POST /auth/change-password
Authorization: Bearer {token}
Content-Type: application/json

{
    "current_password": "password123",
    "new_password": "newpassword123",
    "new_password_confirmation": "newpassword123"
}
```

---

## 2. Package Endpoints

### List All Packages

```http
GET /packages?search=makkah&destination=saudi&min_price=50000&max_price=150000&duration=7&featured=1&sort_by=price&sort_order=asc&per_page=15&page=1
```

### Get Featured Packages

```http
GET /packages/featured
```

### Get Package Details

```http
GET /packages/{id}
```

### Create Package (Vendor)

```http
POST /packages
Authorization: Bearer {vendor_token}
Content-Type: application/json

{
    "title": "7 Days Umrah Package - Deluxe",
    "description": "Complete Umrah package with 5-star hotels",
    "price": 125000,
    "duration": 7,
    "destination": "Makkah & Madinah",
    "departure_city": "Mumbai",
    "accommodation_type": "5 Star Hotel",
    "transportation_type": "Private AC Bus",
    "meal_plan": "Breakfast & Dinner",
    "inclusions": [
        "Return flight tickets",
        "5-star hotel accommodation",
        "Visa processing",
        "Transportation",
        "Ziyarat tours"
    ],
    "exclusions": [
        "Personal expenses",
        "Travel insurance",
        "Excess baggage"
    ],
    "max_travelers": 50,
    "min_travelers": 10,
    "available_from": "2024-03-01",
    "available_to": "2024-12-31"
}
```

### Update Package (Vendor)

```http
PUT /packages/{id}
Authorization: Bearer {vendor_token}
Content-Type: application/json

{
    "title": "Updated Package Title",
    "price": 130000,
    "status": "active"
}
```

### Delete Package (Vendor)

```http
DELETE /packages/{id}
Authorization: Bearer {vendor_token}
```

---

## 3. Booking Endpoints

### Create Booking

```http
POST /bookings
Authorization: Bearer {customer_token}
Content-Type: application/json

{
    "package_id": "uuid-here",
    "travelers": 2,
    "travel_date": "2024-06-15",
    "special_requests": "Need wheelchair assistance",
    "traveler_details": [
        {
            "name": "John Doe",
            "age": 35,
            "passport_number": "A1234567"
        },
        {
            "name": "Jane Doe",
            "age": 32,
            "passport_number": "B7654321"
        }
    ]
}
```

### List Bookings

```http
GET /bookings?status=confirmed&payment_status=paid&per_page=15&page=1
Authorization: Bearer {token}
```

### Get Booking Details

```http
GET /bookings/{id}
Authorization: Bearer {token}
```

### Update Booking Status (Vendor/Admin)

```http
PATCH /bookings/{id}/status
Authorization: Bearer {vendor_token}
Content-Type: application/json

{
    "status": "confirmed"
}
```

### Cancel Booking (Customer)

```http
POST /bookings/{id}/cancel
Authorization: Bearer {customer_token}
Content-Type: application/json

{
    "reason": "Change of plans"
}
```

### Get Booking Statistics

```http
GET /bookings/statistics
Authorization: Bearer {token}
```

---

## 4. Review Endpoints

### Submit Review

```http
POST /reviews
Authorization: Bearer {customer_token}
Content-Type: application/json

{
    "package_id": "uuid-here",
    "booking_id": "uuid-here",
    "rating": 5,
    "title": "Excellent Experience!",
    "comment": "The package was amazing. Everything was well organized and the hotels were great."
}
```

### List Reviews

```http
GET /reviews?package_id=uuid-here&rating=5&verified=1&per_page=15
```

### Update Review

```http
PUT /reviews/{id}
Authorization: Bearer {customer_token}
Content-Type: application/json

{
    "rating": 4,
    "title": "Updated Review",
    "comment": "Updated comment"
}
```

### Delete Review

```http
DELETE /reviews/{id}
Authorization: Bearer {customer_token}
```

### Mark Review as Helpful

```http
POST /reviews/{id}/helpful
Authorization: Bearer {token}
```

---

## 5. Payment Endpoints

### Create Payment

```http
POST /payments/create
Authorization: Bearer {customer_token}
Content-Type: application/json

{
    "booking_id": "uuid-here",
    "payment_gateway": "razorpay",
    "amount": 125000
}
```

**Response:**
```json
{
    "success": true,
    "message": "Payment initiated successfully",
    "data": {
        "payment": { ... },
        "order": {
            "order_id": "order_xyz123",
            "amount": 12500000,
            "currency": "INR",
            "key": "rzp_test_..."
        }
    }
}
```

### Verify Payment

```http
POST /payments/verify
Authorization: Bearer {customer_token}
Content-Type: application/json

{
    "payment_id": "uuid-here",
    "gateway_response": {
        "razorpay_order_id": "order_xyz123",
        "razorpay_payment_id": "pay_abc456",
        "razorpay_signature": "signature_here"
    }
}
```

### Payment History

```http
GET /payments/history?per_page=15&page=1
Authorization: Bearer {token}
```

---

## 6. Vendor Endpoints

### Vendor Dashboard

```http
GET /vendor/dashboard
Authorization: Bearer {vendor_token}
```

**Response:**
```json
{
    "success": true,
    "data": {
        "stats": {
            "total_packages": 15,
            "active_packages": 12,
            "total_bookings": 45,
            "total_revenue": 5625000,
            "monthly_revenue": 1250000
        },
        "recent_bookings": [ ... ],
        "top_packages": [ ... ]
    }
}
```

### Vendor Packages

```http
GET /vendor/packages?per_page=15&page=1
Authorization: Bearer {vendor_token}
```

### Vendor Bookings

```http
GET /vendor/bookings?status=confirmed&from_date=2024-01-01&to_date=2024-12-31
Authorization: Bearer {vendor_token}
```

### Vendor Statistics

```http
GET /vendor/statistics?period=month
Authorization: Bearer {vendor_token}
```

### Vendor Profile

```http
GET /vendor/profile
Authorization: Bearer {vendor_token}
```

### Update Vendor Profile

```http
PUT /vendor/profile
Authorization: Bearer {vendor_token}
Content-Type: application/json

{
    "business_name": "ABC Travels",
    "business_phone": "+91 9876543210",
    "business_email": "info@abctravels.com",
    "website": "https://abctravels.com",
    "description": "Leading Umrah tour operator",
    "bank_account_name": "ABC Travels Pvt Ltd",
    "bank_account_number": "1234567890",
    "bank_name": "HDFC Bank",
    "bank_ifsc_code": "HDFC0001234"
}
```

---

## 7. Admin Endpoints

### Admin Dashboard

```http
GET /admin/dashboard
Authorization: Bearer {admin_token}
```

### Platform Statistics

```http
GET /admin/statistics?period=month
Authorization: Bearer {admin_token}
```

### List All Users

```http
GET /admin/users?role=vendor&status=active&search=john&per_page=15
Authorization: Bearer {admin_token}
```

### Update User Status

```http
PATCH /admin/users/{id}/status
Authorization: Bearer {admin_token}
Content-Type: application/json

{
    "status": "active"
}
```

### List All Packages

```http
GET /admin/packages?status=pending&per_page=15
Authorization: Bearer {admin_token}
```

### Approve Package

```http
PATCH /admin/packages/{id}/approve
Authorization: Bearer {admin_token}
```

### Reject Package

```http
PATCH /admin/packages/{id}/reject
Authorization: Bearer {admin_token}
```

### Toggle Featured Package

```http
PATCH /admin/packages/{id}/feature
Authorization: Bearer {admin_token}
```

### List All Bookings

```http
GET /admin/bookings?status=confirmed&per_page=15
Authorization: Bearer {admin_token}
```

### List All Payments

```http
GET /admin/payments?status=success&per_page=15
Authorization: Bearer {admin_token}
```

### Get Settings

```http
GET /admin/settings
Authorization: Bearer {admin_token}
```

### Update Settings

```http
PUT /admin/settings
Authorization: Bearer {admin_token}
Content-Type: application/json

{
    "commission_rate": "12",
    "booking_prefix": "UC",
    "razorpay_enabled": "1"
}
```

---

## Testing with cURL

### Register

```bash
curl -X POST https://umrahconnect.in/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "first_name": "John",
    "last_name": "Doe",
    "email": "john@example.com",
    "password": "password123",
    "password_confirmation": "password123"
  }'
```

### Login

```bash
curl -X POST https://umrahconnect.in/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Get Packages (with token)

```bash
curl -X GET https://umrahconnect.in/api/packages \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## Testing with Postman

1. **Import Collection:**
   - Create new collection "UmrahConnect API"
   - Add base URL variable: `{{base_url}}`

2. **Set Environment:**
   - Local: `http://localhost:8000/api`
   - Production: `https://umrahconnect.in/api`

3. **Add Token Variable:**
   - After login, save token to `{{token}}`
   - Use in Authorization header

4. **Test All Endpoints:**
   - Authentication ✅
   - Packages ✅
   - Bookings ✅
   - Reviews ✅
   - Payments ✅
   - Vendor ✅
   - Admin ✅

---

## Expected Response Format

### Success Response

```json
{
    "success": true,
    "message": "Operation successful",
    "data": { ... }
}
```

### Error Response

```json
{
    "success": false,
    "message": "Error message",
    "errors": {
        "field": ["Error detail"]
    }
}
```

### Pagination Response

```json
{
    "success": true,
    "data": {
        "current_page": 1,
        "data": [ ... ],
        "first_page_url": "...",
        "from": 1,
        "last_page": 5,
        "last_page_url": "...",
        "next_page_url": "...",
        "path": "...",
        "per_page": 15,
        "prev_page_url": null,
        "to": 15,
        "total": 75
    }
}
```

---

## Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `422` - Validation Error
- `500` - Server Error

---

**🧪 Happy Testing!**
