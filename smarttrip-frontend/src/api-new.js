import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8081';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add JWT token to every request
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

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Try to refresh token
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        return api.post('/auth/refresh', { refreshToken })
          .then((res) => {
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('refreshToken', res.data.refreshToken);
            return api(error.config);
          })
          .catch(() => {
            localStorage.clear();
            window.location.href = '/login';
            return Promise.reject(error);
          });
      } else {
        localStorage.clear();
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// ==================== AUTH ====================
export const authAPI = {
  login: (email, password) => 
    api.post('/auth/login', { email, password }),
  
  register: (name, email, password, role) => 
    api.post('/auth/register', { name, email, password, role }),
  
  refreshToken: (refreshToken) => 
    api.post('/auth/refresh', { refreshToken }),
  
  validate: () => 
    api.get('/auth/validate'),
  
  logout: () => 
    api.post('/auth/logout'),
};

// ==================== PACKAGES ====================
export const packageAPI = {
  getAll: (filters = {}) => 
    api.get('/packages', { params: filters }),
  
  getMyPackages: (agencyId) => 
    api.get(`/packages/agency/${agencyId}`),
  
  getById: (id) => 
    api.get(`/packages/${id}`),
  
  create: (packageData) => 
    api.post('/packages', packageData),
  
  update: (id, packageData) => 
    api.put(`/packages/${id}`, packageData),
  
  deactivate: (id) => 
    api.patch(`/packages/${id}/deactivate`),
  
  search: (query) => 
    api.get('/packages/search', { params: { q: query } }),
};

// ==================== BOOKINGS ====================
export const bookingAPI = {
  getAll: () => 
    api.get('/bookings'),
  
  getById: (id) => 
    api.get(`/bookings/${id}`),
  
  getMyBookings: (userId) => 
    api.get(`/bookings/user/${userId}`),
  
  getByAgency: (agencyId) => 
    api.get(`/bookings/agency/${agencyId}`),
  
  create: (bookingData) => 
    api.post('/bookings', bookingData),
  
  approve: (id) => 
    api.patch(`/bookings/${id}/approve`),
  
  reject: (id) => 
    api.patch(`/bookings/${id}/reject`),
  
  cancel: (id) => 
    api.patch(`/bookings/${id}/cancel`),
};

// ==================== REVIEWS ====================
export const reviewAPI = {
  getByPackage: (packageId) => 
    api.get(`/reviews/package/${packageId}`),
  
  create: (reviewData) => 
    api.post('/reviews', reviewData),
  
  update: (id, reviewData) => 
    api.put(`/reviews/${id}`, reviewData),
  
  delete: (id) => 
    api.delete(`/reviews/${id}`),
};

// ==================== USERS ====================
export const userAPI = {
  getAll: () => 
    api.get('/users'),
  
  getById: (id) => 
    api.get(`/users/${id}`),
  
  getProfile: () => 
    api.get('/users/profile'),
  
  updateProfile: (userData) => 
    api.put('/users/profile', userData),
  
  uploadAvatar: (formData) => 
    api.post('/users/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  
  delete: (id) => 
    api.delete(`/users/${id}`),
};

// ==================== WISHLIST ====================
export const wishlistAPI = {
  getAll: () => 
    api.get('/wishlists'),
  
  add: (packageId) => 
    api.post(`/wishlists/add/${packageId}`),
  
  remove: (packageId) => 
    api.delete(`/wishlists/remove/${packageId}`),
  
  check: (packageId) => 
    api.get(`/wishlists/check/${packageId}`),
};

// ==================== PAYMENTS ====================
export const paymentAPI = {
  createOrder: (bookingId, amount) => 
    api.post('/payments/create-order', { bookingId, amount }),
  
  verifyPayment: (paymentData) => 
    api.post('/payments/verify', paymentData),
  
  getHistory: () => 
    api.get('/payments/history'),
};

// ==================== ANALYTICS ====================
export const analyticsAPI = {
  getDashboard: () => 
    api.get('/analytics/dashboard'),
  
  getBookingStats: () => 
    api.get('/analytics/bookings'),
  
  getRevenueStats: () => 
    api.get('/analytics/revenue'),
  
  getUserStats: () => 
    api.get('/analytics/users'),
};

export default api;
