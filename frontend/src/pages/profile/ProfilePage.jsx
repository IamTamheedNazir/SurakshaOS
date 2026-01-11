import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import './ProfilePage.css';

const ProfilePage = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('personal');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [profileData, setProfileData] = useState({
    // Personal Info
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    // Address
    address: '',
    city: '',
    state: '',
    pincode: '',
    country: 'India',
    // Travel Documents
    passportNumber: '',
    passportExpiry: '',
    nationality: '',
    // Preferences
    preferredLanguage: 'english',
    emailNotifications: true,
    smsNotifications: true,
    marketingEmails: false
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      setLoading(true);
      // TODO: Replace with actual API call
      // const response = await fetch('/api/users/profile');
      // const data = await response.json();
      
      // Mock data
      setTimeout(() => {
        setProfileData({
          firstName: 'Ahmed',
          lastName: 'Khan',
          email: 'ahmed.khan@example.com',
          phone: '+91 98765 43210',
          dateOfBirth: '1990-05-15',
          gender: 'male',
          address: '123 Main Street',
          city: 'Mumbai',
          state: 'Maharashtra',
          pincode: '400001',
          country: 'India',
          passportNumber: 'A1234567',
          passportExpiry: '2028-12-31',
          nationality: 'Indian',
          preferredLanguage: 'english',
          emailNotifications: true,
          smsNotifications: true,
          marketingEmails: false
        });
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error fetching profile:', error);
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      // TODO: Replace with actual API call
      // await fetch('/api/users/profile', {
      //   method: 'PUT',
      //   body: JSON.stringify(profileData)
      // });
      
      setTimeout(() => {
        setMessage({ type: 'success', text: 'Profile updated successfully!' });
        setLoading(false);
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      }, 1000);
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to update profile' });
      setLoading(false);
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match' });
      return;
    }

    try {
      setLoading(true);
      // TODO: Replace with actual API call
      
      setTimeout(() => {
        setMessage({ type: 'success', text: 'Password updated successfully!' });
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        setLoading(false);
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      }, 1000);
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to update password' });
      setLoading(false);
    }
  };

  return (
    <div className="profile-page">
      <div className="profile-container">
        {/* Header */}
        <div className="profile-header">
          <div className="header-content">
            <div className="profile-avatar">
              <span className="avatar-text">
                {profileData.firstName.charAt(0)}{profileData.lastName.charAt(0)}
              </span>
            </div>
            <div className="header-info">
              <h1 className="profile-name">
                {profileData.firstName} {profileData.lastName}
              </h1>
              <p className="profile-email">{profileData.email}</p>
              <div className="profile-badges">
                <span className="badge badge-verified">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Verified
                </span>
                <span className="badge badge-member">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                  Member since 2023
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Message Alert */}
        {message.text && (
          <div className={`alert alert-${message.type}`}>
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {message.type === 'success' ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              )}
            </svg>
            <span>{message.text}</span>
          </div>
        )}

        {/* Tabs */}
        <div className="profile-tabs">
          <button
            className={`tab ${activeTab === 'personal' ? 'active' : ''}`}
            onClick={() => setActiveTab('personal')}
          >
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            Personal Info
          </button>
          <button
            className={`tab ${activeTab === 'documents' ? 'active' : ''}`}
            onClick={() => setActiveTab('documents')}
          >
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Travel Documents
          </button>
          <button
            className={`tab ${activeTab === 'preferences' ? 'active' : ''}`}
            onClick={() => setActiveTab('preferences')}
          >
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Preferences
          </button>
          <button
            className={`tab ${activeTab === 'security' ? 'active' : ''}`}
            onClick={() => setActiveTab('security')}
          >
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            Security
          </button>
        </div>

        {/* Tab Content */}
        <div className="profile-content">
          {/* Personal Info Tab */}
          {activeTab === 'personal' && (
            <form onSubmit={handleProfileUpdate} className="profile-form">
              <div className="form-section">
                <h2 className="section-title">
                  <span className="title-decoration">✦</span>
                  Basic Information
                </h2>

                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">First Name *</label>
                    <input
                      type="text"
                      name="firstName"
                      className="form-input"
                      value={profileData.firstName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Last Name *</label>
                    <input
                      type="text"
                      name="lastName"
                      className="form-input"
                      value={profileData.lastName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Email *</label>
                    <input
                      type="email"
                      name="email"
                      className="form-input"
                      value={profileData.email}
                      onChange={handleInputChange}
                      required
                      disabled
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Phone *</label>
                    <input
                      type="tel"
                      name="phone"
                      className="form-input"
                      value={profileData.phone}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Date of Birth *</label>
                    <input
                      type="date"
                      name="dateOfBirth"
                      className="form-input"
                      value={profileData.dateOfBirth}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Gender *</label>
                    <select
                      name="gender"
                      className="form-input"
                      value={profileData.gender}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="form-section">
                <h2 className="section-title">
                  <span className="title-decoration">✦</span>
                  Address Details
                </h2>

                <div className="form-grid">
                  <div className="form-group form-group-full">
                    <label className="form-label">Address *</label>
                    <input
                      type="text"
                      name="address"
                      className="form-input"
                      value={profileData.address}
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
                      value={profileData.city}
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
                      value={profileData.state}
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
                      value={profileData.pincode}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Country *</label>
                    <input
                      type="text"
                      name="country"
                      className="form-input"
                      value={profileData.country}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="form-actions">
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          )}

          {/* Travel Documents Tab */}
          {activeTab === 'documents' && (
            <form onSubmit={handleProfileUpdate} className="profile-form">
              <div className="form-section">
                <h2 className="section-title">
                  <span className="title-decoration">✦</span>
                  Passport Information
                </h2>

                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">Passport Number</label>
                    <input
                      type="text"
                      name="passportNumber"
                      className="form-input"
                      value={profileData.passportNumber}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Passport Expiry Date</label>
                    <input
                      type="date"
                      name="passportExpiry"
                      className="form-input"
                      value={profileData.passportExpiry}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="form-group form-group-full">
                    <label className="form-label">Nationality</label>
                    <input
                      type="text"
                      name="nationality"
                      className="form-input"
                      value={profileData.nationality}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="info-box">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <strong>Important:</strong> Keep your passport information up to date for smooth visa processing and travel arrangements.
                  </div>
                </div>
              </div>

              <div className="form-actions">
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          )}

          {/* Preferences Tab */}
          {activeTab === 'preferences' && (
            <form onSubmit={handleProfileUpdate} className="profile-form">
              <div className="form-section">
                <h2 className="section-title">
                  <span className="title-decoration">✦</span>
                  Communication Preferences
                </h2>

                <div className="preferences-list">
                  <label className="preference-item">
                    <div className="preference-info">
                      <span className="preference-title">Email Notifications</span>
                      <span className="preference-desc">Receive booking confirmations and updates via email</span>
                    </div>
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        name="emailNotifications"
                        checked={profileData.emailNotifications}
                        onChange={handleInputChange}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </label>

                  <label className="preference-item">
                    <div className="preference-info">
                      <span className="preference-title">SMS Notifications</span>
                      <span className="preference-desc">Get important updates via SMS</span>
                    </div>
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        name="smsNotifications"
                        checked={profileData.smsNotifications}
                        onChange={handleInputChange}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </label>

                  <label className="preference-item">
                    <div className="preference-info">
                      <span className="preference-title">Marketing Emails</span>
                      <span className="preference-desc">Receive promotional offers and deals</span>
                    </div>
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        name="marketingEmails"
                        checked={profileData.marketingEmails}
                        onChange={handleInputChange}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </label>
                </div>
              </div>

              <div className="form-section">
                <h2 className="section-title">
                  <span className="title-decoration">✦</span>
                  Language Preference
                </h2>

                <div className="form-group">
                  <label className="form-label">Preferred Language</label>
                  <select
                    name="preferredLanguage"
                    className="form-input"
                    value={profileData.preferredLanguage}
                    onChange={handleInputChange}
                  >
                    <option value="english">English</option>
                    <option value="hindi">Hindi</option>
                    <option value="urdu">Urdu</option>
                    <option value="arabic">Arabic</option>
                  </select>
                </div>
              </div>

              <div className="form-actions">
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? 'Saving...' : 'Save Preferences'}
                </button>
              </div>
            </form>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <form onSubmit={handlePasswordUpdate} className="profile-form">
              <div className="form-section">
                <h2 className="section-title">
                  <span className="title-decoration">✦</span>
                  Change Password
                </h2>

                <div className="form-grid">
                  <div className="form-group form-group-full">
                    <label className="form-label">Current Password *</label>
                    <input
                      type="password"
                      name="currentPassword"
                      className="form-input"
                      value={passwordData.currentPassword}
                      onChange={handlePasswordChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">New Password *</label>
                    <input
                      type="password"
                      name="newPassword"
                      className="form-input"
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Confirm New Password *</label>
                    <input
                      type="password"
                      name="confirmPassword"
                      className="form-input"
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                      required
                    />
                  </div>
                </div>

                <div className="info-box">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <div>
                    <strong>Password Requirements:</strong>
                    <ul>
                      <li>At least 8 characters long</li>
                      <li>Include uppercase and lowercase letters</li>
                      <li>Include at least one number</li>
                      <li>Include at least one special character</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="form-actions">
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? 'Updating...' : 'Update Password'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
