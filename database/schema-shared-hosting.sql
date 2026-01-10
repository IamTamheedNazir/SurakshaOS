-- UmrahConnect 2.0 Database Schema
-- MySQL 8.0+ / MariaDB 10.5+
-- For Shared Hosting / cPanel environments
-- NO DATABASE CREATION - Use existing database

-- ============================================
-- IMPORTANT: Run this in your existing database
-- Do NOT include CREATE DATABASE command
-- ============================================

-- ============================================
-- USERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS users (
    id CHAR(36) PRIMARY KEY,
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
CREATE TABLE IF NOT EXISTS vendors (
    id CHAR(36) PRIMARY KEY,
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
CREATE TABLE IF NOT EXISTS vendor_documents (
    id CHAR(36) PRIMARY KEY,
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
CREATE TABLE IF NOT EXISTS packages (
    id CHAR(36) PRIMARY KEY,
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
CREATE TABLE IF NOT EXISTS package_images (
    id CHAR(36) PRIMARY KEY,
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
CREATE TABLE IF NOT EXISTS package_inclusions (
    id CHAR(36) PRIMARY KEY,
    package_id CHAR(36) NOT NULL,
    inclusion_text VARCHAR(500) NOT NULL,
    display_order INT DEFAULT 0,
    FOREIGN KEY (package_id) REFERENCES packages(id) ON DELETE CASCADE,
    INDEX idx_package_id (package_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- PACKAGE EXCLUSIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS package_exclusions (
    id CHAR(36) PRIMARY KEY,
    package_id CHAR(36) NOT NULL,
    exclusion_text VARCHAR(500) NOT NULL,
    display_order INT DEFAULT 0,
    FOREIGN KEY (package_id) REFERENCES packages(id) ON DELETE CASCADE,
    INDEX idx_package_id (package_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- BOOKINGS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS bookings (
    id CHAR(36) PRIMARY KEY,
    booking_number VARCHAR(50) UNIQUE NOT NULL,
    user_id CHAR(36) NOT NULL,
    package_id CHAR(36) NOT NULL,
    departure_date DATE NOT NULL,
    adults INT DEFAULT 1,
    children INT DEFAULT 0,
    infants INT DEFAULT 0,
    total_amount DECIMAL(12,2) NOT NULL,
    paid_amount DECIMAL(12,2) DEFAULT 0.00,
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
CREATE TABLE IF NOT EXISTS booking_travelers (
    id CHAR(36) PRIMARY KEY,
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
CREATE TABLE IF NOT EXISTS payments (
    id CHAR(36) PRIMARY KEY,
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
CREATE TABLE IF NOT EXISTS refunds (
    id CHAR(36) PRIMARY KEY,
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
CREATE TABLE IF NOT EXISTS reviews (
    id CHAR(36) PRIMARY KEY,
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
CREATE TABLE IF NOT EXISTS notifications (
    id CHAR(36) PRIMARY KEY,
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
CREATE TABLE IF NOT EXISTS booking_documents (
    id CHAR(36) PRIMARY KEY,
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
CREATE TABLE IF NOT EXISTS settings (
    id CHAR(36) PRIMARY KEY,
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
CREATE TABLE IF NOT EXISTS activity_logs (
    id CHAR(36) PRIMARY KEY,
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
INSERT IGNORE INTO settings (id, setting_key, setting_value, setting_type, description) VALUES
(UUID(), 'site_name', 'UmrahConnect', 'string', 'Website name'),
(UUID(), 'site_email', 'info@umrahconnect.com', 'string', 'Contact email'),
(UUID(), 'site_phone', '+91-1234567890', 'string', 'Contact phone'),
(UUID(), 'currency', 'INR', 'string', 'Default currency'),
(UUID(), 'commission_rate', '10', 'number', 'Default commission rate (%)'),
(UUID(), 'booking_prefix', 'UC', 'string', 'Booking number prefix'),
(UUID(), 'enable_reviews', 'true', 'boolean', 'Enable review system'),
(UUID(), 'enable_notifications', 'true', 'boolean', 'Enable notifications'),
(UUID(), 'maintenance_mode', 'false', 'boolean', 'Maintenance mode');

-- ============================================
-- CREATE DEFAULT ADMIN USER
-- ============================================
-- Password: Admin@123 (you'll need to hash this properly in your app)
INSERT IGNORE INTO users (id, email, password, first_name, last_name, role, status, email_verified) VALUES
(UUID(), 'admin@umrahconnect.com', '$2b$10$rKZLvXZnN5aKjH5qYvXqXeYvXqXeYvXqXeYvXqXeYvXqXeYvXqXe', 'Admin', 'User', 'admin', 'active', TRUE);

-- ============================================
-- SCHEMA COMPLETE
-- ============================================
-- Total Tables: 17
-- All tables use IF NOT EXISTS for safety
-- No database creation commands
-- Compatible with shared hosting
-- ============================================
