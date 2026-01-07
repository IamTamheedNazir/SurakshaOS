import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authAPI } from '../services/api';
import { toast } from 'react-toastify';

const useAuthStore = create(
  persist(
    (set, get) => ({
      // State
      user: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // Actions
      login: async (credentials) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authAPI.login(credentials);
          const { user, token, refreshToken } = response.data;

          set({
            user,
            token,
            refreshToken,
            isAuthenticated: true,
            isLoading: false,
          });

          // Store in localStorage
          localStorage.setItem('token', token);
          localStorage.setItem('refreshToken', refreshToken);
          localStorage.setItem('user', JSON.stringify(user));

          toast.success(`Welcome back, ${user.firstName}!`);
          return { success: true };
        } catch (error) {
          set({ isLoading: false, error: error.message });
          toast.error(error.response?.data?.message || 'Login failed');
          return { success: false, error: error.message };
        }
      },

      register: async (userData) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authAPI.register(userData);
          const { user, token } = response.data;

          set({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
          });

          localStorage.setItem('token', token);
          localStorage.setItem('user', JSON.stringify(user));

          toast.success('Registration successful! Welcome to UmrahConnect!');
          return { success: true };
        } catch (error) {
          set({ isLoading: false, error: error.message });
          toast.error(error.response?.data?.message || 'Registration failed');
          return { success: false, error: error.message };
        }
      },

      logout: async () => {
        try {
          await authAPI.logout();
        } catch (error) {
          console.error('Logout error:', error);
        } finally {
          set({
            user: null,
            token: null,
            refreshToken: null,
            isAuthenticated: false,
          });

          localStorage.removeItem('token');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('user');

          toast.info('Logged out successfully');
        }
      },

      getCurrentUser: async () => {
        set({ isLoading: true });
        try {
          const response = await authAPI.getCurrentUser();
          const { user } = response.data;

          set({
            user,
            isAuthenticated: true,
            isLoading: false,
          });

          localStorage.setItem('user', JSON.stringify(user));
          return { success: true, user };
        } catch (error) {
          set({ isLoading: false, error: error.message });
          return { success: false, error: error.message };
        }
      },

      updateUser: (userData) => {
        set({ user: { ...get().user, ...userData } });
        localStorage.setItem('user', JSON.stringify({ ...get().user, ...userData }));
      },

      // Initialize from localStorage
      initialize: () => {
        const token = localStorage.getItem('token');
        const refreshToken = localStorage.getItem('refreshToken');
        const userStr = localStorage.getItem('user');

        if (token && userStr) {
          try {
            const user = JSON.parse(userStr);
            set({
              user,
              token,
              refreshToken,
              isAuthenticated: true,
            });
          } catch (error) {
            console.error('Failed to parse user data:', error);
            get().logout();
          }
        }
      },

      // Check if user has specific role
      hasRole: (role) => {
        const { user } = get();
        return user?.userType === role;
      },

      // Check if user is vendor
      isVendor: () => {
        return get().hasRole('vendor');
      },

      // Check if user is admin
      isAdmin: () => {
        return get().hasRole('admin');
      },

      // Check if user is customer
      isCustomer: () => {
        return get().hasRole('pilgrim');
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

export default useAuthStore;
