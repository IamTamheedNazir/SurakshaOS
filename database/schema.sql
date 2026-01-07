-- UmrahConnect 2.0 Database Schema
-- PostgreSQL 14+

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- USERS TABLE
-- ============================================
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    user_type VARCHAR(20) NOT NULL CHECK (user_type IN ('pilgrim', 'vendor', 'admin')),
    kyc_status VARCHAR(20) DEFAULT 'pending' CHECK (kyc_status IN ('pending', 'verified', 'rejected')),
    verification_level INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    last_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_phone ON users(phone);
CREATE INDEX idx_users_type ON users(user_type);

-- ============================================
-- USER PROFILES TABLE
-- ============================================
CREATE TABLE user_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    date_of_birth DATE,
    gender VARCHAR(10) CHECK (gender IN ('male', 'female', 'other')),
    nationality VARCHAR(50),
    passport_number VARCHAR(50),
    passport_expiry DATE,
    address_line1 VARCHAR(255),
    address_line2 VARCHAR(255),
    city VARCHAR(100),
    state VARCHAR(100),
    country VARCHAR(100),
    postal_code VARCHAR(20),
    profile_image_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_user_profiles_user_id ON user_profiles(user_id);

-- ============================================
-- VENDORS TABLE
-- ============================================
CREATE TABLE vendors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    business_name VARCHAR(255) NOT NULL,
    business_type VARCHAR(50) NOT NULL CHECK (business_type IN (
        'umrah_operator', 'hotel', 'transport', 'visa_agent', 
        'religious_guide', 'catering', 'photography', 'forex', 
        'esim', 'multi_service'
    )),
    registration_number VARCHAR(100),
    tax_id VARCHAR(100),
    licenses JSONB,
    trust_score INTEGER DEFAULT 0 CHECK (trust_score >= 0 AND trust_score <= 100),
    subscription_tier VARCHAR(20) DEFAULT 'basic' CHECK (subscription_tier IN ('basic', 'professional', 'enterprise', 'platinum')),
    commission_rate DECIMAL(5,2) DEFAULT 2.50,
    verification_status VARCHAR(20) DEFAULT 'pending' CHECK (verification_status IN ('pending', 'verified', 'rejected')),
    featured_status BOOLEAN DEFAULT false,
    total_bookings INTEGER DEFAULT 0,
    total_revenue DECIMAL(15,2) DEFAULT 0,
    average_rating DECIMAL(3,2) DEFAULT 0,
    response_time_hours INTEGER DEFAULT 24,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_vendors_user_id ON vendors(user_id);
CREATE INDEX idx_vendors_business_type ON vendors(business_type);
CREATE INDEX idx_vendors_trust_score ON vendors(trust_score);

-- ============================================
-- PACKAGES TABLE
-- ============================================
CREATE TABLE packages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vendor_id UUID REFERENCES vendors(id) ON DELETE CASCADE,
    package_type VARCHAR(50) NOT NULL CHECK (package_type IN ('umrah', 'hajj', 'iran', 'iraq', 'turkey', 'palestine')),
    service_class VARCHAR(20) NOT NULL CHECK (service_class IN ('economy', 'gold', 'diamond', 'platinum')),
    departure_type VARCHAR(20) NOT NULL CHECK (departure_type IN ('fixed', 'continuous')),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    departure_date DATE,
    return_date DATE,
    duration_days INTEGER,
    makkah_days INTEGER,
    madinah_days INTEGER,
    departure_city VARCHAR(100),
    total_seats INTEGER,
    seats_booked INTEGER DEFAULT 0,
    seats_remaining INTEGER GENERATED ALWAYS AS (total_seats - seats_booked) STORED,
    base_price DECIMAL(10,2) NOT NULL,
    discounted_price DECIMAL(10,2),
    pricing_details JSONB NOT NULL,
    inclusions JSONB NOT NULL,
    exclusions JSONB,
    hotel_details JSONB,
    transport_details JSONB,
    itinerary JSONB,
    terms_conditions TEXT,
    cancellation_policy TEXT,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'sold_out', 'cancelled')),
    featured BOOLEAN DEFAULT false,
    views_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_packages_vendor_id ON packages(vendor_id);
CREATE INDEX idx_packages_type ON packages(package_type);
CREATE INDEX idx_packages_status ON packages(status);
CREATE INDEX idx_packages_departure_date ON packages(departure_date);

-- ============================================
-- BOOKINGS TABLE
-- ============================================
CREATE TABLE bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_number VARCHAR(50) UNIQUE NOT NULL,
    user_id UUID REFERENCES users(id),
    package_id UUID REFERENCES packages(id),
    vendor_id UUID REFERENCES vendors(id),
    booking_type VARCHAR(20) CHECK (booking_type IN ('individual', 'family', 'group', 'corporate')),
    total_travelers INTEGER NOT NULL,
    total_amount DECIMAL(12,2) NOT NULL,
    paid_amount DECIMAL(12,2) DEFAULT 0,
    pending_amount DECIMAL(12,2) GENERATED ALWAYS AS (total_amount - paid_amount) STORED,
    booking_status VARCHAR(30) DEFAULT 'pending' CHECK (booking_status IN (
        'pending', 'confirmed', 'payment_pending', 'documents_pending', 
        'visa_processing', 'approved', 'cancelled', 'completed'
    )),
    payment_status VARCHAR(20) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'partial', 'completed', 'refunded')),
    payment_schedule JSONB,
    travelers_data JSONB NOT NULL,
    special_requests TEXT,
    booking_source VARCHAR(50),
    affiliate_code VARCHAR(50),
    commission_amount DECIMAL(10,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_bookings_user_id ON bookings(user_id);
CREATE INDEX idx_bookings_vendor_id ON bookings(vendor_id);
CREATE INDEX idx_bookings_status ON bookings(booking_status);
CREATE INDEX idx_bookings_number ON bookings(booking_number);

-- ============================================
-- PAYMENTS TABLE
-- ============================================
CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID REFERENCES bookings(id),
    payment_number VARCHAR(50) UNIQUE NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    payment_type VARCHAR(20) CHECK (payment_type IN ('booking', 'installment', 'final', 'refund')),
    payment_method VARCHAR(30) CHECK (payment_method IN ('card', 'upi', 'netbanking', 'wallet', 'emi')),
    payment_gateway VARCHAR(30),
    gateway_transaction_id VARCHAR(255),
    payment_status VARCHAR(20) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'processing', 'completed', 'failed', 'refunded')),
    payment_date TIMESTAMP,
    metadata JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_payments_booking_id ON payments(booking_id);
CREATE INDEX idx_payments_status ON payments(payment_status);

-- ============================================
-- REVIEWS TABLE
-- ============================================
CREATE TABLE reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID REFERENCES bookings(id),
    user_id UUID REFERENCES users(id),
    vendor_id UUID REFERENCES vendors(id),
    package_id UUID REFERENCES packages(id),
    overall_rating INTEGER CHECK (overall_rating >= 1 AND overall_rating <= 5),
    service_quality INTEGER CHECK (service_quality >= 1 AND service_quality <= 5),
    value_for_money INTEGER CHECK (value_for_money >= 1 AND value_for_money <= 5),
    staff_behavior INTEGER CHECK (staff_behavior >= 1 AND staff_behavior <= 5),
    cleanliness INTEGER CHECK (cleanliness >= 1 AND cleanliness <= 5),
    communication INTEGER CHECK (communication >= 1 AND communication <= 5),
    religious_guidance INTEGER CHECK (religious_guidance >= 1 AND religious_guidance <= 5),
    review_title VARCHAR(255),
    review_text TEXT,
    pros TEXT,
    cons TEXT,
    tips TEXT,
    photos JSONB,
    videos JSONB,
    is_verified BOOLEAN DEFAULT false,
    is_featured BOOLEAN DEFAULT false,
    helpful_count INTEGER DEFAULT 0,
    vendor_response TEXT,
    vendor_response_date TIMESTAMP,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_reviews_vendor_id ON reviews(vendor_id);
CREATE INDEX idx_reviews_package_id ON reviews(package_id);
CREATE INDEX idx_reviews_user_id ON reviews(user_id);

-- ============================================
-- DOCUMENTS TABLE
-- ============================================
CREATE TABLE documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID REFERENCES bookings(id),
    user_id UUID REFERENCES users(id),
    document_type VARCHAR(50) CHECK (document_type IN (
        'passport', 'photo', 'id_proof', 'medical_certificate', 
        'vaccination', 'visa', 'ticket', 'voucher', 'other'
    )),
    document_name VARCHAR(255) NOT NULL,
    file_url TEXT NOT NULL,
    file_size INTEGER,
    mime_type VARCHAR(100),
    document_status VARCHAR(20) DEFAULT 'pending' CHECK (document_status IN (
        'pending_upload', 'uploaded', 'under_review', 'approved', 
        'needs_correction', 'rejected'
    )),
    verification_notes TEXT,
    uploaded_by UUID REFERENCES users(id),
    verified_by UUID REFERENCES users(id),
    verified_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_documents_booking_id ON documents(booking_id);
CREATE INDEX idx_documents_user_id ON documents(user_id);

-- ============================================
-- VISA TRACKING TABLE
-- ============================================
CREATE TABLE visa_tracking (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID REFERENCES bookings(id),
    application_number VARCHAR(100),
    visa_type VARCHAR(50),
    current_stage VARCHAR(50) CHECK (current_stage IN (
        'application_prepared', 'submitted_to_embassy', 'biometrics_scheduled',
        'under_processing', 'visa_approved', 'visa_rejected', 'document_uploaded'
    )),
    stage_history JSONB,
    embassy_reference VARCHAR(100),
    biometrics_date TIMESTAMP,
    expected_approval_date DATE,
    actual_approval_date DATE,
    visa_number VARCHAR(100),
    visa_expiry_date DATE,
    visa_document_url TEXT,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_visa_tracking_booking_id ON visa_tracking(booking_id);

-- ============================================
-- NOTIFICATIONS TABLE
-- ============================================
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    notification_type VARCHAR(50),
    channel VARCHAR(20) CHECK (channel IN ('email', 'sms', 'whatsapp', 'push', 'in_app')),
    title VARCHAR(255),
    message TEXT NOT NULL,
    data JSONB,
    is_read BOOLEAN DEFAULT false,
    sent_at TIMESTAMP,
    read_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);

-- ============================================
-- AFFILIATE PROGRAM TABLE
-- ============================================
CREATE TABLE affiliates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    referral_code VARCHAR(50) UNIQUE NOT NULL,
    tier VARCHAR(20) DEFAULT 'tier1' CHECK (tier IN ('tier1', 'tier2', 'tier3')),
    commission_rate DECIMAL(5,2) DEFAULT 2.00,
    total_referrals INTEGER DEFAULT 0,
    total_bookings INTEGER DEFAULT 0,
    total_earnings DECIMAL(12,2) DEFAULT 0,
    pending_earnings DECIMAL(12,2) DEFAULT 0,
    paid_earnings DECIMAL(12,2) DEFAULT 0,
    bank_details JSONB,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_affiliates_user_id ON affiliates(user_id);
CREATE INDEX idx_affiliates_referral_code ON affiliates(referral_code);

-- ============================================
-- TRIGGER: Update updated_at timestamp
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply trigger to all tables
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_vendors_updated_at BEFORE UPDATE ON vendors FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_packages_updated_at BEFORE UPDATE ON packages FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON bookings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON reviews FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_documents_updated_at BEFORE UPDATE ON documents FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_visa_tracking_updated_at BEFORE UPDATE ON visa_tracking FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_affiliates_updated_at BEFORE UPDATE ON affiliates FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
