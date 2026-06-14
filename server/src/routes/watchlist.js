/**
 * watchlist.js — Route watchlist saham (butuh login)
 */

const express = require('express');
const router = express.Router();
const { getWatchlist, addToWatchlist, removeFromWatchlist } = require('../controllers/watchlistController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.get('/', getWatchlist);
router.post('/', addToWatchlist);
router.delete('/:stock_code', removeFromWatchlist);

module.exports = router;
