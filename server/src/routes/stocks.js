/**
 * stocks.js — Route data saham (publik)
 */

const express = require('express');
const router = express.Router();
const { getAll } = require('../controllers/stockController');

router.get('/', getAll);

module.exports = router;
