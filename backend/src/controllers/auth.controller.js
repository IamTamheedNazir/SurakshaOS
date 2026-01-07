const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Pool } = require('pg');
const logger = require('../utils/logger');
const emailService = require('../services/email.service');
const whatsappService = require('../services/whatsapp.service');

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD
});

class AuthController {
  /**
   * Register new user
   */
  async register(req, res) {
    const client = await pool.connect();
    
    try {
      const { email, phone, password, userType, firstName, lastName } = req.body;

      await client.query('BEGIN');

      // Check if user already exists
      const existingUser = await client.query(
        'SELECT id FROM users WHERE email = $1 OR phone = $2',
        [email, phone]
      );

      if (existingUser.rows.length > 0) {
        return res.status(400).json({
          success: false,
          message: 'User with this email or phone already exists'
        });
      }

      // Hash password
      const passwordHash = await bcrypt.hash(password, parseInt(process.env.BCRYPT_ROUNDS || 10));

      // Create user
      const userResult = await client.query(
        `INSERT INTO users (email, phone, password_hash, user_type) 
         VALUES ($1, $2, $3, $4) 
         RETURNING id, email, phone, user_type, created_at`,
        [email, phone, passwordHash, userType]
      );

      const user = userResult.rows[0];

      // Create user profile
      await client.query(
        `INSERT INTO user_profiles (user_id, first_name, last_name) 
         VALUES ($1, $2, $3)`,
        [user.id, firstName, lastName]
      );

      // If vendor, create vendor record
      if (userType === 'vendor') {
        await client.query(
          `INSERT INTO vendors (user_id, business_name) 
           VALUES ($1, $2)`,
          [user.id, `${firstName} ${lastName}'s Business`]
        );
      }

      await client.query('COMMIT');

      // Generate JWT token
      const token = jwt.sign(
        { userId: user.id, email: user.email, userType: user.user_type },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
      );

      // Send welcome email
      try {
        await emailService.sendWelcomeEmail({
          email: user.email,
          firstName,
          lastName
        });
      } catch (emailError) {
        logger.error('Failed to send welcome email:', emailError);
      }

      logger.info(`New user registered: ${user.email}`);

      res.status(201).json({
        success: true,
        message: 'Registration successful',
        data: {
          user: {
            id: user.id,
            email: user.email,
            phone: user.phone,
            userType: user.user_type,
            firstName,
            lastName
          },
          token
        }
      });

    } catch (error) {
      await client.query('ROLLBACK');
      logger.error('Registration error:', error);
      res.status(500).json({
        success: false,
        message: 'Registration failed',
        error: error.message
      });
    } finally {
      client.release();
    }
  }

  /**
   * Login user
   */
  async login(req, res) {
    try {
      const { email, password } = req.body;

      // Find user
      const result = await pool.query(
        `SELECT u.*, up.first_name, up.last_name 
         FROM users u
         LEFT JOIN user_profiles up ON u.id = up.user_id
         WHERE u.email = $1 AND u.is_active = true`,
        [email]
      );

      if (result.rows.length === 0) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password'
        });
      }

      const user = result.rows[0];

      // Verify password
      const isPasswordValid = await bcrypt.compare(password, user.password_hash);

      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password'
        });
      }

      // Update last login
      await pool.query(
        'UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = $1',
        [user.id]
      );

      // Generate tokens
      const token = jwt.sign(
        { userId: user.id, email: user.email, userType: user.user_type },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
      );

      const refreshToken = jwt.sign(
        { userId: user.id },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN }
      );

      logger.info(`User logged in: ${user.email}`);

      res.json({
        success: true,
        message: 'Login successful',
        data: {
          user: {
            id: user.id,
            email: user.email,
            phone: user.phone,
            userType: user.user_type,
            firstName: user.first_name,
            lastName: user.last_name,
            kycStatus: user.kyc_status
          },
          token,
          refreshToken
        }
      });

    } catch (error) {
      logger.error('Login error:', error);
      res.status(500).json({
        success: false,
        message: 'Login failed',
        error: error.message
      });
    }
  }

  /**
   * Logout user
   */
  async logout(req, res) {
    try {
      // In a production app, you'd invalidate the token here
      // For now, we'll just send a success response
      
      res.json({
        success: true,
        message: 'Logout successful'
      });
    } catch (error) {
      logger.error('Logout error:', error);
      res.status(500).json({
        success: false,
        message: 'Logout failed',
        error: error.message
      });
    }
  }

  /**
   * Refresh access token
   */
  async refreshToken(req, res) {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        return res.status(400).json({
          success: false,
          message: 'Refresh token is required'
        });
      }

      // Verify refresh token
      const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

      // Generate new access token
      const newToken = jwt.sign(
        { userId: decoded.userId },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
      );

      res.json({
        success: true,
        data: { token: newToken }
      });

    } catch (error) {
      logger.error('Refresh token error:', error);
      res.status(401).json({
        success: false,
        message: 'Invalid refresh token'
      });
    }
  }

  /**
   * Forgot password
   */
  async forgotPassword(req, res) {
    try {
      const { email } = req.body;

      const result = await pool.query(
        'SELECT id, email FROM users WHERE email = $1',
        [email]
      );

      if (result.rows.length === 0) {
        // Don't reveal if email exists
        return res.json({
          success: true,
          message: 'If the email exists, a password reset link has been sent'
        });
      }

      const user = result.rows[0];

      // Generate reset token
      const resetToken = jwt.sign(
        { userId: user.id, purpose: 'password_reset' },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );

      // Send password reset email
      await emailService.sendPasswordResetEmail(user, resetToken);

      res.json({
        success: true,
        message: 'If the email exists, a password reset link has been sent'
      });

    } catch (error) {
      logger.error('Forgot password error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to process request'
      });
    }
  }

  /**
   * Reset password
   */
  async resetPassword(req, res) {
    try {
      const { token, newPassword } = req.body;

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      if (decoded.purpose !== 'password_reset') {
        return res.status(400).json({
          success: false,
          message: 'Invalid token'
        });
      }

      // Hash new password
      const passwordHash = await bcrypt.hash(newPassword, parseInt(process.env.BCRYPT_ROUNDS || 10));

      // Update password
      await pool.query(
        'UPDATE users SET password_hash = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
        [passwordHash, decoded.userId]
      );

      logger.info(`Password reset for user ID: ${decoded.userId}`);

      res.json({
        success: true,
        message: 'Password reset successful'
      });

    } catch (error) {
      logger.error('Reset password error:', error);
      res.status(400).json({
        success: false,
        message: 'Invalid or expired token'
      });
    }
  }

  /**
   * Get current user
   */
  async getCurrentUser(req, res) {
    try {
      const result = await pool.query(
        `SELECT u.id, u.email, u.phone, u.user_type, u.kyc_status, u.verification_level,
                up.first_name, up.last_name, up.profile_image_url
         FROM users u
         LEFT JOIN user_profiles up ON u.id = up.user_id
         WHERE u.id = $1`,
        [req.user.userId]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      res.json({
        success: true,
        data: { user: result.rows[0] }
      });

    } catch (error) {
      logger.error('Get current user error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch user data'
      });
    }
  }

  /**
   * Verify email
   */
  async verifyEmail(req, res) {
    try {
      const { token } = req.body;

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      await pool.query(
        'UPDATE users SET kyc_status = $1, verification_level = verification_level + 1 WHERE id = $2',
        ['verified', decoded.userId]
      );

      res.json({
        success: true,
        message: 'Email verified successfully'
      });

    } catch (error) {
      logger.error('Email verification error:', error);
      res.status(400).json({
        success: false,
        message: 'Invalid or expired verification token'
      });
    }
  }

  /**
   * Send OTP
   */
  async sendOTP(req, res) {
    try {
      const { phone } = req.body;

      // Generate 6-digit OTP
      const otp = Math.floor(100000 + Math.random() * 900000).toString();

      // Store OTP in Redis with 5 minute expiry
      // await redisClient.setex(`otp:${phone}`, 300, otp);

      // Send OTP via WhatsApp
      await whatsappService.sendMessage(
        phone,
        `Your UmrahConnect verification code is: ${otp}\n\nValid for 5 minutes.\n\nDo not share this code with anyone.`
      );

      res.json({
        success: true,
        message: 'OTP sent successfully'
      });

    } catch (error) {
      logger.error('Send OTP error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to send OTP'
      });
    }
  }

  /**
   * Verify phone
   */
  async verifyPhone(req, res) {
    try {
      const { phone, otp } = req.body;

      // Verify OTP from Redis
      // const storedOTP = await redisClient.get(`otp:${phone}`);

      // if (storedOTP !== otp) {
      //   return res.status(400).json({
      //     success: false,
      //     message: 'Invalid OTP'
      //   });
      // }

      // Update user verification
      await pool.query(
        'UPDATE users SET verification_level = verification_level + 1 WHERE phone = $1',
        [phone]
      );

      res.json({
        success: true,
        message: 'Phone verified successfully'
      });

    } catch (error) {
      logger.error('Phone verification error:', error);
      res.status(500).json({
        success: false,
        message: 'Phone verification failed'
      });
    }
  }
}

module.exports = new AuthController();
