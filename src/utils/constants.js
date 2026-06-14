/**
 * constants.js
 * Konstanta yang digunakan di seluruh aplikasi GoldTech.
 */

// Harga emas per gram saat ini (dummy, dalam Rupiah)
export const CURRENT_GOLD_PRICE = 1250000;

// Nama kunci Local Storage
export const STORAGE_KEYS = {
  TRANSACTIONS: 'GoldTech_transactions',
  SELL_TRANSACTIONS: 'GoldTech_sell_transactions',
  GOALS: 'GoldTech_goals',
  USER_PROFILE: 'GoldTech_user_profile',
  WATCHLIST: 'GoldTech_watchlist',
  STREAK: 'GoldTech_streak',
  BADGES: 'GoldTech_badges',
  FIRST_VISIT: 'GoldTech_first_visit',
};

// Level pengguna berdasarkan total gram
export const USER_LEVELS = [
  { level: 1, name: 'Pemula', minGram: 0, icon: '🌱' },
  { level: 2, name: 'Penabung', minGram: 5, icon: '💰' },
  { level: 3, name: 'Kolektor', minGram: 15, icon: '✨' },
  { level: 4, name: 'Investor', minGram: 30, icon: '🏆' },
  { level: 5, name: 'Master Emas', minGram: 50, icon: '👑' },
  { level: 6, name: 'Legend', minGram: 100, icon: '💎' },
];

// Badge pencapaian
export const ACHIEVEMENT_BADGES = [
  { id: 'first_buy', name: 'Langkah Pertama', desc: 'Melakukan pembelian emas pertama', icon: '🎯' },
  { id: 'streak_7', name: 'Konsisten 7 Bulan', desc: 'Menabung 7 bulan berturut-turut', icon: '🔥' },
  { id: 'streak_30', name: 'Komitmen 30 Bulan', desc: 'Menabung 30 bulan berturut-turut', icon: '⚡' },
  { id: 'gram_5', name: 'Lima Gram', desc: 'Mengumpulkan 5 gram emas', icon: '⭐' },
  { id: 'gram_10', name: 'Sepuluh Gram', desc: 'Mengumpulkan 10 gram emas', icon: '🌟' },
  { id: 'gram_50', name: 'Setengah Hekto', desc: 'Mengumpulkan 50 gram emas', icon: '💫' },
  { id: 'goal_1', name: 'Target Pertama', desc: 'Menyelesaikan target pertama', icon: '🏅' },
  { id: 'goal_5', name: 'Goal Achiever', desc: 'Menyelesaikan 5 target', icon: '🎖️' },
  { id: 'trans_10', name: 'Rajin Menabung', desc: 'Melakukan 10 transaksi', icon: '📈' },
  { id: 'trans_50', name: 'Super Saver', desc: 'Melakukan 50 transaksi', icon: '🚀' },
];

// Kutipan motivasi harian
export const MOTIVATIONAL_QUOTES = [
  { text: 'Perjalanan seribu mil dimulai dengan satu langkah.', author: 'Lao Tzu' },
  { text: 'Menabung bukan tentang berapa banyak yang kamu simpan, tapi seberapa konsisten kamu melakukannya.', author: 'GoldTech' },
  { text: 'Emas tidak berkarat, dan tabunganmu tidak akan pernah sia-sia.', author: 'GoldTech' },
  { text: 'Investasi terbaik adalah investasi pada diri sendiri.', author: 'Warren Buffett' },
  { text: 'Jangan menunggu waktu yang tepat, buatlah waktumu menjadi tepat.', author: 'GoldTech' },
  { text: 'Sedikit demi sedikit, lama-lama menjadi bukit.', author: 'Peribahasa Indonesia' },
  { text: 'Mulailah dari yang kecil, bermimpilah yang besar.', author: 'GoldTech' },
  { text: 'Konsistensi mengalahkan bakat yang tidak disiplin.', author: 'GoldTech' },
  { text: 'Uang yang ditabung hari ini adalah kebebasan di masa depan.', author: 'GoldTech' },
  { text: 'Emas adalah mata uang yang bertahan melampaui waktu.', author: 'GoldTech' },
  { text: 'Setiap gram yang kamu tabung adalah langkah menuju kemandirian finansial.', author: 'GoldTech' },
  { text: 'Disiplin adalah jembatan antara tujuan dan pencapaian.', author: 'Jim Rohn' },
  { text: 'Rencana tanpa tindakan hanyalah mimpi. Tindakan tanpa rencana hanyalah buang waktu.', author: 'GoldTech' },
  { text: 'Waktu terbaik untuk menanam pohon adalah 20 tahun lalu. Waktu terbaik kedua adalah sekarang.', author: 'Peribahasa China' },
  { text: 'Kebiasaan kecil yang dilakukan konsisten akan membawa perubahan besar.', author: 'James Clear' },
  { text: 'Jangan biarkan pengeluaran kecil menghancurkan rencana besar.', author: 'GoldTech' },
  { text: 'Menabung emas bukan sekadar investasi, tapi gaya hidup cerdas.', author: 'GoldTech' },
  { text: 'Orang sukses melakukan apa yang orang gagal tidak mau lakukan.', author: 'GoldTech' },
  { text: 'Stabilitas finansial dimulai dari kebiasaan menabung.', author: 'GoldTech' },
  { text: 'Kekayaan sejati datang dari kesabaran dan konsistensi.', author: 'GoldTech' },
  { text: 'Tabunganmu hari ini adalah fondasi masa depanmu.', author: 'GoldTech' },
  { text: 'Bukan tentang seberapa banyak uangmu, tapi seberapa bijak kamu mengelolanya.', author: 'GoldTech' },
  { text: 'Satu gram emas hari ini lebih berharga dari mimpi sejuta gram besok.', author: 'GoldTech' },
  { text: 'Masa depan cerah dimulai dari keputusan finansial yang cerdas hari ini.', author: 'GoldTech' },
  { text: 'Emas tidak akan pernah menjadi nol. Itulah mengapa emas istimewa.', author: 'GoldTech' },
  { text: 'Hidup sederhana, menabung teratur, masa depan sejahtera.', author: 'GoldTech' },
  { text: 'Jangan tunda menabung karena menunggu gaji besar. Mulailah dari apa yang kamu punya.', author: 'GoldTech' },
  { text: 'Kebebasan finansial bukanlah kemewahan, itu adalah kebutuhan.', author: 'Robert Kiyosaki' },
  { text: 'Setiap sen yang kamu tabung, kamu membeli kebebasan di masa depan.', author: 'GoldTech' },
  { text: 'Jadilah investor di umur muda, nikmatilah hasilnya di kemudian hari.', author: 'GoldTech' },
  { text: 'Tidak ada kata terlambat untuk mulai menabung.', author: 'GoldTech' },
];

// Pesan motivasi berdasarkan milestone progres
export const MILESTONE_MESSAGES = {
  10: '🌟 Awal yang bagus! Kamu sudah 10% menuju targetmu!',
  25: '💪 Seperempat jalan! Terus semangat menabung!',
  50: '🎉 Setengah jalan! Kamu luar biasa konsisten!',
  75: '🔥 Tiga perempat! Targetmu sudah di depan mata!',
  90: '⚡ Hampir sampai! Tinggal sedikit lagi!',
  100: '🏆 SELAMAT! Target tercapai! Kamu hebat!',
};
