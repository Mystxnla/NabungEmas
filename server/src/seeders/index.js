/**
 * index.js — Entry point seeder
 * Jalankan: npm run seed
 */

require('dotenv').config();
const { sequelize } = require('../models');

const seedAdmin = require('./adminSeeder');
const seedBadges = require('./badgeSeeder');
const seedQuotes = require('./quoteSeeder');
const seedArticles = require('./articleSeeder');
const seedStocks = require('./stockSeeder');
const seedGoldPrices = require('./goldPriceSeeder');

const runSeeders = async () => {
  console.log('\n🌱 ====== MENJALANKAN SEEDER GOLDTECH ======\n');

  try {
    // Sync database dulu
    await sequelize.authenticate();
    console.log('✅ Koneksi database berhasil.\n');

    await sequelize.sync({ alter: false });
    console.log('✅ Database tersinkronisasi.\n');

    console.log('📂 Seeder: Admin...');
    await seedAdmin();

    console.log('📂 Seeder: Badges...');
    await seedBadges();

    console.log('📂 Seeder: Kutipan Motivasi...');
    await seedQuotes();

    console.log('📂 Seeder: Artikel Edukasi...');
    await seedArticles();

    console.log('📂 Seeder: Data Saham...');
    await seedStocks();

    console.log('📂 Seeder: Harga Emas (365 hari)...');
    await seedGoldPrices();

    console.log('\n🎉 ====== SEEDER SELESAI ======');
    console.log('📧 Login admin: admin@goldtech.com');
    console.log('🔑 Password   : admin123\n');
  } catch (error) {
    console.error('❌ Error menjalankan seeder:', error);
  } finally {
    await sequelize.close();
    process.exit(0);
  }
};

runSeeders();
