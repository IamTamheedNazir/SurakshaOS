/**
 * Error Handler Middleware
 * Global error handling for the application
 */

/**
 * Not Found Handler
 * Handles 404 errors for undefined routes
 */
const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

/**
 * Error Handler
 * Handles all errors and sends appropriate response
 */
const errorHandler = (err, req, res, next) => {
  // Set status code
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  
  // Log error in development
  if (process.env.NODE_ENV === 'development') {
    console.error('Error:', {
      message: err.message,
      stack: err.stack,
      url: req.originalUrl,
      method: req.method,
      ip: req.ip,
    });
  }
  
  // Prepare error response
  const errorResponse = {
    success: false,
    message: err.message || 'Internal Server Error',
    statusCode,
  };
  
  // Add stack trace in development
  if (process.env.NODE_ENV === 'development' && process.env.DEBUG === 'true') {
    errorResponse.stack = err.stack;
    errorResponse.url = req.originalUrl;
    errorResponse.method = req.method;
  }
  
  // Handle specific error types
  
  // Sequelize Validation Error
  if (err.name === 'SequelizeValidationError') {
    errorResponse.message = 'Validation Error';
    errorResponse.errors = err.errors.map(e => ({
      field: e.path,
      message: e.message,
    }));
    return res.status(400).json(errorResponse);
  }
  
  // Sequelize Unique Constraint Error
  if (err.name === 'SequelizeUniqueConstraintError') {
    errorResponse.message = 'Duplicate Entry';
    errorResponse.errors = err.errors.map(e => ({
      field: e.path,
      message: `${e.path} already exists`,
    }));
    return res.status(409).json(errorResponse);
  }
  
  // Sequelize Foreign Key Constraint Error
  if (err.name === 'SequelizeForeignKeyConstraintError') {
    errorResponse.message = 'Invalid Reference';
    return res.status(400).json(errorResponse);
  }
  
  // JWT Error
  if (err.name === 'JsonWebTokenError') {
    errorResponse.message = 'Invalid Token';
    return res.status(401).json(errorResponse);
  }
  
  // JWT Expired Error
  if (err.name === 'TokenExpiredError') {
    errorResponse.message = 'Token Expired';
    return res.status(401).json(errorResponse);
  }
  
  // Multer Error (File Upload)
  if (err.name === 'MulterError') {
    if (err.code === 'LIMIT_FILE_SIZE') {
      errorResponse.message = 'File size too large';
    } else if (err.code === 'LIMIT_FILE_COUNT') {
      errorResponse.message = 'Too many files';
    } else if (err.code === 'LIMIT_UNEXPECTED_FILE') {
      errorResponse.message = 'Unexpected file field';
    } else {
      errorResponse.message = 'File upload error';
    }
    return res.status(400).json(errorResponse);
  }
  
  // Cast Error (Invalid ID format)
  if (err.name === 'CastError') {
    errorResponse.message = 'Invalid ID format';
    return res.status(400).json(errorResponse);
  }
  
  // Send error response
  res.status(statusCode).json(errorResponse);
};

/**
 * Async Handler Wrapper
 * Wraps async route handlers to catch errors
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = {
  notFound,
  errorHandler,
  asyncHandler,
};
