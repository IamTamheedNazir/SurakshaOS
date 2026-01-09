const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const paymentController = require('../controllers/payment.controller');

/**
 * @route   POST /api/payments/create-order
 * @desc    Create payment order (Razorpay/Stripe/PayPal)
 * @access  Private
 */
router.post(
  '/create-order',
  protect,
  paymentController.createPaymentOrder
);

/**
 * @route   POST /api/payments/verify
 * @desc    Verify payment after completion
 * @access  Private
 */
router.post(
  '/verify',
  protect,
  paymentController.verifyPayment
);

/**
 * @route   POST /api/payments/razorpay/webhook
 * @desc    Razorpay webhook handler
 * @access  Public (Webhook)
 */
router.post(
  '/razorpay/webhook',
  paymentController.razorpayWebhook
);

/**
 * @route   POST /api/payments/stripe/webhook
 * @desc    Stripe webhook handler
 * @access  Public (Webhook)
 */
router.post(
  '/stripe/webhook',
  paymentController.stripeWebhook
);

/**
 * @route   POST /api/payments/paypal/webhook
 * @desc    PayPal webhook handler
 * @access  Public (Webhook)
 */
router.post(
  '/paypal/webhook',
  paymentController.paypalWebhook
);

/**
 * @route   GET /api/payments/:id
 * @desc    Get payment details
 * @access  Private
 */
router.get(
  '/:id',
  protect,
  paymentController.getPaymentById
);

/**
 * @route   GET /api/payments/booking/:bookingId
 * @desc    Get all payments for a booking
 * @access  Private
 */
router.get(
  '/booking/:bookingId',
  protect,
  paymentController.getBookingPayments
);

/**
 * @route   POST /api/payments/:id/refund
 * @desc    Process refund
 * @access  Private (Admin/Vendor)
 */
router.post(
  '/:id/refund',
  protect,
  paymentController.processRefund
);

/**
 * @route   GET /api/payments/:id/receipt
 * @desc    Get payment receipt
 * @access  Private
 */
router.get(
  '/:id/receipt',
  protect,
  paymentController.getReceipt
);

/**
 * @route   GET /api/payments/:id/receipt/download
 * @desc    Download payment receipt PDF
 * @access  Private
 */
router.get(
  '/:id/receipt/download',
  protect,
  paymentController.downloadReceipt
);

/**
 * @route   POST /api/payments/partial-payment
 * @desc    Create partial payment
 * @access  Private
 */
router.post(
  '/partial-payment',
  protect,
  paymentController.createPartialPayment
);

/**
 * @route   GET /api/payments/methods/available
 * @desc    Get available payment methods
 * @access  Public
 */
router.get(
  '/methods/available',
  paymentController.getAvailablePaymentMethods
);

/**
 * @route   POST /api/payments/bank-transfer/verify
 * @desc    Verify bank transfer payment
 * @access  Private
 */
router.post(
  '/bank-transfer/verify',
  protect,
  paymentController.verifyBankTransfer
);

/**
 * @route   POST /api/payments/upi/verify
 * @desc    Verify UPI payment
 * @access  Private
 */
router.post(
  '/upi/verify',
  protect,
  paymentController.verifyUPIPayment
);

/**
 * @route   GET /api/payments/user/history
 * @desc    Get user payment history
 * @access  Private
 */
router.get(
  '/user/history',
  protect,
  paymentController.getUserPaymentHistory
);

/**
 * @route   POST /api/payments/:id/send-receipt
 * @desc    Resend payment receipt email
 * @access  Private
 */
router.post(
  '/:id/send-receipt',
  protect,
  paymentController.resendReceipt
);

/**
 * @route   GET /api/payments/:id/status
 * @desc    Check payment status
 * @access  Private
 */
router.get(
  '/:id/status',
  protect,
  paymentController.checkPaymentStatus
);

module.exports = router;
