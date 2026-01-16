# 🕌 UmrahConnect 2.0

## Complete Umrah Booking Platform with PNR Inventory System

[![Laravel](https://img.shields.io/badge/Laravel-10.x-red.svg)](https://laravel.com)
[![React](https://img.shields.io/badge/React-18.x-blue.svg)](https://reactjs.org)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

---

## 📋 OVERVIEW

UmrahConnect 2.0 is a complete travel booking platform built with Laravel backend and React frontend. It includes a comprehensive Umrah package booking system plus an advanced PNR (Passenger Name Record) inventory management system for flight seat selling.

### **Key Features:**
- ✅ Complete Umrah package booking system
- ✅ Advanced PNR inventory management
- ✅ Multi-role system (Admin/Vendor/Customer)
- ✅ Payment gateway integration (Razorpay/Stripe/PayPal)
- ✅ Review and rating system
- ✅ Automated voucher generation
- ✅ Email & WhatsApp notifications
- ✅ CRM & HRM integration
- ✅ Real-time profit/loss tracking

---

## 🏗️ PROJECT STRUCTURE

```
umrahconnect-2.0/
├── backend/                    # Laravel 10 Backend API
│   ├── app/                   # Application code
│   │   ├── Models/           # 10 Eloquent models
│   │   └── Http/Controllers/ # 10 API controllers
│   ├── database/             # Migrations & seeders
│   ├── routes/               # API routes
│   ├── config/               # Configuration
│   └── public/               # Public assets
│
├── frontend/                   # React Frontend
│   ├── src/                  # Source code
│   ├── public/               # Static assets
│   └── dist/                 # Production build
│
├── database/                   # Database files
├── install/                    # Installation system
├── docs/                       # Documentation
└── README.md                   # This file
```

---

## 🚀 QUICK START

### **Prerequisites:**
- PHP 8.1+
- Composer
- MySQL 5.7+
- Node.js 16+
- npm or yarn

### **Installation:**

#### **1. Clone Repository**
```bash
git clone https://github.com/IamTamheedNazir/umrahconnect-2.0.git
cd umrahconnect-2.0
```

#### **2. Backend Setup**
```bash
cd backend
composer install
cp .env.example .env
# Edit .env with your database credentials
php artisan key:generate
php artisan jwt:secret
php artisan migrate --seed
php artisan serve
```

#### **3. Frontend Setup**
```bash
cd frontend
npm install
cp .env.example .env
# Edit .env with your backend API URL
npm run dev
```

#### **4. Access Application**
- Frontend: http://localhost:5173
- Backend API: http://localhost:8000/api

---

## 📦 FEATURES

### **1. Umrah Booking System**
- Package management (CRUD)
- Advanced search & filters
- Booking management
- Payment processing
- Review & ratings
- Multi-role dashboards

### **2. PNR Inventory System**
- Flight inventory management
- Seat selling with profit tracking
- Auto voucher generation (PDF)
- Email & WhatsApp distribution
- TTL (Time To Live) alerts
- Expiry management
- Loss prevention

### **3. User Management**
- Role-based access control
- Customer portal
- Vendor dashboard
- Admin panel
- Profile management

### **4. Payment Integration**
- Razorpay
- Stripe
- PayPal
- Invoice generation
- Transaction history

### **5. Notifications**
- Email notifications
- WhatsApp integration
- In-app notifications
- Booking confirmations

---

## 🔌 API ENDPOINTS

### **Authentication**
```
POST   /api/auth/register      - Register new user
POST   /api/auth/login         - Login user
POST   /api/auth/logout        - Logout user
GET    /api/auth/me            - Get current user
```

### **Packages**
```
GET    /api/packages           - List all packages
GET    /api/packages/{id}      - Get package details
POST   /api/packages           - Create package (vendor)
PUT    /api/packages/{id}      - Update package (vendor)
DELETE /api/packages/{id}      - Delete package (vendor)
```

### **Bookings**
```
GET    /api/bookings           - List bookings
POST   /api/bookings           - Create booking
GET    /api/bookings/{id}      - Get booking details
PATCH  /api/bookings/{id}/status - Update status
```

### **PNR Inventory**
```
GET    /api/pnr-inventory/dashboard - Dashboard stats
GET    /api/pnr-inventory      - List inventory
POST   /api/pnr-inventory      - Add PNR
POST   /api/pnr-sales          - Sell seats
GET    /api/pnr-sales/{id}/download-voucher - Download voucher
```

**Full API Documentation:** See `docs/API_DOCUMENTATION.md`

---

## 🗄️ DATABASE

### **Tables (10):**
1. users - User accounts
2. packages - Umrah packages
3. bookings - Booking records
4. reviews - Package reviews
5. payments - Payment transactions
6. vendor_profiles - Vendor details
7. settings - Application settings
8. customers - Customer CRM
9. pnr_inventory - Flight inventory
10. pnr_sales - Seat sales

**Schema Details:** See `docs/DATABASE_SCHEMA.md`

---

## 🚀 DEPLOYMENT

### **cPanel Deployment:**

#### **Backend:**
1. Upload `backend` folder to `public_html/backend`
2. Create MySQL database
3. Configure `.env` file
4. Run: `composer install --no-dev`
5. Run: `php artisan migrate --force`
6. Run: `php artisan db:seed`

#### **Frontend:**
1. Build: `npm run build`
2. Upload `dist` folder contents to `public_html`
3. Configure `.htaccess` for routing

**Detailed Guide:** See `docs/DEPLOYMENT.md`

---

## 🧪 TESTING

### **Test Accounts:**
```
Admin:
Email: admin@umrahconnect.in
Password: admin123

Vendor:
Email: vendor@umrahconnect.in
Password: vendor123

Customer:
Email: customer@umrahconnect.in
Password: customer123
```

**⚠️ Change passwords after first login!**

---

## 📚 DOCUMENTATION

- **Installation:** `docs/INSTALLATION.md`
- **Deployment:** `docs/DEPLOYMENT.md`
- **API Documentation:** `docs/API_DOCUMENTATION.md`
- **PNR Inventory:** `docs/PNR_INVENTORY.md`
- **Database Schema:** `docs/DATABASE_SCHEMA.md`
- **Quick Test:** `docs/QUICK_TEST.md`

---

## 🛠️ TECH STACK

### **Backend:**
- Laravel 10
- PHP 8.1+
- MySQL
- JWT Authentication
- RESTful API

### **Frontend:**
- React 18
- Vite
- React Router
- Axios
- Tailwind CSS

### **Additional:**
- Composer
- npm/yarn
- Git

---

## 📊 STATISTICS

- **Backend:** 10 Models, 10 Controllers, 10 Migrations
- **API Endpoints:** 65+
- **Frontend Pages:** 20+
- **Total Files:** 40+
- **Lines of Code:** ~7,500+

---

## 🤝 CONTRIBUTING

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

---

## 📝 LICENSE

This project is licensed under the MIT License.

---

## 👥 TEAM

**Developer:** Tamheed Nazir  
**GitHub:** [@IamTamheedNazir](https://github.com/IamTamheedNazir)

---

## 📞 SUPPORT

For issues, questions, or support:
- **GitHub Issues:** [Create an issue](https://github.com/IamTamheedNazir/umrahconnect-2.0/issues)
- **Email:** tnsolution1s@gmail.com

---

## 🎯 ROADMAP

### **Completed:**
- ✅ Complete Umrah booking system
- ✅ PNR inventory management
- ✅ Payment gateway integration
- ✅ Multi-role system
- ✅ Voucher generation
- ✅ Email/WhatsApp notifications

### **Planned:**
- ⏳ Mobile app (React Native)
- ⏳ Advanced analytics
- ⏳ Multi-language support
- ⏳ SMS notifications
- ⏳ Advanced reporting

---

## 🌟 FEATURES HIGHLIGHT

### **PNR Inventory System:**
The standout feature of UmrahConnect 2.0 is the advanced PNR Inventory Management System that allows travel agents to:

- Purchase flight PNR blocks in bulk
- Track inventory with TTL (Time To Live)
- Sell seats to customers
- Auto-generate professional vouchers
- Send vouchers via Email & WhatsApp
- Track profit/loss automatically
- Get expiry alerts
- Integrate with CRM & Accounting

**This replaces manual Google Sheets tracking with a fully automated system!**

---

## 🎉 ACKNOWLEDGMENTS

Built with ❤️ for the travel industry.

Special thanks to:
- Laravel community
- React community
- All contributors

---

## 📈 VERSION

**Current Version:** 2.0.0  
**Release Date:** January 2024  
**Status:** Production Ready

---

**🚀 Ready to revolutionize your travel business!** 🚀

---

## 🔗 LINKS

- **Live Demo:** https://umrahconnect.in
- **Documentation:** [docs/](docs/)
- **API Docs:** [docs/API_DOCUMENTATION.md](docs/API_DOCUMENTATION.md)
- **GitHub:** https://github.com/IamTamheedNazir/umrahconnect-2.0

---

**Made with ❤️ for UmrahConnect**
