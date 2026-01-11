import React, { createContext, useContext, useState, useEffect } from 'react';
import { themesAPI } from '../services/api';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchActiveTheme();
  }, []);

  useEffect(() => {
    if (theme && theme.colors) {
      applyTheme(theme.colors);
    }
  }, [theme]);

  const fetchActiveTheme = async () => {
    try {
      setLoading(true);
      const response = await themesAPI.getActiveTheme();
      if (response.success && response.data) {
        setTheme(response.data);
      } else {
        // Use default theme if no active theme
        setTheme(getDefaultTheme());
      }
    } catch (err) {
      console.error('Error fetching theme:', err);
      setError('Failed to load theme');
      // Use default theme on error
      setTheme(getDefaultTheme());
    } finally {
      setLoading(false);
    }
  };

  const applyTheme = (colors) => {
    const root = document.documentElement;
    
    // Apply CSS variables
    root.style.setProperty('--primary-color', colors.primary || '#10b981');
    root.style.setProperty('--primary-dark', colors.primaryDark || '#059669');
    root.style.setProperty('--secondary-color', colors.secondary || '#d4af37');
    root.style.setProperty('--accent-color', colors.accent || '#fef3c7');
    root.style.setProperty('--background-color', colors.background || '#ffffff');
    root.style.setProperty('--text-color', colors.text || '#1f2937');
    root.style.setProperty('--text-light', colors.textLight || '#6b7280');

    // Additional derived colors
    root.style.setProperty('--primary-green', colors.primary || '#10b981');
    root.style.setProperty('--primary-green-dark', colors.primaryDark || '#059669');
    root.style.setProperty('--gold', colors.secondary || '#d4af37');
    root.style.setProperty('--light-green', `${colors.primary}15` || '#10b98115');
    
    // Gradients
    root.style.setProperty(
      '--gradient-primary',
      `linear-gradient(135deg, ${colors.primary || '#10b981'} 0%, ${colors.primaryDark || '#059669'} 100%)`
    );
  };

  const getDefaultTheme = () => {
    return {
      name: 'islamic-green',
      displayName: 'Islamic Green',
      colors: {
        primary: '#10b981',
        primaryDark: '#059669',
        secondary: '#d4af37',
        accent: '#fef3c7',
        background: '#ffffff',
        text: '#1f2937',
        textLight: '#6b7280'
      }
    };
  };

  const switchTheme = async (themeId) => {
    try {
      const response = await themesAPI.activateTheme(themeId);
      if (response.success && response.data) {
        setTheme(response.data);
      }
    } catch (err) {
      console.error('Error switching theme:', err);
      throw err;
    }
  };

  const value = {
    theme,
    loading,
    error,
    switchTheme,
    refreshTheme: fetchActiveTheme
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeContext;
