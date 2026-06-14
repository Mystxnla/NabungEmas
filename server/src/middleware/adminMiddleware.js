/**
 * adminMiddleware.js
 * Middleware untuk memverifikasi bahwa user yang login adalah admin.
 * Harus digunakan SETELAH authMiddleware.
 */

const adminMiddleware = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Tidak terautentikasi. Silakan login terlebih dahulu.',
    });
  }

  if (req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Akses ditolak. Fitur ini hanya untuk admin.',
    });
  }

  next();
};

module.exports = adminMiddleware;
