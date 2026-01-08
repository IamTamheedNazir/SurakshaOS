import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import './SocialLogin.css';

const SocialLogin = ({ onSuccess }) => {
  const navigate = useNavigate();
  const [showPhoneLogin, setShowPhoneLogin] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);

  // Google Login
  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      // Initialize Google OAuth
      // const google = window.google;
      toast.info('Redirecting to Google...');
      
      // Simulate Google login
      setTimeout(() => {
        toast.success('Google login successful!');
        onSuccess?.({
          provider: 'google',
          user: {
            name: 'John Doe',
            email: 'john@gmail.com',
            avatar: 'https://ui-avatars.com/api/?name=John+Doe',
          },
        });
      }, 2000);
    } catch (error) {
      toast.error('Google login failed');
    } finally {
      setLoading(false);
    }
  };

  // Facebook Login
  const handleFacebookLogin = async () => {
    setLoading(true);
    try {
      // Initialize Facebook SDK
      // window.FB.login()
      toast.info('Redirecting to Facebook...');
      
      // Simulate Facebook login
      setTimeout(() => {
        toast.success('Facebook login successful!');
        onSuccess?.({
          provider: 'facebook',
          user: {
            name: 'Jane Smith',
            email: 'jane@facebook.com',
            avatar: 'https://ui-avatars.com/api/?name=Jane+Smith',
          },
        });
      }, 2000);
    } catch (error) {
      toast.error('Facebook login failed');
    } finally {
      setLoading(false);
    }
  };

  // Apple Login
  const handleAppleLogin = async () => {
    setLoading(true);
    try {
      // Initialize Apple Sign In
      // AppleID.auth.signIn()
      toast.info('Redirecting to Apple...');
      
      // Simulate Apple login
      setTimeout(() => {
        toast.success('Apple login successful!');
        onSuccess?.({
          provider: 'apple',
          user: {
            name: 'Apple User',
            email: 'user@icloud.com',
            avatar: 'https://ui-avatars.com/api/?name=Apple+User',
          },
        });
      }, 2000);
    } catch (error) {
      toast.error('Apple login failed');
    } finally {
      setLoading(false);
    }
  };

  // Phone Login - Send OTP
  const handleSendOTP = async () => {
    if (!phoneNumber || phoneNumber.length < 10) {
      toast.error('Please enter a valid phone number');
      return;
    }

    setLoading(true);
    try {
      // Send OTP via Firebase or Twilio
      toast.success('OTP sent to your phone!');
      setOtpSent(true);
    } catch (error) {
      toast.error('Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  // Phone Login - Verify OTP
  const handleVerifyOTP = async () => {
    if (!otp || otp.length !== 6) {
      toast.error('Please enter a valid 6-digit OTP');
      return;
    }

    setLoading(true);
    try {
      // Verify OTP
      toast.success('Phone verification successful!');
      onSuccess?.({
        provider: 'phone',
        user: {
          name: 'Phone User',
          phone: phoneNumber,
          avatar: 'https://ui-avatars.com/api/?name=Phone+User',
        },
      });
      setShowPhoneLogin(false);
      setOtpSent(false);
      setPhoneNumber('');
      setOtp('');
    } catch (error) {
      toast.error('Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  // Twitter/X Login
  const handleTwitterLogin = async () => {
    setLoading(true);
    try {
      toast.info('Redirecting to Twitter...');
      
      setTimeout(() => {
        toast.success('Twitter login successful!');
        onSuccess?.({
          provider: 'twitter',
          user: {
            name: 'Twitter User',
            email: 'user@twitter.com',
            avatar: 'https://ui-avatars.com/api/?name=Twitter+User',
          },
        });
      }, 2000);
    } catch (error) {
      toast.error('Twitter login failed');
    } finally {
      setLoading(false);
    }
  };

  // LinkedIn Login
  const handleLinkedInLogin = async () => {
    setLoading(true);
    try {
      toast.info('Redirecting to LinkedIn...');
      
      setTimeout(() => {
        toast.success('LinkedIn login successful!');
        onSuccess?.({
          provider: 'linkedin',
          user: {
            name: 'LinkedIn User',
            email: 'user@linkedin.com',
            avatar: 'https://ui-avatars.com/api/?name=LinkedIn+User',
          },
        });
      }, 2000);
    } catch (error) {
      toast.error('LinkedIn login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="social-login-container">
      <div className="social-login-divider">
        <span>Or continue with</span>
      </div>

      {/* Primary Social Logins */}
      <div className="social-buttons-grid">
        <button
          className="social-btn google-btn"
          onClick={handleGoogleLogin}
          disabled={loading}
        >
          <svg className="social-icon" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Google
        </button>

        <button
          className="social-btn facebook-btn"
          onClick={handleFacebookLogin}
          disabled={loading}
        >
          <svg className="social-icon" viewBox="0 0 24 24" fill="#1877F2">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
          </svg>
          Facebook
        </button>

        <button
          className="social-btn apple-btn"
          onClick={handleAppleLogin}
          disabled={loading}
        >
          <svg className="social-icon" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
          </svg>
          Apple
        </button>

        <button
          className="social-btn phone-btn"
          onClick={() => setShowPhoneLogin(true)}
          disabled={loading}
        >
          <svg className="social-icon" viewBox="0 0 24 24" fill="currentColor">
            <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
          </svg>
          Phone
        </button>
      </div>

      {/* Secondary Social Logins */}
      <div className="secondary-social-buttons">
        <button
          className="social-btn-small twitter-btn"
          onClick={handleTwitterLogin}
          disabled={loading}
          title="Continue with Twitter"
        >
          <svg className="social-icon-small" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
          </svg>
        </button>

        <button
          className="social-btn-small linkedin-btn"
          onClick={handleLinkedInLogin}
          disabled={loading}
          title="Continue with LinkedIn"
        >
          <svg className="social-icon-small" viewBox="0 0 24 24" fill="#0A66C2">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
          </svg>
        </button>
      </div>

      {/* Phone Login Modal */}
      {showPhoneLogin && (
        <div className="phone-login-modal">
          <div className="phone-login-content">
            <div className="modal-header">
              <h3>📱 Phone Login</h3>
              <button
                className="close-btn"
                onClick={() => {
                  setShowPhoneLogin(false);
                  setOtpSent(false);
                  setPhoneNumber('');
                  setOtp('');
                }}
              >
                ✕
              </button>
            </div>

            {!otpSent ? (
              <div className="phone-input-section">
                <label>Enter your phone number</label>
                <div className="phone-input-group">
                  <select className="country-code">
                    <option value="+91">🇮🇳 +91</option>
                    <option value="+1">🇺🇸 +1</option>
                    <option value="+44">🇬🇧 +44</option>
                    <option value="+971">🇦🇪 +971</option>
                    <option value="+966">🇸🇦 +966</option>
                  </select>
                  <input
                    type="tel"
                    className="phone-input"
                    placeholder="9876543210"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    maxLength="10"
                  />
                </div>
                <button
                  className="btn btn-primary btn-block"
                  onClick={handleSendOTP}
                  disabled={loading}
                >
                  {loading ? 'Sending...' : 'Send OTP'}
                </button>
              </div>
            ) : (
              <div className="otp-input-section">
                <p className="otp-sent-message">
                  OTP sent to +91 {phoneNumber}
                </p>
                <label>Enter 6-digit OTP</label>
                <input
                  type="text"
                  className="otp-input"
                  placeholder="000000"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  maxLength="6"
                />
                <button
                  className="btn btn-primary btn-block"
                  onClick={handleVerifyOTP}
                  disabled={loading}
                >
                  {loading ? 'Verifying...' : 'Verify OTP'}
                </button>
                <button
                  className="btn btn-secondary btn-block"
                  onClick={handleSendOTP}
                  disabled={loading}
                >
                  Resend OTP
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SocialLogin;
