import axios from 'axios';

/**
 * API Utility
 * Centralized API configuration and methods for backend communication
 */

// Base API URL - defaults to localhost for development
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
});

// Request interceptor for logging (development only)
api.interceptors.request.use(
  (config) => {
    if (import.meta.env.DEV) {
      console.log(`API Request: ${config.method.toUpperCase()} ${config.url}`);
    }
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Server responded with error status
      console.error('API Error:', error.response.status, error.response.data);
    } else if (error.request) {
      // Request made but no response received
      console.error('Network Error: No response from server');
    } else {
      // Error in request setup
      console.error('Request Error:', error.message);
    }
    return Promise.reject(error);
  }
);

// Menu Items API
export const menuItemsAPI = {
  // Get all menu items
  getAll: () => api.get('/menu-items'),
  
  // Get single menu item
  getById: (id) => api.get(`/menu-items/${id}`),
  
  // Create new menu item
  create: (data) => api.post('/menu-items', data),
  
  // Update menu item
  update: (id, data) => api.put(`/menu-items/${id}`, data),
  
  // Delete menu item
  delete: (id) => api.delete(`/menu-items/${id}`),
};

// Sales API
export const salesAPI = {
  // Get all sales with optional date filtering
  getAll: (params) => api.get('/sales', { params }),
  
  // Get single sale
  getById: (id) => api.get(`/sales/${id}`),
  
  // Create new sale
  create: (data) => api.post('/sales', data),
  
  // Update sale (for date corrections)
  update: (id, data) => api.put(`/sales/${id}`, data),
  
  // Delete sale
  delete: (id) => api.delete(`/sales/${id}`),
  
  // Get sales statistics
  getStats: (period = 'today') => api.get('/sales/stats/summary', { params: { period } }),
};

// Expenses API
export const expensesAPI = {
  // Get all expenses with optional filtering
  getAll: (params) => api.get('/expenses', { params }),
  
  // Get single expense
  getById: (id) => api.get(`/expenses/${id}`),
  
  // Create new expense
  create: (data) => api.post('/expenses', data),
  
  // Update expense
  update: (id, data) => api.put(`/expenses/${id}`, data),
  
  // Delete expense
  delete: (id) => api.delete(`/expenses/${id}`),
  
  // Get expense statistics
  getStats: (period = 'today') => api.get('/expenses/stats/summary', { params: { period } }),
};

// Settings API
export const settingsAPI = {
  // Get current settings
  get: () => api.get('/settings'),
  
  // Update settings
  update: (data) => api.put('/settings', data),
};

// Health check
export const healthCheck = () => api.get('/health');

export default api;
