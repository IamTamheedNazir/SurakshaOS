-- Dynamic Partner Registration System
-- Allows admin to configure registration fields and requirements

-- ============================================
-- DYNAMIC REGISTRATION FIELDS
-- ============================================

-- Registration Field Definitions
CREATE TABLE IF NOT EXISTS `registration_fields` (
  `id` VARCHAR(36) PRIMARY KEY,
  `field_name` VARCHAR(100) NOT NULL,
  `field_label` VARCHAR(255) NOT NULL,
  `field_type` ENUM('text', 'email', 'phone', 'number', 'textarea', 'select', 'radio', 'checkbox', 'file', 'date', 'url') NOT NULL,
  `field_category` ENUM('basic', 'business', 'legal', 'bank', 'documents', 'custom') NOT NULL,
  `field_options` JSON,
  `placeholder` VARCHAR(255),
  `help_text` TEXT,
  `validation_rules` JSON,
  `is_required` BOOLEAN DEFAULT FALSE,
  `is_enabled` BOOLEAN DEFAULT TRUE,
  `display_order` INT DEFAULT 0,
  `min_length` INT,
  `max_length` INT,
  `file_types` VARCHAR(255),
  `max_file_size` INT,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_field_category` (`field_category`),
  INDEX `idx_is_enabled` (`is_enabled`),
  INDEX `idx_display_order` (`display_order`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Vendor Registration Data (Dynamic)
CREATE TABLE IF NOT EXISTS `vendor_registration_data` (
  `id` VARCHAR(36) PRIMARY KEY,
  `vendor_id` VARCHAR(36) NOT NULL,
  `field_id` VARCHAR(36) NOT NULL,
  `field_value` TEXT,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`vendor_id`) REFERENCES `vendors`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`field_id`) REFERENCES `registration_fields`(`id`) ON DELETE CASCADE,
  INDEX `idx_vendor_id` (`vendor_id`),
  INDEX `idx_field_id` (`field_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Registration Field Groups
CREATE TABLE IF NOT EXISTS `registration_field_groups` (
  `id` VARCHAR(36) PRIMARY KEY,
  `group_name` VARCHAR(100) NOT NULL,
  `group_label` VARCHAR(255) NOT NULL,
  `description` TEXT,
  `icon` VARCHAR(50),
  `display_order` INT DEFAULT 0,
  `is_enabled` BOOLEAN DEFAULT TRUE,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_display_order` (`display_order`),
  INDEX `idx_is_enabled` (`is_enabled`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Field to Group Mapping
CREATE TABLE IF NOT EXISTS `registration_field_group_mapping` (
  `id` VARCHAR(36) PRIMARY KEY,
  `field_id` VARCHAR(36) NOT NULL,
  `group_id` VARCHAR(36) NOT NULL,
  `display_order` INT DEFAULT 0,
  FOREIGN KEY (`field_id`) REFERENCES `registration_fields`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`group_id`) REFERENCES `registration_field_groups`(`id`) ON DELETE CASCADE,
  INDEX `idx_field_id` (`field_id`),
  INDEX `idx_group_id` (`group_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- INSERT DEFAULT REGISTRATION FIELD GROUPS
-- ============================================

INSERT INTO `registration_field_groups` (`id`, `group_name`, `group_label`, `description`, `icon`, `display_order`, `is_enabled`) VALUES
(UUID(), 'basic_info', 'Basic Information', 'Basic contact and personal details', 'user', 1, TRUE),
(UUID(), 'business_info', 'Business Information', 'Company and business details', 'briefcase', 2, TRUE),
(UUID(), 'legal_documents', 'Legal Documents', 'Required legal certificates and licenses', 'file-text', 3, TRUE),
(UUID(), 'bank_details', 'Bank Details', 'Banking and payment information', 'credit-card', 4, TRUE),
(UUID(), 'additional_info', 'Additional Information', 'Other relevant information', 'info', 5, TRUE);

-- ============================================
-- INSERT DEFAULT REGISTRATION FIELDS
-- ============================================

-- Basic Information Fields
INSERT INTO `registration_fields` (`id`, `field_name`, `field_label`, `field_type`, `field_category`, `placeholder`, `help_text`, `is_required`, `is_enabled`, `display_order`) VALUES
(UUID(), 'first_name', 'First Name', 'text', 'basic', 'Enter first name', 'Your legal first name', TRUE, TRUE, 1),
(UUID(), 'last_name', 'Last Name', 'text', 'basic', 'Enter last name', 'Your legal last name', TRUE, TRUE, 2),
(UUID(), 'email', 'Email Address', 'email', 'basic', 'your@email.com', 'Primary contact email', TRUE, TRUE, 3),
(UUID(), 'phone', 'Phone Number', 'phone', 'basic', '+91 1234567890', 'Contact phone number with country code', TRUE, TRUE, 4),
(UUID(), 'alternate_phone', 'Alternate Phone', 'phone', 'basic', '+91 1234567890', 'Secondary contact number', FALSE, TRUE, 5),
(UUID(), 'address', 'Address', 'textarea', 'basic', 'Enter complete address', 'Full business address', TRUE, TRUE, 6),
(UUID(), 'city', 'City', 'text', 'basic', 'Enter city', 'City name', TRUE, TRUE, 7),
(UUID(), 'state', 'State', 'text', 'basic', 'Enter state', 'State/Province', TRUE, TRUE, 8),
(UUID(), 'country', 'Country', 'select', 'basic', NULL, 'Select country', TRUE, TRUE, 9),
(UUID(), 'postal_code', 'Postal Code', 'text', 'basic', 'Enter postal code', 'ZIP/Postal code', TRUE, TRUE, 10);

-- Business Information Fields
INSERT INTO `registration_fields` (`id`, `field_name`, `field_label`, `field_type`, `field_category`, `placeholder`, `help_text`, `is_required`, `is_enabled`, `display_order`) VALUES
(UUID(), 'company_name', 'Company Name', 'text', 'business', 'Enter company name', 'Registered business name', TRUE, TRUE, 11),
(UUID(), 'company_logo', 'Company Logo', 'file', 'business', NULL, 'Upload company logo (PNG, JPG, max 2MB)', TRUE, TRUE, 12),
(UUID(), 'business_type', 'Business Type', 'select', 'business', NULL, 'Type of business entity', TRUE, TRUE, 13),
(UUID(), 'year_established', 'Year Established', 'number', 'business', '2020', 'Year business was established', TRUE, TRUE, 14),
(UUID(), 'website', 'Website URL', 'url', 'business', 'https://example.com', 'Company website', FALSE, TRUE, 15),
(UUID(), 'description', 'Business Description', 'textarea', 'business', 'Describe your business', 'Brief description of services', TRUE, TRUE, 16),
(UUID(), 'employee_count', 'Number of Employees', 'select', 'business', NULL, 'Total employees', FALSE, TRUE, 17),
(UUID(), 'annual_revenue', 'Annual Revenue Range', 'select', 'business', NULL, 'Approximate annual revenue', FALSE, TRUE, 18);

-- Legal Documents Fields
INSERT INTO `registration_fields` (`id`, `field_name`, `field_label`, `field_type`, `field_category`, `placeholder`, `help_text`, `is_required`, `is_enabled`, `display_order`, `file_types`, `max_file_size`) VALUES
(UUID(), 'gst_number', 'GST Number', 'text', 'legal', 'Enter GST number', 'Goods and Services Tax registration number', TRUE, TRUE, 19, NULL, NULL),
(UUID(), 'gst_certificate', 'GST Certificate', 'file', 'legal', NULL, 'Upload GST certificate (PDF, max 5MB)', TRUE, TRUE, 20, 'pdf', 5242880),
(UUID(), 'pan_number', 'PAN Number', 'text', 'legal', 'Enter PAN number', 'Permanent Account Number', TRUE, TRUE, 21, NULL, NULL),
(UUID(), 'pan_card', 'PAN Card', 'file', 'legal', NULL, 'Upload PAN card (PDF, JPG, max 2MB)', TRUE, TRUE, 22, 'pdf,jpg,jpeg,png', 2097152),
(UUID(), 'hajj_certificate_number', 'Hajj Certificate Number', 'text', 'legal', 'Enter certificate number', 'Hajj operator certificate number', TRUE, TRUE, 23, NULL, NULL),
(UUID(), 'hajj_certificate', 'Hajj Certificate', 'file', 'legal', NULL, 'Upload Hajj certificate (PDF, max 5MB)', TRUE, TRUE, 24, 'pdf', 5242880),
(UUID(), 'umrah_certificate_number', 'Umrah Certificate Number', 'text', 'legal', 'Enter certificate number', 'Umrah operator certificate number', TRUE, TRUE, 25, NULL, NULL),
(UUID(), 'umrah_certificate', 'Umrah Certificate', 'file', 'legal', NULL, 'Upload Umrah certificate (PDF, max 5MB)', TRUE, TRUE, 26, 'pdf', 5242880),
(UUID(), 'tourism_license_number', 'Tourism License Number', 'text', 'legal', 'Enter license number', 'Tourism department license number', TRUE, TRUE, 27, NULL, NULL),
(UUID(), 'tourism_license', 'Tourism License', 'file', 'legal', NULL, 'Upload tourism license (PDF, max 5MB)', TRUE, TRUE, 28, 'pdf', 5242880),
(UUID(), 'trade_license_number', 'Trade License Number', 'text', 'legal', 'Enter license number', 'Trade license number', FALSE, TRUE, 29, NULL, NULL),
(UUID(), 'trade_license', 'Trade License', 'file', 'legal', NULL, 'Upload trade license (PDF, max 5MB)', FALSE, TRUE, 30, 'pdf', 5242880);

-- Bank Details Fields
INSERT INTO `registration_fields` (`id`, `field_name`, `field_label`, `field_type`, `field_category`, `placeholder`, `help_text`, `is_required`, `is_enabled`, `display_order`) VALUES
(UUID(), 'bank_name', 'Bank Name', 'text', 'bank', 'Enter bank name', 'Name of your bank', TRUE, TRUE, 31),
(UUID(), 'account_holder_name', 'Account Holder Name', 'text', 'bank', 'Enter account holder name', 'Name as per bank account', TRUE, TRUE, 32),
(UUID(), 'account_number', 'Account Number', 'text', 'bank', 'Enter account number', 'Bank account number', TRUE, TRUE, 33),
(UUID(), 'account_type', 'Account Type', 'select', 'bank', NULL, 'Type of bank account', TRUE, TRUE, 34),
(UUID(), 'ifsc_code', 'IFSC Code', 'text', 'bank', 'Enter IFSC code', 'Bank IFSC code', TRUE, TRUE, 35),
(UUID(), 'branch_name', 'Branch Name', 'text', 'bank', 'Enter branch name', 'Bank branch name', FALSE, TRUE, 36),
(UUID(), 'cancelled_cheque', 'Cancelled Cheque', 'file', 'bank', NULL, 'Upload cancelled cheque or bank statement (PDF, JPG, max 2MB)', TRUE, TRUE, 37);

-- ============================================
-- UPDATE FIELD OPTIONS (JSON)
-- ============================================

-- Country options
UPDATE `registration_fields` SET `field_options` = JSON_ARRAY(
  JSON_OBJECT('value', 'IN', 'label', 'India'),
  JSON_OBJECT('value', 'SA', 'label', 'Saudi Arabia'),
  JSON_OBJECT('value', 'AE', 'label', 'United Arab Emirates'),
  JSON_OBJECT('value', 'PK', 'label', 'Pakistan'),
  JSON_OBJECT('value', 'BD', 'label', 'Bangladesh'),
  JSON_OBJECT('value', 'US', 'label', 'United States'),
  JSON_OBJECT('value', 'GB', 'label', 'United Kingdom')
) WHERE `field_name` = 'country';

-- Business Type options
UPDATE `registration_fields` SET `field_options` = JSON_ARRAY(
  JSON_OBJECT('value', 'sole_proprietorship', 'label', 'Sole Proprietorship'),
  JSON_OBJECT('value', 'partnership', 'label', 'Partnership'),
  JSON_OBJECT('value', 'private_limited', 'label', 'Private Limited Company'),
  JSON_OBJECT('value', 'public_limited', 'label', 'Public Limited Company'),
  JSON_OBJECT('value', 'llp', 'label', 'Limited Liability Partnership')
) WHERE `field_name` = 'business_type';

-- Employee Count options
UPDATE `registration_fields` SET `field_options` = JSON_ARRAY(
  JSON_OBJECT('value', '1-10', 'label', '1-10 employees'),
  JSON_OBJECT('value', '11-50', 'label', '11-50 employees'),
  JSON_OBJECT('value', '51-200', 'label', '51-200 employees'),
  JSON_OBJECT('value', '201-500', 'label', '201-500 employees'),
  JSON_OBJECT('value', '500+', 'label', '500+ employees')
) WHERE `field_name` = 'employee_count';

-- Annual Revenue options
UPDATE `registration_fields` SET `field_options` = JSON_ARRAY(
  JSON_OBJECT('value', '0-10L', 'label', 'Up to ₹10 Lakhs'),
  JSON_OBJECT('value', '10L-50L', 'label', '₹10 Lakhs - ₹50 Lakhs'),
  JSON_OBJECT('value', '50L-1CR', 'label', '₹50 Lakhs - ₹1 Crore'),
  JSON_OBJECT('value', '1CR-5CR', 'label', '₹1 Crore - ₹5 Crores'),
  JSON_OBJECT('value', '5CR+', 'label', 'Above ₹5 Crores')
) WHERE `field_name` = 'annual_revenue';

-- Account Type options
UPDATE `registration_fields` SET `field_options` = JSON_ARRAY(
  JSON_OBJECT('value', 'savings', 'label', 'Savings Account'),
  JSON_OBJECT('value', 'current', 'label', 'Current Account'),
  JSON_OBJECT('value', 'business', 'label', 'Business Account')
) WHERE `field_name` = 'account_type';

-- ============================================
-- VALIDATION RULES (JSON)
-- ============================================

-- Email validation
UPDATE `registration_fields` SET `validation_rules` = JSON_OBJECT(
  'pattern', '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$',
  'message', 'Please enter a valid email address'
) WHERE `field_name` = 'email';

-- Phone validation
UPDATE `registration_fields` SET `validation_rules` = JSON_OBJECT(
  'pattern', '^[+]?[0-9]{10,15}$',
  'message', 'Please enter a valid phone number'
) WHERE `field_name` IN ('phone', 'alternate_phone');

-- GST validation
UPDATE `registration_fields` SET `validation_rules` = JSON_OBJECT(
  'pattern', '^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$',
  'message', 'Please enter a valid GST number'
) WHERE `field_name` = 'gst_number';

-- PAN validation
UPDATE `registration_fields` SET `validation_rules` = JSON_OBJECT(
  'pattern', '^[A-Z]{5}[0-9]{4}[A-Z]{1}$',
  'message', 'Please enter a valid PAN number'
) WHERE `field_name` = 'pan_number';

-- IFSC validation
UPDATE `registration_fields` SET `validation_rules` = JSON_OBJECT(
  'pattern', '^[A-Z]{4}0[A-Z0-9]{6}$',
  'message', 'Please enter a valid IFSC code'
) WHERE `field_name` = 'ifsc_code';

-- URL validation
UPDATE `registration_fields` SET `validation_rules` = JSON_OBJECT(
  'pattern', '^https?:\\/\\/(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b([-a-zA-Z0-9()@:%_\\+.~#?&//=]*)$',
  'message', 'Please enter a valid URL'
) WHERE `field_name` = 'website';

-- ============================================
-- SUCCESS MESSAGE
-- ============================================
SELECT 'Dynamic registration system created successfully!' AS message;
SELECT 'Default registration fields added!' AS message;
SELECT 'Admin can now customize registration form!' AS message;
