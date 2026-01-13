const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const { ExtractJwt } = require('passport-jwt');
const User = require('../models/User.model');
require('dotenv').config();

/**
 * Passport Configuration
 * OAuth strategies for Google, Facebook, and JWT
 */

/**
 * JWT Strategy
 * For protecting routes with JWT tokens
 */
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
  issuer: 'umrahconnect',
  audience: 'umrahconnect-users',
};

passport.use(
  new JwtStrategy(jwtOptions, async (payload, done) => {
    try {
      const user = await User.findByPk(payload.id);
      
      if (!user) {
        return done(null, false);
      }
      
      if (!user.canLogin()) {
        return done(null, false);
      }
      
      return done(null, user);
    } catch (error) {
      return done(error, false);
    }
  })
);

/**
 * Google OAuth Strategy
 * For Google Sign-In
 */
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL,
        scope: ['profile', 'email'],
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          // Check if user exists with Google ID
          let user = await User.findByGoogleId(profile.id);
          
          if (user) {
            // Update last login
            const ip = '0.0.0.0'; // Will be updated from request
            await user.updateLastLogin(ip);
            return done(null, user);
          }
          
          // Check if user exists with same email
          const email = profile.emails && profile.emails[0] ? profile.emails[0].value : null;
          
          if (email) {
            user = await User.findByEmail(email);
            
            if (user) {
              // Link Google account to existing user
              user.google_id = profile.id;
              user.oauth_provider = 'google';
              user.is_email_verified = true; // Google emails are verified
              
              if (!user.avatar_url && profile.photos && profile.photos[0]) {
                user.avatar_url = profile.photos[0].value;
              }
              
              await user.save();
              return done(null, user);
            }
          }
          
          // Create new user
          const newUser = await User.create({
            full_name: profile.displayName || 'Google User',
            email: email,
            google_id: profile.id,
            oauth_provider: 'google',
            is_email_verified: true,
            is_active: true,
            avatar_url: profile.photos && profile.photos[0] ? profile.photos[0].value : null,
            user_type: 'pilgrim',
            agree_to_terms: true, // Assumed for OAuth
          });
          
          return done(null, newUser);
        } catch (error) {
          console.error('Google OAuth error:', error);
          return done(error, false);
        }
      }
    )
  );
}

/**
 * Facebook OAuth Strategy
 * For Facebook Login
 */
if (process.env.FACEBOOK_APP_ID && process.env.FACEBOOK_APP_SECRET) {
  passport.use(
    new FacebookStrategy(
      {
        clientID: process.env.FACEBOOK_APP_ID,
        clientSecret: process.env.FACEBOOK_APP_SECRET,
        callbackURL: process.env.FACEBOOK_CALLBACK_URL,
        profileFields: ['id', 'displayName', 'emails', 'photos'],
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          // Check if user exists with Facebook ID
          let user = await User.findByFacebookId(profile.id);
          
          if (user) {
            // Update last login
            const ip = '0.0.0.0'; // Will be updated from request
            await user.updateLastLogin(ip);
            return done(null, user);
          }
          
          // Check if user exists with same email
          const email = profile.emails && profile.emails[0] ? profile.emails[0].value : null;
          
          if (email) {
            user = await User.findByEmail(email);
            
            if (user) {
              // Link Facebook account to existing user
              user.facebook_id = profile.id;
              user.oauth_provider = 'facebook';
              user.is_email_verified = true; // Facebook emails are verified
              
              if (!user.avatar_url && profile.photos && profile.photos[0]) {
                user.avatar_url = profile.photos[0].value;
              }
              
              await user.save();
              return done(null, user);
            }
          }
          
          // Create new user
          const newUser = await User.create({
            full_name: profile.displayName || 'Facebook User',
            email: email,
            facebook_id: profile.id,
            oauth_provider: 'facebook',
            is_email_verified: true,
            is_active: true,
            avatar_url: profile.photos && profile.photos[0] ? profile.photos[0].value : null,
            user_type: 'pilgrim',
            agree_to_terms: true, // Assumed for OAuth
          });
          
          return done(null, newUser);
        } catch (error) {
          console.error('Facebook OAuth error:', error);
          return done(error, false);
        }
      }
    )
  );
}

/**
 * Serialize User
 * Store user ID in session
 */
passport.serializeUser((user, done) => {
  done(null, user.id);
});

/**
 * Deserialize User
 * Retrieve user from session
 */
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findByPk(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

module.exports = passport;
