const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();

// Security Middleware
app.use(helmet());

// CORS Configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

// Body Parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Compression
app.use(compression());

// Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// Health Check
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'UmrahConnect API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// API Routes - FIXED PATHS
app.use('/api/auth', require('./src/routes/auth.routes'));
app.use('/api/users', require('./src/routes/user.routes'));
app.use('/api/packages', require('./src/routes/package.routes'));
app.use('/api/bookings', require('./src/routes/booking.routes'));
app.use('/api/payments', require('./src/routes/payment.routes'));
app.use('/api/reviews', require('./src/routes/review.routes'));
app.use('/api/notifications', require('./src/routes/notification.routes'));

// CMS Routes (Public + Admin)
app.use('/api/banners', require('./routes/banners'));
app.use('/api/themes', require('./routes/themes'));
app.use('/api/settings', require('./routes/settings'));
app.use('/api/testimonials', require('./routes/testimonials'));

// Vendor Routes
app.use('/api/vendor', require('./src/routes/vendor/vendor.routes'));

// Admin Routes
app.use('/api/admin/settings', require('./src/routes/admin/settings.routes'));
app.use('/api/admin/registration-fields', require('./src/routes/admin/registrationFields.routes'));
app.use('/api/admin/vendors', require('./src/routes/admin/vendors.routes'));
app.use('/api/admin/bookings', require('./src/routes/admin/bookings.routes'));
app.use('/api/admin/users', require('./src/routes/admin/users.routes'));
app.use('/api/admin/packages', require('./src/routes/admin/packages.routes'));
app.use('/api/admin/payments', require('./src/routes/admin/payments.routes'));
app.use('/api/admin/analytics', require('./src/routes/admin/analytics.routes'));
app.use('/api/admin/reports', require('./src/routes/admin/reports.routes'));

// Error Handler Middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log('='.repeat(50));
  console.log('🚀 UmrahConnect API Server Started');
  console.log('='.repeat(50));
  console.log(`📍 Port: ${PORT}`);
  console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 API URL: http://localhost:${PORT}`);
  console.log(`💚 Health Check: http://localhost:${PORT}/health`);
  console.log('='.repeat(50));
  console.log('📦 CMS Routes Available:');
  console.log('   - /api/banners (Slider Management)');
  console.log('   - /api/themes (Theme Management)');
  console.log('   - /api/settings (Site Settings)');
  console.log('   - /api/testimonials (Customer Reviews)');
  console.log('='.repeat(50));
});

module.exports = app;
