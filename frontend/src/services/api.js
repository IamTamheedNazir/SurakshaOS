import axios from 'axios';
import { toast } from 'react-toastify';

// Create axios instance
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api/v1',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Add auth token
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

// Response interceptor - Handle errors
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 Unauthorized
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
          const response = await axios.post(
            `${process.env.REACT_APP_API_URL}/auth/refresh-token`,
            { refreshToken }
          );

          const { token } = response.data.data;
          localStorage.setItem('token', token);

          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Refresh token failed, logout user
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    // Handle other errors
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      'Something went wrong';

    toast.error(errorMessage);

    return Promise.reject(error);
  }
);

// ============================================
// AUTH API
// ============================================

export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  logout: () => api.post('/auth/logout'),
  getCurrentUser: () => api.get('/auth/me'),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword: (data) => api.post('/auth/reset-password', data),
  verifyEmail: (token) => api.post('/auth/verify-email', { token }),
  sendOTP: (phone) => api.post('/auth/send-otp', { phone }),
  verifyPhone: (data) => api.post('/auth/verify-phone', data),
};

// ============================================
// PACKAGES API
// ============================================

export const packagesAPI = {
  getAll: (params) => api.get('/packages', { params }),
  getById: (id) => api.get(`/packages/${id}`),
  search: (params) => api.get('/packages/search', { params }),
  getFeatured: () => api.get('/packages/featured'),
  getByVendor: (vendorId) => api.get(`/packages/vendor/${vendorId}`),
};

// ============================================
// BOOKINGS API
// ============================================

export const bookingsAPI = {
  create: (data) => api.post('/bookings', data),
  getAll: (params) => api.get('/bookings', { params }),
  getById: (id) => api.get(`/bookings/${id}`),
  getByNumber: (bookingNumber) => api.get(`/bookings/number/${bookingNumber}`),
  update: (id, data) => api.put(`/bookings/${id}`, data),
  cancel: (id, reason) => api.post(`/bookings/${id}/cancel`, { reason }),
  uploadDocument: (id, formData) =>
    api.post(`/bookings/${id}/documents`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  getDocuments: (id) => api.get(`/bookings/${id}/documents`),
  getVisaStatus: (id) => api.get(`/bookings/${id}/visa-status`),
};

// ============================================
// PAYMENTS API
// ============================================

export const paymentsAPI = {
  createOrder: (bookingId, amount) =>
    api.post('/payments/create-order', { bookingId, amount }),
  verifyPayment: (data) => api.post('/payments/verify', data),
  getByBooking: (bookingId) => api.get(`/payments/booking/${bookingId}`),
  getPaymentSchedule: (bookingId) =>
    api.get(`/payments/schedule/${bookingId}`),
};

// ============================================
// REVIEWS API
// ============================================

export const reviewsAPI = {
  create: (data) => api.post('/reviews', data),
  getByPackage: (packageId) => api.get(`/reviews/package/${packageId}`),
  getByVendor: (vendorId) => api.get(`/reviews/vendor/${vendorId}`),
  update: (id, data) => api.put(`/reviews/${id}`, data),
  delete: (id) => api.delete(`/reviews/${id}`),
  markHelpful: (id) => api.post(`/reviews/${id}/helpful`),
};

// ============================================
// VENDORS API
// ============================================

export const vendorsAPI = {
  getAll: (params) => api.get('/vendors', { params }),
  getById: (id) => api.get(`/vendors/${id}`),
  getProfile: () => api.get('/vendors/profile'),
  updateProfile: (data) => api.put('/vendors/profile', data),
  getStats: () => api.get('/vendors/stats'),
  getBookings: (params) => api.get('/vendors/bookings', { params }),
  getCustomers: (params) => api.get('/vendors/customers', { params }),
};

// ============================================
// USERS API
// ============================================

export const usersAPI = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (data) => api.put('/users/profile', data),
  changePassword: (data) => api.post('/users/change-password', data),
  uploadAvatar: (formData) =>
    api.post('/users/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  getBookings: (params) => api.get('/users/bookings', { params }),
  getNotifications: (params) => api.get('/users/notifications', { params }),
  markNotificationRead: (id) => api.put(`/users/notifications/${id}/read`),
};

// ============================================
// NOTIFICATIONS API
// ============================================

export const notificationsAPI = {
  getAll: (params) => api.get('/notifications', { params }),
  markAsRead: (id) => api.put(`/notifications/${id}/read`),
  markAllAsRead: () => api.put('/notifications/read-all'),
  delete: (id) => api.delete(`/notifications/${id}`),
};

// ============================================
// AFFILIATES API
// ============================================

export const affiliatesAPI = {
  getProfile: () => api.get('/affiliates/profile'),
  generateCode: () => api.post('/affiliates/generate-code'),
  getStats: () => api.get('/affiliates/stats'),
  getReferrals: (params) => api.get('/affiliates/referrals', { params }),
  getEarnings: (params) => api.get('/affiliates/earnings', { params }),
  requestPayout: (data) => api.post('/affiliates/payout', data),
};

export default api;
