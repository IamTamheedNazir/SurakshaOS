# UmrahConnect 2.0 - Frontend

> India's leading platform for Umrah packages - Frontend Application

## 🌟 Overview

UmrahConnect 2.0 is a modern, responsive web application built with React that connects pilgrims with trusted Umrah service providers. The platform features a beautiful dark theme, comprehensive booking system, and role-based dashboards for customers, vendors, and administrators.

## ✨ Features

### 🏠 Public Features
- **Homepage** - Hero section, featured packages, testimonials, and CTAs
- **Package Browsing** - Advanced search, filters, sorting, and pagination
- **Package Details** - Image gallery, itinerary, reviews, and booking widget
- **About Us** - Company mission, vision, values, and team
- **Contact** - Contact form, info cards, and map integration
- **FAQ** - Searchable accordion with category filters
- **Terms & Conditions** - Comprehensive legal documentation

### 🔐 Authentication
- **Login** - Split-screen design with OAuth support
- **Registration** - Password strength meter and validation
- **Password Recovery** - Email-based reset flow

### 👤 User Dashboard
- **Overview** - Quick stats and recent activity
- **My Bookings** - Booking management and tracking
- **Saved Packages** - Wishlist functionality
- **Settings** - Profile and security settings

### 🏢 Vendor Dashboard
- **Overview** - Business metrics and recent bookings
- **My Packages** - Package creation and management
- **Bookings** - Customer booking management
- **Analytics** - Revenue and performance charts
- **Settings** - Business info and security

### 👨‍💼 Admin Panel
- **Overview** - Platform-wide statistics
- **User Management** - View and manage users
- **Vendor Management** - Approval system and monitoring
- **Package Management** - Review and approval workflow
- **Bookings** - Platform-wide booking oversight
- **Analytics** - Comprehensive platform insights
- **Settings** - Platform configuration

## 🛠️ Tech Stack

- **Framework:** React 18.2
- **Routing:** React Router DOM 6.21
- **Build Tool:** Vite 5.0
- **Styling:** Custom CSS (Dark Theme)
- **HTTP Client:** Axios 1.6
- **Icons:** Custom SVG Components
- **State Management:** React Hooks + LocalStorage

## 📁 Project Structure

```
frontend/
├── public/                 # Static assets
├── src/
│   ├── components/        # Reusable components
│   │   ├── Navbar.jsx
│   │   ├── Navbar.css
│   │   ├── Footer.jsx
│   │   └── Footer.css
│   ├── pages/            # Page components
│   │   ├── Home.jsx
│   │   ├── Home.css
│   │   ├── Packages.jsx
│   │   ├── Packages.css
│   │   ├── PackageDetail.jsx
│   │   ├── PackageDetail.css
│   │   ├── Booking.jsx
│   │   ├── Booking.css
│   │   ├── Login.jsx
│   │   ├── Login.css
│   │   ├── Register.jsx
│   │   ├── Register.css
│   │   ├── ForgotPassword.jsx
│   │   ├── ForgotPassword.css
│   │   ├── UserDashboard.jsx
│   │   ├── UserDashboard.css
│   │   ├── VendorDashboard.jsx
│   │   ├── VendorDashboard.css
│   │   ├── AdminDashboard.jsx
│   │   ├── AdminDashboard.css
│   │   ├── AboutUs.jsx
│   │   ├── AboutUs.css
│   │   ├── Contact.jsx
│   │   ├── Contact.css
│   │   ├── FAQ.jsx
│   │   ├── FAQ.css
│   │   ├── Terms.jsx
│   │   └── Terms.css
│   ├── App.jsx           # Main app component
│   ├── App.css           # Global app styles
│   ├── main.jsx          # Entry point
│   └── index.css         # Global CSS
├── index.html            # HTML template
├── vite.config.js        # Vite configuration
├── package.json          # Dependencies
└── README.md            # This file
```

## 🚀 Getting Started

### Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/umrahconnect-2.0.git
   cd umrahconnect-2.0/frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open browser**
   ```
   http://localhost:3000
   ```

### Build for Production

```bash
npm run build
```

The optimized production build will be in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

## 🎨 Design System

### Color Palette

```css
/* Primary Colors */
--primary: #0f6b3f;        /* Green */
--primary-dark: #14532d;   /* Dark Green */

/* Background */
--bg-primary: #0b0b0b;     /* Dark Background */
--bg-secondary: rgba(255, 255, 255, 0.03);

/* Status Colors */
--error: #ef4444;          /* Red */
--warning: #f59e0b;        /* Orange */
--info: #3b82f6;           /* Blue */
--success: #10b981;        /* Teal */
```

### Typography

- **Font Family:** Inter, System Fonts
- **Weights:** 300, 400, 500, 600, 700, 800, 900
- **Headers:** 800 weight
- **Body:** 600 weight
- **Labels:** 500 weight

### Breakpoints

```css
/* Extra Small */
@media (max-width: 480px)

/* Mobile */
@media (max-width: 768px)

/* Tablet */
@media (max-width: 1024px)

/* Desktop */
@media (min-width: 1025px)
```

## 🔒 Authentication Flow

### User Roles

1. **Customer** - Browse and book packages
2. **Vendor** - Manage packages and bookings
3. **Admin** - Platform administration

### Protected Routes

- `/dashboard` - Customer only
- `/vendor-dashboard` - Vendor only
- `/admin` - Admin only
- `/booking/:id` - Authenticated users

### Public Routes

- `/` - Homepage
- `/packages` - Package listing
- `/package/:id` - Package details
- `/about` - About us
- `/contact` - Contact
- `/faq` - FAQ
- `/terms` - Terms & Conditions

## 📱 Responsive Design

All pages are fully responsive and optimized for:

- ✅ Desktop (>1024px)
- ✅ Tablet (768px-1024px)
- ✅ Mobile (480px-768px)
- ✅ Extra Small (<480px)

## 🎯 Key Features

### Search & Filters
- Destination search
- Price range filter
- Duration filter
- Package type filter
- Star rating filter
- Sort by price/rating/popularity

### Booking System
- Multi-step booking flow
- Traveler information collection
- Payment integration ready
- Booking confirmation

### Dashboard Features
- Real-time statistics
- Booking management
- Package management
- Analytics charts
- Profile settings

## 🔧 Configuration

### API Integration

Update the API base URL in `vite.config.js`:

```javascript
proxy: {
  '/api': {
    target: 'http://localhost:5000', // Your backend URL
    changeOrigin: true,
  }
}
```

### Environment Variables

Create a `.env` file:

```env
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=UmrahConnect
```

## 📦 Dependencies

### Core
- `react` - UI library
- `react-dom` - React DOM renderer
- `react-router-dom` - Routing
- `axios` - HTTP client

### Development
- `vite` - Build tool
- `@vitejs/plugin-react` - React plugin for Vite
- `eslint` - Code linting
- `prettier` - Code formatting

## 🚀 Deployment

### Vercel (Recommended)

1. Install Vercel CLI
   ```bash
   npm i -g vercel
   ```

2. Deploy
   ```bash
   vercel
   ```

### Netlify

1. Build the project
   ```bash
   npm run build
   ```

2. Deploy the `dist/` folder to Netlify

### Manual Deployment

1. Build for production
   ```bash
   npm run build
   ```

2. Upload `dist/` folder to your hosting provider

## 🧪 Testing

```bash
# Run linter
npm run lint

# Format code
npm run format
```

## 📄 License

MIT License - see LICENSE file for details

## 👥 Team

- **Frontend Development** - UmrahConnect Team
- **UI/UX Design** - UmrahConnect Design Team

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📞 Support

For support, email support@umrahconnect.com or join our Slack channel.

## 🎉 Acknowledgments

- React Team for the amazing framework
- Vite Team for the blazing fast build tool
- All contributors and testers

---

**Built with ❤️ by UmrahConnect Team**
