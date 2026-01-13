import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './ProfessionalHomePage.css';

const ProfessionalHomePage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [currentBannerSlide, setCurrentBannerSlide] = useState(0);
  const [searchFilters, setSearchFilters] = useState({
    destination: '',
    packageType: '',
    duration: '',
    priceMin: '',
    priceMax: '',
    departureDate: '',
    starRating: '',
  });

  const totalBannerSlides = 3;

  // Auto-slide banner
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBannerSlide((prev) => (prev + 1) % totalBannerSlides);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    Object.entries(searchFilters).forEach(([key, value]) => {
      if (value) params.append(key, value);
    });
    navigate(`/packages?${params.toString()}`);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setSearchFilters(prev => ({ ...prev, [name]: value }));
  };

  const nextBannerSlide = () => {
    setCurrentBannerSlide((prev) => (prev + 1) % totalBannerSlides);
  };

  const prevBannerSlide = () => {
    setCurrentBannerSlide((prev) => (prev - 1 + totalBannerSlides) % totalBannerSlides);
  };

  // Trust statistics
  const stats = [
    { value: '500+', label: 'Verified Vendors' },
    { value: '50K+', label: 'Happy Pilgrims' },
    { value: '4.9★', label: 'Average Rating' },
    { value: '24/7', label: 'Support' },
  ];

  // All services
  const services = [
    { id: 1, name: 'Hajj', icon: '🕋', description: 'Complete Hajj packages', link: '/packages?type=hajj' },
    { id: 2, name: 'Umrah', icon: '⭐', description: 'Umrah packages', link: '/packages?type=umrah' },
    { id: 3, name: 'Ziyarat', icon: '📍', description: 'Holy site tours', link: '/packages?type=ziyarat' },
    { id: 4, name: 'Hotels', icon: '🏨', description: 'Accommodation', link: '/packages?type=hotel' },
    { id: 5, name: 'Visa', icon: '📋', description: 'Visa services', link: '/services/visa' },
    { id: 6, name: 'Forex', icon: '💱', description: 'Currency exchange', link: '/services/forex' },
    { id: 7, name: 'Catering', icon: '🍽️', description: 'Food services', link: '/services/catering' },
    { id: 8, name: 'Transport', icon: '🚌', description: 'Transportation', link: '/services/transport' },
    { id: 9, name: 'Flights', icon: '✈️', description: 'Flight booking', link: '/services/flights' },
    { id: 10, name: 'Utilities', icon: '📱', description: 'Essential services', link: '/services/utilities' },
    { id: 11, name: 'Laundry', icon: '🧺', description: 'Laundry services', link: '/services/laundry' },
    { id: 12, name: 'More', icon: '⋯', description: 'View all', link: '/services' },
  ];

  // Featured packages
  const featuredPackages = [
    {
      id: 1,
      title: 'Premium Umrah Package',
      vendor: 'Al-Haramain Tours',
      rating: 4.9,
      reviews: 234,
      price: 89999,
      duration: '10 Days',
      hotel: '5 Star',
      image: 'https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?w=800',
      badge: 'Best Seller',
    },
    {
      id: 2,
      title: 'Economy Umrah Package',
      vendor: 'Makkah Express',
      rating: 4.7,
      reviews: 189,
      price: 54999,
      duration: '7 Days',
      hotel: '3 Star',
      image: 'https://images.unsplash.com/photo-1564769625905-50e93615e769?w=800',
      badge: 'Budget Friendly',
    },
    {
      id: 3,
      title: 'Luxury Hajj Package 2025',
      vendor: 'Royal Pilgrimage',
      rating: 5.0,
      reviews: 156,
      price: 349999,
      duration: '21 Days',
      hotel: '5 Star Deluxe',
      image: 'https://images.unsplash.com/photo-1542816417-0983c9c9ad53?w=800',
      badge: 'Premium',
    },
    {
      id: 4,
      title: 'Ramadan Special Umrah',
      vendor: 'Blessed Journey',
      rating: 4.8,
      reviews: 298,
      price: 124999,
      duration: '15 Days',
      hotel: '4 Star',
      image: 'https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?w=800',
      badge: 'Limited Offer',
    },
  ];

  // Testimonials
  const testimonials = [
    {
      id: 1,
      name: 'Ahmed Khan',
      location: 'Mumbai, India',
      rating: 5,
      text: 'Exceptional service! The entire journey was smooth and well-organized. Highly recommend UmrahConnect for anyone planning their pilgrimage.',
      avatar: 'https://ui-avatars.com/api/?name=Ahmed+Khan&background=0f6b3f&color=fff',
    },
    {
      id: 2,
      name: 'Fatima Begum',
      location: 'Delhi, India',
      rating: 5,
      text: 'Best decision to book through UmrahConnect. The vendor was professional, hotels were excellent, and the support team was always available.',
      avatar: 'https://ui-avatars.com/api/?name=Fatima+Begum&background=0f6b3f&color=fff',
    },
    {
      id: 3,
      name: 'Mohammed Ali',
      location: 'Bangalore, India',
      rating: 5,
      text: 'Transparent pricing and no hidden charges. The tracking feature kept us informed throughout. Will definitely use again for Hajj.',
      avatar: 'https://ui-avatars.com/api/?name=Mohammed+Ali&background=0f6b3f&color=fff',
    },
  ];

  // How it works steps
  const howItWorksSteps = [
    {
      step: 1,
      title: 'Search & Compare',
      description: 'Browse thousands of packages from verified vendors with transparent pricing',
      icon: '🔍',
    },
    {
      step: 2,
      title: 'Book Securely',
      description: 'Choose your perfect package and book with secure payment options',
      icon: '🔒',
    },
    {
      step: 3,
      title: 'Track Journey',
      description: 'Monitor your application status and preparations in real-time',
      icon: '📍',
    },
    {
      step: 4,
      title: 'Travel Blessed',
      description: 'Embark on your spiritual journey with complete peace of mind',
      icon: '✈️',
    },
  ];

  return (
    <div className="professional-homepage">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="islamic-pattern-bg"></div>
        
        <div className="decorative-elements">
          <div className="glow-orb glow-orb-1"></div>
          <div className="glow-orb glow-orb-2"></div>
        </div>

        <div className="hero-content">
          {/* Arabic Calligraphy */}
          <div className="arabic-text">
            <p>بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ</p>
          </div>

          {/* Trust Badge */}
          <div className="hero-badge">
            <span className="badge-dot"></span>
            <span>Trusted by 50,000+ Pilgrims</span>
          </div>

          {/* Main Title */}
          <h1 className="hero-title">
            Your Trusted Marketplace for
            <span className="text-green"> Hajj</span> &
            <span className="text-gold"> Umrah</span> Services
          </h1>

          <p className="hero-subtitle">
            Connect with verified vendors, compare transparent pricing, and track your pilgrimage journey step-by-step with complete peace of mind.
          </p>

          {/* CTA Buttons */}
          <div className="hero-cta">
            <Link to="/packages" className="btn-primary-hero">
              <span>Explore Services</span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
            <Link to="/tracking" className="btn-secondary-hero">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <span>Track My Application</span>
            </Link>
          </div>

          {/* Advanced Search Card */}
          <div className="hero-search-section">
            <h3 className="search-title">Find Your Perfect Journey</h3>
            <p className="search-subtitle">Search from thousands of Umrah and Hajj packages</p>

            <form onSubmit={handleSearch} className="search-card">
              {/* Main Search Row */}
              <div className="search-grid">
                <div className="search-field">
                  <label>Destination</label>
                  <div className="input-wrapper">
                    <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <input
                      type="text"
                      name="destination"
                      placeholder="Makkah, Madinah..."
                      value={searchFilters.destination}
                      onChange={handleFilterChange}
                    />
                  </div>
                </div>

                <div className="search-field">
                  <label>Package Type</label>
                  <select name="packageType" value={searchFilters.packageType} onChange={handleFilterChange}>
                    <option value="">All Types</option>
                    <option value="umrah">Umrah</option>
                    <option value="hajj">Hajj</option>
                    <option value="ziyarat">Ziyarat</option>
                    <option value="hotel">Hotels Only</option>
                  </select>
                </div>

                <div className="search-field">
                  <label>Duration</label>
                  <select name="duration" value={searchFilters.duration} onChange={handleFilterChange}>
                    <option value="">Any Duration</option>
                    <option value="7">7 Days</option>
                    <option value="10">10 Days</option>
                    <option value="15">15 Days</option>
                    <option value="21">21 Days</option>
                    <option value="30">30+ Days</option>
                  </select>
                </div>

                <button type="submit" className="search-btn">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <span>Search</span>
                </button>
              </div>

              {/* Advanced Filters */}
              <div className="advanced-filters">
                <div className="filter-field">
                  <label>Price Range</label>
                  <div className="price-range">
                    <input
                      type="number"
                      name="priceMin"
                      placeholder="Min ₹"
                      value={searchFilters.priceMin}
                      onChange={handleFilterChange}
                    />
                    <span>-</span>
                    <input
                      type="number"
                      name="priceMax"
                      placeholder="Max ₹"
                      value={searchFilters.priceMax}
                      onChange={handleFilterChange}
                    />
                  </div>
                </div>

                <div className="filter-field">
                  <label>Departure Date</label>
                  <input
                    type="date"
                    name="departureDate"
                    value={searchFilters.departureDate}
                    onChange={handleFilterChange}
                  />
                </div>

                <div className="filter-field">
                  <label>Star Rating</label>
                  <select name="starRating" value={searchFilters.starRating} onChange={handleFilterChange}>
                    <option value="">Any Rating</option>
                    <option value="5">5 Star</option>
                    <option value="4">4 Star</option>
                    <option value="3">3 Star</option>
                  </select>
                </div>
              </div>
            </form>
          </div>

          {/* Trust Indicators */}
          <div className="trust-indicators">
            {stats.map((stat, index) => (
              <div key={index} className="trust-card">
                <div className="trust-value">{stat.value}</div>
                <div className="trust-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Banner Slider Section */}
      <section className="banner-slider-section">
        <div className="banner-slider-wrapper">
          <div 
            className="banner-slider"
            style={{ transform: `translateX(-${currentBannerSlide * 100}%)` }}
          >
            {/* Banner 1 - Ramadan Umrah */}
            <div className="banner-slide banner-green">
              <div className="banner-content">
                <div className="banner-badge">🌙 Limited Time Offer</div>
                <h2 className="banner-title">Early Bird Ramadan Umrah 2025</h2>
                <p className="banner-text">Save up to 30% on premium packages. Book before December 31st!</p>
                <div className="banner-actions">
                  <Link to="/packages?offer=ramadan" className="banner-btn-primary">Book Now →</Link>
                  <Link to="/packages" className="banner-btn-secondary">View Packages</Link>
                </div>
              </div>
              <div className="banner-emoji">🕌</div>
            </div>

            {/* Banner 2 - VIP Hajj */}
            <div className="banner-slide banner-gold">
              <div className="banner-content">
                <div className="banner-badge">⭐ Premium Experience</div>
                <h2 className="banner-title">VIP Hajj 2025 Packages</h2>
                <p className="banner-text">5-star hotels near Haram. Expert guides. All-inclusive luxury experience.</p>
                <div className="banner-actions">
                  <Link to="/packages?type=hajj&category=vip" className="banner-btn-dark">Register Interest →</Link>
                  <Link to="/packages?type=hajj" className="banner-btn-outline-dark">Learn More</Link>
                </div>
              </div>
              <div className="banner-emoji">⭐</div>
            </div>

            {/* Banner 3 - Group Packages */}
            <div className="banner-slide banner-blue">
              <div className="banner-content">
                <div className="banner-badge">👥 Group Discount</div>
                <h2 className="banner-title">Special Group Packages</h2>
                <p className="banner-text">Travel with family & friends. Get up to 25% off on group bookings of 10+</p>
                <div className="banner-actions">
                  <Link to="/packages?type=group" className="banner-btn-primary">Get Quote →</Link>
                  <Link to="/contact" className="banner-btn-secondary">Contact Us</Link>
                </div>
              </div>
              <div className="banner-emoji">👨‍👩‍👧‍👦</div>
            </div>
          </div>

          {/* Slider Controls */}
          <button className="banner-nav banner-nav-prev" onClick={prevBannerSlide}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button className="banner-nav banner-nav-next" onClick={nextBannerSlide}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Slider Dots */}
          <div className="banner-dots">
            {[...Array(totalBannerSlides)].map((_, index) => (
              <button
                key={index}
                className={`banner-dot ${currentBannerSlide === index ? 'active' : ''}`}
                onClick={() => setCurrentBannerSlide(index)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Services Grid Section */}
      <section className="services-section">
        <div className="section-header">
          <h2 className="section-title">Explore Our Services</h2>
          <p className="section-subtitle">Everything you need for your spiritual journey</p>
        </div>

        <div className="services-grid">
          {services.map((service) => (
            <Link key={service.id} to={service.link} className="service-card">
              <div className="service-icon">{service.icon}</div>
              <h3 className="service-name">{service.name}</h3>
              <p className="service-description">{service.description}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Packages Section */}
      <section className="featured-packages-section">
        <div className="section-header">
          <h2 className="section-title">Featured Packages</h2>
          <p className="section-subtitle">Handpicked packages from our trusted vendors</p>
        </div>

        <div className="packages-grid">
          {featuredPackages.map((pkg) => (
            <div key={pkg.id} className="package-card">
              {pkg.badge && <div className="package-badge">{pkg.badge}</div>}
              
              <div className="package-image">
                <img src={pkg.image} alt={pkg.title} />
              </div>

              <div className="package-content">
                <h3 className="package-title">{pkg.title}</h3>
                <p className="package-vendor">{pkg.vendor}</p>

                <div className="package-rating">
                  <span className="rating-stars">⭐ {pkg.rating}</span>
                  <span className="rating-reviews">({pkg.reviews} reviews)</span>
                </div>

                <div className="package-details">
                  <div className="package-detail">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>{pkg.duration}</span>
                  </div>
                  <div className="package-detail">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    <span>{pkg.hotel}</span>
                  </div>
                </div>

                <div className="package-footer">
                  <div className="package-price">
                    <span className="price-label">Starting from</span>
                    <span className="price-value">₹{pkg.price.toLocaleString()}</span>
                  </div>
                  <Link to={`/packages/${pkg.id}`} className="package-btn">
                    View Details
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="section-cta">
          <Link to="/packages" className="btn-view-all">
            View All Packages
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works-section">
        <div className="section-header">
          <h2 className="section-title">How It Works</h2>
          <p className="section-subtitle">Your journey to a blessed pilgrimage in 4 simple steps</p>
        </div>

        <div className="steps-grid">
          {howItWorksSteps.map((step) => (
            <div key={step.step} className="step-card">
              <div className="step-number">{step.step}</div>
              <div className="step-icon">{step.icon}</div>
              <h3 className="step-title">{step.title}</h3>
              <p className="step-description">{step.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section">
        <div className="section-header">
          <h2 className="section-title">What Our Pilgrims Say</h2>
          <p className="section-subtitle">Real experiences from thousands of satisfied travelers</p>
        </div>

        <div className="testimonials-grid">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="testimonial-card">
              <div className="testimonial-rating">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <span key={i} className="star">⭐</span>
                ))}
              </div>
              <p className="testimonial-text">"{testimonial.text}"</p>
              <div className="testimonial-author">
                <img src={testimonial.avatar} alt={testimonial.name} className="author-avatar" />
                <div className="author-info">
                  <h4 className="author-name">{testimonial.name}</h4>
                  <p className="author-location">{testimonial.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-content">
          <h2 className="cta-title">Ready to Begin Your Spiritual Journey?</h2>
          <p className="cta-subtitle">Join thousands of pilgrims who trust UmrahConnect for their sacred journey</p>
          <div className="cta-buttons">
            <Link to="/register" className="btn-cta-primary">
              Get Started Today
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
            <Link to="/contact" className="btn-cta-secondary">
              Talk to an Expert
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProfessionalHomePage;
