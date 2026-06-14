/**
 * stockSeeder.js
 * Mengisi tabel stocks dari data dummyStocks
 */

const { Stock } = require('../models');

const dummyStocks = [
  { code: 'ANTM', name: 'Aneka Tambang', sector: 'Pertambangan', price: 1785, change_percent: 1.42 },
  { code: 'BBCA', name: 'Bank Central Asia', sector: 'Keuangan', price: 9850, change_percent: 0.76 },
  { code: 'BBRI', name: 'Bank Rakyat Indonesia', sector: 'Keuangan', price: 5425, change_percent: -0.55 },
  { code: 'TLKM', name: 'Telkom Indonesia', sector: 'Telekomunikasi', price: 3750, change_percent: 0.27 },
  { code: 'UNVR', name: 'Unilever Indonesia', sector: 'Konsumer', price: 4230, change_percent: -1.17 },
  { code: 'ASII', name: 'Astra International', sector: 'Multi-industri', price: 5100, change_percent: 0.59 },
  { code: 'MDKA', name: 'Merdeka Copper Gold', sector: 'Pertambangan', price: 2650, change_percent: 2.31 },
  { code: 'GOTO', name: 'GoTo Gojek Tokopedia', sector: 'Teknologi', price: 82, change_percent: -2.38 },
  { code: 'BMRI', name: 'Bank Mandiri', sector: 'Keuangan', price: 6350, change_percent: 0.95 },
  { code: 'EMTK', name: 'Elang Mahkota Teknologi', sector: 'Media', price: 480, change_percent: -0.83 },
];

const seedStocks = async () => {
  try {
    let created = 0;
    for (const stock of dummyStocks) {
      const [, wasCreated] = await Stock.findOrCreate({
        where: { code: stock.code },
        defaults: stock,
      });
      if (wasCreated) created++;
    }
    console.log(`   ✅ ${created} saham baru ditambahkan (dari ${dummyStocks.length} total).`);
  } catch (error) {
    console.error('   ❌ Error seedStocks:', error.message);
  }
};

module.exports = seedStocks;
