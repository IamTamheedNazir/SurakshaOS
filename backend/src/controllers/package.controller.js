const db = require('../config/database');

/**
 * Package Controller
 * Handles all package-related operations
 */

// Get all packages with filters and pagination
exports.getAllPackages = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 12,
      type,
      destination,
      minPrice,
      maxPrice,
      duration,
      sortBy = 'created_at',
      sortOrder = 'DESC',
      search
    } = req.query;

    const offset = (page - 1) * limit;

    // Build WHERE clause
    let whereConditions = ["status = 'active'"];
    const queryParams = [];
    let paramIndex = 1;

    if (type) {
      whereConditions.push(`type = $${paramIndex++}`);
      queryParams.push(type);
    }

    if (destination) {
      whereConditions.push(`destination ILIKE $${paramIndex++}`);
      queryParams.push(`%${destination}%`);
    }

    if (minPrice) {
      whereConditions.push(`price >= $${paramIndex++}`);
      queryParams.push(minPrice);
    }

    if (maxPrice) {
      whereConditions.push(`price <= $${paramIndex++}`);
      queryParams.push(maxPrice);
    }

    if (duration) {
      whereConditions.push(`duration = $${paramIndex++}`);
      queryParams.push(duration);
    }

    if (search) {
      whereConditions.push(`(title ILIKE $${paramIndex} OR description ILIKE $${paramIndex})`);
      queryParams.push(`%${search}%`);
      paramIndex++;
    }

    const whereClause = whereConditions.join(' AND ');

    // Get total count
    const countQuery = `SELECT COUNT(*) FROM packages WHERE ${whereClause}`;
    const countResult = await db.query(countQuery, queryParams);
    const totalPackages = parseInt(countResult.rows[0].count);

    // Get packages
    const packagesQuery = `
      SELECT 
        p.*,
        v.company_name as vendor_name,
        v.rating as vendor_rating,
        (SELECT COUNT(*) FROM bookings WHERE package_id = p.id) as total_bookings,
        (SELECT AVG(rating) FROM reviews WHERE package_id = p.id) as avg_rating,
        (SELECT COUNT(*) FROM reviews WHERE package_id = p.id) as review_count,
        (SELECT json_agg(image_url) FROM package_images WHERE package_id = p.id LIMIT 5) as images
      FROM packages p
      LEFT JOIN vendors v ON p.vendor_id = v.id
      WHERE ${whereClause}
      ORDER BY ${sortBy} ${sortOrder}
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `;

    queryParams.push(limit, offset);
    const packagesResult = await db.query(packagesQuery, queryParams);

    res.json({
      success: true,
      data: {
        packages: packagesResult.rows,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(totalPackages / limit),
          totalPackages,
          limit: parseInt(limit)
        }
      }
    });
  } catch (error) {
    console.error('Get packages error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch packages',
      error: error.message
    });
  }
};

// Get package by ID with full details
exports.getPackageById = async (req, res) => {
  try {
    const { id } = req.params;

    const packageQuery = `
      SELECT 
        p.*,
        v.id as vendor_id,
        v.company_name as vendor_name,
        v.company_email as vendor_email,
        v.company_phone as vendor_phone,
        v.rating as vendor_rating,
        v.total_bookings as vendor_total_bookings,
        (SELECT json_agg(image_url ORDER BY display_order) FROM package_images WHERE package_id = p.id) as images,
        (SELECT json_agg(json_build_object('item', item, 'description', description) ORDER BY display_order) 
         FROM package_inclusions WHERE package_id = p.id) as inclusions,
        (SELECT json_agg(json_build_object('item', item, 'description', description) ORDER BY display_order) 
         FROM package_exclusions WHERE package_id = p.id) as exclusions,
        (SELECT AVG(rating) FROM reviews WHERE package_id = p.id) as avg_rating,
        (SELECT COUNT(*) FROM reviews WHERE package_id = p.id) as review_count,
        (SELECT COUNT(*) FROM bookings WHERE package_id = p.id) as total_bookings
      FROM packages p
      LEFT JOIN vendors v ON p.vendor_id = v.id
      WHERE p.id = $1
    `;

    const result = await db.query(packageQuery, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Package not found'
      });
    }

    // Get reviews
    const reviewsQuery = `
      SELECT 
        r.*,
        u.first_name,
        u.last_name,
        u.email
      FROM reviews r
      LEFT JOIN users u ON r.user_id = u.id
      WHERE r.package_id = $1
      ORDER BY r.created_at DESC
      LIMIT 10
    `;

    const reviewsResult = await db.query(reviewsQuery, [id]);

    const packageData = {
      ...result.rows[0],
      reviews: reviewsResult.rows
    };

    res.json({
      success: true,
      data: packageData
    });
  } catch (error) {
    console.error('Get package error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch package',
      error: error.message
    });
  }
};

// Create new package (Vendor only)
exports.createPackage = async (req, res) => {
  try {
    const vendorId = req.user.vendorId;
    
    if (!vendorId) {
      return res.status(403).json({
        success: false,
        message: 'Only vendors can create packages'
      });
    }

    const {
      title,
      description,
      type,
      destination,
      duration,
      price,
      discounted_price,
      available_seats,
      departure_date,
      return_date,
      departure_city,
      itinerary,
      inclusions,
      exclusions,
      terms_conditions,
      cancellation_policy,
      images
    } = req.body;

    // Validate required fields
    if (!title || !type || !destination || !duration || !price || !available_seats) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    // Start transaction
    await db.query('BEGIN');

    // Insert package
    const packageQuery = `
      INSERT INTO packages (
        vendor_id, title, description, type, destination, duration,
        price, discounted_price, available_seats, departure_date, return_date,
        departure_city, itinerary, terms_conditions, cancellation_policy,
        status, created_at, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, 'active', NOW(), NOW())
      RETURNING *
    `;

    const packageResult = await db.query(packageQuery, [
      vendorId, title, description, type, destination, duration,
      price, discounted_price, available_seats, departure_date, return_date,
      departure_city, JSON.stringify(itinerary), terms_conditions, cancellation_policy
    ]);

    const packageId = packageResult.rows[0].id;

    // Insert images
    if (images && images.length > 0) {
      for (let i = 0; i < images.length; i++) {
        await db.query(
          'INSERT INTO package_images (package_id, image_url, display_order) VALUES ($1, $2, $3)',
          [packageId, images[i], i + 1]
        );
      }
    }

    // Insert inclusions
    if (inclusions && inclusions.length > 0) {
      for (let i = 0; i < inclusions.length; i++) {
        await db.query(
          'INSERT INTO package_inclusions (package_id, item, description, display_order) VALUES ($1, $2, $3, $4)',
          [packageId, inclusions[i].item, inclusions[i].description, i + 1]
        );
      }
    }

    // Insert exclusions
    if (exclusions && exclusions.length > 0) {
      for (let i = 0; i < exclusions.length; i++) {
        await db.query(
          'INSERT INTO package_exclusions (package_id, item, description, display_order) VALUES ($1, $2, $3, $4)',
          [packageId, exclusions[i].item, exclusions[i].description, i + 1]
        );
      }
    }

    await db.query('COMMIT');

    res.status(201).json({
      success: true,
      message: 'Package created successfully',
      data: packageResult.rows[0]
    });
  } catch (error) {
    await db.query('ROLLBACK');
    console.error('Create package error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create package',
      error: error.message
    });
  }
};

// Update package (Vendor only)
exports.updatePackage = async (req, res) => {
  try {
    const { id } = req.params;
    const vendorId = req.user.vendorId;

    // Check if package belongs to vendor
    const checkQuery = 'SELECT * FROM packages WHERE id = $1 AND vendor_id = $2';
    const checkResult = await db.query(checkQuery, [id, vendorId]);

    if (checkResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Package not found or unauthorized'
      });
    }

    const {
      title,
      description,
      type,
      destination,
      duration,
      price,
      discounted_price,
      available_seats,
      departure_date,
      return_date,
      departure_city,
      itinerary,
      terms_conditions,
      cancellation_policy,
      status
    } = req.body;

    const updateQuery = `
      UPDATE packages SET
        title = COALESCE($1, title),
        description = COALESCE($2, description),
        type = COALESCE($3, type),
        destination = COALESCE($4, destination),
        duration = COALESCE($5, duration),
        price = COALESCE($6, price),
        discounted_price = COALESCE($7, discounted_price),
        available_seats = COALESCE($8, available_seats),
        departure_date = COALESCE($9, departure_date),
        return_date = COALESCE($10, return_date),
        departure_city = COALESCE($11, departure_city),
        itinerary = COALESCE($12, itinerary),
        terms_conditions = COALESCE($13, terms_conditions),
        cancellation_policy = COALESCE($14, cancellation_policy),
        status = COALESCE($15, status),
        updated_at = NOW()
      WHERE id = $16
      RETURNING *
    `;

    const result = await db.query(updateQuery, [
      title, description, type, destination, duration, price,
      discounted_price, available_seats, departure_date, return_date,
      departure_city, itinerary ? JSON.stringify(itinerary) : null,
      terms_conditions, cancellation_policy, status, id
    ]);

    res.json({
      success: true,
      message: 'Package updated successfully',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Update package error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update package',
      error: error.message
    });
  }
};

// Delete package (Vendor only - soft delete)
exports.deletePackage = async (req, res) => {
  try {
    const { id } = req.params;
    const vendorId = req.user.vendorId;

    // Check if package belongs to vendor
    const checkQuery = 'SELECT * FROM packages WHERE id = $1 AND vendor_id = $2';
    const checkResult = await db.query(checkQuery, [id, vendorId]);

    if (checkResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Package not found or unauthorized'
      });
    }

    // Soft delete
    await db.query(
      "UPDATE packages SET status = 'deleted', deleted_at = NOW() WHERE id = $1",
      [id]
    );

    res.json({
      success: true,
      message: 'Package deleted successfully'
    });
  } catch (error) {
    console.error('Delete package error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete package',
      error: error.message
    });
  }
};

// Get package availability
exports.getPackageAvailability = async (req, res) => {
  try {
    const { id } = req.params;

    const query = `
      SELECT 
        p.available_seats,
        p.departure_date,
        p.return_date,
        (SELECT COUNT(*) FROM bookings WHERE package_id = p.id AND status NOT IN ('cancelled', 'refunded')) as booked_seats,
        (p.available_seats - (SELECT COUNT(*) FROM bookings WHERE package_id = p.id AND status NOT IN ('cancelled', 'refunded'))) as remaining_seats
      FROM packages p
      WHERE p.id = $1
    `;

    const result = await db.query(query, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Package not found'
      });
    }

    res.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Get availability error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch availability',
      error: error.message
    });
  }
};

// Get vendor packages
exports.getVendorPackages = async (req, res) => {
  try {
    const vendorId = req.user.vendorId;
    const { page = 1, limit = 10, status } = req.query;
    const offset = (page - 1) * limit;

    let whereClause = 'vendor_id = $1';
    const queryParams = [vendorId];
    let paramIndex = 2;

    if (status) {
      whereClause += ` AND status = $${paramIndex++}`;
      queryParams.push(status);
    }

    // Get total count
    const countQuery = `SELECT COUNT(*) FROM packages WHERE ${whereClause}`;
    const countResult = await db.query(countQuery, queryParams);
    const totalPackages = parseInt(countResult.rows[0].count);

    // Get packages
    const packagesQuery = `
      SELECT 
        p.*,
        (SELECT COUNT(*) FROM bookings WHERE package_id = p.id) as total_bookings,
        (SELECT AVG(rating) FROM reviews WHERE package_id = p.id) as avg_rating,
        (SELECT COUNT(*) FROM reviews WHERE package_id = p.id) as review_count
      FROM packages p
      WHERE ${whereClause}
      ORDER BY created_at DESC
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `;

    queryParams.push(limit, offset);
    const packagesResult = await db.query(packagesQuery, queryParams);

    res.json({
      success: true,
      data: {
        packages: packagesResult.rows,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(totalPackages / limit),
          totalPackages,
          limit: parseInt(limit)
        }
      }
    });
  } catch (error) {
    console.error('Get vendor packages error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch packages',
      error: error.message
    });
  }
};

module.exports = exports;
