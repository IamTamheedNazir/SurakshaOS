const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const cookieParser = require('cookie-parser');
const passport = require('./config/passport.config');
require('dotenv').config();

// Import configurations
const { testConnection, syncDatabase } = require('./config/database.config');
const { ensureBucketExists } = require('./config/wasabi.config');
const { verifyConnection: verifyEmailService } = require('./services/email.service');

// Import middleware
const { apiLimiter } = require('./middleware/rateLimiter.middleware');
const { notFound, errorHandler } = require('./middleware/errorHandler.middleware');

// Import routes
const authRoutes = require('./routes/auth.routes');

// Import logger
const logger = require('./utils/logger');

/**
 * UmrahConnect 2.0 Backend Server
 * Node.js + Express + PostgreSQL + Wasabi S3
 */

// Initialize Express app
const app = express();

// ============================================
// SECURITY MIDDLEWARE
// ============================================

// Helmet - Security headers
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  crossOriginEmbedderPolicy: false,
}));

// CORS - Cross-Origin Resource Sharing
const corsOptions = {
  origin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : ['http://localhost:3000'],
  credentials: process.env.CORS_CREDENTIALS === 'true',
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

// ============================================
// BODY PARSING MIDDLEWARE
// ============================================

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// ============================================
// COMPRESSION & LOGGING
// ============================================

// Compression - Gzip compression
app.use(compression());

// Morgan - HTTP request logger
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined', { stream: logger.stream }));
}

// ============================================
// PASSPORT INITIALIZATION
// ============================================

app.use(passport.initialize());

// ============================================
// RATE LIMITING
// ============================================

// Apply rate limiting to all API routes
app.use('/api/', apiLimiter);

// ============================================
// HEALTH CHECK
// ============================================

app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'UmrahConnect API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    version: process.env.API_VERSION || 'v1',
  });
});

// ============================================
// API ROUTES
// ============================================

const API_VERSION = process.env.API_VERSION || 'v1';

// Auth routes
app.use(`/api/${API_VERSION}/auth`, authRoutes);

// Root route
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to UmrahConnect API',
    version: API_VERSION,
    documentation: `${process.env.BASE_URL}/api/${API_VERSION}/docs`,
    endpoints: {
      health: '/health',
      auth: `/api/${API_VERSION}/auth`,
    },
  });
});

// ============================================
// ERROR HANDLING
// ============================================

// 404 handler
app.use(notFound);

// Global error handler
app.use(errorHandler);

// ============================================
// SERVER INITIALIZATION
// ============================================

const PORT = process.env.PORT || 5000;

/**
 * Initialize Server
 * - Test database connection
 * - Sync database models
 * - Verify Wasabi S3 bucket
 * - Verify email service
 * - Start Express server
 */
const startServer = async () => {
  try {
    console.log('🚀 Starting UmrahConnect Backend Server...\n');
    
    // Test database connection
    console.log('📊 Testing database connection...');
    const dbConnected = await testConnection();
    if (!dbConnected) {
      throw new Error('Database connection failed');
    }
    
    // Sync database models
    console.log('🔄 Syncing database models...');
    const dbSynced = await syncDatabase(false, false);
    if (!dbSynced) {
      throw new Error('Database sync failed');
    }
    
    // Verify Wasabi S3 bucket
    console.log('☁️  Verifying Wasabi S3 bucket...');
    await ensureBucketExists();
    
    // Verify email service
    console.log('📧 Verifying email service...');
    await verifyEmailService();
    
    // Start server
    app.listen(PORT, () => {
      console.log('\n✅ Server initialized successfully!\n');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log(`🌐 Server running on: ${process.env.BASE_URL || `http://localhost:${PORT}`}`);
      console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🔐 API Version: ${API_VERSION}`);
      console.log(`📊 Database: PostgreSQL`);
      console.log(`☁️  Storage: Wasabi S3`);
      console.log(`📧 Email: ${process.env.SMTP_HOST}`);
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
      
      logger.info('Server started successfully', {
        port: PORT,
        environment: process.env.NODE_ENV,
        version: API_VERSION,
      });
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    logger.error('Server startup failed', { error: error.message, stack: error.stack });
    process.exit(1);
  }
};

// ============================================
// GRACEFUL SHUTDOWN
// ============================================

const gracefulShutdown = async (signal) => {
  console.log(`\n${signal} received. Starting graceful shutdown...`);
  
  try {
    // Close database connection
    const { closeConnection } = require('./config/database.config');
    await closeConnection();
    
    console.log('✅ Graceful shutdown completed');
    logger.info('Server shutdown completed', { signal });
    process.exit(0);
  } catch (error) {
    console.error('❌ Error during shutdown:', error.message);
    logger.error('Shutdown error', { error: error.message });
    process.exit(1);
  }
};

// Handle shutdown signals
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
  logger.error('Uncaught Exception', { error: error.message, stack: error.stack });
  gracefulShutdown('UNCAUGHT_EXCEPTION');
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
  logger.error('Unhandled Rejection', { reason, promise });
  gracefulShutdown('UNHANDLED_REJECTION');
});

// Start the server
startServer();

module.exports = app;
