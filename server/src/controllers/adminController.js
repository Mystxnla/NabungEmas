/**
 * adminController.js
 * Controller untuk semua operasi admin panel
 */

const bcrypt = require('bcrypt');
const { Op } = require('sequelize');
const {
  User, GoldTransaction, SellTransaction, Goal,
  Badge, UserBadge, Article, MotivationalQuote, GoldPrice, Stock, sequelize
} = require('../models');

// ==================== DASHBOARD STATS ====================

const getDashboardStats = async (req, res) => {
  try {
    const [
      totalUsers,
      totalBuyTransactions,
      totalSellTransactions,
      totalGoals,
      buyStats,
      sellStats,
    ] = await Promise.all([
      User.count({ where: { role: 'user' } }),
      GoldTransaction.count(),
      SellTransaction.count(),
      Goal.count(),
      GoldTransaction.findOne({
        attributes: [
          [sequelize.fn('SUM', sequelize.col('gram')), 'totalGram'],
          [sequelize.fn('SUM', sequelize.col('total')), 'totalInvested'],
        ],
        raw: true,
      }),
      SellTransaction.findOne({
        attributes: [
          [sequelize.fn('SUM', sequelize.col('gram')), 'totalSoldGram'],
          [sequelize.fn('SUM', sequelize.col('total')), 'totalSellRevenue'],
        ],
        raw: true,
      }),
    ]);

    // User baru bulan ini
    const thisMonthStart = new Date();
    thisMonthStart.setDate(1);
    thisMonthStart.setHours(0, 0, 0, 0);
    const newUsersThisMonth = await User.count({
      where: { createdAt: { [Op.gte]: thisMonthStart }, role: 'user' },
    });

    return res.status(200).json({
      success: true,
      data: {
        totalUsers,
        newUsersThisMonth,
        totalBuyTransactions,
        totalSellTransactions,
        totalGoals,
        totalGramBought: parseFloat(buyStats?.totalGram || 0),
        totalInvested: parseFloat(buyStats?.totalInvested || 0),
        totalGramSold: parseFloat(sellStats?.totalSoldGram || 0),
        totalSellRevenue: parseFloat(sellStats?.totalSellRevenue || 0),
        netGram: parseFloat(buyStats?.totalGram || 0) - parseFloat(sellStats?.totalSoldGram || 0),
      },
    });
  } catch (error) {
    console.error('Error getDashboardStats:', error);
    return res.status(500).json({ success: false, message: 'Gagal mengambil statistik dashboard.' });
  }
};

// ==================== USER MANAGEMENT ====================

const getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 20, search = '' } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    const where = search ? {
      [Op.or]: [
        { name: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } },
      ],
    } : {};

    const { count, rows } = await User.findAndCountAll({
      where,
      attributes: { exclude: ['password'] },
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset,
    });

    return res.status(200).json({
      success: true,
      data: rows,
      meta: { total: count, page: parseInt(page), limit: parseInt(limit), totalPages: Math.ceil(count / limit) },
    });
  } catch (error) {
    console.error('Error getAllUsers:', error);
    return res.status(500).json({ success: false, message: 'Gagal mengambil data pengguna.' });
  }
};

const getUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: { exclude: ['password'] },
    });
    if (!user) return res.status(404).json({ success: false, message: 'Pengguna tidak ditemukan.' });
    return res.status(200).json({ success: true, data: user });
  } catch (error) {
    console.error('Error getUserById:', error);
    return res.status(500).json({ success: false, message: 'Gagal mengambil data pengguna.' });
  }
};

const updateUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'Pengguna tidak ditemukan.' });

    // Jangan izinkan admin mengubah dirinya sendiri via endpoint ini
    if (user.id === req.user.id) {
      return res.status(400).json({ success: false, message: 'Gunakan halaman profil untuk mengubah akun Anda sendiri.' });
    }

    const { name, email, role, is_active } = req.body;

    if (name) user.name = name;
    if (email && email !== user.email) {
      const existing = await User.findOne({ where: { email } });
      if (existing) return res.status(409).json({ success: false, message: 'Email sudah digunakan.' });
      user.email = email;
    }
    if (role && ['user', 'admin'].includes(role)) user.role = role;
    if (is_active !== undefined) user.is_active = is_active;

    await user.save();

    return res.status(200).json({
      success: true,
      message: 'Data pengguna berhasil diperbarui.',
      data: { id: user.id, name: user.name, email: user.email, role: user.role, is_active: user.is_active },
    });
  } catch (error) {
    console.error('Error updateUser:', error);
    return res.status(500).json({ success: false, message: 'Gagal memperbarui data pengguna.' });
  }
};

const deleteUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'Pengguna tidak ditemukan.' });
    if (user.id === req.user.id) return res.status(400).json({ success: false, message: 'Tidak dapat menghapus akun sendiri.' });
    if (user.role === 'admin') return res.status(400).json({ success: false, message: 'Tidak dapat menghapus akun admin.' });

    await user.destroy();
    return res.status(200).json({ success: true, message: 'Pengguna berhasil dihapus.' });
  } catch (error) {
    console.error('Error deleteUser:', error);
    return res.status(500).json({ success: false, message: 'Gagal menghapus pengguna.' });
  }
};

// ==================== TRANSACTIONS ADMIN ====================

const getAllTransactions = async (req, res) => {
  try {
    const { user_id, from_date, to_date, page = 1, limit = 50 } = req.query;
    const where = {};
    if (user_id) where.user_id = user_id;
    if (from_date || to_date) {
      where.date = {};
      if (from_date) where.date[Op.gte] = from_date;
      if (to_date) where.date[Op.lte] = to_date;
    }

    const { count, rows } = await GoldTransaction.findAndCountAll({
      where,
      include: [{ model: User, as: 'user', attributes: ['id', 'name', 'email'] }],
      order: [['date', 'DESC']],
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit),
    });

    return res.status(200).json({
      success: true,
      data: rows,
      meta: { total: count, page: parseInt(page), limit: parseInt(limit), totalPages: Math.ceil(count / limit) },
    });
  } catch (error) {
    console.error('Error getAllTransactions admin:', error);
    return res.status(500).json({ success: false, message: 'Gagal mengambil data transaksi.' });
  }
};

const getAllSellTransactions = async (req, res) => {
  try {
    const { user_id, from_date, to_date, page = 1, limit = 50 } = req.query;
    const where = {};
    if (user_id) where.user_id = user_id;
    if (from_date || to_date) {
      where.date = {};
      if (from_date) where.date[Op.gte] = from_date;
      if (to_date) where.date[Op.lte] = to_date;
    }

    const { count, rows } = await SellTransaction.findAndCountAll({
      where,
      include: [{ model: User, as: 'user', attributes: ['id', 'name', 'email'] }],
      order: [['date', 'DESC']],
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit),
    });

    return res.status(200).json({
      success: true,
      data: rows,
      meta: { total: count, page: parseInt(page), limit: parseInt(limit), totalPages: Math.ceil(count / limit) },
    });
  } catch (error) {
    console.error('Error getAllSellTransactions admin:', error);
    return res.status(500).json({ success: false, message: 'Gagal mengambil data transaksi jual.' });
  }
};

const getAllGoals = async (req, res) => {
  try {
    const goals = await Goal.findAll({
      include: [{ model: User, as: 'user', attributes: ['id', 'name', 'email'] }],
      order: [['createdAt', 'DESC']],
    });
    return res.status(200).json({ success: true, data: goals });
  } catch (error) {
    console.error('Error getAllGoals admin:', error);
    return res.status(500).json({ success: false, message: 'Gagal mengambil data target.' });
  }
};

// ==================== ARTICLE MANAGEMENT ====================

const getAllArticlesAdmin = async (req, res) => {
  try {
    const articles = await Article.findAll({ order: [['createdAt', 'DESC']] });
    return res.status(200).json({ success: true, data: articles });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Gagal mengambil artikel.' });
  }
};

const createArticle = async (req, res) => {
  try {
    const { title, category, read_time, icon, summary, content } = req.body;
    if (!title) return res.status(400).json({ success: false, message: 'Judul artikel diperlukan.' });

    const article = await Article.create({ title, category, read_time, icon, summary, content });
    return res.status(201).json({ success: true, message: 'Artikel berhasil dibuat!', data: article });
  } catch (error) {
    console.error('Error createArticle:', error);
    return res.status(500).json({ success: false, message: 'Gagal membuat artikel.' });
  }
};

const updateArticle = async (req, res) => {
  try {
    const article = await Article.findByPk(req.params.id);
    if (!article) return res.status(404).json({ success: false, message: 'Artikel tidak ditemukan.' });

    await article.update(req.body);
    return res.status(200).json({ success: true, message: 'Artikel berhasil diperbarui!', data: article });
  } catch (error) {
    console.error('Error updateArticle:', error);
    return res.status(500).json({ success: false, message: 'Gagal memperbarui artikel.' });
  }
};

const deleteArticle = async (req, res) => {
  try {
    const article = await Article.findByPk(req.params.id);
    if (!article) return res.status(404).json({ success: false, message: 'Artikel tidak ditemukan.' });
    await article.destroy();
    return res.status(200).json({ success: true, message: 'Artikel berhasil dihapus.' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Gagal menghapus artikel.' });
  }
};

// ==================== QUOTE MANAGEMENT ====================

const getAllQuotesAdmin = async (req, res) => {
  try {
    const quotes = await MotivationalQuote.findAll({ order: [['id', 'ASC']] });
    return res.status(200).json({ success: true, data: quotes });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Gagal mengambil kutipan.' });
  }
};

const createQuote = async (req, res) => {
  try {
    const { text, author } = req.body;
    if (!text) return res.status(400).json({ success: false, message: 'Teks kutipan diperlukan.' });
    const quote = await MotivationalQuote.create({ text, author: author || 'GoldTech' });
    return res.status(201).json({ success: true, message: 'Kutipan berhasil ditambahkan!', data: quote });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Gagal menambahkan kutipan.' });
  }
};

const updateQuote = async (req, res) => {
  try {
    const quote = await MotivationalQuote.findByPk(req.params.id);
    if (!quote) return res.status(404).json({ success: false, message: 'Kutipan tidak ditemukan.' });
    await quote.update(req.body);
    return res.status(200).json({ success: true, message: 'Kutipan berhasil diperbarui!', data: quote });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Gagal memperbarui kutipan.' });
  }
};

const deleteQuote = async (req, res) => {
  try {
    const quote = await MotivationalQuote.findByPk(req.params.id);
    if (!quote) return res.status(404).json({ success: false, message: 'Kutipan tidak ditemukan.' });
    await quote.destroy();
    return res.status(200).json({ success: true, message: 'Kutipan berhasil dihapus.' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Gagal menghapus kutipan.' });
  }
};

// ==================== GOLD PRICE MANAGEMENT ====================

const getAllGoldPricesAdmin = async (req, res) => {
  try {
    const prices = await GoldPrice.findAll({ order: [['date', 'DESC']], limit: 100 });
    return res.status(200).json({ success: true, data: prices });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Gagal mengambil data harga emas.' });
  }
};

const createGoldPrice = async (req, res) => {
  try {
    const { date, price, high, low, volume } = req.body;
    if (!date || !price) return res.status(400).json({ success: false, message: 'Tanggal dan harga diperlukan.' });

    const [goldPrice, created] = await GoldPrice.findOrCreate({
      where: { date },
      defaults: { price, high, low, volume },
    });

    if (!created) {
      await goldPrice.update({ price, high, low, volume });
      return res.status(200).json({ success: true, message: 'Harga emas untuk tanggal ini diperbarui!', data: goldPrice });
    }

    return res.status(201).json({ success: true, message: 'Harga emas berhasil ditambahkan!', data: goldPrice });
  } catch (error) {
    console.error('Error createGoldPrice:', error);
    return res.status(500).json({ success: false, message: 'Gagal menambahkan harga emas.' });
  }
};

const updateGoldPrice = async (req, res) => {
  try {
    const gp = await GoldPrice.findByPk(req.params.id);
    if (!gp) return res.status(404).json({ success: false, message: 'Data harga tidak ditemukan.' });
    await gp.update(req.body);
    return res.status(200).json({ success: true, message: 'Harga emas berhasil diperbarui!', data: gp });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Gagal memperbarui harga emas.' });
  }
};

const deleteGoldPrice = async (req, res) => {
  try {
    const gp = await GoldPrice.findByPk(req.params.id);
    if (!gp) return res.status(404).json({ success: false, message: 'Data harga tidak ditemukan.' });
    await gp.destroy();
    return res.status(200).json({ success: true, message: 'Data harga emas dihapus.' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Gagal menghapus harga emas.' });
  }
};

// ==================== STOCK MANAGEMENT ====================

const getAllStocksAdmin = async (req, res) => {
  try {
    const stocks = await Stock.findAll({ order: [['code', 'ASC']] });
    return res.status(200).json({ success: true, data: stocks });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Gagal mengambil data saham.' });
  }
};

const createStock = async (req, res) => {
  try {
    const { code, name, sector, price, change_percent } = req.body;
    if (!code || !name) return res.status(400).json({ success: false, message: 'Kode dan nama saham diperlukan.' });

    const existing = await Stock.findOne({ where: { code } });
    if (existing) return res.status(409).json({ success: false, message: 'Kode saham sudah ada.' });

    const stock = await Stock.create({ code, name, sector, price, change_percent });
    return res.status(201).json({ success: true, message: 'Saham berhasil ditambahkan!', data: stock });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Gagal menambahkan saham.' });
  }
};

const updateStock = async (req, res) => {
  try {
    const stock = await Stock.findByPk(req.params.id);
    if (!stock) return res.status(404).json({ success: false, message: 'Saham tidak ditemukan.' });
    await stock.update(req.body);
    return res.status(200).json({ success: true, message: 'Saham berhasil diperbarui!', data: stock });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Gagal memperbarui saham.' });
  }
};

const deleteStock = async (req, res) => {
  try {
    const stock = await Stock.findByPk(req.params.id);
    if (!stock) return res.status(404).json({ success: false, message: 'Saham tidak ditemukan.' });
    await stock.destroy();
    return res.status(200).json({ success: true, message: 'Saham berhasil dihapus.' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Gagal menghapus saham.' });
  }
};

// ==================== BADGE MANAGEMENT ====================

const getAllBadgesAdmin = async (req, res) => {
  try {
    const badges = await Badge.findAll({ order: [['id', 'ASC']] });
    return res.status(200).json({ success: true, data: badges });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Gagal mengambil data badge.' });
  }
};

const createBadge = async (req, res) => {
  try {
    const { code, name, description, icon } = req.body;
    if (!code || !name) return res.status(400).json({ success: false, message: 'Kode dan nama badge diperlukan.' });
    const existing = await Badge.findOne({ where: { code } });
    if (existing) return res.status(409).json({ success: false, message: 'Kode badge sudah ada.' });
    const badge = await Badge.create({ code, name, description, icon });
    return res.status(201).json({ success: true, message: 'Badge berhasil ditambahkan!', data: badge });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Gagal menambahkan badge.' });
  }
};

const updateBadge = async (req, res) => {
  try {
    const badge = await Badge.findByPk(req.params.id);
    if (!badge) return res.status(404).json({ success: false, message: 'Badge tidak ditemukan.' });
    await badge.update(req.body);
    return res.status(200).json({ success: true, message: 'Badge berhasil diperbarui!', data: badge });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Gagal memperbarui badge.' });
  }
};

const deleteBadge = async (req, res) => {
  try {
    const badge = await Badge.findByPk(req.params.id);
    if (!badge) return res.status(404).json({ success: false, message: 'Badge tidak ditemukan.' });
    await badge.destroy();
    return res.status(200).json({ success: true, message: 'Badge berhasil dihapus.' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Gagal menghapus badge.' });
  }
};

// ==================== REPORTS ====================

const getReports = async (req, res) => {
  try {
    const { from_date, to_date } = req.query;
    const dateFilter = {};
    if (from_date || to_date) {
      if (from_date) dateFilter[Op.gte] = from_date;
      if (to_date) dateFilter[Op.lte] = to_date;
    }

    const where = Object.keys(dateFilter).length > 0 ? { date: dateFilter } : {};

    const [buyTransactions, sellTransactions, totalUsers] = await Promise.all([
      GoldTransaction.findAll({ where, include: [{ model: User, as: 'user', attributes: ['name', 'email'] }], order: [['date', 'DESC']] }),
      SellTransaction.findAll({ where, include: [{ model: User, as: 'user', attributes: ['name', 'email'] }], order: [['date', 'DESC']] }),
      User.count({ where: { role: 'user' } }),
    ]);

    const totalGramBought = buyTransactions.reduce((sum, t) => sum + parseFloat(t.gram), 0);
    const totalInvested = buyTransactions.reduce((sum, t) => sum + parseFloat(t.total), 0);
    const totalGramSold = sellTransactions.reduce((sum, t) => sum + parseFloat(t.gram), 0);
    const totalSellRevenue = sellTransactions.reduce((sum, t) => sum + parseFloat(t.total), 0);

    return res.status(200).json({
      success: true,
      data: {
        summary: { totalUsers, totalGramBought, totalInvested, totalGramSold, totalSellRevenue },
        buyTransactions,
        sellTransactions,
      },
    });
  } catch (error) {
    console.error('Error getReports:', error);
    return res.status(500).json({ success: false, message: 'Gagal mengambil laporan.' });
  }
};

module.exports = {
  getDashboardStats,
  getAllUsers, getUserById, updateUser, deleteUser,
  getAllTransactions, getAllSellTransactions, getAllGoals,
  getAllArticlesAdmin, createArticle, updateArticle, deleteArticle,
  getAllQuotesAdmin, createQuote, updateQuote, deleteQuote,
  getAllGoldPricesAdmin, createGoldPrice, updateGoldPrice, deleteGoldPrice,
  getAllStocksAdmin, createStock, updateStock, deleteStock,
  getAllBadgesAdmin, createBadge, updateBadge, deleteBadge,
  getReports,
};
