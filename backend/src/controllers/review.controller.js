const db = require('../config/database');

/**
 * Review Controller
 * Handles package and vendor reviews
 */

// Create review
exports.createReview = async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      package_id,
      booking_id,
      rating,
      title,
      comment,
      service_rating,
      value_rating,
      location_rating,
      cleanliness_rating,
      photos
    } = req.body;

    // Validate required fields
    if (!package_id || !booking_id || !rating || !comment) {
      return res.status(400).json({
        success: false,
        message: 'Package ID, booking ID, rating, and comment are required'
      });
    }

    // Validate rating range
    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be between 1 and 5'
      });
    }

    // Check if booking exists and belongs to user
    const bookingQuery = `
      SELECT b.*, p.vendor_id 
      FROM bookings b
      LEFT JOIN packages p ON b.package_id = p.id
      WHERE b.id = $1 AND b.user_id = $2 AND b.status = 'completed'
    `;
    const bookingResult = await db.query(bookingQuery, [booking_id, userId]);

    if (bookingResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found or not completed'
      });
    }

    const vendorId = bookingResult.rows[0].vendor_id;

    // Check if review already exists
    const existingReview = await db.query(
      'SELECT id FROM reviews WHERE booking_id = $1 AND user_id = $2',
      [booking_id, userId]
    );

    if (existingReview.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'You have already reviewed this booking'
      });
    }

    // Insert review
    const insertQuery = `
      INSERT INTO reviews (
        user_id, package_id, vendor_id, booking_id,
        rating, title, comment,
        service_rating, value_rating, location_rating, cleanliness_rating,
        photos, status, created_at, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, 'approved', NOW(), NOW())
      RETURNING *
    `;

    const result = await db.query(insertQuery, [
      userId,
      package_id,
      vendorId,
      booking_id,
      rating,
      title,
      comment,
      service_rating,
      value_rating,
      location_rating,
      cleanliness_rating,
      photos ? JSON.stringify(photos) : null
    ]);

    // Update vendor rating
    await updateVendorRating(vendorId);

    res.status(201).json({
      success: true,
      message: 'Review submitted successfully',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Create review error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create review',
      error: error.message
    });
  }
};

// Get reviews by package
exports.getReviewsByPackage = async (req, res) => {
  try {
    const { package_id } = req.params;
    const { page = 1, limit = 10, sort = 'recent' } = req.query;
    const offset = (page - 1) * limit;

    let orderBy = 'r.created_at DESC';
    if (sort === 'highest') orderBy = 'r.rating DESC';
    if (sort === 'lowest') orderBy = 'r.rating ASC';
    if (sort === 'helpful') orderBy = 'r.helpful_count DESC';

    // Get total count and average rating
    const statsQuery = `
      SELECT 
        COUNT(*) as total_reviews,
        AVG(rating) as avg_rating,
        COUNT(CASE WHEN rating = 5 THEN 1 END) as five_star,
        COUNT(CASE WHEN rating = 4 THEN 1 END) as four_star,
        COUNT(CASE WHEN rating = 3 THEN 1 END) as three_star,
        COUNT(CASE WHEN rating = 2 THEN 1 END) as two_star,
        COUNT(CASE WHEN rating = 1 THEN 1 END) as one_star
      FROM reviews
      WHERE package_id = $1 AND status = 'approved'
    `;
    const statsResult = await db.query(statsQuery, [package_id]);

    // Get reviews
    const reviewsQuery = `
      SELECT 
        r.*,
        u.first_name,
        u.last_name,
        u.email,
        (SELECT response FROM review_responses WHERE review_id = r.id LIMIT 1) as vendor_response,
        (SELECT created_at FROM review_responses WHERE review_id = r.id LIMIT 1) as response_date
      FROM reviews r
      LEFT JOIN users u ON r.user_id = u.id
      WHERE r.package_id = $1 AND r.status = 'approved'
      ORDER BY ${orderBy}
      LIMIT $2 OFFSET $3
    `;

    const reviewsResult = await db.query(reviewsQuery, [package_id, limit, offset]);

    const totalReviews = parseInt(statsResult.rows[0].total_reviews);

    res.json({
      success: true,
      data: {
        stats: statsResult.rows[0],
        reviews: reviewsResult.rows,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(totalReviews / limit),
          totalReviews,
          limit: parseInt(limit)
        }
      }
    });
  } catch (error) {
    console.error('Get reviews error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch reviews',
      error: error.message
    });
  }
};

// Get reviews by vendor
exports.getReviewsByVendor = async (req, res) => {
  try {
    const { vendor_id } = req.params;
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    // Get total count and average rating
    const statsQuery = `
      SELECT 
        COUNT(*) as total_reviews,
        AVG(rating) as avg_rating
      FROM reviews
      WHERE vendor_id = $1 AND status = 'approved'
    `;
    const statsResult = await db.query(statsQuery, [vendor_id]);

    // Get reviews
    const reviewsQuery = `
      SELECT 
        r.*,
        u.first_name,
        u.last_name,
        p.title as package_title,
        (SELECT response FROM review_responses WHERE review_id = r.id LIMIT 1) as vendor_response
      FROM reviews r
      LEFT JOIN users u ON r.user_id = u.id
      LEFT JOIN packages p ON r.package_id = p.id
      WHERE r.vendor_id = $1 AND r.status = 'approved'
      ORDER BY r.created_at DESC
      LIMIT $2 OFFSET $3
    `;

    const reviewsResult = await db.query(reviewsQuery, [vendor_id, limit, offset]);

    const totalReviews = parseInt(statsResult.rows[0].total_reviews);

    res.json({
      success: true,
      data: {
        stats: statsResult.rows[0],
        reviews: reviewsResult.rows,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(totalReviews / limit),
          totalReviews,
          limit: parseInt(limit)
        }
      }
    });
  } catch (error) {
    console.error('Get vendor reviews error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch reviews',
      error: error.message
    });
  }
};

// Update review
exports.updateReview = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const {
      rating,
      title,
      comment,
      service_rating,
      value_rating,
      location_rating,
      cleanliness_rating,
      photos
    } = req.body;

    // Check if review belongs to user
    const checkQuery = 'SELECT * FROM reviews WHERE id = $1 AND user_id = $2';
    const checkResult = await db.query(checkQuery, [id, userId]);

    if (checkResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Review not found or unauthorized'
      });
    }

    // Update review
    const updateQuery = `
      UPDATE reviews SET
        rating = COALESCE($1, rating),
        title = COALESCE($2, title),
        comment = COALESCE($3, comment),
        service_rating = COALESCE($4, service_rating),
        value_rating = COALESCE($5, value_rating),
        location_rating = COALESCE($6, location_rating),
        cleanliness_rating = COALESCE($7, cleanliness_rating),
        photos = COALESCE($8, photos),
        updated_at = NOW()
      WHERE id = $9
      RETURNING *
    `;

    const result = await db.query(updateQuery, [
      rating,
      title,
      comment,
      service_rating,
      value_rating,
      location_rating,
      cleanliness_rating,
      photos ? JSON.stringify(photos) : null,
      id
    ]);

    // Update vendor rating
    const vendorId = checkResult.rows[0].vendor_id;
    await updateVendorRating(vendorId);

    res.json({
      success: true,
      message: 'Review updated successfully',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Update review error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update review',
      error: error.message
    });
  }
};

// Delete review
exports.deleteReview = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    // Check if review belongs to user
    const checkQuery = 'SELECT vendor_id FROM reviews WHERE id = $1 AND user_id = $2';
    const checkResult = await db.query(checkQuery, [id, userId]);

    if (checkResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Review not found or unauthorized'
      });
    }

    const vendorId = checkResult.rows[0].vendor_id;

    // Delete review
    await db.query('DELETE FROM reviews WHERE id = $1', [id]);

    // Update vendor rating
    await updateVendorRating(vendorId);

    res.json({
      success: true,
      message: 'Review deleted successfully'
    });
  } catch (error) {
    console.error('Delete review error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete review',
      error: error.message
    });
  }
};

// Mark review as helpful
exports.markReviewHelpful = async (req, res) => {
  try {
    const { id } = req.params;

    await db.query(
      'UPDATE reviews SET helpful_count = helpful_count + 1 WHERE id = $1',
      [id]
    );

    res.json({
      success: true,
      message: 'Review marked as helpful'
    });
  } catch (error) {
    console.error('Mark helpful error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to mark review',
      error: error.message
    });
  }
};

// Report review
exports.reportReview = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const { reason } = req.body;

    if (!reason) {
      return res.status(400).json({
        success: false,
        message: 'Reason is required'
      });
    }

    // Update review status
    await db.query(
      "UPDATE reviews SET status = 'reported', report_reason = $1 WHERE id = $2",
      [reason, id]
    );

    res.json({
      success: true,
      message: 'Review reported successfully'
    });
  } catch (error) {
    console.error('Report review error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to report review',
      error: error.message
    });
  }
};

// Vendor response to review
exports.vendorResponse = async (req, res) => {
  try {
    const vendorId = req.user.vendorId;
    const { id } = req.params;
    const { response } = req.body;

    if (!response) {
      return res.status(400).json({
        success: false,
        message: 'Response is required'
      });
    }

    // Check if review belongs to vendor
    const checkQuery = 'SELECT * FROM reviews WHERE id = $1 AND vendor_id = $2';
    const checkResult = await db.query(checkQuery, [id, vendorId]);

    if (checkResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Review not found or unauthorized'
      });
    }

    // Check if response already exists
    const existingResponse = await db.query(
      'SELECT id FROM review_responses WHERE review_id = $1',
      [id]
    );

    if (existingResponse.rows.length > 0) {
      // Update existing response
      await db.query(
        'UPDATE review_responses SET response = $1, updated_at = NOW() WHERE review_id = $2',
        [response, id]
      );
    } else {
      // Create new response
      await db.query(
        'INSERT INTO review_responses (review_id, vendor_id, response, created_at) VALUES ($1, $2, $3, NOW())',
        [id, vendorId, response]
      );
    }

    res.json({
      success: true,
      message: 'Response submitted successfully'
    });
  } catch (error) {
    console.error('Vendor response error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit response',
      error: error.message
    });
  }
};

// Helper function to update vendor rating
async function updateVendorRating(vendorId) {
  try {
    const ratingQuery = `
      SELECT AVG(rating) as avg_rating, COUNT(*) as total_reviews
      FROM reviews
      WHERE vendor_id = $1 AND status = 'approved'
    `;
    const result = await db.query(ratingQuery, [vendorId]);

    const avgRating = parseFloat(result.rows[0].avg_rating) || 0;
    const totalReviews = parseInt(result.rows[0].total_reviews) || 0;

    await db.query(
      'UPDATE vendors SET rating = $1, total_reviews = $2 WHERE id = $3',
      [avgRating, totalReviews, vendorId]
    );
  } catch (error) {
    console.error('Update vendor rating error:', error);
  }
}

module.exports = exports;
