const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../../middleware/auth.middleware');
const { validate } = require('../../middleware/validation.middleware');
const { query } = require('express-validator');
const db = require('../../config/database');

// Admin Analytics Controller
const adminAnalyticsController = {
  // Get dashboard overview
  getDashboardOverview: async (req, res) => {
    try {
      // Get overall stats
      const [stats] = await db.query(`
        SELECT 
          (SELECT COUNT(*) FROM users WHERE role = 'customer' AND status = 'active') as total_customers,
          (SELECT COUNT(*) FROM vendors WHERE status = 'approved') as total_vendors,
          (SELECT COUNT(*) FROM packages WHERE status = 'published') as total_packages,
          (SELECT COUNT(*) FROM bookings) as total_bookings,
          (SELECT SUM(total_amount) FROM bookings WHERE payment_status = 'paid') as total_revenue,
          (SELECT COUNT(*) FROM bookings WHERE status = 'pending') as pending_bookings,
          (SELECT COUNT(*) FROM vendors WHERE status = 'pending') as pending_vendors
      `);
      
      // Get recent bookings
      const [recentBookings] = await db.query(`
        SELECT b.id, b.booking_number, b.created_at, b.total_amount, b.status,
               u.first_name, u.last_name, p.title as package_title
        FROM bookings b
        JOIN users u ON b.user_id = u.id
        JOIN packages p ON b.package_id = p.id
        ORDER BY b.created_at DESC
        LIMIT 10
      `);
      
      // Get revenue trend (last 7 days)
      const [revenueTrend] = await db.query(`
        SELECT DATE(created_at) as date, SUM(total_amount) as revenue
        FROM bookings
        WHERE payment_status = 'paid' AND created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
        GROUP BY DATE(created_at)
        ORDER BY date
      `);
      
      res.json({
        success: true,
        data: {
          stats: stats[0],
          recent_bookings: recentBookings,
          revenue_trend: revenueTrend
        }
      });
      
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  
  // Get revenue analytics
  getRevenueAnalytics: async (req, res) => {
    try {
      const { period = 'month', from_date, to_date } = req.query;
      
      let dateFormat, dateInterval;
      
      switch (period) {
        case 'day':
          dateFormat = '%Y-%m-%d %H:00:00';
          dateInterval = 'INTERVAL 24 HOUR';
          break;
        case 'week':
          dateFormat = '%Y-%m-%d';
          dateInterval = 'INTERVAL 7 DAY';
          break;
        case 'year':
          dateFormat = '%Y-%m';
          dateInterval = 'INTERVAL 12 MONTH';
          break;
        default: // month
          dateFormat = '%Y-%m-%d';
          dateInterval = 'INTERVAL 30 DAY';
      }
      
      let query = `
        SELECT DATE_FORMAT(created_at, '${dateFormat}') as period,
               COUNT(*) as booking_count,
               SUM(total_amount) as revenue,
               AVG(total_amount) as avg_booking_value
        FROM bookings
        WHERE payment_status = 'paid'
      `;
      
      const params = [];
      
      if (from_date && to_date) {
        query += ' AND created_at BETWEEN ? AND ?';
        params.push(from_date, to_date);
      } else {
        query += ` AND created_at >= DATE_SUB(NOW(), ${dateInterval})`;
      }
      
      query += ' GROUP BY period ORDER BY period';
      
      const [revenue] = await db.query(query, params);
      
      // Get top packages by revenue
      const [topPackages] = await db.query(`
        SELECT p.id, p.title, v.company_name as vendor_name,
               COUNT(b.id) as booking_count,
               SUM(b.total_amount) as total_revenue
        FROM packages p
        JOIN bookings b ON p.id = b.package_id
        JOIN vendors v ON p.vendor_id = v.id
        WHERE b.payment_status = 'paid'
        GROUP BY p.id
        ORDER BY total_revenue DESC
        LIMIT 10
      `);
      
      // Get top vendors by revenue
      const [topVendors] = await db.query(`
        SELECT v.id, v.company_name,
               COUNT(b.id) as booking_count,
               SUM(b.total_amount) as total_revenue
        FROM vendors v
        JOIN packages p ON v.id = p.vendor_id
        JOIN bookings b ON p.id = b.package_id
        WHERE b.payment_status = 'paid'
        GROUP BY v.id
        ORDER BY total_revenue DESC
        LIMIT 10
      `);
      
      res.json({
        success: true,
        data: {
          revenue_trend: revenue,
          top_packages: topPackages,
          top_vendors: topVendors
        }
      });
      
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  
  // Get booking analytics
  getBookingAnalytics: async (req, res) => {
    try {
      // Booking status breakdown
      const [statusBreakdown] = await db.query(`
        SELECT status, COUNT(*) as count
        FROM bookings
        GROUP BY status
      `);
      
      // Booking trends (last 30 days)
      const [bookingTrends] = await db.query(`
        SELECT DATE(created_at) as date, COUNT(*) as count
        FROM bookings
        WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
        GROUP BY DATE(created_at)
        ORDER BY date
      `);
      
      // Average booking value by month
      const [avgBookingValue] = await db.query(`
        SELECT DATE_FORMAT(created_at, '%Y-%m') as month,
               AVG(total_amount) as avg_value
        FROM bookings
        WHERE payment_status = 'paid'
        GROUP BY month
        ORDER BY month DESC
        LIMIT 12
      `);
      
      // Conversion rate
      const [conversionData] = await db.query(`
        SELECT 
          COUNT(*) as total_bookings,
          SUM(CASE WHEN payment_status = 'paid' THEN 1 ELSE 0 END) as paid_bookings,
          (SUM(CASE WHEN payment_status = 'paid' THEN 1 ELSE 0 END) / COUNT(*) * 100) as conversion_rate
        FROM bookings
      `);
      
      res.json({
        success: true,
        data: {
          status_breakdown: statusBreakdown,
          booking_trends: bookingTrends,
          avg_booking_value: avgBookingValue,
          conversion: conversionData[0]
        }
      });
      
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  
  // Get user analytics
  getUserAnalytics: async (req, res) => {
    try {
      // User growth
      const [userGrowth] = await db.query(`
        SELECT DATE_FORMAT(created_at, '%Y-%m') as month,
               COUNT(*) as new_users
        FROM users
        WHERE role = 'customer'
        GROUP BY month
        ORDER BY month DESC
        LIMIT 12
      `);
      
      // User activity
      const [userActivity] = await db.query(`
        SELECT 
          COUNT(DISTINCT user_id) as active_users,
          COUNT(*) as total_bookings,
          AVG(total_amount) as avg_spend
        FROM bookings
        WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
      `);
      
      // Top customers
      const [topCustomers] = await db.query(`
        SELECT u.id, u.first_name, u.last_name, u.email,
               COUNT(b.id) as booking_count,
               SUM(b.total_amount) as total_spent
        FROM users u
        JOIN bookings b ON u.id = b.user_id
        WHERE b.payment_status = 'paid'
        GROUP BY u.id
        ORDER BY total_spent DESC
        LIMIT 10
      `);
      
      res.json({
        success: true,
        data: {
          user_growth: userGrowth,
          user_activity: userActivity[0],
          top_customers: topCustomers
        }
      });
      
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
};

/**
 * @route   GET /api/admin/analytics/dashboard
 * @desc    Get dashboard overview
 * @access  Private/Admin
 */
router.get('/dashboard', protect, authorize('admin'), adminAnalyticsController.getDashboardOverview);

/**
 * @route   GET /api/admin/analytics/revenue
 * @desc    Get revenue analytics
 * @access  Private/Admin
 */
router.get('/revenue', protect, authorize('admin'), [
  query('period').optional().isIn(['day', 'week', 'month', 'year']),
  query('from_date').optional().isISO8601(),
  query('to_date').optional().isISO8601(),
  validate
], adminAnalyticsController.getRevenueAnalytics);

/**
 * @route   GET /api/admin/analytics/bookings
 * @desc    Get booking analytics
 * @access  Private/Admin
 */
router.get('/bookings', protect, authorize('admin'), adminAnalyticsController.getBookingAnalytics);

/**
 * @route   GET /api/admin/analytics/users
 * @desc    Get user analytics
 * @access  Private/Admin
 */
router.get('/users', protect, authorize('admin'), adminAnalyticsController.getUserAnalytics);

module.exports = router;
