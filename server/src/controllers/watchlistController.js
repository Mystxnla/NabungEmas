/**
 * watchlistController.js
 * Controller untuk watchlist saham user
 */

const { UserWatchlist, Stock } = require('../models');

const getWatchlist = async (req, res) => {
  try {
    const watchlist = await UserWatchlist.findAll({
      where: { user_id: req.user.id },
      order: [['createdAt', 'ASC']],
    });

    const codes = watchlist.map(w => w.stock_code);

    return res.status(200).json({ success: true, data: codes });
  } catch (error) {
    console.error('Error getWatchlist:', error);
    return res.status(500).json({ success: false, message: 'Gagal mengambil watchlist.' });
  }
};

const addToWatchlist = async (req, res) => {
  try {
    const { stock_code } = req.body;

    if (!stock_code) {
      return res.status(400).json({ success: false, message: 'Kode saham diperlukan.' });
    }

    // Cek apakah saham valid
    const stock = await Stock.findOne({ where: { code: stock_code } });
    if (!stock) {
      return res.status(404).json({ success: false, message: 'Saham tidak ditemukan.' });
    }

    // Cek apakah sudah ada di watchlist
    const existing = await UserWatchlist.findOne({
      where: { user_id: req.user.id, stock_code },
    });

    if (existing) {
      return res.status(200).json({ success: true, message: 'Saham sudah ada di watchlist.' });
    }

    await UserWatchlist.create({ user_id: req.user.id, stock_code });

    return res.status(201).json({ success: true, message: `${stock_code} berhasil ditambahkan ke watchlist!` });
  } catch (error) {
    console.error('Error addToWatchlist:', error);
    return res.status(500).json({ success: false, message: 'Gagal menambahkan ke watchlist.' });
  }
};

const removeFromWatchlist = async (req, res) => {
  try {
    const { stock_code } = req.params;

    const item = await UserWatchlist.findOne({
      where: { user_id: req.user.id, stock_code },
    });

    if (!item) {
      return res.status(404).json({ success: false, message: 'Saham tidak ada di watchlist.' });
    }

    await item.destroy();
    return res.status(200).json({ success: true, message: `${stock_code} dihapus dari watchlist.` });
  } catch (error) {
    console.error('Error removeFromWatchlist:', error);
    return res.status(500).json({ success: false, message: 'Gagal menghapus dari watchlist.' });
  }
};

module.exports = { getWatchlist, addToWatchlist, removeFromWatchlist };
