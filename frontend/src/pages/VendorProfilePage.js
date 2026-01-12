import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import './VendorProfilePage.css';

const VendorProfilePage = () => {
  const { vendorId } = useParams();

  // Mock vendor data
  const mockVendor = {
    id: vendorId,
    name: 'Al-Haramain Tours',
    logo: 'https://ui-avatars.com/api/?name=Al+Haramain+Tours&size=200&background=0d7c66&color=fff',
    coverImage: 'https://images.unsplash.com/photo-1591604466107-ec97de577aff?w=1200',
    verified: true,
    trustScore: 98,
    rating: 4.8,
    totalReviews: 1234,
    totalPackages: 45,
    totalBookings: 5678,
    yearsInBusiness: 15,
    description: 'Al-Haramain Tours is a leading Hajj and Umrah service provider with over 15 years of experience. We are committed to providing exceptional pilgrimage experiences with personalized service, comfortable accommodations, and comprehensive support throughout your sacred journey.',
    specializations: ['Umrah Packages', 'Hajj Services', 'Group Tours', 'VIP Services'],
    certifications: ['Ministry of Hajj Licensed', 'IATA Certified', 'ISO 9001:2015'],
    contact: {
      phone: '+91 98765 43210',
      email: 'info@alharamaintours.com',
      website: 'www.alharamaintours.com',
      address: 'Shop No. 123, Mohammed Ali Road, Mumbai - 400003',
    },
    socialMedia: {
      facebook: 'alharamaintours',
      instagram: 'alharamaintours',
      twitter: 'alharamaintours',
    },
    packages: [
      {
        id: 1,
        title: 'Premium Umrah Package - 15 Days',
        price: 145000,
        discountedPrice: 135000,
        rating: 4.8,
        reviews: 234,
        image: 'https://images.unsplash.com/photo-1591604466107-ec97de577aff?w=400',
        duration: 15,
        departureCity: 'Mumbai',
        featured: true,
      },
      {
        id: 2,
        title: 'Economy Umrah Package - 10 Days',
        price: 75000,
        discountedPrice: 68000,
        rating: 4.6,
        reviews: 189,
        image: 'https://images.unsplash.com/photo-1564769625905-50e93615e769?w=400',
        duration: 10,
        departureCity: 'Delhi',
      },
      {
        id: 3,
        title: 'VIP Umrah Package - 20 Days',
        price: 285000,
        discountedPrice: 265000,
        rating: 4.9,
        reviews: 89,
        image: 'https://images.unsplash.com/photo-1580418827493-f2b22c0a76cb?w=400',
        duration: 20,
        departureCity: 'Mumbai',
        featured: true,
      },
    ],
    reviews: [
      {
        id: 1,
        user: 'Mohammed Ahmed',
        rating: 5,
        date: '2024-01-15',
        comment: 'Excellent service! The entire journey was well-organized and hassle-free. Highly recommended!',
        package: 'Premium Umrah Package - 15 Days',
      },
      {
        id: 2,
        user: 'Fatima Khan',
        rating: 5,
        date: '2024-01-10',
        comment: 'Amazing experience with Al-Haramain Tours. The hotels were close to Haram and the staff was very helpful.',
        package: 'VIP Umrah Package - 20 Days',
      },
      {
        id: 3,
        user: 'Abdul Rahman',
        rating: 4,
        date: '2024-01-05',
        comment: 'Good value for money. The package included everything as promised. Minor delays in transport but overall satisfied.',
        package: 'Economy Umrah Package - 10 Days',
      },
    ],
  };

  const vendor = mockVendor;

  return (
    <div className="vendor-profile-page">
      {/* Cover Section */}
      <div className="vendor-cover">
        <img src={vendor.coverImage} alt={vendor.name} className="cover-image" />
        <div className="cover-overlay"></div>
      </div>

      <div className="container">
        {/* Vendor Header */}
        <div className="vendor-header">
          <div className="vendor-logo-wrapper">
            <img src={vendor.logo} alt={vendor.name} className="vendor-logo" />
            {vendor.verified && (
              <span className="verified-badge">
                <span className="verified-icon">✓</span>
                Verified
              </span>
            )}
          </div>

          <div className="vendor-header-info">
            <h1 className="vendor-name">{vendor.name}</h1>
            <div className="vendor-stats">
              <div className="stat-item">
                <span className="stat-icon">⭐</span>
                <span className="stat-value">{vendor.rating}</span>
                <span className="stat-label">({vendor.totalReviews} reviews)</span>
              </div>
              <div className="stat-divider"></div>
              <div className="stat-item">
                <span className="stat-icon">📦</span>
                <span className="stat-value">{vendor.totalPackages}</span>
                <span className="stat-label">Packages</span>
              </div>
              <div className="stat-divider"></div>
              <div className="stat-item">
                <span className="stat-icon">👥</span>
                <span className="stat-value">{vendor.totalBookings}+</span>
                <span className="stat-label">Bookings</span>
              </div>
              <div className="stat-divider"></div>
              <div className="stat-item">
                <span className="stat-icon">🏆</span>
                <span className="stat-value">{vendor.yearsInBusiness}+</span>
                <span className="stat-label">Years</span>
              </div>
            </div>
          </div>

          <div className="vendor-actions">
            <div className="trust-score">
              <div className="trust-score-circle">
                <span className="trust-score-value">{vendor.trustScore}</span>
              </div>
              <span className="trust-score-label">Trust Score</span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="vendor-content">
          {/* Left Column */}
          <div className="vendor-main">
            {/* About Section */}
            <section className="vendor-section">
              <h2 className="section-title">About {vendor.name}</h2>
              <p className="vendor-description">{vendor.description}</p>
            </section>

            {/* Specializations */}
            <section className="vendor-section">
              <h2 className="section-title">Specializations</h2>
              <div className="specializations-grid">
                {vendor.specializations.map((spec, index) => (
                  <div key={index} className="specialization-tag">
                    <span className="tag-icon">✓</span>
                    {spec}
                  </div>
                ))}
              </div>
            </section>

            {/* Certifications */}
            <section className="vendor-section">
              <h2 className="section-title">Certifications & Licenses</h2>
              <div className="certifications-list">
                {vendor.certifications.map((cert, index) => (
                  <div key={index} className="certification-item">
                    <span className="cert-icon">🏅</span>
                    <span className="cert-name">{cert}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Packages Section */}
            <section className="vendor-section">
              <div className="section-header">
                <h2 className="section-title">Available Packages</h2>
                <Link to={`/packages?vendor=${vendor.id}`} className="view-all-link">
                  View All {vendor.totalPackages} Packages →
                </Link>
              </div>
              <div className="packages-grid">
                {vendor.packages.map((pkg) => (
                  <Link to={`/packages/${pkg.id}`} key={pkg.id} className="package-card">
                    <div className="package-image-wrapper">
                      <img src={pkg.image} alt={pkg.title} className="package-image" />
                      {pkg.featured && <span className="featured-badge">⭐ Featured</span>}
                      <span className="discount-badge">
                        {Math.round(((pkg.price - pkg.discountedPrice) / pkg.price) * 100)}% OFF
                      </span>
                    </div>
                    <div className="package-content">
                      <h3 className="package-title">{pkg.title}</h3>
                      <div className="package-meta">
                        <span>📅 {pkg.duration} Days</span>
                        <span>✈️ {pkg.departureCity}</span>
                      </div>
                      <div className="package-rating">
                        <span className="rating-stars">⭐ {pkg.rating}</span>
                        <span className="rating-count">({pkg.reviews} reviews)</span>
                      </div>
                      <div className="package-footer">
                        <div className="package-price">
                          <span className="price-original">₹{pkg.price.toLocaleString()}</span>
                          <span className="price-current">₹{pkg.discountedPrice.toLocaleString()}</span>
                        </div>
                        <button className="package-btn">View Details</button>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>

            {/* Reviews Section */}
            <section className="vendor-section">
              <h2 className="section-title">Customer Reviews</h2>
              <div className="reviews-list">
                {vendor.reviews.map((review) => (
                  <div key={review.id} className="review-card">
                    <div className="review-header">
                      <div className="review-user">
                        <div className="user-avatar">
                          {review.user.charAt(0)}
                        </div>
                        <div className="user-info">
                          <h4 className="user-name">{review.user}</h4>
                          <p className="review-date">{new Date(review.date).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="review-rating">
                        {'⭐'.repeat(review.rating)}
                      </div>
                    </div>
                    <p className="review-package">Package: {review.package}</p>
                    <p className="review-comment">{review.comment}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Right Sidebar */}
          <div className="vendor-sidebar">
            {/* Contact Card */}
            <div className="sidebar-card">
              <h3 className="sidebar-title">Contact Information</h3>
              <div className="contact-list">
                <div className="contact-item">
                  <span className="contact-icon">📞</span>
                  <div className="contact-info">
                    <span className="contact-label">Phone</span>
                    <a href={`tel:${vendor.contact.phone}`} className="contact-value">
                      {vendor.contact.phone}
                    </a>
                  </div>
                </div>
                <div className="contact-item">
                  <span className="contact-icon">✉️</span>
                  <div className="contact-info">
                    <span className="contact-label">Email</span>
                    <a href={`mailto:${vendor.contact.email}`} className="contact-value">
                      {vendor.contact.email}
                    </a>
                  </div>
                </div>
                <div className="contact-item">
                  <span className="contact-icon">🌐</span>
                  <div className="contact-info">
                    <span className="contact-label">Website</span>
                    <a href={`https://${vendor.contact.website}`} target="_blank" rel="noopener noreferrer" className="contact-value">
                      {vendor.contact.website}
                    </a>
                  </div>
                </div>
                <div className="contact-item">
                  <span className="contact-icon">📍</span>
                  <div className="contact-info">
                    <span className="contact-label">Address</span>
                    <span className="contact-value">{vendor.contact.address}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Media Card */}
            <div className="sidebar-card">
              <h3 className="sidebar-title">Follow Us</h3>
              <div className="social-links">
                <a href={`https://facebook.com/${vendor.socialMedia.facebook}`} target="_blank" rel="noopener noreferrer" className="social-link facebook">
                  <span>📘</span> Facebook
                </a>
                <a href={`https://instagram.com/${vendor.socialMedia.instagram}`} target="_blank" rel="noopener noreferrer" className="social-link instagram">
                  <span>📷</span> Instagram
                </a>
                <a href={`https://twitter.com/${vendor.socialMedia.twitter}`} target="_blank" rel="noopener noreferrer" className="social-link twitter">
                  <span>🐦</span> Twitter
                </a>
              </div>
            </div>

            {/* CTA Card */}
            <div className="sidebar-card cta-card">
              <h3 className="cta-title">Ready to Book?</h3>
              <p className="cta-text">Contact us today to plan your perfect pilgrimage</p>
              <a href={`tel:${vendor.contact.phone}`} className="cta-btn">
                📞 Call Now
              </a>
              <a href={`mailto:${vendor.contact.email}`} className="cta-btn cta-btn-secondary">
                ✉️ Send Email
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorProfilePage;
