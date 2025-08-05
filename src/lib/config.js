// API Base URL
export const BASE_URL = process.env.REACT_APP_API_URL || 'http://192.168.1.2:8006';

// API Endpoints
export const API_ENDPOINTS = {
  // Auth endpoints
  LOGIN: '/User/login',
  REGISTER: '/User/register',
  LOGOUT: '/User/logout',
  REFRESH_TOKEN: '/User/refresh',
  
  // User endpoints
  USER_PROFILE: '/User/profile',
  USER_SETTINGS: '/User/settings',
  CHANGE_PASSWORD: '/User/change-password',
  
  // Request endpoints
  REQUESTS: '/requests',
  REQUEST_BY_ID: (id) => `/requests/${id}`,
  REQUEST_STATUS: (id) => `/requests/${id}/status`,
  
  // Other endpoints
  NOTIFICATIONS: '/notifications',
  UPLOAD_FILE: '/upload',
};

// Token yönetimi
export const getAuthToken = () => {
  return localStorage.getItem('authToken');
};

export const setAuthToken = (token) => {
  localStorage.setItem('authToken', token);
};

export const removeAuthToken = () => {
  localStorage.removeItem('authToken');
};

export const isAuthenticated = () => {
  return !!getAuthToken();
};

// Kullanıcı bilgilerini al
export const getCurrentUser = () => {
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
};

// Kullanıcı bilgilerini sakla
export const setCurrentUser = (user) => {
  localStorage.setItem('user', JSON.stringify(user));
};

// Kullanıcı bilgilerini sil
export const removeCurrentUser = () => {
  localStorage.removeItem('user');
}; 