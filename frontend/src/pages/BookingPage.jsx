import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import './BookingPage.css';

// Icons
const CheckIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </svg>
);

const UserIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const CreditCardIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
  </svg>
);

const ConfirmIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const CalendarIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const UsersIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
);

const LockIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
  </svg>
);

const DownloadIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
  </svg>
);

const PrintIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
  </svg>
);

const EmailIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

const PhoneIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
  </svg>
);

const MapPinIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const AlertIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
  </svg>
);

// Mock package data (in real app, fetch from API)
const mockPackage = {
  id: 1,
  name: '15 Days Premium Umrah Package',
  vendor: 'Al-Haramain Tours',
  price: 135000,
  originalPrice: 145000,
  image: 'https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?w=800',
  duration: '15 Days / 14 Nights',
  makkahNights: 8,
  madinahNights: 7,
  hotelRating: 5,
  flightType: 'Direct'
};

const BookingPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get booking details from navigation state
  const bookingDetails = location.state || {
    date: '2024-03-15',
    travelers: 2
  };

  const [currentStep, setCurrentStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [bookingReference, setBookingReference] = useState('');

  // Form data
  const [travelers, setTravelers] = useState(
    Array.from({ length: bookingDetails.travelers }, (_, i) => ({
      id: i + 1,
      title: '',
      firstName: '',
      lastName: '',
      dateOfBirth: '',
      passportNumber: '',
      passportExpiry: '',
      nationality: 'India',
      gender: ''
    }))
  );

  const [contactInfo, setContactInfo] = useState({
    email: '',
    phone: '',
    alternatePhone: '',
    address: '',
    city: '',
    state: '',
    pincode: ''
  });

  const [paymentMethod, setPaymentMethod] = useState('card');
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: ''
  });

  const [upiId, setUpiId] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);

  const steps = [
    { number: 1, title: 'Traveler Details', icon: <UserIcon /> },
    { number: 2, title: 'Contact Information', icon: <EmailIcon /> },
    { number: 3, title: 'Payment', icon: <CreditCardIcon /> },
    { number: 4, title: 'Confirmation', icon: <ConfirmIcon /> }
  ];

  // Calculate total price
  const totalPrice = mockPackage.price * bookingDetails.travelers;
  const gst = totalPrice * 0.05; // 5% GST
  const finalTotal = totalPrice + gst;

  // Handle traveler input change
  const handleTravelerChange = (index, field, value) => {
    const updatedTravelers = [...travelers];
    updatedTravelers[index][field] = value;
    setTravelers(updatedTravelers);
  };

  // Handle contact info change
  const handleContactChange = (field, value) => {
    setContactInfo({ ...contactInfo, [field]: value });
  };

  // Validate current step
  const validateStep = () => {
    if (currentStep === 1) {
      // Validate traveler details
      return travelers.every(t => 
        t.title && t.firstName && t.lastName && t.dateOfBirth && 
        t.passportNumber && t.passportExpiry && t.gender
      );
    } else if (currentStep === 2) {
      // Validate contact info
      return contactInfo.email && contactInfo.phone && 
             contactInfo.address && contactInfo.city && 
             contactInfo.state && contactInfo.pincode;
    } else if (currentStep === 3) {
      // Validate payment
      if (paymentMethod === 'card') {
        return cardDetails.cardNumber && cardDetails.cardName && 
               cardDetails.expiryDate && cardDetails.cvv && agreeTerms;
      } else if (paymentMethod === 'upi') {
        return upiId && agreeTerms;
      }
      return agreeTerms;
    }
    return true;
  };

  // Handle next step
  const handleNext = () => {
    if (validateStep()) {
      if (currentStep < 4) {
        setCurrentStep(currentStep + 1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } else {
      alert('Please fill all required fields');
    }
  };

  // Handle previous step
  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Handle payment submission
  const handlePayment = async () => {
    if (!validateStep()) {
      alert('Please fill all required fields and accept terms');
      return;
    }

    setIsProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      const reference = 'UC' + Date.now().toString().slice(-8);
      setBookingReference(reference);
      setBookingConfirmed(true);
      setCurrentStep(4);
      setIsProcessing(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 3000);
  };

  // Handle download invoice
  const handleDownloadInvoice = () => {
    alert('Invoice download started...');
  };

  // Handle print invoice
  const handlePrintInvoice = () => {
    window.print();
  };

  return (
    <div className="booking-page">
      {/* Progress Steps */}
      <div className="booking-progress">
        <div className="progress-container">
          {steps.map((step, index) => (
            <React.Fragment key={step.number}>
              <div className={`progress-step ${currentStep >= step.number ? 'active' : ''} ${currentStep > step.number ? 'completed' : ''}`}>
                <div className="step-icon">
                  {currentStep > step.number ? <CheckIcon /> : step.icon}
                </div>
                <div className="step-info">
                  <div className="step-number">Step {step.number}</div>
                  <div className="step-title">{step.title}</div>
                </div>
              </div>
              {index < steps.length - 1 && (
                <div className={`progress-line ${currentStep > step.number ? 'completed' : ''}`} />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      <div className="booking-container">
        {/* Main Content */}
        <div className="booking-content">
          {/* Step 1: Traveler Details */}
          {currentStep === 1 && (
            <div className="booking-step">
              <h2>Traveler Details</h2>
              <p className="step-description">Please provide details for all travelers</p>

              {travelers.map((traveler, index) => (
                <div key={traveler.id} className="traveler-form">
                  <h3>Traveler {index + 1}</h3>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label>Title *</label>
                      <select
                        value={traveler.title}
                        onChange={(e) => handleTravelerChange(index, 'title', e.target.value)}
                        required
                      >
                        <option value="">Select</option>
                        <option value="Mr">Mr</option>
                        <option value="Mrs">Mrs</option>
                        <option value="Ms">Ms</option>
                        <option value="Dr">Dr</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label>First Name *</label>
                      <input
                        type="text"
                        value={traveler.firstName}
                        onChange={(e) => handleTravelerChange(index, 'firstName', e.target.value)}
                        placeholder="As per passport"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>Last Name *</label>
                      <input
                        type="text"
                        value={traveler.lastName}
                        onChange={(e) => handleTravelerChange(index, 'lastName', e.target.value)}
                        placeholder="As per passport"
                        required
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Date of Birth *</label>
                      <input
                        type="date"
                        value={traveler.dateOfBirth}
                        onChange={(e) => handleTravelerChange(index, 'dateOfBirth', e.target.value)}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>Gender *</label>
                      <select
                        value={traveler.gender}
                        onChange={(e) => handleTravelerChange(index, 'gender', e.target.value)}
                        required
                      >
                        <option value="">Select</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label>Nationality *</label>
                      <select
                        value={traveler.nationality}
                        onChange={(e) => handleTravelerChange(index, 'nationality', e.target.value)}
                        required
                      >
                        <option value="India">India</option>
                        <option value="Pakistan">Pakistan</option>
                        <option value="Bangladesh">Bangladesh</option>
                        <option value="UAE">UAE</option>
                        <option value="USA">USA</option>
                        <option value="UK">UK</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Passport Number *</label>
                      <input
                        type="text"
                        value={traveler.passportNumber}
                        onChange={(e) => handleTravelerChange(index, 'passportNumber', e.target.value)}
                        placeholder="Enter passport number"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>Passport Expiry Date *</label>
                      <input
                        type="date"
                        value={traveler.passportExpiry}
                        onChange={(e) => handleTravelerChange(index, 'passportExpiry', e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="info-note">
                    <AlertIcon />
                    <span>Passport must be valid for at least 6 months from travel date</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Step 2: Contact Information */}
          {currentStep === 2 && (
            <div className="booking-step">
              <h2>Contact Information</h2>
              <p className="step-description">We'll send booking confirmation to these details</p>

              <div className="contact-form">
                <h3>Primary Contact</h3>
                
                <div className="form-row">
                  <div className="form-group">
                    <label>Email Address *</label>
                    <input
                      type="email"
                      value={contactInfo.email}
                      onChange={(e) => handleContactChange('email', e.target.value)}
                      placeholder="your.email@example.com"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Phone Number *</label>
                    <input
                      type="tel"
                      value={contactInfo.phone}
                      onChange={(e) => handleContactChange('phone', e.target.value)}
                      placeholder="+91 98765 43210"
                      required
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Alternate Phone</label>
                    <input
                      type="tel"
                      value={contactInfo.alternatePhone}
                      onChange={(e) => handleContactChange('alternatePhone', e.target.value)}
                      placeholder="+91 98765 43210"
                    />
                  </div>
                </div>

                <h3>Address Details</h3>

                <div className="form-group">
                  <label>Complete Address *</label>
                  <textarea
                    value={contactInfo.address}
                    onChange={(e) => handleContactChange('address', e.target.value)}
                    placeholder="House/Flat No., Street, Area"
                    rows="3"
                    required
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>City *</label>
                    <input
                      type="text"
                      value={contactInfo.city}
                      onChange={(e) => handleContactChange('city', e.target.value)}
                      placeholder="Enter city"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>State *</label>
                    <input
                      type="text"
                      value={contactInfo.state}
                      onChange={(e) => handleContactChange('state', e.target.value)}
                      placeholder="Enter state"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>PIN Code *</label>
                    <input
                      type="text"
                      value={contactInfo.pincode}
                      onChange={(e) => handleContactChange('pincode', e.target.value)}
                      placeholder="123456"
                      required
                    />
                  </div>
                </div>

                <div className="info-note">
                  <AlertIcon />
                  <span>All booking documents will be sent to the email address provided</span>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Payment */}
          {currentStep === 3 && !bookingConfirmed && (
            <div className="booking-step">
              <h2>Payment Details</h2>
              <p className="step-description">Choose your preferred payment method</p>

              {/* Payment Methods */}
              <div className="payment-methods">
                <div
                  className={`payment-method ${paymentMethod === 'card' ? 'active' : ''}`}
                  onClick={() => setPaymentMethod('card')}
                >
                  <CreditCardIcon />
                  <span>Credit/Debit Card</span>
                </div>
                <div
                  className={`payment-method ${paymentMethod === 'upi' ? 'active' : ''}`}
                  onClick={() => setPaymentMethod('upi')}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>UPI</span>
                </div>
                <div
                  className={`payment-method ${paymentMethod === 'netbanking' ? 'active' : ''}`}
                  onClick={() => setPaymentMethod('netbanking')}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  <span>Net Banking</span>
                </div>
              </div>

              {/* Card Payment Form */}
              {paymentMethod === 'card' && (
                <div className="payment-form">
                  <div className="form-group">
                    <label>Card Number *</label>
                    <input
                      type="text"
                      value={cardDetails.cardNumber}
                      onChange={(e) => setCardDetails({ ...cardDetails, cardNumber: e.target.value })}
                      placeholder="1234 5678 9012 3456"
                      maxLength="19"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Cardholder Name *</label>
                    <input
                      type="text"
                      value={cardDetails.cardName}
                      onChange={(e) => setCardDetails({ ...cardDetails, cardName: e.target.value })}
                      placeholder="Name on card"
                      required
                    />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Expiry Date *</label>
                      <input
                        type="text"
                        value={cardDetails.expiryDate}
                        onChange={(e) => setCardDetails({ ...cardDetails, expiryDate: e.target.value })}
                        placeholder="MM/YY"
                        maxLength="5"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>CVV *</label>
                      <input
                        type="password"
                        value={cardDetails.cvv}
                        onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value })}
                        placeholder="123"
                        maxLength="3"
                        required
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* UPI Payment Form */}
              {paymentMethod === 'upi' && (
                <div className="payment-form">
                  <div className="form-group">
                    <label>UPI ID *</label>
                    <input
                      type="text"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      placeholder="yourname@upi"
                      required
                    />
                  </div>
                  <div className="upi-apps">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/e/e1/Google_Pay_Logo_%282020%29.svg" alt="Google Pay" />
                    <img src="https://upload.wikimedia.org/wikipedia/commons/4/4c/PhonePe_Logo.svg" alt="PhonePe" />
                    <img src="https://upload.wikimedia.org/wikipedia/commons/7/71/Paytm_logo.svg" alt="Paytm" />
                  </div>
                </div>
              )}

              {/* Net Banking */}
              {paymentMethod === 'netbanking' && (
                <div className="payment-form">
                  <div className="form-group">
                    <label>Select Bank *</label>
                    <select required>
                      <option value="">Choose your bank</option>
                      <option value="sbi">State Bank of India</option>
                      <option value="hdfc">HDFC Bank</option>
                      <option value="icici">ICICI Bank</option>
                      <option value="axis">Axis Bank</option>
                      <option value="pnb">Punjab National Bank</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Security Badge */}
              <div className="security-badge">
                <LockIcon />
                <div>
                  <strong>Secure Payment</strong>
                  <p>Your payment information is encrypted and secure</p>
                </div>
              </div>

              {/* Terms & Conditions */}
              <div className="terms-checkbox">
                <input
                  type="checkbox"
                  id="terms"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                />
                <label htmlFor="terms">
                  I agree to the <a href="/terms">Terms & Conditions</a> and <a href="/privacy">Privacy Policy</a>
                </label>
              </div>
            </div>
          )}

          {/* Step 4: Confirmation */}
          {currentStep === 4 && bookingConfirmed && (
            <div className="booking-step confirmation-step">
              <div className="success-icon">
                <CheckIcon />
              </div>
              <h2>Booking Confirmed!</h2>
              <p className="confirmation-message">
                Your Umrah package has been successfully booked. We've sent a confirmation email to {contactInfo.email}
              </p>

              <div className="booking-reference">
                <span className="reference-label">Booking Reference</span>
                <span className="reference-number">{bookingReference}</span>
              </div>

              <div className="confirmation-details">
                <h3>Booking Summary</h3>
                
                <div className="detail-row">
                  <span className="detail-label">Package</span>
                  <span className="detail-value">{mockPackage.name}</span>
                </div>

                <div className="detail-row">
                  <span className="detail-label">Vendor</span>
                  <span className="detail-value">{mockPackage.vendor}</span>
                </div>

                <div className="detail-row">
                  <span className="detail-label">Departure Date</span>
                  <span className="detail-value">{new Date(bookingDetails.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </div>

                <div className="detail-row">
                  <span className="detail-label">Travelers</span>
                  <span className="detail-value">{bookingDetails.travelers} Person(s)</span>
                </div>

                <div className="detail-row">
                  <span className="detail-label">Duration</span>
                  <span className="detail-value">{mockPackage.duration}</span>
                </div>

                <div className="detail-row total">
                  <span className="detail-label">Total Amount Paid</span>
                  <span className="detail-value">₹{finalTotal.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <div className="confirmation-actions">
                <button className="btn-download" onClick={handleDownloadInvoice}>
                  <DownloadIcon />
                  Download Invoice
                </button>
                <button className="btn-print" onClick={handlePrintInvoice}>
                  <PrintIcon />
                  Print Invoice
                </button>
              </div>

              <div className="next-steps">
                <h3>What's Next?</h3>
                <ul>
                  <li>✓ Check your email for booking confirmation and invoice</li>
                  <li>✓ Our team will contact you within 24 hours for visa processing</li>
                  <li>✓ You'll receive flight details 7 days before departure</li>
                  <li>✓ Download the UmrahConnect app for travel updates</li>
                </ul>
              </div>

              <button className="btn-primary" onClick={() => navigate('/dashboard')}>
                Go to My Bookings
              </button>
            </div>
          )}

          {/* Navigation Buttons */}
          {currentStep < 4 && (
            <div className="step-navigation">
              {currentStep > 1 && (
                <button className="btn-secondary" onClick={handlePrevious}>
                  Previous
                </button>
              )}
              {currentStep < 3 && (
                <button className="btn-primary" onClick={handleNext}>
                  Continue
                </button>
              )}
              {currentStep === 3 && (
                <button 
                  className="btn-primary" 
                  onClick={handlePayment}
                  disabled={isProcessing}
                >
                  {isProcessing ? 'Processing...' : `Pay ₹${finalTotal.toLocaleString('en-IN')}`}
                </button>
              )}
            </div>
          )}
        </div>

        {/* Booking Summary Sidebar */}
        {currentStep < 4 && (
          <div className="booking-sidebar">
            <div className="summary-card">
              <h3>Booking Summary</h3>

              <div className="package-preview">
                <img src={mockPackage.image} alt={mockPackage.name} />
                <div className="package-info">
                  <h4>{mockPackage.name}</h4>
                  <p>{mockPackage.vendor}</p>
                </div>
              </div>

              <div className="summary-details">
                <div className="summary-item">
                  <CalendarIcon />
                  <div>
                    <span className="item-label">Departure Date</span>
                    <span className="item-value">
                      {new Date(bookingDetails.date).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </span>
                  </div>
                </div>

                <div className="summary-item">
                  <UsersIcon />
                  <div>
                    <span className="item-label">Travelers</span>
                    <span className="item-value">{bookingDetails.travelers} Person(s)</span>
                  </div>
                </div>

                <div className="summary-item">
                  <CalendarIcon />
                  <div>
                    <span className="item-label">Duration</span>
                    <span className="item-value">{mockPackage.duration}</span>
                  </div>
                </div>
              </div>

              <div className="price-breakdown">
                <div className="price-row">
                  <span>Package Price (per person)</span>
                  <span>₹{mockPackage.price.toLocaleString('en-IN')}</span>
                </div>
                <div className="price-row">
                  <span>Number of Travelers</span>
                  <span>× {bookingDetails.travelers}</span>
                </div>
                <div className="price-row subtotal">
                  <span>Subtotal</span>
                  <span>₹{totalPrice.toLocaleString('en-IN')}</span>
                </div>
                <div className="price-row">
                  <span>GST (5%)</span>
                  <span>₹{gst.toLocaleString('en-IN')}</span>
                </div>
                <div className="price-row total">
                  <span>Total Amount</span>
                  <span>₹{finalTotal.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <div className="trust-badges">
                <div className="badge">
                  <CheckIcon />
                  <span>Instant Confirmation</span>
                </div>
                <div className="badge">
                  <LockIcon />
                  <span>Secure Payment</span>
                </div>
                <div className="badge">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <span>100% Refund</span>
                </div>
              </div>
            </div>

            <div className="help-card">
              <h4>Need Help?</h4>
              <p>Our support team is available 24/7</p>
              <a href="tel:+918800123456" className="help-link">
                <PhoneIcon />
                +91 88001 23456
              </a>
              <a href="mailto:support@umrahconnect.com" className="help-link">
                <EmailIcon />
                support@umrahconnect.com
              </a>
            </div>
          </div>
        )}
      </div>

      {/* Processing Overlay */}
      {isProcessing && (
        <div className="processing-overlay">
          <div className="processing-content">
            <div className="spinner"></div>
            <h3>Processing Your Payment</h3>
            <p>Please wait while we confirm your booking...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingPage;
