import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { packagesAPI } from '../../services/api';
import PackageCard from '../../components/package/PackageCard';
import SearchBar from '../../components/common/SearchBar';
import './HomePage.css';

const HomePage = () => {
  const [featuredPackages, setFeaturedPackages] = useState([]);
  const [popularPackages, setPopularPackages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHomeData();
  }, []);

  const fetchHomeData = async () => {
    try {
      setLoading(true);
      // TODO: Replace with actual API calls when backend is ready
      // const [featured, popular] = await Promise.all([
      //   packagesAPI.getFeaturedPackages(),
      //   packagesAPI.getPopularPackages()
      // ]);
      
      // Mock data for now
      setTimeout(() => {
        setFeaturedPackages([]);
        setPopularPackages([]);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error fetching home data:', error);
      setLoading(false);
    }
  };

  const handleSearch = (searchData) => {
    console.log('Search data:', searchData);
    // TODO: Navigate to packages page with search params
  };

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">
              <span className="title-icon">🕋</span>
              Begin Your Sacred Journey
            </h1>
            <p className="hero-subtitle">
              Discover the perfect Umrah and Hajj packages tailored for your spiritual journey
            </p>
            <div className="hero-stats">
              <div className="stat-item">
                <span className="stat-value">10,000+</span>
                <span className="stat-label">Happy Pilgrims</span>
              </div>
              <div className="stat-divider">✦</div>
              <div className="stat-item">
                <span className="stat-value">500+</span>
                <span className="stat-label">Packages</span>
              </div>
              <div className="stat-divider">✦</div>
              <div className="stat-item">
                <span className="stat-value">85+</span>
                <span className="stat-label">Trusted Vendors</span>
              </div>
            </div>
          </div>
          
          {/* Search Bar */}
          <div className="hero-search">
            <SearchBar onSearch={handleSearch} />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="feature-title">Verified Vendors</h3>
              <p className="feature-description">
                All our vendors are thoroughly verified and certified for your peace of mind
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="feature-title">Best Prices</h3>
              <p className="feature-description">
                Compare packages from multiple vendors and get the best deals for your budget
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h3 className="feature-title">24/7 Support</h3>
              <p className="feature-description">
                Our dedicated support team is available round the clock to assist you
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="feature-title">Easy Booking</h3>
              <p className="feature-description">
                Simple and secure booking process with instant confirmation
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Package Types Section */}
      <section className="package-types-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">
              <span className="title-decoration">✦</span>
              Choose Your Journey
            </h2>
            <p className="section-subtitle">
              Select from our carefully curated Umrah and Hajj packages
            </p>
          </div>

          <div className="package-types-grid">
            <Link to="/packages?type=umrah" className="package-type-card">
              <div className="package-type-icon">🕌</div>
              <h3 className="package-type-title">Umrah Packages</h3>
              <p className="package-type-description">
                Perform Umrah with comfort and convenience. Choose from economy to luxury packages.
              </p>
              <div className="package-type-stats">
                <span className="stat">300+ Packages</span>
                <span className="stat-divider">•</span>
                <span className="stat">Starting ₹45,000</span>
              </div>
              <div className="package-type-cta">
                Explore Umrah Packages
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </div>
            </Link>

            <Link to="/packages?type=hajj" className="package-type-card">
              <div className="package-type-icon">🕋</div>
              <h3 className="package-type-title">Hajj Packages</h3>
              <p className="package-type-description">
                Fulfill your religious obligation with our comprehensive Hajj packages.
              </p>
              <div className="package-type-stats">
                <span className="stat">200+ Packages</span>
                <span className="stat-divider">•</span>
                <span className="stat">Starting ₹2,50,000</span>
              </div>
              <div className="package-type-cta">
                Explore Hajj Packages
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Packages Section */}
      {!loading && featuredPackages.length > 0 && (
        <section className="featured-packages-section">
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">
                <span className="title-decoration">✦</span>
                Featured Packages
              </h2>
              <Link to="/packages" className="section-link">
                View All Packages
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            </div>

            <div className="packages-grid">
              {featuredPackages.map((pkg) => (
                <PackageCard key={pkg.id} package={pkg} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Why Choose Us Section */}
      <section className="why-choose-section">
        <div className="container">
          <div className="why-choose-content">
            <div className="why-choose-text">
              <h2 className="section-title">
                <span className="title-decoration">✦</span>
                Why Choose UmrahConnect?
              </h2>
              <div className="why-choose-list">
                <div className="why-choose-item">
                  <div className="check-icon">✓</div>
                  <div>
                    <h4>Trusted by Thousands</h4>
                    <p>Over 10,000 satisfied pilgrims have completed their journey with us</p>
                  </div>
                </div>
                <div className="why-choose-item">
                  <div className="check-icon">✓</div>
                  <div>
                    <h4>Comprehensive Services</h4>
                    <p>From visa processing to accommodation, we handle everything</p>
                  </div>
                </div>
                <div className="why-choose-item">
                  <div className="check-icon">✓</div>
                  <div>
                    <h4>Experienced Guides</h4>
                    <p>Knowledgeable multilingual guides to assist you throughout</p>
                  </div>
                </div>
                <div className="why-choose-item">
                  <div className="check-icon">✓</div>
                  <div>
                    <h4>Flexible Payment Options</h4>
                    <p>Easy EMI and installment plans available</p>
                  </div>
                </div>
              </div>
              <Link to="/about" className="btn btn-primary btn-large">
                Learn More About Us
              </Link>
            </div>
            <div className="why-choose-image">
              <div className="image-placeholder">
                <span className="placeholder-icon">🕌</span>
                <p>Kaaba Image</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2 className="cta-title">Ready to Begin Your Sacred Journey?</h2>
            <p className="cta-description">
              Browse our packages and book your Umrah or Hajj trip today
            </p>
            <div className="cta-buttons">
              <Link to="/packages" className="btn btn-primary btn-large">
                Browse All Packages
              </Link>
              <Link to="/contact" className="btn btn-secondary btn-large">
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
