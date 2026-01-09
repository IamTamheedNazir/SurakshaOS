const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const bookingController = require('../controllers/booking.controller');
const upload = require('../middleware/upload.middleware');

/**
 * @route   GET /api/bookings/availability/:packageId
 * @desc    Get package availability for dates
 * @access  Public
 */
router.get(
  '/availability/:packageId',
  bookingController.getAvailability
);

/**
 * @route   POST /api/bookings/check-availability
 * @desc    Check availability for specific date and travelers
 * @access  Public
 */
router.post(
  '/check-availability',
  bookingController.checkAvailability
);

/**
 * @route   POST /api/bookings/calculate-price
 * @desc    Calculate booking price with discounts and taxes
 * @access  Public
 */
router.post(
  '/calculate-price',
  bookingController.calculatePrice
);

/**
 * @route   POST /api/bookings
 * @desc    Create new booking
 * @access  Private (Customer)
 */
router.post(
  '/',
  protect,
  bookingController.createBooking
);

/**
 * @route   GET /api/bookings
 * @desc    Get user bookings
 * @access  Private (Customer)
 */
router.get(
  '/',
  protect,
  bookingController.getUserBookings
);

/**
 * @route   GET /api/bookings/:id
 * @desc    Get single booking
 * @access  Private (Customer/Vendor)
 */
router.get(
  '/:id',
  protect,
  bookingController.getBookingById
);

/**
 * @route   PUT /api/bookings/:id
 * @desc    Update booking
 * @access  Private (Customer)
 */
router.put(
  '/:id',
  protect,
  bookingController.updateBooking
);

/**
 * @route   POST /api/bookings/:id/cancel
 * @desc    Cancel booking
 * @access  Private (Customer)
 */
router.post(
  '/:id/cancel',
  protect,
  bookingController.cancelBooking
);

/**
 * @route   POST /api/bookings/:id/documents
 * @desc    Upload booking documents
 * @access  Private (Customer)
 */
router.post(
  '/:id/documents',
  protect,
  upload.array('documents', 10),
  bookingController.uploadDocuments
);

/**
 * @route   GET /api/bookings/:id/documents
 * @desc    Get booking documents
 * @access  Private (Customer/Vendor)
 */
router.get(
  '/:id/documents',
  protect,
  bookingController.getDocuments
);

/**
 * @route   DELETE /api/bookings/:id/documents/:documentId
 * @desc    Delete booking document
 * @access  Private (Customer)
 */
router.delete(
  '/:id/documents/:documentId',
  protect,
  bookingController.deleteDocument
);

/**
 * @route   POST /api/bookings/:id/travelers
 * @desc    Add/Update travelers information
 * @access  Private (Customer)
 */
router.post(
  '/:id/travelers',
  protect,
  bookingController.updateTravelers
);

/**
 * @route   GET /api/bookings/:id/invoice
 * @desc    Get booking invoice
 * @access  Private (Customer/Vendor)
 */
router.get(
  '/:id/invoice',
  protect,
  bookingController.getInvoice
);

/**
 * @route   GET /api/bookings/:id/invoice/download
 * @desc    Download booking invoice PDF
 * @access  Private (Customer/Vendor)
 */
router.get(
  '/:id/invoice/download',
  protect,
  bookingController.downloadInvoice
);

/**
 * @route   POST /api/bookings/:id/review
 * @desc    Add review for booking
 * @access  Private (Customer)
 */
router.post(
  '/:id/review',
  protect,
  upload.array('images', 5),
  bookingController.addReview
);

/**
 * @route   GET /api/bookings/:id/timeline
 * @desc    Get booking timeline/history
 * @access  Private (Customer/Vendor)
 */
router.get(
  '/:id/timeline',
  protect,
  bookingController.getTimeline
);

/**
 * @route   POST /api/bookings/:id/special-request
 * @desc    Add special request to booking
 * @access  Private (Customer)
 */
router.post(
  '/:id/special-request',
  protect,
  bookingController.addSpecialRequest
);

/**
 * @route   GET /api/bookings/:id/refund-eligibility
 * @desc    Check refund eligibility
 * @access  Private (Customer)
 */
router.get(
  '/:id/refund-eligibility',
  protect,
  bookingController.checkRefundEligibility
);

/**
 * @route   POST /api/bookings/:id/request-refund
 * @desc    Request refund for cancelled booking
 * @access  Private (Customer)
 */
router.post(
  '/:id/request-refund',
  protect,
  bookingController.requestRefund
);

/**
 * @route   POST /api/bookings/:id/modify
 * @desc    Request booking modification
 * @access  Private (Customer)
 */
router.post(
  '/:id/modify',
  protect,
  bookingController.requestModification
);

/**
 * @route   GET /api/bookings/:id/payment-status
 * @desc    Get payment status
 * @access  Private (Customer/Vendor)
 */
router.get(
  '/:id/payment-status',
  protect,
  bookingController.getPaymentStatus
);

/**
 * @route   POST /api/bookings/:id/send-confirmation
 * @desc    Resend booking confirmation email
 * @access  Private (Customer)
 */
router.post(
  '/:id/send-confirmation',
  protect,
  bookingController.resendConfirmation
);

module.exports = router;
