/**
 * quoteService.js — Service kutipan motivasi (publik)
 */

import axiosInstance from './axiosInstance';

export const quoteService = {
  getRandom: () => axiosInstance.get('/quotes/random'),
  getAll: () => axiosInstance.get('/quotes'),
};
