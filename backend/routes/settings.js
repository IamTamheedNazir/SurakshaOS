const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  getSiteSettings,
  updateSiteSettings,
  getPublicSettings
} = require('../controllers/cmsController');

// Public routes
router.get('/public', getPublicSettings);

// Protected routes (Admin only)
router.use(protect);
router.use(authorize('admin'));

router.route('/')
  .get(getSiteSettings)
  .put(updateSiteSettings);

module.exports = router;
