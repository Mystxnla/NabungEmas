/**
 * profileController.js
 * Controller untuk profil user
 */

const bcrypt = require('bcrypt');
const { User } = require('../models');
const { validationResult } = require('express-validator');

const getProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password'] },
    });
    return res.status(200).json({ success: true, data: user });
  } catch (error) {
    console.error('Error getProfile:', error);
    return res.status(500).json({ success: false, message: 'Gagal mengambil profil.' });
  }
};

const updateProfile = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: 'Validasi gagal', errors: errors.array() });
    }

    const user = await User.findByPk(req.user.id);
    const { name, email, current_password, new_password } = req.body;

    // Update nama
    if (name) user.name = name;

    // Update email (cek duplikat)
    if (email && email !== user.email) {
      const existing = await User.findOne({ where: { email } });
      if (existing) {
        return res.status(409).json({ success: false, message: 'Email sudah digunakan oleh pengguna lain.' });
      }
      user.email = email;
    }

    // Update password
    if (new_password) {
      if (!current_password) {
        return res.status(400).json({ success: false, message: 'Password saat ini diperlukan untuk mengubah password.' });
      }
      const isValid = await bcrypt.compare(current_password, user.password);
      if (!isValid) {
        return res.status(400).json({ success: false, message: 'Password saat ini tidak valid.' });
      }
      user.password = await bcrypt.hash(new_password, 12);
    }

    await user.save();

    return res.status(200).json({
      success: true,
      message: 'Profil berhasil diperbarui!',
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        join_date: user.join_date,
      },
    });
  } catch (error) {
    console.error('Error updateProfile:', error);
    return res.status(500).json({ success: false, message: 'Gagal memperbarui profil.' });
  }
};

module.exports = { getProfile, updateProfile };
