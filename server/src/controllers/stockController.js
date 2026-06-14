/**
 * stockController.js
 * Controller untuk data saham (publik)
 */

const { Stock } = require('../models');

const getAll = async (req, res) => {
  try {
    const stocks = await Stock.findAll({ order: [['code', 'ASC']] });
    return res.status(200).json({ success: true, data: stocks });
  } catch (error) {
    console.error('Error getAll stocks:', error);
    return res.status(500).json({ success: false, message: 'Gagal mengambil data saham.' });
  }
};

module.exports = { getAll };
