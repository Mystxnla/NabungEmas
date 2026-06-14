/**
 * MotivationalQuote.js — Model kutipan motivasi (dikelola admin)
 */

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const MotivationalQuote = sequelize.define('MotivationalQuote', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  text: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: { notEmpty: true },
  },
  author: {
    type: DataTypes.STRING(100),
    allowNull: false,
    defaultValue: 'GoldTech',
  },
}, {
  tableName: 'motivational_quotes',
  timestamps: true,
});

module.exports = MotivationalQuote;
