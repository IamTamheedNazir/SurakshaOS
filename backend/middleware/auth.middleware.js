const { verifyAccessToken, extractTokenFromHeader } = require('../utils/jwt.utils');
const User = require('../models/User.model');

/**
 * JWT Authentication Middleware
 * Verifies JWT token and attaches user to request
 */

/**
 * Authenticate JWT Token
 * Verifies token and attaches user to request object
 */
const authenticate = async (req, res, next) => {
  try {
    // Extract token from Authorization header
    const token = extractTokenFromHeader(req.headers.authorization);
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.',
      });
    }

    // Verify token
    const decoded = verifyAccessToken(token);
    
    // Find user
    const user = await User.findByPk(decoded.id);
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token. User not found.',
      });
    }

    // Check if user can login
    if (!user.canLogin()) {
      return res.status(403).json({
        success: false,
        message: 'Account is inactive, blocked, or not verified.',
      });
    }

    // Attach user to request
    req.user = user;
    req.userId = user.id;
    req.userType = user.user_type;
    
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token.',
      error: error.message,
    });
  }
};

/**
 * Optional Authentication
 * Attaches user if token is valid, but doesn't fail if no token
 */
const optionalAuth = async (req, res, next) => {
  try {
    const token = extractTokenFromHeader(req.headers.authorization);
    
    if (token) {
      const decoded = verifyAccessToken(token);
      const user = await User.findByPk(decoded.id);
      
      if (user && user.canLogin()) {
        req.user = user;
        req.userId = user.id;
        req.userType = user.user_type;
      }
    }
    
    next();
  } catch (error) {
    // Continue without authentication
    next();
  }
};

/**
 * Authorize User Types
 * Checks if user has required user type
 * @param  {...string} allowedTypes - Allowed user types (pilgrim, vendor, admin)
 */
const authorize = (...allowedTypes) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required.',
      });
    }

    if (!allowedTypes.includes(req.user.user_type)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Insufficient permissions.',
        requiredTypes: allowedTypes,
        yourType: req.user.user_type,
      });
    }

    next();
  };
};

/**
 * Check if User is Admin
 */
const isAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required.',
    });
  }

  if (req.user.user_type !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Admin privileges required.',
    });
  }

  next();
};

/**
 * Check if User is Vendor
 */
const isVendor = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required.',
    });
  }

  if (req.user.user_type !== 'vendor') {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Vendor account required.',
    });
  }

  next();
};

/**
 * Check if User is Pilgrim
 */
const isPilgrim = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required.',
    });
  }

  if (req.user.user_type !== 'pilgrim') {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Pilgrim account required.',
    });
  }

  next();
};

/**
 * Check if User Owns Resource
 * Compares user ID with resource owner ID
 * @param {string} resourceIdParam - Request parameter name containing resource owner ID
 */
const isOwner = (resourceIdParam = 'userId') => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required.',
      });
    }

    const resourceOwnerId = req.params[resourceIdParam] || req.body[resourceIdParam];
    
    if (req.user.id !== resourceOwnerId && req.user.user_type !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only access your own resources.',
      });
    }

    next();
  };
};

/**
 * Check if Email is Verified
 */
const requireEmailVerification = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required.',
    });
  }

  if (!req.user.is_email_verified) {
    return res.status(403).json({
      success: false,
      message: 'Email verification required. Please verify your email to continue.',
      requiresVerification: true,
    });
  }

  next();
};

/**
 * Check if Phone is Verified
 */
const requirePhoneVerification = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required.',
    });
  }

  if (!req.user.is_phone_verified) {
    return res.status(403).json({
      success: false,
      message: 'Phone verification required. Please verify your phone to continue.',
      requiresVerification: true,
    });
  }

  next();
};

module.exports = {
  authenticate,
  optionalAuth,
  authorize,
  isAdmin,
  isVendor,
  isPilgrim,
  isOwner,
  requireEmailVerification,
  requirePhoneVerification,
};
