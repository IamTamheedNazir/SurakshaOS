const db = require('../config/database');

/**
 * Admin Controller
 * Handles all admin operations
 */

// Get dashboard statistics
exports.getDashboardStats = async (req, res) => {
  try {
    const statsQuery = `
      SELECT 
        (SELECT COUNT(*) FROM users WHERE status != 'deleted') as total_users,
        (SELECT COUNT(*) FROM users WHERE role = 'customer' AND status != 'deleted') as total_customers,
        (SELECT COUNT(*) FROM vendors WHERE status != 'deleted') as total_vendors,
        (SELECT COUNT(*) FROM vendors WHERE verification_status = 'pending') as pending_vendors,
        (SELECT COUNT(*) FROM packages WHERE status = 'active') as active_packages,
        (SELECT COUNT(*) FROM bookings) as total_bookings,
        (SELECT COUNT(*) FROM bookings WHERE status = 'pending') as pending_bookings,
        (SELECT COUNT(*) FROM bookings WHERE status = 'confirmed') as confirmed_bookings,
        (SELECT SUM(total_amount) FROM bookings WHERE status != 'cancelled') as total_revenue,
        (SELECT SUM(amount) FROM payments WHERE status = 'completed') as total_payments,
        (SELECT COUNT(*) FROM reviews WHERE status = 'pending') as pending_reviews,
        (SELECT COUNT(*) FROM reviews WHERE status = 'reported') as reported_reviews
    `;

    const result = await db.query(statsQuery);

    // Get recent activity
    const recentBookingsQuery = `
      SELECT 
        b.id,
        b.booking_number,
        b.total_amount,
        b.status,
        b.created_at,
        u.first_name || ' ' || u.last_name as customer_name,
        p.title as package_title
      FROM bookings b
      LEFT JOIN users u ON b.user_id = u.id
      LEFT JOIN packages p ON b.package_id = p.id
      ORDER BY b.created_at DESC
      LIMIT 10
    `;

    const recentBookings = await db.query(recentBookingsQuery);

    // Get revenue by month (last 12 months)
    const revenueQuery = `
      SELECT 
        TO_CHAR(created_at, 'YYYY-MM') as month,
        SUM(total_amount) as revenue,
        COUNT(*) as bookings
      FROM bookings
      WHERE created_at >= NOW() - INTERVAL '12 months'
        AND status != 'cancelled'
      GROUP BY TO_CHAR(created_at, 'YYYY-MM')
      ORDER BY month DESC
    `;

    const revenueData = await db.query(revenueQuery);

    res.json({
      success: true,
      data: {
        stats: result.rows[0],
        recentBookings: recentBookings.rows,
        revenueByMonth: revenueData.rows
      }
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

// Get all users with filters
exports.getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 20, role, status, search } = req.query;
    const offset = (page - 1) * limit;

    let whereConditions = ["status != 'deleted'"];
    const queryParams = [];
    let paramIndex = 1;

    if (role) {
      whereConditions.push(`role = $${paramIndex++}`);
      queryParams.push(role);
    }

    if (status) {
      whereConditions.push(`status = $${paramIndex++}`);
      queryParams.push(status);
    }

    if (search) {
      whereConditions.push(`(first_name ILIKE $${paramIndex} OR last_name ILIKE $${paramIndex} OR email ILIKE $${paramIndex})`);
      queryParams.push(`%${search}%`);
      paramIndex++;
    }

    const whereClause = whereConditions.join(' AND ');

    // Get total count
    const countQuery = `SELECT COUNT(*) FROM users WHERE ${whereClause}`;
    const countResult = await db.query(countQuery, queryParams);
    const totalUsers = parseInt(countResult.rows[0].count);

    // Get users
    const usersQuery = `
      SELECT 
        u.*,
        (SELECT COUNT(*) FROM bookings WHERE user_id = u.id) as total_bookings,
        (SELECT SUM(total_amount) FROM bookings WHERE user_id = u.id AND status != 'cancelled') as total_spent
      FROM users u
      WHERE ${whereClause}
      ORDER BY created_at DESC
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `;

    queryParams.push(limit, offset);
    const usersResult = await db.query(usersQuery, queryParams);

    res.json({
      success: true,
      data: {
        users: usersResult.rows,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(totalUsers / limit),
          totalUsers,
          limit: parseInt(limit)
        }
      }
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch users',
      error: error.message
    });
  }
};

// Update user status
exports.updateUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['active', 'inactive', 'suspended'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      });
    }

    await db.query(
      'UPDATE users SET status = $1, updated_at = NOW() WHERE id = $2',
      [status, id]
    );

    res.json({
      success: true,
      message: 'User status updated successfully'
    });
  } catch (error) {
    console.error('Update user status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update user status',
      error: error.message
    });
  }
};

// Get all vendors with filters
exports.getAllVendors = async (req, res) => {
  try {
    const { page = 1, limit = 20, verification_status, search } = req.query;
    const offset = (page - 1) * limit;

    let whereConditions = ["status != 'deleted'"];
    const queryParams = [];
    let paramIndex = 1;

    if (verification_status) {
      whereConditions.push(`verification_status = $${paramIndex++}`);
      queryParams.push(verification_status);
    }

    if (search) {
      whereConditions.push(`(company_name ILIKE $${paramIndex} OR company_email ILIKE $${paramIndex})`);
      queryParams.push(`%${search}%`);
      paramIndex++;
    }

    const whereClause = whereConditions.join(' AND ');

    // Get total count
    const countQuery = `SELECT COUNT(*) FROM vendors WHERE ${whereClause}`;
    const countResult = await db.query(countQuery, queryParams);
    const totalVendors = parseInt(countResult.rows[0].count);

    // Get vendors
    const vendorsQuery = `
      SELECT 
        v.*,
        u.email as user_email,
        u.first_name,
        u.last_name,
        (SELECT COUNT(*) FROM packages WHERE vendor_id = v.id) as total_packages,
        (SELECT COUNT(*) FROM bookings b LEFT JOIN packages p ON b.package_id = p.id WHERE p.vendor_id = v.id) as total_bookings
      FROM vendors v
      LEFT JOIN users u ON v.user_id = u.id
      WHERE ${whereClause}
      ORDER BY v.created_at DESC
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `;

    queryParams.push(limit, offset);
    const vendorsResult = await db.query(vendorsQuery, queryParams);

    res.json({
      success: true,
      data: {
        vendors: vendorsResult.rows,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(totalVendors / limit),
          totalVendors,
          limit: parseInt(limit)
        }
      }
    });
  } catch (error) {
    console.error('Get vendors error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch vendors',
      error: error.message
    });
  }
};

// Approve/Reject vendor
exports.updateVendorVerification = async (req, res) => {
  try {
    const { id } = req.params;
    const { verification_status, rejection_reason } = req.body;

    if (!['approved', 'rejected'].includes(verification_status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid verification status'
      });
    }

    const updateQuery = `
      UPDATE vendors SET
        verification_status = $1,
        rejection_reason = $2,
        verified_at = CASE WHEN $1 = 'approved' THEN NOW() ELSE NULL END,
        updated_at = NOW()
      WHERE id = $3
      RETURNING *
    `;

    const result = await db.query(updateQuery, [
      verification_status,
      rejection_reason,
      id
    ]);

    res.json({
      success: true,
      message: `Vendor ${verification_status} successfully`,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Update vendor verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update vendor verification',
      error: error.message
    });
  }
};

// Get all packages with filters
exports.getAllPackages = async (req, res) => {
  try {
    const { page = 1, limit = 20, status, type, search } = req.query;
    const offset = (page - 1) * limit;

    let whereConditions = ["p.status != 'deleted'"];
    const queryParams = [];
    let paramIndex = 1;

    if (status) {
      whereConditions.push(`p.status = $${paramIndex++}`);
      queryParams.push(status);
    }

    if (type) {
      whereConditions.push(`p.type = $${paramIndex++}`);
      queryParams.push(type);
    }

    if (search) {
      whereConditions.push(`(p.title ILIKE $${paramIndex} OR p.destination ILIKE $${paramIndex})`);
      queryParams.push(`%${search}%`);
      paramIndex++;
    }

    const whereClause = whereConditions.join(' AND ');

    // Get total count
    const countQuery = `SELECT COUNT(*) FROM packages p WHERE ${whereClause}`;
    const countResult = await db.query(countQuery, queryParams);
    const totalPackages = parseInt(countResult.rows[0].count);

    // Get packages
    const packagesQuery = `
      SELECT 
        p.*,
        v.company_name as vendor_name,
        (SELECT COUNT(*) FROM bookings WHERE package_id = p.id) as total_bookings,
        (SELECT AVG(rating) FROM reviews WHERE package_id = p.id) as avg_rating
      FROM packages p
      LEFT JOIN vendors v ON p.vendor_id = v.id
      WHERE ${whereClause}
      ORDER BY p.created_at DESC
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `;

    queryParams.push(limit, offset);
    const packagesResult = await db.query(packagesQuery, queryParams);

    res.json({
      success: true,
      data: {
        packages: packagesResult.rows,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(totalPackages / limit),
          totalPackages,
          limit: parseInt(limit)
        }
      }
    });
  } catch (error) {
    console.error('Get packages error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch packages',
      error: error.message
    });
  }
};

// Update package status
exports.updatePackageStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['active', 'inactive', 'suspended'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      });
    }

    await db.query(
      'UPDATE packages SET status = $1, updated_at = NOW() WHERE id = $2',
      [status, id]
    );

    res.json({
      success: true,
      message: 'Package status updated successfully'
    });
  } catch (error) {
    console.error('Update package status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update package status',
      error: error.message
    });
  }
};

// Get all bookings with filters
exports.getAllBookings = async (req, res) => {
  try {
    const { page = 1, limit = 20, status, search } = req.query;
    const offset = (page - 1) * limit;

    let whereConditions = ['1=1'];
    const queryParams = [];
    let paramIndex = 1;

    if (status) {
      whereConditions.push(`b.status = $${paramIndex++}`);
      queryParams.push(status);
    }

    if (search) {
      whereConditions.push(`(b.booking_number ILIKE $${paramIndex} OR u.first_name ILIKE $${paramIndex} OR u.last_name ILIKE $${paramIndex})`);
      queryParams.push(`%${search}%`);
      paramIndex++;
    }

    const whereClause = whereConditions.join(' AND ');

    // Get total count
    const countQuery = `SELECT COUNT(*) FROM bookings b WHERE ${whereClause}`;
    const countResult = await db.query(countQuery, queryParams);
    const totalBookings = parseInt(countResult.rows[0].count);

    // Get bookings
    const bookingsQuery = `
      SELECT 
        b.*,
        u.first_name || ' ' || u.last_name as customer_name,
        u.email as customer_email,
        p.title as package_title,
        v.company_name as vendor_name,
        (SELECT SUM(amount) FROM payments WHERE booking_id = b.id AND status = 'completed') as paid_amount
      FROM bookings b
      LEFT JOIN users u ON b.user_id = u.id
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

// Get all reviews with filters
exports.getAllReviews = async (req, res) => {
  try {
    const { page = 1, limit = 20, status } = req.query;
    const offset = (page - 1) * limit;

    let whereClause = '1=1';
    const queryParams = [];
    let paramIndex = 1;

    if (status) {
      whereClause = `r.status = $${paramIndex++}`;
      queryParams.push(status);
    }

    // Get total count
    const countQuery = `SELECT COUNT(*) FROM reviews r WHERE ${whereClause}`;
    const countResult = await db.query(countQuery, queryParams);
    const totalReviews = parseInt(countResult.rows[0].count);

    // Get reviews
    const reviewsQuery = `
      SELECT 
        r.*,
        u.first_name || ' ' || u.last_name as customer_name,
        p.title as package_title,
        v.company_name as vendor_name
      FROM reviews r
      LEFT JOIN users u ON r.user_id = u.id
      LEFT JOIN packages p ON r.package_id = p.id
      LEFT JOIN vendors v ON r.vendor_id = v.id
      WHERE ${whereClause}
      ORDER BY r.created_at DESC
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `;

    queryParams.push(limit, offset);
    const reviewsResult = await db.query(reviewsQuery, queryParams);

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

// Update review status
exports.updateReviewStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['approved', 'rejected', 'pending'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      });
    }

    await db.query(
      'UPDATE reviews SET status = $1, updated_at = NOW() WHERE id = $2',
      [status, id]
    );

    res.json({
      success: true,
      message: 'Review status updated successfully'
    });
  } catch (error) {
    console.error('Update review status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update review status',
      error: error.message
    });
  }
};

// Get system settings
exports.getSettings = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM settings ORDER BY setting_key');

    const settings = {};
    result.rows.forEach(row => {
      settings[row.setting_key] = {
        value: row.setting_value,
        type: row.setting_type,
        description: row.description
      };
    });

    res.json({
      success: true,
      data: settings
    });
  } catch (error) {
    console.error('Get settings error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch settings',
      error: error.message
    });
  }
};

// Update system settings
exports.updateSettings = async (req, res) => {
  try {
    const settings = req.body;

    for (const [key, value] of Object.entries(settings)) {
      await db.query(
        'UPDATE settings SET setting_value = $1, updated_at = NOW() WHERE setting_key = $2',
        [value, key]
      );
    }

    res.json({
      success: true,
      message: 'Settings updated successfully'
    });
  } catch (error) {
    console.error('Update settings error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update settings',
      error: error.message
    });
  }
};

module.exports = exports;
