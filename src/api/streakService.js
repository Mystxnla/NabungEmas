/**
 * streakService.js — Service streak menabung
 */

import axiosInstance from './axiosInstance';

export const streakService = {
  get: () => axiosInstance.get('/streak'),
  update: () => axiosInstance.post('/streak'),
};
