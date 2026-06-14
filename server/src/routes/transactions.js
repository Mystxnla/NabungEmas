/**
 * transactions.js — Route transaksi BELI emas (butuh login)
 */

const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { getAll, create, update, remove } = require('../controllers/transactionController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware); // Semua route butuh login

const validateTransaction = [
  body('date').isDate().withMessage('Format tanggal tidak valid (YYYY-MM-DD)'),
  body('gram').isFloat({ min: 0.0001 }).withMessage('Gram harus lebih dari 0'),
  body('price_per_gram').isFloat({ min: 1 }).withMessage('Harga per gram tidak valid'),
];

router.get('/', getAll);
router.post('/', validateTransaction, create);
router.put('/:id', validateTransaction, update);
router.delete('/:id', remove);

module.exports = router;
