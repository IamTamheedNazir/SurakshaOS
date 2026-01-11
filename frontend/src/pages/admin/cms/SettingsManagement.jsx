import React, { useState, useEffect } from 'react';
import { settingsAPI } from '../../../services/api';
import { useSettings } from '../../../contexts/SettingsContext';
import './SettingsManagement.css';

const SettingsManagement = () => {
  const { settings: currentSettings, refreshSettings } = useSettings();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('general');

  const [formData, setFormData] = useState({
    siteName: '',
    siteTagline: '',
    siteDescription: '',
    logo: '',
    favicon: '',
    contact: {
      email: '',
      phone: '',
      whatsapp: '',
      address: '',
      city: '',
      state: '',
      country: '',
      zipCode: ''
    },
    socialMedia: {
      facebook: '',
      twitter: '',
      instagram: '',
      youtube: '',
      linkedin: ''
    },
    businessHours: {
      monday: { open: '09:00', close: '18:00', closed: false },
      tuesday: { open: '09:00', close: '18:00', closed: false },
      wednesday: { open: '09:00', close: '18:00', closed: false },
      thursday: { open: '09:00', close: '18:00', closed: false },
      friday: { open: '09:00', close: '18:00', closed: false },
      saturday: { open: '09:00', close: '18:00', closed: false },
      sunday: { open: '09:00', close: '18:00', closed: true }
    },
    features: {
      enableBooking: true,
      enableReviews: true,
      enableBlog: true,
      enableNewsletter: true,
      enableChat: false,
      maintenanceMode: false
    },
    homepage: {
      heroTitle: '',
      heroSubtitle: '',
      showFeaturedPackages: true,
      featuredPackagesLimit: 6,
      showPopularPackages: true,
      popularPackagesLimit: 6,
      showTestimonials: true,
      testimonialsLimit: 6
    },
    payment: {
      currency: 'INR',
      currencySymbol: '₹',
      taxRate: 0,
      enableRazorpay: false,
      enableStripe: false,
      enablePayPal: false
    },
    seo: {
      metaTitle: '',
      metaDescription: '',
      metaKeywords: '',
      googleAnalyticsId: '',
      facebookPixelId: ''
    },
    statistics: {
      showTotalPackages: true,
      showTotalBookings: true,
      showHappyCustomers: true,
      showYearsExperience: true,
      yearsExperience: 10
    }
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await settingsAPI.getSiteSettings();
      if (response.success && response.data) {
        setFormData(response.data);
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
      alert('Failed to fetch settings');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleNestedChange = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleBusinessHoursChange = (day, field, value) => {
    setFormData(prev => ({
      ...prev,
      businessHours: {
        ...prev.businessHours,
        [day]: {
          ...prev.businessHours[day],
          [field]: value
        }
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setSaving(true);
      const response = await settingsAPI.updateSiteSettings(formData);
      if (response.success) {
        alert('Settings updated successfully!');
        refreshSettings(); // Refresh settings context
      }
    } catch (error) {
      console.error('Error updating settings:', error);
      alert(error.response?.data?.message || 'Failed to update settings');
    } finally {
      setSaving(false);
    }
  };

  const tabs = [
    { id: 'general', label: 'General', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z' },
    { id: 'contact', label: 'Contact', icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
    { id: 'social', label: 'Social Media', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' },
    { id: 'hours', label: 'Business Hours', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
    { id: 'features', label: 'Features', icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' },
    { id: 'homepage', label: 'Homepage', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    { id: 'payment', label: 'Payment', icon: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z' },
    { id: 'seo', label: 'SEO', icon: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' }
  ];

  if (loading) {
    return (
      <div className="settings-management">
        <div className="loading-container">
          <div className="loading-spinner"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="settings-management">
      <div className="page-header">
        <div>
          <h1>Site Settings</h1>
          <p className="page-subtitle">Configure your site's global settings</p>
        </div>
        <button 
          className="btn-primary" 
          onClick={handleSubmit}
          disabled={saving}
        >
          {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </div>

      <div className="settings-container">
        {/* Tabs */}
        <div className="settings-tabs">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={tab.icon} />
              </svg>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="settings-content">
          <form onSubmit={handleSubmit}>
            {/* General Settings */}
            {activeTab === 'general' && (
              <div className="settings-section">
                <h2>General Settings</h2>
                
                <div className="form-group">
                  <label>Site Name *</label>
                  <input
                    type="text"
                    name="siteName"
                    value={formData.siteName}
                    onChange={handleInputChange}
                    required
                    placeholder="UmrahConnect"
                  />
                </div>

                <div className="form-group">
                  <label>Site Tagline</label>
                  <input
                    type="text"
                    name="siteTagline"
                    value={formData.siteTagline}
                    onChange={handleInputChange}
                    placeholder="Your Trusted Partner for Sacred Journeys"
                  />
                </div>

                <div className="form-group">
                  <label>Site Description</label>
                  <textarea
                    name="siteDescription"
                    value={formData.siteDescription}
                    onChange={handleInputChange}
                    rows="4"
                    placeholder="Brief description of your site"
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Logo URL</label>
                    <input
                      type="url"
                      name="logo"
                      value={formData.logo}
                      onChange={handleInputChange}
                      placeholder="https://example.com/logo.png"
                    />
                  </div>

                  <div className="form-group">
                    <label>Favicon URL</label>
                    <input
                      type="url"
                      name="favicon"
                      value={formData.favicon}
                      onChange={handleInputChange}
                      placeholder="https://example.com/favicon.ico"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Contact Settings */}
            {activeTab === 'contact' && (
              <div className="settings-section">
                <h2>Contact Information</h2>
                
                <div className="form-row">
                  <div className="form-group">
                    <label>Email *</label>
                    <input
                      type="email"
                      value={formData.contact.email}
                      onChange={(e) => handleNestedChange('contact', 'email', e.target.value)}
                      required
                      placeholder="info@umrahconnect.com"
                    />
                  </div>

                  <div className="form-group">
                    <label>Phone *</label>
                    <input
                      type="tel"
                      value={formData.contact.phone}
                      onChange={(e) => handleNestedChange('contact', 'phone', e.target.value)}
                      required
                      placeholder="+91 98765 43210"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>WhatsApp Number</label>
                  <input
                    type="tel"
                    value={formData.contact.whatsapp}
                    onChange={(e) => handleNestedChange('contact', 'whatsapp', e.target.value)}
                    placeholder="+91 98765 43210"
                  />
                </div>

                <div className="form-group">
                  <label>Address</label>
                  <input
                    type="text"
                    value={formData.contact.address}
                    onChange={(e) => handleNestedChange('contact', 'address', e.target.value)}
                    placeholder="123 Islamic Center"
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>City</label>
                    <input
                      type="text"
                      value={formData.contact.city}
                      onChange={(e) => handleNestedChange('contact', 'city', e.target.value)}
                      placeholder="Delhi"
                    />
                  </div>

                  <div className="form-group">
                    <label>State</label>
                    <input
                      type="text"
                      value={formData.contact.state}
                      onChange={(e) => handleNestedChange('contact', 'state', e.target.value)}
                      placeholder="Delhi"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Country</label>
                    <input
                      type="text"
                      value={formData.contact.country}
                      onChange={(e) => handleNestedChange('contact', 'country', e.target.value)}
                      placeholder="India"
                    />
                  </div>

                  <div className="form-group">
                    <label>ZIP Code</label>
                    <input
                      type="text"
                      value={formData.contact.zipCode}
                      onChange={(e) => handleNestedChange('contact', 'zipCode', e.target.value)}
                      placeholder="110001"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Social Media Settings */}
            {activeTab === 'social' && (
              <div className="settings-section">
                <h2>Social Media Links</h2>
                
                <div className="form-group">
                  <label>Facebook</label>
                  <input
                    type="url"
                    value={formData.socialMedia.facebook}
                    onChange={(e) => handleNestedChange('socialMedia', 'facebook', e.target.value)}
                    placeholder="https://facebook.com/umrahconnect"
                  />
                </div>

                <div className="form-group">
                  <label>Twitter</label>
                  <input
                    type="url"
                    value={formData.socialMedia.twitter}
                    onChange={(e) => handleNestedChange('socialMedia', 'twitter', e.target.value)}
                    placeholder="https://twitter.com/umrahconnect"
                  />
                </div>

                <div className="form-group">
                  <label>Instagram</label>
                  <input
                    type="url"
                    value={formData.socialMedia.instagram}
                    onChange={(e) => handleNestedChange('socialMedia', 'instagram', e.target.value)}
                    placeholder="https://instagram.com/umrahconnect"
                  />
                </div>

                <div className="form-group">
                  <label>YouTube</label>
                  <input
                    type="url"
                    value={formData.socialMedia.youtube}
                    onChange={(e) => handleNestedChange('socialMedia', 'youtube', e.target.value)}
                    placeholder="https://youtube.com/@umrahconnect"
                  />
                </div>

                <div className="form-group">
                  <label>LinkedIn</label>
                  <input
                    type="url"
                    value={formData.socialMedia.linkedin}
                    onChange={(e) => handleNestedChange('socialMedia', 'linkedin', e.target.value)}
                    placeholder="https://linkedin.com/company/umrahconnect"
                  />
                </div>
              </div>
            )}

            {/* Business Hours */}
            {activeTab === 'hours' && (
              <div className="settings-section">
                <h2>Business Hours</h2>
                
                {Object.keys(formData.businessHours).map(day => (
                  <div key={day} className="business-hours-row">
                    <div className="day-name">{day.charAt(0).toUpperCase() + day.slice(1)}</div>
                    
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={formData.businessHours[day].closed}
                        onChange={(e) => handleBusinessHoursChange(day, 'closed', e.target.checked)}
                      />
                      <span>Closed</span>
                    </label>

                    {!formData.businessHours[day].closed && (
                      <>
                        <input
                          type="time"
                          value={formData.businessHours[day].open}
                          onChange={(e) => handleBusinessHoursChange(day, 'open', e.target.value)}
                        />
                        <span>to</span>
                        <input
                          type="time"
                          value={formData.businessHours[day].close}
                          onChange={(e) => handleBusinessHoursChange(day, 'close', e.target.value)}
                        />
                      </>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Features */}
            {activeTab === 'features' && (
              <div className="settings-section">
                <h2>Feature Toggles</h2>
                
                <div className="features-grid">
                  <label className="feature-toggle">
                    <input
                      type="checkbox"
                      checked={formData.features.enableBooking}
                      onChange={(e) => handleNestedChange('features', 'enableBooking', e.target.checked)}
                    />
                    <div className="feature-info">
                      <strong>Enable Booking</strong>
                      <span>Allow customers to book packages</span>
                    </div>
                  </label>

                  <label className="feature-toggle">
                    <input
                      type="checkbox"
                      checked={formData.features.enableReviews}
                      onChange={(e) => handleNestedChange('features', 'enableReviews', e.target.checked)}
                    />
                    <div className="feature-info">
                      <strong>Enable Reviews</strong>
                      <span>Allow customers to leave reviews</span>
                    </div>
                  </label>

                  <label className="feature-toggle">
                    <input
                      type="checkbox"
                      checked={formData.features.enableBlog}
                      onChange={(e) => handleNestedChange('features', 'enableBlog', e.target.checked)}
                    />
                    <div className="feature-info">
                      <strong>Enable Blog</strong>
                      <span>Show blog section on site</span>
                    </div>
                  </label>

                  <label className="feature-toggle">
                    <input
                      type="checkbox"
                      checked={formData.features.enableNewsletter}
                      onChange={(e) => handleNestedChange('features', 'enableNewsletter', e.target.checked)}
                    />
                    <div className="feature-info">
                      <strong>Enable Newsletter</strong>
                      <span>Show newsletter subscription</span>
                    </div>
                  </label>

                  <label className="feature-toggle">
                    <input
                      type="checkbox"
                      checked={formData.features.enableChat}
                      onChange={(e) => handleNestedChange('features', 'enableChat', e.target.checked)}
                    />
                    <div className="feature-info">
                      <strong>Enable Live Chat</strong>
                      <span>Show live chat widget</span>
                    </div>
                  </label>

                  <label className="feature-toggle warning">
                    <input
                      type="checkbox"
                      checked={formData.features.maintenanceMode}
                      onChange={(e) => handleNestedChange('features', 'maintenanceMode', e.target.checked)}
                    />
                    <div className="feature-info">
                      <strong>Maintenance Mode</strong>
                      <span>Put site in maintenance mode</span>
                    </div>
                  </label>
                </div>
              </div>
            )}

            {/* Homepage Settings */}
            {activeTab === 'homepage' && (
              <div className="settings-section">
                <h2>Homepage Settings</h2>
                
                <div className="form-group">
                  <label>Hero Title</label>
                  <input
                    type="text"
                    value={formData.homepage.heroTitle}
                    onChange={(e) => handleNestedChange('homepage', 'heroTitle', e.target.value)}
                    placeholder="Begin Your Sacred Journey"
                  />
                </div>

                <div className="form-group">
                  <label>Hero Subtitle</label>
                  <input
                    type="text"
                    value={formData.homepage.heroSubtitle}
                    onChange={(e) => handleNestedChange('homepage', 'heroSubtitle', e.target.value)}
                    placeholder="Discover the perfect Umrah and Hajj packages"
                  />
                </div>

                <div className="section-toggle">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={formData.homepage.showFeaturedPackages}
                      onChange={(e) => handleNestedChange('homepage', 'showFeaturedPackages', e.target.checked)}
                    />
                    <span>Show Featured Packages</span>
                  </label>
                  
                  {formData.homepage.showFeaturedPackages && (
                    <input
                      type="number"
                      value={formData.homepage.featuredPackagesLimit}
                      onChange={(e) => handleNestedChange('homepage', 'featuredPackagesLimit', parseInt(e.target.value))}
                      min="1"
                      max="12"
                      placeholder="6"
                    />
                  )}
                </div>

                <div className="section-toggle">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={formData.homepage.showPopularPackages}
                      onChange={(e) => handleNestedChange('homepage', 'showPopularPackages', e.target.checked)}
                    />
                    <span>Show Popular Packages</span>
                  </label>
                  
                  {formData.homepage.showPopularPackages && (
                    <input
                      type="number"
                      value={formData.homepage.popularPackagesLimit}
                      onChange={(e) => handleNestedChange('homepage', 'popularPackagesLimit', parseInt(e.target.value))}
                      min="1"
                      max="12"
                      placeholder="6"
                    />
                  )}
                </div>

                <div className="section-toggle">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={formData.homepage.showTestimonials}
                      onChange={(e) => handleNestedChange('homepage', 'showTestimonials', e.target.checked)}
                    />
                    <span>Show Testimonials</span>
                  </label>
                  
                  {formData.homepage.showTestimonials && (
                    <input
                      type="number"
                      value={formData.homepage.testimonialsLimit}
                      onChange={(e) => handleNestedChange('homepage', 'testimonialsLimit', parseInt(e.target.value))}
                      min="1"
                      max="12"
                      placeholder="6"
                    />
                  )}
                </div>
              </div>
            )}

            {/* Payment Settings */}
            {activeTab === 'payment' && (
              <div className="settings-section">
                <h2>Payment Settings</h2>
                
                <div className="form-row">
                  <div className="form-group">
                    <label>Currency</label>
                    <select
                      value={formData.payment.currency}
                      onChange={(e) => handleNestedChange('payment', 'currency', e.target.value)}
                    >
                      <option value="INR">INR - Indian Rupee</option>
                      <option value="USD">USD - US Dollar</option>
                      <option value="EUR">EUR - Euro</option>
                      <option value="GBP">GBP - British Pound</option>
                      <option value="SAR">SAR - Saudi Riyal</option>
                      <option value="AED">AED - UAE Dirham</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Currency Symbol</label>
                    <input
                      type="text"
                      value={formData.payment.currencySymbol}
                      onChange={(e) => handleNestedChange('payment', 'currencySymbol', e.target.value)}
                      placeholder="₹"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Tax Rate (%)</label>
                  <input
                    type="number"
                    value={formData.payment.taxRate}
                    onChange={(e) => handleNestedChange('payment', 'taxRate', parseFloat(e.target.value))}
                    min="0"
                    max="100"
                    step="0.01"
                    placeholder="0"
                  />
                </div>

                <h3>Payment Gateways</h3>
                
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={formData.payment.enableRazorpay}
                    onChange={(e) => handleNestedChange('payment', 'enableRazorpay', e.target.checked)}
                  />
                  <span>Enable Razorpay</span>
                </label>

                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={formData.payment.enableStripe}
                    onChange={(e) => handleNestedChange('payment', 'enableStripe', e.target.checked)}
                  />
                  <span>Enable Stripe</span>
                </label>

                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={formData.payment.enablePayPal}
                    onChange={(e) => handleNestedChange('payment', 'enablePayPal', e.target.checked)}
                  />
                  <span>Enable PayPal</span>
                </label>
              </div>
            )}

            {/* SEO Settings */}
            {activeTab === 'seo' && (
              <div className="settings-section">
                <h2>SEO Settings</h2>
                
                <div className="form-group">
                  <label>Meta Title</label>
                  <input
                    type="text"
                    value={formData.seo.metaTitle}
                    onChange={(e) => handleNestedChange('seo', 'metaTitle', e.target.value)}
                    placeholder="UmrahConnect - Your Trusted Partner"
                    maxLength="60"
                  />
                  <small>{formData.seo.metaTitle.length}/60 characters</small>
                </div>

                <div className="form-group">
                  <label>Meta Description</label>
                  <textarea
                    value={formData.seo.metaDescription}
                    onChange={(e) => handleNestedChange('seo', 'metaDescription', e.target.value)}
                    rows="3"
                    placeholder="Book your Umrah and Hajj packages with ease..."
                    maxLength="160"
                  />
                  <small>{formData.seo.metaDescription.length}/160 characters</small>
                </div>

                <div className="form-group">
                  <label>Meta Keywords</label>
                  <input
                    type="text"
                    value={formData.seo.metaKeywords}
                    onChange={(e) => handleNestedChange('seo', 'metaKeywords', e.target.value)}
                    placeholder="umrah, hajj, packages, booking"
                  />
                  <small>Separate keywords with commas</small>
                </div>

                <div className="form-group">
                  <label>Google Analytics ID</label>
                  <input
                    type="text"
                    value={formData.seo.googleAnalyticsId}
                    onChange={(e) => handleNestedChange('seo', 'googleAnalyticsId', e.target.value)}
                    placeholder="G-XXXXXXXXXX"
                  />
                </div>

                <div className="form-group">
                  <label>Facebook Pixel ID</label>
                  <input
                    type="text"
                    value={formData.seo.facebookPixelId}
                    onChange={(e) => handleNestedChange('seo', 'facebookPixelId', e.target.value)}
                    placeholder="123456789012345"
                  />
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default SettingsManagement;
