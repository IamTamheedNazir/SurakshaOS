import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react';
import './ForgotPasswordPage.css';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validation
    if (!email.trim()) {
      setError('Please enter your email address');
      setLoading(false);
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address');
      setLoading(false);
      return;
    }

    try {
      // TODO: Replace with actual API call
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to send reset email');
      }

      setSuccess(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="forgot-password-page">
        <div className="forgot-password-container">
          <div className="success-card">
            <div className="success-icon">
              <CheckCircle size={64} />
            </div>
            <h2 className="success-title">Check Your Email</h2>
            <p className="success-message">
              We've sent a password reset link to <strong>{email}</strong>
            </p>
            <p className="success-instructions">
              Click the link in the email to reset your password. The link will expire in 1 hour.
            </p>
            <div className="success-actions">
              <Link to="/login" className="back-to-login-btn">
                <ArrowLeft size={20} />
                <span>Back to Login</span>
              </Link>
              <button 
                onClick={() => {
                  setSuccess(false);
                  setEmail('');
                }}
                className="resend-btn"
              >
                Resend Email
              </button>
            </div>
            <div className="help-text">
              <p>Didn't receive the email? Check your spam folder or try again.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="forgot-password-page">
      <div className="forgot-password-container">
        <div className="forgot-password-card">
          {/* Header */}
          <div className="forgot-password-header">
            <div className="logo">
              <div className="logo-icon">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2L2 7v10l10 5 10-5V7L12 2zm0 2.18L18.36 7 12 9.82 5.64 7 12 4.18zM4 8.27l7 3.5v7.96l-7-3.5V8.27zm9 11.46v-7.96l7-3.5v7.96l-7 3.5z" />
                </svg>
              </div>
              <div className="logo-text">
                <span className="logo-main">
                  Umrah<span className="logo-highlight">Connect</span>
                </span>
              </div>
            </div>

            <h2 className="page-title">Forgot Password?</h2>
            <p className="page-subtitle">
              No worries! Enter your email address and we'll send you a link to reset your password.
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="error-message">
              <AlertCircle size={20} />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="forgot-password-form">
            <div className="form-group">
              <label htmlFor="email" className="form-label">Email Address</label>
              <div className="input-wrapper">
                <Mail size={20} className="input-icon" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError('');
                  }}
                  placeholder="Enter your email"
                  className="form-input"
                  required
                />
              </div>
            </div>

            <button 
              type="submit" 
              className="submit-btn"
              disabled={loading}
            >
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>
          </form>

          {/* Footer */}
          <div className="forgot-password-footer">
            <Link to="/login" className="back-link">
              <ArrowLeft size={16} />
              <span>Back to Login</span>
            </Link>
          </div>

          {/* Help Text */}
          <div className="help-section">
            <p className="help-title">Need help?</p>
            <p className="help-text">
              If you're having trouble resetting your password, please contact our support team at{' '}
              <a href="mailto:support@umrahconnect.com" className="help-link">
                support@umrahconnect.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
