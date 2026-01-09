-- UmrahConnect 2.0 - Complete MySQL Database Schema
-- Run this SQL file in phpMyAdmin to create all tables

-- ============================================
-- 1. USERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS `users` (
  `id` VARCHAR(36) PRIMARY KEY,
  `email` VARCHAR(255) UNIQUE NOT NULL,
  `password` VARCHAR(255),
  `phone` VARCHAR(20),
  `first_name` VARCHAR(100),
  `last_name` VARCHAR(100),
  `avatar` TEXT,
  `role` ENUM('customer', 'vendor', 'admin', 'support', 'accountant') DEFAULT 'customer',
  `email_verified` BOOLEAN DEFAULT FALSE,
  `phone_verified` BOOLEAN DEFAULT FALSE,
  `status` ENUM('active', 'inactive', 'suspended', 'banned') DEFAULT 'active',
  `language` VARCHAR(5) DEFAULT 'en',
  `currency` VARCHAR(3) DEFAULT 'INR',
  `timezone` VARCHAR(50) DEFAULT 'Asia/Kolkata',
  `referral_code` VARCHAR(20) UNIQUE,
  `referred_by` VARCHAR(36),
  `loyalty_points` INT DEFAULT 0,
  `loyalty_tier` VARCHAR(20) DEFAULT 'Bronze',
  `last_login` TIMESTAMP NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_email` (`email`),
  INDEX `idx_role` (`role`),
  INDEX `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 2. VENDORS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS `vendors` (
  `id` VARCHAR(36) PRIMARY KEY,
  `user_id` VARCHAR(36) UNIQUE NOT NULL,
  `company_name` VARCHAR(255) NOT NULL,
  `company_logo` TEXT,
  `description` TEXT,
  `license_number` VARCHAR(100),
  `tax_id` VARCHAR(50),
  `website` VARCHAR(255),
  `address` TEXT,
  `city` VARCHAR(100),
  `state` VARCHAR(100),
  `country` VARCHAR(100),
  `postal_code` VARCHAR(20),
  `bank_name` VARCHAR(255),
  `bank_account_number` VARCHAR(50),
  `bank_ifsc` VARCHAR(20),
  `bank_account_holder` VARCHAR(255),
  `verification_status` ENUM('pending', 'verified', 'rejected') DEFAULT 'pending',
  `verification_documents` JSON,
  `rating` DECIMAL(3,2) DEFAULT 0.00,
  `total_reviews` INT DEFAULT 0,
  `total_bookings` INT DEFAULT 0,
  `total_revenue` DECIMAL(15,2) DEFAULT 0.00,
  `subscription_plan` VARCHAR(50) DEFAULT 'free',
  `subscription_status` ENUM('active', 'expired', 'cancelled') DEFAULT 'active',
  `subscription_expires_at` TIMESTAMP NULL,
  `commission_rate` DECIMAL(5,2) DEFAULT 15.00,
  `featured` BOOLEAN DEFAULT FALSE,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  INDEX `idx_user_id` (`user_id`),
  INDEX `idx_verification_status` (`verification_status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 3. PACKAGES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS `packages` (
  `id` VARCHAR(36) PRIMARY KEY,
  `vendor_id` VARCHAR(36) NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `slug` VARCHAR(255) UNIQUE NOT NULL,
  `description` TEXT,
  `short_description` TEXT,
  `images` JSON,
  `category` VARCHAR(50),
  `duration_days` INT NOT NULL,
  `duration_nights` INT NOT NULL,
  `departure_city` VARCHAR(100),
  `departure_date` DATE,
  `return_date` DATE,
  `price` DECIMAL(15,2) NOT NULL,
  `original_price` DECIMAL(15,2),
  `discount_percentage` DECIMAL(5,2) DEFAULT 0.00,
  `currency` VARCHAR(3) DEFAULT 'INR',
  `max_people` INT,
  `available_seats` INT,
  `min_age` INT,
  `max_age` INT,
  `inclusions` JSON,
  `exclusions` JSON,
  `itinerary` JSON,
  `hotels` JSON,
  `flights` JSON,
  `visa_included` BOOLEAN DEFAULT FALSE,
  `insurance_included` BOOLEAN DEFAULT FALSE,
  `meal_plan` VARCHAR(50),
  `transportation` VARCHAR(50),
  `status` ENUM('draft', 'published', 'archived') DEFAULT 'draft',
  `featured` BOOLEAN DEFAULT FALSE,
  `sponsored` BOOLEAN DEFAULT FALSE,
  `views` INT DEFAULT 0,
  `bookings` INT DEFAULT 0,
  `rating` DECIMAL(3,2) DEFAULT 0.00,
  `total_reviews` INT DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`vendor_id`) REFERENCES `vendors`(`id`) ON DELETE CASCADE,
  INDEX `idx_vendor_id` (`vendor_id`),
  INDEX `idx_slug` (`slug`),
  INDEX `idx_status` (`status`),
  INDEX `idx_featured` (`featured`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 4. BOOKINGS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS `bookings` (
  `id` VARCHAR(36) PRIMARY KEY,
  `booking_number` VARCHAR(20) UNIQUE NOT NULL,
  `user_id` VARCHAR(36) NOT NULL,
  `vendor_id` VARCHAR(36) NOT NULL,
  `package_id` VARCHAR(36) NOT NULL,
  `travelers` JSON NOT NULL,
  `total_travelers` INT NOT NULL,
  `adults` INT DEFAULT 0,
  `children` INT DEFAULT 0,
  `infants` INT DEFAULT 0,
  `departure_date` DATE NOT NULL,
  `return_date` DATE NOT NULL,
  `package_price` DECIMAL(15,2) NOT NULL,
  `discount_amount` DECIMAL(15,2) DEFAULT 0.00,
  `tax_amount` DECIMAL(15,2) DEFAULT 0.00,
  `total_amount` DECIMAL(15,2) NOT NULL,
  `currency` VARCHAR(3) DEFAULT 'INR',
  `payment_status` ENUM('pending', 'partial', 'paid', 'refunded', 'failed') DEFAULT 'pending',
  `booking_status` ENUM('pending', 'confirmed', 'cancelled', 'completed') DEFAULT 'pending',
  `special_requests` TEXT,
  `documents` JSON,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`vendor_id`) REFERENCES `vendors`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`package_id`) REFERENCES `packages`(`id`) ON DELETE CASCADE,
  INDEX `idx_booking_number` (`booking_number`),
  INDEX `idx_user_id` (`user_id`),
  INDEX `idx_vendor_id` (`vendor_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 5. PAYMENTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS `payments` (
  `id` VARCHAR(36) PRIMARY KEY,
  `payment_id` VARCHAR(100) UNIQUE NOT NULL,
  `booking_id` VARCHAR(36) NOT NULL,
  `user_id` VARCHAR(36) NOT NULL,
  `vendor_id` VARCHAR(36) NOT NULL,
  `amount` DECIMAL(15,2) NOT NULL,
  `currency` VARCHAR(3) DEFAULT 'INR',
  `payment_method` ENUM('razorpay', 'stripe', 'paypal', 'bank_transfer', 'upi', 'cash') NOT NULL,
  `payment_gateway` VARCHAR(50),
  `gateway_payment_id` VARCHAR(255),
  `status` ENUM('pending', 'processing', 'completed', 'failed', 'refunded') DEFAULT 'pending',
  `payment_date` TIMESTAMP NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`booking_id`) REFERENCES `bookings`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  INDEX `idx_payment_id` (`payment_id`),
  INDEX `idx_booking_id` (`booking_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 6. SETTINGS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS `settings` (
  `id` VARCHAR(36) PRIMARY KEY,
  `setting_key` VARCHAR(100) UNIQUE NOT NULL,
  `setting_value` TEXT,
  `type` VARCHAR(50),
  `category` VARCHAR(50),
  `description` TEXT,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_key` (`setting_key`),
  INDEX `idx_category` (`category`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 7. CURRENCIES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS `currencies` (
  `id` VARCHAR(36) PRIMARY KEY,
  `code` VARCHAR(3) UNIQUE NOT NULL,
  `name` VARCHAR(100) NOT NULL,
  `symbol` VARCHAR(10) NOT NULL,
  `flag` VARCHAR(10),
  `exchange_rate` DECIMAL(15,6) NOT NULL,
  `is_default` BOOLEAN DEFAULT FALSE,
  `enabled` BOOLEAN DEFAULT TRUE,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_code` (`code`),
  INDEX `idx_enabled` (`enabled`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 8. LANGUAGES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS `languages` (
  `id` VARCHAR(36) PRIMARY KEY,
  `code` VARCHAR(5) UNIQUE NOT NULL,
  `name` VARCHAR(100) NOT NULL,
  `native_name` VARCHAR(100) NOT NULL,
  `flag` VARCHAR(10),
  `direction` ENUM('ltr', 'rtl') DEFAULT 'ltr',
  `is_default` BOOLEAN DEFAULT FALSE,
  `enabled` BOOLEAN DEFAULT TRUE,
  `translation_progress` INT DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_code` (`code`),
  INDEX `idx_enabled` (`enabled`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- INSERT DEFAULT DATA
-- ============================================

-- Insert default settings
INSERT INTO `settings` (`id`, `setting_key`, `setting_value`, `category`) VALUES
(UUID(), 'app_name', 'UmrahConnect', 'general'),
(UUID(), 'app_url', 'https://yourdomain.com', 'general'),
(UUID(), 'default_currency', 'INR', 'general'),
(UUID(), 'default_language', 'en', 'general'),
(UUID(), 'timezone', 'Asia/Kolkata', 'general');

-- Insert default currencies
INSERT INTO `currencies` (`id`, `code`, `name`, `symbol`, `flag`, `exchange_rate`, `is_default`, `enabled`) VALUES
(UUID(), 'INR', 'Indian Rupee', '₹', '🇮🇳', 1.000000, TRUE, TRUE),
(UUID(), 'USD', 'US Dollar', '$', '🇺🇸', 0.012000, FALSE, TRUE),
(UUID(), 'EUR', 'Euro', '€', '🇪🇺', 0.011000, FALSE, TRUE),
(UUID(), 'GBP', 'British Pound', '£', '🇬🇧', 0.009500, FALSE, TRUE),
(UUID(), 'AED', 'UAE Dirham', 'د.إ', '🇦🇪', 0.044000, FALSE, TRUE),
(UUID(), 'SAR', 'Saudi Riyal', 'ر.س', '🇸🇦', 0.045000, FALSE, TRUE);

-- Insert default languages
INSERT INTO `languages` (`id`, `code`, `name`, `native_name`, `flag`, `direction`, `is_default`, `enabled`, `translation_progress`) VALUES
(UUID(), 'en', 'English', 'English', '🇬🇧', 'ltr', TRUE, TRUE, 100),
(UUID(), 'ar', 'Arabic', 'العربية', '🇸🇦', 'rtl', FALSE, TRUE, 95),
(UUID(), 'ur', 'Urdu', 'اردو', '🇵🇰', 'rtl', FALSE, TRUE, 88),
(UUID(), 'hi', 'Hindi', 'हिन्दी', '🇮🇳', 'ltr', FALSE, TRUE, 92);

-- ============================================
-- SUCCESS MESSAGE
-- ============================================
SELECT 'Database tables created successfully!' AS message;
SELECT 'Default data inserted successfully!' AS message;
SELECT 'You can now create your admin account.' AS message;
