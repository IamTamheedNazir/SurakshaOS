const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const { idParamValidation, validate } = require('../middleware/validation.middleware');
const { body } = require('express-validator');
const db = require('../config/database');
const { v4: uuidv4 } = require('uuid');

// Review controller
const reviewController = {
  // Create review
  createReview: async (req, res) => {
    const connection = await db.getConnection();
    
    try {
      await connection.beginTransaction();
      
      const userId = req.user.id;
      const { package_id, booking_id, rating, comment } = req.body;
      
      // Check if user has booked this package
      const [bookings] = await connection.query(
        'SELECT id FROM bookings WHERE id = ? AND user_id = ? AND package_id = ? AND status = "completed"',
        [booking_id, userId, package_id]
      );
      
      if (bookings.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'You can only review packages you have completed'
        });
      }
      
      // Check if review already exists
      const [existingReviews] = await connection.query(
        'SELECT id FROM reviews WHERE booking_id = ? AND user_id = ?',
        [booking_id, userId]
      );
      
      if (existingReviews.length > 0) {
        return res.status(400).json({
          success: false,
          message: 'You have already reviewed this booking'
        });
      }
      
      // Create review
      const reviewId = uuidv4();
      await connection.query(`
        INSERT INTO reviews (id, package_id, booking_id, user_id, rating, comment)
        VALUES (?, ?, ?, ?, ?, ?)
      `, [reviewId, package_id, booking_id, userId, rating, comment]);
      
      // Update package average rating
      await connection.query(`
        UPDATE packages 
        SET rating = (SELECT AVG(rating) FROM reviews WHERE package_id = ?)
        WHERE id = ?
      `, [package_id, package_id]);
      
      await connection.commit();
      
      res.status(201).json({
        success: true,
        message: 'Review created successfully',
        data: { id: reviewId }
      });
      
    } catch (error) {
      await connection.rollback();
      res.status(500).json({ success: false, message: error.message });
    } finally {
      connection.release();
    }
  },
  
  // Update review
  updateReview: async (req, res) => {
    try {
      const userId = req.user.id;
      const { id } = req.params;
      const { rating, comment } = req.body;
      
      // Check if review belongs to user
      const [reviews] = await db.query(
        'SELECT package_id FROM reviews WHERE id = ? AND user_id = ?',
        [id, userId]
      );
      
      if (reviews.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Review not found or you do not have permission to update it'
        });
      }
      
      // Update review
      await db.query(
        'UPDATE reviews SET rating = ?, comment = ?, updated_at = NOW() WHERE id = ?',
        [rating, comment, id]
      );
      
      // Update package average rating
      const packageId = reviews[0].package_id;
      await db.query(`
        UPDATE packages 
        SET rating = (SELECT AVG(rating) FROM reviews WHERE package_id = ?)
        WHERE id = ?
      `, [packageId, packageId]);
      
      res.json({
        success: true,
        message: 'Review updated successfully'
      });
      
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  
  // Delete review
  deleteReview: async (req, res) => {
    try {
      const userId = req.user.id;
      const { id } = req.params;
      
      // Check if review belongs to user
      const [reviews] = await db.query(
        'SELECT package_id FROM reviews WHERE id = ? AND user_id = ?',
        [id, userId]
      );
      
      if (reviews.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Review not found or you do not have permission to delete it'
        });
      }
      
      const packageId = reviews[0].package_id;
      
      // Delete review
      await db.query('DELETE FROM reviews WHERE id = ?', [id]);
      
      // Update package average rating
      await db.query(`
        UPDATE packages 
        SET rating = COALESCE((SELECT AVG(rating) FROM reviews WHERE package_id = ?), 0)
        WHERE id = ?
      `, [packageId, packageId]);
      
      res.json({
        success: true,
        message: 'Review deleted successfully'
      });
      
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  
  // Get user reviews
  getUserReviews: async (req, res) => {
    try {
      const userId = req.user.id;
      const { page = 1, limit = 10 } = req.query;
      const offset = (page - 1) * limit;
      
      const [reviews] = await db.query(`
        SELECT r.*, p.title as package_title, p.id as package_id
        FROM reviews r
        JOIN packages p ON r.package_id = p.id
        WHERE r.user_id = ?
        ORDER BY r.created_at DESC
        LIMIT ? OFFSET ?
      `, [userId, parseInt(limit), parseInt(offset)]);
      
      const [countResult] = await db.query(
        'SELECT COUNT(*) as total FROM reviews WHERE user_id = ?',
        [userId]
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
  
  // Get review by ID
  getReviewById: async (req, res) => {
    try {
      const { id } = req.params;
      
      const [reviews] = await db.query(`
        SELECT r.*, u.first_name, u.last_name, p.title as package_title
        FROM reviews r
        JOIN users u ON r.user_id = u.id
        JOIN packages p ON r.package_id = p.id
        WHERE r.id = ?
      `, [id]);
      
      if (reviews.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Review not found'
        });
      }
      
      res.json({ success: true, data: reviews[0] });
      
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
};

/**
 * @route   POST /api/reviews
 * @desc    Create a review
 * @access  Private
 */
router.post('/', protect, [
  body('package_id').notEmpty().isUUID().withMessage('Valid package ID is required'),
  body('booking_id').notEmpty().isUUID().withMessage('Valid booking ID is required'),
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('comment').optional().trim().isLength({ min: 10, max: 1000 }).withMessage('Comment must be between 10 and 1000 characters'),
  validate
], reviewController.createReview);

/**
 * @route   GET /api/reviews/my-reviews
 * @desc    Get user's reviews
 * @access  Private
 */
router.get('/my-reviews', protect, reviewController.getUserReviews);

/**
 * @route   GET /api/reviews/:id
 * @desc    Get review by ID
 * @access  Public
 */
router.get('/:id', idParamValidation, validate, reviewController.getReviewById);

/**
 * @route   PUT /api/reviews/:id
 * @desc    Update a review
 * @access  Private
 */
router.put('/:id', protect, [
  idParamValidation,
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('comment').optional().trim().isLength({ min: 10, max: 1000 }).withMessage('Comment must be between 10 and 1000 characters'),
  validate
], reviewController.updateReview);

/**
 * @route   DELETE /api/reviews/:id
 * @desc    Delete a review
 * @access  Private
 */
router.delete('/:id', protect, idParamValidation, validate, reviewController.deleteReview);

module.exports = router;
