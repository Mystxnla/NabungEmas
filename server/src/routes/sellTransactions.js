/**
 * sellTransactions.js — Route transaksi JUAL emas (butuh login)
 */

const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { getAll, create, remove } = require('../controllers/sellTransactionController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

const validateSell = [
  body('date').isDate().withMessage('Format tanggal tidak valid'),
  body('gram').isFloat({ min: 0.0001 }).withMessage('Gram harus lebih dari 0'),
  body('price_per_gram').isFloat({ min: 1 }).withMessage('Harga per gram tidak valid'),
];

router.get('/', getAll);
router.post('/', validateSell, create);
router.delete('/:id', remove);

module.exports = router;
