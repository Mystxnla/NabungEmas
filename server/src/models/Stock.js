/**
 * Stock.js — Model master data saham watchlist
 */

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Stock = sequelize.define('Stock', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  code: {
    type: DataTypes.STRING(10),
    allowNull: false,
    unique: true,
  },
  name: {
    type: DataTypes.STRING(150),
    allowNull: false,
  },
  sector: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  price: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false,
    defaultValue: 0,
  },
  change_percent: {
    type: DataTypes.DECIMAL(8, 4),
    allowNull: false,
    defaultValue: 0,
  },
}, {
  tableName: 'stocks',
  timestamps: true,
});

module.exports = Stock;
