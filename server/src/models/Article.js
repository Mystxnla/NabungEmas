/**
 * Article.js — Model artikel edukasi (dikelola admin)
 */

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Article = sequelize.define('Article', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  title: {
    type: DataTypes.STRING(200),
    allowNull: false,
    validate: { notEmpty: true },
  },
  category: {
    type: DataTypes.STRING(50),
    allowNull: false,
    defaultValue: 'Umum',
  },
  read_time: {
    type: DataTypes.STRING(20),
    allowNull: true,
    defaultValue: '5 menit',
  },
  icon: {
    type: DataTypes.STRING(10),
    allowNull: true,
    defaultValue: '📄',
  },
  summary: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  content: {
    type: DataTypes.TEXT('long'),
    allowNull: true,
  },
}, {
  tableName: 'articles',
  timestamps: true,
});

module.exports = Article;
