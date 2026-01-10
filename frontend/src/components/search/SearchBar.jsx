import React, { useState } from 'react';
import './SearchBar.css';

const SearchBar = ({ onSearch, showFilters = true }) => {
  const [searchData, setSearchData] = useState({
    destination: '',
    type: '',
    duration: '',
    minPrice: '',
    maxPrice: '',
    departureDate: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSearchData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(searchData);
  };

  const handleReset = () => {
    setSearchData({
      destination: '',
      type: '',
      duration: '',
      minPrice: '',
      maxPrice: '',
      departureDate: ''
    });
    onSearch({});
  };

  return (
    <div className="search-bar-container">
      <div className="search-bar-header">
        <h2 className="search-bar-title">
          <span className="title-icon">🔍</span>
          Find Your Perfect Journey
        </h2>
        <p className="search-bar-subtitle">
          Search from thousands of Umrah and Hajj packages
        </p>
      </div>

      <form onSubmit={handleSubmit} className="search-bar-form">
        {/* Main Search Row */}
        <div className="search-row-main">
          {/* Destination */}
          <div className="search-field">
            <label htmlFor="destination" className="search-label">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Destination
            </label>
            <input
              type="text"
              id="destination"
              name="destination"
              value={searchData.destination}
              onChange={handleChange}
              placeholder="Makkah, Madinah..."
              className="search-input"
            />
          </div>

          {/* Package Type */}
          <div className="search-field">
            <label htmlFor="type" className="search-label">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
              Package Type
            </label>
            <select
              id="type"
              name="type"
              value={searchData.type}
              onChange={handleChange}
              className="search-select"
            >
              <option value="">All Types</option>
              <option value="umrah">🕋 Umrah</option>
              <option value="hajj">🕌 Hajj</option>
              <option value="ziyarat">🏛️ Ziyarat</option>
              <option value="combined">✈️ Combined</option>
            </select>
          </div>

          {/* Duration */}
          <div className="search-field">
            <label htmlFor="duration" className="search-label">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Duration
            </label>
            <select
              id="duration"
              name="duration"
              value={searchData.duration}
              onChange={handleChange}
              className="search-select"
            >
              <option value="">Any Duration</option>
              <option value="7">7 Days</option>
              <option value="10">10 Days</option>
              <option value="14">14 Days</option>
              <option value="21">21 Days</option>
              <option value="30">30 Days</option>
            </select>
          </div>

          {/* Search Button */}
          <button type="submit" className="btn btn-search">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            Search
          </button>
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <div className="search-row-filters">
            {/* Price Range */}
            <div className="search-field-group">
              <label className="search-label">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Price Range
              </label>
              <div className="price-inputs">
                <input
                  type="number"
                  name="minPrice"
                  value={searchData.minPrice}
                  onChange={handleChange}
                  placeholder="Min ₹"
                  className="search-input search-input-small"
                />
                <span className="price-separator">-</span>
                <input
                  type="number"
                  name="maxPrice"
                  value={searchData.maxPrice}
                  onChange={handleChange}
                  placeholder="Max ₹"
                  className="search-input search-input-small"
                />
              </div>
            </div>

            {/* Departure Date */}
            <div className="search-field">
              <label htmlFor="departureDate" className="search-label">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Departure Date
              </label>
              <input
                type="date"
                id="departureDate"
                name="departureDate"
                value={searchData.departureDate}
                onChange={handleChange}
                className="search-input"
                min={new Date().toISOString().split('T')[0]}
              />
            </div>

            {/* Reset Button */}
            <button type="button" onClick={handleReset} className="btn btn-reset">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Reset
            </button>
          </div>
        )}
      </form>

      {/* Islamic Decorative Elements */}
      <div className="search-decoration search-decoration-left">✦</div>
      <div className="search-decoration search-decoration-right">✦</div>
    </div>
  );
};

export default SearchBar;
