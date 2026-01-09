const express = require('express');
const router = express.Router();
const { protect, authorize, optionalAuth } = require('../middleware/auth.middleware');
const { idParamValidation, paginationValidation, validate } = require('../middleware/validation.middleware');
const { body, query } = require('express-validator');
const db = require('../config/database');

// Package controller
const packageController = {
  // Get all packages (public)
  getAllPackages: async (req, res) => {
    try {
      const {
        page = 1,
        limit = 12,
        search,
        min_price,
        max_price,
        duration_days,
        sort = 'created_at',
        order = 'DESC'
      } = req.query;
      
      const offset = (page - 1) * limit;
      let query = `
        SELECT p.*, v.company_name as vendor_name, v.rating as vendor_rating,
               (SELECT AVG(rating) FROM reviews WHERE package_id = p.id) as avg_rating,
               (SELECT COUNT(*) FROM reviews WHERE package_id = p.id) as review_count
        FROM packages p
        JOIN vendors v ON p.vendor_id = v.id
        WHERE p.status = 'published'
      `;
      
      const params = [];
      
      if (search) {
        query += ' AND (p.title LIKE ? OR p.description LIKE ?)';
        params.push(`%${search}%`, `%${search}%`);
      }
      
      if (min_price) {
        query += ' AND p.price >= ?';
        params.push(parseFloat(min_price));
      }
      
      if (max_price) {
        query += ' AND p.price <= ?';
        params.push(parseFloat(max_price));
      }
      
      if (duration_days) {
        query += ' AND p.duration_days = ?';
        params.push(parseInt(duration_days));
      }
      
      query += ` ORDER BY p.${sort} ${order} LIMIT ? OFFSET ?`;
      params.push(parseInt(limit), parseInt(offset));
      
      const [packages] = await db.query(query, params);
      
      // Get total count
      let countQuery = 'SELECT COUNT(*) as total FROM packages p WHERE p.status = "published"';
      const countParams = [];
      
      if (search) {
        countQuery += ' AND (p.title LIKE ? OR p.description LIKE ?)';
        countParams.push(`%${search}%`, `%${search}%`);
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
  
  // Get package by ID
  getPackageById: async (req, res) => {
    try {
      const { id } = req.params;
      
      const [packages] = await db.query(`
        SELECT p.*, v.company_name as vendor_name, v.company_email, v.company_phone,
               v.rating as vendor_rating,
               (SELECT AVG(rating) FROM reviews WHERE package_id = p.id) as avg_rating,
               (SELECT COUNT(*) FROM reviews WHERE package_id = p.id) as review_count
        FROM packages p
        JOIN vendors v ON p.vendor_id = v.id
        WHERE p.id = ? AND p.status = 'published'
      `, [id]);
      
      if (packages.length === 0) {
        return res.status(404).json({ success: false, message: 'Package not found' });
      }
      
      // Get package images
      const [images] = await db.query(
        'SELECT * FROM package_images WHERE package_id = ? ORDER BY display_order',
        [id]
      );
      
      // Get package inclusions
      const [inclusions] = await db.query(
        'SELECT * FROM package_inclusions WHERE package_id = ?',
        [id]
      );
      
      // Get package exclusions
      const [exclusions] = await db.query(
        'SELECT * FROM package_exclusions WHERE package_id = ?',
        [id]
      );
      
      const packageData = {
        ...packages[0],
        images,
        inclusions,
        exclusions
      };
      
      res.json({ success: true, data: packageData });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  
  // Get package reviews
  getPackageReviews: async (req, res) => {
    try {
      const { id } = req.params;
      const { page = 1, limit = 10 } = req.query;
      const offset = (page - 1) * limit;
      
      const [reviews] = await db.query(`
        SELECT r.*, u.first_name, u.last_name
        FROM reviews r
        JOIN users u ON r.user_id = u.id
        WHERE r.package_id = ?
        ORDER BY r.created_at DESC
        LIMIT ? OFFSET ?
      `, [id, parseInt(limit), parseInt(offset)]);
      
      const [countResult] = await db.query(
        'SELECT COUNT(*) as total FROM reviews WHERE package_id = ?',
        [id]
      );
      
      res.json({
        success: true,
        data: reviews,
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
  
  // Search packages
  searchPackages: async (req, res) => {
    try {
      const { q, page = 1, limit = 12 } = req.query;
      const offset = (page - 1) * limit;
      
      if (!q) {
        return res.status(400).json({ success: false, message: 'Search query is required' });
      }
      
      const [packages] = await db.query(`
        SELECT p.*, v.company_name as vendor_name,
               (SELECT AVG(rating) FROM reviews WHERE package_id = p.id) as avg_rating
        FROM packages p
        JOIN vendors v ON p.vendor_id = v.id
        WHERE p.status = 'published'
        AND (p.title LIKE ? OR p.description LIKE ? OR p.destination LIKE ?)
        ORDER BY p.created_at DESC
        LIMIT ? OFFSET ?
      `, [`%${q}%`, `%${q}%`, `%${q}%`, parseInt(limit), parseInt(offset)]);
      
      res.json({ success: true, data: packages });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  
  // Get featured packages
  getFeaturedPackages: async (req, res) => {
    try {
      const { limit = 6 } = req.query;
      
      const [packages] = await db.query(`
        SELECT p.*, v.company_name as vendor_name,
               (SELECT AVG(rating) FROM reviews WHERE package_id = p.id) as avg_rating
        FROM packages p
        JOIN vendors v ON p.vendor_id = v.id
        WHERE p.status = 'published' AND p.is_featured = true
        ORDER BY p.created_at DESC
        LIMIT ?
      `, [parseInt(limit)]);
      
      res.json({ success: true, data: packages });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  
  // Get popular packages
  getPopularPackages: async (req, res) => {
    try {
      const { limit = 6 } = req.query;
      
      const [packages] = await db.query(`
        SELECT p.*, v.company_name as vendor_name,
               (SELECT AVG(rating) FROM reviews WHERE package_id = p.id) as avg_rating,
               (SELECT COUNT(*) FROM bookings WHERE package_id = p.id) as booking_count
        FROM packages p
        JOIN vendors v ON p.vendor_id = v.id
        WHERE p.status = 'published'
        ORDER BY booking_count DESC
        LIMIT ?
      `, [parseInt(limit)]);
      
      res.json({ success: true, data: packages });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
};

/**
 * @route   GET /api/packages
 * @desc    Get all packages with filters
 * @access  Public
 */
router.get('/', [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 50 }),
  query('min_price').optional().isFloat({ min: 0 }),
  query('max_price').optional().isFloat({ min: 0 }),
  query('duration_days').optional().isInt({ min: 1 }),
  query('sort').optional().isIn(['price', 'created_at', 'title', 'duration_days']),
  query('order').optional().isIn(['ASC', 'DESC']),
  validate
], packageController.getAllPackages);

/**
 * @route   GET /api/packages/featured
 * @desc    Get featured packages
 * @access  Public
 */
router.get('/featured', packageController.getFeaturedPackages);

/**
 * @route   GET /api/packages/popular
 * @desc    Get popular packages
 * @access  Public
 */
router.get('/popular', packageController.getPopularPackages);

/**
 * @route   GET /api/packages/search
 * @desc    Search packages
 * @access  Public
 */
router.get('/search', [
  query('q').notEmpty().withMessage('Search query is required'),
  validate
], packageController.searchPackages);

/**
 * @route   GET /api/packages/:id
 * @desc    Get package by ID
 * @access  Public
 */
router.get('/:id', idParamValidation, validate, packageController.getPackageById);

/**
 * @route   GET /api/packages/:id/reviews
 * @desc    Get package reviews
 * @access  Public
 */
router.get('/:id/reviews', idParamValidation, paginationValidation, validate, packageController.getPackageReviews);

module.exports = router;
