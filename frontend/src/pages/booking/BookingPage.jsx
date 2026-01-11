import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './BookingPage.css';

const BookingPage = () => {
  const { packageId } = useParams();
  const navigate = useNavigate();
  const [packageData, setPackageData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Traveler Details
    travelers: [
      {
        firstName: '',
        lastName: '',
        dateOfBirth: '',
        gender: '',
        passportNumber: '',
        passportExpiry: '',
        nationality: ''
      }
    ],
    // Contact Details
    email: '',
    phone: '',
    alternatePhone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    // Travel Details
    departureDate: '',
    roomType: 'double',
    specialRequests: '',
    // Payment
    paymentMethod: 'full',
    agreeToTerms: false
  });

  useEffect(() => {
    fetchPackageData();
  }, [packageId]);

  const fetchPackageData = async () => {
    try {
      setLoading(true);
      // TODO: Replace with actual API call
      setTimeout(() => {
        setPackageData({
          id: packageId,
          title: '14 Days Premium Umrah Package',
          price: 85000,
          duration: 14,
          type: 'Umrah'
        });
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error fetching package:', error);
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleTravelerChange = (index, field, value) => {
    const updatedTravelers = [...formData.travelers];
    updatedTravelers[index][field] = value;
    setFormData(prev => ({ ...prev, travelers: updatedTravelers }));
  };

  const addTraveler = () => {
    setFormData(prev => ({
      ...prev,
      travelers: [
        ...prev.travelers,
        {
          firstName: '',
          lastName: '',
          dateOfBirth: '',
          gender: '',
          passportNumber: '',
          passportExpiry: '',
          nationality: ''
        }
      ]
    }));
  };

  const removeTraveler = (index) => {
    if (formData.travelers.length > 1) {
      const updatedTravelers = formData.travelers.filter((_, i) => i !== index);
      setFormData(prev => ({ ...prev, travelers: updatedTravelers }));
    }
  };

  const validateStep = (step) => {
    // TODO: Add validation logic
    return true;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 4));
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.agreeToTerms) {
      alert('Please agree to terms and conditions');
      return;
    }

    try {
      // TODO: Replace with actual API call
      console.log('Booking data:', formData);
      // Redirect to payment or confirmation
      navigate('/booking-confirmation');
    } catch (error) {
      console.error('Error submitting booking:', error);
    }
  };

  const calculateTotal = () => {
    const basePrice = packageData?.price || 0;
    const travelers = formData.travelers.length;
    return basePrice * travelers;
  };

  if (loading) {
    return (
      <div className="booking-page">
        <div className="loading-container">
          <div className="loader"></div>
          <p>Loading booking details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="booking-page">
      <div className="booking-container">
        {/* Progress Steps */}
        <div className="booking-steps">
          <div className={`step ${currentStep >= 1 ? 'active' : ''} ${currentStep > 1 ? 'completed' : ''}`}>
            <div className="step-number">1</div>
            <div className="step-label">Traveler Details</div>
          </div>
          <div className="step-line"></div>
          <div className={`step ${currentStep >= 2 ? 'active' : ''} ${currentStep > 2 ? 'completed' : ''}`}>
            <div className="step-number">2</div>
            <div className="step-label">Contact Info</div>
          </div>
          <div className="step-line"></div>
          <div className={`step ${currentStep >= 3 ? 'active' : ''} ${currentStep > 3 ? 'completed' : ''}`}>
            <div className="step-number">3</div>
            <div className="step-label">Travel Details</div>
          </div>
          <div className="step-line"></div>
          <div className={`step ${currentStep >= 4 ? 'active' : ''} ${currentStep > 4 ? 'completed' : ''}`}>
            <div className="step-number">4</div>
            <div className="step-label">Review & Pay</div>
          </div>
        </div>

        <div className="booking-content">
          {/* Form Section */}
          <div className="booking-form-section">
            <form onSubmit={handleSubmit}>
              {/* Step 1: Traveler Details */}
              {currentStep === 1 && (
                <div className="form-step">
                  <h2 className="step-title">
                    <span className="title-icon">👥</span>
                    Traveler Details
                  </h2>
                  <p className="step-description">
                    Please provide details for all travelers
                  </p>

                  {formData.travelers.map((traveler, index) => (
                    <div key={index} className="traveler-card">
                      <div className="traveler-header">
                        <h3 className="traveler-title">Traveler {index + 1}</h3>
                        {formData.travelers.length > 1 && (
                          <button
                            type="button"
                            className="btn-remove"
                            onClick={() => removeTraveler(index)}
                          >
                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            Remove
                          </button>
                        )}
                      </div>

                      <div className="form-grid">
                        <div className="form-group">
                          <label className="form-label">First Name *</label>
                          <input
                            type="text"
                            className="form-input"
                            value={traveler.firstName}
                            onChange={(e) => handleTravelerChange(index, 'firstName', e.target.value)}
                            required
                          />
                        </div>

                        <div className="form-group">
                          <label className="form-label">Last Name *</label>
                          <input
                            type="text"
                            className="form-input"
                            value={traveler.lastName}
                            onChange={(e) => handleTravelerChange(index, 'lastName', e.target.value)}
                            required
                          />
                        </div>

                        <div className="form-group">
                          <label className="form-label">Date of Birth *</label>
                          <input
                            type="date"
                            className="form-input"
                            value={traveler.dateOfBirth}
                            onChange={(e) => handleTravelerChange(index, 'dateOfBirth', e.target.value)}
                            required
                          />
                        </div>

                        <div className="form-group">
                          <label className="form-label">Gender *</label>
                          <select
                            className="form-input"
                            value={traveler.gender}
                            onChange={(e) => handleTravelerChange(index, 'gender', e.target.value)}
                            required
                          >
                            <option value="">Select Gender</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                          </select>
                        </div>

                        <div className="form-group">
                          <label className="form-label">Passport Number *</label>
                          <input
                            type="text"
                            className="form-input"
                            value={traveler.passportNumber}
                            onChange={(e) => handleTravelerChange(index, 'passportNumber', e.target.value)}
                            required
                          />
                        </div>

                        <div className="form-group">
                          <label className="form-label">Passport Expiry *</label>
                          <input
                            type="date"
                            className="form-input"
                            value={traveler.passportExpiry}
                            onChange={(e) => handleTravelerChange(index, 'passportExpiry', e.target.value)}
                            required
                          />
                        </div>

                        <div className="form-group form-group-full">
                          <label className="form-label">Nationality *</label>
                          <input
                            type="text"
                            className="form-input"
                            value={traveler.nationality}
                            onChange={(e) => handleTravelerChange(index, 'nationality', e.target.value)}
                            required
                          />
                        </div>
                      </div>
                    </div>
                  ))}

                  <button type="button" className="btn btn-secondary btn-add" onClick={addTraveler}>
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add Another Traveler
                  </button>
                </div>
              )}

              {/* Step 2: Contact Information */}
              {currentStep === 2 && (
                <div className="form-step">
                  <h2 className="step-title">
                    <span className="title-icon">📧</span>
                    Contact Information
                  </h2>
                  <p className="step-description">
                    We'll use this information to send booking confirmations
                  </p>

                  <div className="form-grid">
                    <div className="form-group form-group-full">
                      <label className="form-label">Email Address *</label>
                      <input
                        type="email"
                        name="email"
                        className="form-input"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Phone Number *</label>
                      <input
                        type="tel"
                        name="phone"
                        className="form-input"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Alternate Phone</label>
                      <input
                        type="tel"
                        name="alternatePhone"
                        className="form-input"
                        value={formData.alternatePhone}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className="form-group form-group-full">
                      <label className="form-label">Address *</label>
                      <input
                        type="text"
                        name="address"
                        className="form-input"
                        value={formData.address}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">City *</label>
                      <input
                        type="text"
                        name="city"
                        className="form-input"
                        value={formData.city}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">State *</label>
                      <input
                        type="text"
                        name="state"
                        className="form-input"
                        value={formData.state}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Pincode *</label>
                      <input
                        type="text"
                        name="pincode"
                        className="form-input"
                        value={formData.pincode}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Travel Details */}
              {currentStep === 3 && (
                <div className="form-step">
                  <h2 className="step-title">
                    <span className="title-icon">✈️</span>
                    Travel Details
                  </h2>
                  <p className="step-description">
                    Select your preferred travel dates and room type
                  </p>

                  <div className="form-grid">
                    <div className="form-group form-group-full">
                      <label className="form-label">Departure Date *</label>
                      <input
                        type="date"
                        name="departureDate"
                        className="form-input"
                        value={formData.departureDate}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <div className="form-group form-group-full">
                      <label className="form-label">Room Type *</label>
                      <div className="radio-group">
                        <label className="radio-option">
                          <input
                            type="radio"
                            name="roomType"
                            value="single"
                            checked={formData.roomType === 'single'}
                            onChange={handleInputChange}
                          />
                          <span className="radio-content">
                            <span className="radio-title">Single Room</span>
                            <span className="radio-desc">Private room for one person</span>
                          </span>
                        </label>

                        <label className="radio-option">
                          <input
                            type="radio"
                            name="roomType"
                            value="double"
                            checked={formData.roomType === 'double'}
                            onChange={handleInputChange}
                          />
                          <span className="radio-content">
                            <span className="radio-title">Double Sharing</span>
                            <span className="radio-desc">Room shared with another person</span>
                          </span>
                        </label>

                        <label className="radio-option">
                          <input
                            type="radio"
                            name="roomType"
                            value="triple"
                            checked={formData.roomType === 'triple'}
                            onChange={handleInputChange}
                          />
                          <span className="radio-content">
                            <span className="radio-title">Triple Sharing</span>
                            <span className="radio-desc">Room shared with two others</span>
                          </span>
                        </label>
                      </div>
                    </div>

                    <div className="form-group form-group-full">
                      <label className="form-label">Special Requests</label>
                      <textarea
                        name="specialRequests"
                        className="form-textarea"
                        rows="4"
                        value={formData.specialRequests}
                        onChange={handleInputChange}
                        placeholder="Any special requirements or requests..."
                      ></textarea>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 4: Review & Payment */}
              {currentStep === 4 && (
                <div className="form-step">
                  <h2 className="step-title">
                    <span className="title-icon">💳</span>
                    Review & Payment
                  </h2>
                  <p className="step-description">
                    Review your booking details and proceed to payment
                  </p>

                  <div className="review-section">
                    <h3 className="review-title">Booking Summary</h3>
                    <div className="review-item">
                      <span className="review-label">Package:</span>
                      <span className="review-value">{packageData?.title}</span>
                    </div>
                    <div className="review-item">
                      <span className="review-label">Number of Travelers:</span>
                      <span className="review-value">{formData.travelers.length}</span>
                    </div>
                    <div className="review-item">
                      <span className="review-label">Departure Date:</span>
                      <span className="review-value">{formData.departureDate || 'Not selected'}</span>
                    </div>
                    <div className="review-item">
                      <span className="review-label">Room Type:</span>
                      <span className="review-value">{formData.roomType}</span>
                    </div>
                  </div>

                  <div className="payment-section">
                    <h3 className="review-title">Payment Method</h3>
                    <div className="radio-group">
                      <label className="radio-option">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="full"
                          checked={formData.paymentMethod === 'full'}
                          onChange={handleInputChange}
                        />
                        <span className="radio-content">
                          <span className="radio-title">Full Payment</span>
                          <span className="radio-desc">Pay the complete amount now</span>
                        </span>
                      </label>

                      <label className="radio-option">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="partial"
                          checked={formData.paymentMethod === 'partial'}
                          onChange={handleInputChange}
                        />
                        <span className="radio-content">
                          <span className="radio-title">Partial Payment</span>
                          <span className="radio-desc">Pay 30% now, rest later</span>
                        </span>
                      </label>
                    </div>
                  </div>

                  <div className="terms-section">
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        name="agreeToTerms"
                        checked={formData.agreeToTerms}
                        onChange={handleInputChange}
                        className="checkbox-input"
                        required
                      />
                      <span className="checkbox-text">
                        I agree to the <a href="/terms">Terms & Conditions</a> and <a href="/privacy">Privacy Policy</a>
                      </span>
                    </label>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="form-navigation">
                {currentStep > 1 && (
                  <button type="button" className="btn btn-secondary" onClick={handlePrevious}>
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Previous
                  </button>
                )}
                {currentStep < 4 ? (
                  <button type="button" className="btn btn-primary" onClick={handleNext}>
                    Next
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                ) : (
                  <button type="submit" className="btn btn-primary">
                    Proceed to Payment
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Summary Sidebar */}
          <div className="booking-summary">
            <div className="summary-card">
              <h3 className="summary-title">
                <span className="title-icon">📋</span>
                Booking Summary
              </h3>

              <div className="summary-package">
                <h4 className="package-name">{packageData?.title}</h4>
                <div className="package-type">{packageData?.type}</div>
              </div>

              <div className="summary-details">
                <div className="summary-row">
                  <span className="summary-label">Duration:</span>
                  <span className="summary-value">{packageData?.duration} Days</span>
                </div>
                <div className="summary-row">
                  <span className="summary-label">Travelers:</span>
                  <span className="summary-value">{formData.travelers.length}</span>
                </div>
                <div className="summary-row">
                  <span className="summary-label">Price per person:</span>
                  <span className="summary-value">₹{packageData?.price.toLocaleString()}</span>
                </div>
              </div>

              <div className="summary-divider"></div>

              <div className="summary-total">
                <span className="total-label">Total Amount:</span>
                <span className="total-value">₹{calculateTotal().toLocaleString()}</span>
              </div>

              <div className="summary-note">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Final price may vary based on room type and additional services</span>
              </div>
            </div>

            <div className="help-card">
              <h4 className="help-title">Need Help?</h4>
              <p className="help-text">Our team is here to assist you</p>
              <a href="tel:+919876543210" className="help-link">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                +91 98765 43210
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;
