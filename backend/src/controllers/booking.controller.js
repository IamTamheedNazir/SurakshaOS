const db = require('../config/database');
const { v4: uuidv4 } = require('uuid');
const { sendEmail } = require('../utils/email');
const { sendSMS } = require('../utils/sms');
const { uploadToStorage } = require('../utils/storage');

/**
 * @desc    Get package availability for dates
 * @route   GET /api/bookings/availability/:packageId
 * @access  Public
 */
exports.getAvailability = async (req, res) => {
  try {
    const { packageId } = req.params;
    const { from, to } = req.query;
    
    // Get package details
    const [packages] = await db.query(
      'SELECT max_people, available_seats FROM packages WHERE id = ?',
      [packageId]
    );
    
    if (packages.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Package not found'
      });
    }
    
    // Get availability data
    const [availability] = await db.query(`
      SELECT 
        date,
        available_seats,
        booked_seats,
        price,
        status
      FROM booking_availability
      WHERE package_id = ?
        AND date BETWEEN ? AND ?
      ORDER BY date ASC
    `, [packageId, from, to]);
    
    res.status(200).json({
      success: true,
      data: {
        package_max_people: packages[0].max_people,
        package_available_seats: packages[0].available_seats,
        availability: availability
      }
    });
    
  } catch (error) {
    console.error('Get availability error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching availability',
      error: error.message
    });
  }
};

/**
 * @desc    Check availability for specific date and travelers
 * @route   POST /api/bookings/check-availability
 * @access  Public
 */
exports.checkAvailability = async (req, res) => {
  try {
    const { package_id, departure_date, travelers } = req.body;
    
    // Get package details
    const [packages] = await db.query(
      'SELECT available_seats FROM packages WHERE id = ? AND status = "published"',
      [package_id]
    );
    
    if (packages.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Package not found or not available'
      });
    }
    
    // Check availability for date
    const [availability] = await db.query(`
      SELECT available_seats, booked_seats, status
      FROM booking_availability
      WHERE package_id = ? AND date = ?
    `, [package_id, departure_date]);
    
    let availableSeats = packages[0].available_seats;
    let bookedSeats = 0;
    
    if (availability.length > 0) {
      availableSeats = availability[0].available_seats;
      bookedSeats = availability[0].booked_seats;
    }
    
    const remainingSeats = availableSeats - bookedSeats;
    const isAvailable = remainingSeats >= travelers;
    
    res.status(200).json({
      success: true,
      data: {
        available: isAvailable,
        available_seats: availableSeats,
        booked_seats: bookedSeats,
        remaining_seats: remainingSeats,
        requested_travelers: travelers,
        message: isAvailable 
          ? `${remainingSeats} seats available` 
          : `Only ${remainingSeats} seats available`
      }
    });
    
  } catch (error) {
    console.error('Check availability error:', error);
    res.status(500).json({
      success: false,
      message: 'Error checking availability',
      error: error.message
    });
  }
};

/**
 * @desc    Calculate booking price with discounts and taxes
 * @route   POST /api/bookings/calculate-price
 * @access  Public
 */
exports.calculatePrice = async (req, res) => {
  try {
    const { package_id, adults, children, infants, departure_date, coupon_code } = req.body;
    
    // Get package price
    const [packages] = await db.query(
      'SELECT price, discount_percentage, currency FROM packages WHERE id = ?',
      [package_id]
    );
    
    if (packages.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Package not found'
      });
    }
    
    const basePrice = parseFloat(packages[0].price);
    const packageDiscount = parseFloat(packages[0].discount_percentage) || 0;
    
    // Calculate traveler-based pricing
    const adultPrice = basePrice;
    const childPrice = basePrice * 0.75; // 25% discount for children
    const infantPrice = basePrice * 0.10; // 90% discount for infants
    
    const subtotal = (adults * adultPrice) + (children * childPrice) + (infants * infantPrice);
    
    // Apply package discount
    const packageDiscountAmount = (subtotal * packageDiscount) / 100;
    
    // Apply coupon if provided
    let couponDiscountAmount = 0;
    let couponDetails = null;
    
    if (coupon_code) {
      // Check coupon validity (implement coupon system)
      // For now, mock response
      couponDiscountAmount = subtotal * 0.05; // 5% discount
      couponDetails = {
        code: coupon_code,
        discount_percentage: 5,
        discount_amount: couponDiscountAmount
      };
    }
    
    const totalDiscount = packageDiscountAmount + couponDiscountAmount;
    const priceAfterDiscount = subtotal - totalDiscount;
    
    // Calculate taxes (18% GST)
    const taxPercentage = 18;
    const taxAmount = (priceAfterDiscount * taxPercentage) / 100;
    
    const totalAmount = priceAfterDiscount + taxAmount;
    
    res.status(200).json({
      success: true,
      data: {
        currency: packages[0].currency,
        breakdown: {
          adults: {
            count: adults,
            price_per_person: adultPrice,
            total: adults * adultPrice
          },
          children: {
            count: children,
            price_per_person: childPrice,
            total: children * childPrice
          },
          infants: {
            count: infants,
            price_per_person: infantPrice,
            total: infants * infantPrice
          }
        },
        subtotal: subtotal,
        package_discount: {
          percentage: packageDiscount,
          amount: packageDiscountAmount
        },
        coupon_discount: couponDetails,
        total_discount: totalDiscount,
        price_after_discount: priceAfterDiscount,
        tax: {
          percentage: taxPercentage,
          amount: taxAmount
        },
        total_amount: totalAmount,
        total_travelers: adults + children + infants
      }
    });
    
  } catch (error) {
    console.error('Calculate price error:', error);
    res.status(500).json({
      success: false,
      message: 'Error calculating price',
      error: error.message
    });
  }
};

/**
 * @desc    Create new booking
 * @route   POST /api/bookings
 * @access  Private (Customer)
 */
exports.createBooking = async (req, res) => {
  const connection = await db.getConnection();
  
  try {
    await connection.beginTransaction();
    
    const userId = req.user.id;
    const {
      package_id,
      departure_date,
      return_date,
      travelers,
      special_requests,
      total_amount,
      currency
    } = req.body;
    
    // Validate package exists
    const [packages] = await connection.query(
      'SELECT * FROM packages WHERE id = ? AND status = "published"',
      [package_id]
    );
    
    if (packages.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Package not found or not available'
      });
    }
    
    const pkg = packages[0];
    const vendorId = pkg.vendor_id;
    
    // Check availability
    const totalTravelers = travelers.length;
    const [availability] = await connection.query(`
      SELECT available_seats, booked_seats
      FROM booking_availability
      WHERE package_id = ? AND date = ?
    `, [package_id, departure_date]);
    
    let availableSeats = pkg.available_seats;
    let bookedSeats = 0;
    
    if (availability.length > 0) {
      availableSeats = availability[0].available_seats;
      bookedSeats = availability[0].booked_seats;
    }
    
    if ((availableSeats - bookedSeats) < totalTravelers) {
      return res.status(400).json({
        success: false,
        message: 'Not enough seats available'
      });
    }
    
    // Generate booking number
    const bookingNumber = `BK${Date.now()}${Math.random().toString(36).substr(2, 4).toUpperCase()}`;
    
    // Count traveler types
    const adults = travelers.filter(t => t.type === 'adult').length;
    const children = travelers.filter(t => t.type === 'child').length;
    const infants = travelers.filter(t => t.type === 'infant').length;
    
    // Create booking
    const bookingId = uuidv4();
    await connection.query(`
      INSERT INTO bookings (
        id, booking_number, user_id, vendor_id, package_id,
        travelers, total_travelers, adults, children, infants,
        departure_date, return_date, package_price, total_amount,
        currency, payment_status, booking_status, special_requests
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', 'pending', ?)
    `, [
      bookingId, bookingNumber, userId, vendorId, package_id,
      JSON.stringify(travelers), totalTravelers, adults, children, infants,
      departure_date, return_date, pkg.price, total_amount,
      currency, special_requests
    ]);
    
    // Update availability
    if (availability.length > 0) {
      await connection.query(`
        UPDATE booking_availability
        SET booked_seats = booked_seats + ?
        WHERE package_id = ? AND date = ?
      `, [totalTravelers, package_id, departure_date]);
    } else {
      await connection.query(`
        INSERT INTO booking_availability (id, package_id, date, available_seats, booked_seats, price, status)
        VALUES (?, ?, ?, ?, ?, ?, 'available')
      `, [uuidv4(), package_id, departure_date, pkg.available_seats, totalTravelers, pkg.price]);
    }
    
    // Update package bookings count
    await connection.query(
      'UPDATE packages SET bookings = bookings + 1 WHERE id = ?',
      [package_id]
    );
    
    // Create activity log
    await connection.query(`
      INSERT INTO activity_logs (id, user_id, action, entity_type, entity_id, data)
      VALUES (?, ?, 'booking_created', 'booking', ?, ?)
    `, [uuidv4(), userId, bookingId, JSON.stringify({ booking_number: bookingNumber })]);
    
    await connection.commit();
    
    // Send confirmation email
    try {
      await sendEmail({
        to: req.user.email,
        subject: `Booking Confirmation - ${bookingNumber}`,
        template: 'booking_created',
        data: {
          booking_number: bookingNumber,
          package_title: pkg.title,
          departure_date: departure_date,
          total_amount: total_amount,
          currency: currency
        }
      });
    } catch (emailError) {
      console.error('Email send error:', emailError);
    }
    
    // Send SMS
    if (req.user.phone) {
      try {
        await sendSMS({
          to: req.user.phone,
          message: `Booking confirmed! ${bookingNumber}. Total: ${currency} ${total_amount}. Complete payment to confirm.`
        });
      } catch (smsError) {
        console.error('SMS send error:', smsError);
      }
    }
    
    // Fetch created booking
    const [bookings] = await connection.query(
      'SELECT * FROM bookings WHERE id = ?',
      [bookingId]
    );
    
    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      data: bookings[0]
    });
    
  } catch (error) {
    await connection.rollback();
    console.error('Create booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating booking',
      error: error.message
    });
  } finally {
    connection.release();
  }
};

/**
 * @desc    Get user bookings
 * @route   GET /api/bookings
 * @access  Private (Customer)
 */
exports.getUserBookings = async (req, res) => {
  try {
    const userId = req.user.id;
    const { status, page = 1, limit = 10 } = req.query;
    
    const offset = (page - 1) * limit;
    
    let query = `
      SELECT 
        b.*,
        p.title as package_title,
        p.images as package_images,
        v.company_name as vendor_name
      FROM bookings b
      JOIN packages p ON b.package_id = p.id
      JOIN vendors v ON b.vendor_id = v.id
      WHERE b.user_id = ?
    `;
    
    const params = [userId];
    
    if (status) {
      query += ' AND b.booking_status = ?';
      params.push(status);
    }
    
    query += ' ORDER BY b.created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));
    
    const [bookings] = await db.query(query, params);
    
    // Get total count
    let countQuery = 'SELECT COUNT(*) as total FROM bookings WHERE user_id = ?';
    const countParams = [userId];
    
    if (status) {
      countQuery += ' AND booking_status = ?';
      countParams.push(status);
    }
    
    const [countResult] = await db.query(countQuery, countParams);
    const total = countResult[0].total;
    
    res.status(200).json({
      success: true,
      count: bookings.length,
      total: total,
      page: parseInt(page),
      totalPages: Math.ceil(total / limit),
      data: bookings
    });
    
  } catch (error) {
    console.error('Get user bookings error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching bookings',
      error: error.message
    });
  }
};

/**
 * @desc    Get single booking
 * @route   GET /api/bookings/:id
 * @access  Private (Customer/Vendor)
 */
exports.getBookingById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const userRole = req.user.role;
    
    let query = `
      SELECT 
        b.*,
        p.title as package_title,
        p.description as package_description,
        p.images as package_images,
        p.inclusions,
        p.exclusions,
        v.company_name as vendor_name,
        v.company_logo as vendor_logo,
        v.phone as vendor_phone,
        v.email as vendor_email,
        u.first_name as customer_first_name,
        u.last_name as customer_last_name,
        u.email as customer_email,
        u.phone as customer_phone
      FROM bookings b
      JOIN packages p ON b.package_id = p.id
      JOIN vendors v ON b.vendor_id = v.id
      JOIN users u ON b.user_id = u.id
      WHERE b.id = ?
    `;
    
    // Check access rights
    if (userRole === 'customer') {
      query += ' AND b.user_id = ?';
    } else if (userRole === 'vendor') {
      query += ' AND v.user_id = ?';
    }
    
    const params = userRole === 'admin' ? [id] : [id, userId];
    
    const [bookings] = await db.query(query, params);
    
    if (bookings.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found or access denied'
      });
    }
    
    // Get payments
    const [payments] = await db.query(
      'SELECT * FROM payments WHERE booking_id = ? ORDER BY created_at DESC',
      [id]
    );
    
    res.status(200).json({
      success: true,
      data: {
        ...bookings[0],
        payments: payments
      }
    });
    
  } catch (error) {
    console.error('Get booking by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching booking',
      error: error.message
    });
  }
};

/**
 * @desc    Cancel booking
 * @route   POST /api/bookings/:id/cancel
 * @access  Private (Customer)
 */
exports.cancelBooking = async (req, res) => {
  const connection = await db.getConnection();
  
  try {
    await connection.beginTransaction();
    
    const { id } = req.params;
    const userId = req.user.id;
    const { reason, request_refund } = req.body;
    
    // Get booking
    const [bookings] = await connection.query(
      'SELECT * FROM bookings WHERE id = ? AND user_id = ?',
      [id, userId]
    );
    
    if (bookings.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }
    
    const booking = bookings[0];
    
    if (booking.booking_status === 'cancelled') {
      return res.status(400).json({
        success: false,
        message: 'Booking already cancelled'
      });
    }
    
    // Update booking status
    await connection.query(
      'UPDATE bookings SET booking_status = "cancelled" WHERE id = ?',
      [id]
    );
    
    // Update availability
    await connection.query(`
      UPDATE booking_availability
      SET booked_seats = booked_seats - ?
      WHERE package_id = ? AND date = ?
    `, [booking.total_travelers, booking.package_id, booking.departure_date]);
    
    // Create activity log
    await connection.query(`
      INSERT INTO activity_logs (id, user_id, action, entity_type, entity_id, data)
      VALUES (?, ?, 'booking_cancelled', 'booking', ?, ?)
    `, [uuidv4(), userId, id, JSON.stringify({ reason: reason })]);
    
    await connection.commit();
    
    // Send cancellation email
    try {
      await sendEmail({
        to: req.user.email,
        subject: `Booking Cancelled - ${booking.booking_number}`,
        template: 'booking_cancelled',
        data: {
          booking_number: booking.booking_number,
          reason: reason
        }
      });
    } catch (emailError) {
      console.error('Email send error:', emailError);
    }
    
    res.status(200).json({
      success: true,
      message: 'Booking cancelled successfully',
      data: {
        booking_id: id,
        status: 'cancelled',
        refund_eligible: request_refund
      }
    });
    
  } catch (error) {
    await connection.rollback();
    console.error('Cancel booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Error cancelling booking',
      error: error.message
    });
  } finally {
    connection.release();
  }
};

// Export remaining functions (to be implemented)
exports.updateBooking = async (req, res) => { /* Implementation */ };
exports.uploadDocuments = async (req, res) => { /* Implementation */ };
exports.getDocuments = async (req, res) => { /* Implementation */ };
exports.deleteDocument = async (req, res) => { /* Implementation */ };
exports.updateTravelers = async (req, res) => { /* Implementation */ };
exports.getInvoice = async (req, res) => { /* Implementation */ };
exports.downloadInvoice = async (req, res) => { /* Implementation */ };
exports.addReview = async (req, res) => { /* Implementation */ };
exports.getTimeline = async (req, res) => { /* Implementation */ };
exports.addSpecialRequest = async (req, res) => { /* Implementation */ };
exports.checkRefundEligibility = async (req, res) => { /* Implementation */ };
exports.requestRefund = async (req, res) => { /* Implementation */ };
exports.requestModification = async (req, res) => { /* Implementation */ };
exports.getPaymentStatus = async (req, res) => { /* Implementation */ };
exports.resendConfirmation = async (req, res) => { /* Implementation */ };
