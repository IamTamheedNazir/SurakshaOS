import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import useAuthStore from '../../store/authStore';
import './RegisterPage.css';

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register: registerUser, isLoading } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [userType, setUserType] = useState('pilgrim');

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const password = watch('password');

  const onSubmit = async (data) => {
    const { confirmPassword, ...userData } = data;
    userData.userType = userType;

    const result = await registerUser(userData);
    
    if (result.success) {
      navigate('/dashboard');
    }
  };

  return (
    <div className="register-page">
      <div className="register-container">
        {/* Left Side - Info */}
        <div className="register-info-section islamic-pattern">
          <div className="register-info-content">
            <div className="info-icon">🕌</div>
            <h2 className="info-title">Join UmrahConnect.in</h2>
            <p className="info-description">
              India's most trusted Umrah marketplace with 25,000+ satisfied pilgrims
            </p>

            <div className="info-benefits">
              <h3 className="benefits-title">Why Choose Us?</h3>
              <div className="benefit-item">
                <span className="benefit-icon">✓</span>
                <div>
                  <strong>500+ Verified Vendors</strong>
                  <p>All vendors are government verified and trusted</p>
                </div>
              </div>
              <div className="benefit-item">
                <span className="benefit-icon">✓</span>
                <div>
                  <strong>Flexible Payments</strong>
                  <p>Book with just 10% and pay in installments</p>
                </div>
              </div>
              <div className="benefit-item">
                <span className="benefit-icon">✓</span>
                <div>
                  <strong>Real-time Tracking</strong>
                  <p>Track your visa and booking status 24/7</p>
                </div>
              </div>
              <div className="benefit-item">
                <span className="benefit-icon">✓</span>
                <div>
                  <strong>24/7 Support</strong>
                  <p>WhatsApp, email, and phone support always available</p>
                </div>
              </div>
            </div>

            {/* Islamic Quote */}
            <div className="info-quote">
              <p className="arabic-text">
                ﴿ وَأَتِمُّوا الْحَجَّ وَالْعُمْرَةَ لِلَّهِ ﴾
              </p>
              <p className="quote-translation">
                "And complete the Hajj and Umrah for Allah" - Quran 2:196
              </p>
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="register-form-section">
          <div className="register-form-content">
            {/* Logo */}
            <Link to="/" className="register-logo">
              <span className="logo-icon">☪️</span>
              <div className="logo-text">
                <span className="logo-main">UmrahConnect</span>
                <span className="logo-version">.in</span>
              </div>
            </Link>

            {/* Header */}
            <div className="register-header">
              <h1 className="register-title">Create Account</h1>
              <p className="register-subtitle">
                Start your sacred journey with us
              </p>
            </div>

            {/* User Type Selection */}
            <div className="user-type-selector">
              <button
                type="button"
                className={`user-type-btn ${userType === 'pilgrim' ? 'active' : ''}`}
                onClick={() => setUserType('pilgrim')}
              >
                <span className="type-icon">👤</span>
                <span>I'm a Pilgrim</span>
              </button>
              <button
                type="button"
                className={`user-type-btn ${userType === 'vendor' ? 'active' : ''}`}
                onClick={() => setUserType('vendor')}
              >
                <span className="type-icon">💼</span>
                <span>I'm a Vendor</span>
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="register-form">
              {/* Name Fields */}
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="firstName" className="form-label form-label-required">
                    First Name
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    className={`form-input ${errors.firstName ? 'error' : ''}`}
                    placeholder="Enter first name"
                    {...register('firstName', {
                      required: 'First name is required',
                      minLength: {
                        value: 2,
                        message: 'First name must be at least 2 characters',
                      },
                    })}
                  />
                  {errors.firstName && (
                    <span className="form-error">{errors.firstName.message}</span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="lastName" className="form-label form-label-required">
                    Last Name
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    className={`form-input ${errors.lastName ? 'error' : ''}`}
                    placeholder="Enter last name"
                    {...register('lastName', {
                      required: 'Last name is required',
                      minLength: {
                        value: 2,
                        message: 'Last name must be at least 2 characters',
                      },
                    })}
                  />
                  {errors.lastName && (
                    <span className="form-error">{errors.lastName.message}</span>
                  )}
                </div>
              </div>

              {/* Email */}
              <div className="form-group">
                <label htmlFor="email" className="form-label form-label-required">
                  📧 Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  className={`form-input ${errors.email ? 'error' : ''}`}
                  placeholder="Enter your email"
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address',
                    },
                  })}
                />
                {errors.email && (
                  <span className="form-error">{errors.email.message}</span>
                )}
              </div>

              {/* Phone */}
              <div className="form-group">
                <label htmlFor="phone" className="form-label form-label-required">
                  📱 Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  className={`form-input ${errors.phone ? 'error' : ''}`}
                  placeholder="Enter 10-digit mobile number"
                  {...register('phone', {
                    required: 'Phone number is required',
                    pattern: {
                      value: /^[6-9]\d{9}$/,
                      message: 'Invalid Indian mobile number',
                    },
                  })}
                />
                {errors.phone && (
                  <span className="form-error">{errors.phone.message}</span>
                )}
              </div>

              {/* Password */}
              <div className="form-group">
                <label htmlFor="password" className="form-label form-label-required">
                  🔒 Password
                </label>
                <div className="password-input-wrapper">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    className={`form-input ${errors.password ? 'error' : ''}`}
                    placeholder="Create a strong password"
                    {...register('password', {
                      required: 'Password is required',
                      minLength: {
                        value: 8,
                        message: 'Password must be at least 8 characters',
                      },
                      pattern: {
                        value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                        message: 'Password must contain uppercase, lowercase, and number',
                      },
                    })}
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? '👁️' : '👁️‍🗨️'}
                  </button>
                </div>
                {errors.password && (
                  <span className="form-error">{errors.password.message}</span>
                )}
              </div>

              {/* Confirm Password */}
              <div className="form-group">
                <label htmlFor="confirmPassword" className="form-label form-label-required">
                  🔒 Confirm Password
                </label>
                <div className="password-input-wrapper">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    id="confirmPassword"
                    className={`form-input ${errors.confirmPassword ? 'error' : ''}`}
                    placeholder="Re-enter your password"
                    {...register('confirmPassword', {
                      required: 'Please confirm your password',
                      validate: (value) =>
                        value === password || 'Passwords do not match',
                    })}
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <span className="form-error">{errors.confirmPassword.message}</span>
                )}
              </div>

              {/* Terms & Conditions */}
              <div className="form-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    className="form-checkbox"
                    {...register('terms', {
                      required: 'You must accept the terms and conditions',
                    })}
                  />
                  <span>
                    I agree to the{' '}
                    <Link to="/terms" target="_blank">Terms & Conditions</Link>
                    {' '}and{' '}
                    <Link to="/privacy" target="_blank">Privacy Policy</Link>
                  </span>
                </label>
                {errors.terms && (
                  <span className="form-error">{errors.terms.message}</span>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="btn btn-primary btn-lg"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="spinner"></span>
                    Creating Account...
                  </>
                ) : (
                  <>
                    <span>🚀</span>
                    Create Account
                  </>
                )}
              </button>
            </form>

            {/* Login Link */}
            <div className="register-footer">
              <p>
                Already have an account?{' '}
                <Link to="/login" className="login-link">
                  Sign In
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
