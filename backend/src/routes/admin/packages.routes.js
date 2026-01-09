const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../../middleware/auth.middleware');
const { idParamValidation, paginationValidation, validate } = require('../../middleware/validation.middleware');
const { body, query } = require('express-validator');
const db = require('../../config/database');

// Admin Package Controller
const adminPackageController = {
  // Get all packages
  getAllPackages: async (req, res) => {
    try {
      const { page = 1, limit = 20, status, vendor_id, search } = req.query;
      const offset = (page - 1) * limit;
      
      let query = `
        SELECT p.*, v.company_name as vendor_name,
               (SELECT AVG(rating) FROM reviews WHERE package_id = p.id) as avg_rating,
               (SELECT COUNT(*) FROM bookings WHERE package_id = p.id) as booking_count
        FROM packages p
        JOIN vendors v ON p.vendor_id = v.id
        WHERE 1=1
      `;
      
      const params = [];
      
      if (status) {
        query += ' AND p.status = ?';
        params.push(status);
      }
      
      if (vendor_id) {
        query += ' AND p.vendor_id = ?';
        params.push(vendor_id);
      }
      
      if (search) {
        query += ' AND (p.title LIKE ? OR p.description LIKE ?)';
        params.push(`%${search}%`, `%${search}%`);
      }
      
      query += ' ORDER BY p.created_at DESC LIMIT ? OFFSET ?';
      params.push(parseInt(limit), parseInt(offset));
      
      const [packages] = await db.query(query, params);
      
      // Get total count
      let countQuery = 'SELECT COUNT(*) as total FROM packages p WHERE 1=1';
      const countParams = [];
      
      if (status) {
        countQuery += ' AND p.status = ?';
        countParams.push(status);
      }
      
      const [countResult] = await db.query(countQuery, countParams);
      
      res.json({
        success: true,
        data: packages,
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
  
  // Approve package
  approvePackage: async (req, res) => {
    try {
      const { id } = req.params;
      
      await db.query(
        'UPDATE packages SET status = "published", approved_at = NOW() WHERE id = ?',
        [id]
      );
      
      res.json({
        success: true,
        message: 'Package approved successfully'
      });
      
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  
  // Reject package
  rejectPackage: async (req, res) => {
    try {
      const { id } = req.params;
      const { reason } = req.body;
      
      await db.query(
        'UPDATE packages SET status = "rejected", rejection_reason = ? WHERE id = ?',
        [reason, id]
      );
      
      res.json({
        success: true,
        message: 'Package rejected'
      });
      
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  
  // Feature/Unfeature package
  toggleFeatured: async (req, res) => {
    try {
      const { id } = req.params;
      
      await db.query(
        'UPDATE packages SET is_featured = NOT is_featured WHERE id = ?',
        [id]
      );
      
      res.json({
        success: true,
        message: 'Package featured status updated'
      });
      
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  
  // Delete package
  deletePackage: async (req, res) => {
    try {
      const { id } = req.params;
      
      // Check for active bookings
      const [bookings] = await db.query(
        'SELECT COUNT(*) as count FROM bookings WHERE package_id = ? AND status IN ("pending", "confirmed")',
        [id]
      );
      
      if (bookings[0].count > 0) {
        return res.status(400).json({
          success: false,
          message: 'Cannot delete package with active bookings'
        });
      }
      
      // Soft delete
      await db.query(
        'UPDATE packages SET status = "deleted", deleted_at = NOW() WHERE id = ?',
        [id]
      );
      
      res.json({
        success: true,
        message: 'Package deleted successfully'
      });
      
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  
  // Get package statistics
  getPackageStats: async (req, res) => {
    try {
      const [stats] = await db.query(`
        SELECT 
          COUNT(*) as total_packages,
          SUM(CASE WHEN status = 'published' THEN 1 ELSE 0 END) as published_packages,
          SUM(CASE WHEN status = 'draft' THEN 1 ELSE 0 END) as draft_packages,
          SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending_packages,
          SUM(CASE WHEN is_featured = true THEN 1 ELSE 0 END) as featured_packages,
          AVG(price) as avg_price
        FROM packages
        WHERE status != 'deleted'
      `);
      
      res.json({
        success: true,
        data: stats[0]
      });
      
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
};

/**
 * @route   GET /api/admin/packages
 * @desc    Get all packages
 * @access  Private/Admin
 */
router.get('/', protect, authorize('admin'), [
  paginationValidation,
  query('status').optional().isIn(['draft', 'pending', 'published', 'rejected']),
  query('vendor_id').optional().isUUID(),
  validate
], adminPackageController.getAllPackages);

/**
 * @route   GET /api/admin/packages/stats
 * @desc    Get package statistics
 * @access  Private/Admin
 */
router.get('/stats', protect, authorize('admin'), adminPackageController.getPackageStats);

/**
 * @route   PUT /api/admin/packages/:id/approve
 * @desc    Approve package
 * @access  Private/Admin
 */
router.put('/:id/approve', protect, authorize('admin'), idParamValidation, validate, adminPackageController.approvePackage);

/**
 * @route   PUT /api/admin/packages/:id/reject
 * @desc    Reject package
 * @access  Private/Admin
 */
router.put('/:id/reject', protect, authorize('admin'), [
  idParamValidation,
  body('reason').notEmpty().withMessage('Rejection reason is required'),
  validate
], adminPackageController.rejectPackage);

/**
 * @route   PUT /api/admin/packages/:id/featured
 * @desc    Toggle featured status
 * @access  Private/Admin
 */
router.put('/:id/featured', protect, authorize('admin'), idParamValidation, validate, adminPackageController.toggleFeatured);

/**
 * @route   DELETE /api/admin/packages/:id
 * @desc    Delete package
 * @access  Private/Admin
 */
router.delete('/:id', protect, authorize('admin'), idParamValidation, validate, adminPackageController.deletePackage);

module.exports = router;
