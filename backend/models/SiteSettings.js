const mongoose = require('mongoose');

const siteSettingsSchema = new mongoose.Schema({
  // Site Information
  siteName: {
    type: String,
    required: true,
    default: 'UmrahConnect'
  },
  siteTagline: {
    type: String,
    default: 'Your Trusted Partner for Sacred Journeys'
  },
  siteDescription: {
    type: String,
    default: 'Book your Umrah and Hajj packages with ease'
  },
  logo: {
    type: String
  },
  favicon: {
    type: String
  },
  
  // Contact Information
  contact: {
    email: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      required: true
    },
    whatsapp: {
      type: String
    },
    address: {
      type: String
    },
    city: {
      type: String
    },
    state: {
      type: String
    },
    country: {
      type: String,
      default: 'India'
    },
    pincode: {
      type: String
    }
  },

  // Social Media Links
  socialMedia: {
    facebook: String,
    twitter: String,
    instagram: String,
    youtube: String,
    linkedin: String
  },

  // Business Hours
  businessHours: {
    monday: { open: String, close: String, closed: Boolean },
    tuesday: { open: String, close: String, closed: Boolean },
    wednesday: { open: String, close: String, closed: Boolean },
    thursday: { open: String, close: String, closed: Boolean },
    friday: { open: String, close: String, closed: Boolean },
    saturday: { open: String, close: String, closed: Boolean },
    sunday: { open: String, close: String, closed: Boolean }
  },

  // SEO Settings
  seo: {
    metaTitle: String,
    metaDescription: String,
    metaKeywords: [String],
    ogImage: String,
    googleAnalyticsId: String,
    facebookPixelId: String
  },

  // Email Settings
  email: {
    fromName: String,
    fromEmail: String,
    replyToEmail: String,
    smtpHost: String,
    smtpPort: Number,
    smtpUser: String,
    smtpPassword: String
  },

  // Payment Settings
  payment: {
    currency: {
      type: String,
      default: 'INR'
    },
    currencySymbol: {
      type: String,
      default: '₹'
    },
    razorpayEnabled: {
      type: Boolean,
      default: false
    },
    razorpayKeyId: String,
    razorpayKeySecret: String,
    stripeEnabled: {
      type: Boolean,
      default: false
    },
    stripePublishableKey: String,
    stripeSecretKey: String
  },

  // Features Toggle
  features: {
    enableBooking: {
      type: Boolean,
      default: true
    },
    enableReviews: {
      type: Boolean,
      default: true
    },
    enableBlog: {
      type: Boolean,
      default: true
    },
    enableNewsletter: {
      type: Boolean,
      default: true
    },
    enableChat: {
      type: Boolean,
      default: false
    },
    maintenanceMode: {
      type: Boolean,
      default: false
    }
  },

  // Homepage Settings
  homepage: {
    heroTitle: String,
    heroSubtitle: String,
    heroImage: String,
    showFeaturedPackages: {
      type: Boolean,
      default: true
    },
    featuredPackagesLimit: {
      type: Number,
      default: 6
    },
    showPopularPackages: {
      type: Boolean,
      default: true
    },
    popularPackagesLimit: {
      type: Number,
      default: 6
    },
    showTestimonials: {
      type: Boolean,
      default: true
    },
    testimonialsLimit: {
      type: Number,
      default: 6
    }
  },

  // Statistics (for homepage)
  statistics: {
    totalPilgrims: {
      type: Number,
      default: 10000
    },
    totalPackages: {
      type: Number,
      default: 500
    },
    totalVendors: {
      type: Number,
      default: 85
    },
    yearsOfExperience: {
      type: Number,
      default: 10
    }
  },

  // Legal Pages
  legal: {
    termsAndConditions: String,
    privacyPolicy: String,
    refundPolicy: String,
    cancellationPolicy: String
  }
}, {
  timestamps: true
});

// Ensure only one settings document exists
siteSettingsSchema.statics.getSiteSettings = async function() {
  let settings = await this.findOne();
  if (!settings) {
    settings = await this.create({});
  }
  return settings;
};

module.exports = mongoose.model('SiteSettings', siteSettingsSchema);
