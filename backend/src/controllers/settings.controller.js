const db = require('../config/database');
const { v4: uuidv4 } = require('uuid');
const { sendEmail } = require('../utils/email');
const { sendSMS } = require('../utils/sms');
const { testStorageConnection } = require('../utils/storage');

/**
 * ============================================
 * PAYMENT GATEWAY SETTINGS
 * ============================================
 */

/**
 * @desc    Get all payment gateways
 * @route   GET /api/admin/settings/payment-gateways
 * @access  Admin
 */
exports.getPaymentGateways = async (req, res) => {
  try {
    const [gateways] = await db.query(
      'SELECT * FROM payment_gateway_settings ORDER BY display_name ASC'
    );
    
    res.status(200).json({
      success: true,
      count: gateways.length,
      data: gateways
    });
  } catch (error) {
    console.error('Get payment gateways error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching payment gateways',
      error: error.message
    });
  }
};

/**
 * @desc    Get payment gateway by ID
 * @route   GET /api/admin/settings/payment-gateways/:id
 * @access  Admin
 */
exports.getPaymentGatewayById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const [gateways] = await db.query(
      'SELECT * FROM payment_gateway_settings WHERE id = ?',
      [id]
    );
    
    if (gateways.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Payment gateway not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: gateways[0]
    });
  } catch (error) {
    console.error('Get payment gateway error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching payment gateway',
      error: error.message
    });
  }
};

/**
 * @desc    Create payment gateway
 * @route   POST /api/admin/settings/payment-gateways
 * @access  Admin
 */
exports.createPaymentGateway = async (req, res) => {
  try {
    const {
      gateway_name,
      display_name,
      api_key,
      api_secret,
      webhook_secret,
      mode,
      enabled,
      transaction_fee_percentage,
      transaction_fee_fixed,
      config
    } = req.body;
    
    const gatewayId = uuidv4();
    
    await db.query(`
      INSERT INTO payment_gateway_settings (
        id, gateway_name, display_name, api_key, api_secret,
        webhook_secret, mode, enabled, transaction_fee_percentage,
        transaction_fee_fixed, config
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      gatewayId, gateway_name, display_name, api_key, api_secret,
      webhook_secret, mode || 'test', enabled !== false,
      transaction_fee_percentage || 0, transaction_fee_fixed || 0,
      JSON.stringify(config || {})
    ]);
    
    const [gateways] = await db.query(
      'SELECT * FROM payment_gateway_settings WHERE id = ?',
      [gatewayId]
    );
    
    res.status(201).json({
      success: true,
      message: 'Payment gateway created successfully',
      data: gateways[0]
    });
  } catch (error) {
    console.error('Create payment gateway error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating payment gateway',
      error: error.message
    });
  }
};

/**
 * @desc    Update payment gateway
 * @route   PUT /api/admin/settings/payment-gateways/:id
 * @access  Admin
 */
exports.updatePaymentGateway = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    const [existing] = await db.query(
      'SELECT * FROM payment_gateway_settings WHERE id = ?',
      [id]
    );
    
    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Payment gateway not found'
      });
    }
    
    const updateFields = [];
    const updateValues = [];
    
    Object.keys(updateData).forEach(key => {
      if (key !== 'id' && updateData[key] !== undefined) {
        updateFields.push(`${key} = ?`);
        if (key === 'config') {
          updateValues.push(JSON.stringify(updateData[key]));
        } else {
          updateValues.push(updateData[key]);
        }
      }
    });
    
    if (updateFields.length > 0) {
      updateValues.push(id);
      await db.query(
        `UPDATE payment_gateway_settings SET ${updateFields.join(', ')} WHERE id = ?`,
        updateValues
      );
    }
    
    const [gateways] = await db.query(
      'SELECT * FROM payment_gateway_settings WHERE id = ?',
      [id]
    );
    
    res.status(200).json({
      success: true,
      message: 'Payment gateway updated successfully',
      data: gateways[0]
    });
  } catch (error) {
    console.error('Update payment gateway error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating payment gateway',
      error: error.message
    });
  }
};

/**
 * @desc    Toggle payment gateway
 * @route   PUT /api/admin/settings/payment-gateways/:id/toggle
 * @access  Admin
 */
exports.togglePaymentGateway = async (req, res) => {
  try {
    const { id } = req.params;
    
    const [gateways] = await db.query(
      'SELECT enabled FROM payment_gateway_settings WHERE id = ?',
      [id]
    );
    
    if (gateways.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Payment gateway not found'
      });
    }
    
    const newStatus = !gateways[0].enabled;
    
    await db.query(
      'UPDATE payment_gateway_settings SET enabled = ? WHERE id = ?',
      [newStatus, id]
    );
    
    res.status(200).json({
      success: true,
      message: `Payment gateway ${newStatus ? 'enabled' : 'disabled'} successfully`,
      data: { enabled: newStatus }
    });
  } catch (error) {
    console.error('Toggle payment gateway error:', error);
    res.status(500).json({
      success: false,
      message: 'Error toggling payment gateway',
      error: error.message
    });
  }
};

/**
 * @desc    Delete payment gateway
 * @route   DELETE /api/admin/settings/payment-gateways/:id
 * @access  Admin
 */
exports.deletePaymentGateway = async (req, res) => {
  try {
    const { id } = req.params;
    
    const [existing] = await db.query(
      'SELECT * FROM payment_gateway_settings WHERE id = ?',
      [id]
    );
    
    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Payment gateway not found'
      });
    }
    
    await db.query('DELETE FROM payment_gateway_settings WHERE id = ?', [id]);
    
    res.status(200).json({
      success: true,
      message: 'Payment gateway deleted successfully'
    });
  } catch (error) {
    console.error('Delete payment gateway error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting payment gateway',
      error: error.message
    });
  }
};

/**
 * ============================================
 * EMAIL SETTINGS
 * ============================================
 */

/**
 * @desc    Get email settings
 * @route   GET /api/admin/settings/email
 * @access  Admin
 */
exports.getEmailSettings = async (req, res) => {
  try {
    const [settings] = await db.query(
      'SELECT * FROM email_settings LIMIT 1'
    );
    
    res.status(200).json({
      success: true,
      data: settings[0] || null
    });
  } catch (error) {
    console.error('Get email settings error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching email settings',
      error: error.message
    });
  }
};

/**
 * @desc    Update email settings
 * @route   PUT /api/admin/settings/email
 * @access  Admin
 */
exports.updateEmailSettings = async (req, res) => {
  try {
    const {
      smtp_host,
      smtp_port,
      smtp_username,
      smtp_password,
      smtp_encryption,
      from_name,
      from_email,
      enabled
    } = req.body;
    
    // Check if settings exist
    const [existing] = await db.query('SELECT id FROM email_settings LIMIT 1');
    
    if (existing.length === 0) {
      // Create new
      const settingsId = uuidv4();
      await db.query(`
        INSERT INTO email_settings (
          id, smtp_host, smtp_port, smtp_username, smtp_password,
          smtp_encryption, from_name, from_email, enabled
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        settingsId, smtp_host, smtp_port, smtp_username, smtp_password,
        smtp_encryption || 'tls', from_name, from_email, enabled !== false
      ]);
    } else {
      // Update existing
      const updateFields = [];
      const updateValues = [];
      
      Object.keys(req.body).forEach(key => {
        if (req.body[key] !== undefined) {
          updateFields.push(`${key} = ?`);
          updateValues.push(req.body[key]);
        }
      });
      
      if (updateFields.length > 0) {
        updateValues.push(existing[0].id);
        await db.query(
          `UPDATE email_settings SET ${updateFields.join(', ')} WHERE id = ?`,
          updateValues
        );
      }
    }
    
    const [settings] = await db.query('SELECT * FROM email_settings LIMIT 1');
    
    res.status(200).json({
      success: true,
      message: 'Email settings updated successfully',
      data: settings[0]
    });
  } catch (error) {
    console.error('Update email settings error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating email settings',
      error: error.message
    });
  }
};

/**
 * @desc    Test email settings
 * @route   POST /api/admin/settings/email/test
 * @access  Admin
 */
exports.testEmailSettings = async (req, res) => {
  try {
    const { to_email } = req.body;
    
    if (!to_email) {
      return res.status(400).json({
        success: false,
        message: 'Please provide recipient email'
      });
    }
    
    // Send test email
    await sendEmail({
      to: to_email,
      subject: 'Test Email - UmrahConnect',
      template: 'test_email',
      data: {
        message: 'This is a test email from UmrahConnect. If you received this, your email settings are working correctly!'
      }
    });
    
    res.status(200).json({
      success: true,
      message: 'Test email sent successfully'
    });
  } catch (error) {
    console.error('Test email error:', error);
    res.status(500).json({
      success: false,
      message: 'Error sending test email',
      error: error.message
    });
  }
};

/**
 * ============================================
 * SMS SETTINGS
 * ============================================
 */

/**
 * @desc    Get all SMS settings
 * @route   GET /api/admin/settings/sms
 * @access  Admin
 */
exports.getSMSSettings = async (req, res) => {
  try {
    const [settings] = await db.query(
      'SELECT * FROM sms_settings ORDER BY provider ASC'
    );
    
    res.status(200).json({
      success: true,
      count: settings.length,
      data: settings
    });
  } catch (error) {
    console.error('Get SMS settings error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching SMS settings',
      error: error.message
    });
  }
};

/**
 * @desc    Get SMS setting by ID
 * @route   GET /api/admin/settings/sms/:id
 * @access  Admin
 */
exports.getSMSSettingById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const [settings] = await db.query(
      'SELECT * FROM sms_settings WHERE id = ?',
      [id]
    );
    
    if (settings.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'SMS settings not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: settings[0]
    });
  } catch (error) {
    console.error('Get SMS setting error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching SMS setting',
      error: error.message
    });
  }
};

/**
 * @desc    Update SMS settings
 * @route   PUT /api/admin/settings/sms/:id
 * @access  Admin
 */
exports.updateSMSSettings = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    const [existing] = await db.query(
      'SELECT * FROM sms_settings WHERE id = ?',
      [id]
    );
    
    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'SMS settings not found'
      });
    }
    
    const updateFields = [];
    const updateValues = [];
    
    Object.keys(updateData).forEach(key => {
      if (key !== 'id' && updateData[key] !== undefined) {
        updateFields.push(`${key} = ?`);
        if (key === 'config') {
          updateValues.push(JSON.stringify(updateData[key]));
        } else {
          updateValues.push(updateData[key]);
        }
      }
    });
    
    if (updateFields.length > 0) {
      updateValues.push(id);
      await db.query(
        `UPDATE sms_settings SET ${updateFields.join(', ')} WHERE id = ?`,
        updateValues
      );
    }
    
    const [settings] = await db.query(
      'SELECT * FROM sms_settings WHERE id = ?',
      [id]
    );
    
    res.status(200).json({
      success: true,
      message: 'SMS settings updated successfully',
      data: settings[0]
    });
  } catch (error) {
    console.error('Update SMS settings error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating SMS settings',
      error: error.message
    });
  }
};

/**
 * @desc    Toggle SMS provider
 * @route   PUT /api/admin/settings/sms/:id/toggle
 * @access  Admin
 */
exports.toggleSMSProvider = async (req, res) => {
  try {
    const { id } = req.params;
    
    const [settings] = await db.query(
      'SELECT enabled FROM sms_settings WHERE id = ?',
      [id]
    );
    
    if (settings.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'SMS settings not found'
      });
    }
    
    const newStatus = !settings[0].enabled;
    
    await db.query(
      'UPDATE sms_settings SET enabled = ? WHERE id = ?',
      [newStatus, id]
    );
    
    res.status(200).json({
      success: true,
      message: `SMS provider ${newStatus ? 'enabled' : 'disabled'} successfully`,
      data: { enabled: newStatus }
    });
  } catch (error) {
    console.error('Toggle SMS provider error:', error);
    res.status(500).json({
      success: false,
      message: 'Error toggling SMS provider',
      error: error.message
    });
  }
};

/**
 * @desc    Test SMS settings
 * @route   POST /api/admin/settings/sms/test
 * @access  Admin
 */
exports.testSMSSettings = async (req, res) => {
  try {
    const { to_phone } = req.body;
    
    if (!to_phone) {
      return res.status(400).json({
        success: false,
        message: 'Please provide recipient phone number'
      });
    }
    
    // Send test SMS
    await sendSMS({
      to: to_phone,
      message: 'This is a test SMS from UmrahConnect. Your SMS settings are working correctly!'
    });
    
    res.status(200).json({
      success: true,
      message: 'Test SMS sent successfully'
    });
  } catch (error) {
    console.error('Test SMS error:', error);
    res.status(500).json({
      success: false,
      message: 'Error sending test SMS',
      error: error.message
    });
  }
};

/**
 * ============================================
 * STORAGE SETTINGS
 * ============================================
 */

/**
 * @desc    Get all storage settings
 * @route   GET /api/admin/settings/storage
 * @access  Admin
 */
exports.getStorageSettings = async (req, res) => {
  try {
    const [settings] = await db.query(
      'SELECT * FROM storage_settings ORDER BY provider ASC'
    );
    
    res.status(200).json({
      success: true,
      count: settings.length,
      data: settings
    });
  } catch (error) {
    console.error('Get storage settings error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching storage settings',
      error: error.message
    });
  }
};

/**
 * @desc    Get storage setting by ID
 * @route   GET /api/admin/settings/storage/:id
 * @access  Admin
 */
exports.getStorageSettingById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const [settings] = await db.query(
      'SELECT * FROM storage_settings WHERE id = ?',
      [id]
    );
    
    if (settings.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Storage settings not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: settings[0]
    });
  } catch (error) {
    console.error('Get storage setting error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching storage setting',
      error: error.message
    });
  }
};

/**
 * @desc    Update storage settings
 * @route   PUT /api/admin/settings/storage/:id
 * @access  Admin
 */
exports.updateStorageSettings = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    const [existing] = await db.query(
      'SELECT * FROM storage_settings WHERE id = ?',
      [id]
    );
    
    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Storage settings not found'
      });
    }
    
    const updateFields = [];
    const updateValues = [];
    
    Object.keys(updateData).forEach(key => {
      if (key !== 'id' && updateData[key] !== undefined) {
        updateFields.push(`${key} = ?`);
        if (key === 'config') {
          updateValues.push(JSON.stringify(updateData[key]));
        } else {
          updateValues.push(updateData[key]);
        }
      }
    });
    
    if (updateFields.length > 0) {
      updateValues.push(id);
      await db.query(
        `UPDATE storage_settings SET ${updateFields.join(', ')} WHERE id = ?`,
        updateValues
      );
    }
    
    const [settings] = await db.query(
      'SELECT * FROM storage_settings WHERE id = ?',
      [id]
    );
    
    res.status(200).json({
      success: true,
      message: 'Storage settings updated successfully',
      data: settings[0]
    });
  } catch (error) {
    console.error('Update storage settings error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating storage settings',
      error: error.message
    });
  }
};

/**
 * @desc    Set default storage provider
 * @route   PUT /api/admin/settings/storage/:id/set-default
 * @access  Admin
 */
exports.setDefaultStorage = async (req, res) => {
  const connection = await db.getConnection();
  
  try {
    await connection.beginTransaction();
    
    const { id } = req.params;
    
    // Unset all defaults
    await connection.query(
      'UPDATE storage_settings SET is_default = false'
    );
    
    // Set new default
    await connection.query(
      'UPDATE storage_settings SET is_default = true WHERE id = ?',
      [id]
    );
    
    await connection.commit();
    
    res.status(200).json({
      success: true,
      message: 'Default storage provider updated successfully'
    });
  } catch (error) {
    await connection.rollback();
    console.error('Set default storage error:', error);
    res.status(500).json({
      success: false,
      message: 'Error setting default storage',
      error: error.message
    });
  } finally {
    connection.release();
  }
};

/**
 * @desc    Toggle storage provider
 * @route   PUT /api/admin/settings/storage/:id/toggle
 * @access  Admin
 */
exports.toggleStorageProvider = async (req, res) => {
  try {
    const { id } = req.params;
    
    const [settings] = await db.query(
      'SELECT enabled FROM storage_settings WHERE id = ?',
      [id]
    );
    
    if (settings.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Storage settings not found'
      });
    }
    
    const newStatus = !settings[0].enabled;
    
    await db.query(
      'UPDATE storage_settings SET enabled = ? WHERE id = ?',
      [newStatus, id]
    );
    
    res.status(200).json({
      success: true,
      message: `Storage provider ${newStatus ? 'enabled' : 'disabled'} successfully`,
      data: { enabled: newStatus }
    });
  } catch (error) {
    console.error('Toggle storage provider error:', error);
    res.status(500).json({
      success: false,
      message: 'Error toggling storage provider',
      error: error.message
    });
  }
};

/**
 * @desc    Test storage connection
 * @route   POST /api/admin/settings/storage/test
 * @access  Admin
 */
exports.testStorageConnection = async (req, res) => {
  try {
    const { provider, credentials } = req.body;
    
    const result = await testStorageConnection(provider, credentials);
    
    res.status(200).json({
      success: true,
      message: 'Storage connection test successful',
      data: result
    });
  } catch (error) {
    console.error('Test storage connection error:', error);
    res.status(500).json({
      success: false,
      message: 'Storage connection test failed',
      error: error.message
    });
  }
};

// Export remaining functions (to be implemented)
exports.getAnalyticsSettings = async (req, res) => { /* Implementation */ };
exports.getAnalyticsSettingById = async (req, res) => { /* Implementation */ };
exports.updateAnalyticsSettings = async (req, res) => { /* Implementation */ };
exports.toggleAnalyticsProvider = async (req, res) => { /* Implementation */ };
exports.getSocialLoginSettings = async (req, res) => { /* Implementation */ };
exports.getSocialLoginSettingById = async (req, res) => { /* Implementation */ };
exports.updateSocialLoginSettings = async (req, res) => { /* Implementation */ };
exports.toggleSocialLoginProvider = async (req, res) => { /* Implementation */ };
exports.getGeneralSettings = async (req, res) => { /* Implementation */ };
exports.updateGeneralSettings = async (req, res) => { /* Implementation */ };
exports.getCommissionRules = async (req, res) => { /* Implementation */ };
exports.getCommissionRuleById = async (req, res) => { /* Implementation */ };
exports.createCommissionRule = async (req, res) => { /* Implementation */ };
exports.updateCommissionRule = async (req, res) => { /* Implementation */ };
exports.deleteCommissionRule = async (req, res) => { /* Implementation */ };
exports.toggleCommissionRule = async (req, res) => { /* Implementation */ };
exports.getRefundPolicies = async (req, res) => { /* Implementation */ };
exports.getRefundPolicyById = async (req, res) => { /* Implementation */ };
exports.createRefundPolicy = async (req, res) => { /* Implementation */ };
exports.updateRefundPolicy = async (req, res) => { /* Implementation */ };
exports.deleteRefundPolicy = async (req, res) => { /* Implementation */ };
exports.setDefaultRefundPolicy = async (req, res) => { /* Implementation */ };
