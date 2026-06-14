/**
 * sellTransactionService.js — Service CRUD transaksi jual emas
 */

import axiosInstance from './axiosInstance';

export const sellTransactionService = {
  getAll: async () => {
    const res = await axiosInstance.get('/sell-transactions');
    if (res.data && res.data.data) {
      res.data.data = res.data.data.map(t => ({ ...t, pricePerGram: t.price_per_gram }));
    }
    return res;
  },
  create: async (data) => {
    const res = await axiosInstance.post('/sell-transactions', { ...data, price_per_gram: data.pricePerGram });
    if (res.data && res.data.data) {
      res.data.data.pricePerGram = res.data.data.price_per_gram;
    }
    return res;
  },
  remove: (id) => axiosInstance.delete(`/sell-transactions/${id}`),
};
