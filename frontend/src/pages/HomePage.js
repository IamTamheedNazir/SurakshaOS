import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import SearchBar from '../components/search/SearchBar';
import PackageCard from '../components/package/PackageCard';
import './HomePage.css';

const HomePage = () => {
  const [featuredPackages, setFeaturedPackages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch featured packages
    fetchFeaturedPackages();
  }, []);

  const fetchFeaturedPackages = async () => {
    try {
      setLoading(true);
      // TODO: Replace with actual API call
      // const response = await fetch('/api/packages?featured=true&limit=6');
      // const data = await response.json();
      
      // Mock data for now
      const mockPackages = [
        {
          id: 1,
          title: 'Premium Umrah Package - 14 Days',
          destination: 'Makkah & Madinah',
          duration: 14,
          price: 125000,
          discounted_price: 99000,
          images: ['/images/makkah.jpg'],
          avg_rating: 4.8,
          review_count: 156,
          vendor_name: 'Al-Haramain Tours',
          type: 'umrah',
          departure_date: '2026-03-15'
        },
        // Add more mock packages...
      ];
      
      setFeaturedPackages(mockPackages);
    } catch (error) {
      console.error('Error fetching packages:', error);
    } finally {
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
              <span className="hero-icon">🕌</span>
              Begin Your Sacred Journey
            </h1>
            <p className="hero-subtitle">
              Connect with trusted vendors for your Umrah and Hajj pilgrimage
            </p>
            <div className="hero-stats">
              <div className="stat-item">
                <span className="stat-number">10,000+</span>
                <span className="stat-label">Happy Pilgrims</span>
              </div>
              <div className="stat-divider"></div>
              <div className="stat-item">
                <span className="stat-number">500+</span>
                <span className="stat-label">Verified Vendors</span>
              </div>
              <div className="stat-divider"></div>
              <div className="stat-item">
                <span className="stat-number">1,000+</span>
                <span className="stat-label">Packages</span>
              </div>
            </div>
          </div>
        </div>
        <div className="hero-decoration hero-decoration-left">✦</div>
        <div className="hero-decoration hero-decoration-right">✦</div>
      </section>

      {/* Search Section */}
      <section className="search-section">
        <div className="container">
          <SearchBar onSearch={handleSearch} showFilters={true} />
        </div>
      </section>

      {/* Featured Packages Section */}
      <section className="featured-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">
              <span className="title-decoration">✦</span>
              Featured Packages
              <span className="title-decoration">✦</span>
            </h2>
            <p className="section-subtitle">
              Handpicked packages for your blessed journey
            </p>
          </div>

          {loading ? (
            <div className="loading-grid">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="package-skeleton"></div>
              ))}
            </div>
          ) : (
            <>
              <div className="packages-grid">
                {featuredPackages.map((pkg) => (
                  <PackageCard key={pkg.id} package={pkg} />
                ))}
              </div>

              <div className="section-cta">
                <Link to="/packages" className="btn btn-gold btn-lg">
                  View All Packages
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Link>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="features-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">
              Why Choose UmrahConnect
            </h2>
            <p className="section-subtitle">
              Your trusted partner for a blessed pilgrimage
            </p>
          </div>

          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="feature-title">Verified Vendors</h3>
              <p className="feature-description">
                All vendors are thoroughly verified and certified for your peace of mind
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
                Compare packages from multiple vendors to get the best deals
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
                Round-the-clock customer support for all your queries and concerns
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="feature-title">Secure Payments</h3>
              <p className="feature-description">
                Multiple secure payment options with full refund protection
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="feature-title">Easy Documentation</h3>
              <p className="feature-description">
                Hassle-free visa processing and documentation assistance
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              </div>
              <h3 className="feature-title">Trusted Reviews</h3>
              <p className="feature-description">
                Real reviews from verified pilgrims to help you choose wisely
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2 className="cta-title">Ready to Begin Your Journey?</h2>
            <p className="cta-subtitle">
              Join thousands of satisfied pilgrims who trusted us with their sacred journey
            </p>
            <div className="cta-buttons">
              <Link to="/packages" className="btn btn-primary btn-lg">
                Browse Packages
              </Link>
              <Link to="/register" className="btn btn-white btn-lg">
                Create Account
              </Link>
            </div>
          </div>
        </div>
        <div className="cta-decoration cta-decoration-left">✦</div>
        <div className="cta-decoration cta-decoration-right">✦</div>
      </section>
    </div>
  );
};

export default HomePage;
