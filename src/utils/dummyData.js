/**
 * dummyData.js
 * Data dummy awal agar aplikasi langsung memiliki isi saat pertama dijalankan.
 * Data ini akan disimpan ke Local Storage jika belum ada data sebelumnya.
 */

import { generateId } from './helpers';

/**
 * Transaksi pembelian emas dummy
 * Mencakup beberapa bulan terakhir untuk grafik yang realistis
 */
export const dummyTransactions = [
  {
    id: generateId(),
    date: '2024-01-15',
    gram: 2.0,
    pricePerGram: 1050000,
    total: 2100000,
    note: 'Pembelian pertama',
  },
  {
    id: generateId(),
    date: '2024-02-10',
    gram: 1.5,
    pricePerGram: 1075000,
    total: 1612500,
    note: 'Tabungan bulanan',
  },
  {
    id: generateId(),
    date: '2024-03-05',
    gram: 3.0,
    pricePerGram: 1100000,
    total: 3300000,
    note: 'Bonus gaji',
  },
  {
    id: generateId(),
    date: '2024-04-20',
    gram: 1.0,
    pricePerGram: 1120000,
    total: 1120000,
    note: 'Tabungan bulanan',
  },
  {
    id: generateId(),
    date: '2024-05-12',
    gram: 2.5,
    pricePerGram: 1150000,
    total: 2875000,
    note: 'Investasi rutin',
  },
  {
    id: generateId(),
    date: '2024-06-08',
    gram: 1.0,
    pricePerGram: 1175000,
    total: 1175000,
    note: 'Tabungan bulanan',
  },
  {
    id: generateId(),
    date: '2024-07-15',
    gram: 2.0,
    pricePerGram: 1200000,
    total: 2400000,
    note: 'Tabungan bulanan',
  },
  {
    id: generateId(),
    date: '2024-08-22',
    gram: 1.5,
    pricePerGram: 1220000,
    total: 1830000,
    note: 'Investasi rutin',
  },
  {
    id: generateId(),
    date: '2024-09-10',
    gram: 1.0,
    pricePerGram: 1235000,
    total: 1235000,
    note: 'Tabungan bulanan',
  },
  {
    id: generateId(),
    date: '2024-10-05',
    gram: 2.0,
    pricePerGram: 1245000,
    total: 2490000,
    note: 'Nabung dari THR',
  },
];

/**
 * Target/goal keuangan dummy
 */
export const dummyGoals = [
  {
    id: generateId(),
    name: 'Dana Darurat',
    targetGram: 25,
    targetNominal: 31250000,
    deadline: '2025-12-31',
    createdAt: '2024-01-01',
  },
  {
    id: generateId(),
    name: 'Tabungan Nikah',
    targetGram: 50,
    targetNominal: 62500000,
    deadline: '2026-06-30',
    createdAt: '2024-02-15',
  },
  {
    id: generateId(),
    name: 'Dana Pendidikan',
    targetGram: 100,
    targetNominal: 125000000,
    deadline: '2030-01-01',
    createdAt: '2024-03-01',
  },
];

/**
 * Profile pengguna dummy
 */
export const dummyProfile = {
  name: 'Pengguna GoldTech',
  joinDate: '2024-01-01',
};

/**
 * Badge yang sudah diperoleh dummy
 */
export const dummyBadges = ['first_buy', 'gram_5', 'gram_10', 'trans_10'];

/**
 * Streak menabung dummy
 */
export const dummyStreak = {
  currentStreak: 5,
  longestStreak: 12,
  lastSaveMonth: `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}`,
};

/**
 * Data harga emas dummy (harian, realistis dalam Rupiah per gram)
 * Mencakup 1 tahun data
 */
export const generateGoldPriceData = () => {
  const data = [];
  const startDate = new Date();
  startDate.setFullYear(startDate.getFullYear() - 1);
  
  let basePrice = 1050000;
  
  for (let i = 0; i < 365; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    
    // Simulasi pergerakan harga realistis
    const trend = 0.0005; // Tren naik perlahan
    const volatility = (Math.random() - 0.48) * 15000; // Volatilitas harian
    basePrice = basePrice * (1 + trend) + volatility;
    
    // Pastikan harga tidak turun terlalu jauh
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
  
  return data;
};

/**
 * Data saham dummy
 */
export const dummyStocks = [
  { code: 'ANTM', name: 'Aneka Tambang', sector: 'Pertambangan', price: 1785, change: 1.42 },
  { code: 'BBCA', name: 'Bank Central Asia', sector: 'Keuangan', price: 9850, change: 0.76 },
  { code: 'BBRI', name: 'Bank Rakyat Indonesia', sector: 'Keuangan', price: 5425, change: -0.55 },
  { code: 'TLKM', name: 'Telkom Indonesia', sector: 'Telekomunikasi', price: 3750, change: 0.27 },
  { code: 'UNVR', name: 'Unilever Indonesia', sector: 'Konsumer', price: 4230, change: -1.17 },
  { code: 'ASII', name: 'Astra International', sector: 'Multi-industri', price: 5100, change: 0.59 },
  { code: 'MDKA', name: 'Merdeka Copper Gold', sector: 'Pertambangan', price: 2650, change: 2.31 },
  { code: 'GOTO', name: 'GoTo Gojek Tokopedia', sector: 'Teknologi', price: 82, change: -2.38 },
  { code: 'BMRI', name: 'Bank Mandiri', sector: 'Keuangan', price: 6350, change: 0.95 },
  { code: 'EMTK', name: 'Elang Mahkota Teknologi', sector: 'Media', price: 480, change: -0.83 },
];

/**
 * Generate data harga saham dummy (harian)
 * @param {string} stockCode - Kode saham
 * @returns {Array} Data harga saham
 */
export const generateStockPriceData = (stockCode) => {
  const stock = dummyStocks.find(s => s.code === stockCode);
  if (!stock) return [];

  const data = [];
  const startDate = new Date();
  startDate.setMonth(startDate.getMonth() - 6);
  
  let basePrice = stock.price * 0.85;
  
  for (let i = 0; i < 180; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    
    // Skip weekends
    if (date.getDay() === 0 || date.getDay() === 6) continue;
    
    const change = (Math.random() - 0.48) * basePrice * 0.03;
    basePrice = Math.max(basePrice + change, stock.price * 0.6);
    basePrice = Math.min(basePrice, stock.price * 1.3);
    
    data.push({
      date: date.toISOString().split('T')[0],
      price: Math.round(basePrice),
      volume: Math.round(1000000 + Math.random() * 50000000),
      high: Math.round(basePrice + Math.random() * basePrice * 0.02),
      low: Math.round(basePrice - Math.random() * basePrice * 0.02),
    });
  }
  
  return data;
};

/**
 * Watchlist saham default
 */
export const dummyWatchlist = ['ANTM', 'BBCA', 'MDKA'];
