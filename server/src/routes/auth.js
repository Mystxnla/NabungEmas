/**
 * auth.js — Route autentikasi
 */

const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { register, login, getMe } = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

// POST /api/auth/register
router.post('/register', [
  body('name').trim().notEmpty().withMessage('Nama wajib diisi').isLength({ min: 2, max: 100 }).withMessage('Nama harus 2-100 karakter'),
  body('email').isEmail().withMessage('Format email tidak valid').normalizeEmail(),
  body('password').isLength({ min: 6 }).withMessage('Password minimal 6 karakter'),
], register);

// POST /api/auth/login
router.post('/login', [
  body('email').isEmail().withMessage('Format email tidak valid').normalizeEmail(),
  body('password').notEmpty().withMessage('Password wajib diisi'),
], login);

// GET /api/auth/me (butuh login)
router.get('/me', authMiddleware, getMe);

module.exports = router;
