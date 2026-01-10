const db = require('../config/database');
const bcrypt = require('bcryptjs');

/**
 * User Controller
 * Handles user profile and account management
 */

// Get user profile
exports.getUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const query = `
      SELECT 
        u.id,
        u.email,
        u.first_name,
        u.last_name,
        u.phone,
        u.role,
        u.status,
        u.email_verified,
        u.created_at,
        u.last_login,
        CASE 
          WHEN u.role = 'vendor' THEN (
            SELECT json_build_object(
              'id', v.id,
              'company_name', v.company_name,
              'company_email', v.company_email,
              'company_phone', v.company_phone,
              'business_type', v.business_type,
              'rating', v.rating,
              'total_bookings', v.total_bookings,
              'verification_status', v.verification_status
            )
            FROM vendors v WHERE v.user_id = u.id
          )
          ELSE NULL
        END as vendor_info,
        (SELECT COUNT(*) FROM bookings WHERE user_id = u.id) as total_bookings,
        (SELECT COUNT(*) FROM reviews WHERE user_id = u.id) as total_reviews
      FROM users u
      WHERE u.id = $1
    `;

    const result = await db.query(query, [userId]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch profile',
      error: error.message
    });
  }
};

// Update user profile
exports.updateUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { first_name, last_name, phone } = req.body;

    const updateQuery = `
      UPDATE users SET
        first_name = COALESCE($1, first_name),
        last_name = COALESCE($2, last_name),
        phone = COALESCE($3, phone),
        updated_at = NOW()
      WHERE id = $4
      RETURNING id, email, first_name, last_name, phone, role, status
    `;

    const result = await db.query(updateQuery, [
      first_name,
      last_name,
      phone,
      userId
    ]);

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update profile',
      error: error.message
    });
  }
};

// Change password
exports.changePassword = async (req, res) => {
  try {
    const userId = req.user.id;
    const { current_password, new_password } = req.body;

    if (!current_password || !new_password) {
      return res.status(400).json({
        success: false,
        message: 'Current password and new password are required'
      });
    }

    if (new_password.length < 8) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 8 characters long'
      });
    }

    // Get current password
    const userQuery = 'SELECT password FROM users WHERE id = $1';
    const userResult = await db.query(userQuery, [userId]);

    if (userResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Verify current password
    const isValidPassword = await bcrypt.compare(
      current_password,
      userResult.rows[0].password
    );

    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(new_password, 10);

    // Update password
    await db.query(
      'UPDATE users SET password = $1, updated_at = NOW() WHERE id = $2',
      [hashedPassword, userId]
    );

    res.json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to change password',
      error: error.message
    });
  }
};

// Get user bookings
exports.getUserBookings = async (req, res) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 10, status } = req.query;
    const offset = (page - 1) * limit;

    let whereClause = 'b.user_id = $1';
    const queryParams = [userId];
    let paramIndex = 2;

    if (status) {
      whereClause += ` AND b.status = $${paramIndex++}`;
      queryParams.push(status);
    }

    // Get total count
    const countQuery = `SELECT COUNT(*) FROM bookings b WHERE ${whereClause}`;
    const countResult = await db.query(countQuery, queryParams);
    const totalBookings = parseInt(countResult.rows[0].count);

    // Get bookings
    const bookingsQuery = `
      SELECT 
        b.*,
        p.title as package_title,
        p.destination,
        p.duration,
        p.departure_date,
        p.return_date,
        v.company_name as vendor_name,
        (SELECT json_agg(json_build_object(
          'first_name', first_name,
          'last_name', last_name,
          'passport_number', passport_number
        )) FROM booking_travelers WHERE booking_id = b.id) as travelers,
        (SELECT SUM(amount) FROM payments WHERE booking_id = b.id AND status = 'completed') as paid_amount
      FROM bookings b
      LEFT JOIN packages p ON b.package_id = p.id
      LEFT JOIN vendors v ON p.vendor_id = v.id
      WHERE ${whereClause}
      ORDER BY b.created_at DESC
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `;

    queryParams.push(limit, offset);
    const bookingsResult = await db.query(bookingsQuery, queryParams);

    res.json({
      success: true,
      data: {
        bookings: bookingsResult.rows,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(totalBookings / limit),
          totalBookings,
          limit: parseInt(limit)
        }
      }
    });
  } catch (error) {
    console.error('Get bookings error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch bookings',
      error: error.message
    });
  }
};

// Get user reviews
exports.getUserReviews = async (req, res) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    // Get total count
    const countQuery = 'SELECT COUNT(*) FROM reviews WHERE user_id = $1';
    const countResult = await db.query(countQuery, [userId]);
    const totalReviews = parseInt(countResult.rows[0].count);

    // Get reviews
    const reviewsQuery = `
      SELECT 
        r.*,
        p.title as package_title,
        p.destination,
        v.company_name as vendor_name
      FROM reviews r
      LEFT JOIN packages p ON r.package_id = p.id
      LEFT JOIN vendors v ON p.vendor_id = v.id
      WHERE r.user_id = $1
      ORDER BY r.created_at DESC
      LIMIT $2 OFFSET $3
    `;

    const reviewsResult = await db.query(reviewsQuery, [userId, limit, offset]);

    res.json({
      success: true,
      data: {
        reviews: reviewsResult.rows,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(totalReviews / limit),
          totalReviews,
          limit: parseInt(limit)
        }
      }
    });
  } catch (error) {
    console.error('Get reviews error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch reviews',
      error: error.message
    });
  }
};

// Get user notifications
exports.getUserNotifications = async (req, res) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 20, unread_only = false } = req.query;
    const offset = (page - 1) * limit;

    let whereClause = 'user_id = $1';
    const queryParams = [userId];
    let paramIndex = 2;

    if (unread_only === 'true') {
      whereClause += ` AND is_read = false`;
    }

    // Get total count
    const countQuery = `SELECT COUNT(*) FROM notifications WHERE ${whereClause}`;
    const countResult = await db.query(countQuery, queryParams);
    const totalNotifications = parseInt(countResult.rows[0].count);

    // Get notifications
    const notificationsQuery = `
      SELECT *
      FROM notifications
      WHERE ${whereClause}
      ORDER BY created_at DESC
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `;

    queryParams.push(limit, offset);
    const notificationsResult = await db.query(notificationsQuery, queryParams);

    res.json({
      success: true,
      data: {
        notifications: notificationsResult.rows,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(totalNotifications / limit),
          totalNotifications,
          limit: parseInt(limit)
        }
      }
    });
  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch notifications',
      error: error.message
    });
  }
};

// Mark notification as read
exports.markNotificationAsRead = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    await db.query(
      'UPDATE notifications SET is_read = true WHERE id = $1 AND user_id = $2',
      [id, userId]
    );

    res.json({
      success: true,
      message: 'Notification marked as read'
    });
  } catch (error) {
    console.error('Mark notification error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to mark notification',
      error: error.message
    });
  }
};

// Mark all notifications as read
exports.markAllNotificationsAsRead = async (req, res) => {
  try {
    const userId = req.user.id;

    await db.query(
      'UPDATE notifications SET is_read = true WHERE user_id = $1 AND is_read = false',
      [userId]
    );

    res.json({
      success: true,
      message: 'All notifications marked as read'
    });
  } catch (error) {
    console.error('Mark all notifications error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to mark notifications',
      error: error.message
    });
  }
};

// Delete account (soft delete)
exports.deleteAccount = async (req, res) => {
  try {
    const userId = req.user.id;
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({
        success: false,
        message: 'Password is required to delete account'
      });
    }

    // Verify password
    const userQuery = 'SELECT password FROM users WHERE id = $1';
    const userResult = await db.query(userQuery, [userId]);

    if (userResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const isValidPassword = await bcrypt.compare(
      password,
      userResult.rows[0].password
    );

    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: 'Incorrect password'
      });
    }

    // Soft delete
    await db.query(
      "UPDATE users SET status = 'deleted', deleted_at = NOW() WHERE id = $1",
      [userId]
    );

    res.json({
      success: true,
      message: 'Account deleted successfully'
    });
  } catch (error) {
    console.error('Delete account error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete account',
      error: error.message
    });
  }
};

// Get user dashboard stats
exports.getDashboardStats = async (req, res) => {
  try {
    const userId = req.user.id;

    const statsQuery = `
      SELECT 
        (SELECT COUNT(*) FROM bookings WHERE user_id = $1) as total_bookings,
        (SELECT COUNT(*) FROM bookings WHERE user_id = $1 AND status = 'confirmed') as confirmed_bookings,
        (SELECT COUNT(*) FROM bookings WHERE user_id = $1 AND status = 'pending') as pending_bookings,
        (SELECT COUNT(*) FROM bookings WHERE user_id = $1 AND status = 'completed') as completed_bookings,
        (SELECT COUNT(*) FROM reviews WHERE user_id = $1) as total_reviews,
        (SELECT SUM(total_amount) FROM bookings WHERE user_id = $1 AND status != 'cancelled') as total_spent,
        (SELECT COUNT(*) FROM notifications WHERE user_id = $1 AND is_read = false) as unread_notifications
    `;

    const result = await db.query(statsQuery, [userId]);

    res.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard stats',
      error: error.message
    });
  }
};

module.exports = exports;
