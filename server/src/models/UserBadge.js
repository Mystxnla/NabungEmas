/**
 * UserBadge.js — Relasi user <-> badge yang sudah diperoleh
 */

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const UserBadge = sequelize.define('UserBadge', {
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
  badge_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'badges', key: 'id' },
    onDelete: 'CASCADE',
  },
  unlocked_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'user_badges',
  timestamps: true,
});

module.exports = UserBadge;
