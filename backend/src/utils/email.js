const nodemailer = require('nodemailer');
const db = require('../config/database');

/**
 * Get email settings from database
 */
const getEmailSettings = async () => {
  const [settings] = await db.query(
    'SELECT * FROM email_settings WHERE enabled = true LIMIT 1'
  );
  return settings[0] || null;
};

/**
 * Get email template
 */
const getEmailTemplate = async (templateSlug) => {
  const [templates] = await db.query(
    'SELECT * FROM email_templates WHERE template_slug = ? AND enabled = true',
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
 * Create email transporter
 */
const createTransporter = (settings) => {
  return nodemailer.createTransporter({
    host: settings.smtp_host,
    port: settings.smtp_port,
    secure: settings.smtp_encryption === 'ssl',
    auth: {
      user: settings.smtp_username,
      pass: settings.smtp_password
    }
  });
};

/**
 * Send email
 * @param {Object} options - Email options
 * @param {string} options.to - Recipient email
 * @param {string} options.subject - Email subject
 * @param {string} options.template - Template slug
 * @param {Object} options.data - Template data
 * @param {string} options.html - Custom HTML (if not using template)
 * @param {string} options.text - Plain text content
 */
const sendEmail = async (options) => {
  try {
    // Get email settings
    const settings = await getEmailSettings();
    
    if (!settings) {
      throw new Error('Email settings not configured');
    }
    
    // Create transporter
    const transporter = createTransporter(settings);
    
    let htmlContent = options.html;
    let subject = options.subject;
    
    // If template is provided, fetch and process it
    if (options.template) {
      const template = await getEmailTemplate(options.template);
      
      if (template) {
        subject = replaceVariables(template.subject, options.data || {});
        htmlContent = replaceVariables(template.body, options.data || {});
      }
    }
    
    // Email options
    const mailOptions = {
      from: `${settings.from_name} <${settings.from_email}>`,
      to: options.to,
      subject: subject,
      html: htmlContent,
      text: options.text
    };
    
    // Send email
    const info = await transporter.sendMail(mailOptions);
    
    console.log('Email sent:', info.messageId);
    
    return {
      success: true,
      messageId: info.messageId
    };
    
  } catch (error) {
    console.error('Send email error:', error);
    throw error;
  }
};

/**
 * Send bulk emails
 */
const sendBulkEmails = async (recipients, options) => {
  const results = [];
  
  for (const recipient of recipients) {
    try {
      const result = await sendEmail({
        ...options,
        to: recipient.email,
        data: {
          ...options.data,
          ...recipient.data
        }
      });
      
      results.push({
        email: recipient.email,
        success: true,
        messageId: result.messageId
      });
    } catch (error) {
      results.push({
        email: recipient.email,
        success: false,
        error: error.message
      });
    }
  }
  
  return results;
};

/**
 * Send welcome email
 */
const sendWelcomeEmail = async (user) => {
  return sendEmail({
    to: user.email,
    template: 'welcome',
    data: {
      name: `${user.first_name} ${user.last_name}`,
      email: user.email
    }
  });
};

/**
 * Send booking confirmation email
 */
const sendBookingConfirmationEmail = async (booking, user) => {
  return sendEmail({
    to: user.email,
    template: 'booking_confirmation',
    data: {
      name: `${user.first_name} ${user.last_name}`,
      booking_number: booking.booking_number,
      package_title: booking.package_title,
      departure_date: booking.departure_date,
      total_amount: booking.total_amount,
      currency: booking.currency
    }
  });
};

/**
 * Send payment confirmation email
 */
const sendPaymentConfirmationEmail = async (payment, booking, user) => {
  return sendEmail({
    to: user.email,
    template: 'payment_receipt',
    data: {
      name: `${user.first_name} ${user.last_name}`,
      payment_id: payment.payment_id,
      booking_number: booking.booking_number,
      amount: payment.amount,
      currency: payment.currency,
      payment_date: payment.payment_date
    }
  });
};

/**
 * Send vendor approval email
 */
const sendVendorApprovalEmail = async (vendor, user) => {
  return sendEmail({
    to: user.email,
    template: 'vendor_approval',
    data: {
      name: `${user.first_name} ${user.last_name}`,
      company_name: vendor.company_name
    }
  });
};

/**
 * Send password reset email
 */
const sendPasswordResetEmail = async (user, resetToken) => {
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
  
  return sendEmail({
    to: user.email,
    subject: 'Password Reset Request',
    html: `
      <h1>Password Reset</h1>
      <p>Hi ${user.first_name},</p>
      <p>You requested to reset your password. Click the link below to reset it:</p>
      <a href="${resetUrl}">${resetUrl}</a>
      <p>This link will expire in 1 hour.</p>
      <p>If you didn't request this, please ignore this email.</p>
    `
  });
};

/**
 * Send booking reminder email
 */
const sendBookingReminderEmail = async (booking, user) => {
  return sendEmail({
    to: user.email,
    subject: `Booking Reminder - ${booking.booking_number}`,
    html: `
      <h1>Booking Reminder</h1>
      <p>Hi ${user.first_name},</p>
      <p>This is a reminder for your upcoming trip:</p>
      <ul>
        <li><strong>Booking Number:</strong> ${booking.booking_number}</li>
        <li><strong>Package:</strong> ${booking.package_title}</li>
        <li><strong>Departure Date:</strong> ${booking.departure_date}</li>
      </ul>
      <p>Please ensure all your documents are ready.</p>
    `
  });
};

module.exports = {
  sendEmail,
  sendBulkEmails,
  sendWelcomeEmail,
  sendBookingConfirmationEmail,
  sendPaymentConfirmationEmail,
  sendVendorApprovalEmail,
  sendPasswordResetEmail,
  sendBookingReminderEmail
};
