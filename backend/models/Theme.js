const mongoose = require('mongoose');

const themeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Theme name is required'],
    unique: true,
    trim: true
  },
  displayName: {
    type: String,
    required: [true, 'Display name is required'],
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  preview: {
    type: String // Preview image URL
  },
  colors: {
    primary: {
      type: String,
      default: '#10b981'
    },
    primaryDark: {
      type: String,
      default: '#059669'
    },
    secondary: {
      type: String,
      default: '#d4af37'
    },
    accent: {
      type: String,
      default: '#fef3c7'
    },
    background: {
      type: String,
      default: '#ffffff'
    },
    text: {
      type: String,
      default: '#1f2937'
    },
    textLight: {
      type: String,
      default: '#6b7280'
    }
  },
  fonts: {
    heading: {
      type: String,
      default: 'Inter, sans-serif'
    },
    body: {
      type: String,
      default: 'Inter, sans-serif'
    }
  },
  layout: {
    headerStyle: {
      type: String,
      enum: ['default', 'centered', 'minimal'],
      default: 'default'
    },
    footerStyle: {
      type: String,
      enum: ['default', 'minimal', 'extended'],
      default: 'default'
    },
    cardStyle: {
      type: String,
      enum: ['rounded', 'sharp', 'elevated'],
      default: 'rounded'
    }
  },
  isActive: {
    type: Boolean,
    default: false
  },
  isDefault: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Ensure only one theme is active at a time
themeSchema.pre('save', async function(next) {
  if (this.isActive) {
    await this.constructor.updateMany(
      { _id: { $ne: this._id } },
      { isActive: false }
    );
  }
  next();
});

module.exports = mongoose.model('Theme', themeSchema);
