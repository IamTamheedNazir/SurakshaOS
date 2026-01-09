const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../../middleware/auth.middleware');
const { idParamValidation, paginationValidation, validate } = require('../../middleware/validation.middleware');
const { body, query } = require('express-validator');
const db = require('../../config/database');

// Admin Booking Controller
const adminBookingController = {
  // Get all bookings
  getAllBookings: async (req, res) => {
    try {
      const { 
        page = 1, 
        limit = 20, 
        status, 
        payment_status,
        vendor_id,
        user_id,
        from_date,
        to_date,
        search 
      } = req.query;
      
      const offset = (page - 1) * limit;
      
      let query = `
        SELECT b.*, 
               p.title as package_title, p.price as package_price,
               u.first_name as customer_first_name, u.last_name as customer_last_name, u.email as customer_email,
               v.company_name as vendor_name
        FROM bookings b
        JOIN packages p ON b.package_id = p.id
        JOIN users u ON b.user_id = u.id
        JOIN vendors v ON p.vendor_id = v.id
        WHERE 1=1
      `;
      
      const params = [];
      
      if (status) {
        query += ' AND b.status = ?';
        params.push(status);
      }
      
      if (payment_status) {
        query += ' AND b.payment_status = ?';
        params.push(payment_status);
      }
      
      if (vendor_id) {
        query += ' AND p.vendor_id = ?';
        params.push(vendor_id);
      }
      
      if (user_id) {
        query += ' AND b.user_id = ?';
        params.push(user_id);
      }
      
      if (from_date) {
        query += ' AND b.created_at >= ?';
        params.push(from_date);
      }
      
      if (to_date) {
        query += ' AND b.created_at <= ?';
        params.push(to_date);
      }
      
      if (search) {
        query += ' AND (b.booking_number LIKE ? OR u.email LIKE ? OR p.title LIKE ?)';
        params.push(`%${search}%`, `%${search}%`, `%${search}%`);
      }
      
      query += ' ORDER BY b.created_at DESC LIMIT ? OFFSET ?';
      params.push(parseInt(limit), parseInt(offset));
      
      const [bookings] = await db.query(query, params);
      
      // Get total count
      let countQuery = `
        SELECT COUNT(*) as total 
        FROM bookings b
        JOIN packages p ON b.package_id = p.id
        JOIN users u ON b.user_id = u.id
        WHERE 1=1
      `;
      const countParams = [];
      
      if (status) {
        countQuery += ' AND b.status = ?';
        countParams.push(status);
      }
      
      if (payment_status) {
        countQuery += ' AND b.payment_status = ?';
        countParams.push(payment_status);
      }
      
      const [countResult] = await db.query(countQuery, countParams);
      
      res.json({
        success: true,
        data: bookings,
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
  
  // Get booking by ID
  getBookingById: async (req, res) => {
    try {
      const { id } = req.params;
      
      const [bookings] = await db.query(`
        SELECT b.*, 
               p.title as package_title, p.description as package_description, p.duration_days,
               u.first_name as customer_first_name, u.last_name as customer_last_name, 
               u.email as customer_email, u.phone as customer_phone,
               v.company_name as vendor_name, v.company_email as vendor_email, v.company_phone as vendor_phone
        FROM bookings b
        JOIN packages p ON b.package_id = p.id
        JOIN users u ON b.user_id = u.id
        JOIN vendors v ON p.vendor_id = v.id
        WHERE b.id = ?
      `, [id]);
      
      if (bookings.length === 0) {
        return res.status(404).json({ success: false, message: 'Booking not found' });
      }
      
      // Get travelers
      const [travelers] = await db.query(
        'SELECT * FROM booking_travelers WHERE booking_id = ?',
        [id]
      );
      
      // Get payments
      const [payments] = await db.query(
        'SELECT * FROM payments WHERE booking_id = ? ORDER BY created_at DESC',
        [id]
      );
      
      // Get documents
      const [documents] = await db.query(
        'SELECT * FROM booking_documents WHERE booking_id = ?',
        [id]
      );
      
      res.json({
        success: true,
        data: {
          ...bookings[0],
          travelers,
          payments,
          documents
        }
      });
      
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  
  // Update booking status
  updateBookingStatus: async (req, res) => {
    try {
      const { id } = req.params;
      const { status, notes } = req.body;
      
      await db.query(
        'UPDATE bookings SET status = ?, admin_notes = ?, updated_at = NOW() WHERE id = ?',
        [status, notes, id]
      );
      
      // Get booking details for notification
      const [bookings] = await db.query(`
        SELECT b.booking_number, u.email, u.first_name, p.title
        FROM bookings b
        JOIN users u ON b.user_id = u.id
        JOIN packages p ON b.package_id = p.id
        WHERE b.id = ?
      `, [id]);
      
      if (bookings.length > 0) {
        // Send notification email
        const { sendEmail } = require('../../utils/email');
        await sendEmail({
          to: bookings[0].email,
          subject: `Booking Status Update - ${bookings[0].booking_number}`,
          html: `
            <h1>Booking Status Updated</h1>
            <p>Hi ${bookings[0].first_name},</p>
            <p>Your booking for <strong>${bookings[0].title}</strong> has been updated.</p>
            <p><strong>New Status:</strong> ${status}</p>
            ${notes ? `<p><strong>Notes:</strong> ${notes}</p>` : ''}
            <p>Booking Number: ${bookings[0].booking_number}</p>
          `
        });
      }
      
      res.json({
        success: true,
        message: 'Booking status updated successfully'
      });
      
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  
  // Cancel booking
  cancelBooking: async (req, res) => {
    const connection = await db.getConnection();
    
    try {
      await connection.beginTransaction();
      
      const { id } = req.params;
      const { reason, refund_amount } = req.body;
      
      // Update booking
      await connection.query(
        'UPDATE bookings SET status = "cancelled", cancellation_reason = ?, refund_amount = ?, cancelled_at = NOW() WHERE id = ?',
        [reason, refund_amount || 0, id]
      );
      
      // If refund amount, create refund record
      if (refund_amount && refund_amount > 0) {
        const { v4: uuidv4 } = require('uuid');
        await connection.query(`
          INSERT INTO refunds (id, booking_id, amount, status, reason)
          VALUES (?, ?, ?, 'pending', ?)
        `, [uuidv4(), id, refund_amount, reason]);
      }
      
      await connection.commit();
      
      res.json({
        success: true,
        message: 'Booking cancelled successfully'
      });
      
    } catch (error) {
      await connection.rollback();
      res.status(500).json({ success: false, message: error.message });
    } finally {
      connection.release();
    }
  },
  
  // Get booking statistics
  getBookingStats: async (req, res) => {
    try {
      const [stats] = await db.query(`
        SELECT 
          COUNT(*) as total_bookings,
          SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending_bookings,
          SUM(CASE WHEN status = 'confirmed' THEN 1 ELSE 0 END) as confirmed_bookings,
          SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed_bookings,
          SUM(CASE WHEN status = 'cancelled' THEN 1 ELSE 0 END) as cancelled_bookings,
          SUM(CASE WHEN payment_status = 'paid' THEN total_amount ELSE 0 END) as total_revenue,
          SUM(CASE WHEN payment_status = 'pending' THEN total_amount ELSE 0 END) as pending_revenue
        FROM bookings
      `);
      
      res.json({
        success: true,
        data: stats[0]
      });
      
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  
  // Export bookings
  exportBookings: async (req, res) => {
    try {
      const { from_date, to_date, status } = req.query;
      
      let query = `
        SELECT b.booking_number, b.created_at, b.departure_date, b.status, b.payment_status,
               b.total_amount, b.adults, b.children, b.infants,
               p.title as package_title,
               u.first_name, u.last_name, u.email, u.phone,
               v.company_name as vendor_name
        FROM bookings b
        JOIN packages p ON b.package_id = p.id
        JOIN users u ON b.user_id = u.id
        JOIN vendors v ON p.vendor_id = v.id
        WHERE 1=1
      `;
      
      const params = [];
      
      if (from_date) {
        query += ' AND b.created_at >= ?';
        params.push(from_date);
      }
      
      if (to_date) {
        query += ' AND b.created_at <= ?';
        params.push(to_date);
      }
      
      if (status) {
        query += ' AND b.status = ?';
        params.push(status);
      }
      
      query += ' ORDER BY b.created_at DESC';
      
      const [bookings] = await db.query(query, params);
      
      // Convert to CSV
      const fields = [
        'booking_number', 'created_at', 'departure_date', 'status', 'payment_status',
        'total_amount', 'adults', 'children', 'infants', 'package_title',
        'first_name', 'last_name', 'email', 'phone', 'vendor_name'
      ];
      
      const csv = [
        fields.join(','),
        ...bookings.map(booking => 
          fields.map(field => `"${booking[field] || ''}"`).join(',')
        )
      ].join('\n');
      
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=bookings.csv');
      res.send(csv);
      
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
};

/**
 * @route   GET /api/admin/bookings
 * @desc    Get all bookings
 * @access  Private/Admin
 */
router.get('/', protect, authorize('admin'), [
  paginationValidation,
  query('status').optional().isIn(['pending', 'confirmed', 'completed', 'cancelled']),
  query('payment_status').optional().isIn(['pending', 'paid', 'failed', 'refunded']),
  query('vendor_id').optional().isUUID(),
  query('user_id').optional().isUUID(),
  query('from_date').optional().isISO8601(),
  query('to_date').optional().isISO8601(),
  validate
], adminBookingController.getAllBookings);

/**
 * @route   GET /api/admin/bookings/stats
 * @desc    Get booking statistics
 * @access  Private/Admin
 */
router.get('/stats', protect, authorize('admin'), adminBookingController.getBookingStats);

/**
 * @route   GET /api/admin/bookings/export
 * @desc    Export bookings to CSV
 * @access  Private/Admin
 */
router.get('/export', protect, authorize('admin'), adminBookingController.exportBookings);

/**
 * @route   GET /api/admin/bookings/:id
 * @desc    Get booking by ID
 * @access  Private/Admin
 */
router.get('/:id', protect, authorize('admin'), idParamValidation, validate, adminBookingController.getBookingById);

/**
 * @route   PUT /api/admin/bookings/:id/status
 * @desc    Update booking status
 * @access  Private/Admin
 */
router.put('/:id/status', protect, authorize('admin'), [
  idParamValidation,
  body('status').isIn(['pending', 'confirmed', 'completed', 'cancelled']).withMessage('Invalid status'),
  body('notes').optional().trim(),
  validate
], adminBookingController.updateBookingStatus);

/**
 * @route   PUT /api/admin/bookings/:id/cancel
 * @desc    Cancel booking
 * @access  Private/Admin
 */
router.put('/:id/cancel', protect, authorize('admin'), [
  idParamValidation,
  body('reason').notEmpty().withMessage('Cancellation reason is required'),
  body('refund_amount').optional().isFloat({ min: 0 }),
  validate
], adminBookingController.cancelBooking);

module.exports = router;
