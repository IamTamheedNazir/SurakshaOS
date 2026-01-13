import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  User, 
  Phone, 
  MapPin,
  AlertCircle,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
} from 'lucide-react';
import './RegisterPage.css';

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register, loginWithGoogle, loginWithFacebook, error: authError } = useAuth();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Step 1: Basic Info
    fullName: '',
    email: '',
    phone: '',
    
    // Step 2: Password
    password: '',
    confirmPassword: '',
    
    // Step 3: Additional Info
    city: '',
    state: '',
    country: 'India',
    userType: 'pilgrim', // pilgrim or vendor
    
    // Terms
    agreeToTerms: false,
    agreeToMarketing: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [passwordStrength, setPasswordStrength] = useState(0);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
    
    // Clear error for this field
    setErrors({
      ...errors,
      [name]: '',
    });

    // Check password strength
    if (name === 'password') {
      checkPasswordStrength(value);
    }
  };

  const checkPasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.match(/[a-z]/) && password.match(/[A-Z]/)) strength++;
    if (password.match(/[0-9]/)) strength++;
    if (password.match(/[^a-zA-Z0-9]/)) strength++;
    setPasswordStrength(strength);
  };

  const validateStep1 = () => {
    const newErrors = {};
    
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^[0-9]{10}$/.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Phone number must be 10 digits';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors = {};
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep3 = () => {
    const newErrors = {};
    
    if (!formData.city.trim()) {
      newErrors.city = 'City is required';
    }
    
    if (!formData.state.trim()) {
      newErrors.state = 'State is required';
    }
    
    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = 'You must agree to the terms and conditions';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    let isValid = false;
    
    if (currentStep === 1) {
      isValid = validateStep1();
    } else if (currentStep === 2) {
      isValid = validateStep2();
    }
    
    if (isValid) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateStep3()) {
      return;
    }
    
    setLoading(true);
    
    const result = await register(formData);
    
    if (result.success) {
      navigate('/dashboard');
    } else {
      setErrors({ submit: result.error || 'Registration failed. Please try again.' });
    }
    
    setLoading(false);
  };

  const getPasswordStrengthText = () => {
    switch (passwordStrength) {
      case 0:
      case 1:
        return { text: 'Weak', color: '#ef4444' };
      case 2:
        return { text: 'Fair', color: '#f59e0b' };
      case 3:
        return { text: 'Good', color: '#10b981' };
      case 4:
        return { text: 'Strong', color: '#0f6b3f' };
      default:
        return { text: '', color: '' };
    }
  };

  const handleGoogleSignup = () => {
    loginWithGoogle();
  };

  const handleFacebookSignup = () => {
    loginWithFacebook();
  };

  const renderStepIndicator = () => (
    <div className="step-indicator">
      <div className={`step ${currentStep >= 1 ? 'active' : ''} ${currentStep > 1 ? 'completed' : ''}`}>
        <div className="step-number">
          {currentStep > 1 ? <CheckCircle size={20} /> : '1'}
        </div>
        <div className="step-label">Basic Info</div>
      </div>
      <div className="step-line"></div>
      <div className={`step ${currentStep >= 2 ? 'active' : ''} ${currentStep > 2 ? 'completed' : ''}`}>
        <div className="step-number">
          {currentStep > 2 ? <CheckCircle size={20} /> : '2'}
        </div>
        <div className="step-label">Password</div>
      </div>
      <div className="step-line"></div>
      <div className={`step ${currentStep >= 3 ? 'active' : ''}`}>
        <div className="step-number">3</div>
        <div className="step-label">Details</div>
      </div>
    </div>
  );

  return (
    <div className="register-page">
      <div className="register-container">
        {/* Left Side - Branding */}
        <div className="register-branding">
          <div className="branding-content">
            <div className="branding-logo">
              <div className="branding-logo-icon">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2L2 7v10l10 5 10-5V7L12 2zm0 2.18L18.36 7 12 9.82 5.64 7 12 4.18zM4 8.27l7 3.5v7.96l-7-3.5V8.27zm9 11.46v-7.96l7-3.5v7.96l-7 3.5z" />
                </svg>
              </div>
              <div className="branding-logo-text">
                <span className="branding-logo-main">
                  Umrah<span className="branding-logo-highlight">Connect</span>
                </span>
              </div>
            </div>

            <h1 className="branding-title">Join UmrahConnect</h1>
            <p className="branding-subtitle">
              Create your account and start your spiritual journey with India's most trusted pilgrimage marketplace
            </p>

            <div className="branding-stats">
              <div className="stat-item">
                <div className="stat-number">50K+</div>
                <div className="stat-label">Happy Pilgrims</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">500+</div>
                <div className="stat-label">Verified Vendors</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">4.9★</div>
                <div className="stat-label">Average Rating</div>
              </div>
            </div>

            <div className="branding-benefits">
              <h3>Why Choose UmrahConnect?</h3>
              <ul>
                <li>
                  <CheckCircle size={20} />
                  <span>Compare packages from 500+ verified vendors</span>
                </li>
                <li>
                  <CheckCircle size={20} />
                  <span>Transparent pricing with no hidden charges</span>
                </li>
                <li>
                  <CheckCircle size={20} />
                  <span>24/7 customer support in multiple languages</span>
                </li>
                <li>
                  <CheckCircle size={20} />
                  <span>Secure payment gateway with SSL encryption</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Right Side - Registration Form */}
        <div className="register-form-section">
          <div className="register-form-container">
            <div className="register-header">
              <h2 className="register-title">Create Account</h2>
              <p className="register-subtitle">
                Already have an account? <Link to="/login" className="register-link">Sign in</Link>
              </p>
            </div>

            {/* Step Indicator */}
            {renderStepIndicator()}

            {/* Error Message */}
            {(errors.submit || authError) && (
              <div className="register-error">
                <AlertCircle size={20} />
                <span>{errors.submit || authError}</span>
              </div>
            )}

            {/* Social Signup (Only on Step 1) */}
            {currentStep === 1 && (
              <>
                <div className="social-signup">
                  <button 
                    type="button" 
                    className="social-btn social-btn-google"
                    onClick={handleGoogleSignup}
                  >
                    <svg viewBox="0 0 24 24" width="20" height="20">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    <span>Sign up with Google</span>
                  </button>

                  <button 
                    type="button" 
                    className="social-btn social-btn-facebook"
                    onClick={handleFacebookSignup}
                  >
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="#1877F2">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                    <span>Sign up with Facebook</span>
                  </button>
                </div>

                <div className="divider">
                  <span>or sign up with email</span>
                </div>
              </>
            )}

            {/* Multi-Step Form */}
            <form onSubmit={handleSubmit} className="register-form">
              {/* Step 1: Basic Info */}
              {currentStep === 1 && (
                <div className="form-step">
                  <div className="form-group">
                    <label htmlFor="fullName" className="form-label">Full Name *</label>
                    <div className="input-wrapper">
                      <User size={20} className="input-icon" />
                      <input
                        type="text"
                        id="fullName"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        placeholder="Enter your full name"
                        className={`form-input ${errors.fullName ? 'error' : ''}`}
                      />
                    </div>
                    {errors.fullName && <span className="error-text">{errors.fullName}</span>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="email" className="form-label">Email Address *</label>
                    <div className="input-wrapper">
                      <Mail size={20} className="input-icon" />
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Enter your email"
                        className={`form-input ${errors.email ? 'error' : ''}`}
                      />
                    </div>
                    {errors.email && <span className="error-text">{errors.email}</span>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="phone" className="form-label">Phone Number *</label>
                    <div className="input-wrapper">
                      <Phone size={20} className="input-icon" />
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="Enter your phone number"
                        className={`form-input ${errors.phone ? 'error' : ''}`}
                      />
                    </div>
                    {errors.phone && <span className="error-text">{errors.phone}</span>}
                  </div>

                  <button type="button" onClick={handleNext} className="next-btn">
                    <span>Continue</span>
                    <ArrowRight size={20} />
                  </button>
                </div>
              )}

              {/* Step 2: Password */}
              {currentStep === 2 && (
                <div className="form-step">
                  <div className="form-group">
                    <label htmlFor="password" className="form-label">Password *</label>
                    <div className="input-wrapper">
                      <Lock size={20} className="input-icon" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Create a strong password"
                        className={`form-input ${errors.password ? 'error' : ''}`}
                      />
                      <button
                        type="button"
                        className="password-toggle"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                    {errors.password && <span className="error-text">{errors.password}</span>}
                    
                    {formData.password && (
                      <div className="password-strength">
                        <div className="strength-bars">
                          {[1, 2, 3, 4].map((level) => (
                            <div
                              key={level}
                              className={`strength-bar ${passwordStrength >= level ? 'active' : ''}`}
                              style={{
                                backgroundColor: passwordStrength >= level ? getPasswordStrengthText().color : ''
                              }}
                            ></div>
                          ))}
                        </div>
                        <span 
                          className="strength-text"
                          style={{ color: getPasswordStrengthText().color }}
                        >
                          {getPasswordStrengthText().text}
                        </span>
                      </div>
                    )}
                    
                    <div className="password-requirements">
                      <p>Password must contain:</p>
                      <ul>
                        <li className={formData.password.length >= 8 ? 'valid' : ''}>
                          At least 8 characters
                        </li>
                        <li className={formData.password.match(/[a-z]/) && formData.password.match(/[A-Z]/) ? 'valid' : ''}>
                          Upper & lowercase letters
                        </li>
                        <li className={formData.password.match(/[0-9]/) ? 'valid' : ''}>
                          At least one number
                        </li>
                        <li className={formData.password.match(/[^a-zA-Z0-9]/) ? 'valid' : ''}>
                          At least one special character
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="confirmPassword" className="form-label">Confirm Password *</label>
                    <div className="input-wrapper">
                      <Lock size={20} className="input-icon" />
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        id="confirmPassword"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        placeholder="Re-enter your password"
                        className={`form-input ${errors.confirmPassword ? 'error' : ''}`}
                      />
                      <button
                        type="button"
                        className="password-toggle"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                    {errors.confirmPassword && <span className="error-text">{errors.confirmPassword}</span>}
                  </div>

                  <div className="form-actions">
                    <button type="button" onClick={handleBack} className="back-btn">
                      <ArrowLeft size={20} />
                      <span>Back</span>
                    </button>
                    <button type="button" onClick={handleNext} className="next-btn">
                      <span>Continue</span>
                      <ArrowRight size={20} />
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: Additional Details */}
              {currentStep === 3 && (
                <div className="form-step">
                  <div className="form-group">
                    <label htmlFor="city" className="form-label">City *</label>
                    <div className="input-wrapper">
                      <MapPin size={20} className="input-icon" />
                      <input
                        type="text"
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        placeholder="Enter your city"
                        className={`form-input ${errors.city ? 'error' : ''}`}
                      />
                    </div>
                    {errors.city && <span className="error-text">{errors.city}</span>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="state" className="form-label">State *</label>
                    <div className="input-wrapper">
                      <MapPin size={20} className="input-icon" />
                      <input
                        type="text"
                        id="state"
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                        placeholder="Enter your state"
                        className={`form-input ${errors.state ? 'error' : ''}`}
                      />
                    </div>
                    {errors.state && <span className="error-text">{errors.state}</span>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="userType" className="form-label">I am a *</label>
                    <select
                      id="userType"
                      name="userType"
                      value={formData.userType}
                      onChange={handleChange}
                      className="form-select"
                    >
                      <option value="pilgrim">Pilgrim (Looking for packages)</option>
                      <option value="vendor">Vendor (Service Provider)</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        name="agreeToTerms"
                        checked={formData.agreeToTerms}
                        onChange={handleChange}
                      />
                      <span>
                        I agree to the{' '}
                        <Link to="/terms" target="_blank" className="checkbox-link">
                          Terms & Conditions
                        </Link>
                        {' '}and{' '}
                        <Link to="/privacy" target="_blank" className="checkbox-link">
                          Privacy Policy
                        </Link>
                        {' '}*
                      </span>
                    </label>
                    {errors.agreeToTerms && <span className="error-text">{errors.agreeToTerms}</span>}
                  </div>

                  <div className="form-group">
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        name="agreeToMarketing"
                        checked={formData.agreeToMarketing}
                        onChange={handleChange}
                      />
                      <span>
                        Send me promotional emails about packages and offers
                      </span>
                    </label>
                  </div>

                  <div className="form-actions">
                    <button type="button" onClick={handleBack} className="back-btn">
                      <ArrowLeft size={20} />
                      <span>Back</span>
                    </button>
                    <button 
                      type="submit" 
                      className="submit-btn"
                      disabled={loading}
                    >
                      {loading ? 'Creating Account...' : 'Create Account'}
                    </button>
                  </div>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
