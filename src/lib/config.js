// API Base URL
export const BASE_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8006';

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
  
  // Ticket endpoints
  TICKET_DETAIL: (id) => `/Ticket/${id}/detail`,
  TICKET_MESSAGES: (id) => `/Ticket/${id}/messages`,
  TICKET_UPDATE: (id) => `/Ticket/${id}`,
  TICKET_CC: (id) => `/Ticket/${id}/cc`,
  TICKET_CC_REMOVE: (id, userId) => `/Ticket/${id}/cc/${userId}`,
  TICKET_FOLLOWERS: (id) => `/Ticket/${id}/followers`,
  TICKET_FOLLOWERS_REMOVE: (id, userId) => `/Ticket/${id}/followers/${userId}`,
  MESSAGE_ATTACHMENTS: (messageId) => `/Ticket/messages/${messageId}/attachments`,
  
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

// JWT token'ı decode et
export const decodeToken = (token) => {
  if (!token) return null;
  
  try {
    // JWT token'ın payload kısmını al (ikinci kısım)
    const parts = token.split('.');
    if (parts.length !== 3) {
      console.error('Geçersiz JWT token formatı');
      return null;
    }
    
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    
    // Base64 decode işlemi
    let jsonPayload;
    try {
      jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
    } catch (e) {
      // Eğer decodeURIComponent başarısız olursa, doğrudan atob kullan
      jsonPayload = atob(base64);
    }
    
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Token decode hatası:', error);
    return null;
  }
};

// Kullanıcı bilgilerini al (token'dan)
export const getCurrentUser = () => {
  const token = getAuthToken();
  if (!token) return null;
  
  const decodedToken = decodeToken(token);
  if (!decodedToken) return null;
  
  // Token'dan kullanıcı bilgilerini çıkar (farklı formatları destekle)
  return {
    name: decodedToken.name || decodedToken.firstName || decodedToken.given_name || decodedToken.first_name || '',
    surname: decodedToken.surname || decodedToken.lastName || decodedToken.family_name || decodedToken.last_name || '',
    email: decodedToken.email || decodedToken.sub || decodedToken.user_email || '',
    role: decodedToken.role || decodedToken.role_name || decodedToken.user_role || '',
    id: decodedToken.id || decodedToken.user_id || decodedToken.sub || decodedToken.userId || ''
  };
};

// Kullanıcı bilgilerini sakla (artık token içinde tutulduğu için bu fonksiyon kullanılmayacak)
export const setCurrentUser = (user) => {
  // Token içinde tutulduğu için localStorage'a ayrıca saklamaya gerek yok
  console.log('Kullanıcı bilgileri artık token içinde tutuluyor');
};

// Kullanıcı bilgilerini sil
export const removeCurrentUser = () => {
  // Token silindiğinde kullanıcı bilgileri de silinmiş olur
  removeAuthToken();
}; 