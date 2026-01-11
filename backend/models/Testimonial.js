const mongoose = require('mongoose');

const testimonialSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  designation: {
    type: String,
    trim: true
  },
  location: {
    type: String,
    trim: true
  },
  image: {
    type: String
  },
  rating: {
    type: Number,
    required: [true, 'Rating is required'],
    min: 1,
    max: 5,
    default: 5
  },
  testimonial: {
    type: String,
    required: [true, 'Testimonial text is required'],
    trim: true,
    maxlength: [1000, 'Testimonial cannot exceed 1000 characters']
  },
  packageId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Package'
  },
  packageName: {
    type: String
  },
  travelDate: {
    type: Date
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  order: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Index for sorting
testimonialSchema.index({ order: 1, createdAt: -1 });
testimonialSchema.index({ isFeatured: 1, isActive: 1 });

module.exports = mongoose.model('Testimonial', testimonialSchema);
