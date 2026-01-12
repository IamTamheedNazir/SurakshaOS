import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Search, 
  Users, 
  Building2, 
  Package, 
  Star,
  TrendingUp,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import './ProfessionalHomePage.css';

const ProfessionalHomePage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [currentBannerSlide, setCurrentBannerSlide] = useState(0);
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
    if (searchQuery.trim()) {
      navigate(`/packages?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const nextBannerSlide = () => {
    setCurrentBannerSlide((prev) => (prev + 1) % totalBannerSlides);
  };

  const prevBannerSlide = () => {
    setCurrentBannerSlide((prev) => (prev - 1 + totalBannerSlides) % totalBannerSlides);
  };

  const goToBannerSlide = (index) => {
    setCurrentBannerSlide(index);
  };

  // Trust statistics
  const stats = [
    { icon: <Building2 size={24} />, value: '500+', label: 'Verified Vendors' },
    { icon: <Users size={24} />, value: '50K+', label: 'Happy Pilgrims' },
    { icon: <Star size={24} />, value: '4.9★', label: 'Average Rating' },
    { icon: <Package size={24} />, value: '24/7', label: 'Support' },
  ];

  // All services
  const services = [
    { id: 1, name: 'Hajj', icon: '🕋', link: '#hajj' },
    { id: 2, name: 'Umrah', icon: '⭐', link: '#umrah' },
    { id: 3, name: 'Ziyarat', icon: '📍', link: '#ziyarat' },
    { id: 4, name: 'Hotels', icon: '🏨', link: '#hotels' },
    { id: 5, name: 'Visa', icon: '📋', link: '#visa' },
    { id: 6, name: 'Forex', icon: '💱', link: '#forex' },
    { id: 7, name: 'Catering', icon: '🍽️', link: '#catering' },
    { id: 8, name: 'Transport', icon: '🚌', link: '#transport' },
    { id: 9, name: 'Flights', icon: '✈️', link: '#flights' },
    { id: 10, name: 'Utilities', icon: '📱', link: '#utilities' },
    { id: 11, name: 'Laundry', icon: '🧺', link: '#laundry' },
    { id: 12, name: 'More', icon: '⋯', link: '#' },
  ];

  return (
    <div className="professional-homepage">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-overlay"></div>
        
        {/* Decorative Elements */}
        <div className="hero-decorations">
          <div className="decoration-circle decoration-left"></div>
          <div className="decoration-circle decoration-right"></div>
        </div>

        {/* Mosque Silhouette */}
        <div className="mosque-silhouette">
          <svg viewBox="0 0 1440 320" fill="#0f6b3f">
            <path d="M720,80 L740,40 L760,80 L720,80 M700,80 L700,120 L780,120 L780,80 M680,120 L680,200 L800,200 L800,120 M600,200 L600,280 L880,280 L880,200 M500,200 L500,120 L520,80 L540,120 L540,200 M900,200 L900,120 L920,80 L940,120 L940,200 M400,280 L400,200 L420,160 L440,200 L440,280 M1000,280 L1000,200 L1020,160 L1040,200 L1040,280 M0,320 L0,280 L1440,280 L1440,320 Z" />
          </svg>
        </div>

        <div className="container hero-content">
          {/* Arabic Calligraphy */}
          <div className="arabic-text">
            <p className="font-arabic">بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ</p>
          </div>

          {/* Main Hero Content */}
          <div className="hero-main">
            <div className="hero-badge">
              <span className="badge-dot"></span>
              <span>Trusted by 50,000+ Pilgrims</span>
            </div>

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
              <button className="btn-primary-hero">
                <span>Explore Services</span>
                <ArrowRight size={20} />
              </button>
              <button className="btn-secondary-hero">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <span>Track My Application</span>
              </button>
            </div>

            {/* Advanced Search */}
            <div className="hero-search-section">
              <h3 className="search-title">Find Your Perfect Journey</h3>
              <p className="search-subtitle">Search from thousands of Umrah and Hajj packages</p>

              <div className="search-card">
                {/* Main Search Row */}
                <div className="search-grid">
                  <div className="search-field">
                    <label>Destination</label>
                    <div className="input-wrapper">
                      <svg className="input-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <input type="text" placeholder="Makkah, Madinah..." />
                    </div>
                  </div>

                  <div className="search-field">
                    <label>Package Type</label>
                    <select>
                      <option value="">All Types</option>
                      <option value="umrah">Umrah</option>
                      <option value="hajj">Hajj</option>
                      <option value="ziyarat">Ziyarat</option>
                      <option value="hotel">Hotels Only</option>
                    </select>
                  </div>

                  <div className="search-field">
                    <label>Duration</label>
                    <select>
                      <option value="">Any Duration</option>
                      <option value="7">7 Days</option>
                      <option value="10">10 Days</option>
                      <option value="15">15 Days</option>
                      <option value="21">21 Days</option>
                      <option value="30">30+ Days</option>
                    </select>
                  </div>

                  <button className="search-btn">
                    <Search size={20} />
                    <span>Search</span>
                  </button>
                </div>

                {/* Advanced Filters */}
                <div className="advanced-filters">
                  <div className="filter-field">
                    <label>Price Range</label>
                    <div className="price-range">
                      <input type="number" placeholder="Min ₹" />
                      <span>-</span>
                      <input type="number" placeholder="Max ₹" />
                    </div>
                  </div>

                  <div className="filter-field">
                    <label>Departure Date</label>
                    <input type="date" />
                  </div>

                  <div className="filter-field">
                    <label>Star Rating</label>
                    <select>
                      <option value="">Any Rating</option>
                      <option value="5">5 Star</option>
                      <option value="4">4 Star</option>
                      <option value="3">3 Star</option>
                    </select>
                  </div>
                </div>
              </div>
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
        </div>
      </section>

      {/* Banner Slider Section */}
      <section className="banner-slider-section">
        <div className="container">
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
                    <button className="banner-btn-primary">Book Now →</button>
                    <button className="banner-btn-secondary">View Packages</button>
                  </div>
                </div>
                <div className="banner-emoji">🕌</div>
              </div>

              {/* Banner 2 - VIP Hajj */}
              <div className="banner-slide banner-gold">
                <div className="banner-content">
                  <div className="banner-badge">⭐ Premium Experience</div>
                  <h2 className="banner-title banner-title-dark">VIP Hajj 2025 Packages</h2>
                  <p className="banner-text banner-text-dark">5-star hotels near Haram. Expert guides. All-inclusive luxury experience.</p>
                  <div className="banner-actions">
                    <button className="banner-btn-dark">Register Interest →</button>
                    <button className="banner-btn-outline-dark">Learn More</button>
                  </div>
                </div>
                <div className="banner-emoji banner-emoji-dark">✨</div>
              </div>

              {/* Banner 3 - Ziyarat */}
              <div className="banner-slide banner-green-alt">
                <div className="banner-content">
                  <div className="banner-badge">🕋 Sacred Journey</div>
                  <h2 className="banner-title">Complete Ziyarat Experience</h2>
                  <p className="banner-text">Visit all historical sites in Makkah & Madinah with expert Islamic scholars.</p>
                  <div className="banner-actions">
                    <button className="banner-btn-gold">Explore Tours →</button>
                    <button className="banner-btn-secondary">See Itinerary</button>
                  </div>
                </div>
                <div className="banner-emoji">📿</div>
              </div>
            </div>

            {/* Navigation Arrows */}
            <button className="banner-arrow banner-arrow-left" onClick={prevBannerSlide}>
              <ChevronLeft size={24} />
            </button>
            <button className="banner-arrow banner-arrow-right" onClick={nextBannerSlide}>
              <ChevronRight size={24} />
            </button>

            {/* Dots Navigation */}
            <div className="banner-dots">
              {[0, 1, 2].map((index) => (
                <button
                  key={index}
                  className={`banner-dot ${currentBannerSlide === index ? 'active' : ''}`}
                  onClick={() => goToBannerSlide(index)}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="services-section">
        <div className="container">
          <div className="section-header">
            <span className="section-badge">Complete Solutions</span>
            <h2 className="section-title">Services We Offer</h2>
            <p className="section-subtitle">Everything you need for your pilgrimage journey in one place</p>
          </div>

          <div className="services-scroll">
            {services.map((service) => (
              <a key={service.id} href={service.link} className="service-card">
                <div className="service-icon">{service.icon}</div>
                <h3 className="service-name">{service.name}</h3>
                <p className="service-desc">
                  {service.name === 'Hajj' && 'Complete packages'}
                  {service.name === 'Umrah' && 'All year round'}
                  {service.name === 'Ziyarat' && 'Guided tours'}
                  {service.name === 'Hotels' && 'Near Haram'}
                  {service.name === 'Visa' && 'Fast processing'}
                  {service.name === 'Forex' && 'Best rates'}
                  {service.name === 'Catering' && 'Halal meals'}
                  {service.name === 'Transport' && 'AC vehicles'}
                  {service.name === 'Flights' && 'Best fares'}
                  {service.name === 'Utilities' && 'SIM, WiFi & more'}
                  {service.name === 'Laundry' && 'Quick service'}
                  {service.name === 'More' && 'Explore all'}
                </p>
              </a>
            ))}
          </div>

          <div className="scroll-indicator">
            <ChevronLeft size={20} />
            <span>Scroll to explore all services</span>
            <ChevronRight size={20} />
          </div>
        </div>
      </section>

      {/* Placeholder for more sections */}
      <div style={{ padding: '4rem 0', textAlign: 'center', color: '#666' }}>
        <p>More sections coming: Umrah Packages, Hajj Packages, Vendors, etc.</p>
      </div>
    </div>
  );
};

export default ProfessionalHomePage;
