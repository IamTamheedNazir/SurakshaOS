import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SearchBar.css';

const SearchBar = () => {
  const navigate = useNavigate();
  const [selectedService, setSelectedService] = useState('umrah');
  const [searchParams, setSearchParams] = useState({
    departureCity: '',
    departureDate: '',
    duration: '',
    travelers: '1'
  });

  const services = [
    { id: 'umrah', label: 'Umrah', icon: '🕌' },
    { id: 'hajj', label: 'Hajj', icon: '🌙' },
    { id: 'iran', label: 'Iran Tours', icon: '🇮🇷' },
    { id: 'iraq', label: 'Iraq Tours', icon: '🇮🇶' },
    { id: 'turkey', label: 'Turkey Tours', icon: '🇹🇷' },
  ];

  const departureCities = [
    'Mumbai, India',
    'Delhi, India',
    'Bangalore, India',
    'Hyderabad, India',
    'Karachi, Pakistan',
    'Lahore, Pakistan',
    'Dhaka, Bangladesh',
    'Jakarta, Indonesia',
  ];

  const durations = [
    '10 Days',
    '15 Days',
    '20 Days',
    '30 Days',
    '40 Days',
    'Flexible',
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    
    const queryParams = new URLSearchParams({
      type: selectedService,
      ...searchParams
    }).toString();

    navigate(`/packages?${queryParams}`);
  };

  const handleInputChange = (field, value) => {
    setSearchParams(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <section className="search-section">
      <div className="container">
        <div className="search-card card">
          {/* Service Tabs */}
          <div className="service-tabs">
            {services.map(service => (
              <button
                key={service.id}
                className={`service-tab ${selectedService === service.id ? 'active' : ''}`}
                onClick={() => setSelectedService(service.id)}
              >
                <span className="service-icon">{service.icon}</span>
                <span className="service-label">{service.label}</span>
              </button>
            ))}
          </div>

          {/* Search Form */}
          <form className="search-form" onSubmit={handleSearch}>
            <div className="search-field">
              <label htmlFor="departureCity" className="form-label">
                📍 Departure City
              </label>
              <select
                id="departureCity"
                className="form-select"
                value={searchParams.departureCity}
                onChange={(e) => handleInputChange('departureCity', e.target.value)}
              >
                <option value="">Select City</option>
                {departureCities.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>

            <div className="search-field">
              <label htmlFor="departureDate" className="form-label">
                📅 Departure Date
              </label>
              <input
                type="date"
                id="departureDate"
                className="form-input"
                value={searchParams.departureDate}
                onChange={(e) => handleInputChange('departureDate', e.target.value)}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>

            <div className="search-field">
              <label htmlFor="duration" className="form-label">
                ⏱️ Duration
              </label>
              <select
                id="duration"
                className="form-select"
                value={searchParams.duration}
                onChange={(e) => handleInputChange('duration', e.target.value)}
              >
                <option value="">Select Duration</option>
                {durations.map(duration => (
                  <option key={duration} value={duration}>{duration}</option>
                ))}
              </select>
            </div>

            <div className="search-field">
              <label htmlFor="travelers" className="form-label">
                👥 Travelers
              </label>
              <select
                id="travelers"
                className="form-select"
                value={searchParams.travelers}
                onChange={(e) => handleInputChange('travelers', e.target.value)}
              >
                <option value="1">1 Person</option>
                <option value="2">2 People</option>
                <option value="3-5">3-5 People</option>
                <option value="6-10">6-10 People</option>
                <option value="10+">10+ People</option>
              </select>
            </div>

            <button type="submit" className="btn btn-primary search-btn">
              <span>🔍</span>
              Search Packages
            </button>
          </form>

          {/* Quick Links */}
          <div className="search-quick-links">
            <span className="quick-links-label">Popular Searches:</span>
            <button 
              className="quick-link"
              onClick={() => {
                setSelectedService('umrah');
                setSearchParams({ ...searchParams, duration: '15 Days' });
              }}
            >
              15 Days Umrah
            </button>
            <button 
              className="quick-link"
              onClick={() => {
                setSelectedService('hajj');
                setSearchParams({ ...searchParams, duration: '40 Days' });
              }}
            >
              Hajj 2024
            </button>
            <button 
              className="quick-link"
              onClick={() => {
                setSelectedService('umrah');
                setSearchParams({ ...searchParams, departureCity: 'Mumbai, India' });
              }}
            >
              Mumbai to Makkah
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SearchBar;
