# 🕌 UmrahConnect 2.0 - Complete Multi-Vendor Platform

A comprehensive, production-ready multi-vendor platform for Umrah and Hajj package bookings with advanced CMS capabilities.

## ✨ Features

### 🎯 Core Features
- **Multi-Vendor System** - Vendors can create and manage their packages
- **Dynamic CMS** - Fully customizable banners, themes, testimonials, and site settings
- **Advanced Booking System** - Complete booking workflow with payment tracking
- **Review & Rating System** - Customer reviews with auto-rating updates
- **Role-Based Access** - Admin, Vendor, and Customer roles with specific permissions
- **Responsive Design** - Mobile-first, fully responsive UI

### 🎨 CMS Features
- **Banner Management** - Dynamic hero sliders with custom images and CTAs
- **Theme System** - Multiple themes with live color customization
- **Site Settings** - Centralized configuration for all site parameters
- **Testimonials** - Featured customer testimonials with ratings
- **SEO Optimization** - Meta tags, descriptions, and keywords management

### 💳 Booking & Payment
- **Multi-Step Booking** - Intuitive booking flow with traveler details
- **Payment Integration** - Razorpay, Stripe, and PayPal support
- **Partial Payments** - Support for advance and installment payments
- **Invoice Generation** - Automatic PDF invoice generation
- **Cancellation Management** - Flexible cancellation with refund calculation

### 👥 User Management
- **Vendor Approval System** - Admin approval workflow for vendors
- **Package Approval** - Admin moderation for package listings
- **User Verification** - Email and phone verification
- **Profile Management** - Complete profile with documents upload

### 📊 Analytics & Reports
- **Dashboard Statistics** - Real-time analytics for admin and vendors
- **Revenue Reports** - Detailed financial reports
- **Booking Analytics** - Booking trends and insights
- **Vendor Performance** - Track vendor ratings and bookings

## 🚀 Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database with Mongoose ODM
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **Multer** - File uploads
- **Cloudinary** - Image storage
- **Nodemailer** - Email service
- **PDFKit** - PDF generation

### Frontend
- **React.js** - UI library
- **React Router** - Navigation
- **Axios** - HTTP client
- **Context API** - State management
- **CSS3** - Styling with custom properties

## 📁 Project Structure

```
umrahconnect-2.0/
├── backend/
│   ├── config/
│   │   └── db.js                 # Database connection
│   ├── models/
│   │   ├── User.js               # User model with vendor info
│   │   ├── Package.js            # Package model with CMS features
│   │   ├── Booking.js            # Booking with payment tracking
│   │   ├── Review.js             # Review and rating system
│   │   ├── Banner.js             # CMS banner model
│   │   ├── Theme.js              # CMS theme model
│   │   ├── SiteSettings.js       # Site configuration
│   │   └── Testimonial.js        # Customer testimonials
│   ├── controllers/              # Business logic
│   ├── routes/                   # API routes
│   ├── middleware/               # Custom middleware
│   ├── utils/                    # Helper functions
│   ├── scripts/
│   │   └── seed.js               # Database seeding
│   ├── .env.example              # Environment variables template
│   ├── server.js                 # Server entry point
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── banner/
    │   │   │   ├── BannerSlider.jsx
    │   │   │   └── BannerSlider.css
    │   │   └── testimonials/
    │   │       ├── Testimonials.jsx
    │   │       └── Testimonials.css
    │   ├── contexts/
    │   │   ├── ThemeContext.jsx   # Theme management
    │   │   └── SettingsContext.jsx # Settings management
    │   ├── pages/
    │   │   └── HomePage.jsx        # Dynamic homepage
    │   ├── services/
    │   │   └── api.js              # API service layer
    │   └── App.js
    └── package.json
```

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (v5 or higher)
- npm or yarn

### Backend Setup

1. **Clone the repository**
```bash
git clone https://github.com/IamTamheedNazir/umrahconnect-2.0.git
cd umrahconnect-2.0/backend
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**
```bash
cp .env.example .env
```

Edit `.env` file with your configuration:
```env
# Database
MONGODB_URI=mongodb://localhost:27017/umrahconnect

# JWT
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRE=30d

# Email (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password

# Payment Gateways
RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_KEY_SECRET=your_razorpay_secret

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

4. **Seed the database** (Optional - for testing)
```bash
npm run seed
```

This will create:
- 1 Admin user
- 2 Vendor users
- 2 Customer users
- 4 Sample packages
- 3 Banners
- 2 Themes
- 6 Testimonials
- Site settings

**Default Login Credentials:**
- Admin: `admin@umrahconnect.com` / `password123`
- Vendor 1: `vendor1@umrahconnect.com` / `password123`
- Vendor 2: `vendor2@umrahconnect.com` / `password123`

5. **Start the server**
```bash
# Development mode
npm run dev

# Production mode
npm start
```

Server will run on `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory**
```bash
cd ../frontend
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment**
```bash
# Create .env file
echo "REACT_APP_API_URL=http://localhost:5000/api" > .env
```

4. **Start the development server**
```bash
npm start
```

Frontend will run on `http://localhost:3000`

## 📚 API Documentation

### Authentication Endpoints
```
POST   /api/auth/register          # Register new user
POST   /api/auth/login             # Login user
GET    /api/auth/me                # Get current user
POST   /api/auth/logout            # Logout user
POST   /api/auth/forgot-password   # Request password reset
POST   /api/auth/reset-password    # Reset password
```

### CMS Endpoints
```
# Banners
GET    /api/banners/active         # Get active banners (public)
GET    /api/banners                # Get all banners (admin)
POST   /api/banners                # Create banner (admin)
PUT    /api/banners/:id            # Update banner (admin)
DELETE /api/banners/:id            # Delete banner (admin)

# Themes
GET    /api/themes/active          # Get active theme (public)
GET    /api/themes                 # Get all themes (admin)
POST   /api/themes                 # Create theme (admin)
PUT    /api/themes/:id/activate    # Activate theme (admin)

# Settings
GET    /api/settings/public        # Get public settings
GET    /api/settings               # Get all settings (admin)
PUT    /api/settings               # Update settings (admin)

# Testimonials
GET    /api/testimonials/featured  # Get featured testimonials
GET    /api/testimonials           # Get all testimonials
POST   /api/testimonials           # Create testimonial (admin)
```

## 🔧 Build Status
All CSS image references have been replaced with CSS patterns for optimal performance.
