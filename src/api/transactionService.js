/**
 * transactionService.js — Service CRUD transaksi beli emas
 */

import axiosInstance from './axiosInstance';

export const transactionService = {
  getAll: async () => {
    const res = await axiosInstance.get('/transactions');
    if (res.data && res.data.data) {
      res.data.data = res.data.data.map(t => ({ ...t, pricePerGram: t.price_per_gram }));
    }
    return res;
  },
  create: async (data) => {
    const res = await axiosInstance.post('/transactions', { ...data, price_per_gram: data.pricePerGram });
    if (res.data && res.data.data) {
      res.data.data.pricePerGram = res.data.data.price_per_gram;
    }
    return res;
  },
  update: async (id, data) => {
    const res = await axiosInstance.put(`/transactions/${id}`, { ...data, price_per_gram: data.pricePerGram });
    if (res.data && res.data.data) {
      res.data.data.pricePerGram = res.data.data.price_per_gram;
    }
    return res;
  },
  remove: (id) => axiosInstance.delete(`/transactions/${id}`),
};
