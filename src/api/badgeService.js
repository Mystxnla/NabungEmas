/**
 * badgeService.js — Service badge pencapaian
 */

import axiosInstance from './axiosInstance';

export const badgeService = {
  getAll: () => axiosInstance.get('/badges'),
  unlock: (badge_code) => axiosInstance.post('/badges', { badge_code }),
};
