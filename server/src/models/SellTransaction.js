/**
 * SellTransaction.js — Model transaksi JUAL emas
 */

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const SellTransaction = sequelize.define('SellTransaction', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'users', key: 'id' },
    onDelete: 'CASCADE',
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  gram: {
    type: DataTypes.DECIMAL(10, 4),
    allowNull: false,
    validate: { min: 0.0001 },
  },
  price_per_gram: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false,
    validate: { min: 1 },
  },
  total: {
    type: DataTypes.DECIMAL(20, 2),
    allowNull: false,
  },
  note: {
    type: DataTypes.STRING(255),
    allowNull: true,
    defaultValue: '',
  },
}, {
  tableName: 'sell_transactions',
  timestamps: true,
});

module.exports = SellTransaction;
