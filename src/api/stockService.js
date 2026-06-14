/**
 * stockService.js — Service data saham (publik)
 */

import axiosInstance from './axiosInstance';

export const stockService = {
  getAll: () => axiosInstance.get('/stocks'),
};
