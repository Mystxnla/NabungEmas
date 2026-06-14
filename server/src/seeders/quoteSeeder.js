/**
 * quoteSeeder.js
 * Mengisi tabel motivational_quotes dari data MOTIVATIONAL_QUOTES
 */

const { MotivationalQuote } = require('../models');

const MOTIVATIONAL_QUOTES = [
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

const seedQuotes = async () => {
  try {
    const existing = await MotivationalQuote.count();
    if (existing > 0) {
      console.log(`   [Quotes] Sudah ada ${existing} kutipan, skip seeding.`);
      return;
    }

    await MotivationalQuote.bulkCreate(MOTIVATIONAL_QUOTES);
    console.log(`   ✅ ${MOTIVATIONAL_QUOTES.length} kutipan motivasi berhasil ditambahkan.`);
  } catch (error) {
    console.error('   ❌ Error seedQuotes:', error.message);
  }
};

module.exports = seedQuotes;
