/**
 * helpers.js
 * Fungsi-fungsi utilitas yang sering digunakan di seluruh aplikasi.
 */

/**
 * Format angka menjadi mata uang Rupiah
 * @param {number} amount - Jumlah uang
 * @returns {string} Format Rupiah (contoh: Rp 1.250.000)
 */
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

/**
 * Format angka dengan pemisah ribuan
 * @param {number} num - Angka yang akan diformat
 * @returns {string} Angka terformat (contoh: 1.250.000)
 */
export const formatNumber = (num) => {
  return new Intl.NumberFormat('id-ID').format(num);
};

/**
 * Format berat emas dalam gram
 * @param {number} gram - Berat emas
 * @returns {string} Format gram (contoh: 5,25 gram)
 */
export const formatGram = (gram) => {
  return `${Number(gram).toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} gram`;
};

/**
 * Format tanggal ke format Indonesia
 * @param {string} dateStr - String tanggal
 * @returns {string} Format tanggal Indonesia (contoh: 15 Januari 2024)
 */
export const formatDate = (dateStr) => {
  return new Date(dateStr).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
};

/**
 * Format tanggal singkat
 * @param {string} dateStr - String tanggal
 * @returns {string} Format tanggal singkat (contoh: 15 Jan 2024)
 */
export const formatDateShort = (dateStr) => {
  return new Date(dateStr).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

/**
 * Generate ID unik sederhana
 * @returns {string} ID unik
 */
export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
};

/**
 * Hitung persentase progress
 * @param {number} current - Nilai saat ini
 * @param {number} target - Nilai target
 * @returns {number} Persentase (0-100)
 */
export const calculateProgress = (current, target) => {
  if (target <= 0) return 0;
  const progress = (current / target) * 100;
  return Math.min(Math.round(progress * 100) / 100, 100);
};

/**
 * Hitung rata-rata dari array angka
 * @param {number[]} numbers - Array angka
 * @returns {number} Rata-rata
 */
export const calculateAverage = (numbers) => {
  if (numbers.length === 0) return 0;
  return numbers.reduce((sum, n) => sum + n, 0) / numbers.length;
};

/**
 * Dapatkan tanggal hari ini dalam format YYYY-MM-DD
 * @returns {string} Tanggal hari ini
 */
export const getTodayDate = () => {
  return new Date().toISOString().split('T')[0];
};

/**
 * Hitung selisih hari antara dua tanggal
 * @param {string} date1 - Tanggal awal
 * @param {string} date2 - Tanggal akhir
 * @returns {number} Selisih dalam hari
 */
export const daysBetween = (date1, date2) => {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  const diff = Math.abs(d2 - d1);
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
};

/**
 * Hitung persentase perubahan
 * @param {number} oldVal - Nilai lama
 * @param {number} newVal - Nilai baru
 * @returns {number} Persentase perubahan
 */
export const percentChange = (oldVal, newVal) => {
  if (oldVal === 0) return 0;
  return ((newVal - oldVal) / oldVal) * 100;
};

/**
 * Dapatkan kutipan motivasi berdasarkan hari
 * @param {Array} quotes - Array kutipan
 * @returns {Object} Kutipan hari ini
 */
export const getDailyQuote = (quotes) => {
  const today = new Date();
  const dayOfYear = Math.floor(
    (today - new Date(today.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24)
  );
  return quotes[dayOfYear % quotes.length];
};

/**
 * Validasi apakah value adalah angka positif
 * @param {*} value - Nilai yang akan divalidasi
 * @returns {boolean}
 */
export const isPositiveNumber = (value) => {
  const num = Number(value);
  return !isNaN(num) && num > 0;
};

/**
 * Dapatkan nama bulan dari index
 * @param {number} monthIndex - Index bulan (0-11)
 * @returns {string} Nama bulan
 */
export const getMonthName = (monthIndex) => {
  const months = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
  ];
  return months[monthIndex];
};
