const passport = require('passport');
const { generateTokens } = require('../utils/jwt.utils');
const { sendWelcomeEmail } = require('../services/email.service');

/**
 * OAuth Controller
 * Handles Google and Facebook OAuth authentication
 */

/**
 * Google OAuth Callback
 * GET /api/v1/auth/google/callback
 */
const googleCallback = async (req, res) => {
  try {
    const user = req.user;
    
    if (!user) {
      return res.redirect(`${process.env.FRONTEND_URL}/login?error=oauth_failed`);
    }
    
    // Generate tokens
    const tokens = generateTokens(user);
    
    // Save refresh token
    user.refresh_token = tokens.refreshToken;
    await user.save();
    
    // Update last login
    const ip = req.ip || req.connection.remoteAddress;
    await user.updateLastLogin(ip);
    
    // Send welcome email for new users
    if (user.login_count === 1) {
      try {
        await sendWelcomeEmail(user);
      } catch (emailError) {
        console.error('Failed to send welcome email:', emailError);
      }
    }
    
    // Redirect to frontend with tokens
    const redirectUrl = `${process.env.FRONTEND_URL}/auth/callback?token=${tokens.accessToken}&refresh=${tokens.refreshToken}`;
    res.redirect(redirectUrl);
  } catch (error) {
    console.error('Google OAuth callback error:', error);
    res.redirect(`${process.env.FRONTEND_URL}/login?error=oauth_error`);
  }
};

/**
 * Facebook OAuth Callback
 * GET /api/v1/auth/facebook/callback
 */
const facebookCallback = async (req, res) => {
  try {
    const user = req.user;
    
    if (!user) {
      return res.redirect(`${process.env.FRONTEND_URL}/login?error=oauth_failed`);
    }
    
    // Generate tokens
    const tokens = generateTokens(user);
    
    // Save refresh token
    user.refresh_token = tokens.refreshToken;
    await user.save();
    
    // Update last login
    const ip = req.ip || req.connection.remoteAddress;
    await user.updateLastLogin(ip);
    
    // Send welcome email for new users
    if (user.login_count === 1) {
      try {
        await sendWelcomeEmail(user);
      } catch (emailError) {
        console.error('Failed to send welcome email:', emailError);
      }
    }
    
    // Redirect to frontend with tokens
    const redirectUrl = `${process.env.FRONTEND_URL}/auth/callback?token=${tokens.accessToken}&refresh=${tokens.refreshToken}`;
    res.redirect(redirectUrl);
  } catch (error) {
    console.error('Facebook OAuth callback error:', error);
    res.redirect(`${process.env.FRONTEND_URL}/login?error=oauth_error`);
  }
};

module.exports = {
  googleCallback,
  facebookCallback,
};
