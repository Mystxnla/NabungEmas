/**
 * articleController.js
 * Controller untuk artikel edukasi (publik)
 */

const { Article } = require('../models');

const getAll = async (req, res) => {
  try {
    const { category } = req.query;
    const where = category ? { category } : {};

    const articles = await Article.findAll({
      where,
      attributes: ['id', 'title', 'category', 'read_time', 'icon', 'summary', 'createdAt'],
      order: [['createdAt', 'DESC']],
    });

    return res.status(200).json({ success: true, data: articles });
  } catch (error) {
    console.error('Error getAll articles:', error);
    return res.status(500).json({ success: false, message: 'Gagal mengambil daftar artikel.' });
  }
};

const getById = async (req, res) => {
  try {
    const article = await Article.findByPk(req.params.id);

    if (!article) {
      return res.status(404).json({ success: false, message: 'Artikel tidak ditemukan.' });
    }

    return res.status(200).json({ success: true, data: article });
  } catch (error) {
    console.error('Error getById article:', error);
    return res.status(500).json({ success: false, message: 'Gagal mengambil artikel.' });
  }
};

module.exports = { getAll, getById };
