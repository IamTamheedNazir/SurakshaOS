const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth.middleware');
const vendorController = require('../controllers/vendor.controller');
const upload = require('../middleware/upload.middleware');

/**
 * @route   POST /api/vendor/register
 * @desc    Register new vendor with dynamic fields
 * @access  Public
 */
router.post(
  '/register',
  upload.fields([
    { name: 'company_logo', maxCount: 1 },
    { name: 'gst_certificate', maxCount: 1 },
    { name: 'pan_card', maxCount: 1 },
    { name: 'hajj_certificate', maxCount: 1 },
    { name: 'umrah_certificate', maxCount: 1 },
    { name: 'tourism_license', maxCount: 1 },
    { name: 'trade_license', maxCount: 1 },
    { name: 'cancelled_cheque', maxCount: 1 },
    { name: 'address_proof', maxCount: 1 },
    { name: 'identity_proof', maxCount: 1 }
  ]),
  vendorController.registerVendor
);

/**
 * @route   GET /api/vendor/registration-form
 * @desc    Get dynamic registration form fields
 * @access  Public
 */
router.get(
  '/registration-form',
  vendorController.getRegistrationForm
);

/**
 * @route   GET /api/vendor/dashboard
 * @desc    Get vendor dashboard data
 * @access  Vendor
 */
router.get(
  '/dashboard',
  protect,
  authorize('vendor'),
  vendorController.getDashboard
);

/**
 * @route   GET /api/vendor/profile
 * @desc    Get vendor profile
 * @access  Vendor
 */
router.get(
  '/profile',
  protect,
  authorize('vendor'),
  vendorController.getProfile
);

/**
 * @route   PUT /api/vendor/profile
 * @desc    Update vendor profile
 * @access  Vendor
 */
router.put(
  '/profile',
  protect,
  authorize('vendor'),
  upload.single('company_logo'),
  vendorController.updateProfile
);

/**
 * @route   GET /api/vendor/documents
 * @desc    Get vendor documents
 * @access  Vendor
 */
router.get(
  '/documents',
  protect,
  authorize('vendor'),
  vendorController.getDocuments
);

/**
 * @route   POST /api/vendor/documents
 * @desc    Upload vendor document
 * @access  Vendor
 */
router.post(
  '/documents',
  protect,
  authorize('vendor'),
  upload.single('document'),
  vendorController.uploadDocument
);

/**
 * @route   DELETE /api/vendor/documents/:id
 * @desc    Delete vendor document
 * @access  Vendor
 */
router.delete(
  '/documents/:id',
  protect,
  authorize('vendor'),
  vendorController.deleteDocument
);

/**
 * @route   GET /api/vendor/packages
 * @desc    Get vendor packages
 * @access  Vendor
 */
router.get(
  '/packages',
  protect,
  authorize('vendor'),
  vendorController.getPackages
);

/**
 * @route   POST /api/vendor/packages
 * @desc    Create new package
 * @access  Vendor
 */
router.post(
  '/packages',
  protect,
  authorize('vendor'),
  upload.array('images', 10),
  vendorController.createPackage
);

/**
 * @route   GET /api/vendor/packages/:id
 * @desc    Get single package
 * @access  Vendor
 */
router.get(
  '/packages/:id',
  protect,
  authorize('vendor'),
  vendorController.getPackageById
);

/**
 * @route   PUT /api/vendor/packages/:id
 * @desc    Update package
 * @access  Vendor
 */
router.put(
  '/packages/:id',
  protect,
  authorize('vendor'),
  upload.array('images', 10),
  vendorController.updatePackage
);

/**
 * @route   DELETE /api/vendor/packages/:id
 * @desc    Delete package
 * @access  Vendor
 */
router.delete(
  '/packages/:id',
  protect,
  authorize('vendor'),
  vendorController.deletePackage
);

/**
 * @route   PUT /api/vendor/packages/:id/publish
 * @desc    Publish package
 * @access  Vendor
 */
router.put(
  '/packages/:id/publish',
  protect,
  authorize('vendor'),
  vendorController.publishPackage
);

/**
 * @route   PUT /api/vendor/packages/:id/unpublish
 * @desc    Unpublish package
 * @access  Vendor
 */
router.put(
  '/packages/:id/unpublish',
  protect,
  authorize('vendor'),
  vendorController.unpublishPackage
);

/**
 * @route   GET /api/vendor/bookings
 * @desc    Get vendor bookings
 * @access  Vendor
 */
router.get(
  '/bookings',
  protect,
  authorize('vendor'),
  vendorController.getBookings
);

/**
 * @route   GET /api/vendor/bookings/:id
 * @desc    Get single booking
 * @access  Vendor
 */
router.get(
  '/bookings/:id',
  protect,
  authorize('vendor'),
  vendorController.getBookingById
);

/**
 * @route   PUT /api/vendor/bookings/:id/confirm
 * @desc    Confirm booking
 * @access  Vendor
 */
router.put(
  '/bookings/:id/confirm',
  protect,
  authorize('vendor'),
  vendorController.confirmBooking
);

/**
 * @route   PUT /api/vendor/bookings/:id/cancel
 * @desc    Cancel booking
 * @access  Vendor
 */
router.put(
  '/bookings/:id/cancel',
  protect,
  authorize('vendor'),
  vendorController.cancelBooking
);

/**
 * @route   GET /api/vendor/customers
 * @desc    Get vendor customers
 * @access  Vendor
 */
router.get(
  '/customers',
  protect,
  authorize('vendor'),
  vendorController.getCustomers
);

/**
 * @route   GET /api/vendor/reviews
 * @desc    Get vendor reviews
 * @access  Vendor
 */
router.get(
  '/reviews',
  protect,
  authorize('vendor'),
  vendorController.getReviews
);

/**
 * @route   POST /api/vendor/reviews/:id/respond
 * @desc    Respond to review
 * @access  Vendor
 */
router.post(
  '/reviews/:id/respond',
  protect,
  authorize('vendor'),
  vendorController.respondToReview
);

/**
 * @route   GET /api/vendor/earnings
 * @desc    Get vendor earnings
 * @access  Vendor
 */
router.get(
  '/earnings',
  protect,
  authorize('vendor'),
  vendorController.getEarnings
);

/**
 * @route   GET /api/vendor/payouts
 * @desc    Get vendor payouts
 * @access  Vendor
 */
router.get(
  '/payouts',
  protect,
  authorize('vendor'),
  vendorController.getPayouts
);

/**
 * @route   POST /api/vendor/payouts/request
 * @desc    Request payout
 * @access  Vendor
 */
router.post(
  '/payouts/request',
  protect,
  authorize('vendor'),
  vendorController.requestPayout
);

/**
 * @route   GET /api/vendor/analytics
 * @desc    Get vendor analytics
 * @access  Vendor
 */
router.get(
  '/analytics',
  protect,
  authorize('vendor'),
  vendorController.getAnalytics
);

module.exports = router;
