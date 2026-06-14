/**
 * authMiddleware.js
 * Middleware untuk memverifikasi JWT token.
 * Digunakan di semua route yang membutuhkan login.
 */

const jwt = require('jsonwebtoken');
const { User } = require('../models');

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Akses ditolak. Token tidak ditemukan.',
      });
    }

    const token = authHeader.split(' ')[1];

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(401).json({
        success: false,
        message: 'Token tidak valid atau sudah kedaluwarsa. Silakan login ulang.',
      });
    }

    // Cek apakah user masih ada dan aktif di database
    const user = await User.findByPk(decoded.id, {
      attributes: ['id', 'name', 'email', 'role', 'is_active'],
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Pengguna tidak ditemukan.',
      });
    }

    if (!user.is_active) {
      return res.status(403).json({
        success: false,
        message: 'Akun Anda telah dinonaktifkan. Hubungi admin.',
      });
    }

    // Simpan data user ke request untuk digunakan controller
    req.user = user;
    next();
  } catch (error) {
    console.error('Error authMiddleware:', error);
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan server saat verifikasi token.',
    });
  }
};

module.exports = authMiddleware;
