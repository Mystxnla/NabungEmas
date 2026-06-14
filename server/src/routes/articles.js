/**
 * articles.js — Route artikel edukasi (publik)
 */

const express = require('express');
const router = express.Router();
const { getAll, getById } = require('../controllers/articleController');

router.get('/', getAll);
router.get('/:id', getById);

module.exports = router;
