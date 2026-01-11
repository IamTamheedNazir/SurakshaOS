const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  // User & Package
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User is required']
  },
  package: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Package',
    required: [true, 'Package is required']
  },
  booking: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking',
    required: [true, 'Booking is required']
  },
  vendor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Vendor is required']
  },

  // Rating (1-5 stars)
  rating: {
    overall: {
      type: Number,
      required: [true, 'Overall rating is required'],
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating cannot exceed 5']
    },
    accommodation: {
      type: Number,
      min: 1,
      max: 5
    },
    transportation: {
      type: Number,
      min: 1,
      max: 5
    },
    food: {
      type: Number,
      min: 1,
      max: 5
    },
    guide: {
      type: Number,
      min: 1,
      max: 5
    },
    valueForMoney: {
      type: Number,
      min: 1,
      max: 5
    }
  },

  // Review Content
  title: {
    type: String,
    required: [true, 'Review title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  comment: {
    type: String,
    required: [true, 'Review comment is required'],
    trim: true,
    maxlength: [1000, 'Comment cannot exceed 1000 characters']
  },

  // Media
  images: [{
    url: String,
    caption: String
  }],

  // Verification
  isVerified: {
    type: Boolean,
    default: false
  },
  verifiedPurchase: {
    type: Boolean,
    default: true
  },

  // Status
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  isActive: {
    type: Boolean,
    default: true
  },

  // Moderation
  moderatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  moderatedAt: Date,
  rejectionReason: String,

  // Helpful votes
  helpful: {
    count: {
      type: Number,
      default: 0
    },
    users: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }]
  },

  // Vendor Response
  vendorResponse: {
    comment: String,
    respondedAt: Date
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
reviewSchema.index({ package: 1, status: 1 });
reviewSchema.index({ user: 1 });
reviewSchema.index({ vendor: 1 });
reviewSchema.index({ booking: 1 });
reviewSchema.index({ 'rating.overall': 1 });
reviewSchema.index({ createdAt: -1 });

// Ensure one review per booking
reviewSchema.index({ booking: 1 }, { unique: true });

// Update package rating after review is saved
reviewSchema.post('save', async function() {
  if (this.status === 'approved') {
    const Package = mongoose.model('Package');
    const package = await Package.findById(this.package);
    
    if (package) {
      await package.updateRating(this.rating.overall);
    }
  }
});

// Update package rating after review is updated
reviewSchema.post('findOneAndUpdate', async function(doc) {
  if (doc && doc.status === 'approved') {
    const Package = mongoose.model('Package');
    const package = await Package.findById(doc.package);
    
    if (package) {
      // Recalculate package rating
      const Review = mongoose.model('Review');
      const reviews = await Review.find({
        package: doc.package,
        status: 'approved'
      });
      
      if (reviews.length > 0) {
        const totalRating = reviews.reduce((sum, review) => sum + review.rating.overall, 0);
        package.rating.average = totalRating / reviews.length;
        package.rating.count = reviews.length;
        await package.save();
      }
    }
  }
});

// Method to mark review as helpful
reviewSchema.methods.markHelpful = async function(userId) {
  if (!this.helpful.users.includes(userId)) {
    this.helpful.users.push(userId);
    this.helpful.count += 1;
    await this.save();
  }
};

// Method to unmark review as helpful
reviewSchema.methods.unmarkHelpful = async function(userId) {
  const index = this.helpful.users.indexOf(userId);
  if (index > -1) {
    this.helpful.users.splice(index, 1);
    this.helpful.count -= 1;
    await this.save();
  }
};

// Static method to get package reviews
reviewSchema.statics.getPackageReviews = function(packageId, options = {}) {
  const {
    page = 1,
    limit = 10,
    sort = '-createdAt'
  } = options;
  
  return this.find({
    package: packageId,
    status: 'approved',
    isActive: true
  })
    .populate('user', 'name avatar')
    .sort(sort)
    .limit(limit)
    .skip((page - 1) * limit);
};

// Static method to get vendor reviews
reviewSchema.statics.getVendorReviews = function(vendorId, options = {}) {
  const {
    page = 1,
    limit = 10,
    sort = '-createdAt'
  } = options;
  
  return this.find({
    vendor: vendorId,
    status: 'approved',
    isActive: true
  })
    .populate('user', 'name avatar')
    .populate('package', 'title')
    .sort(sort)
    .limit(limit)
    .skip((page - 1) * limit);
};

module.exports = mongoose.model('Review', reviewSchema);
