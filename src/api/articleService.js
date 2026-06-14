/**
 * articleService.js — Service artikel edukasi (publik)
 */

import axiosInstance from './axiosInstance';

export const articleService = {
  getAll: (category) => axiosInstance.get('/articles', { params: category ? { category } : {} }),
  getById: (id) => axiosInstance.get(`/articles/${id}`),
};
