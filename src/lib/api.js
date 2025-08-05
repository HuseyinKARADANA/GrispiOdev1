import { BASE_URL, getAuthToken } from './config';

// API isteği yapan yardımcı fonksiyon
export const apiRequest = async (endpoint, options = {}) => {
  const token = getAuthToken();
  
  const defaultHeaders = {
    'Content-Type': 'application/json',
  };

  // Token varsa Authorization header'ı ekle
  if (token) {
    defaultHeaders.Authorization = `Bearer ${token}`;
  }

  const config = {
    method: options.method || 'GET',
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
    ...options,
  };

  // Body varsa JSON'a çevir
  if (options.body) {
    config.body = JSON.stringify(options.body);
  }

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, config);
    
    // 401 hatası varsa token'ı sil ve login sayfasına yönlendir
    if (response.status === 401) {
      localStorage.removeItem('authToken');
      window.location.href = '/login';
      return;
    }

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Bir hata oluştu');
    }

    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// GET isteği
export const apiGet = (endpoint) => {
  return apiRequest(endpoint, { method: 'GET' });
};

// POST isteği
export const apiPost = (endpoint, data) => {
  return apiRequest(endpoint, { 
    method: 'POST', 
    body: data 
  });
};

// PUT isteği
export const apiPut = (endpoint, data) => {
  return apiRequest(endpoint, { 
    method: 'PUT', 
    body: data 
  });
};

// DELETE isteği
export const apiDelete = (endpoint) => {
  return apiRequest(endpoint, { method: 'DELETE' });
};

// PATCH isteği
export const apiPatch = (endpoint, data) => {
  return apiRequest(endpoint, { 
    method: 'PATCH', 
    body: data 
  });
}; 