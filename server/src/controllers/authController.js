/**
 * authController.js
 * Controller untuk autentikasi: register, login, get profile
 */

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User, UserStreak } = require('../models');
const { validationResult } = require('express-validator');

// Fungsi helper untuk generate token
const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

/**
 * POST /api/auth/register
 * Mendaftarkan user baru
 */
const register = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validasi gagal',
        errors: errors.array(),
      });
    }

    const { name, email, password } = req.body;

    // Cek apakah email sudah terdaftar
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'Email sudah terdaftar. Silakan gunakan email lain atau login.',
      });
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Buat user baru
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role: 'user',
      join_date: new Date().toISOString().split('T')[0],
      is_active: true,
    });

    // Buat record streak awal untuk user
    await UserStreak.create({
      user_id: newUser.id,
      current_streak: 0,
      longest_streak: 0,
      last_save_month: null,
    });

    const token = generateToken(newUser);

    return res.status(201).json({
      success: true,
      message: 'Registrasi berhasil! Selamat datang di GoldTech.',
      data: {
        token,
        user: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
          join_date: newUser.join_date,
        },
      },
    });
  } catch (error) {
    console.error('Error register:', error);
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan server saat registrasi.',
    });
  }
};

/**
 * POST /api/auth/login
 * Login user/admin
 */
const login = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validasi gagal',
        errors: errors.array(),
      });
    }

    const { email, password } = req.body;

    // Cari user berdasarkan email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Email atau password salah.',
      });
    }

    // Cek apakah akun aktif
    if (!user.is_active) {
      return res.status(403).json({
        success: false,
        message: 'Akun Anda telah dinonaktifkan. Hubungi admin untuk bantuan.',
      });
    }

    // Verifikasi password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Email atau password salah.',
      });
    }

    const token = generateToken(user);

    return res.status(200).json({
      success: true,
      message: 'Login berhasil! Selamat datang kembali.',
      data: {
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          join_date: user.join_date,
        },
      },
    });
  } catch (error) {
    console.error('Error login:', error);
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan server saat login.',
    });
  }
};

/**
 * GET /api/auth/me
 * Mendapatkan data user yang sedang login
 */
const getMe = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password'] },
    });

    return res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error('Error getMe:', error);
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan server.',
    });
  }
};

module.exports = { register, login, getMe };
