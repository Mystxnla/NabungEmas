/**
 * app.js — Setup Express, CORS, dan semua routes
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();

// ---- Middleware Global ----
app.use((req, res, next) => {
  console.log(`[API REQUEST] ${req.method} ${req.url}`);
  next();
});
app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173', 'http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002', 'http://127.0.0.1:3002'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// ---- Health Check ----
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'GoldTech API berjalan dengan baik 🚀', timestamp: new Date().toISOString() });
});

// ---- Routes Autentikasi ----
app.use('/api/auth', require('./routes/auth'));

// ---- Routes User (butuh login) ----
app.use('/api/transactions', require('./routes/transactions'));
app.use('/api/sell-transactions', require('./routes/sellTransactions'));
app.use('/api/goals', require('./routes/goals'));
app.use('/api/profile', require('./routes/profile'));
app.use('/api/streak', require('./routes/streak'));
app.use('/api/badges', require('./routes/badges'));
app.use('/api/watchlist', require('./routes/watchlist'));

// ---- Routes Publik (tanpa login) ----
app.use('/api/gold-price', require('./routes/goldPrice'));
app.use('/api/articles', require('./routes/articles'));
app.use('/api/quotes', require('./routes/quotes'));
app.use('/api/stocks', require('./routes/stocks'));

// ---- Routes Admin ----
app.use('/api/admin', require('./routes/admin'));

// ---- 404 Handler ----
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Endpoint ${req.method} ${req.path} tidak ditemukan.` });
});

// ---- Error Handler Global ----
app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err);
  res.status(500).json({ success: false, message: 'Terjadi kesalahan server yang tidak terduga.' });
});

module.exports = app;
