import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
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

  // Mock data for development
  const mockPackages = [
    {
      id: '1',
      title: 'Economy Umrah Package - 15 Days',
      packageType: 'umrah',
      serviceClass: 'economy',
      duration: 15,
      departureCity: 'Mumbai',
      basePrice: 85000,
      discountedPrice: 75000,
      makkahDays: 8,
      madinahDays: 7,
      hotelDetails: {
        makkah: { name: 'Al Safwah Hotel', stars: 3, distance: '500m from Haram' },
        madinah: { name: 'Dar Al Eiman Hotel', stars: 3, distance: '300m from Masjid' }
      },
      inclusions: ['Visa', 'Flights', 'Hotels', 'Transport', 'Ziyarat'],
      rating: 4.5,
      reviewsCount: 234,
      seatsRemaining: 12,
      featured: true,
      vendor: { name: 'Al Haramain Tours', trustScore: 95 }
    },
    {
      id: '2',
      title: 'Gold Umrah Package - 15 Days',
      packageType: 'umrah',
      serviceClass: 'gold',
      duration: 15,
      departureCity: 'Delhi',
      basePrice: 125000,
      discountedPrice: 110000,
      makkahDays: 8,
      madinahDays: 7,
      hotelDetails: {
        makkah: { name: 'Swissotel Makkah', stars: 5, distance: '100m from Haram' },
        madinah: { name: 'Pullman Zamzam', stars: 5, distance: '50m from Masjid' }
      },
      inclusions: ['Visa', 'Flights', 'Hotels', 'Transport', 'Ziyarat', 'Meals'],
      rating: 4.8,
      reviewsCount: 456,
      seatsRemaining: 8,
      featured: true,
      vendor: { name: 'Makkah Express', trustScore: 98 }
    },
    {
      id: '3',
      title: 'Diamond Umrah Package - 20 Days',
      packageType: 'umrah',
      serviceClass: 'diamond',
      duration: 20,
      departureCity: 'Bangalore',
      basePrice: 185000,
      discountedPrice: 165000,
      makkahDays: 12,
      madinahDays: 8,
      hotelDetails: {
        makkah: { name: 'Fairmont Makkah', stars: 5, distance: 'Connected to Haram' },
        madinah: { name: 'Oberoi Madinah', stars: 5, distance: 'Haram View' }
      },
      inclusions: ['Visa', 'Flights', 'Hotels', 'Transport', 'Ziyarat', 'Meals', 'Guide'],
      rating: 4.9,
      reviewsCount: 789,
      seatsRemaining: 5,
      featured: true,
      vendor: { name: 'Premium Hajj & Umrah', trustScore: 99 }
    },
    {
      id: '4',
      title: 'Budget Umrah Package - 10 Days',
      packageType: 'umrah',
      serviceClass: 'economy',
      duration: 10,
      departureCity: 'Hyderabad',
      basePrice: 65000,
      discountedPrice: 58000,
      makkahDays: 5,
      madinahDays: 5,
      hotelDetails: {
        makkah: { name: 'Al Kiswah Hotel', stars: 3, distance: '800m from Haram' },
        madinah: { name: 'Al Aqeeq Hotel', stars: 3, distance: '500m from Masjid' }
      },
      inclusions: ['Visa', 'Flights', 'Hotels', 'Transport'],
      rating: 4.3,
      reviewsCount: 156,
      seatsRemaining: 20,
      vendor: { name: 'Budget Umrah Services', trustScore: 92 }
    },
  ];

  const packages = data?.data || mockPackages;

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
    });
    setSearchParams({});
  };

  const activeFiltersCount = Object.values(filters).filter(v => v && v !== 'popular').length;

  return (
    <div className="packages-page">
      <div className="container">
        {/* Page Header */}
        <div className="packages-header">
          <div className="packages-header-content">
            <h1 className="packages-title">
              {filters.type ? `${filters.type.charAt(0).toUpperCase() + filters.type.slice(1)} Packages` : 'All Packages'}
            </h1>
            <p className="packages-subtitle">
              Browse {packages.length}+ verified packages from trusted vendors
            </p>
          </div>

          {/* Search Bar */}
          <div className="packages-search">
            <input
              type="text"
              className="search-input"
              placeholder="Search packages..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
            />
            <button className="search-btn">
              <span>🔍</span>
            </button>
          </div>
        </div>

        {/* Filters Bar */}
        <div className="packages-filters-bar">
          <button
            className="filter-toggle-btn"
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
                  <option value="10">10 Days</option>
                  <option value="15">15 Days</option>
                  <option value="20">20 Days</option>
                  <option value="30">30 Days</option>
                  <option value="40">40 Days</option>
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
                <p>Showing {packages.length} packages</p>
              </div>
              <div className="packages-grid">
                {packages.map((pkg, index) => (
                  <PackageCard key={pkg.id} package={pkg} index={index} />
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
