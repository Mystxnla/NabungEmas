/**
 * sellTransactionController.js
 * Controller untuk transaksi JUAL emas
 */

const { SellTransaction } = require('../models');
const { validationResult } = require('express-validator');

const getAll = async (req, res) => {
  try {
    const transactions = await SellTransaction.findAll({
      where: { user_id: req.user.id },
      order: [['date', 'DESC'], ['createdAt', 'DESC']],
    });
    return res.status(200).json({ success: true, data: transactions });
  } catch (error) {
    console.error('Error getAll sell transactions:', error);
    return res.status(500).json({ success: false, message: 'Gagal mengambil data transaksi jual.' });
  }
};

const create = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: 'Validasi gagal', errors: errors.array() });
    }

    const { date, gram, price_per_gram, total, note } = req.body;

    const transaction = await SellTransaction.create({
      user_id: req.user.id,
      date,
      gram: parseFloat(gram),
      price_per_gram: parseFloat(price_per_gram),
      total: parseFloat(total) || parseFloat(gram) * parseFloat(price_per_gram),
      note: note || '',
    });

    return res.status(201).json({
      success: true,
      message: 'Transaksi jual emas berhasil ditambahkan!',
      data: transaction,
    });
  } catch (error) {
    console.error('Error create sell transaction:', error);
    return res.status(500).json({ success: false, message: 'Gagal menambahkan transaksi jual.' });
  }
};

const remove = async (req, res) => {
  try {
    const transaction = await SellTransaction.findOne({
      where: { id: req.params.id, user_id: req.user.id },
    });

    if (!transaction) {
      return res.status(404).json({ success: false, message: 'Transaksi jual tidak ditemukan.' });
    }

    await transaction.destroy();
    return res.status(200).json({ success: true, message: 'Transaksi jual berhasil dihapus.' });
  } catch (error) {
    console.error('Error delete sell transaction:', error);
    return res.status(500).json({ success: false, message: 'Gagal menghapus transaksi jual.' });
  }
};

module.exports = { getAll, create, remove };
