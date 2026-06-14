/**
 * transactionService.js — Service CRUD transaksi beli emas
 */

import axiosInstance from './axiosInstance';

export const transactionService = {
  getAll: () => axiosInstance.get('/transactions'),
  create: (data) => axiosInstance.post('/transactions', data),
  update: (id, data) => axiosInstance.put(`/transactions/${id}`, data),
  remove: (id) => axiosInstance.delete(`/transactions/${id}`),
};
