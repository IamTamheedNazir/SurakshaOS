const nodemailer = require('nodemailer');
const crypto = require('crypto');
require('dotenv').config();

/**
 * Email Service using Nodemailer
 * Handles all email operations including verification, password reset, etc.
 */

// Create transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT) || 587,
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

/**
 * Verify SMTP connection
 */
const verifyConnection = async () => {
  try {
    await transporter.verify();
    console.log('✓ Email service is ready');
    return true;
  } catch (error) {
    console.error('✗ Email service error:', error.message);
    return false;
  }
};

/**
 * Send Email
 * @param {Object} options - Email options
 * @returns {Promise<Object>} Send result
 */
const sendEmail = async (options) => {
  try {
    const mailOptions = {
      from: `${process.env.EMAIL_FROM_NAME} <${process.env.EMAIL_FROM}>`,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text,
    };

    const info = await transporter.sendMail(mailOptions);
    
    return {
      success: true,
      messageId: info.messageId,
      message: 'Email sent successfully',
    };
  } catch (error) {
    console.error('Email send error:', error);
    throw new Error(`Failed to send email: ${error.message}`);
  }
};

/**
 * Generate Email Verification Token
 * @returns {string} Verification token
 */
const generateVerificationToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

/**
 * Send Welcome Email
 * @param {Object} user - User object
 * @returns {Promise<Object>} Send result
 */
const sendWelcomeEmail = async (user) => {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #0f6b3f 0%, #14532d 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .button { display: inline-block; padding: 12px 30px; background: #0f6b3f; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Welcome to UmrahConnect!</h1>
        </div>
        <div class="content">
          <h2>Assalamu Alaikum, ${user.full_name}!</h2>
          <p>Thank you for joining UmrahConnect - India's most trusted pilgrimage marketplace.</p>
          <p>Your account has been successfully created. You can now:</p>
          <ul>
            <li>Browse and compare Umrah & Hajj packages</li>
            <li>Connect with verified vendors</li>
            <li>Book your spiritual journey</li>
            <li>Track your bookings</li>
          </ul>
          <p>Start exploring packages now:</p>
          <a href="${process.env.FRONTEND_URL}/packages" class="button">Browse Packages</a>
          <p>If you have any questions, feel free to contact our support team.</p>
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} UmrahConnect. All rights reserved.</p>
          <p>${process.env.COMPANY_ADDRESS}</p>
          <p>Email: ${process.env.SUPPORT_EMAIL} | Phone: ${process.env.SUPPORT_PHONE}</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return await sendEmail({
    to: user.email,
    subject: 'Welcome to UmrahConnect!',
    html,
  });
};

/**
 * Send Email Verification
 * @param {Object} user - User object
 * @param {string} token - Verification token
 * @returns {Promise<Object>} Send result
 */
const sendEmailVerification = async (user, token) => {
  const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #0f6b3f 0%, #14532d 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .button { display: inline-block; padding: 12px 30px; background: #0f6b3f; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
        .warning { background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Verify Your Email</h1>
        </div>
        <div class="content">
          <h2>Hello ${user.full_name},</h2>
          <p>Thank you for registering with UmrahConnect. Please verify your email address to activate your account.</p>
          <p>Click the button below to verify your email:</p>
          <a href="${verificationUrl}" class="button">Verify Email Address</a>
          <p>Or copy and paste this link in your browser:</p>
          <p style="word-break: break-all; color: #0f6b3f;">${verificationUrl}</p>
          <div class="warning">
            <strong>⚠️ Important:</strong> This verification link will expire in 24 hours.
          </div>
          <p>If you didn't create an account with UmrahConnect, please ignore this email.</p>
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} UmrahConnect. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return await sendEmail({
    to: user.email,
    subject: process.env.EMAIL_VERIFICATION_SUBJECT || 'Verify Your Email - UmrahConnect',
    html,
  });
};

/**
 * Send Password Reset Email
 * @param {Object} user - User object
 * @param {string} token - Reset token
 * @returns {Promise<Object>} Send result
 */
const sendPasswordResetEmail = async (user, token) => {
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #0f6b3f 0%, #14532d 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .button { display: inline-block; padding: 12px 30px; background: #0f6b3f; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
        .warning { background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; }
        .security { background: #f8d7da; border-left: 4px solid #dc3545; padding: 15px; margin: 20px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Reset Your Password</h1>
        </div>
        <div class="content">
          <h2>Hello ${user.full_name},</h2>
          <p>We received a request to reset your password for your UmrahConnect account.</p>
          <p>Click the button below to reset your password:</p>
          <a href="${resetUrl}" class="button">Reset Password</a>
          <p>Or copy and paste this link in your browser:</p>
          <p style="word-break: break-all; color: #0f6b3f;">${resetUrl}</p>
          <div class="warning">
            <strong>⚠️ Important:</strong> This password reset link will expire in 1 hour.
          </div>
          <div class="security">
            <strong>🔒 Security Notice:</strong> If you didn't request a password reset, please ignore this email and ensure your account is secure. Your password will not be changed unless you click the link above.
          </div>
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} UmrahConnect. All rights reserved.</p>
          <p>For security reasons, this email was sent to ${user.email}</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return await sendEmail({
    to: user.email,
    subject: process.env.PASSWORD_RESET_SUBJECT || 'Reset Your Password - UmrahConnect',
    html,
  });
};

/**
 * Send Booking Confirmation Email
 * @param {Object} user - User object
 * @param {Object} booking - Booking details
 * @returns {Promise<Object>} Send result
 */
const sendBookingConfirmation = async (user, booking) => {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #0f6b3f 0%, #14532d 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .booking-details { background: white; padding: 20px; border-radius: 5px; margin: 20px 0; }
        .detail-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee; }
        .button { display: inline-block; padding: 12px 30px; background: #0f6b3f; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>✓ Booking Confirmed!</h1>
        </div>
        <div class="content">
          <h2>Assalamu Alaikum, ${user.full_name}!</h2>
          <p>Your booking has been confirmed. Here are your booking details:</p>
          <div class="booking-details">
            <div class="detail-row">
              <strong>Booking ID:</strong>
              <span>${booking.id}</span>
            </div>
            <div class="detail-row">
              <strong>Package:</strong>
              <span>${booking.package_name}</span>
            </div>
            <div class="detail-row">
              <strong>Vendor:</strong>
              <span>${booking.vendor_name}</span>
            </div>
            <div class="detail-row">
              <strong>Date:</strong>
              <span>${booking.date}</span>
            </div>
            <div class="detail-row">
              <strong>Amount:</strong>
              <span>₹${booking.amount.toLocaleString()}</span>
            </div>
          </div>
          <p>You can view your booking details and track your journey:</p>
          <a href="${process.env.FRONTEND_URL}/dashboard" class="button">View Dashboard</a>
          <p>Our team will contact you shortly with further details.</p>
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} UmrahConnect. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return await sendEmail({
    to: user.email,
    subject: process.env.BOOKING_CONFIRMATION_SUBJECT || 'Booking Confirmed - UmrahConnect',
    html,
  });
};

/**
 * Send OTP Email
 * @param {Object} user - User object
 * @param {string} otp - OTP code
 * @returns {Promise<Object>} Send result
 */
const sendOTPEmail = async (user, otp) => {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #0f6b3f 0%, #14532d 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; text-align: center; }
        .otp-box { background: white; padding: 30px; border-radius: 10px; margin: 20px 0; }
        .otp-code { font-size: 36px; font-weight: bold; color: #0f6b3f; letter-spacing: 10px; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
        .warning { background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; text-align: left; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Your Verification Code</h1>
        </div>
        <div class="content">
          <h2>Hello ${user.full_name},</h2>
          <p>Your One-Time Password (OTP) for verification is:</p>
          <div class="otp-box">
            <div class="otp-code">${otp}</div>
          </div>
          <div class="warning">
            <strong>⚠️ Important:</strong> This OTP will expire in ${process.env.OTP_EXPIRE || 10} minutes. Do not share this code with anyone.
          </div>
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} UmrahConnect. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return await sendEmail({
    to: user.email,
    subject: 'Your Verification Code - UmrahConnect',
    html,
  });
};

module.exports = {
  verifyConnection,
  sendEmail,
  generateVerificationToken,
  sendWelcomeEmail,
  sendEmailVerification,
  sendPasswordResetEmail,
  sendBookingConfirmation,
  sendOTPEmail,
};
