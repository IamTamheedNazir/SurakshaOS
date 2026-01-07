import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import { packagesAPI } from '../services/api';
import useAuthStore from '../store/authStore';
import './PackageDetailPage.css';

const PackageDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const [selectedTab, setSelectedTab] = useState('overview');
  const [showShareModal, setShowShareModal] = useState(false);

  // Fetch package details
  const { data, isLoading, error } = useQuery(
    ['package', id],
    () => packagesAPI.getById(id)
  );

  // Mock data for development
  const mockPackage = {
    id: '1',
    title: 'Gold Umrah Package - 15 Days',
    packageType: 'umrah',
    serviceClass: 'gold',
    duration: 15,
    departureCity: 'Mumbai',
    departureDate: '2024-03-15',
    returnDate: '2024-03-30',
    basePrice: 125000,
    discountedPrice: 110000,
    makkahDays: 8,
    madinahDays: 7,
    hotelDetails: {
      makkah: {
        name: 'Swissotel Makkah',
        stars: 5,
        distance: '100m from Haram',
        roomType: 'Quad Sharing',
        amenities: ['WiFi', 'AC', 'TV', 'Mini Fridge', 'Safe']
      },
      madinah: {
        name: 'Pullman Zamzam Madinah',
        stars: 5,
        distance: '50m from Masjid Nabawi',
        roomType: 'Quad Sharing',
        amenities: ['WiFi', 'AC', 'TV', 'Mini Fridge', 'Safe']
      }
    },
    flightDetails: {
      airline: 'Air India',
      flightType: 'Direct',
      departureTime: '02:30 AM',
      arrivalTime: '05:45 AM',
      baggage: '30kg Check-in + 7kg Cabin'
    },
    inclusions: [
      'Return Air Tickets',
      'Umrah Visa',
      '5-Star Hotels',
      'Breakfast & Dinner',
      'Airport Transfers',
      'Ziyarat Tours',
      'Religious Guide',
      'Travel Insurance'
    ],
    exclusions: [
      'Lunch',
      'Personal Expenses',
      'Laundry',
      'Tips & Gratuities',
      'Optional Tours'
    ],
    itinerary: [
      {
        day: 1,
        title: 'Departure from Mumbai',
        description: 'Departure from Mumbai airport. Arrival in Jeddah and transfer to Makkah hotel.',
        activities: ['Airport check-in', 'Flight to Jeddah', 'Transfer to Makkah', 'Hotel check-in']
      },
      {
        day: 2,
        title: 'Umrah & Ziyarat',
        description: 'Perform Umrah and visit important Islamic sites in Makkah.',
        activities: ['Umrah rituals', 'Ziyarat of Makkah', 'Free time at Haram']
      },
      {
        day: 8,
        title: 'Transfer to Madinah',
        description: 'Check out from Makkah hotel and transfer to Madinah.',
        activities: ['Check out', 'Travel to Madinah', 'Hotel check-in', 'Visit Masjid Nabawi']
      },
      {
        day: 15,
        title: 'Return to Mumbai',
        description: 'Check out and transfer to Jeddah airport for return flight.',
        activities: ['Check out', 'Transfer to airport', 'Flight to Mumbai', 'Arrival']
      }
    ],
    rating: 4.8,
    reviewsCount: 456,
    reviews: [
      {
        id: 1,
        userName: 'Ahmed Khan',
        rating: 5,
        date: '2024-01-15',
        comment: 'Excellent package! Hotels were amazing, very close to Haram. Guide was knowledgeable. Highly recommended!',
        verified: true
      },
      {
        id: 2,
        userName: 'Fatima Sheikh',
        rating: 5,
        date: '2024-01-10',
        comment: 'MashaAllah! Everything was perfect. Food was good, hotels were clean. Will book again.',
        verified: true
      },
      {
        id: 3,
        userName: 'Mohammed Ali',
        rating: 4,
        date: '2024-01-05',
        comment: 'Good package overall. Only issue was flight timing. Otherwise everything was great.',
        verified: true
      }
    ],
    seatsRemaining: 8,
    featured: true,
    vendor: {
      id: 'v1',
      name: 'Makkah Express',
      trustScore: 98,
      yearsInBusiness: 15,
      totalBookings: 5000,
      responseTime: '2 hours',
      phone: '+91 98765 43210',
      email: 'info@makkahexpress.com'
    },
    images: [
      'https://via.placeholder.com/800x600/2d5f3f/ffffff?text=Swissotel+Makkah',
      'https://via.placeholder.com/800x600/2d5f3f/ffffff?text=Pullman+Madinah',
      'https://via.placeholder.com/800x600/2d5f3f/ffffff?text=Haram+View',
      'https://via.placeholder.com/800x600/2d5f3f/ffffff?text=Room+Interior'
    ],
    terms: [
      'Booking amount: 10% of total package cost',
      'Balance payment: 30 days before departure',
      'Cancellation: 50% refund if cancelled 45 days before departure',
      'Visa rejection: Full refund minus processing fee',
      'Valid passport required (minimum 6 months validity)',
      'Yellow fever vaccination certificate required'
    ]
  };

  const packageData = data?.data || mockPackage;

  const handleBookNow = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/booking/${id}` } });
    } else {
      navigate(`/booking/${id}`);
    }
  };

  const handleShare = () => {
    setShowShareModal(true);
  };

  const discount = packageData.basePrice && packageData.discountedPrice
    ? Math.round(((packageData.basePrice - packageData.discountedPrice) / packageData.basePrice) * 100)
    : 0;

  if (isLoading) {
    return (
      <div className="package-detail-loading">
        <div className="spinner spinner-lg"></div>
        <p>Loading package details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="package-detail-error">
        <h2>Failed to load package</h2>
        <p>Please try again later</p>
        <Link to="/packages" className="btn btn-primary">
          Back to Packages
        </Link>
      </div>
    );
  }

  return (
    <div className="package-detail-page">
      <div className="container">
        {/* Breadcrumb */}
        <div className="breadcrumb">
          <Link to="/">Home</Link>
          <span>/</span>
          <Link to="/packages">Packages</Link>
          <span>/</span>
          <span>{packageData.title}</span>
        </div>

        {/* Image Gallery */}
        <div className="package-gallery">
          <div className="gallery-main">
            <img src={packageData.images[0]} alt={packageData.title} />
            {packageData.featured && (
              <div className="gallery-badge">⭐ Featured</div>
            )}
            {discount > 0 && (
              <div className="gallery-discount">{discount}% OFF</div>
            )}
          </div>
          <div className="gallery-thumbnails">
            {packageData.images.slice(1, 4).map((img, index) => (
              <img key={index} src={img} alt={`View ${index + 2}`} />
            ))}
          </div>
        </div>

        <div className="package-detail-content">
          {/* Main Content */}
          <div className="package-main">
            {/* Header */}
            <div className="package-header">
              <div className="package-header-left">
                <div className="package-badges">
                  <span className="badge badge-primary">
                    {packageData.packageType.toUpperCase()}
                  </span>
                  <span className={`badge badge-${packageData.serviceClass === 'economy' ? 'blue' : packageData.serviceClass === 'gold' ? 'gold' : 'purple'}`}>
                    {packageData.serviceClass.charAt(0).toUpperCase() + packageData.serviceClass.slice(1)}
                  </span>
                </div>
                <h1 className="package-title">{packageData.title}</h1>
                <div className="package-meta">
                  <div className="meta-item">
                    <span className="meta-icon">📅</span>
                    <span>{packageData.duration} Days</span>
                  </div>
                  <div className="meta-item">
                    <span className="meta-icon">📍</span>
                    <span>{packageData.departureCity}</span>
                  </div>
                  <div className="meta-item">
                    <span className="meta-icon">⭐</span>
                    <span>{packageData.rating} ({packageData.reviewsCount} reviews)</span>
                  </div>
                </div>
              </div>
              <div className="package-header-right">
                <button className="share-btn" onClick={handleShare}>
                  <span>📤</span>
                  Share
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div className="package-tabs">
              <button
                className={`tab-btn ${selectedTab === 'overview' ? 'active' : ''}`}
                onClick={() => setSelectedTab('overview')}
              >
                Overview
              </button>
              <button
                className={`tab-btn ${selectedTab === 'itinerary' ? 'active' : ''}`}
                onClick={() => setSelectedTab('itinerary')}
              >
                Itinerary
              </button>
              <button
                className={`tab-btn ${selectedTab === 'hotels' ? 'active' : ''}`}
                onClick={() => setSelectedTab('hotels')}
              >
                Hotels
              </button>
              <button
                className={`tab-btn ${selectedTab === 'reviews' ? 'active' : ''}`}
                onClick={() => setSelectedTab('reviews')}
              >
                Reviews ({packageData.reviewsCount})
              </button>
              <button
                className={`tab-btn ${selectedTab === 'terms' ? 'active' : ''}`}
                onClick={() => setSelectedTab('terms')}
              >
                Terms
              </button>
            </div>

            {/* Tab Content */}
            <div className="tab-content">
              {/* Overview Tab */}
              {selectedTab === 'overview' && (
                <div className="overview-content">
                  <div className="overview-section">
                    <h3>Package Highlights</h3>
                    <div className="highlights-grid">
                      <div className="highlight-item">
                        <span className="highlight-icon">🕌</span>
                        <div>
                          <strong>{packageData.makkahDays} Days in Makkah</strong>
                          <p>Stay close to Haram</p>
                        </div>
                      </div>
                      <div className="highlight-item">
                        <span className="highlight-icon">🕋</span>
                        <div>
                          <strong>{packageData.madinahDays} Days in Madinah</strong>
                          <p>Near Masjid Nabawi</p>
                        </div>
                      </div>
                      <div className="highlight-item">
                        <span className="highlight-icon">✈️</span>
                        <div>
                          <strong>{packageData.flightDetails.flightType} Flights</strong>
                          <p>{packageData.flightDetails.airline}</p>
                        </div>
                      </div>
                      <div className="highlight-item">
                        <span className="highlight-icon">🏨</span>
                        <div>
                          <strong>5-Star Hotels</strong>
                          <p>Premium accommodation</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="overview-section">
                    <h3>✅ Inclusions</h3>
                    <ul className="inclusions-list">
                      {packageData.inclusions.map((item, index) => (
                        <li key={index}>
                          <span className="check-icon">✓</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="overview-section">
                    <h3>❌ Exclusions</h3>
                    <ul className="exclusions-list">
                      {packageData.exclusions.map((item, index) => (
                        <li key={index}>
                          <span className="cross-icon">✗</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="overview-section">
                    <h3>✈️ Flight Details</h3>
                    <div className="flight-details">
                      <div className="flight-item">
                        <strong>Airline:</strong>
                        <span>{packageData.flightDetails.airline}</span>
                      </div>
                      <div className="flight-item">
                        <strong>Flight Type:</strong>
                        <span>{packageData.flightDetails.flightType}</span>
                      </div>
                      <div className="flight-item">
                        <strong>Departure:</strong>
                        <span>{packageData.flightDetails.departureTime}</span>
                      </div>
                      <div className="flight-item">
                        <strong>Baggage:</strong>
                        <span>{packageData.flightDetails.baggage}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Itinerary Tab */}
              {selectedTab === 'itinerary' && (
                <div className="itinerary-content">
                  <div className="itinerary-timeline">
                    {packageData.itinerary.map((day, index) => (
                      <div key={index} className="itinerary-day">
                        <div className="day-number">Day {day.day}</div>
                        <div className="day-content">
                          <h4>{day.title}</h4>
                          <p>{day.description}</p>
                          <ul className="day-activities">
                            {day.activities.map((activity, idx) => (
                              <li key={idx}>{activity}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Hotels Tab */}
              {selectedTab === 'hotels' && (
                <div className="hotels-content">
                  <div className="hotel-card">
                    <h3>🕌 Makkah Hotel</h3>
                    <div className="hotel-details">
                      <div className="hotel-info">
                        <h4>{packageData.hotelDetails.makkah.name}</h4>
                        <div className="hotel-stars">
                          {'⭐'.repeat(packageData.hotelDetails.makkah.stars)}
                        </div>
                        <p className="hotel-distance">
                          📍 {packageData.hotelDetails.makkah.distance}
                        </p>
                        <p className="hotel-room">
                          🛏️ {packageData.hotelDetails.makkah.roomType}
                        </p>
                      </div>
                      <div className="hotel-amenities">
                        <h5>Amenities:</h5>
                        <ul>
                          {packageData.hotelDetails.makkah.amenities.map((amenity, index) => (
                            <li key={index}>✓ {amenity}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="hotel-card">
                    <h3>🕋 Madinah Hotel</h3>
                    <div className="hotel-details">
                      <div className="hotel-info">
                        <h4>{packageData.hotelDetails.madinah.name}</h4>
                        <div className="hotel-stars">
                          {'⭐'.repeat(packageData.hotelDetails.madinah.stars)}
                        </div>
                        <p className="hotel-distance">
                          📍 {packageData.hotelDetails.madinah.distance}
                        </p>
                        <p className="hotel-room">
                          🛏️ {packageData.hotelDetails.madinah.roomType}
                        </p>
                      </div>
                      <div className="hotel-amenities">
                        <h5>Amenities:</h5>
                        <ul>
                          {packageData.hotelDetails.madinah.amenities.map((amenity, index) => (
                            <li key={index}>✓ {amenity}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Reviews Tab */}
              {selectedTab === 'reviews' && (
                <div className="reviews-content">
                  <div className="reviews-summary">
                    <div className="rating-overview">
                      <div className="rating-score">{packageData.rating}</div>
                      <div className="rating-stars">
                        {'⭐'.repeat(Math.round(packageData.rating))}
                      </div>
                      <p>{packageData.reviewsCount} reviews</p>
                    </div>
                  </div>

                  <div className="reviews-list">
                    {packageData.reviews.map((review) => (
                      <div key={review.id} className="review-card">
                        <div className="review-header">
                          <div className="review-user">
                            <div className="user-avatar">
                              {review.userName.charAt(0)}
                            </div>
                            <div>
                              <h5>{review.userName}</h5>
                              <p className="review-date">{review.date}</p>
                            </div>
                          </div>
                          <div className="review-rating">
                            {'⭐'.repeat(review.rating)}
                          </div>
                        </div>
                        <p className="review-comment">{review.comment}</p>
                        {review.verified && (
                          <span className="verified-badge">✓ Verified Booking</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Terms Tab */}
              {selectedTab === 'terms' && (
                <div className="terms-content">
                  <h3>Terms & Conditions</h3>
                  <ul className="terms-list">
                    {packageData.terms.map((term, index) => (
                      <li key={index}>{term}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Vendor Info */}
            <div className="vendor-info-section">
              <h3>About the Vendor</h3>
              <div className="vendor-card">
                <div className="vendor-header">
                  <div className="vendor-avatar">
                    {packageData.vendor.name.charAt(0)}
                  </div>
                  <div className="vendor-details">
                    <h4>{packageData.vendor.name}</h4>
                    <div className="vendor-trust">
                      <span className="trust-score">✓ Trust Score: {packageData.vendor.trustScore}%</span>
                    </div>
                  </div>
                </div>
                <div className="vendor-stats">
                  <div className="stat">
                    <strong>{packageData.vendor.yearsInBusiness}+</strong>
                    <span>Years in Business</span>
                  </div>
                  <div className="stat">
                    <strong>{packageData.vendor.totalBookings}+</strong>
                    <span>Total Bookings</span>
                  </div>
                  <div className="stat">
                    <strong>{packageData.vendor.responseTime}</strong>
                    <span>Response Time</span>
                  </div>
                </div>
                <div className="vendor-contact">
                  <a href={`tel:${packageData.vendor.phone}`} className="contact-btn">
                    <span>📞</span>
                    Call Vendor
                  </a>
                  <a href={`mailto:${packageData.vendor.email}`} className="contact-btn">
                    <span>📧</span>
                    Email Vendor
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="package-sidebar">
            <div className="booking-card">
              <div className="price-section">
                {packageData.basePrice && packageData.discountedPrice && (
                  <div className="price-original">₹{packageData.basePrice.toLocaleString()}</div>
                )}
                <div className="price-current">
                  ₹{(packageData.discountedPrice || packageData.basePrice).toLocaleString()}
                </div>
                <div className="price-label">per person</div>
              </div>

              {packageData.seatsRemaining <= 10 && (
                <div className="urgency-banner">
                  🔥 Only {packageData.seatsRemaining} seats left!
                </div>
              )}

              <div className="booking-details">
                <div className="detail-item">
                  <span className="detail-icon">📅</span>
                  <div>
                    <strong>Departure</strong>
                    <p>{packageData.departureDate}</p>
                  </div>
                </div>
                <div className="detail-item">
                  <span className="detail-icon">🔙</span>
                  <div>
                    <strong>Return</strong>
                    <p>{packageData.returnDate}</p>
                  </div>
                </div>
              </div>

              <button className="btn btn-primary btn-lg" onClick={handleBookNow}>
                <span>🚀</span>
                Book Now
              </button>

              <div className="payment-info">
                <p>💳 Pay just 10% to book</p>
                <p>📅 Flexible installments available</p>
              </div>
            </div>

            <div className="help-card">
              <h4>Need Help?</h4>
              <p>Our travel experts are here to assist you</p>
              <a href="tel:+911800XXXXXXX" className="help-btn">
                <span>📞</span>
                Call Us
              </a>
              <a href="https://wa.me/911800XXXXXXX" className="help-btn">
                <span>💬</span>
                WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Share Modal */}
      {showShareModal && (
        <div className="modal-overlay" onClick={() => setShowShareModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Share this package</h3>
            <div className="share-options">
              <button className="share-option">📱 WhatsApp</button>
              <button className="share-option">📘 Facebook</button>
              <button className="share-option">🐦 Twitter</button>
              <button className="share-option">📧 Email</button>
              <button className="share-option">🔗 Copy Link</button>
            </div>
            <button className="btn btn-secondary" onClick={() => setShowShareModal(false)}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PackageDetailPage;
