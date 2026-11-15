import axios from 'axios';

// Automatically uses relative '/api' if on the same Render domain, or full Render URL when running locally
const getBaseURL = () => {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  if (typeof window !== 'undefined' && window.location.origin.includes('onrender.com')) {
    return `${window.location.origin}/api`;
  }
  return 'https://blood-donor-and-blood-bank-management.onrender.com/api';
};

const api = axios.create({
  baseURL: getBaseURL(),
});

// Attach JWT token from localStorage to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('healthtech_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
