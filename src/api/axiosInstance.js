/**
 * axiosInstance.js
 * Instance axios terpusat untuk semua request ke backend GoldTech API
 */

import axios from 'axios';

const API_BASE_URL = 'http://localhost:5050/api';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor — sisipkan token JWT ke setiap request
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('goldtech_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor — handle token expired
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired atau tidak valid — logout otomatis
      localStorage.removeItem('goldtech_token');
      localStorage.removeItem('goldtech_user');
      // Redirect ke login jika bukan di halaman publik
      if (!window.location.pathname.startsWith('/admin')) {
        window.location.href = '/login';
      } else {
        window.location.href = '/admin/login';
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
