const twilio = require('twilio');

/**
 * SMS Service
 * Handles SMS notifications via Twilio
 */

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhone = process.env.TWILIO_PHONE_NUMBER;

const client = twilio(accountSid, authToken);

/**
 * Send SMS
 */
exports.sendSMS = async (to, message) => {
  try {
    if (!accountSid || !authToken || !twilioPhone) {
      console.warn('Twilio credentials not configured');
      return { success: false, message: 'SMS service not configured' };
    }

    const result = await client.messages.create({
      body: message,
      from: twilioPhone,
      to: to
    });

    return {
      success: true,
      messageId: result.sid,
      status: result.status
    };
  } catch (error) {
    console.error('Send SMS error:', error);
    throw error;
  }
};

/**
 * Send OTP
 */
exports.sendOTP = async (phone, otp) => {
  const message = `Your UmrahConnect verification code is: ${otp}. Valid for 10 minutes. Do not share this code with anyone.`;
  return await exports.sendSMS(phone, message);
};

/**
 * Send booking confirmation SMS
 */
exports.sendBookingConfirmation = async (phone, bookingNumber, packageTitle) => {
  const message = `Booking Confirmed! Your booking #${bookingNumber} for ${packageTitle} has been confirmed. Check your email for details.`;
  return await exports.sendSMS(phone, message);
};

/**
 * Send payment reminder SMS
 */
exports.sendPaymentReminder = async (phone, bookingNumber, amount, dueDate) => {
  const message = `Payment Reminder: Your payment of ₹${amount} for booking #${bookingNumber} is due on ${dueDate}. Please complete payment to avoid cancellation.`;
  return await exports.sendSMS(phone, message);
};

/**
 * Send payment received SMS
 */
exports.sendPaymentReceived = async (phone, bookingNumber, amount) => {
  const message = `Payment Received! We have received your payment of ₹${amount} for booking #${bookingNumber}. Thank you!`;
  return await exports.sendSMS(phone, message);
};

/**
 * Send visa status update SMS
 */
exports.sendVisaStatusUpdate = async (phone, bookingNumber, status) => {
  const message = `Visa Update: Your visa application for booking #${bookingNumber} is now ${status}. Check your dashboard for details.`;
  return await exports.sendSMS(phone, message);
};

/**
 * Send document reminder SMS
 */
exports.sendDocumentReminder = async (phone, bookingNumber, documents) => {
  const message = `Document Reminder: Please upload the following documents for booking #${bookingNumber}: ${documents.join(', ')}. Upload now to avoid delays.`;
  return await exports.sendSMS(phone, message);
};

/**
 * Send departure reminder SMS
 */
exports.sendDepartureReminder = async (phone, packageTitle, departureDate) => {
  const message = `Departure Reminder: Your ${packageTitle} journey begins on ${departureDate}. Have a blessed trip! Check your email for travel details.`;
  return await exports.sendSMS(phone, message);
};

/**
 * Send booking cancellation SMS
 */
exports.sendBookingCancellation = async (phone, bookingNumber, refundAmount) => {
  const message = `Booking Cancelled: Your booking #${bookingNumber} has been cancelled. Refund of ₹${refundAmount} will be processed within 7-10 business days.`;
  return await exports.sendSMS(phone, message);
};

/**
 * Send vendor notification SMS
 */
exports.sendVendorNotification = async (phone, message) => {
  return await exports.sendSMS(phone, message);
};

/**
 * Verify phone number format
 */
exports.formatPhoneNumber = (phone) => {
  // Remove all non-numeric characters
  let cleaned = phone.replace(/\D/g, '');
  
  // Add country code if not present
  if (!cleaned.startsWith('91') && cleaned.length === 10) {
    cleaned = '91' + cleaned;
  }
  
  // Add + prefix
  if (!cleaned.startsWith('+')) {
    cleaned = '+' + cleaned;
  }
  
  return cleaned;
};

/**
 * Validate phone number
 */
exports.validatePhoneNumber = (phone) => {
  const formatted = exports.formatPhoneNumber(phone);
  const phoneRegex = /^\+[1-9]\d{1,14}$/;
  return phoneRegex.test(formatted);
};

module.exports = exports;
