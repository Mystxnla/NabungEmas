/**
 * adminService.js — Service admin panel
 */

import axiosInstance from './axiosInstance';

export const adminService = {
  // Dashboard
  getStats: () => axiosInstance.get('/admin/dashboard/stats'),

  // Users
  getUsers: (params) => axiosInstance.get('/admin/users', { params }),
  getUser: (id) => axiosInstance.get(`/admin/users/${id}`),
  updateUser: (id, data) => axiosInstance.put(`/admin/users/${id}`, data),
  deleteUser: (id) => axiosInstance.delete(`/admin/users/${id}`),

  // Transactions
  getTransactions: (params) => axiosInstance.get('/admin/transactions', { params }),
  getSellTransactions: (params) => axiosInstance.get('/admin/sell-transactions', { params }),
  getGoals: () => axiosInstance.get('/admin/goals'),

  // Articles
  getArticles: () => axiosInstance.get('/admin/articles'),
  createArticle: (data) => axiosInstance.post('/admin/articles', data),
  updateArticle: (id, data) => axiosInstance.put(`/admin/articles/${id}`, data),
  deleteArticle: (id) => axiosInstance.delete(`/admin/articles/${id}`),

  // Quotes
  getQuotes: () => axiosInstance.get('/admin/quotes'),
  createQuote: (data) => axiosInstance.post('/admin/quotes', data),
  updateQuote: (id, data) => axiosInstance.put(`/admin/quotes/${id}`, data),
  deleteQuote: (id) => axiosInstance.delete(`/admin/quotes/${id}`),

  // Gold Prices
  getGoldPrices: () => axiosInstance.get('/admin/gold-price'),
  createGoldPrice: (data) => axiosInstance.post('/admin/gold-price', data),
  updateGoldPrice: (id, data) => axiosInstance.put(`/admin/gold-price/${id}`, data),
  deleteGoldPrice: (id) => axiosInstance.delete(`/admin/gold-price/${id}`),

  // Stocks
  getStocks: () => axiosInstance.get('/admin/stocks'),
  createStock: (data) => axiosInstance.post('/admin/stocks', data),
  updateStock: (id, data) => axiosInstance.put(`/admin/stocks/${id}`, data),
  deleteStock: (id) => axiosInstance.delete(`/admin/stocks/${id}`),

  // Badges
  getBadges: () => axiosInstance.get('/admin/badges'),
  createBadge: (data) => axiosInstance.post('/admin/badges', data),
  updateBadge: (id, data) => axiosInstance.put(`/admin/badges/${id}`, data),
  deleteBadge: (id) => axiosInstance.delete(`/admin/badges/${id}`),

  // Reports
  getReports: (params) => axiosInstance.get('/admin/reports', { params }),
};
