/**
 * server.js — Entry point backend GoldTech
 * Sinkronisasi database dan jalankan Express server
 */

require('dotenv').config();
const app = require('./app');
const { sequelize } = require('./models');

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Test koneksi database
    await sequelize.authenticate();
    console.log('✅ Koneksi database MySQL berhasil.');

    // Sinkronisasi model ke database
    // alter:true hanya untuk development, production pakai alter:false agar aman
    const syncOptions = process.env.NODE_ENV === 'production'
      ? { alter: false }
      : { alter: true };
    await sequelize.sync(syncOptions);
    console.log('✅ Database tersinkronisasi — semua tabel siap.');

    // Jalankan server
    app.listen(PORT, () => {
      console.log('\n🚀 ====== GOLDTECH API SERVER ======');
      console.log(`📡 Server berjalan di: http://localhost:${PORT}`);
      console.log(`🔍 Health check    : http://localhost:${PORT}/api/health`);
      console.log(`📚 Database        : ${process.env.DB_NAME} @ ${process.env.DB_HOST}:${process.env.DB_PORT}`);
      console.log('===================================\n');
    });
  } catch (error) {
    console.error('❌ Gagal menghubungkan ke database:', error.message);
    console.error('📋 Pastikan:');
    console.error('   1. Laragon sudah berjalan (MySQL aktif)');
    console.error('   2. File .env sudah dikonfigurasi dengan benar');
    console.error('   3. Database goldtech_db sudah dibuat di MySQL');
    process.exit(1);
  }
};

startServer();


