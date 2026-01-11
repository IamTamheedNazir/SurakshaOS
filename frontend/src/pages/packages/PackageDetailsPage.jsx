import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import './PackageDetailsPage.css';

const PackageDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [packageData, setPackageData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchPackageDetails();
  }, [id]);

  const fetchPackageDetails = async () => {
    try {
      setLoading(true);
      // TODO: Replace with actual API call
      // const response = await fetch(`/api/packages/${id}`);
      // const data = await response.json();
      
      // Mock data
      setTimeout(() => {
        setPackageData({
          id: id,
          title: '14 Days Premium Umrah Package',
          type: 'Umrah',
          price: 85000,
          duration: 14,
          rating: 4.8,
          reviews: 156,
          vendor: {
            name: 'Al-Haramain Tours',
            verified: true,
            rating: 4.9
          },
          images: [
            '/images/kaaba-1.jpg',
            '/images/madinah-1.jpg',
            '/images/hotel-1.jpg',
            '/images/hotel-2.jpg'
          ],
          description: 'Experience a spiritually enriching journey with our premium 14-day Umrah package. This comprehensive package includes comfortable accommodation near Haram, guided tours, and all essential services for a peaceful pilgrimage.',
          highlights: [
            '5-star hotel near Masjid al-Haram',
            'Direct flights with premium airlines',
            'Experienced multilingual guides',
            'Ziyarat tours included',
            'Visa processing assistance',
            '24/7 customer support'
          ],
          itinerary: [
            { day: 1, title: 'Arrival in Jeddah', description: 'Airport pickup and transfer to Makkah hotel' },
            { day: 2, title: 'Umrah Performance', description: 'Guided Umrah with experienced guide' },
            { day: 3-7, title: 'Makkah Stay', description: 'Free time for worship and exploration' },
            { day: 8, title: 'Transfer to Madinah', description: 'Travel to Madinah with Ziyarat stops' },
            { day: 9-13, title: 'Madinah Stay', description: 'Prayers at Masjid an-Nabawi and Ziyarat' },
            { day: 14, title: 'Departure', description: 'Transfer to Jeddah airport for return flight' }
          ],
          inclusions: [
            'Return economy class airfare',
            '5-star hotel accommodation (double sharing)',
            'Daily breakfast and dinner',
            'Airport transfers',
            'Visa processing',
            'Ziyarat tours',
            'Travel insurance'
          ],
          exclusions: [
            'Personal expenses',
            'Lunch meals',
            'Additional Ziyarat tours',
            'Laundry services',
            'Tips and gratuities'
          ],
          hotels: [
            { name: 'Swissotel Makkah', location: '200m from Haram', rating: 5 },
            { name: 'Pullman Zamzam Madinah', location: '100m from Masjid Nabawi', rating: 5 }
          ],
          availableDates: [
            '2024-03-15',
            '2024-04-10',
            '2024-05-05',
            '2024-06-20'
          ]
        });
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error fetching package details:', error);
      setLoading(false);
    }
  };

  const handleBookNow = () => {
    navigate(`/booking/${id}`);
  };

  if (loading) {
    return (
      <div className="package-details-page">
        <div className="loading-container">
          <div className="loader"></div>
          <p>Loading package details...</p>
        </div>
      </div>
    );
  }

  if (!packageData) {
    return (
      <div className="package-details-page">
        <div className="error-container">
          <h2>Package Not Found</h2>
          <p>The package you're looking for doesn't exist.</p>
          <Link to="/packages" className="btn btn-primary">Browse Packages</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="package-details-page">
      {/* Breadcrumb */}
      <div className="breadcrumb">
        <Link to="/">Home</Link>
        <span className="separator">›</span>
        <Link to="/packages">Packages</Link>
        <span className="separator">›</span>
        <span className="current">{packageData.title}</span>
      </div>

      {/* Header Section */}
      <div className="package-header">
        <div className="header-content">
          <div className="package-badge">{packageData.type}</div>
          <h1 className="package-title">{packageData.title}</h1>
          <div className="package-meta">
            <div className="meta-item">
              <svg fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span>{packageData.rating} ({packageData.reviews} reviews)</span>
            </div>
            <div className="meta-item">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>{packageData.duration} Days</span>
            </div>
            <div className="meta-item">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              <span>{packageData.vendor.name}</span>
              {packageData.vendor.verified && (
                <span className="verified-badge">✓ Verified</span>
              )}
            </div>
          </div>
        </div>
        <div className="header-price">
          <div className="price-label">Starting from</div>
          <div className="price-value">₹{packageData.price.toLocaleString()}</div>
          <div className="price-note">per person</div>
          <button className="btn btn-primary btn-large" onClick={handleBookNow}>
            Book Now
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        </div>
      </div>

      {/* Image Gallery */}
      <div className="image-gallery">
        <div className="main-image">
          <img src={packageData.images[selectedImage]} alt={packageData.title} />
        </div>
        <div className="thumbnail-grid">
          {packageData.images.map((image, index) => (
            <div
              key={index}
              className={`thumbnail ${selectedImage === index ? 'active' : ''}`}
              onClick={() => setSelectedImage(index)}
            >
              <img src={image} alt={`View ${index + 1}`} />
            </div>
          ))}
        </div>
      </div>

      {/* Content Section */}
      <div className="package-content">
        {/* Tabs */}
        <div className="content-tabs">
          <button
            className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button
            className={`tab ${activeTab === 'itinerary' ? 'active' : ''}`}
            onClick={() => setActiveTab('itinerary')}
          >
            Itinerary
          </button>
          <button
            className={`tab ${activeTab === 'inclusions' ? 'active' : ''}`}
            onClick={() => setActiveTab('inclusions')}
          >
            Inclusions
          </button>
          <button
            className={`tab ${activeTab === 'hotels' ? 'active' : ''}`}
            onClick={() => setActiveTab('hotels')}
          >
            Hotels
          </button>
          <button
            className={`tab ${activeTab === 'reviews' ? 'active' : ''}`}
            onClick={() => setActiveTab('reviews')}
          >
            Reviews
          </button>
        </div>

        {/* Tab Content */}
        <div className="tab-content">
          {activeTab === 'overview' && (
            <div className="overview-content">
              <h2 className="section-title">
                <span className="title-decoration">✦</span>
                Package Overview
              </h2>
              <p className="description">{packageData.description}</p>

              <h3 className="subsection-title">Package Highlights</h3>
              <div className="highlights-grid">
                {packageData.highlights.map((highlight, index) => (
                  <div key={index} className="highlight-item">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>{highlight}</span>
                  </div>
                ))}
              </div>

              <h3 className="subsection-title">Available Dates</h3>
              <div className="dates-grid">
                {packageData.availableDates.map((date, index) => (
                  <div key={index} className="date-card">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>{new Date(date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'itinerary' && (
            <div className="itinerary-content">
              <h2 className="section-title">
                <span className="title-decoration">✦</span>
                Day-by-Day Itinerary
              </h2>
              <div className="itinerary-timeline">
                {packageData.itinerary.map((item, index) => (
                  <div key={index} className="timeline-item">
                    <div className="timeline-marker">
                      <span className="day-number">Day {item.day}</span>
                    </div>
                    <div className="timeline-content">
                      <h3 className="timeline-title">{item.title}</h3>
                      <p className="timeline-description">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'inclusions' && (
            <div className="inclusions-content">
              <div className="inclusions-grid">
                <div className="inclusions-section">
                  <h2 className="section-title">
                    <span className="title-decoration">✓</span>
                    What's Included
                  </h2>
                  <ul className="inclusions-list">
                    {packageData.inclusions.map((item, index) => (
                      <li key={index} className="inclusion-item included">
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="inclusions-section">
                  <h2 className="section-title">
                    <span className="title-decoration">✕</span>
                    What's Not Included
                  </h2>
                  <ul className="inclusions-list">
                    {packageData.exclusions.map((item, index) => (
                      <li key={index} className="inclusion-item excluded">
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'hotels' && (
            <div className="hotels-content">
              <h2 className="section-title">
                <span className="title-decoration">✦</span>
                Accommodation
              </h2>
              <div className="hotels-grid">
                {packageData.hotels.map((hotel, index) => (
                  <div key={index} className="hotel-card">
                    <div className="hotel-icon">🏨</div>
                    <h3 className="hotel-name">{hotel.name}</h3>
                    <div className="hotel-rating">
                      {'⭐'.repeat(hotel.rating)}
                    </div>
                    <p className="hotel-location">
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {hotel.location}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="reviews-content">
              <h2 className="section-title">
                <span className="title-decoration">✦</span>
                Customer Reviews
              </h2>
              <div className="reviews-summary">
                <div className="rating-overview">
                  <div className="rating-score">{packageData.rating}</div>
                  <div className="rating-stars">
                    {'⭐'.repeat(Math.floor(packageData.rating))}
                  </div>
                  <div className="rating-count">{packageData.reviews} reviews</div>
                </div>
              </div>
              <div className="empty-reviews">
                <p>Reviews will be displayed here</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Sticky Booking Bar (Mobile) */}
      <div className="sticky-booking-bar">
        <div className="bar-price">
          <span className="bar-price-label">From</span>
          <span className="bar-price-value">₹{packageData.price.toLocaleString()}</span>
        </div>
        <button className="btn btn-primary" onClick={handleBookNow}>
          Book Now
        </button>
      </div>
    </div>
  );
};

export default PackageDetailsPage;
