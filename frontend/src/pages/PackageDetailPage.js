import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import './PackageDetailPage.css';

const PackageDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedDate, setSelectedDate] = useState('');
  const [travelers, setTravelers] = useState(1);
  const [showBookingModal, setShowBookingModal] = useState(false);

  // Mock package data - in production, fetch from API
  const packageData = {
    id: 1,
    title: 'Premium Umrah Package - 15 Days',
    vendor: {
      id: 'vendor-1',
      name: 'Al-Haramain Tours',
      verified: true,
      trustScore: 98,
      totalPackages: 45,
      totalBookings: 2340,
      memberSince: '2018',
      logo: 'https://ui-avatars.com/api/?name=Al-Haramain+Tours&background=0f6b3f&color=fff&size=200',
      rating: 4.8,
      reviews: 1234,
    },
    price: 145000,
    discountedPrice: 135000,
    rating: 4.8,
    reviews: 234,
    images: [
      'https://images.unsplash.com/photo-1591604466107-ec97de577aff?w=1200',
      'https://images.unsplash.com/photo-1564769625905-50e93615e769?w=1200',
      'https://images.unsplash.com/photo-1542816417-0983c9c9ad53?w=1200',
      'https://images.unsplash.com/photo-1580418827493-f2b22c0a76cb?w=1200',
    ],
    duration: 15,
    departureCity: 'Mumbai',
    packageType: 'umrah',
    serviceClass: 'premium',
    verified: true,
    featured: true,
    topSeller: true,
    seatsRemaining: 8,
    makkahDays: 8,
    madinahDays: 7,
    
    overview: {
      description: 'Experience the spiritual journey of a lifetime with our Premium Umrah Package. This carefully curated 15-day package offers the perfect balance of comfort, spirituality, and convenience. Stay in 5-star hotels near the Haram, enjoy guided Ziyarat tours, and benefit from our 24/7 support throughout your journey.',
      highlights: [
        '5-Star Hotels within walking distance of Haram',
        'Direct flights with premium airlines',
        'Experienced multilingual guides',
        'Comprehensive Ziyarat tours in Makkah and Madinah',
        'All meals included (Breakfast, Lunch, Dinner)',
        '24/7 customer support and assistance',
        'Visa processing and documentation support',
        'Group prayers and spiritual sessions',
      ],
    },

    inclusions: [
      { icon: '✈️', title: 'Return Flights', description: 'Direct flights from Mumbai with premium airlines' },
      { icon: '🏨', title: '5-Star Hotels', description: 'Luxury accommodation near Haram in both cities' },
      { icon: '📋', title: 'Visa Processing', description: 'Complete visa assistance and documentation' },
      { icon: '🚌', title: 'Transportation', description: 'AC coaches for all transfers and Ziyarat' },
      { icon: '🍽️', title: 'All Meals', description: 'Breakfast, lunch, and dinner included' },
      { icon: '🎯', title: 'Ziyarat Tours', description: 'Guided tours to historical Islamic sites' },
      { icon: '👨‍🏫', title: 'Expert Guides', description: 'Multilingual experienced tour guides' },
      { icon: '📞', title: '24/7 Support', description: 'Round-the-clock assistance and support' },
    ],

    exclusions: [
      'Personal expenses and shopping',
      'Travel insurance (optional)',
      'Additional meals or snacks',
      'Laundry services',
      'Tips and gratuities',
      'Any services not mentioned in inclusions',
    ],

    itinerary: [
      {
        day: 1,
        title: 'Departure from Mumbai',
        activities: [
          'Gather at Mumbai International Airport',
          'Check-in and boarding formalities',
          'Departure to Jeddah/Madinah',
          'In-flight meals and services',
        ],
      },
      {
        day: 2,
        title: 'Arrival in Madinah',
        activities: [
          'Arrival at Madinah Airport',
          'Transfer to hotel near Masjid Nabawi',
          'Check-in and rest',
          'Evening prayer at Masjid Nabawi',
          'Orientation session',
        ],
      },
      {
        day: 3,
        title: 'Madinah - Day 1',
        activities: [
          'Fajr prayer at Masjid Nabawi',
          'Breakfast at hotel',
          'Ziyarat: Masjid Quba',
          'Ziyarat: Masjid Qiblatain',
          'Lunch',
          'Free time for prayers and rest',
          'Dinner and overnight stay',
        ],
      },
      {
        day: 4,
        title: 'Madinah - Day 2',
        activities: [
          'Fajr prayer at Masjid Nabawi',
          'Breakfast',
          'Ziyarat: Uhud Mountain',
          'Ziyarat: Shuhada Uhud Cemetery',
          'Lunch',
          'Visit to dates market',
          'Evening prayers and spiritual session',
          'Dinner',
        ],
      },
      {
        day: 5,
        title: 'Madinah - Day 3',
        activities: [
          'Fajr prayer at Masjid Nabawi',
          'Breakfast',
          'Ziyarat: Seven Mosques',
          'Ziyarat: Masjid Jummah',
          'Lunch',
          'Free time for personal prayers',
          'Farewell to Madinah',
          'Dinner',
        ],
      },
      {
        day: 6,
        title: 'Transfer to Makkah',
        activities: [
          'Fajr prayer',
          'Breakfast and check-out',
          'Departure to Makkah by AC coach',
          'Arrival in Makkah',
          'Check-in at hotel near Haram',
          'Perform Umrah (Ihram, Tawaf, Sai, Halq/Taqsir)',
          'Rest and dinner',
        ],
      },
      {
        day: 7,
        title: 'Makkah - Day 1',
        activities: [
          'Fajr prayer at Masjid al-Haram',
          'Breakfast',
          'Free time for Tawaf and prayers',
          'Lunch',
          'Rest period',
          'Evening prayers',
          'Dinner',
        ],
      },
      {
        day: 8,
        title: 'Makkah - Day 2',
        activities: [
          'Fajr prayer',
          'Breakfast',
          'Ziyarat: Jabal al-Nour (Cave of Hira)',
          'Ziyarat: Jabal Thawr',
          'Lunch',
          'Return to hotel',
          'Evening prayers and Tawaf',
          'Dinner',
        ],
      },
      {
        day: 9,
        title: 'Makkah - Day 3',
        activities: [
          'Fajr prayer',
          'Breakfast',
          'Ziyarat: Jannat al-Mualla Cemetery',
          'Visit to historical sites',
          'Lunch',
          'Shopping time at Abraj Al Bait Mall',
          'Evening prayers',
          'Dinner',
        ],
      },
      {
        day: 10,
        title: 'Makkah - Day 4',
        activities: [
          'Fajr prayer',
          'Breakfast',
          'Free time for additional Umrah (optional)',
          'Lunch',
          'Rest and personal prayers',
          'Evening Tawaf',
          'Dinner and spiritual session',
        ],
      },
      {
        day: 11,
        title: 'Makkah - Day 5',
        activities: [
          'Fajr prayer',
          'Breakfast',
          'Visit to Makkah Museum',
          'Lunch',
          'Free time for prayers and Tawaf',
          'Shopping for souvenirs',
          'Dinner',
        ],
      },
      {
        day: 12,
        title: 'Makkah - Day 6',
        activities: [
          'Fajr prayer',
          'Breakfast',
          'Full day for personal worship',
          'Multiple Tawaf sessions',
          'Lunch and dinner at hotel',
          'Evening prayers',
        ],
      },
      {
        day: 13,
        title: 'Makkah - Day 7',
        activities: [
          'Fajr prayer',
          'Breakfast',
          'Final Tawaf and prayers',
          'Lunch',
          'Packing and preparation',
          'Farewell dinner',
          'Group photo session',
        ],
      },
      {
        day: 14,
        title: 'Departure Preparation',
        activities: [
          'Fajr prayer and final Tawaf',
          'Breakfast and check-out',
          'Transfer to Jeddah Airport',
          'Airport formalities',
          'Departure to Mumbai',
        ],
      },
      {
        day: 15,
        title: 'Arrival in Mumbai',
        activities: [
          'Arrival at Mumbai Airport',
          'Immigration and customs',
          'Baggage collection',
          'End of journey - May Allah accept your Umrah',
        ],
      },
    ],

    hotels: {
      makkah: {
        name: 'Swissotel Makkah',
        rating: 5,
        distance: '2 min walk to Haram',
        image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
        amenities: ['WiFi', 'AC', 'Restaurant', 'Room Service', 'Laundry'],
      },
      madinah: {
        name: 'Pullman Zamzam Madinah',
        rating: 5,
        distance: '5 min walk to Masjid Nabawi',
        image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800',
        amenities: ['WiFi', 'AC', 'Restaurant', 'Room Service', 'Laundry'],
      },
    },

    availableDates: [
      { date: '2025-02-15', seats: 12, price: 135000 },
      { date: '2025-03-01', seats: 8, price: 135000 },
      { date: '2025-03-15', seats: 15, price: 140000 },
      { date: '2025-04-01', seats: 20, price: 145000 },
      { date: '2025-04-15', seats: 18, price: 145000 },
    ],

    faqs: [
      {
        question: 'What documents are required for Umrah visa?',
        answer: 'You will need a valid passport (minimum 6 months validity), passport-size photographs, vaccination certificates (Meningitis, COVID-19), and completed visa application forms. We will assist you with all documentation.',
      },
      {
        question: 'Is travel insurance included?',
        answer: 'Travel insurance is optional and not included in the package price. However, we highly recommend purchasing comprehensive travel insurance for your peace of mind.',
      },
      {
        question: 'What is the cancellation policy?',
        answer: 'Cancellations made 60+ days before departure: 10% deduction. 30-59 days: 25% deduction. 15-29 days: 50% deduction. Less than 15 days: No refund. Visa fees are non-refundable.',
      },
      {
        question: 'Are meals included in the package?',
        answer: 'Yes, all meals (breakfast, lunch, and dinner) are included in the package. We provide a variety of Indian and international cuisine options.',
      },
      {
        question: 'What is the group size?',
        answer: 'Our groups typically consist of 30-40 pilgrims, ensuring personalized attention while maintaining a community atmosphere.',
      },
      {
        question: 'Can I extend my stay?',
        answer: 'Yes, you can extend your stay. Please contact us at least 30 days before departure for extension arrangements. Additional charges will apply.',
      },
    ],

    reviews: [
      {
        id: 1,
        user: 'Mohammed Ahmed',
        rating: 5,
        date: '2024-12-15',
        comment: 'Alhamdulillah, excellent service! The hotels were very close to Haram, and the guides were knowledgeable. Highly recommended!',
        helpful: 45,
      },
      {
        id: 2,
        user: 'Fatima Khan',
        rating: 5,
        date: '2024-12-10',
        comment: 'Best Umrah experience ever! Everything was well-organized, from flights to accommodation. The Ziyarat tours were very informative.',
        helpful: 38,
      },
      {
        id: 3,
        user: 'Abdul Rahman',
        rating: 4,
        date: '2024-12-05',
        comment: 'Great package overall. The only minor issue was the food variety, but everything else was perfect. May Allah reward the team!',
        helpful: 22,
      },
      {
        id: 4,
        user: 'Aisha Siddiqui',
        rating: 5,
        date: '2024-11-28',
        comment: 'Professional and caring team. They took care of everything, allowing us to focus on our worship. The hotels were luxurious and comfortable.',
        helpful: 56,
      },
    ],
  };

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleBookNow = () => {
    if (!selectedDate) {
      alert('Please select a departure date');
      return;
    }
    setShowBookingModal(true);
  };

  const handleProceedToBooking = () => {
    // Navigate to booking page with selected details
    navigate(`/booking/${id}`, {
      state: {
        packageId: id,
        date: selectedDate,
        travelers: travelers,
        price: packageData.discountedPrice,
      },
    });
  };

  const calculateTotal = () => {
    const selectedDateData = packageData.availableDates.find(d => d.date === selectedDate);
    const pricePerPerson = selectedDateData ? selectedDateData.price : packageData.discountedPrice;
    return pricePerPerson * travelers;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  return (
    <div className="package-detail-page">
      {/* Image Gallery */}
      <section className="image-gallery">
        <div className="main-image-container">
          <img 
            src={packageData.images[currentImageIndex]} 
            alt={packageData.title}
            className="main-image"
          />
          <div className="image-navigation">
            <button 
              className="nav-btn prev"
              onClick={() => setCurrentImageIndex((currentImageIndex - 1 + packageData.images.length) % packageData.images.length)}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button 
              className="nav-btn next"
              onClick={() => setCurrentImageIndex((currentImageIndex + 1) % packageData.images.length)}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
          <div className="image-indicators">
            {packageData.images.map((_, index) => (
              <button
                key={index}
                className={`indicator ${index === currentImageIndex ? 'active' : ''}`}
                onClick={() => setCurrentImageIndex(index)}
              />
            ))}
          </div>
        </div>
        <div className="thumbnail-grid">
          {packageData.images.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`${packageData.title} ${index + 1}`}
              className={`thumbnail ${index === currentImageIndex ? 'active' : ''}`}
              onClick={() => setCurrentImageIndex(index)}
            />
          ))}
        </div>
      </section>

      <div className="package-detail-container">
        <div className="detail-content">
          {/* Header */}
          <div className="package-header">
            <div className="breadcrumb">
              <Link to="/">Home</Link>
              <span>/</span>
              <Link to="/packages">Packages</Link>
              <span>/</span>
              <span>{packageData.title}</span>
            </div>

            <div className="header-main">
              <div className="header-left">
                <div className="badges">
                  {packageData.verified && <span className="badge verified">✓ Verified</span>}
                  {packageData.topSeller && <span className="badge top-seller">🔥 Top Seller</span>}
                  {packageData.featured && <span className="badge featured">⭐ Featured</span>}
                </div>
                <h1 className="package-title">{packageData.title}</h1>
                <div className="package-meta">
                  <div className="meta-item">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                    <span>{packageData.rating} ({packageData.reviews} reviews)</span>
                  </div>
                  <div className="meta-item">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    </svg>
                    <span>{packageData.departureCity}</span>
                  </div>
                  <div className="meta-item">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>{packageData.duration} Days</span>
                  </div>
                </div>
              </div>

              <div className="header-right">
                <div className="price-box">
                  <div className="price-original">₹{packageData.price.toLocaleString()}</div>
                  <div className="price-current">₹{packageData.discountedPrice.toLocaleString()}</div>
                  <div className="price-per">per person</div>
                  <div className="savings">
                    Save ₹{(packageData.price - packageData.discountedPrice).toLocaleString()} 
                    ({Math.round(((packageData.price - packageData.discountedPrice) / packageData.price) * 100)}% OFF)
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Vendor Info */}
          <div className="vendor-card">
            <img src={packageData.vendor.logo} alt={packageData.vendor.name} className="vendor-logo" />
            <div className="vendor-info">
              <div className="vendor-name">
                {packageData.vendor.name}
                {packageData.vendor.verified && (
                  <svg className="verified-icon" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )}
              </div>
              <div className="vendor-stats">
                <span>⭐ {packageData.vendor.rating} Rating</span>
                <span>📦 {packageData.vendor.totalPackages} Packages</span>
                <span>✅ {packageData.vendor.totalBookings.toLocaleString()} Bookings</span>
                <span>📅 Since {packageData.vendor.memberSince}</span>
              </div>
            </div>
            <Link to={`/vendors/${packageData.vendor.id}`} className="view-vendor-btn">
              View Profile
            </Link>
          </div>

          {/* Tabs */}
          <div className="tabs-container">
            <div className="tabs-header">
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
                Reviews ({packageData.reviews.length})
              </button>
              <button 
                className={`tab ${activeTab === 'faqs' ? 'active' : ''}`}
                onClick={() => setActiveTab('faqs')}
              >
                FAQs
              </button>
            </div>

            <div className="tabs-content">
              {/* Overview Tab */}
              {activeTab === 'overview' && (
                <div className="tab-content">
                  <h2>Package Overview</h2>
                  <p className="overview-description">{packageData.overview.description}</p>
                  
                  <h3>Package Highlights</h3>
                  <ul className="highlights-list">
                    {packageData.overview.highlights.map((highlight, index) => (
                      <li key={index}>
                        <svg viewBox="0 0 24 24" fill="currentColor">
                          <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {highlight}
                      </li>
                    ))}
                  </ul>

                  <div className="quick-info-grid">
                    <div className="info-card">
                      <div className="info-icon">🕌</div>
                      <div className="info-label">Makkah Stay</div>
                      <div className="info-value">{packageData.makkahDays} Days</div>
                    </div>
                    <div className="info-card">
                      <div className="info-icon">🕋</div>
                      <div className="info-label">Madinah Stay</div>
                      <div className="info-value">{packageData.madinahDays} Days</div>
                    </div>
                    <div className="info-card">
                      <div className="info-icon">✈️</div>
                      <div className="info-label">Flight Type</div>
                      <div className="info-value">Direct</div>
                    </div>
                    <div className="info-card">
                      <div className="info-icon">🏨</div>
                      <div className="info-label">Hotel Rating</div>
                      <div className="info-value">5 Star</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Itinerary Tab */}
              {activeTab === 'itinerary' && (
                <div className="tab-content">
                  <h2>Day-by-Day Itinerary</h2>
                  <div className="itinerary-timeline">
                    {packageData.itinerary.map((day) => (
                      <div key={day.day} className="itinerary-day">
                        <div className="day-number">Day {day.day}</div>
                        <div className="day-content">
                          <h3>{day.title}</h3>
                          <ul>
                            {day.activities.map((activity, index) => (
                              <li key={index}>{activity}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Inclusions Tab */}
              {activeTab === 'inclusions' && (
                <div className="tab-content">
                  <h2>What's Included</h2>
                  <div className="inclusions-grid">
                    {packageData.inclusions.map((item, index) => (
                      <div key={index} className="inclusion-card">
                        <div className="inclusion-icon">{item.icon}</div>
                        <h3>{item.title}</h3>
                        <p>{item.description}</p>
                      </div>
                    ))}
                  </div>

                  <h2>What's Not Included</h2>
                  <ul className="exclusions-list">
                    {packageData.exclusions.map((item, index) => (
                      <li key={index}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Hotels Tab */}
              {activeTab === 'hotels' && (
                <div className="tab-content">
                  <h2>Accommodation Details</h2>
                  
                  <div className="hotel-card">
                    <img src={packageData.hotels.makkah.image} alt={packageData.hotels.makkah.name} />
                    <div className="hotel-info">
                      <h3>{packageData.hotels.makkah.name}</h3>
                      <div className="hotel-rating">
                        {'⭐'.repeat(packageData.hotels.makkah.rating)}
                      </div>
                      <div className="hotel-distance">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        </svg>
                        {packageData.hotels.makkah.distance}
                      </div>
                      <div className="hotel-amenities">
                        {packageData.hotels.makkah.amenities.map((amenity, index) => (
                          <span key={index} className="amenity-tag">{amenity}</span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="hotel-card">
                    <img src={packageData.hotels.madinah.image} alt={packageData.hotels.madinah.name} />
                    <div className="hotel-info">
                      <h3>{packageData.hotels.madinah.name}</h3>
                      <div className="hotel-rating">
                        {'⭐'.repeat(packageData.hotels.madinah.rating)}
                      </div>
                      <div className="hotel-distance">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        </svg>
                        {packageData.hotels.madinah.distance}
                      </div>
                      <div className="hotel-amenities">
                        {packageData.hotels.madinah.amenities.map((amenity, index) => (
                          <span key={index} className="amenity-tag">{amenity}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Reviews Tab */}
              {activeTab === 'reviews' && (
                <div className="tab-content">
                  <h2>Customer Reviews</h2>
                  <div className="reviews-summary">
                    <div className="summary-score">
                      <div className="score-number">{packageData.rating}</div>
                      <div className="score-stars">{'⭐'.repeat(Math.round(packageData.rating))}</div>
                      <div className="score-text">Based on {packageData.reviews.length} reviews</div>
                    </div>
                  </div>

                  <div className="reviews-list">
                    {packageData.reviews.map((review) => (
                      <div key={review.id} className="review-card">
                        <div className="review-header">
                          <div className="reviewer-info">
                            <div className="reviewer-avatar">
                              {review.user.charAt(0)}
                            </div>
                            <div>
                              <div className="reviewer-name">{review.user}</div>
                              <div className="review-date">{formatDate(review.date)}</div>
                            </div>
                          </div>
                          <div className="review-rating">
                            {'⭐'.repeat(review.rating)}
                          </div>
                        </div>
                        <p className="review-comment">{review.comment}</p>
                        <div className="review-helpful">
                          <button className="helpful-btn">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                            </svg>
                            Helpful ({review.helpful})
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* FAQs Tab */}
              {activeTab === 'faqs' && (
                <div className="tab-content">
                  <h2>Frequently Asked Questions</h2>
                  <div className="faqs-list">
                    {packageData.faqs.map((faq, index) => (
                      <div key={index} className="faq-item">
                        <h3>{faq.question}</h3>
                        <p>{faq.answer}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Booking Sidebar */}
        <div className="booking-sidebar">
          <div className="booking-card">
            <h3>Book This Package</h3>
            
            <div className="form-group">
              <label>Select Departure Date</label>
              <select 
                value={selectedDate} 
                onChange={(e) => setSelectedDate(e.target.value)}
                className="form-select"
              >
                <option value="">Choose a date</option>
                {packageData.availableDates.map((dateOption) => (
                  <option key={dateOption.date} value={dateOption.date}>
                    {formatDate(dateOption.date)} - {dateOption.seats} seats left
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Number of Travelers</label>
              <div className="travelers-selector">
                <button 
                  onClick={() => setTravelers(Math.max(1, travelers - 1))}
                  className="qty-btn"
                >
                  -
                </button>
                <span className="qty-value">{travelers}</span>
                <button 
                  onClick={() => setTravelers(travelers + 1)}
                  className="qty-btn"
                >
                  +
                </button>
              </div>
            </div>

            {selectedDate && (
              <div className="price-breakdown">
                <div className="breakdown-row">
                  <span>Price per person</span>
                  <span>₹{packageData.discountedPrice.toLocaleString()}</span>
                </div>
                <div className="breakdown-row">
                  <span>Travelers</span>
                  <span>× {travelers}</span>
                </div>
                <div className="breakdown-row total">
                  <span>Total Amount</span>
                  <span>₹{calculateTotal().toLocaleString()}</span>
                </div>
              </div>
            )}

            <button className="book-now-btn" onClick={handleBookNow}>
              Book Now
            </button>

            <div className="booking-features">
              <div className="feature">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Instant Confirmation</span>
              </div>
              <div className="feature">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Secure Payment</span>
              </div>
              <div className="feature">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>24/7 Support</span>
              </div>
            </div>
          </div>

          {packageData.seatsRemaining <= 10 && (
            <div className="urgency-banner">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span>Only {packageData.seatsRemaining} seats remaining!</span>
            </div>
          )}

          <div className="contact-card">
            <h4>Need Help?</h4>
            <p>Our travel experts are here to assist you</p>
            <a href="tel:+919876543210" className="contact-btn">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              Call: +91 98765 43210
            </a>
            <a href="https://wa.me/919876543210" className="contact-btn whatsapp">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              WhatsApp Us
            </a>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {showBookingModal && (
        <div className="modal-overlay" onClick={() => setShowBookingModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowBookingModal(false)}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            <h2>Confirm Booking Details</h2>
            
            <div className="modal-summary">
              <div className="summary-item">
                <span className="label">Package:</span>
                <span className="value">{packageData.title}</span>
              </div>
              <div className="summary-item">
                <span className="label">Departure Date:</span>
                <span className="value">{formatDate(selectedDate)}</span>
              </div>
              <div className="summary-item">
                <span className="label">Travelers:</span>
                <span className="value">{travelers} {travelers === 1 ? 'Person' : 'People'}</span>
              </div>
              <div className="summary-item total">
                <span className="label">Total Amount:</span>
                <span className="value">₹{calculateTotal().toLocaleString()}</span>
              </div>
            </div>

            <div className="modal-actions">
              <button className="btn-secondary" onClick={() => setShowBookingModal(false)}>
                Cancel
              </button>
              <button className="btn-primary" onClick={handleProceedToBooking}>
                Proceed to Payment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PackageDetailPage;
