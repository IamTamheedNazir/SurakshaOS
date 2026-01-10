const express = require('express');
const router = express.Router();
const adminController = require('../../controllers/admin.controller');
const { authenticate, authorize } = require('../../middleware/auth.middleware');

/**
 * Admin Routes
 * All routes require admin authentication
 */

// Apply admin authentication to all routes
router.use(authenticate);
router.use(authorize(['admin']));

// Dashboard
router.get('/dashboard/stats', adminController.getDashboardStats);

// User Management
router.get('/users', adminController.getAllUsers);
router.put('/users/:id/status', adminController.updateUserStatus);

// Vendor Management
router.get('/vendors', adminController.getAllVendors);
router.put('/vendors/:id/verification', adminController.updateVendorVerification);

// Package Management
router.get('/packages', adminController.getAllPackages);
router.put('/packages/:id/status', adminController.updatePackageStatus);

// Booking Management
router.get('/bookings', adminController.getAllBookings);

// Review Management
router.get('/reviews', adminController.getAllReviews);
router.put('/reviews/:id/status', adminController.updateReviewStatus);

// Settings
router.get('/settings', adminController.getSettings);
router.put('/settings', adminController.updateSettings);

module.exports = router;
