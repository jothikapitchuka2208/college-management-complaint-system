import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: attach token
api.interceptors.request.use(
  (config) => {
    const authData = localStorage.getItem('ccms_auth');
    if (authData) {
      try {
        const { token } = JSON.parse(authData);
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch (e) {
        // ignore parse error
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: extract error messages
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const customMessage =
      error.response?.data?.message ||
      error.message ||
      'An unexpected network error occurred';
    
    // Auto logout on 401 token invalid
    if (error.response?.status === 401 && !window.location.pathname.includes('/login')) {
      localStorage.removeItem('ccms_auth');
      window.location.href = '/login';
    }

    return Promise.reject({
      status: error.response?.status,
      message: customMessage,
      errorCode: error.response?.data?.errorCode,
      errors: error.response?.data?.errors,
    });
  }
);

export default api;
