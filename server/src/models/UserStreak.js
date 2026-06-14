/**
 * UserStreak.js — Model streak menabung user
 */

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const UserStreak = sequelize.define('UserStreak', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true,
    references: { model: 'users', key: 'id' },
    onDelete: 'CASCADE',
  },
  current_streak: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  longest_streak: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  last_save_month: {
    type: DataTypes.STRING(7), // Format: 'YYYY-MM'
    allowNull: true,
  },
}, {
  tableName: 'user_streaks',
  timestamps: true,
});

module.exports = UserStreak;
