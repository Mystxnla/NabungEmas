/**
 * quotes.js — Route kutipan motivasi (publik)
 */

const express = require('express');
const router = express.Router();
const { getRandom, getAll } = require('../controllers/quoteController');

router.get('/random', getRandom);
router.get('/', getAll);

module.exports = router;
