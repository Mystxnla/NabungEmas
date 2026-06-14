/**
 * sellTransactionService.js — Service CRUD transaksi jual emas
 */

import axiosInstance from './axiosInstance';

export const sellTransactionService = {
  getAll: () => axiosInstance.get('/sell-transactions'),
  create: (data) => axiosInstance.post('/sell-transactions', data),
  remove: (id) => axiosInstance.delete(`/sell-transactions/${id}`),
};
