const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  // Booking Reference
  bookingId: {
    type: String,
    unique: true,
    required: true
  },

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
  vendor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Vendor is required']
  },

  // Traveler Information
  travelers: [{
    firstName: {
      type: String,
      required: true,
      trim: true
    },
    lastName: {
      type: String,
      required: true,
      trim: true
    },
    dateOfBirth: {
      type: Date,
      required: true
    },
    gender: {
      type: String,
      enum: ['male', 'female'],
      required: true
    },
    nationality: {
      type: String,
      required: true
    },
    passport: {
      number: {
        type: String,
        required: true
      },
      issueDate: Date,
      expiryDate: {
        type: Date,
        required: true
      },
      issuePlace: String
    },
    relation: {
      type: String,
      enum: ['self', 'spouse', 'parent', 'child', 'sibling', 'friend', 'other'],
      required: true
    },
    specialRequirements: String
  }],

  // Contact Information
  contactInfo: {
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      required: true
    },
    whatsapp: String,
    alternatePhone: String,
    address: {
      street: String,
      city: String,
      state: String,
      country: String,
      pincode: String
    }
  },

  // Travel Preferences
  preferences: {
    roomSharing: {
      type: String,
      enum: ['single', 'double', 'triple', 'quad'],
      default: 'double'
    },
    mealPreference: {
      type: String,
      enum: ['vegetarian', 'non-vegetarian', 'halal'],
      default: 'halal'
    },
    specialRequests: String
  },

  // Pricing
  pricing: {
    basePrice: {
      type: Number,
      required: true
    },
    discount: {
      type: Number,
      default: 0
    },
    taxes: {
      type: Number,
      default: 0
    },
    additionalCharges: [{
      name: String,
      amount: Number
    }],
    totalAmount: {
      type: Number,
      required: true
    },
    currency: {
      type: String,
      default: 'INR'
    }
  },

  // Payment
  payment: {
    status: {
      type: String,
      enum: ['pending', 'partial', 'paid', 'refunded', 'failed'],
      default: 'pending'
    },
    method: {
      type: String,
      enum: ['online', 'bank_transfer', 'cash', 'cheque', 'emi'],
      default: 'online'
    },
    paidAmount: {
      type: Number,
      default: 0
    },
    pendingAmount: {
      type: Number,
      default: 0
    },
    transactions: [{
      transactionId: String,
      amount: Number,
      method: String,
      status: {
        type: String,
        enum: ['success', 'failed', 'pending']
      },
      gateway: String,
      gatewayResponse: mongoose.Schema.Types.Mixed,
      paidAt: Date,
      createdAt: {
        type: Date,
        default: Date.now
      }
    }],
    refunds: [{
      amount: Number,
      reason: String,
      status: {
        type: String,
        enum: ['pending', 'processed', 'rejected']
      },
      processedAt: Date,
      createdAt: {
        type: Date,
        default: Date.now
      }
    }]
  },

  // Booking Status
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed', 'refunded'],
    default: 'pending'
  },
  
  // Dates
  bookingDate: {
    type: Date,
    default: Date.now
  },
  travelDate: {
    type: Date,
    required: true
  },
  returnDate: {
    type: Date
  },
  confirmedAt: Date,
  cancelledAt: Date,
  completedAt: Date,

  // Cancellation
  cancellation: {
    reason: String,
    cancelledBy: {
      type: String,
      enum: ['user', 'vendor', 'admin']
    },
    refundAmount: Number,
    refundStatus: {
      type: String,
      enum: ['pending', 'processed', 'rejected']
    }
  },

  // Documents
  documents: [{
    type: {
      type: String,
      enum: ['visa', 'ticket', 'voucher', 'insurance', 'other']
    },
    name: String,
    url: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  }],

  // Communication
  notes: [{
    message: String,
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    isInternal: {
      type: Boolean,
      default: false
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],

  // Review
  review: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Review'
  },
  hasReviewed: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
bookingSchema.index({ bookingId: 1 });
bookingSchema.index({ user: 1, status: 1 });
bookingSchema.index({ vendor: 1, status: 1 });
bookingSchema.index({ package: 1 });
bookingSchema.index({ travelDate: 1 });
bookingSchema.index({ 'payment.status': 1 });
bookingSchema.index({ createdAt: -1 });

// Generate unique booking ID before saving
bookingSchema.pre('save', async function(next) {
  if (this.isNew && !this.bookingId) {
    const prefix = 'BK';
    const timestamp = Date.now().toString().slice(-8);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    this.bookingId = `${prefix}${timestamp}${random}`;
  }
  
  // Calculate pending amount
  if (this.payment) {
    this.payment.pendingAmount = this.pricing.totalAmount - this.payment.paidAmount;
  }
  
  next();
});

// Virtual for number of travelers
bookingSchema.virtual('travelerCount').get(function() {
  return this.travelers ? this.travelers.length : 0;
});

// Virtual for payment completion percentage
bookingSchema.virtual('paymentProgress').get(function() {
  if (!this.pricing.totalAmount) return 0;
  return Math.round((this.payment.paidAmount / this.pricing.totalAmount) * 100);
});

// Method to check if booking is cancellable
bookingSchema.methods.isCancellable = function() {
  const now = new Date();
  const travelDate = new Date(this.travelDate);
  const daysDifference = Math.ceil((travelDate - now) / (1000 * 60 * 60 * 24));
  
  return (
    this.status === 'confirmed' &&
    daysDifference > 7 // Can cancel if more than 7 days before travel
  );
};

// Method to calculate refund amount
bookingSchema.methods.calculateRefund = function() {
  const now = new Date();
  const travelDate = new Date(this.travelDate);
  const daysDifference = Math.ceil((travelDate - now) / (1000 * 60 * 60 * 24));
  
  let refundPercentage = 0;
  
  if (daysDifference > 30) {
    refundPercentage = 90; // 90% refund
  } else if (daysDifference > 15) {
    refundPercentage = 75; // 75% refund
  } else if (daysDifference > 7) {
    refundPercentage = 50; // 50% refund
  } else {
    refundPercentage = 0; // No refund
  }
  
  return (this.payment.paidAmount * refundPercentage) / 100;
};

// Method to add payment transaction
bookingSchema.methods.addTransaction = async function(transactionData) {
  this.payment.transactions.push(transactionData);
  
  if (transactionData.status === 'success') {
    this.payment.paidAmount += transactionData.amount;
    this.payment.pendingAmount = this.pricing.totalAmount - this.payment.paidAmount;
    
    // Update payment status
    if (this.payment.paidAmount >= this.pricing.totalAmount) {
      this.payment.status = 'paid';
      if (this.status === 'pending') {
        this.status = 'confirmed';
        this.confirmedAt = Date.now();
      }
    } else if (this.payment.paidAmount > 0) {
      this.payment.status = 'partial';
    }
  }
  
  await this.save();
};

// Method to cancel booking
bookingSchema.methods.cancelBooking = async function(reason, cancelledBy) {
  this.status = 'cancelled';
  this.cancelledAt = Date.now();
  this.cancellation = {
    reason,
    cancelledBy,
    refundAmount: this.calculateRefund(),
    refundStatus: 'pending'
  };
  
  await this.save();
};

module.exports = mongoose.model('Booking', bookingSchema);
