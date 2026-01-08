import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from 'react-query';
import { packagesAPI, bookingsAPI } from '../services/api';
import useAuthStore from '../store/authStore';
import { toast } from 'react-toastify';
import './BookingPage.css';

const BookingPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [currentStep, setCurrentStep] = useState(1);
  const [bookingData, setBookingData] = useState({
    packageId: id,
    travelers: [],
    travelerCount: 1,
    contactInfo: {
      phone: user?.phone || '',
      email: user?.email || '',
      alternatePhone: '',
    },
    paymentMethod: 'partial',
    specialRequests: '',
  });

  // Fetch package details
  const { data: packageData, isLoading } = useQuery(
    ['package', id],
    () => packagesAPI.getById(id)
  );

  // Mock package data
  const mockPackage = {
    id: '1',
    title: 'Gold Umrah Package - 15 Days',
    duration: 15,
    departureCity: 'Mumbai',
    departureDate: '2024-03-15',
    basePrice: 125000,
    discountedPrice: 110000,
    makkahDays: 8,
    madinahDays: 7,
  };

  const pkg = packageData?.data || mockPackage;

  useEffect(() => {
    // Initialize travelers array
    const travelers = Array.from({ length: bookingData.travelerCount }, (_, i) => ({
      id: i + 1,
      firstName: '',
      lastName: '',
      dateOfBirth: '',
      gender: '',
      passportNumber: '',
      passportExpiry: '',
      nationality: 'Indian',
    }));
    setBookingData(prev => ({ ...prev, travelers }));
  }, [bookingData.travelerCount]);

  const handleTravelerCountChange = (count) => {
    setBookingData(prev => ({ ...prev, travelerCount: count }));
  };

  const handleTravelerChange = (index, field, value) => {
    const updatedTravelers = [...bookingData.travelers];
    updatedTravelers[index] = {
      ...updatedTravelers[index],
      [field]: value,
    };
    setBookingData(prev => ({ ...prev, travelers: updatedTravelers }));
  };

  const handleContactChange = (field, value) => {
    setBookingData(prev => ({
      ...prev,
      contactInfo: {
        ...prev.contactInfo,
        [field]: value,
      },
    }));
  };

  const validateStep = (step) => {
    if (step === 1) {
      return bookingData.travelerCount > 0;
    }
    if (step === 2) {
      return bookingData.travelers.every(t => 
        t.firstName && t.lastName && t.dateOfBirth && t.gender && 
        t.passportNumber && t.passportExpiry
      ) && bookingData.contactInfo.phone && bookingData.contactInfo.email;
    }
    if (step === 3) {
      return bookingData.paymentMethod;
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
      const response = await bookingsAPI.create(bookingData);
      toast.success('Booking created successfully!');
      navigate(`/dashboard/bookings/${response.data.id}`);
    } catch (error) {
      toast.error('Failed to create booking. Please try again.');
    }
  };

  const totalPrice = pkg.discountedPrice * bookingData.travelerCount;
  const bookingAmount = Math.round(totalPrice * 0.1); // 10% booking amount
  const remainingAmount = totalPrice - bookingAmount;

  if (isLoading) {
    return (
      <div className="booking-loading">
        <div className="spinner spinner-lg"></div>
        <p>Loading booking details...</p>
      </div>
    );
  }

  return (
    <div className="booking-page">
      <div className="container">
        {/* Progress Steps */}
        <div className="booking-progress">
          <div className={`progress-step ${currentStep >= 1 ? 'active' : ''} ${currentStep > 1 ? 'completed' : ''}`}>
            <div className="step-number">1</div>
            <div className="step-label">Package Details</div>
          </div>
          <div className="progress-line"></div>
          <div className={`progress-step ${currentStep >= 2 ? 'active' : ''} ${currentStep > 2 ? 'completed' : ''}`}>
            <div className="step-number">2</div>
            <div className="step-label">Traveler Info</div>
          </div>
          <div className="progress-line"></div>
          <div className={`progress-step ${currentStep >= 3 ? 'active' : ''} ${currentStep > 3 ? 'completed' : ''}`}>
            <div className="step-number">3</div>
            <div className="step-label">Payment</div>
          </div>
          <div className="progress-line"></div>
          <div className={`progress-step ${currentStep >= 4 ? 'active' : ''}`}>
            <div className="step-number">4</div>
            <div className="step-label">Confirmation</div>
          </div>
        </div>

        <div className="booking-content">
          {/* Main Content */}
          <div className="booking-main">
            {/* Step 1: Package Details */}
            {currentStep === 1 && (
              <div className="booking-step">
                <h2 className="step-title">📦 Package Details</h2>
                <p className="step-subtitle">Review package and select number of travelers</p>

                <div className="package-summary-card">
                  <h3>{pkg.title}</h3>
                  <div className="summary-details">
                    <div className="summary-item">
                      <span className="item-icon">📅</span>
                      <div>
                        <strong>Duration</strong>
                        <p>{pkg.duration} Days</p>
                      </div>
                    </div>
                    <div className="summary-item">
                      <span className="item-icon">📍</span>
                      <div>
                        <strong>Departure</strong>
                        <p>{pkg.departureCity}</p>
                      </div>
                    </div>
                    <div className="summary-item">
                      <span className="item-icon">🗓️</span>
                      <div>
                        <strong>Date</strong>
                        <p>{pkg.departureDate}</p>
                      </div>
                    </div>
                    <div className="summary-item">
                      <span className="item-icon">💰</span>
                      <div>
                        <strong>Price per person</strong>
                        <p>₹{pkg.discountedPrice.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="traveler-count-section">
                  <h3>👥 Number of Travelers</h3>
                  <p>Select how many people will be traveling</p>
                  <div className="traveler-count-selector">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map(count => (
                      <button
                        key={count}
                        className={`count-btn ${bookingData.travelerCount === count ? 'active' : ''}`}
                        onClick={() => handleTravelerCountChange(count)}
                      >
                        {count}
                      </button>
                    ))}
                  </div>
                  <p className="count-note">
                    Need more than 8 travelers? <a href="tel:+911800XXXXXXX">Contact us</a> for group bookings
                  </p>
                </div>

                <div className="step-actions">
                  <button className="btn btn-primary btn-lg" onClick={handleNext}>
                    Continue to Traveler Info →
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Traveler Information */}
            {currentStep === 2 && (
              <div className="booking-step">
                <h2 className="step-title">👤 Traveler Information</h2>
                <p className="step-subtitle">Enter details for all travelers (as per passport)</p>

                {bookingData.travelers.map((traveler, index) => (
                  <div key={index} className="traveler-form-card">
                    <h3>Traveler {index + 1}</h3>
                    <div className="form-grid">
                      <div className="form-group">
                        <label className="form-label form-label-required">First Name</label>
                        <input
                          type="text"
                          className="form-input"
                          placeholder="As per passport"
                          value={traveler.firstName}
                          onChange={(e) => handleTravelerChange(index, 'firstName', e.target.value)}
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label form-label-required">Last Name</label>
                        <input
                          type="text"
                          className="form-input"
                          placeholder="As per passport"
                          value={traveler.lastName}
                          onChange={(e) => handleTravelerChange(index, 'lastName', e.target.value)}
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label form-label-required">Date of Birth</label>
                        <input
                          type="date"
                          className="form-input"
                          value={traveler.dateOfBirth}
                          onChange={(e) => handleTravelerChange(index, 'dateOfBirth', e.target.value)}
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label form-label-required">Gender</label>
                        <select
                          className="form-input"
                          value={traveler.gender}
                          onChange={(e) => handleTravelerChange(index, 'gender', e.target.value)}
                        >
                          <option value="">Select Gender</option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                        </select>
                      </div>
                      <div className="form-group">
                        <label className="form-label form-label-required">Passport Number</label>
                        <input
                          type="text"
                          className="form-input"
                          placeholder="Enter passport number"
                          value={traveler.passportNumber}
                          onChange={(e) => handleTravelerChange(index, 'passportNumber', e.target.value.toUpperCase())}
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label form-label-required">Passport Expiry</label>
                        <input
                          type="date"
                          className="form-input"
                          value={traveler.passportExpiry}
                          onChange={(e) => handleTravelerChange(index, 'passportExpiry', e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                ))}

                <div className="contact-info-card">
                  <h3>📞 Contact Information</h3>
                  <div className="form-grid">
                    <div className="form-group">
                      <label className="form-label form-label-required">Phone Number</label>
                      <input
                        type="tel"
                        className="form-input"
                        placeholder="10-digit mobile number"
                        value={bookingData.contactInfo.phone}
                        onChange={(e) => handleContactChange('phone', e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Alternate Phone</label>
                      <input
                        type="tel"
                        className="form-input"
                        placeholder="Optional"
                        value={bookingData.contactInfo.alternatePhone}
                        onChange={(e) => handleContactChange('alternatePhone', e.target.value)}
                      />
                    </div>
                    <div className="form-group form-group-full">
                      <label className="form-label form-label-required">Email Address</label>
                      <input
                        type="email"
                        className="form-input"
                        placeholder="For booking confirmation"
                        value={bookingData.contactInfo.email}
                        onChange={(e) => handleContactChange('email', e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <div className="special-requests-card">
                  <h3>📝 Special Requests (Optional)</h3>
                  <textarea
                    className="form-textarea"
                    rows="4"
                    placeholder="Any special requirements or requests..."
                    value={bookingData.specialRequests}
                    onChange={(e) => setBookingData(prev => ({ ...prev, specialRequests: e.target.value }))}
                  ></textarea>
                </div>

                <div className="step-actions">
                  <button className="btn btn-secondary btn-lg" onClick={handleBack}>
                    ← Back
                  </button>
                  <button className="btn btn-primary btn-lg" onClick={handleNext}>
                    Continue to Payment →
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Payment */}
            {currentStep === 3 && (
              <div className="booking-step">
                <h2 className="step-title">💳 Payment Options</h2>
                <p className="step-subtitle">Choose your payment method</p>

                <div className="payment-options">
                  <div
                    className={`payment-option ${bookingData.paymentMethod === 'partial' ? 'active' : ''}`}
                    onClick={() => setBookingData(prev => ({ ...prev, paymentMethod: 'partial' }))}
                  >
                    <div className="option-header">
                      <input
                        type="radio"
                        name="payment"
                        checked={bookingData.paymentMethod === 'partial'}
                        readOnly
                      />
                      <div>
                        <h4>Pay 10% Now (Recommended)</h4>
                        <p>Book with just ₹{bookingAmount.toLocaleString()}</p>
                      </div>
                    </div>
                    <div className="option-details">
                      <div className="detail-row">
                        <span>Booking Amount (10%)</span>
                        <strong>₹{bookingAmount.toLocaleString()}</strong>
                      </div>
                      <div className="detail-row">
                        <span>Remaining Amount</span>
                        <span>₹{remainingAmount.toLocaleString()}</span>
                      </div>
                      <div className="detail-note">
                        ✓ Pay remaining 30 days before departure<br />
                        ✓ Flexible installment options available
                      </div>
                    </div>
                  </div>

                  <div
                    className={`payment-option ${bookingData.paymentMethod === 'full' ? 'active' : ''}`}
                    onClick={() => setBookingData(prev => ({ ...prev, paymentMethod: 'full' }))}
                  >
                    <div className="option-header">
                      <input
                        type="radio"
                        name="payment"
                        checked={bookingData.paymentMethod === 'full'}
                        readOnly
                      />
                      <div>
                        <h4>Pay Full Amount</h4>
                        <p>Complete payment now</p>
                      </div>
                    </div>
                    <div className="option-details">
                      <div className="detail-row">
                        <span>Total Amount</span>
                        <strong>₹{totalPrice.toLocaleString()}</strong>
                      </div>
                      <div className="detail-note">
                        ✓ No further payments required<br />
                        ✓ Get 2% additional discount
                      </div>
                    </div>
                  </div>
                </div>

                <div className="payment-methods-card">
                  <h3>💳 Accepted Payment Methods</h3>
                  <div className="payment-methods">
                    <div className="payment-method">💳 Credit Card</div>
                    <div className="payment-method">💳 Debit Card</div>
                    <div className="payment-method">🏦 Net Banking</div>
                    <div className="payment-method">📱 UPI</div>
                    <div className="payment-method">💰 Wallets</div>
                  </div>
                </div>

                <div className="terms-checkbox">
                  <label className="checkbox-label">
                    <input type="checkbox" required />
                    <span>
                      I agree to the <a href="/terms" target="_blank">Terms & Conditions</a> and <a href="/privacy" target="_blank">Privacy Policy</a>
                    </span>
                  </label>
                </div>

                <div className="step-actions">
                  <button className="btn btn-secondary btn-lg" onClick={handleBack}>
                    ← Back
                  </button>
                  <button className="btn btn-primary btn-lg" onClick={handleNext}>
                    Proceed to Payment →
                  </button>
                </div>
              </div>
            )}

            {/* Step 4: Confirmation */}
            {currentStep === 4 && (
              <div className="booking-step">
                <div className="confirmation-success">
                  <div className="success-icon">✅</div>
                  <h2>Booking Confirmed!</h2>
                  <p>Your booking has been successfully created</p>
                  <div className="booking-reference">
                    <strong>Booking Reference:</strong>
                    <span className="reference-number">UMR2024001234</span>
                  </div>
                </div>

                <div className="confirmation-details">
                  <h3>📋 Booking Summary</h3>
                  <div className="summary-grid">
                    <div className="summary-row">
                      <span>Package</span>
                      <strong>{pkg.title}</strong>
                    </div>
                    <div className="summary-row">
                      <span>Travelers</span>
                      <strong>{bookingData.travelerCount} Person(s)</strong>
                    </div>
                    <div className="summary-row">
                      <span>Departure Date</span>
                      <strong>{pkg.departureDate}</strong>
                    </div>
                    <div className="summary-row">
                      <span>Total Amount</span>
                      <strong>₹{totalPrice.toLocaleString()}</strong>
                    </div>
                    <div className="summary-row">
                      <span>Amount Paid</span>
                      <strong className="text-success">
                        ₹{(bookingData.paymentMethod === 'partial' ? bookingAmount : totalPrice).toLocaleString()}
                      </strong>
                    </div>
                    {bookingData.paymentMethod === 'partial' && (
                      <div className="summary-row">
                        <span>Remaining Amount</span>
                        <strong className="text-warning">₹{remainingAmount.toLocaleString()}</strong>
                      </div>
                    )}
                  </div>
                </div>

                <div className="next-steps-card">
                  <h3>📌 Next Steps</h3>
                  <ol className="next-steps-list">
                    <li>
                      <strong>Check your email</strong>
                      <p>Booking confirmation sent to {bookingData.contactInfo.email}</p>
                    </li>
                    <li>
                      <strong>Upload documents</strong>
                      <p>Upload passport copies and photos within 7 days</p>
                    </li>
                    <li>
                      <strong>Track visa status</strong>
                      <p>Monitor your visa application through 7 stages</p>
                    </li>
                    <li>
                      <strong>Complete payment</strong>
                      <p>Pay remaining amount 30 days before departure</p>
                    </li>
                  </ol>
                </div>

                <div className="confirmation-actions">
                  <button className="btn btn-primary btn-lg" onClick={() => navigate('/dashboard')}>
                    Go to Dashboard
                  </button>
                  <button className="btn btn-secondary btn-lg" onClick={() => navigate('/packages')}>
                    Browse More Packages
                  </button>
                </div>

                <div className="support-card">
                  <h4>Need Help?</h4>
                  <p>Our team is here to assist you 24/7</p>
                  <div className="support-buttons">
                    <a href="tel:+911800XXXXXXX" className="support-btn">
                      <span>📞</span> Call Us
                    </a>
                    <a href="https://wa.me/911800XXXXXXX" className="support-btn">
                      <span>💬</span> WhatsApp
                    </a>
                    <a href="mailto:support@umrahconnect.in" className="support-btn">
                      <span>📧</span> Email
                    </a>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          {currentStep < 4 && (
            <div className="booking-sidebar">
              <div className="price-summary-card">
                <h3>💰 Price Summary</h3>
                <div className="price-breakdown">
                  <div className="price-row">
                    <span>Package Price</span>
                    <span>₹{pkg.discountedPrice.toLocaleString()}</span>
                  </div>
                  <div className="price-row">
                    <span>Number of Travelers</span>
                    <span>× {bookingData.travelerCount}</span>
                  </div>
                  <div className="price-divider"></div>
                  <div className="price-row price-total">
                    <strong>Total Amount</strong>
                    <strong>₹{totalPrice.toLocaleString()}</strong>
                  </div>
                  {bookingData.paymentMethod === 'partial' && (
                    <>
                      <div className="price-row price-highlight">
                        <span>Pay Now (10%)</span>
                        <strong>₹{bookingAmount.toLocaleString()}</strong>
                      </div>
                      <div className="price-row">
                        <span>Pay Later</span>
                        <span>₹{remainingAmount.toLocaleString()}</span>
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div className="security-badges">
                <div className="security-badge">
                  <span>🔒</span>
                  <span>Secure Payment</span>
                </div>
                <div className="security-badge">
                  <span>✓</span>
                  <span>Verified Vendor</span>
                </div>
                <div className="security-badge">
                  <span>💯</span>
                  <span>100% Refund on Visa Rejection</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingPage;
