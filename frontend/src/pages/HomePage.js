import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery } from 'react-query';
import { packagesAPI } from '../services/api';
import './HomePage.css';

const HomePage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  
  // Fetch featured packages
  const { data: packagesData, isLoading } = useQuery('featuredPackages', 
    () => packagesAPI.getAll({ featured: true, limit: 12 })
  );

  // Mock data for development
  const mockPackages = [
    {
      id: 1,
      title: 'Premium Umrah Package - 15 Days',
      vendor: 'Al-Haramain Tours',
      price: 145000,
      discountedPrice: 135000,
      rating: 4.8,
      reviews: 234,
      image: 'https://images.unsplash.com/photo-1591604466107-ec97de577aff?w=400',
      duration: '15 Days',
      departure: 'Mumbai',
      verified: true,
      featured: true,
    },
    {
      id: 2,
      title: 'Economy Umrah Package - 10 Days',
      vendor: 'Makkah Express',
      price: 75000,
      discountedPrice: 68000,
      rating: 4.6,
      reviews: 189,
      image: 'https://images.unsplash.com/photo-1564769625905-50e93615e769?w=400',
      duration: '10 Days',
      departure: 'Delhi',
      verified: true,
    },
    {
      id: 3,
      title: 'Luxury Hajj Package - 30 Days',
      vendor: 'Royal Pilgrimage',
      price: 450000,
      discountedPrice: 425000,
      rating: 4.9,
      reviews: 156,
      image: 'https://images.unsplash.com/photo-1542816417-0983c9c9ad53?w=400',
      duration: '30 Days',
      departure: 'Bangalore',
      verified: true,
      featured: true,
    },
    {
      id: 4,
      title: 'Budget Umrah Package - 7 Days',
      vendor: 'Quick Umrah',
      price: 55000,
      discountedPrice: 52000,
      rating: 4.4,
      reviews: 298,
      image: 'https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?w=400',
      duration: '7 Days',
      departure: 'Hyderabad',
      verified: true,
    },
    {
      id: 5,
      title: 'Family Umrah Package - 12 Days',
      vendor: 'Family Tours',
      price: 180000,
      discountedPrice: 165000,
      rating: 4.7,
      reviews: 167,
      image: 'https://images.unsplash.com/photo-1609599006353-e629aaabfeae?w=400',
      duration: '12 Days',
      departure: 'Chennai',
      verified: true,
    },
    {
      id: 6,
      title: 'VIP Umrah Package - 20 Days',
      vendor: 'Elite Pilgrimage',
      price: 285000,
      discountedPrice: 265000,
      rating: 4.9,
      reviews: 89,
      image: 'https://images.unsplash.com/photo-1580418827493-f2b22c0a76cb?w=400',
      duration: '20 Days',
      departure: 'Kolkata',
      verified: true,
      featured: true,
    },
    {
      id: 7,
      title: 'Group Umrah Package - 14 Days',
      vendor: 'Community Tours',
      price: 95000,
      discountedPrice: 88000,
      rating: 4.5,
      reviews: 312,
      image: 'https://images.unsplash.com/photo-1591604466107-ec97de577aff?w=400',
      duration: '14 Days',
      departure: 'Pune',
      verified: true,
    },
    {
      id: 8,
      title: 'Ramadan Special Package - 21 Days',
      vendor: 'Blessed Journey',
      price: 195000,
      discountedPrice: 185000,
      rating: 4.8,
      reviews: 201,
      image: 'https://images.unsplash.com/photo-1564769625905-50e93615e769?w=400',
      duration: '21 Days',
      departure: 'Ahmedabad',
      verified: true,
      featured: true,
    },
  ];

  const packages = packagesData?.data || mockPackages;
  const featuredPackages = packages.filter(pkg => pkg.featured);
  const allPackages = packages;

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/packages?search=${searchQuery}`);
    }
  };

  const categories = [
    { name: 'Economy Packages', icon: '💰', count: '150+' },
    { name: 'Premium Packages', icon: '⭐', count: '80+' },
    { name: 'Luxury Packages', icon: '👑', count: '45+' },
    { name: 'Family Packages', icon: '👨‍👩‍👧‍👦', count: '120+' },
    { name: 'Group Packages', icon: '👥', count: '95+' },
    { name: 'Ramadan Special', icon: '🌙', count: '60+' },
  ];

  return (
    <div className="homepage">
      {/* Hero Section with Search */}
      <section className="hero-section">
        <div className="hero-overlay"></div>
        <div className="container hero-content">
          <h1 className="hero-title">Find Your Perfect Umrah & Hajj Package</h1>
          <p className="hero-subtitle">Compare packages from 500+ verified vendors across India</p>
          
          {/* Search Bar */}
          <form className="search-bar" onSubmit={handleSearch}>
            <div className="search-input-wrapper">
              <span className="search-icon">🔍</span>
              <input
                type="text"
                placeholder="Search by destination, vendor, or package type..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
            </div>
            <button type="submit" className="search-btn">Search Packages</button>
          </form>

          {/* Quick Stats */}
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
      </section>

      {/* Categories Section */}
      <section className="categories-section">
        <div className="container">
          <h2 className="section-title">Browse by Category</h2>
          <div className="categories-grid">
            {categories.map((category, index) => (
              <Link to={`/packages?category=${category.name}`} key={index} className="category-card">
                <span className="category-icon">{category.icon}</span>
                <h3 className="category-name">{category.name}</h3>
                <p className="category-count">{category.count} packages</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Packages */}
      <section className="featured-section">
        <div className="container">
          <div className="section-header">
            <div>
              <h2 className="section-title">⭐ Featured Packages</h2>
              <p className="section-subtitle">Handpicked premium packages from top vendors</p>
            </div>
            <Link to="/packages?featured=true" className="view-all-btn">
              View All Featured →
            </Link>
          </div>

          {isLoading ? (
            <div className="loading-grid">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="package-card-skeleton">
                  <div className="skeleton-image"></div>
                  <div className="skeleton-content">
                    <div className="skeleton-line"></div>
                    <div className="skeleton-line short"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="packages-grid">
              {featuredPackages.slice(0, 4).map((pkg) => (
                <Link to={`/packages/${pkg.id}`} key={pkg.id} className="package-card">
                  <div className="package-image-wrapper">
                    <img src={pkg.image} alt={pkg.title} className="package-image" />
                    {pkg.featured && <span className="featured-badge">⭐ Featured</span>}
                    <span className="discount-badge">
                      {Math.round(((pkg.price - pkg.discountedPrice) / pkg.price) * 100)}% OFF
                    </span>
                  </div>
                  <div className="package-content">
                    <div className="package-vendor">
                      {pkg.verified && <span className="verified-icon">✓</span>}
                      {pkg.vendor}
                    </div>
                    <h3 className="package-title">{pkg.title}</h3>
                    <div className="package-meta">
                      <span className="meta-item">📅 {pkg.duration}</span>
                      <span className="meta-item">✈️ {pkg.departure}</span>
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
          )}
        </div>
      </section>

      {/* All Packages Section */}
      <section className="all-packages-section">
        <div className="container">
          <div className="section-header">
            <div>
              <h2 className="section-title">All Packages</h2>
              <p className="section-subtitle">Explore packages from different vendors</p>
            </div>
            <Link to="/packages" className="view-all-btn">
              View All Packages →
            </Link>
          </div>

          <div className="packages-grid">
            {allPackages.slice(0, 8).map((pkg) => (
              <Link to={`/packages/${pkg.id}`} key={pkg.id} className="package-card">
                <div className="package-image-wrapper">
                  <img src={pkg.image} alt={pkg.title} className="package-image" />
                  {pkg.featured && <span className="featured-badge">⭐ Featured</span>}
                  {((pkg.price - pkg.discountedPrice) / pkg.price) * 100 > 5 && (
                    <span className="discount-badge">
                      {Math.round(((pkg.price - pkg.discountedPrice) / pkg.price) * 100)}% OFF
                    </span>
                  )}
                </div>
                <div className="package-content">
                  <div className="package-vendor">
                    {pkg.verified && <span className="verified-icon">✓</span>}
                    {pkg.vendor}
                  </div>
                  <h3 className="package-title">{pkg.title}</h3>
                  <div className="package-meta">
                    <span className="meta-item">📅 {pkg.duration}</span>
                    <span className="meta-item">✈️ {pkg.departure}</span>
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

          <div className="load-more-wrapper">
            <Link to="/packages" className="load-more-btn">
              View All 1,000+ Packages →
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="features-section">
        <div className="container">
          <h2 className="section-title">Why Choose UmrahConnect?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">✓</div>
              <h3 className="feature-title">Verified Vendors</h3>
              <p className="feature-description">All vendors are verified and licensed by Ministry of Hajj</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">💰</div>
              <h3 className="feature-title">Best Prices</h3>
              <p className="feature-description">Compare prices from 500+ vendors to get the best deal</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔒</div>
              <h3 className="feature-title">Secure Payments</h3>
              <p className="feature-description">100% secure payment gateway with instant confirmation</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📱</div>
              <h3 className="feature-title">Track Application</h3>
              <p className="feature-description">Real-time visa tracking and application status updates</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">💯</div>
              <h3 className="feature-title">100% Refund</h3>
              <p className="feature-description">Full refund guarantee on visa rejection</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🎧</div>
              <h3 className="feature-title">24/7 Support</h3>
              <p className="feature-description">Round-the-clock customer support in multiple languages</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2 className="cta-title">Ready to Begin Your Sacred Journey?</h2>
            <p className="cta-subtitle">Join 10,000+ pilgrims who trusted UmrahConnect for their journey</p>
            <div className="cta-buttons">
              <Link to="/packages" className="cta-btn cta-btn-primary">
                Browse Packages
              </Link>
              <Link to="/register" className="cta-btn cta-btn-secondary">
                Create Account
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
