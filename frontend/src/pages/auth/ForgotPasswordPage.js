import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { authAPI } from '../../services/api';
import './ForgotPasswordPage.css';

const ForgotPasswordPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      await authAPI.forgotPassword(data.email);
      setEmailSent(true);
      toast.success('Password reset link sent to your email!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send reset link');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="forgot-password-page">
      <div className="forgot-password-container">
        <div className="forgot-password-card">
          {/* Logo */}
          <Link to="/" className="forgot-logo">
            <span className="logo-icon">☪️</span>
            <div className="logo-text">
              <span className="logo-main">UmrahConnect</span>
              <span className="logo-version">.in</span>
            </div>
          </Link>

          {!emailSent ? (
            <>
              {/* Header */}
              <div className="forgot-header">
                <div className="forgot-icon">🔐</div>
                <h1 className="forgot-title">Forgot Password?</h1>
                <p className="forgot-subtitle">
                  No worries! Enter your email and we'll send you a reset link
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit(onSubmit)} className="forgot-form">
                <div className="form-group">
                  <label htmlFor="email" className="form-label">
                    📧 Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    className={`form-input ${errors.email ? 'error' : ''}`}
                    placeholder="Enter your registered email"
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

                <button
                  type="submit"
                  className="btn btn-primary btn-lg"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <span className="spinner"></span>
                      Sending...
                    </>
                  ) : (
                    <>
                      <span>📧</span>
                      Send Reset Link
                    </>
                  )}
                </button>
              </form>
            </>
          ) : (
            <>
              {/* Success Message */}
              <div className="forgot-success">
                <div className="success-icon">✅</div>
                <h2 className="success-title">Check Your Email!</h2>
                <p className="success-message">
                  We've sent a password reset link to your email address. 
                  Please check your inbox and follow the instructions.
                </p>
                <div className="success-note">
                  <p>
                    <strong>Didn't receive the email?</strong>
                  </p>
                  <ul>
                    <li>Check your spam/junk folder</li>
                    <li>Make sure you entered the correct email</li>
                    <li>Wait a few minutes and try again</li>
                  </ul>
                </div>
              </div>
            </>
          )}

          {/* Back to Login */}
          <div className="forgot-footer">
            <Link to="/login" className="back-link">
              <span>←</span>
              Back to Login
            </Link>
          </div>

          {/* Help */}
          <div className="forgot-help">
            <p>Need help?</p>
            <div className="help-links">
              <a href="mailto:support@umrahconnect.in">📧 Email Support</a>
              <a href="https://wa.me/911800XXXXXXX">💬 WhatsApp</a>
              <a href="tel:+911800XXXXXXX">📞 Call Us</a>
            </div>
          </div>
        </div>

        {/* Islamic Quote */}
        <div className="forgot-quote">
          <p className="arabic-text">
            ﴿ إِنَّ اللَّهَ غَفُورٌ رَحِيمٌ ﴾
          </p>
          <p className="quote-translation">
            "Indeed, Allah is Forgiving and Merciful" - Quran 2:173
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
