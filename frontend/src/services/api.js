import axios from 'axios';
import Cookies from 'js-cookie';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = Cookies.get('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const authService = {
  register: (username, email, password, role) =>
    api.post('/auth/register', { username, email, password, role }),
  
  login: (username, password) =>
    api.post('/auth/login', { username, password }),
  
  registerDevice: (device_id, device_name, device_type) =>
    api.post('/auth/device/register', { device_id, device_name, device_type }),
};

export const outbreakService = {
  uploadResult: (data) =>
    api.post('/outbreak/uploadResult', data),
  
  getRecentOutbreaks: (limit = 100, offset = 0) =>
    api.get('/outbreak/recent', { params: { limit, offset } }),
  
  getOutbreakById: (id) =>
    api.get(`/outbreak/${id}`),
  
  updateDeviceHealth: (device_id, battery_level, connectivity_status) =>
    api.post('/outbreak/device/health', {
      device_id,
      battery_level,
      connectivity_status,
    }),
};

export const analyticsService = {
  getDashboard: () =>
    api.get('/analytics/dashboard'),
  
  getHeatmap: (startDate, endDate, minConfidence = 0) =>
    api.get('/analytics/heatmap', { params: { startDate, endDate, minConfidence } }),
  
  getClusters: (startDate, endDate, zoom = 5) =>
    api.get('/analytics/clusters', { params: { startDate, endDate, zoom } }),
  
  getPathogenTrend: (pathogen, days = 30) =>
    api.get('/analytics/trend/' + pathogen, { params: { days } }),
  
  getCountyStats: () =>
    api.get('/analytics/counties'),
  
  getForecast: (pathogen, days = 7) =>
    api.get('/analytics/forecast', { params: { pathogen, days } }),
};

export const adminService = {
  getAuditLogs: (limit = 500, offset = 0, device_id = null) =>
    api.get('/admin/audit-logs', { params: { limit, offset, device_id } }),
  
  getDuplicateReport: () =>
    api.get('/admin/duplicates'),
  
  getDeviceReport: () =>
    api.get('/admin/devices'),
  
  getUserReport: () =>
    api.get('/admin/users'),
  
  getOutbreakAuditTrail: (outbreak_id) =>
    api.get(`/admin/outbreaks/${outbreak_id}/audit`),
  
  getSystemHealth: () =>
    api.get('/admin/health'),
};

export default api;
