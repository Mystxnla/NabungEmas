/**
 * streak.js — Route streak menabung (butuh login)
 */

const express = require('express');
const router = express.Router();
const { getStreak, updateStreak } = require('../controllers/streakController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.get('/', getStreak);
router.post('/', updateStreak);

module.exports = router;
