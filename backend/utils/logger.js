const winston = require('winston');
const path = require('path');
const fs = require('fs');

/**
 * Winston Logger Configuration
 * Logs to console and files
 */

// Create logs directory if it doesn't exist
const logsDir = path.join(__dirname, '../logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Define log format
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.splat(),
  winston.format.json()
);

// Console format (colorized for development)
const consoleFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.printf(({ timestamp, level, message, ...meta }) => {
    let msg = `${timestamp} [${level}]: ${message}`;
    if (Object.keys(meta).length > 0) {
      msg += ` ${JSON.stringify(meta)}`;
    }
    return msg;
  })
);

// Create logger instance
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: logFormat,
  defaultMeta: { service: 'umrahconnect-api' },
  transports: [
    // Write all logs to combined.log
    new winston.transports.File({
      filename: path.join(logsDir, 'combined.log'),
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
    
    // Write error logs to error.log
    new winston.transports.File({
      filename: path.join(logsDir, 'error.log'),
      level: 'error',
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
  ],
});

// Add console transport in development
if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new winston.transports.Console({
      format: consoleFormat,
    })
  );
}

/**
 * Stream for Morgan HTTP logger
 */
logger.stream = {
  write: (message) => {
    logger.info(message.trim());
  },
};

/**
 * Log HTTP Request
 */
logger.logRequest = (req, res, responseTime) => {
  logger.info('HTTP Request', {
    method: req.method,
    url: req.originalUrl,
    ip: req.ip,
    userAgent: req.get('user-agent'),
    statusCode: res.statusCode,
    responseTime: `${responseTime}ms`,
    userId: req.user ? req.user.id : 'anonymous',
  });
};

/**
 * Log Database Query
 */
logger.logQuery = (query, duration) => {
  logger.debug('Database Query', {
    query,
    duration: `${duration}ms`,
  });
};

/**
 * Log Authentication Event
 */
logger.logAuth = (event, userId, ip, success = true) => {
  logger.info('Authentication Event', {
    event,
    userId,
    ip,
    success,
    timestamp: new Date().toISOString(),
  });
};

/**
 * Log File Upload
 */
logger.logUpload = (userId, fileName, fileSize, destination) => {
  logger.info('File Upload', {
    userId,
    fileName,
    fileSize: `${(fileSize / 1024).toFixed(2)} KB`,
    destination,
    timestamp: new Date().toISOString(),
  });
};

/**
 * Log Email Sent
 */
logger.logEmail = (to, subject, success = true) => {
  logger.info('Email Sent', {
    to,
    subject,
    success,
    timestamp: new Date().toISOString(),
  });
};

/**
 * Log Security Event
 */
logger.logSecurity = (event, details, severity = 'medium') => {
  logger.warn('Security Event', {
    event,
    details,
    severity,
    timestamp: new Date().toISOString(),
  });
};

/**
 * Log Payment Transaction
 */
logger.logPayment = (userId, amount, status, transactionId) => {
  logger.info('Payment Transaction', {
    userId,
    amount,
    status,
    transactionId,
    timestamp: new Date().toISOString(),
  });
};

module.exports = logger;
