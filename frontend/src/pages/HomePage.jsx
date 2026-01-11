import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import BannerSlider from '../components/banner/BannerSlider';
import Testimonials from '../components/testimonials/Testimonials';
import { packagesAPI } from '../services/api';
import { useSettings } from '../contexts/SettingsContext';
import './HomePage.css';

const HomePage = () => {
  const { settings, formatCurrency } = useSettings();
  const [featuredPackages, setFeaturedPackages] = useState([]);
  const [popularPackages, setPopularPackages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPackages();
  }, [settings]);

  const fetchPackages = async () => {
    try {
      setLoading(true);
      
      // Fetch featured packages
      if (settings?.homepage?.showFeaturedPackages) {
        const featuredResponse = await packagesAPI.getFeaturedPackages(
          settings.homepage.featuredPackagesLimit || 6
        );
        if (featuredResponse.success) {
          setFeaturedPackages(featuredResponse.data || []);
        }
      }

      // Fetch popular packages
      if (settings?.homepage?.showPopularPackages) {
        const popularResponse = await packagesAPI.getPopularPackages(
          settings.homepage.popularPackagesLimit || 6
        );
        if (popularResponse.success) {
          setPopularPackages(popularResponse.data || []);
        }
      }
    } catch (error) {
      console.error('Error fetching packages:', error);
    } finally {
      setLoading(false);
    }
  };

  const PackageCard = ({ pkg }) => (
    <Link to={`/packages/${pkg._id}`} className="package-card">
      <div className="package-image">
        <img src={pkg.primaryImage || pkg.images[0]?.url} alt={pkg.title} />
        {pkg.discount > 0 && (
          <div className="package-badge discount-badge">
            {pkg.discount}% OFF
          </div>
        )}
        {pkg.isFeatured && (
          <div className="package-badge featured-badge">Featured</div>
        )}
      </div>
      
      <div className="package-content">
        <div className="package-header">
          <span className="package-type">{pkg.type}</span>
          <span className="package-category">{pkg.category}</span>
        </div>
        
        <h3 className="package-title">{pkg.title}</h3>
        
        <p className="package-description">
          {pkg.shortDescription || pkg.description}
        </p>
        
        <div className="package-details">
          <div className="package-detail">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>{pkg.duration.days} Days / {pkg.duration.nights} Nights</span>
          </div>
          
          <div className="package-detail">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span>{pkg.availability.availableSeats} Seats Available</span>
          </div>
        </div>
        
        <div className="package-footer">
          <div className="package-price">
            {pkg.originalPrice && (
              <span className="original-price">{formatCurrency(pkg.originalPrice)}</span>
            )}
            <span className="current-price">{formatCurrency(pkg.price)}</span>
          </div>
          
          <button className="package-button">
            View Details
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        </div>
      </div>
    </Link>
  );

  return (
    <div className="home-page">
      {/* Hero Banner Slider */}
      <BannerSlider />

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
              <h3>Verified Vendors</h3>
              <p>All our vendors are verified and trusted partners</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3>Best Prices</h3>
              <p>Competitive pricing with no hidden charges</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h3>24/7 Support</h3>
              <p>Round-the-clock customer support for your journey</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3>Easy Booking</h3>
              <p>Simple and secure online booking process</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Packages */}
      {settings?.homepage?.showFeaturedPackages && featuredPackages.length > 0 && (
        <section className="packages-section">
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">Featured Packages</h2>
              <p className="section-subtitle">
                Handpicked packages for your spiritual journey
              </p>
            </div>

            {loading ? (
              <div className="packages-loading">
                <div className="loading-spinner"></div>
              </div>
            ) : (
              <div className="packages-grid">
                {featuredPackages.map((pkg) => (
                  <PackageCard key={pkg._id} pkg={pkg} />
                ))}
              </div>
            )}

            <div className="section-footer">
              <Link to="/packages" className="view-all-button">
                View All Packages
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Popular Packages */}
      {settings?.homepage?.showPopularPackages && popularPackages.length > 0 && (
        <section className="packages-section popular-packages">
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">Popular Packages</h2>
              <p className="section-subtitle">
                Most booked packages by our pilgrims
              </p>
            </div>

            {loading ? (
              <div className="packages-loading">
                <div className="loading-spinner"></div>
              </div>
            ) : (
              <div className="packages-grid">
                {popularPackages.map((pkg) => (
                  <PackageCard key={pkg._id} pkg={pkg} />
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Testimonials */}
      {settings?.homepage?.showTestimonials && (
        <Testimonials limit={settings.homepage.testimonialsLimit || 6} />
      )}

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Begin Your Sacred Journey?</h2>
            <p>Book your Umrah or Hajj package today and experience a journey of a lifetime</p>
            <div className="cta-buttons">
              <Link to="/packages" className="cta-button primary">
                Browse Packages
              </Link>
              <Link to="/contact" className="cta-button secondary">
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
