import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://industrial-production-inventory-system.onrender.com/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 second timeout for mobile connections
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // Retry on network errors or 5xx errors (up to 2 retries)
    if ((!error.response && error.code !== 'ECONNABORTED') || 
        (error.response && error.response.status >= 500)) {
      if (!originalRequest._retry) {
        originalRequest._retry = true;
        originalRequest._retryCount = (originalRequest._retryCount || 0) + 1;
        
        if (originalRequest._retryCount <= 2) {
          // Wait before retry (exponential backoff)
          await new Promise(resolve => setTimeout(resolve, 1000 * originalRequest._retryCount));
          return api(originalRequest);
        }
      }
    }
    
    if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
      throw new Error('Request timeout. The server may be starting up. Please try again.');
    }
    if (!error.response) {
      throw new Error('Network error. Unable to connect to the server. Please check your internet connection.');
    }
    throw error;
  }
);

export default api;
