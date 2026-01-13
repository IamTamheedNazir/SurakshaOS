const User = require('../models/User.model');
const { generateTokens } = require('../utils/jwt.utils');
const { 
  sendWelcomeEmail, 
  sendEmailVerification, 
  sendPasswordResetEmail,
  generateVerificationToken,
} = require('../services/email.service');
const crypto = require('crypto');

/**
 * Auth Controller
 * Handles all authentication operations
 */

/**
 * Register New User
 * POST /api/v1/auth/register
 */
const register = async (req, res) => {
  try {
    const {
      full_name,
      email,
      phone,
      password,
      city,
      state,
      country,
      user_type,
      agree_to_terms,
      agree_to_marketing,
    } = req.body;

    // Validation
    if (!full_name || !email || !phone || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields',
      });
    }

    if (!agree_to_terms) {
      return res.status(400).json({
        success: false,
        message: 'You must agree to terms and conditions',
      });
    }

    // Check if user already exists
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'User with this email already exists',
      });
    }

    // Generate email verification token
    const verificationToken = generateVerificationToken();
    const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Create user
    const user = await User.create({
      full_name,
      email,
      phone,
      password,
      city,
      state,
      country: country || 'India',
      user_type: user_type || 'pilgrim',
      agree_to_terms,
      agree_to_marketing: agree_to_marketing || false,
      email_verification_token: verificationToken,
      email_verification_expires: verificationExpires,
      oauth_provider: 'local',
    });

    // Generate tokens
    const tokens = generateTokens(user);

    // Save refresh token
    user.refresh_token = tokens.refreshToken;
    await user.save();

    // Send verification email
    if (process.env.ENABLE_EMAIL_VERIFICATION === 'true') {
      try {
        await sendEmailVerification(user, verificationToken);
      } catch (emailError) {
        console.error('Failed to send verification email:', emailError);
      }
    }

    // Send welcome email
    try {
      await sendWelcomeEmail(user);
    } catch (emailError) {
      console.error('Failed to send welcome email:', emailError);
    }

    res.status(201).json({
      success: true,
      message: 'Registration successful. Please check your email to verify your account.',
      data: {
        user: user.getPublicProfile(),
        token: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        expiresIn: tokens.expiresIn,
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Registration failed',
      error: error.message,
    });
  }
};

/**
 * Login User
 * POST /api/v1/auth/login
 */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password',
      });
    }

    // Find user
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // Check if user can login
    if (!user.is_active) {
      return res.status(403).json({
        success: false,
        message: 'Your account is inactive. Please contact support.',
      });
    }

    if (user.is_blocked) {
      return res.status(403).json({
        success: false,
        message: `Your account has been blocked. Reason: ${user.blocked_reason || 'Contact support for details'}`,
      });
    }

    // Generate tokens
    const tokens = generateTokens(user);

    // Save refresh token
    user.refresh_token = tokens.refreshToken;
    await user.save();

    // Update last login
    const ip = req.ip || req.connection.remoteAddress;
    await user.updateLastLogin(ip);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        user: user.getPublicProfile(),
        token: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        expiresIn: tokens.expiresIn,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Login failed',
      error: error.message,
    });
  }
};

/**
 * Verify JWT Token
 * GET /api/v1/auth/verify
 */
const verifyToken = async (req, res) => {
  try {
    // User is already attached by auth middleware
    res.status(200).json({
      success: true,
      message: 'Token is valid',
      data: {
        user: req.user.getPublicProfile(),
      },
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Invalid token',
      error: error.message,
    });
  }
};

/**
 * Logout User
 * POST /api/v1/auth/logout
 */
const logout = async (req, res) => {
  try {
    // Clear refresh token
    req.user.refresh_token = null;
    await req.user.save();

    res.status(200).json({
      success: true,
      message: 'Logout successful',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Logout failed',
      error: error.message,
    });
  }
};

/**
 * Forgot Password
 * POST /api/v1/auth/forgot-password
 */
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email address',
      });
    }

    // Find user
    const user = await User.findByEmail(email);
    if (!user) {
      // Don't reveal if user exists
      return res.status(200).json({
        success: true,
        message: 'If an account exists with this email, you will receive a password reset link.',
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    // Save token
    user.password_reset_token = resetToken;
    user.password_reset_expires = resetExpires;
    await user.save();

    // Send reset email
    try {
      await sendPasswordResetEmail(user, resetToken);
    } catch (emailError) {
      console.error('Failed to send password reset email:', emailError);
      return res.status(500).json({
        success: false,
        message: 'Failed to send password reset email',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Password reset link sent to your email',
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process request',
      error: error.message,
    });
  }
};

/**
 * Verify Reset Token
 * GET /api/v1/auth/verify-reset-token
 */
const verifyResetToken = async (req, res) => {
  try {
    const { token } = req.query;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'Token is required',
      });
    }

    // Find user with valid token
    const user = await User.findOne({
      where: {
        password_reset_token: token,
      },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired reset token',
      });
    }

    // Check if token is expired
    if (new Date() > user.password_reset_expires) {
      return res.status(400).json({
        success: false,
        message: 'Reset token has expired',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Token is valid',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to verify token',
      error: error.message,
    });
  }
};

/**
 * Reset Password
 * POST /api/v1/auth/reset-password
 */
const resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      return res.status(400).json({
        success: false,
        message: 'Token and new password are required',
      });
    }

    // Find user with valid token
    const user = await User.findOne({
      where: {
        password_reset_token: token,
      },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired reset token',
      });
    }

    // Check if token is expired
    if (new Date() > user.password_reset_expires) {
      return res.status(400).json({
        success: false,
        message: 'Reset token has expired',
      });
    }

    // Update password
    user.password = password;
    user.password_reset_token = null;
    user.password_reset_expires = null;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password reset successful. You can now login with your new password.',
    });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to reset password',
      error: error.message,
    });
  }
};

/**
 * Verify Email
 * GET /api/v1/auth/verify-email
 */
const verifyEmail = async (req, res) => {
  try {
    const { token } = req.query;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'Verification token is required',
      });
    }

    // Find user with valid token
    const user = await User.findOne({
      where: {
        email_verification_token: token,
      },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired verification token',
      });
    }

    // Check if token is expired
    if (new Date() > user.email_verification_expires) {
      return res.status(400).json({
        success: false,
        message: 'Verification token has expired',
      });
    }

    // Verify email
    user.is_email_verified = true;
    user.email_verification_token = null;
    user.email_verification_expires = null;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Email verified successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to verify email',
      error: error.message,
    });
  }
};

/**
 * Resend Verification Email
 * POST /api/v1/auth/resend-verification
 */
const resendVerification = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required',
      });
    }

    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    if (user.is_email_verified) {
      return res.status(400).json({
        success: false,
        message: 'Email is already verified',
      });
    }

    // Generate new token
    const verificationToken = generateVerificationToken();
    const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

    user.email_verification_token = verificationToken;
    user.email_verification_expires = verificationExpires;
    await user.save();

    // Send verification email
    await sendEmailVerification(user, verificationToken);

    res.status(200).json({
      success: true,
      message: 'Verification email sent',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to resend verification email',
      error: error.message,
    });
  }
};

module.exports = {
  register,
  login,
  verifyToken,
  logout,
  forgotPassword,
  verifyResetToken,
  resetPassword,
  verifyEmail,
  resendVerification,
};
