/**
 * articleSeeder.js
 * Mengisi tabel articles dari data articles.js
 */

const { Article } = require('../models');

const articlesData = [
  {
    title: 'Apa Itu Tabungan Emas?',
    category: 'Dasar',
    read_time: '5 menit',
    icon: '🪙',
    summary: 'Pahami konsep dasar tabungan emas dan mengapa emas menjadi pilihan investasi yang populer.',
    content: `## Pengertian Tabungan Emas

Tabungan emas adalah cara menabung dalam bentuk emas yang bisa dimulai dengan nominal kecil. Berbeda dengan membeli emas batangan secara langsung, tabungan emas memungkinkan kamu untuk membeli emas mulai dari 0,01 gram.

## Mengapa Memilih Emas?

1. **Nilai Stabil** - Emas cenderung mempertahankan nilainya dalam jangka panjang
2. **Perlindungan Inflasi** - Harga emas biasanya naik seiring dengan inflasi
3. **Likuid** - Emas mudah dijual kapan saja
4. **Aman** - Tidak terpengaruh oleh kebijakan moneter negara tertentu

## Cara Memulai

- **Tentukan tujuan** - Untuk apa kamu menabung emas?
- **Mulai dari kecil** - Tidak perlu langsung beli banyak
- **Konsisten** - Menabung rutin lebih penting dari jumlah besar sesekali
- **Pantau harga** - Beli saat harga sedang rendah

## Tips Penting

> Jangan pernah investasi dengan uang yang kamu butuhkan untuk kebutuhan sehari-hari. Sisihkan dana khusus untuk investasi.

Tabungan emas cocok untuk:
- Mahasiswa yang baru mulai belajar investasi
- Karyawan yang ingin diversifikasi aset
- Siapa saja yang ingin mempersiapkan masa depan`,
  },
  {
    title: 'Manajemen Keuangan Pribadi',
    category: 'Keuangan',
    read_time: '7 menit',
    icon: '💼',
    summary: 'Belajar mengelola keuangan pribadi dengan bijak untuk mencapai kebebasan finansial.',
    content: `## Prinsip Dasar Keuangan Pribadi

Mengelola keuangan pribadi adalah keterampilan yang harus dimiliki setiap orang. Berikut adalah prinsip-prinsip dasarnya:

## Aturan 50/30/20

Metode populer untuk membagi pendapatan:

- **50% Kebutuhan** - Makan, transportasi, tagihan
- **30% Keinginan** - Hiburan, hobi, jalan-jalan
- **20% Tabungan & Investasi** - Masa depan

## Langkah Mengelola Keuangan

### 1. Catat Pemasukan dan Pengeluaran
Ketahui berapa uang yang masuk dan keluar setiap bulan.

### 2. Buat Anggaran
Tentukan batas pengeluaran untuk setiap kategori.

### 3. Siapkan Dana Darurat
Idealnya 3-6 bulan pengeluaran.

### 4. Lunasi Hutang
Prioritaskan melunasi hutang dengan bunga tinggi terlebih dahulu.

### 5. Mulai Investasi
Setelah dana darurat tercukupi, mulailah berinvestasi untuk pertumbuhan aset.

## Kesalahan Umum

- ❌ Tidak memiliki dana darurat
- ❌ Hidup di atas kemampuan
- ❌ Tidak mencatat pengeluaran
- ❌ Menunda investasi`,
  },
  {
    title: 'Tips Membangun Kebiasaan Menabung',
    category: 'Tips',
    read_time: '6 menit',
    icon: '🎯',
    summary: 'Strategi dan tips praktis untuk membangun kebiasaan menabung yang konsisten.',
    content: `## Mengapa Menabung Itu Sulit?

Banyak orang kesulitan menabung karena:
- Pendapatan yang pas-pasan
- Godaan belanja impulsif
- Tidak memiliki tujuan yang jelas

## Strategi Efektif

### 1. Tetapkan Tujuan yang Spesifik
Bukan hanya "ingin menabung", tapi "ingin menabung 10 gram emas dalam 1 tahun untuk dana darurat."

### 2. Otomatis
Atur transfer otomatis ke rekening tabungan setiap tanggal gajian.

### 3. Mulai Kecil
- Minggu 1: Tabung Rp 10.000/hari
- Tingkatkan bertahap

### 4. Gunakan Metode 52 Minggu
Mulai dari Rp 10.000 di minggu pertama, tambah Rp 10.000 setiap minggu.

## Membangun Streak

Konsistensi adalah kunci! Gunakan fitur streak di GoldTech untuk memantau kebiasaan menabungmu.

> "Tabungan kecil yang konsisten akan mengalahkan tabungan besar yang tidak teratur."`,
  },
];

const seedArticles = async () => {
  try {
    const existing = await Article.count();
    if (existing > 0) {
      console.log(`   [Articles] Sudah ada ${existing} artikel, skip seeding.`);
      return;
    }

    await Article.bulkCreate(articlesData);
    console.log(`   ✅ ${articlesData.length} artikel edukasi berhasil ditambahkan.`);
  } catch (error) {
    console.error('   ❌ Error seedArticles:', error.message);
  }
};

module.exports = seedArticles;
