const mongoose = require('mongoose');

const bannerSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Banner title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  subtitle: {
    type: String,
    trim: true,
    maxlength: [200, 'Subtitle cannot exceed 200 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  image: {
    type: String,
    required: [true, 'Banner image is required']
  },
  mobileImage: {
    type: String // Optional separate image for mobile
  },
  buttonText: {
    type: String,
    trim: true,
    maxlength: [50, 'Button text cannot exceed 50 characters']
  },
  buttonLink: {
    type: String,
    trim: true
  },
  order: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  startDate: {
    type: Date
  },
  endDate: {
    type: Date
  },
  targetAudience: {
    type: String,
    enum: ['all', 'new_users', 'returning_users'],
    default: 'all'
  },
  backgroundColor: {
    type: String,
    default: '#10b981'
  },
  textColor: {
    type: String,
    default: '#ffffff'
  }
}, {
  timestamps: true
});

// Index for sorting
bannerSchema.index({ order: 1, createdAt: -1 });

// Method to check if banner is currently active
bannerSchema.methods.isCurrentlyActive = function() {
  if (!this.isActive) return false;
  
  const now = new Date();
  if (this.startDate && now < this.startDate) return false;
  if (this.endDate && now > this.endDate) return false;
  
  return true;
};

module.exports = mongoose.model('Banner', bannerSchema);
