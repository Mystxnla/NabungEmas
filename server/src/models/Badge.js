/**
 * Badge.js — Model master badge/pencapaian
 */

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Badge = sequelize.define('Badge', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  code: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  icon: {
    type: DataTypes.STRING(10),
    allowNull: true,
    defaultValue: '🏅',
  },
}, {
  tableName: 'badges',
  timestamps: true,
});

module.exports = Badge;
