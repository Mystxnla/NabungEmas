/**
 * goalController.js
 * Controller untuk target tabungan emas
 */

const { Goal } = require('../models');
const { validationResult } = require('express-validator');

const getAll = async (req, res) => {
  try {
    const goals = await Goal.findAll({
      where: { user_id: req.user.id },
      order: [['createdAt', 'DESC']],
    });
    return res.status(200).json({ success: true, data: goals });
  } catch (error) {
    console.error('Error getAll goals:', error);
    return res.status(500).json({ success: false, message: 'Gagal mengambil data target.' });
  }
};

const create = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: 'Validasi gagal', errors: errors.array() });
    }

    const { name, target_gram, target_nominal, deadline } = req.body;

    const goal = await Goal.create({
      user_id: req.user.id,
      name,
      target_gram: parseFloat(target_gram),
      target_nominal: parseFloat(target_nominal),
      deadline,
    });

    return res.status(201).json({
      success: true,
      message: 'Target tabungan berhasil ditambahkan!',
      data: goal,
    });
  } catch (error) {
    console.error('Error create goal:', error);
    return res.status(500).json({ success: false, message: 'Gagal menambahkan target.' });
  }
};

const update = async (req, res) => {
  try {
    const goal = await Goal.findOne({ where: { id: req.params.id, user_id: req.user.id } });
    if (!goal) {
      return res.status(404).json({ success: false, message: 'Target tidak ditemukan.' });
    }

    const { name, target_gram, target_nominal, deadline } = req.body;
    await goal.update({
      name: name || goal.name,
      target_gram: parseFloat(target_gram) || goal.target_gram,
      target_nominal: parseFloat(target_nominal) || goal.target_nominal,
      deadline: deadline || goal.deadline,
    });

    return res.status(200).json({ success: true, message: 'Target berhasil diperbarui!', data: goal });
  } catch (error) {
    console.error('Error update goal:', error);
    return res.status(500).json({ success: false, message: 'Gagal memperbarui target.' });
  }
};

const remove = async (req, res) => {
  try {
    const goal = await Goal.findOne({ where: { id: req.params.id, user_id: req.user.id } });
    if (!goal) {
      return res.status(404).json({ success: false, message: 'Target tidak ditemukan.' });
    }

    await goal.destroy();
    return res.status(200).json({ success: true, message: 'Target berhasil dihapus.' });
  } catch (error) {
    console.error('Error delete goal:', error);
    return res.status(500).json({ success: false, message: 'Gagal menghapus target.' });
  }
};

module.exports = { getAll, create, update, remove };
