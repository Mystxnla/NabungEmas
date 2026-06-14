/**
 * admin.js — Route admin panel (butuh login + role admin)
 */

const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');
const admin = require('../controllers/adminController');

// Semua route admin butuh auth + role admin
router.use(authMiddleware, adminMiddleware);

// Dashboard Stats
router.get('/dashboard/stats', admin.getDashboardStats);

// User Management
router.get('/users', admin.getAllUsers);
router.get('/users/:id', admin.getUserById);
router.put('/users/:id', admin.updateUser);
router.delete('/users/:id', admin.deleteUser);

// Transactions (read-only untuk admin, user yang CRUD)
router.get('/transactions', admin.getAllTransactions);
router.get('/sell-transactions', admin.getAllSellTransactions);
router.get('/goals', admin.getAllGoals);

// Article Management
router.get('/articles', admin.getAllArticlesAdmin);
router.post('/articles', admin.createArticle);
router.put('/articles/:id', admin.updateArticle);
router.delete('/articles/:id', admin.deleteArticle);

// Quote Management
router.get('/quotes', admin.getAllQuotesAdmin);
router.post('/quotes', admin.createQuote);
router.put('/quotes/:id', admin.updateQuote);
router.delete('/quotes/:id', admin.deleteQuote);

// Gold Price Management
router.get('/gold-price', admin.getAllGoldPricesAdmin);
router.post('/gold-price', admin.createGoldPrice);
router.put('/gold-price/:id', admin.updateGoldPrice);
router.delete('/gold-price/:id', admin.deleteGoldPrice);

// Stock Management
router.get('/stocks', admin.getAllStocksAdmin);
router.post('/stocks', admin.createStock);
router.put('/stocks/:id', admin.updateStock);
router.delete('/stocks/:id', admin.deleteStock);

// Badge Management
router.get('/badges', admin.getAllBadgesAdmin);
router.post('/badges', admin.createBadge);
router.put('/badges/:id', admin.updateBadge);
router.delete('/badges/:id', admin.deleteBadge);

// Reports
router.get('/reports', admin.getReports);

module.exports = router;
