import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import './PackagesPage.css';

const PackagesPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState({
    type: searchParams.get('type') || '',
    serviceClass: searchParams.get('serviceClass') || '',
    departureCity: searchParams.get('departureCity') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    duration: searchParams.get('duration') || '',
    sortBy: searchParams.get('sortBy') || 'popular',
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || '',
    featured: searchParams.get('featured') || '',
  });

  const [showFilters, setShowFilters] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Mock packages data
  const mockPackages = [
    {
      id: 1,
      title: 'Premium Umrah Package - 15 Days',
      vendor: { name: 'Al-Haramain Tours', id: 'vendor-1', verified: true, trustScore: 98 },
      price: 145000,
      discountedPrice: 135000,
      rating: 4.8,
      reviews: 234,
      image: 'https://images.unsplash.com/photo-1591604466107-ec97de577aff?w=800',
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
      inclusions: ['Visa', 'Flights', '5-Star Hotels', 'Transport', 'Ziyarat', 'Meals'],
    },
    {
      id: 2,
      title: 'Economy Umrah Package - 10 Days',
      vendor: { name: 'Makkah Express', id: 'vendor-2', verified: true, trustScore: 95 },
      price: 75000,
      discountedPrice: 68000,
      rating: 4.6,
      reviews: 189,
      image: 'https://images.unsplash.com/photo-1564769625905-50e93615e769?w=800',
      duration: 10,
      departureCity: 'Delhi',
      packageType: 'umrah',
      serviceClass: 'economy',
      verified: true,
      topSeller: true,
      seatsRemaining: 15,
      makkahDays: 5,
      madinahDays: 5,
      inclusions: ['Visa', 'Flights', '3-Star Hotels', 'Transport'],
    },
    {
      id: 3,
      title: 'Luxury Hajj Package 2025 - 30 Days',
      vendor: { name: 'Royal Pilgrimage', id: 'vendor-3', verified: true, trustScore: 99 },
      price: 450000,
      discountedPrice: 425000,
      rating: 4.9,
      reviews: 156,
      image: 'https://images.unsplash.com/photo-1542816417-0983c9c9ad53?w=800',
      duration: 30,
      departureCity: 'Bangalore',
      packageType: 'hajj',
      serviceClass: 'diamond',
      verified: true,
      featured: true,
      topSeller: true,
      seatsRemaining: 5,
      makkahDays: 20,
      madinahDays: 10,
      inclusions: ['Visa', 'Flights', '5-Star Hotels', 'Transport', 'Ziyarat', 'Meals', 'Guide'],
    },
    {
      id: 4,
      title: 'Budget Umrah Package - 7 Days',
      vendor: { name: 'Quick Umrah', id: 'vendor-4', verified: true, trustScore: 92 },
      price: 55000,
      discountedPrice: 52000,
      rating: 4.4,
      reviews: 298,
      image: 'https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?w=800',
      duration: 7,
      departureCity: 'Hyderabad',
      packageType: 'umrah',
      serviceClass: 'economy',
      verified: true,
      seatsRemaining: 20,
      makkahDays: 4,
      madinahDays: 3,
      inclusions: ['Visa', 'Flights', 'Hotels', 'Transport'],
    },
    {
      id: 5,
      title: 'Family Umrah Package - 12 Days',
      vendor: { name: 'Family Tours', id: 'vendor-5', verified: true, trustScore: 96 },
      price: 180000,
      discountedPrice: 165000,
      rating: 4.7,
      reviews: 167,
      image: 'https://images.unsplash.com/photo-1609599006353-e629aaabfeae?w=800',
      duration: 12,
      departureCity: 'Chennai',
      packageType: 'umrah',
      serviceClass: 'gold',
      verified: true,
      featured: true,
      seatsRemaining: 10,
      makkahDays: 7,
      madinahDays: 5,
      inclusions: ['Visa', 'Flights', '4-Star Hotels', 'Transport', 'Ziyarat', 'Family Rooms'],
    },
    {
      id: 6,
      title: 'VIP Umrah Package - 20 Days',
      vendor: { name: 'Elite Pilgrimage', id: 'vendor-6', verified: true, trustScore: 97 },
      price: 285000,
      discountedPrice: 265000,
      rating: 4.9,
      reviews: 89,
      image: 'https://images.unsplash.com/photo-1580418827493-f2b22c0a76cb?w=800',
      duration: 20,
      departureCity: 'Kolkata',
      packageType: 'umrah',
      serviceClass: 'platinum',
      verified: true,
      featured: true,
      topSeller: true,
      seatsRemaining: 6,
      makkahDays: 12,
      madinahDays: 8,
      inclusions: ['Visa', 'Flights', '5-Star Hotels', 'Transport', 'Ziyarat', 'Meals', 'VIP Services'],
    },
    {
      id: 7,
      title: 'Group Umrah Package - 14 Days',
      vendor: { name: 'Community Tours', id: 'vendor-7', verified: true, trustScore: 94 },
      price: 95000,
      discountedPrice: 88000,
      rating: 4.5,
      reviews: 312,
      image: 'https://images.unsplash.com/photo-1591604466107-ec97de577aff?w=800',
      duration: 14,
      departureCity: 'Pune',
      packageType: 'umrah',
      serviceClass: 'economy',
      verified: true,
      seatsRemaining: 25,
      makkahDays: 8,
      madinahDays: 6,
      inclusions: ['Visa', 'Flights', 'Hotels', 'Transport', 'Group Discounts'],
    },
    {
      id: 8,
      title: 'Ramadan Special Package - 21 Days',
      vendor: { name: 'Blessed Journey', id: 'vendor-8', verified: true, trustScore: 98 },
      price: 195000,
      discountedPrice: 185000,
      rating: 4.8,
      reviews: 201,
      image: 'https://images.unsplash.com/photo-1564769625905-50e93615e769?w=800',
      duration: 21,
      departureCity: 'Ahmedabad',
      packageType: 'umrah',
      serviceClass: 'gold',
      verified: true,
      featured: true,
      topSeller: true,
      seatsRemaining: 12,
      makkahDays: 12,
      madinahDays: 9,
      inclusions: ['Visa', 'Flights', '4-Star Hotels', 'Transport', 'Ziyarat', 'Iftar Meals'],
    },
    {
      id: 9,
      title: 'Standard Hajj Package 2025 - 25 Days',
      vendor: { name: 'Hajj Services', id: 'vendor-9', verified: true, trustScore: 93 },
      price: 320000,
      discountedPrice: 305000,
      rating: 4.6,
      reviews: 178,
      image: 'https://images.unsplash.com/photo-1542816417-0983c9c9ad53?w=800',
      duration: 25,
      departureCity: 'Mumbai',
      packageType: 'hajj',
      serviceClass: 'gold',
      verified: true,
      seatsRemaining: 18,
      makkahDays: 15,
      madinahDays: 10,
      inclusions: ['Visa', 'Flights', '4-Star Hotels', 'Transport', 'Ziyarat', 'Meals'],
    },
    {
      id: 10,
      title: 'Express Umrah Package - 5 Days',
      vendor: { name: 'Swift Umrah', id: 'vendor-10', verified: true, trustScore: 91 },
      price: 48000,
      discountedPrice: 45000,
      rating: 4.3,
      reviews: 256,
      image: 'https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?w=800',
      duration: 5,
      departureCity: 'Delhi',
      packageType: 'umrah',
      serviceClass: 'economy',
      verified: true,
      seatsRemaining: 30,
      makkahDays: 3,
      madinahDays: 2,
      inclusions: ['Visa', 'Flights', 'Hotels', 'Transport'],
    },
    {
      id: 11,
      title: 'Deluxe Umrah Package - 18 Days',
      vendor: { name: 'Premium Travels', id: 'vendor-11', verified: true, trustScore: 97 },
      price: 225000,
      discountedPrice: 210000,
      rating: 4.8,
      reviews: 143,
      image: 'https://images.unsplash.com/photo-1580418827493-f2b22c0a76cb?w=800',
      duration: 18,
      departureCity: 'Bangalore',
      packageType: 'umrah',
      serviceClass: 'premium',
      verified: true,
      featured: true,
      seatsRemaining: 9,
      makkahDays: 10,
      madinahDays: 8,
      inclusions: ['Visa', 'Flights', '5-Star Hotels', 'Transport', 'Ziyarat', 'Meals', 'Guide'],
    },
    {
      id: 12,
      title: 'Senior Citizen Umrah Package - 16 Days',
      vendor: { name: 'Care Pilgrimage', id: 'vendor-12', verified: true, trustScore: 96 },
      price: 175000,
      discountedPrice: 165000,
      rating: 4.9,
      reviews: 98,
      image: 'https://images.unsplash.com/photo-1609599006353-e629aaabfeae?w=800',
      duration: 16,
      departureCity: 'Chennai',
      packageType: 'umrah',
      serviceClass: 'gold',
      verified: true,
      featured: true,
      seatsRemaining: 7,
      makkahDays: 9,
      madinahDays: 7,
      inclusions: ['Visa', 'Flights', '4-Star Hotels', 'Transport', 'Wheelchair', 'Medical Support'],
    },
  ];

  // Filter packages
  const filterPackages = (pkgs) => {
    return pkgs.filter(pkg => {
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const matchesSearch = 
          pkg.title.toLowerCase().includes(searchLower) ||
          pkg.vendor.name.toLowerCase().includes(searchLower) ||
          pkg.departureCity.toLowerCase().includes(searchLower);
        if (!matchesSearch) return false;
      }

      if (filters.type && pkg.packageType !== filters.type) return false;
      if (filters.serviceClass && pkg.serviceClass !== filters.serviceClass) return false;
      if (filters.departureCity && pkg.departureCity !== filters.departureCity) return false;
      if (filters.duration && pkg.duration !== parseInt(filters.duration)) return false;
      if (filters.minPrice && pkg.discountedPrice < parseInt(filters.minPrice)) return false;
      if (filters.maxPrice && pkg.discountedPrice > parseInt(filters.maxPrice)) return false;
      if (filters.featured === 'true' && !pkg.featured) return false;

      return true;
    });
  };

  // Sort packages
  const sortPackages = (pkgs) => {
    const sorted = [...pkgs];
    switch (filters.sortBy) {
      case 'price-low':
        return sorted.sort((a, b) => a.discountedPrice - b.discountedPrice);
      case 'price-high':
        return sorted.sort((a, b) => b.discountedPrice - a.discountedPrice);
      case 'rating':
        return sorted.sort((a, b) => b.rating - a.rating);
      case 'duration-short':
        return sorted.sort((a, b) => a.duration - b.duration);
      case 'duration-long':
        return sorted.sort((a, b) => b.duration - a.duration);
      case 'newest':
        return sorted.reverse();
      case 'popular':
      default:
        return sorted.sort((a, b) => b.reviews - a.reviews);
    }
  };

  const filteredPackages = filterPackages(mockPackages);
  const packages = sortPackages(filteredPackages);
  const topSellers = packages.filter(pkg => pkg.topSeller).slice(0, 4);

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    
    const params = new URLSearchParams();
    Object.keys(newFilters).forEach(k => {
      if (newFilters[k]) params.set(k, newFilters[k]);
    });
    setSearchParams(params);
  };

  const clearFilters = () => {
    setFilters({
      type: '',
      serviceClass: '',
      departureCity: '',
      minPrice: '',
      maxPrice: '',
      duration: '',
      sortBy: 'popular',
      search: '',
      category: '',
      featured: '',
    });
    setSearchParams({});
  };

  const activeFiltersCount = Object.values(filters).filter(v => v && v !== 'popular').length;

  return (
    <div className="packages-page">
      {/* Banner Section */}
      <section className="packages-banner">
        <div className="islamic-pattern-bg"></div>
        <div className="banner-content">
          <h1 className="banner-title">
            {filters.type ? `${filters.type.charAt(0).toUpperCase() + filters.type.slice(1)} Packages` : 'Explore All Packages'}
          </h1>
          <p className="banner-subtitle">
            Compare and book from 1,000+ verified packages across 500+ trusted vendors
          </p>
          
          {/* Search Bar */}
          <div className="banner-search">
            <div className="search-input-wrapper">
              <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                className="search-input"
                placeholder="Search by package name, vendor, or destination..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
              />
            </div>
          </div>
        </div>
      </section>

      <div className="packages-container">
        {/* Top Sellers Section */}
        {topSellers.length > 0 && !filters.search && (
          <section className="top-sellers-section">
            <div className="section-header">
              <h2 className="section-title">🔥 Top Selling Packages</h2>
              <p className="section-subtitle">Most popular packages chosen by pilgrims</p>
            </div>
            <div className="top-sellers-grid">
              {topSellers.map((pkg) => (
                <Link to={`/packages/${pkg.id}`} key={pkg.id} className="top-seller-card">
                  <div className="top-seller-image-wrapper">
                    <img src={pkg.image} alt={pkg.title} className="top-seller-image" />
                    <span className="top-seller-badge">🔥 Top Seller</span>
                    {pkg.seatsRemaining <= 10 && (
                      <span className="seats-badge">{pkg.seatsRemaining} seats left</span>
                    )}
                  </div>
                  <div className="top-seller-content">
                    <div className="vendor-info">
                      {pkg.vendor.verified && (
                        <svg className="verified-icon" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      )}
                      <span className="vendor-name">{pkg.vendor.name}</span>
                    </div>
                    <h3 className="top-seller-title">{pkg.title}</h3>
                    <div className="top-seller-meta">
                      <span className="meta-item">⭐ {pkg.rating}</span>
                      <span className="meta-item">📅 {pkg.duration} Days</span>
                      <span className="meta-item">✈️ {pkg.departureCity}</span>
                    </div>
                    <div className="top-seller-price">
                      <span className="price-original">₹{pkg.price.toLocaleString()}</span>
                      <span className="price-current">₹{pkg.discountedPrice.toLocaleString()}</span>
                      <span className="price-discount">
                        {Math.round(((pkg.price - pkg.discountedPrice) / pkg.price) * 100)}% OFF
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Filters Bar */}
        <div className="packages-filters-bar">
          <button
            className={`filter-toggle-btn ${showFilters ? 'active' : ''}`}
            onClick={() => setShowFilters(!showFilters)}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
            </svg>
            <span>Filters</span>
            {activeFiltersCount > 0 && (
              <span className="filter-count">{activeFiltersCount}</span>
            )}
          </button>

          <div className="quick-filters">
            <select
              className="filter-select"
              value={filters.type}
              onChange={(e) => handleFilterChange('type', e.target.value)}
            >
              <option value="">All Types</option>
              <option value="umrah">Umrah</option>
              <option value="hajj">Hajj</option>
            </select>

            <select
              className="filter-select"
              value={filters.serviceClass}
              onChange={(e) => handleFilterChange('serviceClass', e.target.value)}
            >
              <option value="">All Classes</option>
              <option value="economy">Economy</option>
              <option value="gold">Gold</option>
              <option value="premium">Premium</option>
              <option value="diamond">Diamond</option>
              <option value="platinum">Platinum</option>
            </select>

            <select
              className="filter-select"
              value={filters.sortBy}
              onChange={(e) => handleFilterChange('sortBy', e.target.value)}
            >
              <option value="popular">Most Popular</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
              <option value="duration-short">Duration: Short to Long</option>
              <option value="duration-long">Duration: Long to Short</option>
              <option value="newest">Newest First</option>
            </select>
          </div>

          {activeFiltersCount > 0 && (
            <button className="clear-filters-btn" onClick={clearFilters}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
              Clear All
            </button>
          )}
        </div>

        {/* Advanced Filters Panel */}
        {showFilters && (
          <div className="advanced-filters-panel">
            <div className="filters-grid">
              <div className="filter-group">
                <label className="filter-label">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  </svg>
                  Departure City
                </label>
                <select
                  className="filter-select"
                  value={filters.departureCity}
                  onChange={(e) => handleFilterChange('departureCity', e.target.value)}
                >
                  <option value="">All Cities</option>
                  <option value="Mumbai">Mumbai</option>
                  <option value="Delhi">Delhi</option>
                  <option value="Bangalore">Bangalore</option>
                  <option value="Hyderabad">Hyderabad</option>
                  <option value="Kolkata">Kolkata</option>
                  <option value="Chennai">Chennai</option>
                  <option value="Pune">Pune</option>
                  <option value="Ahmedabad">Ahmedabad</option>
                </select>
              </div>

              <div className="filter-group">
                <label className="filter-label">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Duration
                </label>
                <select
                  className="filter-select"
                  value={filters.duration}
                  onChange={(e) => handleFilterChange('duration', e.target.value)}
                >
                  <option value="">Any Duration</option>
                  <option value="5">5 Days</option>
                  <option value="7">7 Days</option>
                  <option value="10">10 Days</option>
                  <option value="12">12 Days</option>
                  <option value="14">14 Days</option>
                  <option value="15">15 Days</option>
                  <option value="18">18 Days</option>
                  <option value="20">20 Days</option>
                  <option value="21">21 Days</option>
                  <option value="25">25 Days</option>
                  <option value="30">30 Days</option>
                </select>
              </div>

              <div className="filter-group">
                <label className="filter-label">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Min Price
                </label>
                <input
                  type="number"
                  className="filter-input"
                  placeholder="Min ₹"
                  value={filters.minPrice}
                  onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                />
              </div>

              <div className="filter-group">
                <label className="filter-label">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Max Price
                </label>
                <input
                  type="number"
                  className="filter-input"
                  placeholder="Max ₹"
                  value={filters.maxPrice}
                  onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                />
              </div>
            </div>
          </div>
        )}

        {/* Results Info */}
        <div className="packages-results-info">
          <p>
            <strong>{packages.length}</strong> packages found
            {filters.search && ` for "${filters.search}"`}
          </p>
        </div>

        {/* Packages Grid */}
        {packages.length > 0 ? (
          <div className="packages-grid">
            {packages.map((pkg) => (
              <Link to={`/packages/${pkg.id}`} key={pkg.id} className="package-card">
                <div className="package-image-wrapper">
                  <img src={pkg.image} alt={pkg.title} className="package-image" />
                  {pkg.featured && <span className="featured-badge">Featured</span>}
                  {pkg.seatsRemaining <= 10 && (
                    <span className="seats-remaining-badge">
                      Only {pkg.seatsRemaining} seats left!
                    </span>
                  )}
                </div>

                <div className="package-content">
                  <div className="package-vendor">
                    {pkg.vendor.verified && (
                      <svg className="verified-icon" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    )}
                    <span>{pkg.vendor.name}</span>
                  </div>

                  <h3 className="package-title">{pkg.title}</h3>

                  <div className="package-rating">
                    <span className="rating-stars">⭐ {pkg.rating}</span>
                    <span className="rating-reviews">({pkg.reviews} reviews)</span>
                  </div>

                  <div className="package-details">
                    <div className="detail-item">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span>{pkg.duration} Days</span>
                    </div>
                    <div className="detail-item">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      </svg>
                      <span>{pkg.departureCity}</span>
                    </div>
                    <div className="detail-item">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                      <span>{pkg.serviceClass}</span>
                    </div>
                  </div>

                  <div className="package-inclusions">
                    {pkg.inclusions.slice(0, 3).map((inc, idx) => (
                      <span key={idx} className="inclusion-tag">{inc}</span>
                    ))}
                    {pkg.inclusions.length > 3 && (
                      <span className="inclusion-tag">+{pkg.inclusions.length - 3} more</span>
                    )}
                  </div>

                  <div className="package-footer">
                    <div className="package-price">
                      <span className="price-original">₹{pkg.price.toLocaleString()}</span>
                      <span className="price-current">₹{pkg.discountedPrice.toLocaleString()}</span>
                    </div>
                    <button className="view-details-btn">
                      View Details
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="no-results">
            <svg className="no-results-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <h3>No packages found</h3>
            <p>Try adjusting your filters or search criteria</p>
            <button className="btn-clear-filters" onClick={clearFilters}>
              Clear All Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PackagesPage;
