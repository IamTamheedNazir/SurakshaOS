// API Configuration for Vite
export const API_CONFIG = {
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
  timeout: import.meta.env.VITE_API_TIMEOUT || 30000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
};

// App Configuration
export const APP_CONFIG = {
  name: import.meta.env.VITE_APP_NAME || 'UmrahConnect',
  version: import.meta.env.VITE_APP_VERSION || '2.0.0',
  env: import.meta.env.VITE_APP_ENV || 'development',
};

// Feature Flags
export const FEATURES = {
  analytics: import.meta.env.VITE_ENABLE_ANALYTICS === 'true',
  chat: import.meta.env.VITE_ENABLE_CHAT === 'true',
};

// Payment Gateway Keys
export const PAYMENT_CONFIG = {
  razorpay: {
    key: import.meta.env.VITE_RAZORPAY_KEY || '',
  },
  stripe: {
    publicKey: import.meta.env.VITE_STRIPE_PUBLIC_KEY || '',
  },
};

// Google Services
export const GOOGLE_CONFIG = {
  mapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '',
  analyticsId: import.meta.env.VITE_GOOGLE_ANALYTICS_ID || '',
  clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID || '',
};

// Social Auth
export const SOCIAL_AUTH = {
  google: {
    clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID || '',
  },
  facebook: {
    appId: import.meta.env.VITE_FACEBOOK_APP_ID || '',
  },
};

// File Upload Configuration
export const FILE_UPLOAD = {
  maxSize: parseInt(import.meta.env.VITE_MAX_FILE_SIZE) || 5242880, // 5MB
  allowedTypes: (import.meta.env.VITE_ALLOWED_FILE_TYPES || 'image/jpeg,image/png,image/jpg,application/pdf').split(','),
};

// Pagination
export const PAGINATION = {
  defaultPageSize: parseInt(import.meta.env.VITE_DEFAULT_PAGE_SIZE) || 12,
  maxPageSize: parseInt(import.meta.env.VITE_MAX_PAGE_SIZE) || 50,
};

// Cache
export const CACHE_CONFIG = {
  duration: parseInt(import.meta.env.VITE_CACHE_DURATION) || 3600000, // 1 hour
};

// Debug
export const DEBUG = {
  mode: import.meta.env.VITE_DEBUG_MODE === 'true',
  showConsoleLogs: import.meta.env.VITE_SHOW_CONSOLE_LOGS === 'true',
};

export default {
  API_CONFIG,
  APP_CONFIG,
  FEATURES,
  PAYMENT_CONFIG,
  GOOGLE_CONFIG,
  SOCIAL_AUTH,
  FILE_UPLOAD,
  PAGINATION,
  CACHE_CONFIG,
  DEBUG,
};
