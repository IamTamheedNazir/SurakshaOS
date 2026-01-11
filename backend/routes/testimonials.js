const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  getTestimonials,
  getTestimonial,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
  getFeaturedTestimonials
} = require('../controllers/cmsController');

// Public routes
router.get('/featured', getFeaturedTestimonials);
router.get('/', getTestimonials);
router.get('/:id', getTestimonial);

// Protected routes (Admin only)
router.use(protect);
router.use(authorize('admin'));

router.post('/', createTestimonial);
router.put('/:id', updateTestimonial);
router.delete('/:id', deleteTestimonial);

module.exports = router;
