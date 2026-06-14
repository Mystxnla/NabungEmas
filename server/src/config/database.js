/**
 * database.js
 * Konfigurasi koneksi Sequelize ke MySQL (Laragon)
 */

require('dotenv').config();
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD || process.env.DB_PASS || null,
  {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT) || 3306,
    dialect: 'mysql',
    logging: false, // Matikan query log di console (set true untuk debug)
    define: {
      charset: 'utf8mb4',
      collate: 'utf8mb4_unicode_ci',
      underscored: false, // Gunakan camelCase di model, snake_case di DB
      timestamps: true,   // Otomatis tambah createdAt & updatedAt
    },
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  }
);

module.exports = sequelize;
