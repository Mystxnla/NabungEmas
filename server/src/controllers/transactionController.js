/**
 * transactionController.js
 * Controller untuk transaksi BELI emas (ter-scope ke user yang login)
 */

const { GoldTransaction, UserStreak } = require('../models');
const { validationResult } = require('express-validator');
const { Op } = require('sequelize');

/**
 * GET /api/transactions
 * Ambil semua transaksi beli milik user yang login
 */
const getAll = async (req, res) => {
  try {
    const transactions = await GoldTransaction.findAll({
      where: { user_id: req.user.id },
      order: [['date', 'DESC'], ['createdAt', 'DESC']],
    });

    return res.status(200).json({ success: true, data: transactions });
  } catch (error) {
    console.error('Error getAll transactions:', error);
    return res.status(500).json({ success: false, message: 'Gagal mengambil data transaksi.' });
  }
};

/**
 * POST /api/transactions
 * Tambah transaksi beli baru
 */
const create = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: 'Validasi gagal', errors: errors.array() });
    }

    const { date, gram, price_per_gram, total, note } = req.body;

    const transaction = await GoldTransaction.create({
      user_id: req.user.id,
      date,
      gram: parseFloat(gram),
      price_per_gram: parseFloat(price_per_gram),
      total: parseFloat(total) || parseFloat(gram) * parseFloat(price_per_gram),
      note: note || '',
    });

    // Update streak menabung
    await updateUserStreak(req.user.id);

    return res.status(201).json({
      success: true,
      message: 'Transaksi beli emas berhasil ditambahkan!',
      data: transaction,
    });
  } catch (error) {
    console.error('Error create transaction:', error);
    return res.status(500).json({ success: false, message: 'Gagal menambahkan transaksi.' });
  }
};

/**
 * PUT /api/transactions/:id
 * Update transaksi beli
 */
const update = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: 'Validasi gagal', errors: errors.array() });
    }

    const transaction = await GoldTransaction.findOne({
      where: { id: req.params.id, user_id: req.user.id },
    });

    if (!transaction) {
      return res.status(404).json({ success: false, message: 'Transaksi tidak ditemukan.' });
    }

    const { date, gram, price_per_gram, total, note } = req.body;
    await transaction.update({
      date: date || transaction.date,
      gram: parseFloat(gram) || transaction.gram,
      price_per_gram: parseFloat(price_per_gram) || transaction.price_per_gram,
      total: parseFloat(total) || parseFloat(gram) * parseFloat(price_per_gram) || transaction.total,
      note: note !== undefined ? note : transaction.note,
    });

    return res.status(200).json({
      success: true,
      message: 'Transaksi berhasil diperbarui!',
      data: transaction,
    });
  } catch (error) {
    console.error('Error update transaction:', error);
    return res.status(500).json({ success: false, message: 'Gagal memperbarui transaksi.' });
  }
};

/**
 * DELETE /api/transactions/:id
 * Hapus transaksi beli
 */
const remove = async (req, res) => {
  try {
    const transaction = await GoldTransaction.findOne({
      where: { id: req.params.id, user_id: req.user.id },
    });

    if (!transaction) {
      return res.status(404).json({ success: false, message: 'Transaksi tidak ditemukan.' });
    }

    await transaction.destroy();

    return res.status(200).json({ success: true, message: 'Transaksi berhasil dihapus.' });
  } catch (error) {
    console.error('Error delete transaction:', error);
    return res.status(500).json({ success: false, message: 'Gagal menghapus transaksi.' });
  }
};

// Helper: update streak saat ada transaksi baru
const updateUserStreak = async (userId) => {
  try {
    const now = new Date();
    const thisMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

    let streak = await UserStreak.findOne({ where: { user_id: userId } });
    if (!streak) {
      streak = await UserStreak.create({ user_id: userId, current_streak: 1, longest_streak: 1, last_save_month: thisMonth });
      return;
    }

    if (streak.last_save_month === thisMonth) return; // Sudah menabung bulan ini

    const prevDate = streak.last_save_month ? new Date(`${streak.last_save_month}-01`) : null;
    const isConsecutive = prevDate &&
      now.getFullYear() * 12 + now.getMonth() === prevDate.getFullYear() * 12 + prevDate.getMonth() + 1;

    const newCurrent = isConsecutive ? streak.current_streak + 1 : 1;
    await streak.update({
      current_streak: newCurrent,
      longest_streak: Math.max(streak.longest_streak, newCurrent),
      last_save_month: thisMonth,
    });
  } catch (err) {
    console.error('Error update streak:', err);
  }
};

module.exports = { getAll, create, update, remove };
