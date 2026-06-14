/**
 * goldPriceService.js — Service harga emas (publik)
 */

import axiosInstance from './axiosInstance';

export const goldPriceService = {
  getCurrent: () => axiosInstance.get('/gold-price/current'),
  getHistory: (days = 365) => axiosInstance.get(`/gold-price/history?days=${days}`),
};
