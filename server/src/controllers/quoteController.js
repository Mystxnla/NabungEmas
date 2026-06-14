/**
 * quoteController.js
 * Controller untuk kutipan motivasi (publik)
 */

const { MotivationalQuote } = require('../models');
const { Op } = require('sequelize');

/**
 * GET /api/quotes/random
 * Kutipan acak berdasarkan hari (deterministik - hari yang sama = quote sama)
 */
const getRandom = async (req, res) => {
  try {
    const count = await MotivationalQuote.count();
    if (count === 0) {
      return res.status(200).json({
        success: true,
        data: { text: 'Menabung emas adalah investasi terbaik untuk masa depan.', author: 'GoldTech' },
      });
    }

    // Deterministik: indeks berdasarkan hari dalam tahun
    const now = new Date();
    const dayOfYear = Math.floor((now - new Date(now.getFullYear(), 0, 0)) / 86400000);
    const index = dayOfYear % count;

    const quote = await MotivationalQuote.findOne({
      offset: index,
      limit: 1,
    });

    return res.status(200).json({ success: true, data: quote });
  } catch (error) {
    console.error('Error getRandom quote:', error);
    return res.status(500).json({ success: false, message: 'Gagal mengambil kutipan.' });
  }
};

const getAll = async (req, res) => {
  try {
    const quotes = await MotivationalQuote.findAll({ order: [['id', 'ASC']] });
    return res.status(200).json({ success: true, data: quotes });
  } catch (error) {
    console.error('Error getAll quotes:', error);
    return res.status(500).json({ success: false, message: 'Gagal mengambil kutipan.' });
  }
};

module.exports = { getRandom, getAll };
