/**
 * UserWatchlist.js — Model watchlist saham user
 */

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const UserWatchlist = sequelize.define('UserWatchlist', {
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
  stock_code: {
    type: DataTypes.STRING(10),
    allowNull: false,
  },
}, {
  tableName: 'user_watchlist',
  timestamps: true,
});

module.exports = UserWatchlist;
