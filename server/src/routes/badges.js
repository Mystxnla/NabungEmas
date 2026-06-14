/**
 * badges.js — Route badge user (butuh login)
 */

const express = require('express');
const router = express.Router();
const { getUserBadges, unlockBadge } = require('../controllers/badgeController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.get('/', getUserBadges);
router.post('/', unlockBadge);

module.exports = router;
