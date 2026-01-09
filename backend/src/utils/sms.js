const twilio = require('twilio');
const axios = require('axios');
const db = require('../config/database');

/**
 * Get active SMS settings
 */
const getSMSSettings = async () => {
  const [settings] = await db.query(
    'SELECT * FROM sms_settings WHERE enabled = true LIMIT 1'
  );
  return settings[0] || null;
};

/**
 * Get SMS template
 */
const getSMSTemplate = async (templateSlug) => {
  const [templates] = await db.query(
    'SELECT * FROM sms_templates WHERE template_slug = ? AND enabled = true',
    [templateSlug]
  );
  return templates[0] || null;
};

/**
 * Replace template variables
 */
const replaceVariables = (content, data) => {
  let result = content;
  Object.keys(data).forEach(key => {
    const regex = new RegExp(`{{${key}}}`, 'g');
    result = result.replace(regex, data[key]);
  });
  return result;
};

/**
 * Send SMS via Twilio
 */
const sendViaTwilio = async (settings, to, message) => {
  const client = twilio(settings.api_key, settings.api_secret);
  
  const result = await client.messages.create({
    body: message,
    from: settings.phone_number,
    to: to
  });
  
  return {
    success: true,
    messageId: result.sid,
    provider: 'twilio'
  };
};

/**
 * Send SMS via MSG91
 */
const sendViaMSG91 = async (settings, to, message) => {
  const config = JSON.parse(settings.config || '{}');
  
  const response = await axios.post('https://api.msg91.com/api/v5/flow/', {
    sender: settings.sender_id,
    mobiles: to,
    message: message,
    route: config.route || '4',
    authkey: settings.api_key
  });
  
  return {
    success: true,
    messageId: response.data.request_id,
    provider: 'msg91'
  };
};

/**
 * Send SMS via AWS SNS
 */
const sendViaAWSSNS = async (settings, to, message) => {
  const AWS = require('aws-sdk');
  const config = JSON.parse(settings.config || '{}');
  
  AWS.config.update({
    accessKeyId: settings.api_key,
    secretAccessKey: settings.api_secret,
    region: config.region || 'us-east-1'
  });
  
  const sns = new AWS.SNS();
  
  const params = {
    Message: message,
    PhoneNumber: to,
    MessageAttributes: {
      'AWS.SNS.SMS.SenderID': {
        DataType: 'String',
        StringValue: settings.sender_id
      }
    }
  };
  
  const result = await sns.publish(params).promise();
  
  return {
    success: true,
    messageId: result.MessageId,
    provider: 'aws_sns'
  };
};

/**
 * Send SMS via Nexmo (Vonage)
 */
const sendViaNexmo = async (settings, to, message) => {
  const response = await axios.post('https://rest.nexmo.com/sms/json', {
    api_key: settings.api_key,
    api_secret: settings.api_secret,
    from: settings.sender_id,
    to: to,
    text: message
  });
  
  return {
    success: true,
    messageId: response.data.messages[0]['message-id'],
    provider: 'nexmo'
  };
};

/**
 * Send SMS
 * @param {Object} options - SMS options
 * @param {string} options.to - Recipient phone number
 * @param {string} options.message - SMS message
 * @param {string} options.template - Template slug (optional)
 * @param {Object} options.data - Template data (optional)
 */
const sendSMS = async (options) => {
  try {
    // Get SMS settings
    const settings = await getSMSSettings();
    
    if (!settings) {
      throw new Error('SMS settings not configured');
    }
    
    let message = options.message;
    
    // If template is provided, fetch and process it
    if (options.template) {
      const template = await getSMSTemplate(options.template);
      
      if (template) {
        message = replaceVariables(template.message, options.data || {});
      }
    }
    
    // Send via appropriate provider
    let result;
    
    switch (settings.provider) {
      case 'twilio':
        result = await sendViaTwilio(settings, options.to, message);
        break;
        
      case 'msg91':
        result = await sendViaMSG91(settings, options.to, message);
        break;
        
      case 'aws_sns':
        result = await sendViaAWSSNS(settings, options.to, message);
        break;
        
      case 'nexmo':
        result = await sendViaNexmo(settings, options.to, message);
        break;
        
      default:
        throw new Error(`Unsupported SMS provider: ${settings.provider}`);
    }
    
    console.log('SMS sent:', result.messageId);
    
    return result;
    
  } catch (error) {
    console.error('Send SMS error:', error);
    throw error;
  }
};

/**
 * Send bulk SMS
 */
const sendBulkSMS = async (recipients, options) => {
  const results = [];
  
  for (const recipient of recipients) {
    try {
      const result = await sendSMS({
        ...options,
        to: recipient.phone,
        data: {
          ...options.data,
          ...recipient.data
        }
      });
      
      results.push({
        phone: recipient.phone,
        success: true,
        messageId: result.messageId
      });
    } catch (error) {
      results.push({
        phone: recipient.phone,
        success: false,
        error: error.message
      });
    }
  }
  
  return results;
};

/**
 * Send OTP SMS
 */
const sendOTPSMS = async (phone, otp) => {
  return sendSMS({
    to: phone,
    template: 'otp_verification',
    data: {
      otp: otp
    }
  });
};

/**
 * Send booking confirmation SMS
 */
const sendBookingConfirmationSMS = async (phone, booking) => {
  return sendSMS({
    to: phone,
    template: 'booking_confirmation_sms',
    data: {
      booking_number: booking.booking_number,
      amount: booking.total_amount,
      currency: booking.currency
    }
  });
};

/**
 * Send payment confirmation SMS
 */
const sendPaymentConfirmationSMS = async (phone, payment, booking) => {
  return sendSMS({
    to: phone,
    template: 'payment_confirmation_sms',
    data: {
      amount: payment.amount,
      currency: payment.currency,
      booking_number: booking.booking_number
    }
  });
};

/**
 * Send booking reminder SMS
 */
const sendBookingReminderSMS = async (phone, booking) => {
  return sendSMS({
    to: phone,
    message: `Reminder: Your trip ${booking.booking_number} departs on ${booking.departure_date}. Have a safe journey!`
  });
};

/**
 * Send vendor approval SMS
 */
const sendVendorApprovalSMS = async (phone, companyName) => {
  return sendSMS({
    to: phone,
    message: `Congratulations! Your vendor account for ${companyName} has been approved. You can now start adding packages.`
  });
};

module.exports = {
  sendSMS,
  sendBulkSMS,
  sendOTPSMS,
  sendBookingConfirmationSMS,
  sendPaymentConfirmationSMS,
  sendBookingReminderSMS,
  sendVendorApprovalSMS
};
