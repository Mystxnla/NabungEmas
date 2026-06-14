/**
 * goalService.js — Service CRUD target tabungan
 */

import axiosInstance from './axiosInstance';

export const goalService = {
  getAll: async () => {
    const res = await axiosInstance.get('/goals');
    if (res.data && res.data.data) {
      res.data.data = res.data.data.map(g => ({
        ...g,
        targetGram: g.target_gram,
        targetNominal: g.target_nominal
      }));
    }
    return res;
  },
  create: async (data) => {
    const res = await axiosInstance.post('/goals', {
      ...data,
      target_gram: data.targetGram,
      target_nominal: data.targetNominal
    });
    if (res.data && res.data.data) {
      res.data.data.targetGram = res.data.data.target_gram;
      res.data.data.targetNominal = res.data.data.target_nominal;
    }
    return res;
  },
  update: async (id, data) => {
    const res = await axiosInstance.put(`/goals/${id}`, {
      ...data,
      target_gram: data.targetGram,
      target_nominal: data.targetNominal
    });
    if (res.data && res.data.data) {
      res.data.data.targetGram = res.data.data.target_gram;
      res.data.data.targetNominal = res.data.data.target_nominal;
    }
    return res;
  },
  remove: (id) => axiosInstance.delete(`/goals/${id}`),
};
