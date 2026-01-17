import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://umrahconnect.in/backend/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 seconds
});

// Request interceptor - Add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors globally
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle specific error cases
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;

      switch (status) {
        case 401:
          // Unauthorized - Clear token and redirect to login
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/login';
          break;
        case 403:
          // Forbidden - Show error message
          console.error('Access forbidden:', data.message);
          break;
        case 404:
          // Not found
          console.error('Resource not found:', data.message);
          break;
        case 500:
          // Server error
          console.error('Server error:', data.message);
          break;
        default:
          console.error('API Error:', data.message);
      }
    } else if (error.request) {
      // Request made but no response received
      console.error('Network error: No response from server');
    } else {
      // Something else happened
      console.error('Error:', error.message);
    }

    return Promise.reject(error);
  }
);

// ========================================
// AUTHENTICATION API
// ========================================

export const authAPI = {
  register: async (data) => {
    const response = await api.post('/auth/register', data);
    return response.data;
  },

  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  logout: async () => {
    const response = await api.post('/auth/logout');
    return response.data;
  },

  me: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  refresh: async () => {
    const response = await api.post('/auth/refresh');
    return response.data;
  },

  updateProfile: async (data) => {
    const response = await api.put('/auth/profile', data);
    return response.data;
  },

  changePassword: async (data) => {
    const response = await api.post('/auth/change-password', data);
    return response.data;
  },
};

// ========================================
// PACKAGES API
// ========================================

export const packagesAPI = {
  getPackages: async (params = {}) => {
    const response = await api.get('/packages', { params });
    return response.data;
  },

  getFeatured: async () => {
    const response = await api.get('/packages/featured');
    return response.data;
  },

  getPackage: async (id) => {
    const response = await api.get(`/packages/${id}`);
    return response.data;
  },

  createPackage: async (data) => {
    const response = await api.post('/packages', data);
    return response.data;
  },

  updatePackage: async (id, data) => {
    const response = await api.put(`/packages/${id}`, data);
    return response.data;
  },

  deletePackage: async (id) => {
    const response = await api.delete(`/packages/${id}`);
    return response.data;
  },
};

// ========================================
// BOOKINGS API
// ========================================

export const bookingsAPI = {
  getBookings: async (params = {}) => {
    const response = await api.get('/bookings', { params });
    return response.data;
  },

  getBooking: async (id) => {
    const response = await api.get(`/bookings/${id}`);
    return response.data;
  },

  createBooking: async (data) => {
    const response = await api.post('/bookings', data);
    return response.data;
  },

  updateStatus: async (id, status) => {
    const response = await api.patch(`/bookings/${id}/status`, { status });
    return response.data;
  },

  cancelBooking: async (id) => {
    const response = await api.post(`/bookings/${id}/cancel`);
    return response.data;
  },

  getStatistics: async () => {
    const response = await api.get('/bookings/statistics');
    return response.data;
  },
};

// ========================================
// PAYMENTS API
// ========================================

export const paymentsAPI = {
  createPayment: async (data) => {
    const response = await api.post('/payments/create', data);
    return response.data;
  },

  verifyPayment: async (data) => {
    const response = await api.post('/payments/verify', data);
    return response.data;
  },

  getHistory: async () => {
    const response = await api.get('/payments/history');
    return response.data;
  },
};

// ========================================
// REVIEWS API
// ========================================

export const reviewsAPI = {
  createReview: async (data) => {
    const response = await api.post('/reviews', data);
    return response.data;
  },

  updateReview: async (id, data) => {
    const response = await api.put(`/reviews/${id}`, data);
    return response.data;
  },

  deleteReview: async (id) => {
    const response = await api.delete(`/reviews/${id}`);
    return response.data;
  },
};

// ========================================
// CMS API - BANNERS
// ========================================

export const bannersAPI = {
  // Get active banners (public)
  getActiveBanners: async () => {
    const response = await api.get('/banners/active');
    return response.data;
  },

  // Get all banners (admin)
  getAllBanners: async () => {
    const response = await api.get('/admin/banners');
    return response.data;
  },

  // Create banner (admin)
  createBanner: async (data) => {
    const response = await api.post('/admin/banners', data);
    return response.data;
  },

  // Update banner (admin)
  updateBanner: async (id, data) => {
    const response = await api.put(`/admin/banners/${id}`, data);
    return response.data;
  },

  // Delete banner (admin)
  deleteBanner: async (id) => {
    const response = await api.delete(`/admin/banners/${id}`);
    return response.data;
  },
};

// ========================================
// CMS API - TESTIMONIALS
// ========================================

export const testimonialsAPI = {
  // Get testimonials (public)
  getTestimonials: async (params = {}) => {
    const response = await api.get('/testimonials', { params });
    return response.data;
  },

  // Get all testimonials (admin)
  getAllTestimonials: async () => {
    const response = await api.get('/admin/testimonials');
    return response.data;
  },

  // Create testimonial (admin)
  createTestimonial: async (data) => {
    const response = await api.post('/admin/testimonials', data);
    return response.data;
  },

  // Update testimonial (admin)
  updateTestimonial: async (id, data) => {
    const response = await api.put(`/admin/testimonials/${id}`, data);
    return response.data;
  },

  // Delete testimonial (admin)
  deleteTestimonial: async (id) => {
    const response = await api.delete(`/admin/testimonials/${id}`);
    return response.data;
  },
};

// ========================================
// CMS API - THEMES
// ========================================

export const themesAPI = {
  // Get active theme (public)
  getActiveTheme: async () => {
    const response = await api.get('/themes/active');
    return response.data;
  },

  // Get all themes (admin)
  getAllThemes: async () => {
    const response = await api.get('/admin/themes');
    return response.data;
  },

  // Create theme (admin)
  createTheme: async (data) => {
    const response = await api.post('/admin/themes', data);
    return response.data;
  },

  // Update theme (admin)
  updateTheme: async (id, data) => {
    const response = await api.put(`/admin/themes/${id}`, data);
    return response.data;
  },

  // Activate theme (admin)
  activateTheme: async (id) => {
    const response = await api.patch(`/admin/themes/${id}/activate`);
    return response.data;
  },

  // Delete theme (admin)
  deleteTheme: async (id) => {
    const response = await api.delete(`/admin/themes/${id}`);
    return response.data;
  },
};

// ========================================
// CMS API - SETTINGS
// ========================================

export const settingsAPI = {
  // Get public settings
  getSettings: async () => {
    const response = await api.get('/settings');
    return response.data;
  },

  // Get all settings (admin)
  getAllSettings: async () => {
    const response = await api.get('/admin/settings/all');
    return response.data;
  },

  // Update setting (admin)
  updateSetting: async (data) => {
    const response = await api.post('/admin/settings', data);
    return response.data;
  },

  // Update multiple settings (admin)
  updateBulk: async (settings) => {
    const response = await api.post('/admin/settings/bulk', { settings });
    return response.data;
  },
};

// ========================================
// ADMIN API
// ========================================

export const adminAPI = {
  getDashboard: async () => {
    const response = await api.get('/admin/dashboard');
    return response.data;
  },

  getStatistics: async () => {
    const response = await api.get('/admin/statistics');
    return response.data;
  },

  getUsers: async (params = {}) => {
    const response = await api.get('/admin/users', { params });
    return response.data;
  },

  getBookings: async (params = {}) => {
    const response = await api.get('/admin/bookings', { params });
    return response.data;
  },

  getAnalytics: async (params = {}) => {
    const response = await api.get('/admin/analytics', { params });
    return response.data;
  },
};

// ========================================
// VENDOR API
// ========================================

export const vendorAPI = {
  getDashboard: async () => {
    const response = await api.get('/vendor/dashboard');
    return response.data;
  },

  getStatistics: async () => {
    const response = await api.get('/vendor/statistics');
    return response.data;
  },

  getPackages: async () => {
    const response = await api.get('/vendor/packages');
    return response.data;
  },

  getBookings: async () => {
    const response = await api.get('/vendor/bookings');
    return response.data;
  },

  getProfile: async () => {
    const response = await api.get('/vendor/profile');
    return response.data;
  },

  updateProfile: async (data) => {
    const response = await api.put('/vendor/profile', data);
    return response.data;
  },
};

// Export the configured axios instance as default
export default api;
