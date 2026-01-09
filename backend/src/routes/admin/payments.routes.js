const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../../middleware/auth.middleware');
const { idParamValidation, paginationValidation, validate } = require('../../middleware/validation.middleware');
const { body, query } = require('express-validator');
const db = require('../../config/database');

// Admin Payment Controller
const adminPaymentController = {
  // Get all payments
  getAllPayments: async (req, res) => {
    try {
      const { page = 1, limit = 20, status, payment_method, from_date, to_date } = req.query;
      const offset = (page - 1) * limit;
      
      let query = `
        SELECT p.*, b.booking_number, u.first_name, u.last_name, u.email,
               pkg.title as package_title, v.company_name as vendor_name
        FROM payments p
        JOIN bookings b ON p.booking_id = b.id
        JOIN users u ON b.user_id = u.id
        JOIN packages pkg ON b.package_id = pkg.id
        JOIN vendors v ON pkg.vendor_id = v.id
        WHERE 1=1
      `;
      
      const params = [];
      
      if (status) {
        query += ' AND p.status = ?';
        params.push(status);
      }
      
      if (payment_method) {
        query += ' AND p.payment_method = ?';
        params.push(payment_method);
      }
      
      if (from_date) {
        query += ' AND p.created_at >= ?';
        params.push(from_date);
      }
      
      if (to_date) {
        query += ' AND p.created_at <= ?';
        params.push(to_date);
      }
      
      query += ' ORDER BY p.created_at DESC LIMIT ? OFFSET ?';
      params.push(parseInt(limit), parseInt(offset));
      
      const [payments] = await db.query(query, params);
      
      // Get total count
      let countQuery = 'SELECT COUNT(*) as total FROM payments p WHERE 1=1';
      const countParams = [];
      
      if (status) {
        countQuery += ' AND p.status = ?';
        countParams.push(status);
      }
      
      const [countResult] = await db.query(countQuery, countParams);
      
      res.json({
        success: true,
        data: payments,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: countResult[0].total,
          pages: Math.ceil(countResult[0].total / limit)
        }
      });
      
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  
  // Get payment by ID
  getPaymentById: async (req, res) => {
    try {
      const { id } = req.params;
      
      const [payments] = await db.query(`
        SELECT p.*, b.booking_number, b.total_amount as booking_amount,
               u.first_name, u.last_name, u.email, u.phone,
               pkg.title as package_title,
               v.company_name as vendor_name
        FROM payments p
        JOIN bookings b ON p.booking_id = b.id
        JOIN users u ON b.user_id = u.id
        JOIN packages pkg ON b.package_id = pkg.id
        JOIN vendors v ON pkg.vendor_id = v.id
        WHERE p.id = ?
      `, [id]);
      
      if (payments.length === 0) {
        return res.status(404).json({ success: false, message: 'Payment not found' });
      }
      
      res.json({
        success: true,
        data: payments[0]
      });
      
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  
  // Process refund
  processRefund: async (req, res) => {
    const connection = await db.getConnection();
    
    try {
      await connection.beginTransaction();
      
      const { id } = req.params;
      const { refund_amount, reason } = req.body;
      
      // Get payment details
      const [payments] = await connection.query(
        'SELECT * FROM payments WHERE id = ?',
        [id]
      );
      
      if (payments.length === 0) {
        return res.status(404).json({ success: false, message: 'Payment not found' });
      }
      
      const payment = payments[0];
      
      if (payment.status !== 'completed') {
        return res.status(400).json({
          success: false,
          message: 'Can only refund completed payments'
        });
      }
      
      // Create refund record
      const { v4: uuidv4 } = require('uuid');
      const refundId = uuidv4();
      
      await connection.query(`
        INSERT INTO refunds (id, payment_id, booking_id, amount, reason, status)
        VALUES (?, ?, ?, ?, ?, 'processing')
      `, [refundId, id, payment.booking_id, refund_amount, reason]);
      
      // Update payment status
      await connection.query(
        'UPDATE payments SET status = "refunded", refund_amount = ? WHERE id = ?',
        [refund_amount, id]
      );
      
      // Update booking
      await connection.query(
        'UPDATE bookings SET payment_status = "refunded", refund_amount = ? WHERE id = ?',
        [refund_amount, payment.booking_id]
      );
      
      await connection.commit();
      
      res.json({
        success: true,
        message: 'Refund processed successfully',
        data: { refund_id: refundId }
      });
      
    } catch (error) {
      await connection.rollback();
      res.status(500).json({ success: false, message: error.message });
    } finally {
      connection.release();
    }
  },
  
  // Get payment statistics
  getPaymentStats: async (req, res) => {
    try {
      const [stats] = await db.query(`
        SELECT 
          COUNT(*) as total_payments,
          SUM(CASE WHEN status = 'completed' THEN amount ELSE 0 END) as total_revenue,
          SUM(CASE WHEN status = 'pending' THEN amount ELSE 0 END) as pending_amount,
          SUM(CASE WHEN status = 'failed' THEN amount ELSE 0 END) as failed_amount,
          SUM(CASE WHEN status = 'refunded' THEN refund_amount ELSE 0 END) as total_refunded,
          AVG(CASE WHEN status = 'completed' THEN amount ELSE NULL END) as avg_transaction
        FROM payments
      `);
      
      // Get payment method breakdown
      const [methodBreakdown] = await db.query(`
        SELECT payment_method, COUNT(*) as count, SUM(amount) as total
        FROM payments
        WHERE status = 'completed'
        GROUP BY payment_method
      `);
      
      res.json({
        success: true,
        data: {
          ...stats[0],
          payment_methods: methodBreakdown
        }
      });
      
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  
  // Export payments
  exportPayments: async (req, res) => {
    try {
      const { from_date, to_date, status } = req.query;
      
      let query = `
        SELECT p.id, p.created_at, p.amount, p.currency, p.status, p.payment_method,
               p.gateway_payment_id, b.booking_number,
               u.first_name, u.last_name, u.email,
               pkg.title as package_title, v.company_name as vendor_name
        FROM payments p
        JOIN bookings b ON p.booking_id = b.id
        JOIN users u ON b.user_id = u.id
        JOIN packages pkg ON b.package_id = pkg.id
        JOIN vendors v ON pkg.vendor_id = v.id
        WHERE 1=1
      `;
      
      const params = [];
      
      if (from_date) {
        query += ' AND p.created_at >= ?';
        params.push(from_date);
      }
      
      if (to_date) {
        query += ' AND p.created_at <= ?';
        params.push(to_date);
      }
      
      if (status) {
        query += ' AND p.status = ?';
        params.push(status);
      }
      
      query += ' ORDER BY p.created_at DESC';
      
      const [payments] = await db.query(query, params);
      
      // Convert to CSV
      const fields = [
        'id', 'created_at', 'amount', 'currency', 'status', 'payment_method',
        'gateway_payment_id', 'booking_number', 'first_name', 'last_name',
        'email', 'package_title', 'vendor_name'
      ];
      
      const csv = [
        fields.join(','),
        ...payments.map(payment => 
          fields.map(field => `"${payment[field] || ''}"`).join(',')
        )
      ].join('\n');
      
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=payments.csv');
      res.send(csv);
      
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
};

/**
 * @route   GET /api/admin/payments
 * @desc    Get all payments
 * @access  Private/Admin
 */
router.get('/', protect, authorize('admin'), [
  paginationValidation,
  query('status').optional().isIn(['pending', 'completed', 'failed', 'refunded']),
  query('payment_method').optional().isIn(['razorpay', 'stripe', 'paypal', 'bank_transfer', 'upi']),
  query('from_date').optional().isISO8601(),
  query('to_date').optional().isISO8601(),
  validate
], adminPaymentController.getAllPayments);

/**
 * @route   GET /api/admin/payments/stats
 * @desc    Get payment statistics
 * @access  Private/Admin
 */
router.get('/stats', protect, authorize('admin'), adminPaymentController.getPaymentStats);

/**
 * @route   GET /api/admin/payments/export
 * @desc    Export payments to CSV
 * @access  Private/Admin
 */
router.get('/export', protect, authorize('admin'), adminPaymentController.exportPayments);

/**
 * @route   GET /api/admin/payments/:id
 * @desc    Get payment by ID
 * @access  Private/Admin
 */
router.get('/:id', protect, authorize('admin'), idParamValidation, validate, adminPaymentController.getPaymentById);

/**
 * @route   POST /api/admin/payments/:id/refund
 * @desc    Process refund
 * @access  Private/Admin
 */
router.post('/:id/refund', protect, authorize('admin'), [
  idParamValidation,
  body('refund_amount').isFloat({ min: 0 }).withMessage('Refund amount must be positive'),
  body('reason').notEmpty().withMessage('Refund reason is required'),
  validate
], adminPaymentController.processRefund);

module.exports = router;
