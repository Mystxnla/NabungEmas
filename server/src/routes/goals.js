/**
 * goals.js — Route target tabungan (butuh login)
 */

const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { getAll, create, update, remove } = require('../controllers/goalController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

const validateGoal = [
  body('name').trim().notEmpty().withMessage('Nama target wajib diisi'),
  body('target_gram').isFloat({ min: 0.0001 }).withMessage('Target gram tidak valid'),
  body('target_nominal').isFloat({ min: 1 }).withMessage('Target nominal tidak valid'),
  body('deadline').isDate().withMessage('Format deadline tidak valid'),
];

router.get('/', getAll);
router.post('/', validateGoal, create);
router.put('/:id', validateGoal, update);
router.delete('/:id', remove);

module.exports = router;
