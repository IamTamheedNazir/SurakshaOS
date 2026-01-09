const { body, param, query, validationResult } = require('express-validator');

/**
 * Validation result handler
 */
exports.validate = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map(err => ({
        field: err.param,
        message: err.msg
      }))
    });
  }
  
  next();
};

/**
 * Auth validation rules
 */
exports.registerValidation = [
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  body('first_name')
    .trim()
    .notEmpty()
    .withMessage('First name is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('First name must be between 2 and 50 characters'),
  body('last_name')
    .trim()
    .notEmpty()
    .withMessage('Last name is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('Last name must be between 2 and 50 characters'),
  body('phone')
    .optional()
    .isMobilePhone()
    .withMessage('Please provide a valid phone number'),
  body('role')
    .optional()
    .isIn(['customer', 'vendor', 'admin'])
    .withMessage('Invalid role')
];

exports.loginValidation = [
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
];

exports.forgotPasswordValidation = [
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail()
];

exports.resetPasswordValidation = [
  body('token')
    .notEmpty()
    .withMessage('Reset token is required'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number')
];

exports.changePasswordValidation = [
  body('currentPassword')
    .notEmpty()
    .withMessage('Current password is required'),
  body('newPassword')
    .isLength({ min: 8 })
    .withMessage('New password must be at least 8 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('New password must contain at least one uppercase letter, one lowercase letter, and one number')
];

/**
 * Booking validation rules
 */
exports.createBookingValidation = [
  body('package_id')
    .notEmpty()
    .withMessage('Package ID is required')
    .isUUID()
    .withMessage('Invalid package ID'),
  body('departure_date')
    .notEmpty()
    .withMessage('Departure date is required')
    .isISO8601()
    .withMessage('Invalid date format'),
  body('travelers')
    .isArray({ min: 1 })
    .withMessage('At least one traveler is required'),
  body('travelers.*.type')
    .isIn(['adult', 'child', 'infant'])
    .withMessage('Invalid traveler type'),
  body('travelers.*.first_name')
    .trim()
    .notEmpty()
    .withMessage('Traveler first name is required'),
  body('travelers.*.last_name')
    .trim()
    .notEmpty()
    .withMessage('Traveler last name is required'),
  body('total_amount')
    .isFloat({ min: 0 })
    .withMessage('Total amount must be a positive number')
];

exports.checkAvailabilityValidation = [
  body('package_id')
    .notEmpty()
    .withMessage('Package ID is required')
    .isUUID()
    .withMessage('Invalid package ID'),
  body('departure_date')
    .notEmpty()
    .withMessage('Departure date is required')
    .isISO8601()
    .withMessage('Invalid date format'),
  body('travelers')
    .isInt({ min: 1 })
    .withMessage('Number of travelers must be at least 1')
];

exports.calculatePriceValidation = [
  body('package_id')
    .notEmpty()
    .withMessage('Package ID is required')
    .isUUID()
    .withMessage('Invalid package ID'),
  body('adults')
    .isInt({ min: 0 })
    .withMessage('Number of adults must be a non-negative integer'),
  body('children')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Number of children must be a non-negative integer'),
  body('infants')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Number of infants must be a non-negative integer')
];

/**
 * Payment validation rules
 */
exports.createPaymentOrderValidation = [
  body('booking_id')
    .notEmpty()
    .withMessage('Booking ID is required')
    .isUUID()
    .withMessage('Invalid booking ID'),
  body('amount')
    .isFloat({ min: 0 })
    .withMessage('Amount must be a positive number'),
  body('currency')
    .notEmpty()
    .withMessage('Currency is required')
    .isIn(['INR', 'USD', 'EUR', 'GBP', 'SAR'])
    .withMessage('Invalid currency'),
  body('payment_method')
    .notEmpty()
    .withMessage('Payment method is required')
    .isIn(['razorpay', 'stripe', 'paypal', 'bank_transfer', 'upi'])
    .withMessage('Invalid payment method')
];

exports.verifyPaymentValidation = [
  body('payment_id')
    .notEmpty()
    .withMessage('Payment ID is required')
    .isUUID()
    .withMessage('Invalid payment ID'),
  body('gateway_payment_id')
    .notEmpty()
    .withMessage('Gateway payment ID is required'),
  body('booking_id')
    .notEmpty()
    .withMessage('Booking ID is required')
    .isUUID()
    .withMessage('Invalid booking ID')
];

/**
 * Vendor validation rules
 */
exports.vendorRegistrationValidation = [
  body('company_name')
    .trim()
    .notEmpty()
    .withMessage('Company name is required')
    .isLength({ min: 3, max: 100 })
    .withMessage('Company name must be between 3 and 100 characters'),
  body('company_email')
    .isEmail()
    .withMessage('Please provide a valid company email')
    .normalizeEmail(),
  body('company_phone')
    .isMobilePhone()
    .withMessage('Please provide a valid phone number'),
  body('business_type')
    .notEmpty()
    .withMessage('Business type is required'),
  body('gst_number')
    .optional()
    .matches(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/)
    .withMessage('Invalid GST number format')
];

exports.createPackageValidation = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Package title is required')
    .isLength({ min: 10, max: 200 })
    .withMessage('Title must be between 10 and 200 characters'),
  body('description')
    .trim()
    .notEmpty()
    .withMessage('Package description is required')
    .isLength({ min: 50 })
    .withMessage('Description must be at least 50 characters'),
  body('price')
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),
  body('duration_days')
    .isInt({ min: 1 })
    .withMessage('Duration must be at least 1 day'),
  body('available_seats')
    .isInt({ min: 1 })
    .withMessage('Available seats must be at least 1')
];

/**
 * ID parameter validation
 */
exports.idParamValidation = [
  param('id')
    .isUUID()
    .withMessage('Invalid ID format')
];

/**
 * Pagination validation
 */
exports.paginationValidation = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100')
];
