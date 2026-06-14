/**
 * goldPrice.js — Route harga emas (publik)
 */

const express = require('express');
const router = express.Router();
const { getCurrent, getHistory } = require('../controllers/goldPriceController');

router.get('/current', getCurrent);
router.get('/history', getHistory);

module.exports = router;
