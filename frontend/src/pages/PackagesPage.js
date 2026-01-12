import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useQuery } from 'react-query';
import { packagesAPI } from '../services/api';
import PackageCard from '../components/packages/PackageCard';
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

  // Fetch packages with filters
  const { data, isLoading, error } = useQuery(
    ['packages', filters],
    () => packagesAPI.getAll(filters),
    {
      keepPreviousData: true,
    }
  );

  // Extended mock data for development
  const mockPackages = [
    {
      id: 1,
      title: 'Premium Umrah Package - 15 Days',
      vendor: { name: 'Al-Haramain Tours', id: 'vendor-1', verified: true, trustScore: 98 },
      price: 145000,
      discountedPrice: 135000,
      rating: 4.8,
      reviews: 234,
      image: 'https://images.unsplash.com/photo-1591604466107-ec97de577aff?w=400',
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
      image: 'https://images.unsplash.com/photo-1564769625905-50e93615e769?w=400',
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
      title: 'Luxury Hajj Package - 30 Days',
      vendor: { name: 'Royal Pilgrimage', id: 'vendor-3', verified: true, trustScore: 99 },
      price: 450000,
      discountedPrice: 425000,
      rating: 4.9,
      reviews: 156,
      image: 'https://images.unsplash.com/photo-1542816417-0983c9c9ad53?w=400',
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
      image: 'https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?w=400',
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
      image: 'https://images.unsplash.com/photo-1609599006353-e629aaabfeae?w=400',
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
      image: 'https://images.unsplash.com/photo-1580418827493-f2b22c0a76cb?w=400',
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
      image: 'https://images.unsplash.com/photo-1591604466107-ec97de577aff?w=400',
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
      image: 'https://images.unsplash.com/photo-1564769625905-50e93615e769?w=400',
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
  ];

  // Filter packages based on search and filters
  const filterPackages = (pkgs) => {
    return pkgs.filter(pkg => {
      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const matchesSearch = 
          pkg.title.toLowerCase().includes(searchLower) ||
          pkg.vendor.name.toLowerCase().includes(searchLower) ||
          pkg.departureCity.toLowerCase().includes(searchLower);
        if (!matchesSearch) return false;
      }

      // Type filter
      if (filters.type && pkg.packageType !== filters.type) return false;

      // Service class filter
      if (filters.serviceClass && pkg.serviceClass !== filters.serviceClass) return false;

      // Departure city filter
      if (filters.departureCity && pkg.departureCity !== filters.departureCity) return false;

      // Duration filter
      if (filters.duration && pkg.duration !== parseInt(filters.duration)) return false;

      // Price range filter
      if (filters.minPrice && pkg.discountedPrice < parseInt(filters.minPrice)) return false;
      if (filters.maxPrice && pkg.discountedPrice > parseInt(filters.maxPrice)) return false;

      // Category filter (from homepage)
      if (filters.category) {
        const category = filters.category.toLowerCase();
        if (category.includes('economy') && pkg.serviceClass !== 'economy') return false;
        if (category.includes('premium') && pkg.serviceClass !== 'premium') return false;
        if (category.includes('luxury') && !['diamond', 'platinum'].includes(pkg.serviceClass)) return false;
        if (category.includes('family') && !pkg.title.toLowerCase().includes('family')) return false;
        if (category.includes('group') && !pkg.title.toLowerCase().includes('group')) return false;
        if (category.includes('ramadan') && !pkg.title.toLowerCase().includes('ramadan')) return false;
      }

      // Featured filter
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
      case 'newest':
        return sorted.reverse();
      case 'popular':
      default:
        return sorted.sort((a, b) => b.reviews - a.reviews);
    }
  };

  const allPackages = data?.data || mockPackages;
  const filteredPackages = filterPackages(allPackages);
  const packages = sortPackages(filteredPackages);
  const topSellers = packages.filter(pkg => pkg.topSeller).slice(0, 4);

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    
    // Update URL params
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
        <div className="banner-overlay"></div>
        <div className="container banner-content">
          <h1 className="banner-title">
            {filters.category ? filters.category : 
             filters.type ? `${filters.type.charAt(0).toUpperCase() + filters.type.slice(1)} Packages` : 
             'Explore All Packages'}
          </h1>
          <p className="banner-subtitle">
            Compare and book from 1,000+ verified packages across 500+ trusted vendors
          </p>
          
          {/* Search Bar in Banner */}
          <div className="banner-search">
            <div className="search-input-wrapper">
              <span className="search-icon">🔍</span>
              <input
                type="text"
                className="search-input"
                placeholder="Search by package name, vendor, or destination..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
              />
            </div>
            <button className="search-btn">Search</button>
          </div>
        </div>
      </section>

      <div className="container">
        {/* Top Sellers Section */}
        {topSellers.length > 0 && !filters.search && (
          <section className="top-sellers-section">
            <div className="section-header">
              <div>
                <h2 className="section-title">🔥 Top Selling Packages</h2>
                <p className="section-subtitle">Most popular packages chosen by pilgrims</p>
              </div>
            </div>
            <div className="top-sellers-grid">
              {topSellers.map((pkg) => (
                <Link to={`/packages/${pkg.id}`} key={pkg.id} className="top-seller-card">
                  <div className="top-seller-image-wrapper">
                    <img src={pkg.image} alt={pkg.title} className="top-seller-image" />
                    <span className="top-seller-badge">🔥 Top Seller</span>
                  </div>
                  <div className="top-seller-content">
                    <div className="vendor-info">
                      {pkg.vendor.verified && <span className="verified-icon">✓</span>}
                      <span className="vendor-name">{pkg.vendor.name}</span>
                    </div>
                    <h3 className="top-seller-title">{pkg.title}</h3>
                    <div className="top-seller-meta">
                      <span>⭐ {pkg.rating}</span>
                      <span>📅 {pkg.duration} Days</span>
                      <span>✈️ {pkg.departureCity}</span>
                    </div>
                    <div className="top-seller-price">
                      <span className="price-original">₹{pkg.price.toLocaleString()}</span>
                      <span className="price-current">₹{pkg.discountedPrice.toLocaleString()}</span>
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
            <span>🎛️</span>
            Filters
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
              <option value="iran">Iran Tours</option>
              <option value="iraq">Iraq Tours</option>
              <option value="turkey">Turkey Tours</option>
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
              <option value="newest">Newest First</option>
            </select>
          </div>

          {activeFiltersCount > 0 && (
            <button className="clear-filters-btn" onClick={clearFilters}>
              Clear All
            </button>
          )}
        </div>

        {/* Advanced Filters Panel */}
        {showFilters && (
          <div className="advanced-filters-panel">
            <div className="filters-grid">
              {/* Departure City */}
              <div className="filter-group">
                <label className="filter-label">📍 Departure City</label>
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

              {/* Duration */}
              <div className="filter-group">
                <label className="filter-label">⏱️ Duration</label>
                <select
                  className="filter-select"
                  value={filters.duration}
                  onChange={(e) => handleFilterChange('duration', e.target.value)}
                >
                  <option value="">Any Duration</option>
                  <option value="7">7 Days</option>
                  <option value="10">10 Days</option>
                  <option value="12">12 Days</option>
                  <option value="14">14 Days</option>
                  <option value="15">15 Days</option>
                  <option value="20">20 Days</option>
                  <option value="21">21 Days</option>
                  <option value="30">30 Days</option>
                </select>
              </div>

              {/* Price Range */}
              <div className="filter-group">
                <label className="filter-label">💰 Min Price</label>
                <input
                  type="number"
                  className="filter-input"
                  placeholder="Min ₹"
                  value={filters.minPrice}
                  onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                />
              </div>

              <div className="filter-group">
                <label className="filter-label">💰 Max Price</label>
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

        {/* Results */}
        <div className="packages-content">
          {/* Loading State */}
          {isLoading && (
            <div className="packages-loading">
              <div className="spinner spinner-lg"></div>
              <p>Loading packages...</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="alert alert-error">
              Failed to load packages. Please try again later.
            </div>
          )}

          {/* Packages Grid */}
          {!isLoading && !error && packages.length > 0 && (
            <>
              <div className="packages-results-info">
                <p>
                  <strong>{packages.length}</strong> packages found
                  {filters.search && ` for "${filters.search}"`}
                </p>
              </div>
              <div className="packages-grid">
                {packages.map((pkg) => (
                  <PackageCard key={pkg.id} package={pkg} />
                ))}
              </div>
            </>
          )}

          {/* No Results */}
          {!isLoading && !error && packages.length === 0 && (
            <div className="no-results">
              <div className="no-results-icon">🔍</div>
              <h3>No packages found</h3>
              <p>Try adjusting your filters or search criteria</p>
              <button className="btn btn-primary" onClick={clearFilters}>
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PackagesPage;
