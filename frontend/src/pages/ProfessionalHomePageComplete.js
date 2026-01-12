import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Search, 
  Users, 
  Building2, 
  Package, 
  Star,
  MapPin,
  Calendar,
  Clock,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Check,
  Heart,
  Shield,
  Award,
} from 'lucide-react';
import './ProfessionalHomePage.css';
import './ProfessionalHomePagePart2.css';
import './PackageSections.css';

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

  // Umrah Packages
  const umrahPackages = [
    {
      id: 1,
      title: 'Economy Umrah Package',
      vendor: 'Al-Haramain Tours',
      rating: 4.8,
      reviews: 234,
      price: 89999,
      duration: '7 Days',
      hotel: '3 Star',
      distance: '500m from Haram',
      features: ['Visa Included', 'Breakfast', 'Transport', 'Guide'],
      badge: 'Best Value',
      image: '🕋',
    },
    {
      id: 2,
      title: 'Premium Umrah Package',
      vendor: 'Makkah Travels',
      rating: 4.9,
      reviews: 456,
      price: 149999,
      duration: '10 Days',
      hotel: '5 Star',
      distance: '100m from Haram',
      features: ['Visa Included', 'All Meals', 'VIP Transport', 'Private Guide'],
      badge: 'Most Popular',
      image: '⭐',
    },
    {
      id: 3,
      title: 'Luxury Umrah Experience',
      vendor: 'Royal Pilgrimage',
      rating: 5.0,
      reviews: 189,
      price: 249999,
      duration: '14 Days',
      hotel: '5 Star Deluxe',
      distance: 'Haram View',
      features: ['Visa Included', 'All Meals', 'Luxury Transport', 'Personal Butler'],
      badge: 'Premium',
      image: '✨',
    },
    {
      id: 4,
      title: 'Family Umrah Package',
      vendor: 'Family Tours',
      rating: 4.7,
      reviews: 312,
      price: 119999,
      duration: '10 Days',
      hotel: '4 Star',
      distance: '300m from Haram',
      features: ['Visa Included', 'Family Rooms', 'Kids Activities', 'Guide'],
      badge: 'Family Friendly',
      image: '👨‍👩‍👧‍👦',
    },
  ];

  // Hajj Packages
  const hajjPackages = [
    {
      id: 1,
      title: 'Standard Hajj Package 2025',
      vendor: 'Hajj Services Ltd',
      rating: 4.8,
      reviews: 567,
      price: 449999,
      duration: '21 Days',
      hotel: '4 Star',
      features: ['Full Hajj Rituals', 'Experienced Guide', 'All Meals', 'Transport'],
      badge: 'Early Bird',
      image: '🕋',
    },
    {
      id: 2,
      title: 'VIP Hajj Package 2025',
      vendor: 'Premium Hajj Tours',
      rating: 4.9,
      reviews: 234,
      price: 749999,
      duration: '25 Days',
      hotel: '5 Star',
      features: ['VIP Services', 'Private Guide', 'Luxury Accommodation', 'All Inclusive'],
      badge: 'VIP',
      image: '👑',
    },
    {
      id: 3,
      title: 'Group Hajj Package 2025',
      vendor: 'Community Hajj',
      rating: 4.7,
      reviews: 890,
      price: 399999,
      duration: '20 Days',
      hotel: '3 Star',
      features: ['Group Discount', 'Shared Rooms', 'Basic Meals', 'Group Guide'],
      badge: 'Best Price',
      image: '👥',
    },
  ];

  // Top Vendors
  const topVendors = [
    {
      id: 1,
      name: 'Al-Haramain Tours',
      category: 'Umrah & Hajj',
      rating: 4.9,
      reviews: 1234,
      packages: 45,
      verified: true,
      badge: 'Top Rated',
      logo: '🕋',
    },
    {
      id: 2,
      name: 'Makkah Travels',
      category: 'Premium Services',
      rating: 4.8,
      reviews: 890,
      packages: 32,
      verified: true,
      badge: 'Verified',
      logo: '⭐',
    },
    {
      id: 3,
      name: 'Royal Pilgrimage',
      category: 'Luxury Packages',
      rating: 5.0,
      reviews: 456,
      packages: 28,
      verified: true,
      badge: 'Premium',
      logo: '👑',
    },
    {
      id: 4,
      name: 'Family Tours',
      category: 'Family Packages',
      rating: 4.7,
      reviews: 678,
      packages: 38,
      verified: true,
      badge: 'Family Friendly',
      logo: '👨‍👩‍👧‍👦',
    },
  ];

  return (
    <div className="professional-homepage">
      {/* Hero Section - (keeping existing code) */}
      <section className="hero-section">
        {/* ... existing hero code ... */}
      </section>

      {/* Banner Slider Section - (keeping existing code) */}
      <section className="banner-slider-section">
        {/* ... existing banner code ... */}
      </section>

      {/* Services Section - (keeping existing code) */}
      <section className="services-section">
        {/* ... existing services code ... */}
      </section>

      {/* Umrah Packages Section */}
      <section id="umrah" className="packages-section">
        <div className="container">
          <div className="section-header">
            <span className="section-badge">⭐ Featured Packages</span>
            <h2 className="section-title">Popular Umrah Packages</h2>
            <p className="section-subtitle">Handpicked packages from verified vendors with best prices</p>
          </div>

          <div className="packages-scroll">
            {umrahPackages.map((pkg) => (
              <div key={pkg.id} className="package-card">
                {pkg.badge && <div className="package-badge">{pkg.badge}</div>}
                
                <div className="package-image">
                  <div className="package-emoji">{pkg.image}</div>
                  <button className="package-wishlist">
                    <Heart size={20} />
                  </button>
                </div>

                <div className="package-content">
                  <div className="package-vendor">
                    <Shield size={14} />
                    <span>{pkg.vendor}</span>
                  </div>

                  <h3 className="package-title">{pkg.title}</h3>

                  <div className="package-rating">
                    <Star size={16} fill="#d4af37" color="#d4af37" />
                    <span className="rating-value">{pkg.rating}</span>
                    <span className="rating-reviews">({pkg.reviews} reviews)</span>
                  </div>

                  <div className="package-details">
                    <div className="detail-item">
                      <Clock size={16} />
                      <span>{pkg.duration}</span>
                    </div>
                    <div className="detail-item">
                      <Building2 size={16} />
                      <span>{pkg.hotel}</span>
                    </div>
                    <div className="detail-item">
                      <MapPin size={16} />
                      <span>{pkg.distance}</span>
                    </div>
                  </div>

                  <div className="package-features">
                    {pkg.features.map((feature, index) => (
                      <div key={index} className="feature-item">
                        <Check size={14} />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>

                  <div className="package-footer">
                    <div className="package-price">
                      <span className="price-label">Starting from</span>
                      <span className="price-value">₹{pkg.price.toLocaleString()}</span>
                      <span className="price-per">per person</span>
                    </div>
                    <button className="package-btn">
                      View Details
                      <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="section-footer">
            <button className="btn-view-all">
              View All Umrah Packages
              <ArrowRight size={20} />
            </button>
          </div>
        </div>
      </section>

      {/* Hajj Packages Section */}
      <section id="hajj" className="packages-section packages-section-alt">
        <div className="container">
          <div className="section-header">
            <span className="section-badge">🕋 Hajj 2025</span>
            <h2 className="section-title">Hajj Packages 2025</h2>
            <p className="section-subtitle">Book early and secure your spot for Hajj 2025</p>
          </div>

          <div className="packages-scroll">
            {hajjPackages.map((pkg) => (
              <div key={pkg.id} className="package-card">
                {pkg.badge && <div className="package-badge package-badge-gold">{pkg.badge}</div>}
                
                <div className="package-image">
                  <div className="package-emoji">{pkg.image}</div>
                  <button className="package-wishlist">
                    <Heart size={20} />
                  </button>
                </div>

                <div className="package-content">
                  <div className="package-vendor">
                    <Shield size={14} />
                    <span>{pkg.vendor}</span>
                  </div>

                  <h3 className="package-title">{pkg.title}</h3>

                  <div className="package-rating">
                    <Star size={16} fill="#d4af37" color="#d4af37" />
                    <span className="rating-value">{pkg.rating}</span>
                    <span className="rating-reviews">({pkg.reviews} reviews)</span>
                  </div>

                  <div className="package-details">
                    <div className="detail-item">
                      <Clock size={16} />
                      <span>{pkg.duration}</span>
                    </div>
                    <div className="detail-item">
                      <Building2 size={16} />
                      <span>{pkg.hotel}</span>
                    </div>
                    <div className="detail-item">
                      <Calendar size={16} />
                      <span>June 2025</span>
                    </div>
                  </div>

                  <div className="package-features">
                    {pkg.features.map((feature, index) => (
                      <div key={index} className="feature-item">
                        <Check size={14} />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>

                  <div className="package-footer">
                    <div className="package-price">
                      <span className="price-label">Starting from</span>
                      <span className="price-value">₹{pkg.price.toLocaleString()}</span>
                      <span className="price-per">per person</span>
                    </div>
                    <button className="package-btn">
                      Register Interest
                      <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="section-footer">
            <button className="btn-view-all">
              View All Hajj Packages
              <ArrowRight size={20} />
            </button>
          </div>
        </div>
      </section>

      {/* Top Vendors Section */}
      <section className="vendors-section">
        <div className="container">
          <div className="section-header">
            <span className="section-badge">🏆 Trusted Partners</span>
            <h2 className="section-title">Top Rated Vendors</h2>
            <p className="section-subtitle">Verified and trusted by thousands of pilgrims</p>
          </div>

          <div className="vendors-grid">
            {topVendors.map((vendor) => (
              <div key={vendor.id} className="vendor-card">
                <div className="vendor-header">
                  <div className="vendor-logo">{vendor.logo}</div>
                  {vendor.verified && (
                    <div className="vendor-verified">
                      <Shield size={14} />
                      <span>Verified</span>
                    </div>
                  )}
                </div>

                <h3 className="vendor-name">{vendor.name}</h3>
                <p className="vendor-category">{vendor.category}</p>

                <div className="vendor-stats">
                  <div className="vendor-stat">
                    <Star size={16} fill="#d4af37" color="#d4af37" />
                    <span>{vendor.rating}</span>
                  </div>
                  <div className="vendor-stat">
                    <Users size={16} />
                    <span>{vendor.reviews} reviews</span>
                  </div>
                  <div className="vendor-stat">
                    <Package size={16} />
                    <span>{vendor.packages} packages</span>
                  </div>
                </div>

                <button className="vendor-btn">
                  View Packages
                  <ArrowRight size={16} />
                </button>
              </div>
            ))}
          </div>

          <div className="section-footer">
            <button className="btn-view-all">
              View All Vendors
              <ArrowRight size={20} />
            </button>
          </div>
        </div>
      </section>

      {/* Vendor CTA Section */}
      <section className="vendor-cta-section">
        <div className="container">
          <div className="vendor-cta-card">
            <div className="vendor-cta-content">
              <div className="vendor-cta-badge">
                <Award size={20} />
                <span>For Vendors</span>
              </div>
              <h2 className="vendor-cta-title">
                Join India's Largest Umrah & Hajj Marketplace
              </h2>
              <p className="vendor-cta-text">
                Reach 50,000+ verified pilgrims. List your packages, manage bookings, and grow your business with UmrahConnect.
              </p>
              <div className="vendor-cta-features">
                <div className="cta-feature">
                  <Check size={20} />
                  <span>Zero Commission for First 3 Months</span>
                </div>
                <div className="cta-feature">
                  <Check size={20} />
                  <span>Dedicated Vendor Dashboard</span>
                </div>
                <div className="cta-feature">
                  <Check size={20} />
                  <span>24/7 Support & Training</span>
                </div>
              </div>
              <div className="vendor-cta-actions">
                <button className="btn-primary-cta">
                  Register as Vendor
                  <ArrowRight size={20} />
                </button>
                <button className="btn-secondary-cta">
                  Learn More
                </button>
              </div>
            </div>
            <div className="vendor-cta-image">
              <div className="cta-emoji">🤝</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProfessionalHomePage;
