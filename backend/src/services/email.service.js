const nodemailer = require('nodemailer');
const logger = require('../utils/logger');

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT || 587,
      secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD
      }
    });

    // Verify connection configuration
    this.transporter.verify((error, success) => {
      if (error) {
        logger.error('SMTP connection error:', error);
      } else {
        logger.info('✅ SMTP server is ready to send emails');
      }
    });
  }

  /**
   * Send email
   * @param {object} options - Email options
   * @returns {Promise<object>}
   */
  async sendEmail(options) {
    try {
      const mailOptions = {
        from: `${process.env.SMTP_FROM_NAME || 'UmrahConnect'} <${process.env.SMTP_FROM_EMAIL}>`,
        to: options.to,
        subject: options.subject,
        html: options.html,
        text: options.text,
        attachments: options.attachments || []
      };

      const info = await this.transporter.sendMail(mailOptions);
      logger.info(`Email sent to ${options.to}: ${info.messageId}`);
      
      return { 
        success: true, 
        messageId: info.messageId,
        response: info.response 
      };
    } catch (error) {
      logger.error('Email send error:', error);
      throw error;
    }
  }

  /**
   * Send welcome email
   */
  async sendWelcomeEmail(user) {
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #047857 0%, #065f46 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .logo { font-size: 32px; margin-bottom: 10px; }
          .content { background: #ffffff; padding: 30px; border: 1px solid #e5e7eb; }
          .button { display: inline-block; background: #047857; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { background: #f9fafb; padding: 20px; text-align: center; font-size: 14px; color: #6b7280; border-radius: 0 0 10px 10px; }
          .highlight { color: #d4af37; font-weight: bold; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">☪️ UmrahConnect 2.0</div>
            <h1>Welcome to Your Sacred Journey!</h1>
          </div>
          <div class="content">
            <p>Assalamu Alaikum <strong>${user.firstName} ${user.lastName}</strong>,</p>
            
            <p>JazakAllah Khair for joining <span class="highlight">UmrahConnect 2.0</span> - the world's most comprehensive Islamic pilgrimage marketplace!</p>
            
            <p>Your account has been successfully created. You can now:</p>
            <ul>
              <li>🕌 Browse verified Umrah & Hajj packages</li>
              <li>💳 Book with flexible payment options (10% upfront)</li>
              <li>📱 Track your application in real-time</li>
              <li>📄 Manage documents & visa processing</li>
              <li>⭐ Read reviews from fellow pilgrims</li>
            </ul>

            <center>
              <a href="${process.env.APP_URL}/dashboard" class="button">Go to Dashboard</a>
            </center>

            <p><strong>Need Help?</strong></p>
            <p>Our support team is available 24/7:</p>
            <ul>
              <li>📧 Email: support@umrahconnect.com</li>
              <li>📱 WhatsApp: +91 1800-XXX-XXXX</li>
              <li>🌐 Help Center: ${process.env.APP_URL}/help</li>
            </ul>

            <p style="margin-top: 30px;">May Allah accept your journey and grant you a blessed pilgrimage! 🤲</p>
            
            <p><em>Barakallahu Feekum,</em><br>
            <strong>The UmrahConnect Team</strong></p>
          </div>
          <div class="footer">
            <p>© 2024 UmrahConnect 2.0. All rights reserved.</p>
            <p>This email was sent to ${user.email}</p>
          </div>
        </div>
      </body>
      </html>
    `;

    return this.sendEmail({
      to: user.email,
      subject: '🕌 Welcome to UmrahConnect 2.0 - Your Sacred Journey Begins!',
      html
    });
  }

  /**
   * Send booking confirmation email
   */
  async sendBookingConfirmation(booking) {
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #047857 0%, #065f46 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #ffffff; padding: 30px; border: 1px solid #e5e7eb; }
          .booking-card { background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #d4af37; }
          .booking-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #e5e7eb; }
          .label { color: #6b7280; font-weight: 600; }
          .value { color: #1f2937; font-weight: bold; }
          .amount { font-size: 24px; color: #047857; font-weight: bold; }
          .button { display: inline-block; background: #047857; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { background: #f9fafb; padding: 20px; text-align: center; font-size: 14px; color: #6b7280; border-radius: 0 0 10px 10px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>✅ Booking Confirmed!</h1>
            <p>Your journey to the sacred lands is confirmed</p>
          </div>
          <div class="content">
            <p>Assalamu Alaikum <strong>${booking.customerName}</strong>,</p>
            
            <p>Alhamdulillah! Your booking has been confirmed successfully.</p>

            <div class="booking-card">
              <h3 style="margin-top: 0; color: #047857;">📋 Booking Details</h3>
              <div class="booking-row">
                <span class="label">Booking ID:</span>
                <span class="value">${booking.bookingNumber}</span>
              </div>
              <div class="booking-row">
                <span class="label">Package:</span>
                <span class="value">${booking.packageName}</span>
              </div>
              <div class="booking-row">
                <span class="label">Departure Date:</span>
                <span class="value">${booking.departureDate}</span>
              </div>
              <div class="booking-row">
                <span class="label">Duration:</span>
                <span class="value">${booking.duration} Days</span>
              </div>
              <div class="booking-row">
                <span class="label">Travelers:</span>
                <span class="value">${booking.totalTravelers} Person(s)</span>
              </div>
            </div>

            <div class="booking-card">
              <h3 style="margin-top: 0; color: #047857;">💰 Payment Summary</h3>
              <div class="booking-row">
                <span class="label">Total Amount:</span>
                <span class="value">₹${booking.totalAmount.toLocaleString()}</span>
              </div>
              <div class="booking-row">
                <span class="label">Paid Amount:</span>
                <span class="value" style="color: #10b981;">₹${booking.paidAmount.toLocaleString()}</span>
              </div>
              <div class="booking-row" style="border-bottom: none;">
                <span class="label">Pending Amount:</span>
                <span class="amount">₹${booking.pendingAmount.toLocaleString()}</span>
              </div>
            </div>

            <h3>📅 Next Payment Schedule:</h3>
            <ul>
              ${booking.paymentSchedule.map(payment => `
                <li><strong>${payment.date}</strong> - ₹${payment.amount.toLocaleString()} (${payment.type})</li>
              `).join('')}
            </ul>

            <h3>📄 Next Steps:</h3>
            <ol>
              <li>Upload required documents (Passport, Photos, ID Proof)</li>
              <li>Complete KYC verification</li>
              <li>Track your visa processing status</li>
              <li>Make scheduled payments on time</li>
            </ol>

            <center>
              <a href="${process.env.APP_URL}/bookings/${booking.bookingNumber}" class="button">View Booking Details</a>
              <a href="${process.env.APP_URL}/documents/${booking.bookingNumber}" class="button" style="background: #d4af37;">Upload Documents</a>
            </center>

            <p style="margin-top: 30px;"><strong>Need Assistance?</strong></p>
            <p>Contact your dedicated support team:</p>
            <ul>
              <li>📧 Email: ${booking.vendorEmail}</li>
              <li>📱 WhatsApp: ${booking.vendorPhone}</li>
            </ul>

            <p style="margin-top: 30px;">May Allah make your journey easy and accept your pilgrimage! 🤲</p>
          </div>
          <div class="footer">
            <p>© 2024 UmrahConnect 2.0. All rights reserved.</p>
            <p>Booking ID: ${booking.bookingNumber}</p>
          </div>
        </div>
      </body>
      </html>
    `;

    return this.sendEmail({
      to: booking.customerEmail,
      subject: `✅ Booking Confirmed - ${booking.bookingNumber} | UmrahConnect`,
      html
    });
  }

  /**
   * Send payment reminder email
   */
  async sendPaymentReminder(payment) {
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #d4af37 0%, #c19b2e 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #ffffff; padding: 30px; border: 1px solid #e5e7eb; }
          .alert-box { background: #fef3c7; border-left: 4px solid #d4af37; padding: 15px; margin: 20px 0; border-radius: 5px; }
          .amount-box { background: #f9fafb; padding: 20px; text-align: center; border-radius: 8px; margin: 20px 0; }
          .amount { font-size: 36px; color: #047857; font-weight: bold; }
          .button { display: inline-block; background: #047857; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { background: #f9fafb; padding: 20px; text-align: center; font-size: 14px; color: #6b7280; border-radius: 0 0 10px 10px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>💳 Payment Reminder</h1>
            <p>Your next installment is due soon</p>
          </div>
          <div class="content">
            <p>Assalamu Alaikum <strong>${payment.customerName}</strong>,</p>
            
            <div class="alert-box">
              <strong>⏰ Payment Due:</strong> ${payment.dueDate}
            </div>

            <p>This is a friendly reminder that your next payment installment is due.</p>

            <div class="amount-box">
              <p style="margin: 0; color: #6b7280;">Amount Due</p>
              <div class="amount">₹${payment.dueAmount.toLocaleString()}</div>
              <p style="margin: 0; color: #6b7280;">Booking ID: ${payment.bookingNumber}</p>
            </div>

            <h3>📋 Payment Details:</h3>
            <ul>
              <li><strong>Package:</strong> ${payment.packageName}</li>
              <li><strong>Installment:</strong> ${payment.installmentNumber} of ${payment.totalInstallments}</li>
              <li><strong>Due Date:</strong> ${payment.dueDate}</li>
              <li><strong>Grace Period:</strong> 7 days (No late fees)</li>
            </ul>

            <center>
              <a href="${process.env.APP_URL}/payments/${payment.paymentId}" class="button">Pay Now</a>
            </center>

            <h3>💡 Payment Options:</h3>
            <ul>
              <li>💳 Credit/Debit Card</li>
              <li>📱 UPI (Google Pay, PhonePe, Paytm)</li>
              <li>🏦 Net Banking</li>
              <li>💰 Wallet (Paytm, Mobikwik)</li>
            </ul>

            <p><strong>Need to reschedule?</strong> Contact us within 48 hours.</p>

            <p style="margin-top: 30px;">JazakAllah Khair for your timely payment! 🤲</p>
          </div>
          <div class="footer">
            <p>© 2024 UmrahConnect 2.0. All rights reserved.</p>
            <p>Questions? Reply to this email or contact support.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    return this.sendEmail({
      to: payment.customerEmail,
      subject: `💳 Payment Reminder - ₹${payment.dueAmount.toLocaleString()} Due on ${payment.dueDate}`,
      html
    });
  }

  /**
   * Send visa status update email
   */
  async sendVisaStatusUpdate(visa) {
    const stageInfo = {
      'application_prepared': { emoji: '📝', title: 'Application Prepared', color: '#6b7280' },
      'submitted_to_embassy': { emoji: '📤', title: 'Submitted to Embassy', color: '#3b82f6' },
      'biometrics_scheduled': { emoji: '👆', title: 'Biometrics Scheduled', color: '#8b5cf6' },
      'under_processing': { emoji: '⏳', title: 'Under Processing', color: '#f59e0b' },
      'visa_approved': { emoji: '✅', title: 'Visa Approved', color: '#10b981' },
      'visa_rejected': { emoji: '❌', title: 'Visa Rejected', color: '#ef4444' },
      'document_uploaded': { emoji: '📄', title: 'Document Uploaded', color: '#047857' }
    };

    const stage = stageInfo[visa.stage] || stageInfo['under_processing'];

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #047857 0%, #065f46 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #ffffff; padding: 30px; border: 1px solid #e5e7eb; }
          .status-badge { display: inline-block; padding: 10px 20px; background: ${stage.color}; color: white; border-radius: 20px; font-weight: bold; margin: 20px 0; }
          .timeline { margin: 30px 0; }
          .timeline-item { padding: 15px; margin: 10px 0; border-left: 3px solid #e5e7eb; }
          .timeline-item.active { border-left-color: #047857; background: #f0fdf4; }
          .button { display: inline-block; background: #047857; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { background: #f9fafb; padding: 20px; text-align: center; font-size: 14px; color: #6b7280; border-radius: 0 0 10px 10px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>${stage.emoji} Visa Status Update</h1>
            <p>Your visa application progress</p>
          </div>
          <div class="content">
            <p>Assalamu Alaikum <strong>${visa.customerName}</strong>,</p>
            
            <center>
              <div class="status-badge">${stage.title}</div>
            </center>

            <p>${visa.message}</p>

            <div class="timeline">
              <h3>📊 Application Timeline:</h3>
              <div class="timeline-item ${visa.stage === 'application_prepared' ? 'active' : ''}">
                <strong>📝 Application Prepared</strong>
              </div>
              <div class="timeline-item ${visa.stage === 'submitted_to_embassy' ? 'active' : ''}">
                <strong>📤 Submitted to Embassy</strong>
              </div>
              <div class="timeline-item ${visa.stage === 'biometrics_scheduled' ? 'active' : ''}">
                <strong>👆 Biometrics Scheduled</strong>
              </div>
              <div class="timeline-item ${visa.stage === 'under_processing' ? 'active' : ''}">
                <strong>⏳ Under Processing</strong>
              </div>
              <div class="timeline-item ${visa.stage === 'visa_approved' ? 'active' : ''}">
                <strong>✅ Visa Approved</strong>
              </div>
            </div>

            ${visa.stage === 'visa_approved' ? `
              <div style="background: #f0fdf4; padding: 20px; border-radius: 8px; border-left: 4px solid #10b981; margin: 20px 0;">
                <h3 style="margin-top: 0; color: #047857;">🎉 Congratulations!</h3>
                <p>Your visa has been approved! You can now download your visa document.</p>
                <p><strong>Visa Number:</strong> ${visa.visaNumber}</p>
                <p><strong>Valid Until:</strong> ${visa.expiryDate}</p>
              </div>
            ` : ''}

            <center>
              <a href="${process.env.APP_URL}/track/${visa.bookingNumber}" class="button">Track Application</a>
              ${visa.stage === 'visa_approved' ? `
                <a href="${process.env.APP_URL}/documents/${visa.bookingNumber}" class="button" style="background: #d4af37;">Download Visa</a>
              ` : ''}
            </center>

            <p style="margin-top: 30px;">May Allah make your journey easy! 🤲</p>
          </div>
          <div class="footer">
            <p>© 2024 UmrahConnect 2.0. All rights reserved.</p>
            <p>Booking ID: ${visa.bookingNumber}</p>
          </div>
        </div>
      </body>
      </html>
    `;

    return this.sendEmail({
      to: visa.customerEmail,
      subject: `${stage.emoji} Visa Update: ${stage.title} - ${visa.bookingNumber}`,
      html
    });
  }

  /**
   * Send password reset email
   */
  async sendPasswordResetEmail(user, resetToken) {
    const resetUrl = `${process.env.APP_URL}/reset-password?token=${resetToken}`;

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #047857 0%, #065f46 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #ffffff; padding: 30px; border: 1px solid #e5e7eb; }
          .alert-box { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0; border-radius: 5px; }
          .button { display: inline-block; background: #047857; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { background: #f9fafb; padding: 20px; text-align: center; font-size: 14px; color: #6b7280; border-radius: 0 0 10px 10px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔐 Password Reset Request</h1>
          </div>
          <div class="content">
            <p>Assalamu Alaikum <strong>${user.firstName}</strong>,</p>
            
            <p>We received a request to reset your password for your UmrahConnect account.</p>

            <center>
              <a href="${resetUrl}" class="button">Reset Password</a>
            </center>

            <div class="alert-box">
              <strong>⚠️ Security Notice:</strong> This link will expire in 1 hour.
            </div>

            <p><strong>Didn't request this?</strong> You can safely ignore this email. Your password will remain unchanged.</p>

            <p>For security reasons, never share this link with anyone.</p>

            <p style="margin-top: 30px;">JazakAllah Khair,<br>
            <strong>The UmrahConnect Team</strong></p>
          </div>
          <div class="footer">
            <p>© 2024 UmrahConnect 2.0. All rights reserved.</p>
            <p>If the button doesn't work, copy this link: ${resetUrl}</p>
          </div>
        </div>
      </body>
      </html>
    `;

    return this.sendEmail({
      to: user.email,
      subject: '🔐 Password Reset Request - UmrahConnect',
      html
    });
  }

  /**
   * Send email verification
   */
  async sendEmailVerification(user, verificationToken) {
    const verifyUrl = `${process.env.APP_URL}/verify-email?token=${verificationToken}`;

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #047857 0%, #065f46 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #ffffff; padding: 30px; border: 1px solid #e5e7eb; }
          .button { display: inline-block; background: #047857; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { background: #f9fafb; padding: 20px; text-align: center; font-size: 14px; color: #6b7280; border-radius: 0 0 10px 10px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>✉️ Verify Your Email</h1>
          </div>
          <div class="content">
            <p>Assalamu Alaikum <strong>${user.firstName}</strong>,</p>
            
            <p>Thank you for registering with UmrahConnect! Please verify your email address to activate your account.</p>

            <center>
              <a href="${verifyUrl}" class="button">Verify Email Address</a>
            </center>

            <p>This link will expire in 24 hours.</p>

            <p style="margin-top: 30px;">JazakAllah Khair,<br>
            <strong>The UmrahConnect Team</strong></p>
          </div>
          <div class="footer">
            <p>© 2024 UmrahConnect 2.0. All rights reserved.</p>
            <p>If the button doesn't work, copy this link: ${verifyUrl}</p>
          </div>
        </div>
      </body>
      </html>
    `;

    return this.sendEmail({
      to: user.email,
      subject: '✉️ Verify Your Email - UmrahConnect',
      html
    });
  }
}

module.exports = new EmailService();
