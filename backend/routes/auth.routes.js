const express = require('express');
const router = express.Router();
const passport = require('../config/passport.config');
const {
  register,
  login,
  verifyToken,
  logout,
  forgotPassword,
  verifyResetToken,
  resetPassword,
  verifyEmail,
  resendVerification,
} = require('../controllers/auth.controller');
const {
  googleCallback,
  facebookCallback,
} = require('../controllers/oauth.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { body, query } = require('express-validator');
const { validate } = require('../middleware/validation.middleware');

/**
 * Auth Routes
 * Base path: /api/v1/auth
 */

// ============================================
// LOCAL AUTHENTICATION
// ============================================

/**
 * @route   POST /api/v1/auth/register
 * @desc    Register new user
 * @access  Public
 */
router.post(
  '/register',
  [
    body('full_name')
      .trim()
      .notEmpty()
      .withMessage('Full name is required')
      .isLength({ min: 2, max: 100 })
      .withMessage('Full name must be between 2 and 100 characters'),
    body('email')
      .trim()
      .notEmpty()
      .withMessage('Email is required')
      .isEmail()
      .withMessage('Please provide a valid email')
      .normalizeEmail(),
    body('phone')
      .trim()
      .notEmpty()
      .withMessage('Phone number is required')
      .matches(/^[0-9+\-\s()]+$/)
      .withMessage('Please provide a valid phone number'),
    body('password')
      .notEmpty()
      .withMessage('Password is required')
      .isLength({ min: 8 })
      .withMessage('Password must be at least 8 characters')
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
      .withMessage('Password must contain uppercase, lowercase, number, and special character'),
    body('user_type')
      .optional()
      .isIn(['pilgrim', 'vendor'])
      .withMessage('User type must be either pilgrim or vendor'),
    body('agree_to_terms')
      .notEmpty()
      .withMessage('You must agree to terms and conditions')
      .isBoolean()
      .withMessage('Invalid value for agree_to_terms')
      .custom((value) => value === true)
      .withMessage('You must agree to terms and conditions'),
    validate,
  ],
  register
);

/**
 * @route   POST /api/v1/auth/login
 * @desc    Login user
 * @access  Public
 */
router.post(
  '/login',
  [
    body('email')
      .trim()
      .notEmpty()
      .withMessage('Email is required')
      .isEmail()
      .withMessage('Please provide a valid email')
      .normalizeEmail(),
    body('password')
      .notEmpty()
      .withMessage('Password is required'),
    validate,
  ],
  login
);

/**
 * @route   GET /api/v1/auth/verify
 * @desc    Verify JWT token
 * @access  Private
 */
router.get('/verify', authenticate, verifyToken);

/**
 * @route   POST /api/v1/auth/logout
 * @desc    Logout user
 * @access  Private
 */
router.post('/logout', authenticate, logout);

// ============================================
// PASSWORD RECOVERY
// ============================================

/**
 * @route   POST /api/v1/auth/forgot-password
 * @desc    Send password reset email
 * @access  Public
 */
router.post(
  '/forgot-password',
  [
    body('email')
      .trim()
      .notEmpty()
      .withMessage('Email is required')
      .isEmail()
      .withMessage('Please provide a valid email')
      .normalizeEmail(),
    validate,
  ],
  forgotPassword
);

/**
 * @route   GET /api/v1/auth/verify-reset-token
 * @desc    Verify password reset token
 * @access  Public
 */
router.get(
  '/verify-reset-token',
  [
    query('token')
      .notEmpty()
      .withMessage('Token is required'),
    validate,
  ],
  verifyResetToken
);

/**
 * @route   POST /api/v1/auth/reset-password
 * @desc    Reset password with token
 * @access  Public
 */
router.post(
  '/reset-password',
  [
    body('token')
      .notEmpty()
      .withMessage('Token is required'),
    body('password')
      .notEmpty()
      .withMessage('Password is required')
      .isLength({ min: 8 })
      .withMessage('Password must be at least 8 characters')
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
      .withMessage('Password must contain uppercase, lowercase, number, and special character'),
    validate,
  ],
  resetPassword
);

// ============================================
// EMAIL VERIFICATION
// ============================================

/**
 * @route   GET /api/v1/auth/verify-email
 * @desc    Verify email with token
 * @access  Public
 */
router.get(
  '/verify-email',
  [
    query('token')
      .notEmpty()
      .withMessage('Token is required'),
    validate,
  ],
  verifyEmail
);

/**
 * @route   POST /api/v1/auth/resend-verification
 * @desc    Resend email verification
 * @access  Public
 */
router.post(
  '/resend-verification',
  [
    body('email')
      .trim()
      .notEmpty()
      .withMessage('Email is required')
      .isEmail()
      .withMessage('Please provide a valid email')
      .normalizeEmail(),
    validate,
  ],
  resendVerification
);

// ============================================
// OAUTH AUTHENTICATION
// ============================================

/**
 * @route   GET /api/v1/auth/google
 * @desc    Initiate Google OAuth
 * @access  Public
 */
router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    session: false,
  })
);

/**
 * @route   GET /api/v1/auth/google/callback
 * @desc    Google OAuth callback
 * @access  Public
 */
router.get(
  '/google/callback',
  passport.authenticate('google', {
    session: false,
    failureRedirect: `${process.env.FRONTEND_URL}/login?error=google_auth_failed`,
  }),
  googleCallback
);

/**
 * @route   GET /api/v1/auth/facebook
 * @desc    Initiate Facebook OAuth
 * @access  Public
 */
router.get(
  '/facebook',
  passport.authenticate('facebook', {
    scope: ['email'],
    session: false,
  })
);

/**
 * @route   GET /api/v1/auth/facebook/callback
 * @desc    Facebook OAuth callback
 * @access  Public
 */
router.get(
  '/facebook/callback',
  passport.authenticate('facebook', {
    session: false,
    failureRedirect: `${process.env.FRONTEND_URL}/login?error=facebook_auth_failed`,
  }),
  facebookCallback
);

module.exports = router;
