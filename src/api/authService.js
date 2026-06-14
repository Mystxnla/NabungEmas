/**
 * authService.js — Service untuk autentikasi
 */

import axiosInstance from './axiosInstance';

export const authService = {
  register: (data) => axiosInstance.post('/auth/register', data),
  login: (data) => axiosInstance.post('/auth/login', data),
  getMe: () => axiosInstance.get('/auth/me'),
};
