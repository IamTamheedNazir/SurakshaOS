const { DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');
const { sequelize } = require('../config/database.config');

/**
 * User Model
 * Stores user authentication and profile information
 */
const User = sequelize.define('users', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  
  // Basic Information
  full_name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [2, 100],
    },
  },
  
  email: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
      notEmpty: true,
    },
    set(value) {
      this.setDataValue('email', value.toLowerCase().trim());
    },
  },
  
  phone: {
    type: DataTypes.STRING(20),
    allowNull: false,
    validate: {
      notEmpty: true,
      is: /^[0-9+\-\s()]+$/,
    },
  },
  
  // Authentication
  password: {
    type: DataTypes.STRING(255),
    allowNull: true, // Nullable for OAuth users
  },
  
  // User Type
  user_type: {
    type: DataTypes.ENUM('pilgrim', 'vendor', 'admin'),
    defaultValue: 'pilgrim',
    allowNull: false,
  },
  
  // Location
  city: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  
  state: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  
  country: {
    type: DataTypes.STRING(100),
    defaultValue: 'India',
  },
  
  // Profile
  avatar_url: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  
  bio: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  
  // Verification
  is_email_verified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  
  is_phone_verified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  
  email_verification_token: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  
  email_verification_expires: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  
  // Password Reset
  password_reset_token: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  
  password_reset_expires: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  
  // OAuth
  google_id: {
    type: DataTypes.STRING(255),
    allowNull: true,
    unique: true,
  },
  
  facebook_id: {
    type: DataTypes.STRING(255),
    allowNull: true,
    unique: true,
  },
  
  oauth_provider: {
    type: DataTypes.ENUM('local', 'google', 'facebook'),
    defaultValue: 'local',
  },
  
  // Account Status
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  
  is_blocked: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  
  blocked_reason: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  
  blocked_at: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  
  // Preferences
  agree_to_terms: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  
  agree_to_marketing: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  
  // Login Tracking
  last_login_at: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  
  last_login_ip: {
    type: DataTypes.STRING(45),
    allowNull: true,
  },
  
  login_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  
  // Refresh Token
  refresh_token: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  
  // Timestamps (automatically managed by Sequelize)
  created_at: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  
  updated_at: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  
  deleted_at: {
    type: DataTypes.DATE,
    allowNull: true,
  },
}, {
  paranoid: true, // Soft delete
  indexes: [
    { fields: ['email'] },
    { fields: ['phone'] },
    { fields: ['user_type'] },
    { fields: ['google_id'] },
    { fields: ['facebook_id'] },
    { fields: ['is_active'] },
    { fields: ['created_at'] },
  ],
});

/**
 * Hash password before saving
 */
User.beforeSave(async (user) => {
  if (user.changed('password') && user.password) {
    const salt = await bcrypt.genSalt(parseInt(process.env.BCRYPT_SALT_ROUNDS) || 10);
    user.password = await bcrypt.hash(user.password, salt);
  }
});

/**
 * Instance Methods
 */

// Compare password
User.prototype.comparePassword = async function(candidatePassword) {
  if (!this.password) return false;
  return await bcrypt.compare(candidatePassword, this.password);
};

// Get public profile (exclude sensitive data)
User.prototype.getPublicProfile = function() {
  const { 
    password, 
    password_reset_token, 
    password_reset_expires,
    email_verification_token,
    email_verification_expires,
    refresh_token,
    deleted_at,
    ...publicData 
  } = this.toJSON();
  
  return publicData;
};

// Check if user can login
User.prototype.canLogin = function() {
  return this.is_active && !this.is_blocked && this.is_email_verified;
};

// Update last login
User.prototype.updateLastLogin = async function(ip) {
  this.last_login_at = new Date();
  this.last_login_ip = ip;
  this.login_count += 1;
  await this.save();
};

/**
 * Class Methods
 */

// Find by email
User.findByEmail = async function(email) {
  return await this.findOne({ 
    where: { email: email.toLowerCase().trim() } 
  });
};

// Find by OAuth ID
User.findByGoogleId = async function(googleId) {
  return await this.findOne({ where: { google_id: googleId } });
};

User.findByFacebookId = async function(facebookId) {
  return await this.findOne({ where: { facebook_id: facebookId } });
};

// Find active users
User.findActiveUsers = async function(limit = 100, offset = 0) {
  return await this.findAll({
    where: { 
      is_active: true,
      is_blocked: false,
    },
    limit,
    offset,
    order: [['created_at', 'DESC']],
  });
};

module.exports = User;
