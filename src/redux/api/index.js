import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Products API
export const productsAPI = {
  getAll: (page = 1, limit = 10, search = '') => {
    const params = new URLSearchParams({ page, limit });
    if (search) params.append('search', search);
    return api.get(`/products/getProducts?${params}`);
  },
  create: (data) => {
    // Map image field to imageUrl for backend compatibility
    const productData = {
      ...data,
      imageUrl: data.image || data.imageUrl
    };
    delete productData.image;
    return api.post('/products/create', productData);
  },
  update: (id, data) => {
    const productData = {
      ...data,
      imageUrl: data.image || data.imageUrl
    };
    delete productData.image;
    return api.put(`/products/${id}`, productData);
  },
  delete: (id) => api.delete(`/products/${id}`),
};

// Dashboard API
export const dashboardAPI = {
  getStats: () => api.get('/admin/dashboard/stats'),
  getAnalytics: () => api.get('/admin/analytics/products'),
};

// Complaints API
export const complaintsAPI = {
  getAll: () => api.get('/admin/complaints'),
  update: (id, data) => api.put(`/admin/complaints/${id}`, data),
  delete: (id) => api.delete(`/admin/complaints/${id}`),
};

export default api;