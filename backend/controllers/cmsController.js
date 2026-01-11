const Banner = require('../models/Banner');
const Theme = require('../models/Theme');
const SiteSettings = require('../models/SiteSettings');
const Testimonial = require('../models/Testimonial');

// ========================================
// BANNER CONTROLLERS
// ========================================

// @desc    Get all banners
// @route   GET /api/banners
// @access  Private/Admin
exports.getBanners = async (req, res) => {
  try {
    const banners = await Banner.find().sort({ order: 1, createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: banners.length,
      data: banners
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching banners',
      error: error.message
    });
  }
};

// @desc    Get active banners (for public display)
// @route   GET /api/banners/active
// @access  Public
exports.getActiveBanners = async (req, res) => {
  try {
    const now = new Date();
    const banners = await Banner.find({
      isActive: true,
      $or: [
        { startDate: { $lte: now }, endDate: { $gte: now } },
        { startDate: { $exists: false }, endDate: { $exists: false } },
        { startDate: { $lte: now }, endDate: { $exists: false } }
      ]
    }).sort({ order: 1, createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: banners.length,
      data: banners
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching active banners',
      error: error.message
    });
  }
};

// @desc    Get single banner
// @route   GET /api/banners/:id
// @access  Private/Admin
exports.getBanner = async (req, res) => {
  try {
    const banner = await Banner.findById(req.params.id);
    
    if (!banner) {
      return res.status(404).json({
        success: false,
        message: 'Banner not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: banner
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching banner',
      error: error.message
    });
  }
};

// @desc    Create banner
// @route   POST /api/banners
// @access  Private/Admin
exports.createBanner = async (req, res) => {
  try {
    const banner = await Banner.create(req.body);
    
    res.status(201).json({
      success: true,
      data: banner
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error creating banner',
      error: error.message
    });
  }
};

// @desc    Update banner
// @route   PUT /api/banners/:id
// @access  Private/Admin
exports.updateBanner = async (req, res) => {
  try {
    const banner = await Banner.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!banner) {
      return res.status(404).json({
        success: false,
        message: 'Banner not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: banner
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error updating banner',
      error: error.message
    });
  }
};

// @desc    Delete banner
// @route   DELETE /api/banners/:id
// @access  Private/Admin
exports.deleteBanner = async (req, res) => {
  try {
    const banner = await Banner.findByIdAndDelete(req.params.id);
    
    if (!banner) {
      return res.status(404).json({
        success: false,
        message: 'Banner not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Banner deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting banner',
      error: error.message
    });
  }
};

// @desc    Reorder banners
// @route   PUT /api/banners/reorder
// @access  Private/Admin
exports.reorderBanners = async (req, res) => {
  try {
    const { banners } = req.body; // Array of { id, order }
    
    const updatePromises = banners.map(({ id, order }) =>
      Banner.findByIdAndUpdate(id, { order })
    );
    
    await Promise.all(updatePromises);
    
    res.status(200).json({
      success: true,
      message: 'Banners reordered successfully'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error reordering banners',
      error: error.message
    });
  }
};

// ========================================
// THEME CONTROLLERS
// ========================================

// @desc    Get all themes
// @route   GET /api/themes
// @access  Private/Admin
exports.getThemes = async (req, res) => {
  try {
    const themes = await Theme.find().sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: themes.length,
      data: themes
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching themes',
      error: error.message
    });
  }
};

// @desc    Get active theme
// @route   GET /api/themes/active
// @access  Public
exports.getActiveTheme = async (req, res) => {
  try {
    let theme = await Theme.findOne({ isActive: true });
    
    // If no active theme, return default
    if (!theme) {
      theme = await Theme.findOne({ isDefault: true });
    }
    
    res.status(200).json({
      success: true,
      data: theme
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching active theme',
      error: error.message
    });
  }
};

// @desc    Get single theme
// @route   GET /api/themes/:id
// @access  Private/Admin
exports.getTheme = async (req, res) => {
  try {
    const theme = await Theme.findById(req.params.id);
    
    if (!theme) {
      return res.status(404).json({
        success: false,
        message: 'Theme not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: theme
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching theme',
      error: error.message
    });
  }
};

// @desc    Create theme
// @route   POST /api/themes
// @access  Private/Admin
exports.createTheme = async (req, res) => {
  try {
    const theme = await Theme.create(req.body);
    
    res.status(201).json({
      success: true,
      data: theme
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error creating theme',
      error: error.message
    });
  }
};

// @desc    Update theme
// @route   PUT /api/themes/:id
// @access  Private/Admin
exports.updateTheme = async (req, res) => {
  try {
    const theme = await Theme.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!theme) {
      return res.status(404).json({
        success: false,
        message: 'Theme not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: theme
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error updating theme',
      error: error.message
    });
  }
};

// @desc    Delete theme
// @route   DELETE /api/themes/:id
// @access  Private/Admin
exports.deleteTheme = async (req, res) => {
  try {
    const theme = await Theme.findById(req.params.id);
    
    if (!theme) {
      return res.status(404).json({
        success: false,
        message: 'Theme not found'
      });
    }
    
    // Don't allow deleting active or default theme
    if (theme.isActive || theme.isDefault) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete active or default theme'
      });
    }
    
    await theme.deleteOne();
    
    res.status(200).json({
      success: true,
      message: 'Theme deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting theme',
      error: error.message
    });
  }
};

// @desc    Activate theme
// @route   PUT /api/themes/:id/activate
// @access  Private/Admin
exports.activateTheme = async (req, res) => {
  try {
    // Deactivate all themes
    await Theme.updateMany({}, { isActive: false });
    
    // Activate selected theme
    const theme = await Theme.findByIdAndUpdate(
      req.params.id,
      { isActive: true },
      { new: true }
    );
    
    if (!theme) {
      return res.status(404).json({
        success: false,
        message: 'Theme not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: theme,
      message: 'Theme activated successfully'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error activating theme',
      error: error.message
    });
  }
};

// ========================================
// SITE SETTINGS CONTROLLERS
// ========================================

// @desc    Get site settings
// @route   GET /api/settings
// @access  Private/Admin
exports.getSiteSettings = async (req, res) => {
  try {
    const settings = await SiteSettings.getSiteSettings();
    
    res.status(200).json({
      success: true,
      data: settings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching site settings',
      error: error.message
    });
  }
};

// @desc    Get public site settings
// @route   GET /api/settings/public
// @access  Public
exports.getPublicSettings = async (req, res) => {
  try {
    const settings = await SiteSettings.getSiteSettings();
    
    // Return only public fields
    const publicSettings = {
      siteName: settings.siteName,
      siteTagline: settings.siteTagline,
      siteDescription: settings.siteDescription,
      logo: settings.logo,
      favicon: settings.favicon,
      contact: settings.contact,
      socialMedia: settings.socialMedia,
      businessHours: settings.businessHours,
      features: settings.features,
      homepage: settings.homepage,
      statistics: settings.statistics,
      payment: {
        currency: settings.payment.currency,
        currencySymbol: settings.payment.currencySymbol
      }
    };
    
    res.status(200).json({
      success: true,
      data: publicSettings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching public settings',
      error: error.message
    });
  }
};

// @desc    Update site settings
// @route   PUT /api/settings
// @access  Private/Admin
exports.updateSiteSettings = async (req, res) => {
  try {
    let settings = await SiteSettings.findOne();
    
    if (!settings) {
      settings = await SiteSettings.create(req.body);
    } else {
      settings = await SiteSettings.findByIdAndUpdate(
        settings._id,
        req.body,
        { new: true, runValidators: true }
      );
    }
    
    res.status(200).json({
      success: true,
      data: settings
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error updating site settings',
      error: error.message
    });
  }
};

// ========================================
// TESTIMONIAL CONTROLLERS
// ========================================

// @desc    Get all testimonials
// @route   GET /api/testimonials
// @access  Public
exports.getTestimonials = async (req, res) => {
  try {
    const { isActive, isFeatured, limit = 10, page = 1 } = req.query;
    
    const query = {};
    if (isActive !== undefined) query.isActive = isActive === 'true';
    if (isFeatured !== undefined) query.isFeatured = isFeatured === 'true';
    
    const testimonials = await Testimonial.find(query)
      .sort({ order: 1, createdAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit))
      .populate('packageId', 'title');
    
    const total = await Testimonial.countDocuments(query);
    
    res.status(200).json({
      success: true,
      count: testimonials.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      data: testimonials
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching testimonials',
      error: error.message
    });
  }
};

// @desc    Get featured testimonials
// @route   GET /api/testimonials/featured
// @access  Public
exports.getFeaturedTestimonials = async (req, res) => {
  try {
    const { limit = 6 } = req.query;
    
    const testimonials = await Testimonial.find({
      isActive: true,
      isFeatured: true
    })
      .sort({ order: 1, createdAt: -1 })
      .limit(parseInt(limit))
      .populate('packageId', 'title');
    
    res.status(200).json({
      success: true,
      count: testimonials.length,
      data: testimonials
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching featured testimonials',
      error: error.message
    });
  }
};

// @desc    Get single testimonial
// @route   GET /api/testimonials/:id
// @access  Public
exports.getTestimonial = async (req, res) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id)
      .populate('packageId', 'title');
    
    if (!testimonial) {
      return res.status(404).json({
        success: false,
        message: 'Testimonial not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: testimonial
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching testimonial',
      error: error.message
    });
  }
};

// @desc    Create testimonial
// @route   POST /api/testimonials
// @access  Private/Admin
exports.createTestimonial = async (req, res) => {
  try {
    const testimonial = await Testimonial.create(req.body);
    
    res.status(201).json({
      success: true,
      data: testimonial
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error creating testimonial',
      error: error.message
    });
  }
};

// @desc    Update testimonial
// @route   PUT /api/testimonials/:id
// @access  Private/Admin
exports.updateTestimonial = async (req, res) => {
  try {
    const testimonial = await Testimonial.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!testimonial) {
      return res.status(404).json({
        success: false,
        message: 'Testimonial not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: testimonial
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error updating testimonial',
      error: error.message
    });
  }
};

// @desc    Delete testimonial
// @route   DELETE /api/testimonials/:id
// @access  Private/Admin
exports.deleteTestimonial = async (req, res) => {
  try {
    const testimonial = await Testimonial.findByIdAndDelete(req.params.id);
    
    if (!testimonial) {
      return res.status(404).json({
        success: false,
        message: 'Testimonial not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Testimonial deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting testimonial',
      error: error.message
    });
  }
};
