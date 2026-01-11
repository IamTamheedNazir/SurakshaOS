const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  getBanners,
  getBanner,
  createBanner,
  updateBanner,
  deleteBanner,
  reorderBanners,
  getActiveBanners
} = require('../controllers/cmsController');

// Public routes
router.get('/active', getActiveBanners);

// Protected routes (Admin only)
router.use(protect);
router.use(authorize('admin'));

router.route('/')
  .get(getBanners)
  .post(createBanner);

router.route('/reorder')
  .put(reorderBanners);

router.route('/:id')
  .get(getBanner)
  .put(updateBanner)
  .delete(deleteBanner);

module.exports = router;
