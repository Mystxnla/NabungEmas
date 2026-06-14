/**
 * goldPriceSeeder.js
 * Generate 365 hari data harga emas historis (simulasi realistis)
 */

const { GoldPrice } = require('../models');

const seedGoldPrices = async () => {
  try {
    const existing = await GoldPrice.count();
    if (existing > 50) {
      console.log(`   [GoldPrice] Sudah ada ${existing} data harga, skip seeding.`);
      return;
    }

    const data = [];
    const startDate = new Date();
    startDate.setFullYear(startDate.getFullYear() - 1);

    let basePrice = 1050000;

    for (let i = 0; i < 365; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);

      // Simulasi pergerakan harga realistis (sama dengan generateGoldPriceData di dummyData.js)
      const trend = 0.0005;
      const volatility = (Math.random() - 0.48) * 15000;
      basePrice = basePrice * (1 + trend) + volatility;
      basePrice = Math.max(basePrice, 950000);
      basePrice = Math.min(basePrice, 1400000);

      data.push({
        date: date.toISOString().split('T')[0],
        price: Math.round(basePrice),
        high: Math.round(basePrice + Math.random() * 10000),
        low: Math.round(basePrice - Math.random() * 10000),
        volume: Math.round(500 + Math.random() * 2000),
      });
    }

    // Gunakan bulkCreate dengan ignoreDuplicates untuk menghindari error
    await GoldPrice.bulkCreate(data, { ignoreDuplicates: true });
    console.log(`   ✅ ${data.length} data harga emas historis berhasil ditambahkan.`);
  } catch (error) {
    console.error('   ❌ Error seedGoldPrices:', error.message);
  }
};

module.exports = seedGoldPrices;
