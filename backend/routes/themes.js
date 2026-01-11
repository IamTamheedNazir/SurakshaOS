const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  getThemes,
  getTheme,
  createTheme,
  updateTheme,
  deleteTheme,
  activateTheme,
  getActiveTheme
} = require('../controllers/cmsController');

// Public routes
router.get('/active', getActiveTheme);

// Protected routes (Admin only)
router.use(protect);
router.use(authorize('admin'));

router.route('/')
  .get(getThemes)
  .post(createTheme);

router.route('/:id/activate')
  .put(activateTheme);

router.route('/:id')
  .get(getTheme)
  .put(updateTheme)
  .delete(deleteTheme);

module.exports = router;
