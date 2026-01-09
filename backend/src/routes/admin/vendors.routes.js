const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../../middleware/auth.middleware');
const { idParamValidation, paginationValidation, validate } = require('../../middleware/validation.middleware');
const { body, query } = require('express-validator');
const db = require('../../config/database');

// Admin Vendor Controller
const adminVendorController = {
  // Get all vendors
  getAllVendors: async (req, res) => {
    try {
      const { page = 1, limit = 20, status, search } = req.query;
      const offset = (page - 1) * limit;
      
      let query = `
        SELECT v.*, u.email, u.first_name, u.last_name, u.phone,
               (SELECT COUNT(*) FROM packages WHERE vendor_id = v.id) as package_count,
               (SELECT COUNT(*) FROM bookings b JOIN packages p ON b.package_id = p.id WHERE p.vendor_id = v.id) as booking_count,
               (SELECT SUM(total_amount) FROM bookings b JOIN packages p ON b.package_id = p.id WHERE p.vendor_id = v.id AND b.payment_status = 'paid') as total_revenue
        FROM vendors v
        JOIN users u ON v.user_id = u.id
        WHERE 1=1
      `;
      
      const params = [];
      
      if (status) {
        query += ' AND v.status = ?';
        params.push(status);
      }
      
      if (search) {
        query += ' AND (v.company_name LIKE ? OR u.email LIKE ? OR u.phone LIKE ?)';
        params.push(`%${search}%`, `%${search}%`, `%${search}%`);
      }
      
      query += ' ORDER BY v.created_at DESC LIMIT ? OFFSET ?';
      params.push(parseInt(limit), parseInt(offset));
      
      const [vendors] = await db.query(query, params);
      
      // Get total count
      let countQuery = 'SELECT COUNT(*) as total FROM vendors v JOIN users u ON v.user_id = u.id WHERE 1=1';
      const countParams = [];
      
      if (status) {
        countQuery += ' AND v.status = ?';
        countParams.push(status);
      }
      
      if (search) {
        countQuery += ' AND (v.company_name LIKE ? OR u.email LIKE ? OR u.phone LIKE ?)';
        countParams.push(`%${search}%`, `%${search}%`, `%${search}%`);
      }
      
      const [countResult] = await db.query(countQuery, countParams);
      
      res.json({
        success: true,
        data: vendors,
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
  
  // Get vendor by ID
  getVendorById: async (req, res) => {
    try {
      const { id } = req.params;
      
      const [vendors] = await db.query(`
        SELECT v.*, u.email, u.first_name, u.last_name, u.phone, u.created_at as user_created_at
        FROM vendors v
        JOIN users u ON v.user_id = u.id
        WHERE v.id = ?
      `, [id]);
      
      if (vendors.length === 0) {
        return res.status(404).json({ success: false, message: 'Vendor not found' });
      }
      
      // Get vendor documents
      const [documents] = await db.query(
        'SELECT * FROM vendor_documents WHERE vendor_id = ?',
        [id]
      );
      
      // Get vendor stats
      const [stats] = await db.query(`
        SELECT 
          (SELECT COUNT(*) FROM packages WHERE vendor_id = ?) as package_count,
          (SELECT COUNT(*) FROM bookings b JOIN packages p ON b.package_id = p.id WHERE p.vendor_id = ?) as booking_count,
          (SELECT SUM(total_amount) FROM bookings b JOIN packages p ON b.package_id = p.id WHERE p.vendor_id = ? AND b.payment_status = 'paid') as total_revenue,
          (SELECT AVG(rating) FROM reviews r JOIN packages p ON r.package_id = p.id WHERE p.vendor_id = ?) as avg_rating
      `, [id, id, id, id]);
      
      res.json({
        success: true,
        data: {
          ...vendors[0],
          documents,
          stats: stats[0]
        }
      });
      
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  
  // Approve vendor
  approveVendor: async (req, res) => {
    try {
      const { id } = req.params;
      const { commission_rate } = req.body;
      
      await db.query(
        'UPDATE vendors SET status = "approved", commission_rate = ?, approved_at = NOW() WHERE id = ?',
        [commission_rate || 10, id]
      );
      
      // Get vendor email
      const [vendors] = await db.query(`
        SELECT u.email, u.first_name, v.company_name
        FROM vendors v
        JOIN users u ON v.user_id = u.id
        WHERE v.id = ?
      `, [id]);
      
      if (vendors.length > 0) {
        // Send approval email
        const { sendEmail } = require('../../utils/email');
        await sendEmail({
          to: vendors[0].email,
          subject: 'Vendor Application Approved - UmrahConnect',
          html: `
            <h1>Congratulations!</h1>
            <p>Hi ${vendors[0].first_name},</p>
            <p>Your vendor application for ${vendors[0].company_name} has been approved!</p>
            <p>You can now start creating and publishing packages.</p>
            <p>Commission Rate: ${commission_rate || 10}%</p>
          `
        });
      }
      
      res.json({
        success: true,
        message: 'Vendor approved successfully'
      });
      
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  
  // Reject vendor
  rejectVendor: async (req, res) => {
    try {
      const { id } = req.params;
      const { reason } = req.body;
      
      await db.query(
        'UPDATE vendors SET status = "rejected", rejection_reason = ? WHERE id = ?',
        [reason, id]
      );
      
      // Get vendor email
      const [vendors] = await db.query(`
        SELECT u.email, u.first_name, v.company_name
        FROM vendors v
        JOIN users u ON v.user_id = u.id
        WHERE v.id = ?
      `, [id]);
      
      if (vendors.length > 0) {
        // Send rejection email
        const { sendEmail } = require('../../utils/email');
        await sendEmail({
          to: vendors[0].email,
          subject: 'Vendor Application Status - UmrahConnect',
          html: `
            <h1>Application Update</h1>
            <p>Hi ${vendors[0].first_name},</p>
            <p>Thank you for your interest in becoming a vendor on UmrahConnect.</p>
            <p>Unfortunately, we cannot approve your application at this time.</p>
            ${reason ? `<p><strong>Reason:</strong> ${reason}</p>` : ''}
            <p>You can reapply after addressing the issues mentioned above.</p>
          `
        });
      }
      
      res.json({
        success: true,
        message: 'Vendor rejected'
      });
      
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  
  // Suspend vendor
  suspendVendor: async (req, res) => {
    try {
      const { id } = req.params;
      const { reason } = req.body;
      
      await db.query(
        'UPDATE vendors SET status = "suspended", suspension_reason = ? WHERE id = ?',
        [reason, id]
      );
      
      res.json({
        success: true,
        message: 'Vendor suspended successfully'
      });
      
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  
  // Activate vendor
  activateVendor: async (req, res) => {
    try {
      const { id } = req.params;
      
      await db.query(
        'UPDATE vendors SET status = "approved", suspension_reason = NULL WHERE id = ?',
        [id]
      );
      
      res.json({
        success: true,
        message: 'Vendor activated successfully'
      });
      
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  
  // Update commission rate
  updateCommissionRate: async (req, res) => {
    try {
      const { id } = req.params;
      const { commission_rate } = req.body;
      
      await db.query(
        'UPDATE vendors SET commission_rate = ? WHERE id = ?',
        [commission_rate, id]
      );
      
      res.json({
        success: true,
        message: 'Commission rate updated successfully'
      });
      
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  
  // Delete vendor
  deleteVendor: async (req, res) => {
    const connection = await db.getConnection();
    
    try {
      await connection.beginTransaction();
      
      const { id } = req.params;
      
      // Check if vendor has active bookings
      const [activeBookings] = await connection.query(`
        SELECT COUNT(*) as count
        FROM bookings b
        JOIN packages p ON b.package_id = p.id
        WHERE p.vendor_id = ? AND b.status IN ('pending', 'confirmed')
      `, [id]);
      
      if (activeBookings[0].count > 0) {
        return res.status(400).json({
          success: false,
          message: 'Cannot delete vendor with active bookings'
        });
      }
      
      // Soft delete vendor
      await connection.query(
        'UPDATE vendors SET status = "deleted", deleted_at = NOW() WHERE id = ?',
        [id]
      );
      
      // Soft delete user
      await connection.query(`
        UPDATE users SET status = "deleted", deleted_at = NOW()
        WHERE id = (SELECT user_id FROM vendors WHERE id = ?)
      `, [id]);
      
      await connection.commit();
      
      res.json({
        success: true,
        message: 'Vendor deleted successfully'
      });
      
    } catch (error) {
      await connection.rollback();
      res.status(500).json({ success: false, message: error.message });
    } finally {
      connection.release();
    }
  }
};

/**
 * @route   GET /api/admin/vendors
 * @desc    Get all vendors
 * @access  Private/Admin
 */
router.get('/', protect, authorize('admin'), [
  paginationValidation,
  query('status').optional().isIn(['pending', 'approved', 'rejected', 'suspended']),
  query('search').optional().trim(),
  validate
], adminVendorController.getAllVendors);

/**
 * @route   GET /api/admin/vendors/:id
 * @desc    Get vendor by ID
 * @access  Private/Admin
 */
router.get('/:id', protect, authorize('admin'), idParamValidation, validate, adminVendorController.getVendorById);

/**
 * @route   PUT /api/admin/vendors/:id/approve
 * @desc    Approve vendor
 * @access  Private/Admin
 */
router.put('/:id/approve', protect, authorize('admin'), [
  idParamValidation,
  body('commission_rate').optional().isFloat({ min: 0, max: 100 }),
  validate
], adminVendorController.approveVendor);

/**
 * @route   PUT /api/admin/vendors/:id/reject
 * @desc    Reject vendor
 * @access  Private/Admin
 */
router.put('/:id/reject', protect, authorize('admin'), [
  idParamValidation,
  body('reason').optional().trim(),
  validate
], adminVendorController.rejectVendor);

/**
 * @route   PUT /api/admin/vendors/:id/suspend
 * @desc    Suspend vendor
 * @access  Private/Admin
 */
router.put('/:id/suspend', protect, authorize('admin'), [
  idParamValidation,
  body('reason').notEmpty().withMessage('Suspension reason is required'),
  validate
], adminVendorController.suspendVendor);

/**
 * @route   PUT /api/admin/vendors/:id/activate
 * @desc    Activate vendor
 * @access  Private/Admin
 */
router.put('/:id/activate', protect, authorize('admin'), idParamValidation, validate, adminVendorController.activateVendor);

/**
 * @route   PUT /api/admin/vendors/:id/commission
 * @desc    Update commission rate
 * @access  Private/Admin
 */
router.put('/:id/commission', protect, authorize('admin'), [
  idParamValidation,
  body('commission_rate').isFloat({ min: 0, max: 100 }).withMessage('Commission rate must be between 0 and 100'),
  validate
], adminVendorController.updateCommissionRate);

/**
 * @route   DELETE /api/admin/vendors/:id
 * @desc    Delete vendor
 * @access  Private/Admin
 */
router.delete('/:id', protect, authorize('admin'), idParamValidation, validate, adminVendorController.deleteVendor);

module.exports = router;
