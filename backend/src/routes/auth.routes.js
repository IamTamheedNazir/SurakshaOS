const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { validateRegistration, validateLogin } = require('../middleware/validators');
const { authenticate } = require('../middleware/auth');

/**
 * @route   POST /api/v1/auth/register
 * @desc    Register new user (customer/vendor)
 * @access  Public
 */
router.post('/register', validateRegistration, authController.register);

/**
 * @route   POST /api/v1/auth/login
 * @desc    Login user
 * @access  Public
 */
router.post('/login', validateLogin, authController.login);

/**
 * @route   POST /api/v1/auth/logout
 * @desc    Logout user
 * @access  Private
 */
router.post('/logout', authenticate, authController.logout);

/**
 * @route   POST /api/v1/auth/refresh-token
 * @desc    Refresh access token
 * @access  Public
 */
router.post('/refresh-token', authController.refreshToken);

/**
 * @route   POST /api/v1/auth/forgot-password
 * @desc    Send password reset link
 * @access  Public
 */
router.post('/forgot-password', authController.forgotPassword);

/**
 * @route   POST /api/v1/auth/reset-password
 * @desc    Reset password with token
 * @access  Public
 */
router.post('/reset-password', authController.resetPassword);

/**
 * @route   POST /api/v1/auth/verify-email
 * @desc    Verify email address
 * @access  Public
 */
router.post('/verify-email', authController.verifyEmail);

/**
 * @route   POST /api/v1/auth/verify-phone
 * @desc    Verify phone number with OTP
 * @access  Public
 */
router.post('/verify-phone', authController.verifyPhone);

/**
 * @route   POST /api/v1/auth/send-otp
 * @desc    Send OTP to phone
 * @access  Public
 */
router.post('/send-otp', authController.sendOTP);

/**
 * @route   GET /api/v1/auth/me
 * @desc    Get current user
 * @access  Private
 */
router.get('/me', authenticate, authController.getCurrentUser);

module.exports = router;
