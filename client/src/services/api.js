import axios from 'axios';

const getBaseUrl = () => {
  let url = import.meta.env.VITE_API_URL;
  if (!url || url === 'undefined') {
    if (typeof window !== 'undefined' && window.location.hostname.includes('vercel.app')) {
      return 'https://college-management-complaint-system-4.onrender.com/api';
    }
    return '/api';
  }
  url = url.trim().replace(/\/+$/, '');
  if (url.startsWith('http') && !url.endsWith('/api')) {
    url += '/api';
  }
  return url;
};

const api = axios.create({
  baseURL: getBaseUrl(),
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
