const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth.middleware');
const { idParamValidation, paginationValidation, validate } = require('../middleware/validation.middleware');
const { body } = require('express-validator');

// User controller (to be created)
const userController = {
  // Get user profile
  getProfile: async (req, res) => {
    try {
      const userId = req.user.id;
      const [users] = await require('../config/database').query(
        'SELECT id, email, first_name, last_name, phone, role, status, email_verified, created_at FROM users WHERE id = ?',
        [userId]
      );
      
      if (users.length === 0) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }
      
      res.json({ success: true, data: users[0] });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  
  // Update user profile
  updateProfile: async (req, res) => {
    try {
      const userId = req.user.id;
      const { first_name, last_name, phone } = req.body;
      
      await require('../config/database').query(
        'UPDATE users SET first_name = ?, last_name = ?, phone = ? WHERE id = ?',
        [first_name, last_name, phone, userId]
      );
      
      res.json({ success: true, message: 'Profile updated successfully' });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  
  // Get user bookings
  getBookings: async (req, res) => {
    try {
      const userId = req.user.id;
      const { page = 1, limit = 10 } = req.query;
      const offset = (page - 1) * limit;
      
      const [bookings] = await require('../config/database').query(
        `SELECT b.*, p.title as package_title, p.duration_days, v.company_name as vendor_name
         FROM bookings b
         JOIN packages p ON b.package_id = p.id
         JOIN vendors v ON p.vendor_id = v.id
         WHERE b.user_id = ?
         ORDER BY b.created_at DESC
         LIMIT ? OFFSET ?`,
        [userId, parseInt(limit), parseInt(offset)]
      );
      
      const [countResult] = await require('../config/database').query(
        'SELECT COUNT(*) as total FROM bookings WHERE user_id = ?',
        [userId]
      );
      
      res.json({
        success: true,
        data: bookings,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: countResult[0].total
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  
  // Get user notifications
  getNotifications: async (req, res) => {
    try {
      const userId = req.user.id;
      const { page = 1, limit = 20 } = req.query;
      const offset = (page - 1) * limit;
      
      const [notifications] = await require('../config/database').query(
        `SELECT * FROM notifications 
         WHERE user_id = ?
         ORDER BY created_at DESC
         LIMIT ? OFFSET ?`,
        [userId, parseInt(limit), parseInt(offset)]
      );
      
      res.json({ success: true, data: notifications });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  
  // Mark notification as read
  markNotificationRead: async (req, res) => {
    try {
      const userId = req.user.id;
      const { id } = req.params;
      
      await require('../config/database').query(
        'UPDATE notifications SET is_read = true WHERE id = ? AND user_id = ?',
        [id, userId]
      );
      
      res.json({ success: true, message: 'Notification marked as read' });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  
  // Delete account
  deleteAccount: async (req, res) => {
    try {
      const userId = req.user.id;
      
      // Soft delete
      await require('../config/database').query(
        'UPDATE users SET status = "deleted", deleted_at = NOW() WHERE id = ?',
        [userId]
      );
      
      res.json({ success: true, message: 'Account deleted successfully' });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
};

/**
 * @route   GET /api/users/profile
 * @desc    Get user profile
 * @access  Private
 */
router.get('/profile', protect, userController.getProfile);

/**
 * @route   PUT /api/users/profile
 * @desc    Update user profile
 * @access  Private
 */
router.put('/profile', protect, [
  body('first_name').optional().trim().isLength({ min: 2, max: 50 }),
  body('last_name').optional().trim().isLength({ min: 2, max: 50 }),
  body('phone').optional().isMobilePhone(),
  validate
], userController.updateProfile);

/**
 * @route   GET /api/users/bookings
 * @desc    Get user bookings
 * @access  Private
 */
router.get('/bookings', protect, paginationValidation, validate, userController.getBookings);

/**
 * @route   GET /api/users/notifications
 * @desc    Get user notifications
 * @access  Private
 */
router.get('/notifications', protect, paginationValidation, validate, userController.getNotifications);

/**
 * @route   PUT /api/users/notifications/:id/read
 * @desc    Mark notification as read
 * @access  Private
 */
router.put('/notifications/:id/read', protect, idParamValidation, validate, userController.markNotificationRead);

/**
 * @route   DELETE /api/users/account
 * @desc    Delete user account
 * @access  Private
 */
router.delete('/account', protect, userController.deleteAccount);

module.exports = router;
