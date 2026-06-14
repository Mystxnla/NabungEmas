/**
 * index.js — Mengatur semua model dan relasi antar model
 */

const sequelize = require('../config/database');

// Import semua model
const User = require('./User');
const GoldTransaction = require('./GoldTransaction');
const SellTransaction = require('./SellTransaction');
const Goal = require('./Goal');
const Badge = require('./Badge');
const UserBadge = require('./UserBadge');
const UserStreak = require('./UserStreak');
const UserWatchlist = require('./UserWatchlist');
const Article = require('./Article');
const MotivationalQuote = require('./MotivationalQuote');
const GoldPrice = require('./GoldPrice');
const Stock = require('./Stock');

// ---- Relasi User -> GoldTransaction ----
User.hasMany(GoldTransaction, { foreignKey: 'user_id', as: 'goldTransactions', onDelete: 'CASCADE' });
GoldTransaction.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// ---- Relasi User -> SellTransaction ----
User.hasMany(SellTransaction, { foreignKey: 'user_id', as: 'sellTransactions', onDelete: 'CASCADE' });
SellTransaction.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// ---- Relasi User -> Goal ----
User.hasMany(Goal, { foreignKey: 'user_id', as: 'goals', onDelete: 'CASCADE' });
Goal.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// ---- Relasi User <-> Badge (many-to-many via UserBadge) ----
User.belongsToMany(Badge, { through: UserBadge, foreignKey: 'user_id', as: 'badges' });
Badge.belongsToMany(User, { through: UserBadge, foreignKey: 'badge_id', as: 'users' });
User.hasMany(UserBadge, { foreignKey: 'user_id', as: 'userBadges' });
UserBadge.belongsTo(User, { foreignKey: 'user_id' });
UserBadge.belongsTo(Badge, { foreignKey: 'badge_id', as: 'badge' });

// ---- Relasi User -> UserStreak (one-to-one) ----
User.hasOne(UserStreak, { foreignKey: 'user_id', as: 'streak', onDelete: 'CASCADE' });
UserStreak.belongsTo(User, { foreignKey: 'user_id' });

// ---- Relasi User -> UserWatchlist ----
User.hasMany(UserWatchlist, { foreignKey: 'user_id', as: 'watchlist', onDelete: 'CASCADE' });
UserWatchlist.belongsTo(User, { foreignKey: 'user_id' });

module.exports = {
  sequelize,
  User,
  GoldTransaction,
  SellTransaction,
  Goal,
  Badge,
  UserBadge,
  UserStreak,
  UserWatchlist,
  Article,
  MotivationalQuote,
  GoldPrice,
  Stock,
};
