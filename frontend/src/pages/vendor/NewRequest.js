import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from 'react-query';
import { vendorAPI } from '../../services/api';
import { toast } from 'react-toastify';
import './NewRequest.css';

const NewRequest = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [requestData, setRequestData] = useState({
    service: '',
    umrahType: '',
    departureCity: '',
    departureMonth: '',
    pnr: '',
    packageName: '',
    packageType: '',
    sharingType: '',
    passengers: [],
  });

  const serviceOptions = ['Hajj', 'Umrah', 'Ziyarat', 'Ramzan', 'Holidays'];
  
  const umrahTypeOptions = [
    'Fixed Group Departure',
    'Umrah Land Package',
    'Umrah From Dubai',
    'Special Offer',
    'Customize Package',
  ];

  const handleInputChange = (field, value) => {
    setRequestData(prev => ({ ...prev, [field]: value }));
  };

  const validateStep = (step) => {
    if (step === 1) {
      return requestData.service !== '';
    }
    if (step === 2) {
      return requestData.umrahType && requestData.departureCity && requestData.departureMonth;
    }
    if (step === 3) {
      return requestData.packageName && requestData.packageType;
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
      window.scrollTo(0, 0);
    } else {
      toast.error('Please fill all required fields');
    }
  };

  const handleBack = () => {
    setCurrentStep(prev => prev - 1);
    window.scrollTo(0, 0);
  };

  const handleSubmit = async () => {
    try {
      // await vendorAPI.createRequest(requestData);
      toast.success('Request created successfully!');
      navigate('/vendor/requests');
    } catch (error) {
      toast.error('Failed to create request');
    }
  };

  return (
    <div className="new-request-page">
      <div className="container">
        {/* Header */}
        <div className="page-header">
          <div>
            <h1 className="page-title">New Request</h1>
            <div className="breadcrumb">
              <a href="/vendor/dashboard">Dashboard</a>
              <span>›</span>
              <span>New Request</span>
            </div>
          </div>
          <button className="btn btn-secondary" onClick={() => navigate('/vendor/requests')}>
            ← Back to Requests
          </button>
        </div>

        {/* Progress Steps */}
        <div className="request-progress">
          <div className={`progress-step ${currentStep >= 1 ? 'active' : ''} ${currentStep > 1 ? 'completed' : ''}`}>
            <div className="step-circle">1</div>
            <div className="step-label">Service Selection</div>
          </div>
          <div className="progress-connector"></div>
          <div className={`progress-step ${currentStep >= 2 ? 'active' : ''} ${currentStep > 2 ? 'completed' : ''}`}>
            <div className="step-circle">2</div>
            <div className="step-label">Travel Details</div>
          </div>
          <div className="progress-connector"></div>
          <div className={`progress-step ${currentStep >= 3 ? 'active' : ''} ${currentStep > 3 ? 'completed' : ''}`}>
            <div className="step-circle">3</div>
            <div className="step-label">Package Details</div>
          </div>
          <div className="progress-connector"></div>
          <div className={`progress-step ${currentStep >= 4 ? 'active' : ''}`}>
            <div className="step-circle">4</div>
            <div className="step-label">Passenger Info</div>
          </div>
        </div>

        {/* Step Content */}
        <div className="request-content">
          {/* Step 1: Service Selection */}
          {currentStep === 1 && (
            <div className="step-container">
              <h2 className="step-title">Service Selection</h2>
              <p className="step-description">Select the type of service for this request</p>

              <div className="form-section">
                <label className="form-label form-label-required">Service*</label>
                <div className="service-options">
                  {serviceOptions.map((service) => (
                    <button
                      key={service}
                      className={`service-option ${requestData.service === service ? 'active' : ''}`}
                      onClick={() => handleInputChange('service', service)}
                    >
                      <span className="option-icon">
                        {service === 'Hajj' && '🕋'}
                        {service === 'Umrah' && '🕌'}
                        {service === 'Ziyarat' && '🏛️'}
                        {service === 'Ramzan' && '🌙'}
                        {service === 'Holidays' && '✈️'}
                      </span>
                      <span className="option-label">{service}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="step-actions">
                <button className="btn btn-primary btn-lg" onClick={handleNext}>
                  Next →
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Travel Details */}
          {currentStep === 2 && (
            <div className="step-container">
              <h2 className="step-title">Travel Details</h2>
              <p className="step-description">Enter travel information for this request</p>

              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label form-label-required">Service*</label>
                  <input
                    type="text"
                    className="form-input"
                    value={requestData.service}
                    disabled
                  />
                </div>

                <div className="form-group">
                  <label className="form-label form-label-required">Umrah Type*</label>
                  <select
                    className="form-input"
                    value={requestData.umrahType}
                    onChange={(e) => handleInputChange('umrahType', e.target.value)}
                  >
                    <option value="">Select Umrah Type</option>
                    {umrahTypeOptions.map((type) => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label form-label-required">Departure City*</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Enter departure city"
                    value={requestData.departureCity}
                    onChange={(e) => handleInputChange('departureCity', e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label form-label-required">Departure Month*</label>
                  <input
                    type="month"
                    className="form-input"
                    value={requestData.departureMonth}
                    onChange={(e) => handleInputChange('departureMonth', e.target.value)}
                  />
                </div>

                <div className="form-group form-group-full">
                  <label className="form-label">PNR</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Enter PNR (optional)"
                    value={requestData.pnr}
                    onChange={(e) => handleInputChange('pnr', e.target.value)}
                  />
                </div>
              </div>

              <div className="step-actions">
                <button className="btn btn-secondary btn-lg" onClick={handleBack}>
                  ← Back
                </button>
                <button className="btn btn-primary btn-lg" onClick={handleNext}>
                  Next →
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Package Details */}
          {currentStep === 3 && (
            <div className="step-container">
              <h2 className="step-title">Package Details</h2>
              <p className="step-description">Select package and configure details</p>

              {/* Summary of Previous Steps */}
              <div className="summary-card">
                <h3>Summary of Previous Steps</h3>
                <div className="summary-grid">
                  <div className="summary-item">
                    <strong>Service:</strong>
                    <span>{requestData.service}</span>
                  </div>
                  <div className="summary-item">
                    <strong>Type:</strong>
                    <span>{requestData.umrahType}</span>
                  </div>
                  <div className="summary-item">
                    <strong>Departure City:</strong>
                    <span>{requestData.departureCity}</span>
                  </div>
                  <div className="summary-item">
                    <strong>Departure Month:</strong>
                    <span>{requestData.departureMonth}</span>
                  </div>
                  {requestData.pnr && (
                    <div className="summary-item">
                      <strong>PNR:</strong>
                      <span>{requestData.pnr}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label form-label-required">Package Name*</label>
                  <select
                    className="form-input"
                    value={requestData.packageName}
                    onChange={(e) => handleInputChange('packageName', e.target.value)}
                  >
                    <option value="">Select Package</option>
                    <option value="20 Days Regular Umrah">20 Days Regular Umrah</option>
                    <option value="15 Days Premium Umrah">15 Days Premium Umrah</option>
                    <option value="10 Days Economy Umrah">10 Days Economy Umrah</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label form-label-required">Package Type*</label>
                  <select
                    className="form-input"
                    value={requestData.packageType}
                    onChange={(e) => handleInputChange('packageType', e.target.value)}
                  >
                    <option value="">Select Package Type</option>
                    <option value="Bronze">Bronze</option>
                    <option value="Silver">Silver</option>
                    <option value="Gold">Gold</option>
                    <option value="Platinum">Platinum</option>
                  </select>
                </div>

                <div className="form-group form-group-full">
                  <label className="form-label">Sharing Type</label>
                  <select
                    className="form-input"
                    value={requestData.sharingType}
                    onChange={(e) => handleInputChange('sharingType', e.target.value)}
                  >
                    <option value="">Select Sharing Type</option>
                    <option value="Quint">Quint (5 sharing)</option>
                    <option value="Quad">Quad (4 sharing)</option>
                    <option value="Triple">Triple (3 sharing)</option>
                    <option value="Double">Double (2 sharing)</option>
                    <option value="Single">Single</option>
                  </select>
                </div>
              </div>

              <div className="step-actions">
                <button className="btn btn-secondary btn-lg" onClick={handleBack}>
                  ← Back
                </button>
                <button className="btn btn-primary btn-lg" onClick={handleNext}>
                  Next →
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Passenger Info */}
          {currentStep === 4 && (
            <div className="step-container">
              <h2 className="step-title">Passenger Information</h2>
              <p className="step-description">Add passenger details for this request</p>

              <div className="passenger-section">
                <div className="passenger-header">
                  <h3>Passengers</h3>
                  <button className="btn btn-sm btn-primary">
                    <span>➕</span>
                    Add Passenger
                  </button>
                </div>

                <div className="passenger-form">
                  <div className="form-grid">
                    <div className="form-group">
                      <label className="form-label form-label-required">First Name*</label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="Enter first name"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label form-label-required">Last Name*</label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="Enter last name"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label form-label-required">Phone*</label>
                      <input
                        type="tel"
                        className="form-input"
                        placeholder="10-digit mobile number"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Email</label>
                      <input
                        type="email"
                        className="form-input"
                        placeholder="Enter email"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label form-label-required">Date of Birth*</label>
                      <input
                        type="date"
                        className="form-input"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label form-label-required">Gender*</label>
                      <select className="form-input">
                        <option value="">Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              <div className="step-actions">
                <button className="btn btn-secondary btn-lg" onClick={handleBack}>
                  ← Back
                </button>
                <button className="btn btn-success btn-lg" onClick={handleSubmit}>
                  <span>✓</span>
                  Create Request
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NewRequest;
