/**
 * adminSeeder.js
 * Membuat akun admin default jika belum ada
 */

const bcrypt = require('bcrypt');
const { User, UserStreak } = require('../models');

const seedAdmin = async () => {
  try {
    const existing = await User.findOne({ where: { email: 'admin@goldtech.com' } });
    if (existing) {
      console.log('   [Admin] Akun admin sudah ada, skip seeding.');
      return;
    }

    const hashedPassword = await bcrypt.hash('admin123', 12);
    const admin = await User.create({
      name: 'Administrator GoldTech',
      email: 'admin@goldtech.com',
      password: hashedPassword,
      role: 'admin',
      join_date: new Date().toISOString().split('T')[0],
      is_active: true,
    });

    // Buat streak record untuk admin
    await UserStreak.create({ user_id: admin.id, current_streak: 0, longest_streak: 0 });

    console.log('   ✅ Akun admin berhasil dibuat!');
    console.log('   📧 Email   : admin@goldtech.com');
    console.log('   🔑 Password: admin123');
    console.log('   ⚠️  Segera ubah password setelah login pertama!');
  } catch (error) {
    console.error('   ❌ Error seedAdmin:', error.message);
  }
};

module.exports = seedAdmin;
