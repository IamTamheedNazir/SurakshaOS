const jwt = require('jsonwebtoken');
const db = require('../config/database');

/**
 * Protect routes - Verify JWT token
 */
exports.protect = async (req, res, next) => {
  try {
    let token;
    
    // Get token from header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }
    
    // Check if token exists
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this route. Please login.'
      });
    }
    
    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Get user from database
      const [users] = await db.query(
        'SELECT id, email, role, status FROM users WHERE id = ?',
        [decoded.id]
      );
      
      if (users.length === 0) {
        return res.status(401).json({
          success: false,
          message: 'User not found'
        });
      }
      
      const user = users[0];
      
      // Check if user is active
      if (user.status !== 'active') {
        return res.status(401).json({
          success: false,
          message: 'Your account is not active. Please contact support.'
        });
      }
      
      // Attach user to request
      req.user = user;
      next();
      
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired token. Please login again.'
      });
    }
    
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(500).json({
      success: false,
      message: 'Authentication error',
      error: error.message
    });
  }
};

/**
 * Authorize specific roles
 */
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized'
      });
    }
    
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role '${req.user.role}' is not authorized to access this route`
      });
    }
    
    next();
  };
};

/**
 * Optional auth - Attach user if token exists, but don't require it
 */
exports.optionalAuth = async (req, res, next) => {
  try {
    let token;
    
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }
    
    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        const [users] = await db.query(
          'SELECT id, email, role, status FROM users WHERE id = ?',
          [decoded.id]
        );
        
        if (users.length > 0 && users[0].status === 'active') {
          req.user = users[0];
        }
      } catch (error) {
        // Token invalid, but continue without user
      }
    }
    
    next();
    
  } catch (error) {
    next();
  }
};

/**
 * Check if user owns resource
 */
exports.checkOwnership = (resourceType) => {
  return async (req, res, next) => {
    try {
      const userId = req.user.id;
      const resourceId = req.params.id;
      
      let query;
      
      switch (resourceType) {
        case 'booking':
          query = 'SELECT user_id FROM bookings WHERE id = ?';
          break;
        case 'package':
          query = 'SELECT v.user_id FROM packages p JOIN vendors v ON p.vendor_id = v.id WHERE p.id = ?';
          break;
        case 'vendor':
          query = 'SELECT user_id FROM vendors WHERE id = ?';
          break;
        default:
          return res.status(400).json({
            success: false,
            message: 'Invalid resource type'
          });
      }
      
      const [results] = await db.query(query, [resourceId]);
      
      if (results.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Resource not found'
        });
      }
      
      if (results[0].user_id !== userId && req.user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to access this resource'
        });
      }
      
      next();
      
    } catch (error) {
      console.error('Ownership check error:', error);
      res.status(500).json({
        success: false,
        message: 'Error checking resource ownership',
        error: error.message
      });
    }
  };
};

/**
 * Rate limiting per user
 */
exports.userRateLimit = (maxRequests, windowMs) => {
  const requests = new Map();
  
  return (req, res, next) => {
    if (!req.user) {
      return next();
    }
    
    const userId = req.user.id;
    const now = Date.now();
    
    if (!requests.has(userId)) {
      requests.set(userId, []);
    }
    
    const userRequests = requests.get(userId);
    
    // Remove old requests outside window
    const validRequests = userRequests.filter(time => now - time < windowMs);
    
    if (validRequests.length >= maxRequests) {
      return res.status(429).json({
        success: false,
        message: 'Too many requests. Please try again later.'
      });
    }
    
    validRequests.push(now);
    requests.set(userId, validRequests);
    
    next();
  };
};

/**
 * Check subscription plan
 */
exports.checkSubscription = (...allowedPlans) => {
  return async (req, res, next) => {
    try {
      if (req.user.role !== 'vendor') {
        return next();
      }
      
      const [vendors] = await db.query(
        'SELECT subscription_plan FROM vendors WHERE user_id = ?',
        [req.user.id]
      );
      
      if (vendors.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Vendor not found'
        });
      }
      
      const plan = vendors[0].subscription_plan;
      
      if (!allowedPlans.includes(plan)) {
        return res.status(403).json({
          success: false,
          message: `This feature requires ${allowedPlans.join(' or ')} plan. Your current plan: ${plan}`
        });
      }
      
      next();
      
    } catch (error) {
      console.error('Subscription check error:', error);
      res.status(500).json({
        success: false,
        message: 'Error checking subscription',
        error: error.message
      });
    }
  };
};
