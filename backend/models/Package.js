const mongoose = require('mongoose');

const packageSchema = new mongoose.Schema({
  // Basic Information
  title: {
    type: String,
    required: [true, 'Package title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Package description is required'],
    trim: true
  },
  shortDescription: {
    type: String,
    trim: true,
    maxlength: [300, 'Short description cannot exceed 300 characters']
  },

  // Package Type
  type: {
    type: String,
    required: [true, 'Package type is required'],
    enum: ['umrah', 'hajj', 'ziyarat', 'combo'],
    lowercase: true
  },
  category: {
    type: String,
    enum: ['economy', 'standard', 'premium', 'luxury'],
    default: 'standard'
  },

  // Pricing
  price: {
    type: Number,
    required: [true, 'Package price is required'],
    min: [0, 'Price cannot be negative']
  },
  originalPrice: {
    type: Number,
    min: [0, 'Original price cannot be negative']
  },
  discount: {
    type: Number,
    default: 0,
    min: [0, 'Discount cannot be negative'],
    max: [100, 'Discount cannot exceed 100%']
  },
  currency: {
    type: String,
    default: 'INR'
  },

  // Duration
  duration: {
    days: {
      type: Number,
      required: [true, 'Duration in days is required'],
      min: [1, 'Duration must be at least 1 day']
    },
    nights: {
      type: Number,
      required: [true, 'Duration in nights is required'],
      min: [0, 'Nights cannot be negative']
    }
  },

  // Images
  images: [{
    url: {
      type: String,
      required: true
    },
    alt: String,
    isPrimary: {
      type: Boolean,
      default: false
    }
  }],
  thumbnail: {
    type: String
  },

  // Itinerary
  itinerary: [{
    day: {
      type: Number,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    activities: [String],
    meals: {
      breakfast: Boolean,
      lunch: Boolean,
      dinner: Boolean
    },
    accommodation: String
  }],

  // Inclusions & Exclusions
  inclusions: [{
    type: String,
    trim: true
  }],
  exclusions: [{
    type: String,
    trim: true
  }],

  // Accommodation
  accommodation: {
    makkah: {
      hotelName: String,
      hotelRating: {
        type: Number,
        min: 1,
        max: 5
      },
      distanceFromHaram: String,
      roomType: String,
      nights: Number
    },
    madinah: {
      hotelName: String,
      hotelRating: {
        type: Number,
        min: 1,
        max: 5
      },
      distanceFromMasjid: String,
      roomType: String,
      nights: Number
    }
  },

  // Transportation
  transportation: {
    flight: {
      included: {
        type: Boolean,
        default: false
      },
      airline: String,
      class: {
        type: String,
        enum: ['economy', 'business', 'first'],
        default: 'economy'
      },
      departure: String,
      return: String
    },
    groundTransport: {
      type: String,
      enum: ['bus', 'private_car', 'shared_car', 'none'],
      default: 'bus'
    }
  },

  // Visa
  visa: {
    included: {
      type: Boolean,
      default: false
    },
    type: String,
    processingTime: String
  },

  // Availability
  availability: {
    startDate: {
      type: Date,
      required: [true, 'Start date is required']
    },
    endDate: {
      type: Date,
      required: [true, 'End date is required']
    },
    totalSeats: {
      type: Number,
      required: [true, 'Total seats is required'],
      min: [1, 'Total seats must be at least 1']
    },
    availableSeats: {
      type: Number,
      required: true
    },
    bookingDeadline: Date
  },

  // Vendor Information
  vendor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Vendor is required']
  },
  vendorName: {
    type: String,
    required: true
  },
  vendorContact: {
    phone: String,
    email: String,
    whatsapp: String
  },

  // Features & Highlights
  features: [{
    type: String,
    trim: true
  }],
  highlights: [{
    type: String,
    trim: true
  }],

  // Terms & Conditions
  terms: [{
    type: String,
    trim: true
  }],
  cancellationPolicy: {
    type: String,
    trim: true
  },

  // SEO
  seo: {
    metaTitle: String,
    metaDescription: String,
    keywords: [String]
  },

  // Status & Visibility
  status: {
    type: String,
    enum: ['draft', 'pending', 'approved', 'rejected', 'archived'],
    default: 'draft'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  isPopular: {
    type: Boolean,
    default: false
  },
  featuredOrder: {
    type: Number,
    default: 0
  },

  // Statistics
  views: {
    type: Number,
    default: 0
  },
  bookings: {
    type: Number,
    default: 0
  },
  rating: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    count: {
      type: Number,
      default: 0
    }
  },

  // Admin Notes
  adminNotes: {
    type: String,
    trim: true
  },
  rejectionReason: {
    type: String,
    trim: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
packageSchema.index({ title: 'text', description: 'text' });
packageSchema.index({ type: 1, status: 1, isActive: 1 });
packageSchema.index({ isFeatured: 1, featuredOrder: 1 });
packageSchema.index({ isPopular: 1 });
packageSchema.index({ vendor: 1 });
packageSchema.index({ 'availability.startDate': 1, 'availability.endDate': 1 });
packageSchema.index({ price: 1 });
packageSchema.index({ createdAt: -1 });

// Generate slug from title before saving
packageSchema.pre('save', function(next) {
  if (this.isModified('title') && !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }
  
  // Set available seats equal to total seats on creation
  if (this.isNew && !this.availability.availableSeats) {
    this.availability.availableSeats = this.availability.totalSeats;
  }
  
  // Calculate discount if original price is provided
  if (this.originalPrice && this.price) {
    this.discount = Math.round(((this.originalPrice - this.price) / this.originalPrice) * 100);
  }
  
  next();
});

// Virtual for primary image
packageSchema.virtual('primaryImage').get(function() {
  const primary = this.images.find(img => img.isPrimary);
  return primary ? primary.url : (this.images[0] ? this.images[0].url : null);
});

// Virtual for availability status
packageSchema.virtual('availabilityStatus').get(function() {
  const now = new Date();
  if (now > this.availability.endDate) return 'expired';
  if (this.availability.availableSeats === 0) return 'sold_out';
  if (this.availability.availableSeats < 5) return 'limited';
  return 'available';
});

// Virtual for discount amount
packageSchema.virtual('discountAmount').get(function() {
  if (this.originalPrice && this.price) {
    return this.originalPrice - this.price;
  }
  return 0;
});

// Method to check if package is bookable
packageSchema.methods.isBookable = function() {
  const now = new Date();
  return (
    this.status === 'approved' &&
    this.isActive &&
    this.availability.availableSeats > 0 &&
    now >= this.availability.startDate &&
    now <= this.availability.endDate &&
    (!this.availability.bookingDeadline || now <= this.availability.bookingDeadline)
  );
};

// Method to update rating
packageSchema.methods.updateRating = async function(newRating) {
  const totalRating = (this.rating.average * this.rating.count) + newRating;
  this.rating.count += 1;
  this.rating.average = totalRating / this.rating.count;
  await this.save();
};

// Static method to get featured packages
packageSchema.statics.getFeaturedPackages = function(limit = 6) {
  return this.find({
    isFeatured: true,
    status: 'approved',
    isActive: true
  })
    .sort({ featuredOrder: 1, createdAt: -1 })
    .limit(limit)
    .populate('vendor', 'name email phone');
};

// Static method to get popular packages
packageSchema.statics.getPopularPackages = function(limit = 6) {
  return this.find({
    isPopular: true,
    status: 'approved',
    isActive: true
  })
    .sort({ bookings: -1, rating.average: -1 })
    .limit(limit)
    .populate('vendor', 'name email phone');
};

module.exports = mongoose.model('Package', packageSchema);
