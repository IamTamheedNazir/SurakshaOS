const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../../middleware/auth.middleware');
const { idParamValidation, paginationValidation, validate } = require('../../middleware/validation.middleware');
const { body, query } = require('express-validator');
const db = require('../../config/database');

// Admin User Controller
const adminUserController = {
  // Get all users
  getAllUsers: async (req, res) => {
    try {
      const { page = 1, limit = 20, role, status, search } = req.query;
      const offset = (page - 1) * limit;
      
      let query = 'SELECT id, email, first_name, last_name, phone, role, status, email_verified, created_at, last_login FROM users WHERE 1=1';
      const params = [];
      
      if (role) {
        query += ' AND role = ?';
        params.push(role);
      }
      
      if (status) {
        query += ' AND status = ?';
        params.push(status);
      }
      
      if (search) {
        query += ' AND (email LIKE ? OR first_name LIKE ? OR last_name LIKE ? OR phone LIKE ?)';
        params.push(`%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`);
      }
      
      query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
      params.push(parseInt(limit), parseInt(offset));
      
      const [users] = await db.query(query, params);
      
      // Get total count
      let countQuery = 'SELECT COUNT(*) as total FROM users WHERE 1=1';
      const countParams = [];
      
      if (role) {
        countQuery += ' AND role = ?';
        countParams.push(role);
      }
      
      if (status) {
        countQuery += ' AND status = ?';
        countParams.push(status);
      }
      
      const [countResult] = await db.query(countQuery, countParams);
      
      res.json({
        success: true,
        data: users,
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
  
  // Get user by ID
  getUserById: async (req, res) => {
    try {
      const { id } = req.params;
      
      const [users] = await db.query(
        'SELECT id, email, first_name, last_name, phone, role, status, email_verified, created_at, last_login FROM users WHERE id = ?',
        [id]
      );
      
      if (users.length === 0) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }
      
      // Get user stats
      const [stats] = await db.query(`
        SELECT 
          (SELECT COUNT(*) FROM bookings WHERE user_id = ?) as total_bookings,
          (SELECT SUM(total_amount) FROM bookings WHERE user_id = ? AND payment_status = 'paid') as total_spent,
          (SELECT COUNT(*) FROM reviews WHERE user_id = ?) as total_reviews
      `, [id, id, id]);
      
      res.json({
        success: true,
        data: {
          ...users[0],
          stats: stats[0]
        }
      });
      
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  
  // Update user
  updateUser: async (req, res) => {
    try {
      const { id } = req.params;
      const { first_name, last_name, phone, role, status } = req.body;
      
      const updates = [];
      const params = [];
      
      if (first_name) {
        updates.push('first_name = ?');
        params.push(first_name);
      }
      
      if (last_name) {
        updates.push('last_name = ?');
        params.push(last_name);
      }
      
      if (phone) {
        updates.push('phone = ?');
        params.push(phone);
      }
      
      if (role) {
        updates.push('role = ?');
        params.push(role);
      }
      
      if (status) {
        updates.push('status = ?');
        params.push(status);
      }
      
      if (updates.length === 0) {
        return res.status(400).json({ success: false, message: 'No fields to update' });
      }
      
      params.push(id);
      
      await db.query(
        `UPDATE users SET ${updates.join(', ')}, updated_at = NOW() WHERE id = ?`,
        params
      );
      
      res.json({
        success: true,
        message: 'User updated successfully'
      });
      
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  
  // Delete user
  deleteUser: async (req, res) => {
    try {
      const { id } = req.params;
      
      // Soft delete
      await db.query(
        'UPDATE users SET status = "deleted", deleted_at = NOW() WHERE id = ?',
        [id]
      );
      
      res.json({
        success: true,
        message: 'User deleted successfully'
      });
      
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  
  // Get user statistics
  getUserStats: async (req, res) => {
    try {
      const [stats] = await db.query(`
        SELECT 
          COUNT(*) as total_users,
          SUM(CASE WHEN role = 'customer' THEN 1 ELSE 0 END) as total_customers,
          SUM(CASE WHEN role = 'vendor' THEN 1 ELSE 0 END) as total_vendors,
          SUM(CASE WHEN role = 'admin' THEN 1 ELSE 0 END) as total_admins,
          SUM(CASE WHEN status = 'active' THEN 1 ELSE 0 END) as active_users,
          SUM(CASE WHEN email_verified = true THEN 1 ELSE 0 END) as verified_users
        FROM users
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
 * @route   GET /api/admin/users
 * @desc    Get all users
 * @access  Private/Admin
 */
router.get('/', protect, authorize('admin'), [
  paginationValidation,
  query('role').optional().isIn(['customer', 'vendor', 'admin']),
  query('status').optional().isIn(['active', 'inactive', 'suspended', 'deleted']),
  validate
], adminUserController.getAllUsers);

/**
 * @route   GET /api/admin/users/stats
 * @desc    Get user statistics
 * @access  Private/Admin
 */
router.get('/stats', protect, authorize('admin'), adminUserController.getUserStats);

/**
 * @route   GET /api/admin/users/:id
 * @desc    Get user by ID
 * @access  Private/Admin
 */
router.get('/:id', protect, authorize('admin'), idParamValidation, validate, adminUserController.getUserById);

/**
 * @route   PUT /api/admin/users/:id
 * @desc    Update user
 * @access  Private/Admin
 */
router.put('/:id', protect, authorize('admin'), [
  idParamValidation,
  body('first_name').optional().trim().isLength({ min: 2, max: 50 }),
  body('last_name').optional().trim().isLength({ min: 2, max: 50 }),
  body('phone').optional().isMobilePhone(),
  body('role').optional().isIn(['customer', 'vendor', 'admin']),
  body('status').optional().isIn(['active', 'inactive', 'suspended']),
  validate
], adminUserController.updateUser);

/**
 * @route   DELETE /api/admin/users/:id
 * @desc    Delete user
 * @access  Private/Admin
 */
router.delete('/:id', protect, authorize('admin'), idParamValidation, validate, adminUserController.deleteUser);

module.exports = router;
