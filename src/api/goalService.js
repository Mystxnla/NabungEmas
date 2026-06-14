/**
 * goalService.js — Service CRUD target tabungan
 */

import axiosInstance from './axiosInstance';

export const goalService = {
  getAll: () => axiosInstance.get('/goals'),
  create: (data) => axiosInstance.post('/goals', data),
  update: (id, data) => axiosInstance.put(`/goals/${id}`, data),
  remove: (id) => axiosInstance.delete(`/goals/${id}`),
};
