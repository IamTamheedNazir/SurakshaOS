import axios from 'axios';

// Create axios instance with base configuration using Vite environment variables
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: import.meta.env.VITE_API_TIMEOUT || 30000,
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
  getActiveBanners: async () => {
    const response = await api.get('/banners/active');
    return response.data;
  },
  getAllBanners: async () => {
    const response = await api.get('/banners');
    return response.data;
  },
  getBanner: async (id) => {
    const response = await api.get(`/banners/${id}`);
    return response.data;
  },
  createBanner: async (data) => {
    const response = await api.post('/banners', data);
    return response.data;
  },
  updateBanner: async (id, data) => {
    const response = await api.put(`/banners/${id}`, data);
    return response.data;
  },
  deleteBanner: async (id) => {
    const response = await api.delete(`/banners/${id}`);
    return response.data;
  },
  reorderBanners: async (bannerId, direction) => {
    const response = await api.put(`/banners/${bannerId}/reorder`, { direction });
    return response.data;
  },
};

// ========================================
// CMS API - THEMES
// ========================================

export const themesAPI = {
  getActiveTheme: async () => {
    const response = await api.get('/themes/active');
    return response.data;
  },
  getAllThemes: async () => {
    const response = await api.get('/themes');
    return response.data;
  },
  getTheme: async (id) => {
    const response = await api.get(`/themes/${id}`);
    return response.data;
  },
  createTheme: async (data) => {
    const response = await api.post('/themes', data);
    return response.data;
  },
  updateTheme: async (id, data) => {
    const response = await api.put(`/themes/${id}`, data);
    return response.data;
  },
  deleteTheme: async (id) => {
    const response = await api.delete(`/themes/${id}`);
    return response.data;
  },
  activateTheme: async (id) => {
    const response = await api.put(`/themes/${id}/activate`);
    return response.data;
  },
};

// ========================================
// CMS API - SETTINGS
// ========================================

export const settingsAPI = {
  getPublicSettings: async () => {
    const response = await api.get('/settings/public');
    return response.data;
  },
  getSiteSettings: async () => {
    const response = await api.get('/settings');
    return response.data;
  },
  updateSiteSettings: async (data) => {
    const response = await api.put('/settings', data);
    return response.data;
  },
};

// ========================================
// CMS API - TESTIMONIALS
// ========================================

export const testimonialsAPI = {
  getFeaturedTestimonials: async () => {
    const response = await api.get('/testimonials/featured');
    return response.data;
  },
  getAllTestimonials: async (params = {}) => {
    const response = await api.get('/testimonials', { params });
    return response.data;
  },
  getTestimonial: async (id) => {
    const response = await api.get(`/testimonials/${id}`);
    return response.data;
  },
  createTestimonial: async (data) => {
    const response = await api.post('/testimonials', data);
    return response.data;
  },
  updateTestimonial: async (id, data) => {
    const response = await api.put(`/testimonials/${id}`, data);
    return response.data;
  },
  deleteTestimonial: async (id) => {
    const response = await api.delete(`/testimonials/${id}`);
    return response.data;
  },
};

// ========================================
// AUTH API
// ========================================

export const authAPI = {
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },
  getCurrentUser: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },
  logout: async () => {
    const response = await api.post('/auth/logout');
    return response.data;
  },
  forgotPassword: async (email) => {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data;
  },
  resetPassword: async (token, password) => {
    const response = await api.post(`/auth/reset-password/${token}`, { password });
    return response.data;
  },
};

// ========================================
// USERS API
// ========================================

export const usersAPI = {
  getProfile: async () => {
    const response = await api.get('/users/profile');
    return response.data;
  },
  updateProfile: async (userData) => {
    const response = await api.put('/users/profile', userData);
    return response.data;
  },
  updatePassword: async (passwordData) => {
    const response = await api.put('/users/password', passwordData);
    return response.data;
  },
  deleteAccount: async () => {
    const response = await api.delete('/users/account');
    return response.data;
  },
};

// ========================================
// PACKAGES API
// ========================================

export const packagesAPI = {
  getAllPackages: async (params = {}) => {
    const response = await api.get('/packages', { params });
    return response.data;
  },
  getFeaturedPackages: async () => {
    const response = await api.get('/packages/featured');
    return response.data;
  },
  getPopularPackages: async () => {
    const response = await api.get('/packages/popular');
    return response.data;
  },
  getPackage: async (id) => {
    const response = await api.get(`/packages/${id}`);
    return response.data;
  },
  searchPackages: async (query) => {
    const response = await api.get('/packages/search', { params: { q: query } });
    return response.data;
  },
};

// ========================================
// BOOKINGS API
// ========================================

export const bookingsAPI = {
  createBooking: async (bookingData) => {
    const response = await api.post('/bookings', bookingData);
    return response.data;
  },
  getUserBookings: async () => {
    const response = await api.get('/bookings/my-bookings');
    return response.data;
  },
  getBooking: async (id) => {
    const response = await api.get(`/bookings/${id}`);
    return response.data;
  },
  cancelBooking: async (id) => {
    const response = await api.put(`/bookings/${id}/cancel`);
    return response.data;
  },
  downloadInvoice: async (id) => {
    const response = await api.get(`/bookings/${id}/invoice`, {
      responseType: 'blob',
    });
    return response.data;
  },
};

// ========================================
// PAYMENTS API
// ========================================

export const paymentsAPI = {
  createPaymentOrder: async (bookingId, paymentData) => {
    const response = await api.post(`/payments/create-order/${bookingId}`, paymentData);
    return response.data;
  },
  verifyPayment: async (paymentData) => {
    const response = await api.post('/payments/verify', paymentData);
    return response.data;
  },
  getPaymentStatus: async (bookingId) => {
    const response = await api.get(`/payments/status/${bookingId}`);
    return response.data;
  },
  getPaymentMethods: async () => {
    const response = await api.get('/payments/methods');
    return response.data;
  },
};

// ========================================
// DOCUMENTS API
// ========================================

export const documentsAPI = {
  getUserDocuments: async () => {
    const response = await api.get('/documents/my-documents');
    return response.data;
  },
  uploadDocument: async (documentData) => {
    const formData = new FormData();
    formData.append('file', documentData.file);
    formData.append('type', documentData.type);
    formData.append('bookingId', documentData.bookingId);

    const response = await api.post('/documents/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
  getDocument: async (id) => {
    const response = await api.get(`/documents/${id}`);
    return response.data;
  },
  deleteDocument: async (id) => {
    const response = await api.delete(`/documents/${id}`);
    return response.data;
  },
  downloadDocument: async (id) => {
    const response = await api.get(`/documents/${id}/download`, {
      responseType: 'blob',
    });
    return response.data;
  },
};

// ========================================
// REVIEWS API
// ========================================

export const reviewsAPI = {
  getPackageReviews: async (packageId) => {
    const response = await api.get(`/reviews/package/${packageId}`);
    return response.data;
  },
  createReview: async (reviewData) => {
    const response = await api.post('/reviews', reviewData);
    return response.data;
  },
  updateReview: async (id, reviewData) => {
    const response = await api.put(`/reviews/${id}`, reviewData);
    return response.data;
  },
  deleteReview: async (id) => {
    const response = await api.delete(`/reviews/${id}`);
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
  getPackages: async () => {
    const response = await api.get('/vendor/packages');
    return response.data;
  },
  createPackage: async (packageData) => {
    const response = await api.post('/vendor/packages', packageData);
    return response.data;
  },
  updatePackage: async (id, packageData) => {
    const response = await api.put(`/vendor/packages/${id}`, packageData);
    return response.data;
  },
  deletePackage: async (id) => {
    const response = await api.delete(`/vendor/packages/${id}`);
    return response.data;
  },
  getBookings: async () => {
    const response = await api.get('/vendor/bookings');
    return response.data;
  },
  confirmBooking: async (id) => {
    const response = await api.put(`/vendor/bookings/${id}/confirm`);
    return response.data;
  },
  getEarnings: async () => {
    const response = await api.get('/vendor/earnings');
    return response.data;
  },
};

// ========================================
// ADMIN API
// ========================================

export const adminAPI = {
  getUsers: async (params = {}) => {
    const response = await api.get('/admin/users', { params });
    return response.data;
  },
  getVendors: async (params = {}) => {
    const response = await api.get('/admin/vendors', { params });
    return response.data;
  },
  approveVendor: async (id) => {
    const response = await api.put(`/admin/vendors/${id}/approve`);
    return response.data;
  },
  rejectVendor: async (id, reason) => {
    const response = await api.put(`/admin/vendors/${id}/reject`, { reason });
    return response.data;
  },
  getPackages: async (params = {}) => {
    const response = await api.get('/admin/packages', { params });
    return response.data;
  },
  approvePackage: async (id) => {
    const response = await api.put(`/admin/packages/${id}/approve`);
    return response.data;
  },
  rejectPackage: async (id, reason) => {
    const response = await api.put(`/admin/packages/${id}/reject`, { reason });
    return response.data;
  },
  toggleFeatured: async (id) => {
    const response = await api.put(`/admin/packages/${id}/toggle-featured`);
    return response.data;
  },
  togglePopular: async (id) => {
    const response = await api.put(`/admin/packages/${id}/toggle-popular`);
    return response.data;
  },
  getBookings: async (params = {}) => {
    const response = await api.get('/admin/bookings', { params });
    return response.data;
  },
  getStatistics: async () => {
    const response = await api.get('/admin/statistics');
    return response.data;
  },
  getAnalytics: async (params = {}) => {
    const response = await api.get('/admin/analytics', { params });
    return response.data;
  },
};

// ========================================
// UPLOAD API (For File Uploads)
// ========================================

export const uploadAPI = {
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
  deleteFile: async (fileUrl) => {
    const response = await api.delete('/upload', { data: { fileUrl } });
    return response.data;
  },
};

// Export the configured axios instance as default
export default api;
