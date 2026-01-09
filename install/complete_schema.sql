-- UmrahConnect 2.0 - Complete Dynamic System Database Schema
-- This includes ALL tables for a fully functional dynamic system

-- ============================================
-- CONFIGURATION TABLES
-- ============================================

-- Payment Gateway Settings
CREATE TABLE IF NOT EXISTS `payment_gateway_settings` (
  `id` VARCHAR(36) PRIMARY KEY,
  `gateway_name` VARCHAR(50) NOT NULL,
  `display_name` VARCHAR(100),
  `api_key` TEXT,
  `api_secret` TEXT,
  `webhook_secret` TEXT,
  `mode` ENUM('test', 'live') DEFAULT 'test',
  `enabled` BOOLEAN DEFAULT TRUE,
  `transaction_fee_percentage` DECIMAL(5,2) DEFAULT 0,
  `transaction_fee_fixed` DECIMAL(10,2) DEFAULT 0,
  `config` JSON,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_gateway_name` (`gateway_name`),
  INDEX `idx_enabled` (`enabled`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Email Settings
CREATE TABLE IF NOT EXISTS `email_settings` (
  `id` VARCHAR(36) PRIMARY KEY,
  `smtp_host` VARCHAR(255),
  `smtp_port` INT,
  `smtp_username` VARCHAR(255),
  `smtp_password` TEXT,
  `smtp_encryption` ENUM('ssl', 'tls', 'none') DEFAULT 'tls',
  `from_name` VARCHAR(255),
  `from_email` VARCHAR(255),
  `enabled` BOOLEAN DEFAULT TRUE,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- SMS Settings
CREATE TABLE IF NOT EXISTS `sms_settings` (
  `id` VARCHAR(36) PRIMARY KEY,
  `provider` VARCHAR(50) NOT NULL,
  `api_key` TEXT,
  `api_secret` TEXT,
  `sender_id` VARCHAR(20),
  `phone_number` VARCHAR(20),
  `enabled` BOOLEAN DEFAULT TRUE,
  `config` JSON,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_provider` (`provider`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Storage Settings
CREATE TABLE IF NOT EXISTS `storage_settings` (
  `id` VARCHAR(36) PRIMARY KEY,
  `provider` VARCHAR(50) NOT NULL,
  `access_key` TEXT,
  `secret_key` TEXT,
  `bucket_name` VARCHAR(255),
  `region` VARCHAR(50),
  `endpoint` VARCHAR(255),
  `is_default` BOOLEAN DEFAULT FALSE,
  `enabled` BOOLEAN DEFAULT TRUE,
  `config` JSON,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_provider` (`provider`),
  INDEX `idx_is_default` (`is_default`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Analytics Settings
CREATE TABLE IF NOT EXISTS `analytics_settings` (
  `id` VARCHAR(36) PRIMARY KEY,
  `provider` VARCHAR(50) NOT NULL,
  `tracking_id` VARCHAR(255),
  `config` JSON,
  `enabled` BOOLEAN DEFAULT TRUE,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_provider` (`provider`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Social Login Settings
CREATE TABLE IF NOT EXISTS `social_login_settings` (
  `id` VARCHAR(36) PRIMARY KEY,
  `provider` VARCHAR(50) NOT NULL,
  `client_id` TEXT,
  `client_secret` TEXT,
  `redirect_url` VARCHAR(255),
  `enabled` BOOLEAN DEFAULT TRUE,
  `config` JSON,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_provider` (`provider`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- VENDOR MANAGEMENT TABLES
-- ============================================

-- Vendor Documents
CREATE TABLE IF NOT EXISTS `vendor_documents` (
  `id` VARCHAR(36) PRIMARY KEY,
  `vendor_id` VARCHAR(36) NOT NULL,
  `document_type` ENUM('gst', 'pan', 'hajj_certificate', 'umrah_certificate', 'tourism_license', 'trade_license', 'bank_statement', 'address_proof', 'identity_proof') NOT NULL,
  `document_number` VARCHAR(100),
  `document_file` TEXT,
  `issue_date` DATE,
  `expiry_date` DATE,
  `verification_status` ENUM('pending', 'verified', 'rejected') DEFAULT 'pending',
  `verified_by` VARCHAR(36),
  `verified_at` TIMESTAMP NULL,
  `rejection_reason` TEXT,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`vendor_id`) REFERENCES `vendors`(`id`) ON DELETE CASCADE,
  INDEX `idx_vendor_id` (`vendor_id`),
  INDEX `idx_document_type` (`document_type`),
  INDEX `idx_verification_status` (`verification_status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Commission Rules
CREATE TABLE IF NOT EXISTS `commission_rules` (
  `id` VARCHAR(36) PRIMARY KEY,
  `rule_name` VARCHAR(100) NOT NULL,
  `rule_type` ENUM('global', 'vendor', 'category', 'package') NOT NULL,
  `target_id` VARCHAR(36),
  `commission_percentage` DECIMAL(5,2) NOT NULL,
  `min_booking_amount` DECIMAL(15,2) DEFAULT 0,
  `max_booking_amount` DECIMAL(15,2),
  `priority` INT DEFAULT 0,
  `enabled` BOOLEAN DEFAULT TRUE,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_rule_type` (`rule_type`),
  INDEX `idx_enabled` (`enabled`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- BOOKING SYSTEM TABLES
-- ============================================

-- Booking Availability
CREATE TABLE IF NOT EXISTS `booking_availability` (
  `id` VARCHAR(36) PRIMARY KEY,
  `package_id` VARCHAR(36) NOT NULL,
  `date` DATE NOT NULL,
  `available_seats` INT NOT NULL,
  `booked_seats` INT DEFAULT 0,
  `price` DECIMAL(15,2),
  `status` ENUM('available', 'limited', 'sold_out') DEFAULT 'available',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`package_id`) REFERENCES `packages`(`id`) ON DELETE CASCADE,
  UNIQUE KEY `unique_package_date` (`package_id`, `date`),
  INDEX `idx_package_id` (`package_id`),
  INDEX `idx_date` (`date`),
  INDEX `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Refund Policies
CREATE TABLE IF NOT EXISTS `refund_policies` (
  `id` VARCHAR(36) PRIMARY KEY,
  `policy_name` VARCHAR(100) NOT NULL,
  `days_before_departure` INT NOT NULL,
  `refund_percentage` DECIMAL(5,2) NOT NULL,
  `cancellation_fee` DECIMAL(10,2) DEFAULT 0,
  `description` TEXT,
  `is_default` BOOLEAN DEFAULT FALSE,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_is_default` (`is_default`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- COMMUNICATION TABLES
-- ============================================

-- Email Templates
CREATE TABLE IF NOT EXISTS `email_templates` (
  `id` VARCHAR(36) PRIMARY KEY,
  `template_name` VARCHAR(100) NOT NULL,
  `template_slug` VARCHAR(100) UNIQUE NOT NULL,
  `subject` VARCHAR(255) NOT NULL,
  `body` TEXT NOT NULL,
  `variables` JSON,
  `category` VARCHAR(50),
  `enabled` BOOLEAN DEFAULT TRUE,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_template_slug` (`template_slug`),
  INDEX `idx_category` (`category`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- SMS Templates
CREATE TABLE IF NOT EXISTS `sms_templates` (
  `id` VARCHAR(36) PRIMARY KEY,
  `template_name` VARCHAR(100) NOT NULL,
  `template_slug` VARCHAR(100) UNIQUE NOT NULL,
  `message` TEXT NOT NULL,
  `variables` JSON,
  `category` VARCHAR(50),
  `enabled` BOOLEAN DEFAULT TRUE,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_template_slug` (`template_slug`),
  INDEX `idx_category` (`category`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Notifications
CREATE TABLE IF NOT EXISTS `notifications` (
  `id` VARCHAR(36) PRIMARY KEY,
  `user_id` VARCHAR(36) NOT NULL,
  `type` VARCHAR(50) NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `message` TEXT NOT NULL,
  `data` JSON,
  `read_at` TIMESTAMP NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  INDEX `idx_user_id` (`user_id`),
  INDEX `idx_read_at` (`read_at`),
  INDEX `idx_type` (`type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- SYSTEM TABLES
-- ============================================

-- Activity Logs
CREATE TABLE IF NOT EXISTS `activity_logs` (
  `id` VARCHAR(36) PRIMARY KEY,
  `user_id` VARCHAR(36),
  `action` VARCHAR(100) NOT NULL,
  `entity_type` VARCHAR(50),
  `entity_id` VARCHAR(36),
  `ip_address` VARCHAR(45),
  `user_agent` TEXT,
  `data` JSON,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE SET NULL,
  INDEX `idx_user_id` (`user_id`),
  INDEX `idx_entity` (`entity_type`, `entity_id`),
  INDEX `idx_action` (`action`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Reviews
CREATE TABLE IF NOT EXISTS `reviews` (
  `id` VARCHAR(36) PRIMARY KEY,
  `user_id` VARCHAR(36) NOT NULL,
  `package_id` VARCHAR(36) NOT NULL,
  `vendor_id` VARCHAR(36) NOT NULL,
  `booking_id` VARCHAR(36),
  `rating` INT NOT NULL CHECK (`rating` >= 1 AND `rating` <= 5),
  `title` VARCHAR(255),
  `comment` TEXT,
  `images` JSON,
  `helpful_count` INT DEFAULT 0,
  `verified_purchase` BOOLEAN DEFAULT FALSE,
  `status` ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
  `admin_response` TEXT,
  `responded_at` TIMESTAMP NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`package_id`) REFERENCES `packages`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`vendor_id`) REFERENCES `vendors`(`id`) ON DELETE CASCADE,
  INDEX `idx_package_id` (`package_id`),
  INDEX `idx_vendor_id` (`vendor_id`),
  INDEX `idx_status` (`status`),
  INDEX `idx_rating` (`rating`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- INSERT DEFAULT CONFIGURATION DATA
-- ============================================

-- Default Payment Gateways
INSERT INTO `payment_gateway_settings` (`id`, `gateway_name`, `display_name`, `mode`, `enabled`) VALUES
(UUID(), 'razorpay', 'Razorpay', 'test', TRUE),
(UUID(), 'stripe', 'Stripe', 'test', TRUE),
(UUID(), 'paypal', 'PayPal', 'test', TRUE),
(UUID(), 'bank_transfer', 'Bank Transfer', 'live', TRUE),
(UUID(), 'upi', 'UPI', 'live', TRUE),
(UUID(), 'cash', 'Cash on Delivery', 'live', FALSE);

-- Default Email Settings
INSERT INTO `email_settings` (`id`, `smtp_host`, `smtp_port`, `smtp_encryption`, `from_name`, `enabled`) VALUES
(UUID(), 'smtp.gmail.com', 587, 'tls', 'UmrahConnect', FALSE);

-- Default SMS Providers
INSERT INTO `sms_settings` (`id`, `provider`, `enabled`) VALUES
(UUID(), 'twilio', FALSE),
(UUID(), 'msg91', FALSE),
(UUID(), 'aws_sns', FALSE),
(UUID(), 'nexmo', FALSE);

-- Default Storage Providers
INSERT INTO `storage_settings` (`id`, `provider`, `is_default`, `enabled`) VALUES
(UUID(), 'local', TRUE, TRUE),
(UUID(), 'aws_s3', FALSE, FALSE),
(UUID(), 'wasabi', FALSE, FALSE),
(UUID(), 'cloudinary', FALSE, FALSE),
(UUID(), 'digitalocean_spaces', FALSE, FALSE);

-- Default Analytics
INSERT INTO `analytics_settings` (`id`, `provider`, `enabled`) VALUES
(UUID(), 'google_analytics', FALSE),
(UUID(), 'facebook_pixel', FALSE),
(UUID(), 'google_tag_manager', FALSE);

-- Default Social Login
INSERT INTO `social_login_settings` (`id`, `provider`, `enabled`) VALUES
(UUID(), 'google', FALSE),
(UUID(), 'facebook', FALSE),
(UUID(), 'apple', FALSE),
(UUID(), 'twitter', FALSE);

-- Default Commission Rules
INSERT INTO `commission_rules` (`id`, `rule_name`, `rule_type`, `commission_percentage`, `enabled`) VALUES
(UUID(), 'Global Commission - Free Plan', 'global', 15.00, TRUE),
(UUID(), 'Global Commission - Basic Plan', 'global', 10.00, TRUE),
(UUID(), 'Global Commission - Pro Plan', 'global', 7.00, TRUE),
(UUID(), 'Global Commission - Enterprise Plan', 'global', 5.00, TRUE);

-- Default Refund Policies
INSERT INTO `refund_policies` (`id`, `policy_name`, `days_before_departure`, `refund_percentage`, `cancellation_fee`, `is_default`) VALUES
(UUID(), 'Standard Refund Policy', 30, 100.00, 0, TRUE),
(UUID(), '15-30 Days Before', 15, 75.00, 500, FALSE),
(UUID(), '7-14 Days Before', 7, 50.00, 1000, FALSE),
(UUID(), 'Less than 7 Days', 0, 0.00, 2000, FALSE);

-- Default Email Templates
INSERT INTO `email_templates` (`id`, `template_name`, `template_slug`, `subject`, `body`, `category`, `enabled`) VALUES
(UUID(), 'Welcome Email', 'welcome', 'Welcome to UmrahConnect!', '<h1>Welcome {{name}}!</h1><p>Thank you for joining UmrahConnect.</p>', 'user', TRUE),
(UUID(), 'Booking Confirmation', 'booking_confirmation', 'Booking Confirmed - {{booking_number}}', '<h1>Booking Confirmed!</h1><p>Your booking {{booking_number}} has been confirmed.</p>', 'booking', TRUE),
(UUID(), 'Payment Receipt', 'payment_receipt', 'Payment Receipt - {{payment_id}}', '<h1>Payment Received</h1><p>We have received your payment of {{amount}}.</p>', 'payment', TRUE),
(UUID(), 'Vendor Approval', 'vendor_approval', 'Your Vendor Account is Approved!', '<h1>Congratulations!</h1><p>Your vendor account has been approved.</p>', 'vendor', TRUE);

-- Default SMS Templates
INSERT INTO `sms_templates` (`id`, `template_name`, `template_slug`, `message`, `category`, `enabled`) VALUES
(UUID(), 'Booking Confirmation SMS', 'booking_confirmation_sms', 'Your booking {{booking_number}} is confirmed. Total: {{amount}}. Thank you!', 'booking', TRUE),
(UUID(), 'Payment Confirmation SMS', 'payment_confirmation_sms', 'Payment of {{amount}} received for booking {{booking_number}}. Thank you!', 'payment', TRUE),
(UUID(), 'OTP Verification', 'otp_verification', 'Your OTP is {{otp}}. Valid for 10 minutes. Do not share with anyone.', 'auth', TRUE);

-- ============================================
-- SUCCESS MESSAGE
-- ============================================
SELECT 'All configuration tables created successfully!' AS message;
SELECT 'Default configuration data inserted!' AS message;
SELECT 'System is ready for dynamic configuration!' AS message;
