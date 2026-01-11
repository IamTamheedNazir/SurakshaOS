import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds
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
    const response = await api.get('/banners');
    return response.data;
  },

  // Get single banner
  getBanner: async (id) => {
    const response = await api.get(`/banners/${id}`);
    return response.data;
  },

  // Create banner (admin)
  createBanner: async (data) => {
    const response = await api.post('/banners', data);
    return response.data;
  },

  // Update banner (admin)
  updateBanner: async (id, data) => {
    const response = await api.put(`/banners/${id}`, data);
    return response.data;
  },

  // Delete banner (admin)
  deleteBanner: async (id) => {
    const response = await api.delete(`/banners/${id}`);
    return response.data;
  },

  // Reorder banners (admin)
  reorderBanners: async (banners) => {
    const response = await api.put('/banners/reorder', { banners });
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
    const response = await api.get('/themes');
    return response.data;
  },

  // Get single theme
  getTheme: async (id) => {
    const response = await api.get(`/themes/${id}`);
    return response.data;
  },

  // Create theme (admin)
  createTheme: async (data) => {
    const response = await api.post('/themes', data);
    return response.data;
  },

  // Update theme (admin)
  updateTheme: async (id, data) => {
    const response = await api.put(`/themes/${id}`, data);
    return response.data;
  },

  // Delete theme (admin)
  deleteTheme: async (id) => {
    const response = await api.delete(`/themes/${id}`);
    return response.data;
  },

  // Activate theme (admin)
  activateTheme: async (id) => {
    const response = await api.put(`/themes/${id}/activate`);
    return response.data;
  },
};

// ========================================
// CMS API - SITE SETTINGS
// ========================================

export const settingsAPI = {
  // Get public settings
  getPublicSettings: async () => {
    const response = await api.get('/settings/public');
    return response.data;
  },

  // Get all settings (admin)
  getSiteSettings: async () => {
    const response = await api.get('/settings');
    return response.data;
  },

  // Update settings (admin)
  updateSiteSettings: async (data) => {
    const response = await api.put('/settings', data);
    return response.data;
  },
};

// ========================================
// CMS API - TESTIMONIALS
// ========================================

export const testimonialsAPI = {
  // Get featured testimonials (public)
  getFeaturedTestimonials: async (limit = 6) => {
    const response = await api.get(`/testimonials/featured?limit=${limit}`);
    return response.data;
  },

  // Get all testimonials (public)
  getAllTestimonials: async (params = {}) => {
    const response = await api.get('/testimonials', { params });
    return response.data;
  },

  // Get single testimonial
  getTestimonial: async (id) => {
    const response = await api.get(`/testimonials/${id}`);
    return response.data;
  },

  // Create testimonial (admin)
  createTestimonial: async (data) => {
    const response = await api.post('/testimonials', data);
    return response.data;
  },

  // Update testimonial (admin)
  updateTestimonial: async (id, data) => {
    const response = await api.put(`/testimonials/${id}`, data);
    return response.data;
  },

  // Delete testimonial (admin)
  deleteTestimonial: async (id) => {
    const response = await api.delete(`/testimonials/${id}`);
    return response.data;
  },
};

// ========================================
// AUTH API
// ========================================

export const authAPI = {
  // Register new user
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  // Login user
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  // Get current user
  getCurrentUser: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  // Logout user
  logout: async () => {
    const response = await api.post('/auth/logout');
    return response.data;
  },

  // Forgot password
  forgotPassword: async (email) => {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data;
  },

  // Reset password
  resetPassword: async (token, password) => {
    const response = await api.post(`/auth/reset-password/${token}`, { password });
    return response.data;
  },
};

// ========================================
// USERS API
// ========================================

export const usersAPI = {
  // Get user profile
  getProfile: async () => {
    const response = await api.get('/users/profile');
    return response.data;
  },

  // Update user profile
  updateProfile: async (userData) => {
    const response = await api.put('/users/profile', userData);
    return response.data;
  },

  // Update password
  updatePassword: async (passwordData) => {
    const response = await api.put('/users/password', passwordData);
    return response.data;
  },

  // Delete account
  deleteAccount: async () => {
    const response = await api.delete('/users/account');
    return response.data;
  },
};

// ========================================
// PACKAGES API
// ========================================

export const packagesAPI = {
  // Get all packages with filters
  getPackages: async (params = {}) => {
    const response = await api.get('/packages', { params });
    return response.data;
  },

  // Get single package by ID
  getPackageById: async (id) => {
    const response = await api.get(`/packages/${id}`);
    return response.data;
  },

  // Search packages
  searchPackages: async (query) => {
    const response = await api.get('/packages/search', { params: { q: query } });
    return response.data;
  },

  // Get featured packages
  getFeaturedPackages: async (limit = 6) => {
    const response = await api.get(`/packages/featured?limit=${limit}`);
    return response.data;
  },

  // Get popular packages
  getPopularPackages: async (limit = 6) => {
    const response = await api.get(`/packages/popular?limit=${limit}`);
    return response.data;
  },
};

// ========================================
// BOOKINGS API
// ========================================

export const bookingsAPI = {
  // Create new booking
  createBooking: async (bookingData) => {
    const response = await api.post('/bookings', bookingData);
    return response.data;
  },

  // Get user bookings
  getUserBookings: async (params = {}) => {
    const response = await api.get('/bookings', { params });
    return response.data;
  },

  // Get single booking by ID
  getBookingById: async (id) => {
    const response = await api.get(`/bookings/${id}`);
    return response.data;
  },

  // Update booking
  updateBooking: async (id, bookingData) => {
    const response = await api.put(`/bookings/${id}`, bookingData);
    return response.data;
  },

  // Cancel booking
  cancelBooking: async (id, reason) => {
    const response = await api.put(`/bookings/${id}/cancel`, { reason });
    return response.data;
  },

  // Get booking invoice
  getInvoice: async (id) => {
    const response = await api.get(`/bookings/${id}/invoice`, {
      responseType: 'blob',
    });
    return response.data;
  },
};

// ========================================
// REVIEWS API
// ========================================

export const reviewsAPI = {
  // Get package reviews
  getPackageReviews: async (packageId, params = {}) => {
    const response = await api.get(`/reviews/package/${packageId}`, { params });
    return response.data;
  },

  // Create review
  createReview: async (reviewData) => {
    const response = await api.post('/reviews', reviewData);
    return response.data;
  },

  // Update review
  updateReview: async (id, reviewData) => {
    const response = await api.put(`/reviews/${id}`, reviewData);
    return response.data;
  },

  // Delete review
  deleteReview: async (id) => {
    const response = await api.delete(`/reviews/${id}`);
    return response.data;
  },
};

// ========================================
// VENDORS API (For Vendor Dashboard)
// ========================================

export const vendorsAPI = {
  // Get vendor profile
  getProfile: async () => {
    const response = await api.get('/vendors/profile');
    return response.data;
  },

  // Update vendor profile
  updateProfile: async (vendorData) => {
    const response = await api.put('/vendors/profile', vendorData);
    return response.data;
  },

  // Get vendor packages
  getPackages: async (params = {}) => {
    const response = await api.get('/vendors/packages', { params });
    return response.data;
  },

  // Create package
  createPackage: async (packageData) => {
    const response = await api.post('/vendors/packages', packageData);
    return response.data;
  },

  // Update package
  updatePackage: async (id, packageData) => {
    const response = await api.put(`/vendors/packages/${id}`, packageData);
    return response.data;
  },

  // Delete package
  deletePackage: async (id) => {
    const response = await api.delete(`/vendors/packages/${id}`);
    return response.data;
  },

  // Get vendor bookings
  getBookings: async (params = {}) => {
    const response = await api.get('/vendors/bookings', { params });
    return response.data;
  },

  // Get vendor statistics
  getStatistics: async () => {
    const response = await api.get('/vendors/statistics');
    return response.data;
  },
};

// ========================================
// ADMIN API (For Admin Dashboard)
// ========================================

export const adminAPI = {
  // Get all users
  getUsers: async (params = {}) => {
    const response = await api.get('/admin/users', { params });
    return response.data;
  },

  // Get user by ID
  getUserById: async (id) => {
    const response = await api.get(`/admin/users/${id}`);
    return response.data;
  },

  // Update user
  updateUser: async (id, userData) => {
    const response = await api.put(`/admin/users/${id}`, userData);
    return response.data;
  },

  // Delete user
  deleteUser: async (id) => {
    const response = await api.delete(`/admin/users/${id}`);
    return response.data;
  },

  // Get all vendors
  getVendors: async (params = {}) => {
    const response = await api.get('/admin/vendors', { params });
    return response.data;
  },

  // Approve vendor
  approveVendor: async (id) => {
    const response = await api.put(`/admin/vendors/${id}/approve`);
    return response.data;
  },

  // Reject vendor
  rejectVendor: async (id, reason) => {
    const response = await api.put(`/admin/vendors/${id}/reject`, { reason });
    return response.data;
  },

  // Get all packages
  getPackages: async (params = {}) => {
    const response = await api.get('/admin/packages', { params });
    return response.data;
  },

  // Approve package
  approvePackage: async (id) => {
    const response = await api.put(`/admin/packages/${id}/approve`);
    return response.data;
  },

  // Reject package
  rejectPackage: async (id, reason) => {
    const response = await api.put(`/admin/packages/${id}/reject`, { reason });
    return response.data;
  },

  // Toggle featured package
  toggleFeatured: async (id) => {
    const response = await api.put(`/admin/packages/${id}/toggle-featured`);
    return response.data;
  },

  // Toggle popular package
  togglePopular: async (id) => {
    const response = await api.put(`/admin/packages/${id}/toggle-popular`);
    return response.data;
  },

  // Get all bookings
  getBookings: async (params = {}) => {
    const response = await api.get('/admin/bookings', { params });
    return response.data;
  },

  // Get dashboard statistics
  getStatistics: async () => {
    const response = await api.get('/admin/statistics');
    return response.data;
  },

  // Get analytics data
  getAnalytics: async (params = {}) => {
    const response = await api.get('/admin/analytics', { params });
    return response.data;
  },
};

// ========================================
// UPLOAD API (For File Uploads)
// ========================================

export const uploadAPI = {
  // Upload single file
  uploadFile: async (file, folder = 'general') => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder);

    const response = await api.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Upload multiple files
  uploadFiles: async (files, folder = 'general') => {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('files', file);
    });
    formData.append('folder', folder);

    const response = await api.post('/upload/multiple', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Delete file
  deleteFile: async (fileUrl) => {
    const response = await api.delete('/upload', { data: { fileUrl } });
    return response.data;
  },
};

// Export the configured axios instance as default
export default api;
