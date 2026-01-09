const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth.middleware');
const registrationFieldsController = require('../controllers/registrationFields.controller');

/**
 * @route   GET /api/admin/registration-fields
 * @desc    Get all registration fields
 * @access  Admin
 */
router.get(
  '/',
  protect,
  authorize('admin'),
  registrationFieldsController.getAllFields
);

/**
 * @route   GET /api/admin/registration-fields/groups
 * @desc    Get all field groups with fields
 * @access  Admin
 */
router.get(
  '/groups',
  protect,
  authorize('admin'),
  registrationFieldsController.getAllGroups
);

/**
 * @route   GET /api/admin/registration-fields/:id
 * @desc    Get single registration field
 * @access  Admin
 */
router.get(
  '/:id',
  protect,
  authorize('admin'),
  registrationFieldsController.getFieldById
);

/**
 * @route   POST /api/admin/registration-fields
 * @desc    Create new registration field
 * @access  Admin
 */
router.post(
  '/',
  protect,
  authorize('admin'),
  registrationFieldsController.createField
);

/**
 * @route   PUT /api/admin/registration-fields/:id
 * @desc    Update registration field
 * @access  Admin
 */
router.put(
  '/:id',
  protect,
  authorize('admin'),
  registrationFieldsController.updateField
);

/**
 * @route   DELETE /api/admin/registration-fields/:id
 * @desc    Delete registration field
 * @access  Admin
 */
router.delete(
  '/:id',
  protect,
  authorize('admin'),
  registrationFieldsController.deleteField
);

/**
 * @route   PUT /api/admin/registration-fields/:id/toggle
 * @desc    Toggle field enabled/disabled
 * @access  Admin
 */
router.put(
  '/:id/toggle',
  protect,
  authorize('admin'),
  registrationFieldsController.toggleField
);

/**
 * @route   PUT /api/admin/registration-fields/reorder
 * @desc    Reorder registration fields
 * @access  Admin
 */
router.put(
  '/reorder',
  protect,
  authorize('admin'),
  registrationFieldsController.reorderFields
);

/**
 * @route   POST /api/admin/registration-fields/groups
 * @desc    Create new field group
 * @access  Admin
 */
router.post(
  '/groups',
  protect,
  authorize('admin'),
  registrationFieldsController.createGroup
);

/**
 * @route   PUT /api/admin/registration-fields/groups/:id
 * @desc    Update field group
 * @access  Admin
 */
router.put(
  '/groups/:id',
  protect,
  authorize('admin'),
  registrationFieldsController.updateGroup
);

/**
 * @route   DELETE /api/admin/registration-fields/groups/:id
 * @desc    Delete field group
 * @access  Admin
 */
router.delete(
  '/groups/:id',
  protect,
  authorize('admin'),
  registrationFieldsController.deleteGroup
);

module.exports = router;
