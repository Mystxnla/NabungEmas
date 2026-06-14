/**
 * profileService.js — Service profil user
 */

import axiosInstance from './axiosInstance';

export const profileService = {
  get: () => axiosInstance.get('/profile'),
  update: (data) => axiosInstance.put('/profile', data),
};
