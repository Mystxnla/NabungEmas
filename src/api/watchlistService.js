/**
 * watchlistService.js — Service watchlist saham
 */

import axiosInstance from './axiosInstance';

export const watchlistService = {
  get: () => axiosInstance.get('/watchlist'),
  add: (stock_code) => axiosInstance.post('/watchlist', { stock_code }),
  remove: (stock_code) => axiosInstance.delete(`/watchlist/${stock_code}`),
};
