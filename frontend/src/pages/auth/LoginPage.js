import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import useAuthStore from '../../store/authStore';
import './LoginPage.css';

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isLoading } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const from = location.state?.from?.pathname || '/dashboard';

  const onSubmit = async (data) => {
    const result = await login(data);
    
    if (result.success) {
      navigate(from, { replace: true });
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        {/* Left Side - Form */}
        <div className="login-form-section">
          <div className="login-form-content">
            {/* Logo */}
            <Link to="/" className="login-logo">
              <span className="logo-icon">☪️</span>
              <div className="logo-text">
                <span className="logo-main">UmrahConnect</span>
                <span className="logo-version">.in</span>
              </div>
            </Link>

            {/* Header */}
            <div className="login-header">
              <h1 className="login-title">Welcome Back!</h1>
              <p className="login-subtitle">
                Sign in to continue your sacred journey
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="login-form">
              {/* Email */}
              <div className="form-group">
                <label htmlFor="email" className="form-label">
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

              {/* Password */}
              <div className="form-group">
                <label htmlFor="password" className="form-label">
                  🔒 Password
                </label>
                <div className="password-input-wrapper">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    className={`form-input ${errors.password ? 'error' : ''}`}
                    placeholder="Enter your password"
                    {...register('password', {
                      required: 'Password is required',
                      minLength: {
                        value: 6,
                        message: 'Password must be at least 6 characters',
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

              {/* Remember & Forgot */}
              <div className="form-options">
                <label className="checkbox-label">
                  <input type="checkbox" className="form-checkbox" />
                  <span>Remember me</span>
                </label>
                <Link to="/forgot-password" className="forgot-link">
                  Forgot Password?
                </Link>
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
                    Signing in...
                  </>
                ) : (
                  <>
                    <span>🔓</span>
                    Sign In
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="login-divider">
              <span>or continue with</span>
            </div>

            {/* Social Login */}
            <div className="social-login">
              <button className="social-btn social-btn-google">
                <span>🔵</span>
                Google
              </button>
              <button className="social-btn social-btn-facebook">
                <span>📘</span>
                Facebook
              </button>
            </div>

            {/* Register Link */}
            <div className="login-footer">
              <p>
                Don't have an account?{' '}
                <Link to="/register" className="register-link">
                  Create Account
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* Right Side - Info */}
        <div className="login-info-section islamic-pattern">
          <div className="login-info-content">
            <div className="info-icon">🕌</div>
            <h2 className="info-title">Your Sacred Journey Awaits</h2>
            <p className="info-description">
              Access your bookings, track visa status, manage payments, and get 24/7 support for your pilgrimage.
            </p>

            <div className="info-features">
              <div className="info-feature">
                <span className="feature-icon">✓</span>
                <span>Real-time Booking Management</span>
              </div>
              <div className="info-feature">
                <span className="feature-icon">✓</span>
                <span>7-Stage Visa Tracking</span>
              </div>
              <div className="info-feature">
                <span className="feature-icon">✓</span>
                <span>Flexible Payment Options</span>
              </div>
              <div className="info-feature">
                <span className="feature-icon">✓</span>
                <span>24/7 Customer Support</span>
              </div>
            </div>

            {/* Islamic Quote */}
            <div className="info-quote">
              <p className="arabic-text">
                ﴿ وَأَذِّن فِي النَّاسِ بِالْحَجِّ ﴾
              </p>
              <p className="quote-translation">
                "And proclaim to the people the Hajj" - Quran 22:27
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
