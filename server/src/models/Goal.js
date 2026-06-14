/**
 * Goal.js — Model target tabungan
 */

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Goal = sequelize.define('Goal', {
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
  name: {
    type: DataTypes.STRING(150),
    allowNull: false,
    validate: { notEmpty: true },
  },
  target_gram: {
    type: DataTypes.DECIMAL(10, 4),
    allowNull: false,
    validate: { min: 0.0001 },
  },
  target_nominal: {
    type: DataTypes.DECIMAL(20, 2),
    allowNull: false,
    validate: { min: 1 },
  },
  deadline: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
}, {
  tableName: 'goals',
  timestamps: true,
});

module.exports = Goal;
