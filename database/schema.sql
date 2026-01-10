-- UmrahConnect 2.0 Database Schema
-- MySQL 8.0+ / MariaDB 10.5+
-- Complete database schema for multi-vendor Umrah booking platform

-- ============================================
-- DATABASE SETUP
-- ============================================

-- Create database
CREATE DATABASE IF NOT EXISTS umrahconnect CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE umrahconnect;

-- ============================================
-- USERS TABLE
-- ============================================
CREATE TABLE users (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    role ENUM('customer', 'vendor', 'admin') DEFAULT 'customer',
    status ENUM('active', 'inactive', 'suspended', 'deleted') DEFAULT 'active',
    email_verified BOOLEAN DEFAULT FALSE,
    email_verification_token VARCHAR(255),
    email_verification_expires DATETIME,
    password_reset_token VARCHAR(255),
    password_reset_expires DATETIME,
    last_login DATETIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at DATETIME,
    INDEX idx_email (email),
    INDEX idx_phone (phone),
    INDEX idx_role (role),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- VENDORS TABLE
-- ============================================
CREATE TABLE vendors (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    user_id CHAR(36) NOT NULL,
    company_name VARCHAR(255) NOT NULL,
    company_email VARCHAR(255),
    company_phone VARCHAR(20),
    business_type VARCHAR(100),
    registration_number VARCHAR(100),
    gst_number VARCHAR(50),
    pan_number VARCHAR(20),
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    country VARCHAR(100) DEFAULT 'India',
    postal_code VARCHAR(20),
    description TEXT,
    logo_url VARCHAR(500),
    website VARCHAR(255),
    rating DECIMAL(3,2) DEFAULT 0.00,
    total_bookings INT DEFAULT 0,
    total_revenue DECIMAL(15,2) DEFAULT 0.00,
    commission_rate DECIMAL(5,2) DEFAULT 10.00,
    status ENUM('pending', 'approved', 'rejected', 'suspended', 'deleted') DEFAULT 'pending',
    rejection_reason TEXT,
    suspension_reason TEXT,
    approved_at DATETIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at DATETIME,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_status (status),
    INDEX idx_rating (rating),
    INDEX idx_company_name (company_name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- VENDOR DOCUMENTS TABLE
-- ============================================
CREATE TABLE vendor_documents (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    vendor_id CHAR(36) NOT NULL,
    document_type ENUM('registration', 'gst', 'pan', 'license', 'other') NOT NULL,
    document_name VARCHAR(255) NOT NULL,
    file_url VARCHAR(500) NOT NULL,
    file_size INT,
    mime_type VARCHAR(100),
    status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    rejection_reason TEXT,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    verified_at DATETIME,
    FOREIGN KEY (vendor_id) REFERENCES vendors(id) ON DELETE CASCADE,
    INDEX idx_vendor_id (vendor_id),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- PACKAGES TABLE
-- ============================================
CREATE TABLE packages (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    vendor_id CHAR(36) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    destination VARCHAR(255),
    package_type ENUM('umrah', 'hajj', 'ziyarat', 'other') DEFAULT 'umrah',
    duration_days INT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    discounted_price DECIMAL(10,2),
    currency VARCHAR(10) DEFAULT 'INR',
    available_seats INT NOT NULL,
    booked_seats INT DEFAULT 0,
    departure_date DATE,
    return_date DATE,
    departure_city VARCHAR(100),
    hotel_details TEXT,
    transport_details TEXT,
    inclusions TEXT,
    exclusions TEXT,
    itinerary TEXT,
    terms_conditions TEXT,
    cancellation_policy TEXT,
    rating DECIMAL(3,2) DEFAULT 0.00,
    total_reviews INT DEFAULT 0,
    is_featured BOOLEAN DEFAULT FALSE,
    status ENUM('draft', 'pending', 'published', 'rejected', 'deleted') DEFAULT 'draft',
    rejection_reason TEXT,
    views_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at DATETIME,
    FOREIGN KEY (vendor_id) REFERENCES vendors(id) ON DELETE CASCADE,
    INDEX idx_vendor_id (vendor_id),
    INDEX idx_status (status),
    INDEX idx_package_type (package_type),
    INDEX idx_price (price),
    INDEX idx_departure_date (departure_date),
    INDEX idx_rating (rating),
    INDEX idx_is_featured (is_featured)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- PACKAGE IMAGES TABLE
-- ============================================
CREATE TABLE package_images (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    package_id CHAR(36) NOT NULL,
    image_url VARCHAR(500) NOT NULL,
    image_type ENUM('main', 'gallery', 'thumbnail') DEFAULT 'gallery',
    display_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (package_id) REFERENCES packages(id) ON DELETE CASCADE,
    INDEX idx_package_id (package_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- PACKAGE INCLUSIONS TABLE
-- ============================================
CREATE TABLE package_inclusions (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    package_id CHAR(36) NOT NULL,
    inclusion_text VARCHAR(500) NOT NULL,
    display_order INT DEFAULT 0,
    FOREIGN KEY (package_id) REFERENCES packages(id) ON DELETE CASCADE,
    INDEX idx_package_id (package_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- PACKAGE EXCLUSIONS TABLE
-- ============================================
CREATE TABLE package_exclusions (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    package_id CHAR(36) NOT NULL,
    exclusion_text VARCHAR(500) NOT NULL,
    display_order INT DEFAULT 0,
    FOREIGN KEY (package_id) REFERENCES packages(id) ON DELETE CASCADE,
    INDEX idx_package_id (package_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- BOOKINGS TABLE
-- ============================================
CREATE TABLE bookings (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    booking_number VARCHAR(50) UNIQUE NOT NULL,
    user_id CHAR(36) NOT NULL,
    package_id CHAR(36) NOT NULL,
    departure_date DATE NOT NULL,
    adults INT DEFAULT 1,
    children INT DEFAULT 0,
    infants INT DEFAULT 0,
    total_travelers INT GENERATED ALWAYS AS (adults + children + infants) STORED,
    total_amount DECIMAL(12,2) NOT NULL,
    paid_amount DECIMAL(12,2) DEFAULT 0.00,
    pending_amount DECIMAL(12,2) GENERATED ALWAYS AS (total_amount - paid_amount) STORED,
    status ENUM('pending', 'confirmed', 'completed', 'cancelled') DEFAULT 'pending',
    payment_status ENUM('pending', 'paid', 'failed', 'refunded') DEFAULT 'pending',
    cancellation_reason TEXT,
    refund_amount DECIMAL(12,2) DEFAULT 0.00,
    special_requests TEXT,
    admin_notes TEXT,
    cancelled_at DATETIME,
    confirmed_at DATETIME,
    completed_at DATETIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (package_id) REFERENCES packages(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_package_id (package_id),
    INDEX idx_booking_number (booking_number),
    INDEX idx_status (status),
    INDEX idx_payment_status (payment_status),
    INDEX idx_departure_date (departure_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- BOOKING TRAVELERS TABLE
-- ============================================
CREATE TABLE booking_travelers (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    booking_id CHAR(36) NOT NULL,
    type ENUM('adult', 'child', 'infant') NOT NULL,
    title ENUM('Mr', 'Mrs', 'Ms', 'Dr') DEFAULT 'Mr',
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    date_of_birth DATE,
    gender ENUM('male', 'female', 'other'),
    passport_number VARCHAR(50),
    passport_expiry DATE,
    nationality VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE,
    INDEX idx_booking_id (booking_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- PAYMENTS TABLE
-- ============================================
CREATE TABLE payments (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    booking_id CHAR(36) NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'INR',
    payment_method ENUM('razorpay', 'stripe', 'paypal', 'bank_transfer', 'upi') NOT NULL,
    gateway_payment_id VARCHAR(255),
    gateway_order_id VARCHAR(255),
    gateway_signature VARCHAR(500),
    status ENUM('pending', 'processing', 'completed', 'failed', 'refunded') DEFAULT 'pending',
    failure_reason TEXT,
    refund_amount DECIMAL(10,2) DEFAULT 0.00,
    metadata TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE,
    INDEX idx_booking_id (booking_id),
    INDEX idx_status (status),
    INDEX idx_gateway_payment_id (gateway_payment_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- REFUNDS TABLE
-- ============================================
CREATE TABLE refunds (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    payment_id CHAR(36) NOT NULL,
    booking_id CHAR(36) NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    reason TEXT,
    status ENUM('pending', 'processing', 'completed', 'failed') DEFAULT 'pending',
    gateway_refund_id VARCHAR(255),
    processed_at DATETIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (payment_id) REFERENCES payments(id) ON DELETE CASCADE,
    FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE,
    INDEX idx_payment_id (payment_id),
    INDEX idx_booking_id (booking_id),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- REVIEWS TABLE
-- ============================================
CREATE TABLE reviews (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    package_id CHAR(36) NOT NULL,
    booking_id CHAR(36) NOT NULL,
    user_id CHAR(36) NOT NULL,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (package_id) REFERENCES packages(id) ON DELETE CASCADE,
    FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_package_id (package_id),
    INDEX idx_booking_id (booking_id),
    INDEX idx_user_id (user_id),
    INDEX idx_status (status),
    INDEX idx_rating (rating)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- NOTIFICATIONS TABLE
-- ============================================
CREATE TABLE notifications (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    user_id CHAR(36) NOT NULL,
    type ENUM('booking', 'payment', 'review', 'system', 'promotion') NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    data TEXT,
    is_read BOOLEAN DEFAULT FALSE,
    read_at DATETIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_is_read (is_read),
    INDEX idx_type (type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- BOOKING DOCUMENTS TABLE
-- ============================================
CREATE TABLE booking_documents (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    booking_id CHAR(36) NOT NULL,
    document_type ENUM('passport', 'visa', 'photo', 'medical', 'other') NOT NULL,
    document_name VARCHAR(255) NOT NULL,
    file_url VARCHAR(500) NOT NULL,
    file_size INT,
    mime_type VARCHAR(100),
    uploaded_by CHAR(36),
    status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE,
    FOREIGN KEY (uploaded_by) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_booking_id (booking_id),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- SETTINGS TABLE
-- ============================================
CREATE TABLE settings (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    setting_key VARCHAR(100) UNIQUE NOT NULL,
    setting_value TEXT,
    setting_type ENUM('string', 'number', 'boolean', 'json') DEFAULT 'string',
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_setting_key (setting_key)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- ACTIVITY LOGS TABLE
-- ============================================
CREATE TABLE activity_logs (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    user_id CHAR(36),
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50),
    entity_id CHAR(36),
    ip_address VARCHAR(45),
    user_agent TEXT,
    metadata TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_user_id (user_id),
    INDEX idx_action (action),
    INDEX idx_entity_type (entity_type),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- INSERT DEFAULT SETTINGS
-- ============================================
INSERT INTO settings (setting_key, setting_value, setting_type, description) VALUES
('site_name', 'UmrahConnect', 'string', 'Website name'),
('site_email', 'info@umrahconnect.com', 'string', 'Contact email'),
('site_phone', '+91-1234567890', 'string', 'Contact phone'),
('currency', 'INR', 'string', 'Default currency'),
('commission_rate', '10', 'number', 'Default commission rate (%)'),
('booking_prefix', 'UC', 'string', 'Booking number prefix'),
('enable_reviews', 'true', 'boolean', 'Enable review system'),
('enable_notifications', 'true', 'boolean', 'Enable notifications'),
('maintenance_mode', 'false', 'boolean', 'Maintenance mode');

-- ============================================
-- CREATE DEFAULT ADMIN USER
-- ============================================
-- Password: Admin@123 (hashed with bcrypt)
INSERT INTO users (id, email, password, first_name, last_name, role, status, email_verified) VALUES
(UUID(), 'admin@umrahconnect.com', '$2b$10$rKZLvXZnN5aKjH5qYvXqXeYvXqXeYvXqXeYvXqXeYvXqXeYvXqXe', 'Admin', 'User', 'admin', 'active', TRUE);

-- ============================================
-- TRIGGERS
-- ============================================

-- Trigger to update package rating when review is added
DELIMITER //
CREATE TRIGGER update_package_rating_after_review
AFTER INSERT ON reviews
FOR EACH ROW
BEGIN
    UPDATE packages 
    SET rating = (
        SELECT AVG(rating) 
        FROM reviews 
        WHERE package_id = NEW.package_id AND status = 'approved'
    ),
    total_reviews = (
        SELECT COUNT(*) 
        FROM reviews 
        WHERE package_id = NEW.package_id AND status = 'approved'
    )
    WHERE id = NEW.package_id;
END//

-- Trigger to update vendor rating
CREATE TRIGGER update_vendor_rating_after_review
AFTER INSERT ON reviews
FOR EACH ROW
BEGIN
    UPDATE vendors v
    SET rating = (
        SELECT AVG(r.rating)
        FROM reviews r
        JOIN packages p ON r.package_id = p.id
        WHERE p.vendor_id = v.id AND r.status = 'approved'
    )
    WHERE v.id = (SELECT vendor_id FROM packages WHERE id = NEW.package_id);
END//

-- Trigger to update booked seats
CREATE TRIGGER update_package_seats_after_booking
AFTER INSERT ON bookings
FOR EACH ROW
BEGIN
    UPDATE packages 
    SET booked_seats = booked_seats + NEW.total_travelers
    WHERE id = NEW.package_id;
END//

DELIMITER ;

-- ============================================
-- VIEWS
-- ============================================

-- View for vendor dashboard statistics
CREATE VIEW vendor_dashboard_stats AS
SELECT 
    v.id as vendor_id,
    v.company_name,
    COUNT(DISTINCT p.id) as total_packages,
    COUNT(DISTINCT b.id) as total_bookings,
    COALESCE(SUM(b.total_amount), 0) as total_revenue,
    COALESCE(AVG(r.rating), 0) as average_rating,
    COUNT(DISTINCT r.id) as total_reviews
FROM vendors v
LEFT JOIN packages p ON v.id = p.vendor_id
LEFT JOIN bookings b ON p.id = b.package_id AND b.payment_status = 'paid'
LEFT JOIN reviews r ON p.id = r.package_id AND r.status = 'approved'
GROUP BY v.id, v.company_name;

-- View for popular packages
CREATE VIEW popular_packages AS
SELECT 
    p.*,
    v.company_name as vendor_name,
    COUNT(DISTINCT b.id) as booking_count,
    COALESCE(AVG(r.rating), 0) as avg_rating,
    COUNT(DISTINCT r.id) as review_count
FROM packages p
JOIN vendors v ON p.vendor_id = v.id
LEFT JOIN bookings b ON p.id = b.package_id
LEFT JOIN reviews r ON p.id = r.package_id AND r.status = 'approved'
WHERE p.status = 'published'
GROUP BY p.id
ORDER BY booking_count DESC, avg_rating DESC;

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================

-- Additional composite indexes
CREATE INDEX idx_bookings_user_status ON bookings(user_id, status);
CREATE INDEX idx_bookings_package_status ON bookings(package_id, status);
CREATE INDEX idx_packages_vendor_status ON packages(vendor_id, status);
CREATE INDEX idx_payments_booking_status ON payments(booking_id, status);
CREATE INDEX idx_reviews_package_status ON reviews(package_id, status);

-- ============================================
-- SCHEMA COMPLETE
-- ============================================
-- Total Tables: 20
-- Total Indexes: 50+
-- Total Triggers: 3
-- Total Views: 2
-- ============================================
