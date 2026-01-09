const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth.middleware');
const settingsController = require('../controllers/settings.controller');

/**
 * Payment Gateway Settings Routes
 */
router.get(
  '/payment-gateways',
  protect,
  authorize('admin'),
  settingsController.getPaymentGateways
);

router.get(
  '/payment-gateways/:id',
  protect,
  authorize('admin'),
  settingsController.getPaymentGatewayById
);

router.post(
  '/payment-gateways',
  protect,
  authorize('admin'),
  settingsController.createPaymentGateway
);

router.put(
  '/payment-gateways/:id',
  protect,
  authorize('admin'),
  settingsController.updatePaymentGateway
);

router.put(
  '/payment-gateways/:id/toggle',
  protect,
  authorize('admin'),
  settingsController.togglePaymentGateway
);

router.delete(
  '/payment-gateways/:id',
  protect,
  authorize('admin'),
  settingsController.deletePaymentGateway
);

/**
 * Email Settings Routes
 */
router.get(
  '/email',
  protect,
  authorize('admin'),
  settingsController.getEmailSettings
);

router.put(
  '/email',
  protect,
  authorize('admin'),
  settingsController.updateEmailSettings
);

router.post(
  '/email/test',
  protect,
  authorize('admin'),
  settingsController.testEmailSettings
);

/**
 * SMS Settings Routes
 */
router.get(
  '/sms',
  protect,
  authorize('admin'),
  settingsController.getSMSSettings
);

router.get(
  '/sms/:id',
  protect,
  authorize('admin'),
  settingsController.getSMSSettingById
);

router.put(
  '/sms/:id',
  protect,
  authorize('admin'),
  settingsController.updateSMSSettings
);

router.put(
  '/sms/:id/toggle',
  protect,
  authorize('admin'),
  settingsController.toggleSMSProvider
);

router.post(
  '/sms/test',
  protect,
  authorize('admin'),
  settingsController.testSMSSettings
);

/**
 * Storage Settings Routes
 */
router.get(
  '/storage',
  protect,
  authorize('admin'),
  settingsController.getStorageSettings
);

router.get(
  '/storage/:id',
  protect,
  authorize('admin'),
  settingsController.getStorageSettingById
);

router.put(
  '/storage/:id',
  protect,
  authorize('admin'),
  settingsController.updateStorageSettings
);

router.put(
  '/storage/:id/set-default',
  protect,
  authorize('admin'),
  settingsController.setDefaultStorage
);

router.put(
  '/storage/:id/toggle',
  protect,
  authorize('admin'),
  settingsController.toggleStorageProvider
);

router.post(
  '/storage/test',
  protect,
  authorize('admin'),
  settingsController.testStorageConnection
);

/**
 * Analytics Settings Routes
 */
router.get(
  '/analytics',
  protect,
  authorize('admin'),
  settingsController.getAnalyticsSettings
);

router.get(
  '/analytics/:id',
  protect,
  authorize('admin'),
  settingsController.getAnalyticsSettingById
);

router.put(
  '/analytics/:id',
  protect,
  authorize('admin'),
  settingsController.updateAnalyticsSettings
);

router.put(
  '/analytics/:id/toggle',
  protect,
  authorize('admin'),
  settingsController.toggleAnalyticsProvider
);

/**
 * Social Login Settings Routes
 */
router.get(
  '/social-login',
  protect,
  authorize('admin'),
  settingsController.getSocialLoginSettings
);

router.get(
  '/social-login/:id',
  protect,
  authorize('admin'),
  settingsController.getSocialLoginSettingById
);

router.put(
  '/social-login/:id',
  protect,
  authorize('admin'),
  settingsController.updateSocialLoginSettings
);

router.put(
  '/social-login/:id/toggle',
  protect,
  authorize('admin'),
  settingsController.toggleSocialLoginProvider
);

/**
 * General Settings Routes
 */
router.get(
  '/general',
  protect,
  authorize('admin'),
  settingsController.getGeneralSettings
);

router.put(
  '/general',
  protect,
  authorize('admin'),
  settingsController.updateGeneralSettings
);

/**
 * Commission Rules Routes
 */
router.get(
  '/commission-rules',
  protect,
  authorize('admin'),
  settingsController.getCommissionRules
);

router.get(
  '/commission-rules/:id',
  protect,
  authorize('admin'),
  settingsController.getCommissionRuleById
);

router.post(
  '/commission-rules',
  protect,
  authorize('admin'),
  settingsController.createCommissionRule
);

router.put(
  '/commission-rules/:id',
  protect,
  authorize('admin'),
  settingsController.updateCommissionRule
);

router.delete(
  '/commission-rules/:id',
  protect,
  authorize('admin'),
  settingsController.deleteCommissionRule
);

router.put(
  '/commission-rules/:id/toggle',
  protect,
  authorize('admin'),
  settingsController.toggleCommissionRule
);

/**
 * Refund Policies Routes
 */
router.get(
  '/refund-policies',
  protect,
  authorize('admin'),
  settingsController.getRefundPolicies
);

router.get(
  '/refund-policies/:id',
  protect,
  authorize('admin'),
  settingsController.getRefundPolicyById
);

router.post(
  '/refund-policies',
  protect,
  authorize('admin'),
  settingsController.createRefundPolicy
);

router.put(
  '/refund-policies/:id',
  protect,
  authorize('admin'),
  settingsController.updateRefundPolicy
);

router.delete(
  '/refund-policies/:id',
  protect,
  authorize('admin'),
  settingsController.deleteRefundPolicy
);

router.put(
  '/refund-policies/:id/set-default',
  protect,
  authorize('admin'),
  settingsController.setDefaultRefundPolicy
);

module.exports = router;
