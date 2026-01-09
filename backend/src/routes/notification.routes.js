const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const { idParamValidation, paginationValidation, validate } = require('../middleware/validation.middleware');
const db = require('../config/database');

// Notification controller
const notificationController = {
  // Get all notifications for user
  getNotifications: async (req, res) => {
    try {
      const userId = req.user.id;
      const { page = 1, limit = 20, unread_only = false } = req.query;
      const offset = (page - 1) * limit;
      
      let query = 'SELECT * FROM notifications WHERE user_id = ?';
      const params = [userId];
      
      if (unread_only === 'true') {
        query += ' AND is_read = false';
      }
      
      query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
      params.push(parseInt(limit), parseInt(offset));
      
      const [notifications] = await db.query(query, params);
      
      // Get unread count
      const [unreadCount] = await db.query(
        'SELECT COUNT(*) as count FROM notifications WHERE user_id = ? AND is_read = false',
        [userId]
      );
      
      // Get total count
      const [totalCount] = await db.query(
        'SELECT COUNT(*) as count FROM notifications WHERE user_id = ?',
        [userId]
      );
      
      res.json({
        success: true,
        data: notifications,
        unread_count: unreadCount[0].count,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: totalCount[0].count
        }
      });
      
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  
  // Get notification by ID
  getNotificationById: async (req, res) => {
    try {
      const userId = req.user.id;
      const { id } = req.params;
      
      const [notifications] = await db.query(
        'SELECT * FROM notifications WHERE id = ? AND user_id = ?',
        [id, userId]
      );
      
      if (notifications.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Notification not found'
        });
      }
      
      res.json({ success: true, data: notifications[0] });
      
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  
  // Mark notification as read
  markAsRead: async (req, res) => {
    try {
      const userId = req.user.id;
      const { id } = req.params;
      
      const [result] = await db.query(
        'UPDATE notifications SET is_read = true, read_at = NOW() WHERE id = ? AND user_id = ?',
        [id, userId]
      );
      
      if (result.affectedRows === 0) {
        return res.status(404).json({
          success: false,
          message: 'Notification not found'
        });
      }
      
      res.json({
        success: true,
        message: 'Notification marked as read'
      });
      
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  
  // Mark all notifications as read
  markAllAsRead: async (req, res) => {
    try {
      const userId = req.user.id;
      
      await db.query(
        'UPDATE notifications SET is_read = true, read_at = NOW() WHERE user_id = ? AND is_read = false',
        [userId]
      );
      
      res.json({
        success: true,
        message: 'All notifications marked as read'
      });
      
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  
  // Delete notification
  deleteNotification: async (req, res) => {
    try {
      const userId = req.user.id;
      const { id } = req.params;
      
      const [result] = await db.query(
        'DELETE FROM notifications WHERE id = ? AND user_id = ?',
        [id, userId]
      );
      
      if (result.affectedRows === 0) {
        return res.status(404).json({
          success: false,
          message: 'Notification not found'
        });
      }
      
      res.json({
        success: true,
        message: 'Notification deleted successfully'
      });
      
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  
  // Delete all read notifications
  deleteAllRead: async (req, res) => {
    try {
      const userId = req.user.id;
      
      await db.query(
        'DELETE FROM notifications WHERE user_id = ? AND is_read = true',
        [userId]
      );
      
      res.json({
        success: true,
        message: 'All read notifications deleted successfully'
      });
      
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  
  // Get unread count
  getUnreadCount: async (req, res) => {
    try {
      const userId = req.user.id;
      
      const [result] = await db.query(
        'SELECT COUNT(*) as count FROM notifications WHERE user_id = ? AND is_read = false',
        [userId]
      );
      
      res.json({
        success: true,
        data: { unread_count: result[0].count }
      });
      
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
};

/**
 * @route   GET /api/notifications
 * @desc    Get all notifications for user
 * @access  Private
 */
router.get('/', protect, paginationValidation, validate, notificationController.getNotifications);

/**
 * @route   GET /api/notifications/unread-count
 * @desc    Get unread notification count
 * @access  Private
 */
router.get('/unread-count', protect, notificationController.getUnreadCount);

/**
 * @route   GET /api/notifications/:id
 * @desc    Get notification by ID
 * @access  Private
 */
router.get('/:id', protect, idParamValidation, validate, notificationController.getNotificationById);

/**
 * @route   PUT /api/notifications/:id/read
 * @desc    Mark notification as read
 * @access  Private
 */
router.put('/:id/read', protect, idParamValidation, validate, notificationController.markAsRead);

/**
 * @route   PUT /api/notifications/mark-all-read
 * @desc    Mark all notifications as read
 * @access  Private
 */
router.put('/mark-all-read', protect, notificationController.markAllAsRead);

/**
 * @route   DELETE /api/notifications/:id
 * @desc    Delete notification
 * @access  Private
 */
router.delete('/:id', protect, idParamValidation, validate, notificationController.deleteNotification);

/**
 * @route   DELETE /api/notifications/delete-all-read
 * @desc    Delete all read notifications
 * @access  Private
 */
router.delete('/delete-all-read', protect, notificationController.deleteAllRead);

module.exports = router;
