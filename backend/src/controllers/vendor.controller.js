const db = require('../config/database');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');
const { uploadToStorage } = require('../utils/storage');
const { sendEmail } = require('../utils/email');
const { sendSMS } = require('../utils/sms');

/**
 * @desc    Get dynamic registration form
 * @route   GET /api/vendor/registration-form
 * @access  Public
 */
exports.getRegistrationForm = async (req, res) => {
  try {
    // Get all enabled field groups
    const [groups] = await db.query(`
      SELECT * FROM registration_field_groups 
      WHERE is_enabled = true 
      ORDER BY display_order ASC
    `);
    
    // Get all enabled fields with group mapping
    const [fields] = await db.query(`
      SELECT 
        rf.*,
        rfgm.group_id,
        rfgm.display_order as group_display_order
      FROM registration_fields rf
      LEFT JOIN registration_field_group_mapping rfgm ON rf.id = rfgm.field_id
      WHERE rf.is_enabled = true
      ORDER BY rfgm.display_order ASC, rf.display_order ASC
    `);
    
    // Group fields by group_id
    const groupedData = groups.map(group => ({
      ...group,
      fields: fields.filter(field => field.group_id === group.id)
    }));
    
    res.status(200).json({
      success: true,
      data: groupedData
    });
  } catch (error) {
    console.error('Get registration form error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching registration form',
      error: error.message
    });
  }
};

/**
 * @desc    Register new vendor with dynamic fields
 * @route   POST /api/vendor/register
 * @access  Public
 */
exports.registerVendor = async (req, res) => {
  const connection = await db.getConnection();
  
  try {
    await connection.beginTransaction();
    
    const { email, password, phone, ...dynamicFields } = req.body;
    const files = req.files;
    
    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }
    
    // Check if user already exists
    const [existingUsers] = await connection.query(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );
    
    if (existingUsers.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Email already registered'
      });
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Generate referral code
    const referralCode = `VEN${Math.random().toString(36).substr(2, 8).toUpperCase()}`;
    
    // Create user
    const userId = uuidv4();
    await connection.query(
      `INSERT INTO users (id, email, password, phone, role, referral_code, status)
       VALUES (?, ?, ?, ?, 'vendor', ?, 'inactive')`,
      [userId, email, hashedPassword, phone, referralCode]
    );
    
    // Create vendor
    const vendorId = uuidv4();
    await connection.query(
      `INSERT INTO vendors (id, user_id, company_name, verification_status, subscription_plan)
       VALUES (?, ?, ?, 'pending', 'free')`,
      [vendorId, userId, dynamicFields.company_name || 'Pending']
    );
    
    // Get all registration fields
    const [registrationFields] = await connection.query(
      'SELECT id, field_name, field_type FROM registration_fields WHERE is_enabled = true'
    );
    
    // Process and save dynamic field data
    for (const field of registrationFields) {
      let fieldValue = dynamicFields[field.field_name];
      
      // Handle file uploads
      if (field.field_type === 'file' && files && files[field.field_name]) {
        const file = files[field.field_name][0];
        const uploadResult = await uploadToStorage(file);
        fieldValue = uploadResult.url;
        
        // If it's a document, also save to vendor_documents table
        if (['gst_certificate', 'pan_card', 'hajj_certificate', 'umrah_certificate', 
             'tourism_license', 'trade_license', 'cancelled_cheque'].includes(field.field_name)) {
          
          const documentType = field.field_name.replace('_certificate', '').replace('_card', '').replace('cancelled_cheque', 'bank_statement');
          const documentNumber = dynamicFields[field.field_name.replace('_certificate', '_number').replace('_card', '_number')];
          
          await connection.query(
            `INSERT INTO vendor_documents (id, vendor_id, document_type, document_number, document_file, verification_status)
             VALUES (?, ?, ?, ?, ?, 'pending')`,
            [uuidv4(), vendorId, documentType, documentNumber, fieldValue]
          );
        }
      }
      
      // Save to vendor_registration_data
      if (fieldValue) {
        await connection.query(
          `INSERT INTO vendor_registration_data (id, vendor_id, field_id, field_value)
           VALUES (?, ?, ?, ?)`,
          [uuidv4(), vendorId, field.id, typeof fieldValue === 'object' ? JSON.stringify(fieldValue) : fieldValue]
        );
      }
    }
    
    await connection.commit();
    
    // Send welcome email
    try {
      await sendEmail({
        to: email,
        subject: 'Welcome to UmrahConnect - Vendor Registration Received',
        template: 'vendor_registration',
        data: {
          company_name: dynamicFields.company_name,
          email: email
        }
      });
    } catch (emailError) {
      console.error('Email send error:', emailError);
    }
    
    // Send SMS notification
    if (phone) {
      try {
        await sendSMS({
          to: phone,
          message: `Welcome to UmrahConnect! Your vendor registration has been received and is under review.`
        });
      } catch (smsError) {
        console.error('SMS send error:', smsError);
      }
    }
    
    res.status(201).json({
      success: true,
      message: 'Vendor registration submitted successfully. You will be notified once approved.',
      data: {
        user_id: userId,
        vendor_id: vendorId,
        email: email,
        status: 'pending'
      }
    });
    
  } catch (error) {
    await connection.rollback();
    console.error('Vendor registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Error registering vendor',
      error: error.message
    });
  } finally {
    connection.release();
  }
};

/**
 * @desc    Get vendor dashboard data
 * @route   GET /api/vendor/dashboard
 * @access  Vendor
 */
exports.getDashboard = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Get vendor ID
    const [vendors] = await db.query(
      'SELECT id FROM vendors WHERE user_id = ?',
      [userId]
    );
    
    if (vendors.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Vendor not found'
      });
    }
    
    const vendorId = vendors[0].id;
    
    // Get statistics
    const [stats] = await db.query(`
      SELECT 
        (SELECT COUNT(*) FROM packages WHERE vendor_id = ?) as total_packages,
        (SELECT COUNT(*) FROM packages WHERE vendor_id = ? AND status = 'published') as published_packages,
        (SELECT COUNT(*) FROM bookings WHERE vendor_id = ?) as total_bookings,
        (SELECT COUNT(*) FROM bookings WHERE vendor_id = ? AND booking_status = 'pending') as pending_bookings,
        (SELECT COUNT(*) FROM bookings WHERE vendor_id = ? AND booking_status = 'confirmed') as confirmed_bookings,
        (SELECT COUNT(*) FROM bookings WHERE vendor_id = ? AND booking_status = 'completed') as completed_bookings,
        (SELECT COALESCE(SUM(total_amount), 0) FROM bookings WHERE vendor_id = ? AND payment_status = 'paid') as total_revenue,
        (SELECT COALESCE(AVG(rating), 0) FROM reviews WHERE vendor_id = ?) as average_rating,
        (SELECT COUNT(*) FROM reviews WHERE vendor_id = ?) as total_reviews
    `, [vendorId, vendorId, vendorId, vendorId, vendorId, vendorId, vendorId, vendorId, vendorId]);
    
    // Get recent bookings
    const [recentBookings] = await db.query(`
      SELECT 
        b.*,
        p.title as package_title,
        u.first_name,
        u.last_name,
        u.email
      FROM bookings b
      JOIN packages p ON b.package_id = p.id
      JOIN users u ON b.user_id = u.id
      WHERE b.vendor_id = ?
      ORDER BY b.created_at DESC
      LIMIT 10
    `, [vendorId]);
    
    // Get revenue chart data (last 12 months)
    const [revenueChart] = await db.query(`
      SELECT 
        DATE_FORMAT(created_at, '%Y-%m') as month,
        COALESCE(SUM(total_amount), 0) as revenue,
        COUNT(*) as bookings
      FROM bookings
      WHERE vendor_id = ? 
        AND payment_status = 'paid'
        AND created_at >= DATE_SUB(NOW(), INTERVAL 12 MONTH)
      GROUP BY DATE_FORMAT(created_at, '%Y-%m')
      ORDER BY month ASC
    `, [vendorId]);
    
    // Get top packages
    const [topPackages] = await db.query(`
      SELECT 
        p.id,
        p.title,
        p.price,
        p.views,
        p.bookings,
        p.rating,
        COUNT(b.id) as total_bookings,
        COALESCE(SUM(b.total_amount), 0) as revenue
      FROM packages p
      LEFT JOIN bookings b ON p.id = b.package_id AND b.payment_status = 'paid'
      WHERE p.vendor_id = ?
      GROUP BY p.id
      ORDER BY total_bookings DESC
      LIMIT 5
    `, [vendorId]);
    
    res.status(200).json({
      success: true,
      data: {
        stats: stats[0],
        recent_bookings: recentBookings,
        revenue_chart: revenueChart,
        top_packages: topPackages
      }
    });
    
  } catch (error) {
    console.error('Get dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching dashboard data',
      error: error.message
    });
  }
};

/**
 * @desc    Get vendor profile
 * @route   GET /api/vendor/profile
 * @access  Vendor
 */
exports.getProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const [vendors] = await db.query(`
      SELECT 
        v.*,
        u.email,
        u.phone,
        u.first_name,
        u.last_name
      FROM vendors v
      JOIN users u ON v.user_id = u.id
      WHERE v.user_id = ?
    `, [userId]);
    
    if (vendors.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Vendor not found'
      });
    }
    
    // Get registration data
    const [registrationData] = await db.query(`
      SELECT 
        rf.field_name,
        rf.field_label,
        vrd.field_value
      FROM vendor_registration_data vrd
      JOIN registration_fields rf ON vrd.field_id = rf.id
      WHERE vrd.vendor_id = ?
    `, [vendors[0].id]);
    
    // Convert to object
    const dynamicData = {};
    registrationData.forEach(item => {
      dynamicData[item.field_name] = item.field_value;
    });
    
    res.status(200).json({
      success: true,
      data: {
        ...vendors[0],
        registration_data: dynamicData
      }
    });
    
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching profile',
      error: error.message
    });
  }
};

/**
 * @desc    Update vendor profile
 * @route   PUT /api/vendor/profile
 * @access  Vendor
 */
exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const updateData = req.body;
    const file = req.file;
    
    // Get vendor ID
    const [vendors] = await db.query(
      'SELECT id FROM vendors WHERE user_id = ?',
      [userId]
    );
    
    if (vendors.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Vendor not found'
      });
    }
    
    const vendorId = vendors[0].id;
    
    // Handle logo upload
    if (file) {
      const uploadResult = await uploadToStorage(file);
      updateData.company_logo = uploadResult.url;
    }
    
    // Update vendor table
    const vendorFields = ['company_name', 'company_logo', 'description', 'website', 
                          'address', 'city', 'state', 'country', 'postal_code'];
    const vendorUpdates = [];
    const vendorValues = [];
    
    vendorFields.forEach(field => {
      if (updateData[field] !== undefined) {
        vendorUpdates.push(`${field} = ?`);
        vendorValues.push(updateData[field]);
      }
    });
    
    if (vendorUpdates.length > 0) {
      vendorValues.push(vendorId);
      await db.query(
        `UPDATE vendors SET ${vendorUpdates.join(', ')} WHERE id = ?`,
        vendorValues
      );
    }
    
    // Update user table
    const userFields = ['first_name', 'last_name', 'phone'];
    const userUpdates = [];
    const userValues = [];
    
    userFields.forEach(field => {
      if (updateData[field] !== undefined) {
        userUpdates.push(`${field} = ?`);
        userValues.push(updateData[field]);
      }
    });
    
    if (userUpdates.length > 0) {
      userValues.push(userId);
      await db.query(
        `UPDATE users SET ${userUpdates.join(', ')} WHERE id = ?`,
        userValues
      );
    }
    
    res.status(200).json({
      success: true,
      message: 'Profile updated successfully'
    });
    
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating profile',
      error: error.message
    });
  }
};

/**
 * @desc    Get vendor documents
 * @route   GET /api/vendor/documents
 * @access  Vendor
 */
exports.getDocuments = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const [vendors] = await db.query(
      'SELECT id FROM vendors WHERE user_id = ?',
      [userId]
    );
    
    if (vendors.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Vendor not found'
      });
    }
    
    const [documents] = await db.query(
      'SELECT * FROM vendor_documents WHERE vendor_id = ? ORDER BY created_at DESC',
      [vendors[0].id]
    );
    
    res.status(200).json({
      success: true,
      count: documents.length,
      data: documents
    });
    
  } catch (error) {
    console.error('Get documents error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching documents',
      error: error.message
    });
  }
};

/**
 * @desc    Upload vendor document
 * @route   POST /api/vendor/documents
 * @access  Vendor
 */
exports.uploadDocument = async (req, res) => {
  try {
    const userId = req.user.id;
    const { document_type, document_number, issue_date, expiry_date } = req.body;
    const file = req.file;
    
    if (!file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload a document'
      });
    }
    
    const [vendors] = await db.query(
      'SELECT id FROM vendors WHERE user_id = ?',
      [userId]
    );
    
    if (vendors.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Vendor not found'
      });
    }
    
    const uploadResult = await uploadToStorage(file);
    
    const documentId = uuidv4();
    await db.query(
      `INSERT INTO vendor_documents (id, vendor_id, document_type, document_number, document_file, issue_date, expiry_date, verification_status)
       VALUES (?, ?, ?, ?, ?, ?, ?, 'pending')`,
      [documentId, vendors[0].id, document_type, document_number, uploadResult.url, issue_date, expiry_date]
    );
    
    const [documents] = await db.query(
      'SELECT * FROM vendor_documents WHERE id = ?',
      [documentId]
    );
    
    res.status(201).json({
      success: true,
      message: 'Document uploaded successfully',
      data: documents[0]
    });
    
  } catch (error) {
    console.error('Upload document error:', error);
    res.status(500).json({
      success: false,
      message: 'Error uploading document',
      error: error.message
    });
  }
};

/**
 * @desc    Delete vendor document
 * @route   DELETE /api/vendor/documents/:id
 * @access  Vendor
 */
exports.deleteDocument = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    
    const [vendors] = await db.query(
      'SELECT id FROM vendors WHERE user_id = ?',
      [userId]
    );
    
    if (vendors.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Vendor not found'
      });
    }
    
    // Check if document belongs to vendor
    const [documents] = await db.query(
      'SELECT * FROM vendor_documents WHERE id = ? AND vendor_id = ?',
      [id, vendors[0].id]
    );
    
    if (documents.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Document not found'
      });
    }
    
    // Delete document
    await db.query('DELETE FROM vendor_documents WHERE id = ?', [id]);
    
    res.status(200).json({
      success: true,
      message: 'Document deleted successfully'
    });
    
  } catch (error) {
    console.error('Delete document error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting document',
      error: error.message
    });
  }
};

// Export remaining functions (to be implemented)
exports.getPackages = async (req, res) => { /* Implementation */ };
exports.createPackage = async (req, res) => { /* Implementation */ };
exports.getPackageById = async (req, res) => { /* Implementation */ };
exports.updatePackage = async (req, res) => { /* Implementation */ };
exports.deletePackage = async (req, res) => { /* Implementation */ };
exports.publishPackage = async (req, res) => { /* Implementation */ };
exports.unpublishPackage = async (req, res) => { /* Implementation */ };
exports.getBookings = async (req, res) => { /* Implementation */ };
exports.getBookingById = async (req, res) => { /* Implementation */ };
exports.confirmBooking = async (req, res) => { /* Implementation */ };
exports.cancelBooking = async (req, res) => { /* Implementation */ };
exports.getCustomers = async (req, res) => { /* Implementation */ };
exports.getReviews = async (req, res) => { /* Implementation */ };
exports.respondToReview = async (req, res) => { /* Implementation */ };
exports.getEarnings = async (req, res) => { /* Implementation */ };
exports.getPayouts = async (req, res) => { /* Implementation */ };
exports.requestPayout = async (req, res) => { /* Implementation */ };
exports.getAnalytics = async (req, res) => { /* Implementation */ };
