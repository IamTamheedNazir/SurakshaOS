import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Lock, Eye, EyeOff, CheckCircle, AlertCircle, ArrowLeft } from 'lucide-react';
import './ResetPasswordPage.css';

const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [tokenValid, setTokenValid] = useState(true);

  useEffect(() => {
    // Verify token on mount
    if (!token) {
      setTokenValid(false);
      setError('Invalid or missing reset token');
    } else {
      verifyToken();
    }
  }, [token]);

  const verifyToken = async () => {
    try {
      const response = await fetch(`/api/auth/verify-reset-token?token=${token}`);
      if (!response.ok) {
        setTokenValid(false);
        setError('This reset link has expired or is invalid');
      }
    } catch (err) {
      setTokenValid(false);
      setError('Failed to verify reset token');
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    setError('');

    if (name === 'password') {
      checkPasswordStrength(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validation
    if (!formData.password) {
      setError('Password is required');
      setLoading(false);
      return;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters');
      setLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to reset password');
      }

      setSuccess(true);
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
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

  if (!tokenValid) {
    return (
      <div className="reset-password-page">
        <div className="reset-password-container">
          <div className="error-card">
            <div className="error-icon">
              <AlertCircle size={64} />
            </div>
            <h2 className="error-title">Invalid Reset Link</h2>
            <p className="error-message">
              This password reset link has expired or is invalid. Please request a new one.
            </p>
            <div className="error-actions">
              <Link to="/forgot-password" className="request-new-btn">
                Request New Link
              </Link>
              <Link to="/login" className="back-to-login-link">
                <ArrowLeft size={16} />
                <span>Back to Login</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="reset-password-page">
        <div className="reset-password-container">
          <div className="success-card">
            <div className="success-icon">
              <CheckCircle size={64} />
            </div>
            <h2 className="success-title">Password Reset Successful!</h2>
            <p className="success-message">
              Your password has been successfully reset. You can now log in with your new password.
            </p>
            <p className="redirect-message">
              Redirecting to login page in 3 seconds...
            </p>
            <Link to="/login" className="login-now-btn">
              Login Now
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="reset-password-page">
      <div className="reset-password-container">
        <div className="reset-password-card">
          {/* Header */}
          <div className="reset-password-header">
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

            <h2 className="page-title">Reset Password</h2>
            <p className="page-subtitle">
              Enter your new password below. Make sure it's strong and secure.
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
          <form onSubmit={handleSubmit} className="reset-password-form">
            <div className="form-group">
              <label htmlFor="password" className="form-label">New Password *</label>
              <div className="input-wrapper">
                <Lock size={20} className="input-icon" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create a strong password"
                  className="form-input"
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

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
              <label htmlFor="confirmPassword" className="form-label">Confirm New Password *</label>
              <div className="input-wrapper">
                <Lock size={20} className="input-icon" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Re-enter your password"
                  className="form-input"
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <button 
              type="submit" 
              className="submit-btn"
              disabled={loading}
            >
              {loading ? 'Resetting Password...' : 'Reset Password'}
            </button>
          </form>

          {/* Footer */}
          <div className="reset-password-footer">
            <Link to="/login" className="back-link">
              <ArrowLeft size={16} />
              <span>Back to Login</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
