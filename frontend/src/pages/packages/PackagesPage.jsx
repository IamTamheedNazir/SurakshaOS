import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import PackageCard from '../../components/package/PackageCard';
import SearchBar from '../../components/common/SearchBar';
import './PackagesPage.css';

const PackagesPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    type: searchParams.get('type') || 'all',
    priceRange: searchParams.get('priceRange') || 'all',
    duration: searchParams.get('duration') || 'all',
    sortBy: searchParams.get('sortBy') || 'popular'
  });

  useEffect(() => {
    fetchPackages();
  }, [filters]);

  const fetchPackages = async () => {
    try {
      setLoading(true);
      // TODO: Replace with actual API call
      // const response = await fetch('/api/packages?' + new URLSearchParams(filters));
      // const data = await response.json();
      
      // Mock data
      setTimeout(() => {
        setPackages([]);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error fetching packages:', error);
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    
    // Update URL params
    const params = new URLSearchParams();
    Object.entries(newFilters).forEach(([k, v]) => {
      if (v !== 'all') params.set(k, v);
    });
    setSearchParams(params);
  };

  const handleSearch = (searchData) => {
    console.log('Search data:', searchData);
    // TODO: Implement search functionality
  };

  return (
    <div className="packages-page">
      {/* Hero Section */}
      <div className="packages-hero">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1 className="hero-title">
            <span className="title-icon">🕋</span>
            Explore Umrah & Hajj Packages
          </h1>
          <p className="hero-subtitle">
            Find the perfect package for your sacred journey
          </p>
          <div className="hero-stats">
            <div className="stat-item">
              <span className="stat-value">500+</span>
              <span className="stat-label">Packages</span>
            </div>
            <div className="stat-divider">✦</div>
            <div className="stat-item">
              <span className="stat-value">85+</span>
              <span className="stat-label">Vendors</span>
            </div>
            <div className="stat-divider">✦</div>
            <div className="stat-item">
              <span className="stat-value">10K+</span>
              <span className="stat-label">Happy Pilgrims</span>
            </div>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="packages-search">
        <SearchBar onSearch={handleSearch} />
      </div>

      {/* Filters Section */}
      <div className="packages-container">
        <div className="filters-section">
          <div className="filters-header">
            <h2 className="filters-title">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              Filters
            </h2>
            <button 
              className="btn-text"
              onClick={() => setFilters({
                type: 'all',
                priceRange: 'all',
                duration: 'all',
                sortBy: 'popular'
              })}
            >
              Clear All
            </button>
          </div>

          {/* Package Type Filter */}
          <div className="filter-group">
            <h3 className="filter-label">Package Type</h3>
            <div className="filter-options">
              <label className={`filter-option ${filters.type === 'all' ? 'active' : ''}`}>
                <input
                  type="radio"
                  name="type"
                  value="all"
                  checked={filters.type === 'all'}
                  onChange={(e) => handleFilterChange('type', e.target.value)}
                />
                <span>All Packages</span>
              </label>
              <label className={`filter-option ${filters.type === 'umrah' ? 'active' : ''}`}>
                <input
                  type="radio"
                  name="type"
                  value="umrah"
                  checked={filters.type === 'umrah'}
                  onChange={(e) => handleFilterChange('type', e.target.value)}
                />
                <span>🕌 Umrah</span>
              </label>
              <label className={`filter-option ${filters.type === 'hajj' ? 'active' : ''}`}>
                <input
                  type="radio"
                  name="type"
                  value="hajj"
                  checked={filters.type === 'hajj'}
                  onChange={(e) => handleFilterChange('type', e.target.value)}
                />
                <span>🕋 Hajj</span>
              </label>
            </div>
          </div>

          {/* Price Range Filter */}
          <div className="filter-group">
            <h3 className="filter-label">Price Range</h3>
            <div className="filter-options">
              <label className={`filter-option ${filters.priceRange === 'all' ? 'active' : ''}`}>
                <input
                  type="radio"
                  name="priceRange"
                  value="all"
                  checked={filters.priceRange === 'all'}
                  onChange={(e) => handleFilterChange('priceRange', e.target.value)}
                />
                <span>All Prices</span>
              </label>
              <label className={`filter-option ${filters.priceRange === 'budget' ? 'active' : ''}`}>
                <input
                  type="radio"
                  name="priceRange"
                  value="budget"
                  checked={filters.priceRange === 'budget'}
                  onChange={(e) => handleFilterChange('priceRange', e.target.value)}
                />
                <span>Under ₹50,000</span>
              </label>
              <label className={`filter-option ${filters.priceRange === 'mid' ? 'active' : ''}`}>
                <input
                  type="radio"
                  name="priceRange"
                  value="mid"
                  checked={filters.priceRange === 'mid'}
                  onChange={(e) => handleFilterChange('priceRange', e.target.value)}
                />
                <span>₹50,000 - ₹1,00,000</span>
              </label>
              <label className={`filter-option ${filters.priceRange === 'premium' ? 'active' : ''}`}>
                <input
                  type="radio"
                  name="priceRange"
                  value="premium"
                  checked={filters.priceRange === 'premium'}
                  onChange={(e) => handleFilterChange('priceRange', e.target.value)}
                />
                <span>Above ₹1,00,000</span>
              </label>
            </div>
          </div>

          {/* Duration Filter */}
          <div className="filter-group">
            <h3 className="filter-label">Duration</h3>
            <div className="filter-options">
              <label className={`filter-option ${filters.duration === 'all' ? 'active' : ''}`}>
                <input
                  type="radio"
                  name="duration"
                  value="all"
                  checked={filters.duration === 'all'}
                  onChange={(e) => handleFilterChange('duration', e.target.value)}
                />
                <span>Any Duration</span>
              </label>
              <label className={`filter-option ${filters.duration === 'short' ? 'active' : ''}`}>
                <input
                  type="radio"
                  name="duration"
                  value="short"
                  checked={filters.duration === 'short'}
                  onChange={(e) => handleFilterChange('duration', e.target.value)}
                />
                <span>7-10 Days</span>
              </label>
              <label className={`filter-option ${filters.duration === 'medium' ? 'active' : ''}`}>
                <input
                  type="radio"
                  name="duration"
                  value="medium"
                  checked={filters.duration === 'medium'}
                  onChange={(e) => handleFilterChange('duration', e.target.value)}
                />
                <span>11-15 Days</span>
              </label>
              <label className={`filter-option ${filters.duration === 'long' ? 'active' : ''}`}>
                <input
                  type="radio"
                  name="duration"
                  value="long"
                  checked={filters.duration === 'long'}
                  onChange={(e) => handleFilterChange('duration', e.target.value)}
                />
                <span>15+ Days</span>
              </label>
            </div>
          </div>
        </div>

        {/* Packages Grid */}
        <div className="packages-content">
          {/* Sort Bar */}
          <div className="sort-bar">
            <div className="results-count">
              {loading ? (
                <span>Loading packages...</span>
              ) : (
                <span>
                  <strong>{packages.length}</strong> packages found
                </span>
              )}
            </div>
            <div className="sort-options">
              <label htmlFor="sortBy">Sort by:</label>
              <select
                id="sortBy"
                value={filters.sortBy}
                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                className="sort-select"
              >
                <option value="popular">Most Popular</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
                <option value="duration">Duration</option>
                <option value="newest">Newest First</option>
              </select>
            </div>
          </div>

          {/* Packages Grid */}
          {loading ? (
            <div className="packages-grid">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="package-skeleton"></div>
              ))}
            </div>
          ) : packages.length > 0 ? (
            <div className="packages-grid">
              {packages.map((pkg) => (
                <PackageCard key={pkg.id} package={pkg} />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-icon">🔍</div>
              <h3 className="empty-title">No Packages Found</h3>
              <p className="empty-description">
                Try adjusting your filters or search criteria
              </p>
              <button 
                className="btn btn-primary"
                onClick={() => setFilters({
                  type: 'all',
                  priceRange: 'all',
                  duration: 'all',
                  sortBy: 'popular'
                })}
              >
                Clear Filters
              </button>
            </div>
          )}

          {/* Pagination */}
          {!loading && packages.length > 0 && (
            <div className="pagination">
              <button className="btn btn-secondary" disabled>
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Previous
              </button>
              <div className="pagination-pages">
                <button className="pagination-page active">1</button>
                <button className="pagination-page">2</button>
                <button className="pagination-page">3</button>
                <span className="pagination-dots">...</span>
                <button className="pagination-page">10</button>
              </div>
              <button className="btn btn-secondary">
                Next
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PackagesPage;
