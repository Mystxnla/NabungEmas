/**
 * goldPriceController.js
 * Controller untuk harga emas (publik, tanpa login)
 */

const { GoldPrice } = require('../models');
const { Op } = require('sequelize');

/**
 * GET /api/gold-price/current
 * Harga emas terbaru (record paling baru)
 */
const getCurrent = async (req, res) => {
  try {
    const latestPrice = await GoldPrice.findOne({
      order: [['date', 'DESC']],
    });

    if (!latestPrice) {
      return res.status(200).json({ success: true, data: { price: 1250000, date: new Date().toISOString().split('T')[0] } });
    }

    return res.status(200).json({ success: true, data: latestPrice });
  } catch (error) {
    console.error('Error getCurrent gold price:', error);
    return res.status(500).json({ success: false, message: 'Gagal mengambil harga emas.' });
  }
};

/**
 * GET /api/gold-price/history
 * Histori harga emas untuk grafik (default 1 tahun)
 */
const getHistory = async (req, res) => {
  try {
    const { days = 365 } = req.query;
    const fromDate = new Date();
    fromDate.setDate(fromDate.getDate() - parseInt(days));

    const prices = await GoldPrice.findAll({
      where: {
        date: { [Op.gte]: fromDate.toISOString().split('T')[0] },
      },
      order: [['date', 'ASC']],
    });

    return res.status(200).json({ success: true, data: prices });
  } catch (error) {
    console.error('Error getHistory gold price:', error);
    return res.status(500).json({ success: false, message: 'Gagal mengambil histori harga emas.' });
  }
};

module.exports = { getCurrent, getHistory };
