import React, { createContext, useContext, useState, useEffect } from 'react';
import { settingsAPI } from '../services/api';

const SettingsContext = createContext();

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await settingsAPI.getPublicSettings();
      if (response.success && response.data) {
        setSettings(response.data);
        // Update document title
        if (response.data.siteName) {
          document.title = response.data.siteName;
        }
      } else {
        // Use default settings
        setSettings(getDefaultSettings());
      }
    } catch (err) {
      console.error('Error fetching settings:', err);
      setError('Failed to load settings');
      // Use default settings on error
      setSettings(getDefaultSettings());
    } finally {
      setLoading(false);
    }
  };

  const getDefaultSettings = () => {
    return {
      siteName: 'UmrahConnect',
      siteTagline: 'Your Trusted Partner for Sacred Journeys',
      siteDescription: 'Book your Umrah and Hajj packages with ease',
      contact: {
        email: 'info@umrahconnect.com',
        phone: '+91 98765 43210',
        whatsapp: '+91 98765 43210',
        address: '123 Islamic Center',
        city: 'Delhi',
        country: 'India'
      },
      socialMedia: {
        facebook: '',
        twitter: '',
        instagram: '',
        youtube: '',
        linkedin: ''
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
        heroTitle: 'Begin Your Sacred Journey',
        heroSubtitle: 'Discover the perfect Umrah and Hajj packages',
        showFeaturedPackages: true,
        featuredPackagesLimit: 6,
        showPopularPackages: true,
        popularPackagesLimit: 6,
        showTestimonials: true,
        testimonialsLimit: 6
      },
      payment: {
        currency: 'INR',
        currencySymbol: '₹'
      }
    };
  };

  const updateSettings = async (newSettings) => {
    try {
      const response = await settingsAPI.updateSiteSettings(newSettings);
      if (response.success && response.data) {
        setSettings(response.data);
        return response.data;
      }
    } catch (err) {
      console.error('Error updating settings:', err);
      throw err;
    }
  };

  const formatCurrency = (amount) => {
    if (!settings) return amount;
    const symbol = settings.payment?.currencySymbol || '₹';
    return `${symbol}${amount.toLocaleString('en-IN')}`;
  };

  const isFeatureEnabled = (feature) => {
    if (!settings || !settings.features) return false;
    return settings.features[feature] === true;
  };

  const value = {
    settings,
    loading,
    error,
    updateSettings,
    refreshSettings: fetchSettings,
    formatCurrency,
    isFeatureEnabled
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};

export default SettingsContext;
