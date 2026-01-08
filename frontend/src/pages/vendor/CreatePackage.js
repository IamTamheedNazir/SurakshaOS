import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from 'react-query';
import { vendorAPI } from '../../services/api';
import { toast } from 'react-toastify';
import './CreatePackage.css';

const CreatePackage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [currentTab, setCurrentTab] = useState('basic');
  const [packageData, setPackageData] = useState({
    // Basic Info
    name: '',
    category: 'Umrah',
    type: 'Gold',
    duration: 15,
    makkahDays: 8,
    madinahDays: 7,
    departureCity: '',
    description: '',
    highlights: [''],
    
    // Pricing
    basePrice: '',
    discountedPrice: '',
    childPrice: '',
    infantPrice: '',
    singleRoomSupplement: '',
    
    // Accommodation
    makkahHotel: {
      name: '',
      rating: 5,
      distanceFromHaram: '',
      roomType: 'Quad',
    },
    madinahHotel: {
      name: '',
      rating: 5,
      distanceFromHaram: '',
      roomType: 'Quad',
    },
    
    // Inclusions & Exclusions
    inclusions: [],
    exclusions: [],
    
    // Itinerary
    itinerary: [],
    
    // Images
    images: [],
    coverImage: '',
    
    // Terms & Conditions
    terms: '',
    cancellationPolicy: '',
    
    // Status
    status: 'draft',
  });

  const inclusionOptions = [
    'Round-trip Airfare',
    'Hotel Accommodation',
    'Daily Breakfast',
    'Daily Dinner',
    'All Transfers',
    'Ziyarat Tours',
    'Visa Processing',
    'Travel Insurance',
    '24/7 Support',
    'Group Leader',
  ];

  const exclusionOptions = [
    'Lunch',
    'Personal Expenses',
    'Shopping',
    'Tips & Gratuities',
    'Excess Baggage',
    'International Calls',
    'Laundry Services',
    'Room Service',
  ];

  const handleInputChange = (field, value) => {
    setPackageData(prev => ({ ...prev, [field]: value }));
  };

  const handleNestedChange = (parent, field, value) => {
    setPackageData(prev => ({
      ...prev,
      [parent]: { ...prev[parent], [field]: value }
    }));
  };

  const handleArrayChange = (field, index, value) => {
    const newArray = [...packageData[field]];
    newArray[index] = value;
    setPackageData(prev => ({ ...prev, [field]: newArray }));
  };

  const handleAddArrayItem = (field, defaultValue = '') => {
    setPackageData(prev => ({
      ...prev,
      [field]: [...prev[field], defaultValue]
    }));
  };

  const handleRemoveArrayItem = (field, index) => {
    const newArray = packageData[field].filter((_, i) => i !== index);
    setPackageData(prev => ({ ...prev, [field]: newArray }));
  };

  const handleToggleInclusion = (item) => {
    const inclusions = packageData.inclusions.includes(item)
      ? packageData.inclusions.filter(i => i !== item)
      : [...packageData.inclusions, item];
    setPackageData(prev => ({ ...prev, inclusions }));
  };

  const handleToggleExclusion = (item) => {
    const exclusions = packageData.exclusions.includes(item)
      ? packageData.exclusions.filter(i => i !== item)
      : [...packageData.exclusions, item];
    setPackageData(prev => ({ ...prev, exclusions }));
  };

  const handleSubmit = async (status) => {
    try {
      const dataToSubmit = { ...packageData, status };
      // await vendorAPI.createPackage(dataToSubmit);
      toast.success(`Package ${status === 'active' ? 'published' : 'saved as draft'} successfully!`);
      navigate('/vendor/packages');
    } catch (error) {
      toast.error('Failed to save package');
    }
  };

  const tabs = [
    { id: 'basic', label: 'Basic Info', icon: '📝' },
    { id: 'pricing', label: 'Pricing', icon: '💰' },
    { id: 'accommodation', label: 'Accommodation', icon: '🏨' },
    { id: 'inclusions', label: 'Inclusions', icon: '✅' },
    { id: 'itinerary', label: 'Itinerary', icon: '📋' },
    { id: 'images', label: 'Images', icon: '📷' },
    { id: 'terms', label: 'Terms', icon: '📄' },
  ];

  return (
    <div className="create-package-page">
      <div className="container-fluid">
        {/* Header */}
        <div className="page-header">
          <div>
            <h1 className="page-title">
              {isEditMode ? '✏️ Edit Package' : '➕ Create New Package'}
            </h1>
            <div className="breadcrumb">
              <a href="/vendor/dashboard">Dashboard</a>
              <span>›</span>
              <a href="/vendor/packages">Packages</a>
              <span>›</span>
              <span>{isEditMode ? 'Edit' : 'Create'}</span>
            </div>
          </div>
          <div className="header-actions">
            <button className="btn btn-secondary" onClick={() => navigate('/vendor/packages')}>
              ← Back
            </button>
            <button className="btn btn-outline" onClick={() => handleSubmit('draft')}>
              💾 Save as Draft
            </button>
            <button className="btn btn-success" onClick={() => handleSubmit('active')}>
              ✓ Publish Package
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="package-tabs">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`tab-btn ${currentTab === tab.id ? 'active' : ''}`}
              onClick={() => setCurrentTab(tab.id)}
            >
              <span className="tab-icon">{tab.icon}</span>
              <span className="tab-label">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="package-form-content">
          {/* Basic Info Tab */}
          {currentTab === 'basic' && (
            <div className="form-section">
              <h2 className="section-title">📝 Basic Information</h2>
              
              <div className="form-grid">
                <div className="form-group form-group-full">
                  <label className="form-label form-label-required">Package Name*</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g., 15 Days Premium Umrah Package"
                    value={packageData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label form-label-required">Category*</label>
                  <select
                    className="form-input"
                    value={packageData.category}
                    onChange={(e) => handleInputChange('category', e.target.value)}
                  >
                    <option value="Umrah">Umrah</option>
                    <option value="Hajj">Hajj</option>
                    <option value="Ziyarat">Ziyarat</option>
                    <option value="Ramzan">Ramzan Special</option>
                    <option value="Holidays">Holidays</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label form-label-required">Package Type*</label>
                  <select
                    className="form-input"
                    value={packageData.type}
                    onChange={(e) => handleInputChange('type', e.target.value)}
                  >
                    <option value="Bronze">Bronze</option>
                    <option value="Silver">Silver</option>
                    <option value="Gold">Gold</option>
                    <option value="Platinum">Platinum</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label form-label-required">Total Duration (Days)*</label>
                  <input
                    type="number"
                    className="form-input"
                    placeholder="15"
                    value={packageData.duration}
                    onChange={(e) => handleInputChange('duration', parseInt(e.target.value))}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label form-label-required">Days in Makkah*</label>
                  <input
                    type="number"
                    className="form-input"
                    placeholder="8"
                    value={packageData.makkahDays}
                    onChange={(e) => handleInputChange('makkahDays', parseInt(e.target.value))}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label form-label-required">Days in Madinah*</label>
                  <input
                    type="number"
                    className="form-input"
                    placeholder="7"
                    value={packageData.madinahDays}
                    onChange={(e) => handleInputChange('madinahDays', parseInt(e.target.value))}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label form-label-required">Departure City*</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g., Mumbai, Delhi, Bangalore"
                    value={packageData.departureCity}
                    onChange={(e) => handleInputChange('departureCity', e.target.value)}
                  />
                </div>

                <div className="form-group form-group-full">
                  <label className="form-label form-label-required">Package Description*</label>
                  <textarea
                    className="form-textarea"
                    rows="6"
                    placeholder="Describe your package in detail..."
                    value={packageData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                  />
                </div>

                <div className="form-group form-group-full">
                  <label className="form-label">Package Highlights</label>
                  {packageData.highlights.map((highlight, index) => (
                    <div key={index} className="array-input-group">
                      <input
                        type="text"
                        className="form-input"
                        placeholder="e.g., 5-star hotel near Haram"
                        value={highlight}
                        onChange={(e) => handleArrayChange('highlights', index, e.target.value)}
                      />
                      <button
                        className="btn btn-sm btn-error"
                        onClick={() => handleRemoveArrayItem('highlights', index)}
                      >
                        🗑️
                      </button>
                    </div>
                  ))}
                  <button
                    className="btn btn-sm btn-primary"
                    onClick={() => handleAddArrayItem('highlights', '')}
                  >
                    ➕ Add Highlight
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Pricing Tab */}
          {currentTab === 'pricing' && (
            <div className="form-section">
              <h2 className="section-title">💰 Pricing Details</h2>
              
              <div className="pricing-grid">
                <div className="pricing-card pricing-card-primary">
                  <div className="pricing-icon">👤</div>
                  <h3>Adult Price</h3>
                  <div className="form-group">
                    <label className="form-label">Base Price (₹)*</label>
                    <input
                      type="number"
                      className="form-input"
                      placeholder="110000"
                      value={packageData.basePrice}
                      onChange={(e) => handleInputChange('basePrice', e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Discounted Price (₹)</label>
                    <input
                      type="number"
                      className="form-input"
                      placeholder="105000"
                      value={packageData.discountedPrice}
                      onChange={(e) => handleInputChange('discountedPrice', e.target.value)}
                    />
                  </div>
                </div>

                <div className="pricing-card pricing-card-secondary">
                  <div className="pricing-icon">👶</div>
                  <h3>Child Price</h3>
                  <div className="form-group">
                    <label className="form-label">Child Price (₹)</label>
                    <input
                      type="number"
                      className="form-input"
                      placeholder="85000"
                      value={packageData.childPrice}
                      onChange={(e) => handleInputChange('childPrice', e.target.value)}
                    />
                  </div>
                  <p className="pricing-note">For children aged 2-12 years</p>
                </div>

                <div className="pricing-card pricing-card-tertiary">
                  <div className="pricing-icon">🍼</div>
                  <h3>Infant Price</h3>
                  <div className="form-group">
                    <label className="form-label">Infant Price (₹)</label>
                    <input
                      type="number"
                      className="form-input"
                      placeholder="25000"
                      value={packageData.infantPrice}
                      onChange={(e) => handleInputChange('infantPrice', e.target.value)}
                    />
                  </div>
                  <p className="pricing-note">For infants below 2 years</p>
                </div>

                <div className="pricing-card pricing-card-accent">
                  <div className="pricing-icon">🛏️</div>
                  <h3>Single Room</h3>
                  <div className="form-group">
                    <label className="form-label">Single Room Supplement (₹)</label>
                    <input
                      type="number"
                      className="form-input"
                      placeholder="35000"
                      value={packageData.singleRoomSupplement}
                      onChange={(e) => handleInputChange('singleRoomSupplement', e.target.value)}
                    />
                  </div>
                  <p className="pricing-note">Additional charge for single occupancy</p>
                </div>
              </div>
            </div>
          )}

          {/* Accommodation Tab */}
          {currentTab === 'accommodation' && (
            <div className="form-section">
              <h2 className="section-title">🏨 Accommodation Details</h2>
              
              <div className="accommodation-grid">
                <div className="hotel-card">
                  <div className="hotel-header">
                    <h3>🕋 Makkah Hotel</h3>
                  </div>
                  <div className="form-grid">
                    <div className="form-group form-group-full">
                      <label className="form-label form-label-required">Hotel Name*</label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="e.g., Swissotel Makkah"
                        value={packageData.makkahHotel.name}
                        onChange={(e) => handleNestedChange('makkahHotel', 'name', e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Star Rating*</label>
                      <select
                        className="form-input"
                        value={packageData.makkahHotel.rating}
                        onChange={(e) => handleNestedChange('makkahHotel', 'rating', parseInt(e.target.value))}
                      >
                        <option value="3">3 Star</option>
                        <option value="4">4 Star</option>
                        <option value="5">5 Star</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Distance from Haram*</label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="e.g., 200 meters"
                        value={packageData.makkahHotel.distanceFromHaram}
                        onChange={(e) => handleNestedChange('makkahHotel', 'distanceFromHaram', e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Room Type*</label>
                      <select
                        className="form-input"
                        value={packageData.makkahHotel.roomType}
                        onChange={(e) => handleNestedChange('makkahHotel', 'roomType', e.target.value)}
                      >
                        <option value="Quint">Quint (5 sharing)</option>
                        <option value="Quad">Quad (4 sharing)</option>
                        <option value="Triple">Triple (3 sharing)</option>
                        <option value="Double">Double (2 sharing)</option>
                        <option value="Single">Single</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="hotel-card">
                  <div className="hotel-header">
                    <h3>🕌 Madinah Hotel</h3>
                  </div>
                  <div className="form-grid">
                    <div className="form-group form-group-full">
                      <label className="form-label form-label-required">Hotel Name*</label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="e.g., Pullman Zamzam Madinah"
                        value={packageData.madinahHotel.name}
                        onChange={(e) => handleNestedChange('madinahHotel', 'name', e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Star Rating*</label>
                      <select
                        className="form-input"
                        value={packageData.madinahHotel.rating}
                        onChange={(e) => handleNestedChange('madinahHotel', 'rating', parseInt(e.target.value))}
                      >
                        <option value="3">3 Star</option>
                        <option value="4">4 Star</option>
                        <option value="5">5 Star</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Distance from Haram*</label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="e.g., 150 meters"
                        value={packageData.madinahHotel.distanceFromHaram}
                        onChange={(e) => handleNestedChange('madinahHotel', 'distanceFromHaram', e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Room Type*</label>
                      <select
                        className="form-input"
                        value={packageData.madinahHotel.roomType}
                        onChange={(e) => handleNestedChange('madinahHotel', 'roomType', e.target.value)}
                      >
                        <option value="Quint">Quint (5 sharing)</option>
                        <option value="Quad">Quad (4 sharing)</option>
                        <option value="Triple">Triple (3 sharing)</option>
                        <option value="Double">Double (2 sharing)</option>
                        <option value="Single">Single</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Inclusions Tab */}
          {currentTab === 'inclusions' && (
            <div className="form-section">
              <h2 className="section-title">✅ Inclusions & Exclusions</h2>
              
              <div className="inclusions-grid">
                <div className="inclusions-section">
                  <h3 className="subsection-title">✅ Package Inclusions</h3>
                  <div className="checkbox-grid">
                    {inclusionOptions.map((item) => (
                      <label key={item} className="checkbox-card">
                        <input
                          type="checkbox"
                          checked={packageData.inclusions.includes(item)}
                          onChange={() => handleToggleInclusion(item)}
                        />
                        <span className="checkbox-label">{item}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="exclusions-section">
                  <h3 className="subsection-title">❌ Package Exclusions</h3>
                  <div className="checkbox-grid">
                    {exclusionOptions.map((item) => (
                      <label key={item} className="checkbox-card">
                        <input
                          type="checkbox"
                          checked={packageData.exclusions.includes(item)}
                          onChange={() => handleToggleExclusion(item)}
                        />
                        <span className="checkbox-label">{item}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Itinerary Tab */}
          {currentTab === 'itinerary' && (
            <div className="form-section">
              <h2 className="section-title">📋 Package Itinerary</h2>
              <div className="itinerary-builder">
                <div className="itinerary-note">
                  <p>💡 You can create a detailed itinerary after publishing the package using our Itinerary Generator tool.</p>
                  <button className="btn btn-primary" onClick={() => navigate('/vendor/packages/itinerary/new')}>
                    🚀 Go to Itinerary Generator
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Images Tab */}
          {currentTab === 'images' && (
            <div className="form-section">
              <h2 className="section-title">📷 Package Images</h2>
              <div className="images-upload-section">
                <div className="upload-card">
                  <div className="upload-icon">📷</div>
                  <h3>Upload Package Images</h3>
                  <p>Add high-quality images of hotels, locations, and facilities</p>
                  <button className="btn btn-primary">
                    📤 Upload Images
                  </button>
                  <p className="upload-note">Supported formats: JPG, PNG (Max 5MB each)</p>
                </div>
              </div>
            </div>
          )}

          {/* Terms Tab */}
          {currentTab === 'terms' && (
            <div className="form-section">
              <h2 className="section-title">📄 Terms & Conditions</h2>
              
              <div className="form-grid">
                <div className="form-group form-group-full">
                  <label className="form-label">Terms & Conditions</label>
                  <textarea
                    className="form-textarea"
                    rows="8"
                    placeholder="Enter terms and conditions..."
                    value={packageData.terms}
                    onChange={(e) => handleInputChange('terms', e.target.value)}
                  />
                </div>

                <div className="form-group form-group-full">
                  <label className="form-label">Cancellation Policy</label>
                  <textarea
                    className="form-textarea"
                    rows="8"
                    placeholder="Enter cancellation policy..."
                    value={packageData.cancellationPolicy}
                    onChange={(e) => handleInputChange('cancellationPolicy', e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="form-footer">
          <button className="btn btn-secondary btn-lg" onClick={() => navigate('/vendor/packages')}>
            ← Cancel
          </button>
          <div className="footer-actions">
            <button className="btn btn-outline btn-lg" onClick={() => handleSubmit('draft')}>
              💾 Save as Draft
            </button>
            <button className="btn btn-success btn-lg" onClick={() => handleSubmit('active')}>
              ✓ Publish Package
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePackage;
