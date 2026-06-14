/**
 * GoldPrice.js — Model harga emas harian (dikelola admin)
 */

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const GoldPrice = sequelize.define('GoldPrice', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    unique: true,
  },
  price: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false,
    validate: { min: 1 },
  },
  high: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: true,
  },
  low: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: true,
  },
  volume: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 0,
  },
}, {
  tableName: 'gold_prices',
  timestamps: true,
});

module.exports = GoldPrice;
