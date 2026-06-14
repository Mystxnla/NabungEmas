/**
 * badgeSeeder.js
 * Mengisi tabel badges dari data ACHIEVEMENT_BADGES di constants.js
 */

const { Badge } = require('../models');

const ACHIEVEMENT_BADGES = [
  { code: 'first_buy', name: 'Langkah Pertama', description: 'Melakukan pembelian emas pertama', icon: '🎯' },
  { code: 'streak_7', name: 'Konsisten 7 Bulan', description: 'Menabung 7 bulan berturut-turut', icon: '🔥' },
  { code: 'streak_30', name: 'Komitmen 30 Bulan', description: 'Menabung 30 bulan berturut-turut', icon: '⚡' },
  { code: 'gram_5', name: 'Lima Gram', description: 'Mengumpulkan 5 gram emas', icon: '⭐' },
  { code: 'gram_10', name: 'Sepuluh Gram', description: 'Mengumpulkan 10 gram emas', icon: '🌟' },
  { code: 'gram_50', name: 'Setengah Hekto', description: 'Mengumpulkan 50 gram emas', icon: '💫' },
  { code: 'goal_1', name: 'Target Pertama', description: 'Menyelesaikan target pertama', icon: '🏅' },
  { code: 'goal_5', name: 'Goal Achiever', description: 'Menyelesaikan 5 target', icon: '🎖️' },
  { code: 'trans_10', name: 'Rajin Menabung', description: 'Melakukan 10 transaksi', icon: '📈' },
  { code: 'trans_50', name: 'Super Saver', description: 'Melakukan 50 transaksi', icon: '🚀' },
];

const seedBadges = async () => {
  try {
    let created = 0;
    for (const badge of ACHIEVEMENT_BADGES) {
      const [, wasCreated] = await Badge.findOrCreate({
        where: { code: badge.code },
        defaults: badge,
      });
      if (wasCreated) created++;
    }
    console.log(`   ✅ ${created} badge baru ditambahkan (dari ${ACHIEVEMENT_BADGES.length} total).`);
  } catch (error) {
    console.error('   ❌ Error seedBadges:', error.message);
  }
};

module.exports = seedBadges;
