const axios = require('axios');
const logger = require('../utils/logger');

class WhatsAppService {
  constructor() {
    this.apiUrl = process.env.WHATSAPP_API_URL;
    this.phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
    this.accessToken = process.env.WHATSAPP_ACCESS_TOKEN;
  }

  /**
   * Send WhatsApp message
   * @param {string} to - Recipient phone number (with country code)
   * @param {string} message - Message text
   * @returns {Promise<object>}
   */
  async sendMessage(to, message) {
    try {
      const response = await axios.post(
        `${this.apiUrl}/${this.phoneNumberId}/messages`,
        {
          messaging_product: 'whatsapp',
          to: to,
          type: 'text',
          text: { body: message }
        },
        {
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      logger.info(`WhatsApp message sent to ${to}`);
      return { success: true, data: response.data };
    } catch (error) {
      logger.error('WhatsApp send message error:', error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Send template message
   * @param {string} to - Recipient phone number
   * @param {string} templateName - Template name
   * @param {array} parameters - Template parameters
   * @returns {Promise<object>}
   */
  async sendTemplateMessage(to, templateName, parameters = []) {
    try {
      const response = await axios.post(
        `${this.apiUrl}/${this.phoneNumberId}/messages`,
        {
          messaging_product: 'whatsapp',
          to: to,
          type: 'template',
          template: {
            name: templateName,
            language: { code: 'en' },
            components: [
              {
                type: 'body',
                parameters: parameters.map(param => ({ type: 'text', text: param }))
              }
            ]
          }
        },
        {
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      logger.info(`WhatsApp template message sent to ${to}`);
      return { success: true, data: response.data };
    } catch (error) {
      logger.error('WhatsApp send template error:', error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Send booking confirmation
   */
  async sendBookingConfirmation(phone, bookingData) {
    const message = `🕌 *Booking Confirmed!*\n\n` +
      `Booking ID: ${bookingData.bookingNumber}\n` +
      `Package: ${bookingData.packageName}\n` +
      `Departure: ${bookingData.departureDate}\n` +
      `Amount Paid: ₹${bookingData.paidAmount}\n` +
      `Pending: ₹${bookingData.pendingAmount}\n\n` +
      `Track your application: ${process.env.APP_URL}/track/${bookingData.bookingNumber}\n\n` +
      `JazakAllah Khair! 🤲`;

    return this.sendMessage(phone, message);
  }

  /**
   * Send payment reminder
   */
  async sendPaymentReminder(phone, paymentData) {
    const message = `💳 *Payment Reminder*\n\n` +
      `Booking ID: ${paymentData.bookingNumber}\n` +
      `Due Amount: ₹${paymentData.dueAmount}\n` +
      `Due Date: ${paymentData.dueDate}\n\n` +
      `Pay now: ${process.env.APP_URL}/payments/${paymentData.paymentId}\n\n` +
      `Need help? Reply to this message.`;

    return this.sendMessage(phone, message);
  }

  /**
   * Send visa status update
   */
  async sendVisaStatusUpdate(phone, visaData) {
    const stageEmojis = {
      'application_prepared': '📝',
      'submitted_to_embassy': '📤',
      'biometrics_scheduled': '👆',
      'under_processing': '⏳',
      'visa_approved': '✅',
      'visa_rejected': '❌',
      'document_uploaded': '📄'
    };

    const emoji = stageEmojis[visaData.stage] || '📋';
    
    const message = `${emoji} *Visa Status Update*\n\n` +
      `Booking ID: ${visaData.bookingNumber}\n` +
      `Status: ${visaData.stageName}\n` +
      `${visaData.details || ''}\n\n` +
      `Track: ${process.env.APP_URL}/track/${visaData.bookingNumber}`;

    return this.sendMessage(phone, message);
  }

  /**
   * Send document upload reminder
   */
  async sendDocumentReminder(phone, documentData) {
    const message = `📄 *Document Upload Reminder*\n\n` +
      `Booking ID: ${documentData.bookingNumber}\n` +
      `Pending Documents:\n` +
      documentData.pendingDocs.map(doc => `• ${doc}`).join('\n') +
      `\n\nUpload now: ${process.env.APP_URL}/documents/${documentData.bookingNumber}\n\n` +
      `Need assistance? Contact support.`;

    return this.sendMessage(phone, message);
  }

  /**
   * Send pre-departure message
   */
  async sendPreDepartureMessage(phone, travelData) {
    const message = `✈️ *Pre-Departure Checklist*\n\n` +
      `Departure: ${travelData.departureDate}\n` +
      `Flight: ${travelData.flightNumber}\n\n` +
      `✅ Passport & Visa\n` +
      `✅ Tickets & Vouchers\n` +
      `✅ Travel Insurance\n` +
      `✅ Vaccination Certificate\n\n` +
      `Download documents: ${process.env.APP_URL}/documents/${travelData.bookingNumber}\n\n` +
      `May Allah accept your journey! 🤲`;

    return this.sendMessage(phone, message);
  }

  /**
   * Send review request
   */
  async sendReviewRequest(phone, bookingData) {
    const message = `⭐ *Share Your Experience*\n\n` +
      `How was your journey with ${bookingData.vendorName}?\n\n` +
      `Your feedback helps other pilgrims make informed decisions.\n\n` +
      `Leave a review: ${process.env.APP_URL}/reviews/${bookingData.bookingId}\n\n` +
      `JazakAllah Khair!`;

    return this.sendMessage(phone, message);
  }

  /**
   * Handle incoming webhook
   */
  async handleWebhook(webhookData) {
    try {
      const { entry } = webhookData;
      
      if (!entry || !entry[0]?.changes) {
        return { success: false, message: 'Invalid webhook data' };
      }

      const changes = entry[0].changes[0];
      const value = changes.value;

      if (value.messages) {
        const message = value.messages[0];
        const from = message.from;
        const messageBody = message.text?.body;

        logger.info(`Received WhatsApp message from ${from}: ${messageBody}`);

        // Process incoming message (implement your logic here)
        await this.processIncomingMessage(from, messageBody);
      }

      return { success: true };
    } catch (error) {
      logger.error('WhatsApp webhook error:', error);
      throw error;
    }
  }

  /**
   * Process incoming message
   */
  async processIncomingMessage(from, message) {
    // Implement your chatbot logic here
    // For now, just log the message
    logger.info(`Processing message from ${from}: ${message}`);
    
    // You can add AI-powered responses here
    // Or route to customer support
  }

  /**
   * Verify webhook
   */
  verifyWebhook(mode, token, challenge) {
    const verifyToken = process.env.WHATSAPP_VERIFY_TOKEN;

    if (mode === 'subscribe' && token === verifyToken) {
      logger.info('WhatsApp webhook verified');
      return challenge;
    }

    return null;
  }
}

module.exports = new WhatsAppService();
