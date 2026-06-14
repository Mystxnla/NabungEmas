import { useMemo } from 'react';
import { useApp } from '../contexts/AppContext';
import { formatCurrency, formatGram, formatDate } from '../utils/helpers';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { FiFileText, FiDownload, FiTrendingUp, FiTrendingDown, FiPieChart, FiDollarSign } from 'react-icons/fi';
import './Reports.css';

/**
 * Reports
 * Halaman pelaporan portofolio tabungan emas.
 * Menyediakan statistik rinci, visualisasi tren pertumbuhan saldo emas,
 * dan fitur cetak laporan PDF.
 */
const Reports = () => {
  const { transactions, totalGram, totalInvested, currentValue, profitLoss, profile, CURRENT_GOLD_PRICE } = useApp();

  // Hitung profit persen
  const profitPercent = useMemo(() => {
    if (totalInvested === 0) return '0.00';
    return ((profitLoss / totalInvested) * 100).toFixed(2);
  }, [profitLoss, totalInvested]);

  // Mengakumulasikan saldo emas secara historis (berdasarkan urutan tanggal)
  const growthChartData = useMemo(() => {
    if (transactions.length === 0) return [];
    
    // Urutkan transaksi dari terlama ke terbaru
    const sorted = [...transactions].sort((a, b) => new Date(a.date) - new Date(b.date));
    
    let cumulativeGram = 0;
    let cumulativeInvested = 0;

    return sorted.map((t) => {
      cumulativeGram += t.gram;
      cumulativeInvested += t.total;
      return {
        date: t.date,
        gram: Number(cumulativeGram.toFixed(4)),
        invested: cumulativeInvested,
        marketValue: Math.round(cumulativeGram * CURRENT_GOLD_PRICE),
      };
    });
  }, [transactions, CURRENT_GOLD_PRICE]);

  // Handler ekspor laporan PDF
  const handleDownloadPDF = () => {
    if (transactions.length === 0) return;

    const doc = new jsPDF();
    
    // Header PDF
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.setTextColor(202, 138, 4); // Emas GoldTech (#ca8a04)
    doc.text("GoldTech", 14, 20);
    
    doc.setFontSize(14);
    doc.setTextColor(31, 41, 55);
    doc.text("Laporan Ikhtisar Tabungan Emas", 14, 28);
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(100, 116, 139);
    doc.text(`Tanggal Cetak: ${new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}`, 14, 34);
    doc.text(`Pemilik Akun: ${profile.name}`, 14, 39);
    
    // Garis Pemisah
    doc.setDrawColor(229, 231, 235);
    doc.line(14, 44, 196, 44);
    
    // Ringkasan Portofolio
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(31, 41, 55);
    doc.text("RINGKASAN PORTOFOLIO", 14, 52);
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text("Total Saldo Emas :", 14, 60);
    doc.setFont("helvetica", "bold");
    doc.text(`${totalGram.toFixed(4)} gram`, 65, 60);
    
    doc.setFont("helvetica", "normal");
    doc.text("Total Dana Investasi :", 14, 66);
    doc.setFont("helvetica", "bold");
    doc.text(formatCurrency(totalInvested), 65, 66);
    
    doc.setFont("helvetica", "normal");
    doc.text("Nilai Pasar Saat Ini :", 14, 72);
    doc.setFont("helvetica", "bold");
    doc.text(formatCurrency(currentValue), 65, 72);
    
    doc.setFont("helvetica", "normal");
    doc.text("Akumulasi Profit / Loss :", 14, 78);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(profitLoss >= 0 ? 34 : 220, profitLoss >= 0 ? 197 : 38, profitLoss >= 0 ? 94 : 38); // green or red
    const profitString = `${formatCurrency(profitLoss)} (${profitLoss >= 0 ? '+' : ''}${profitPercent}%)`;
    doc.text(profitString, 65, 78);
    
    // Reset warna teks ke hitam
    doc.setTextColor(31, 41, 55);
    
    // Garis Pemisah
    doc.setDrawColor(229, 231, 235);
    doc.line(14, 84, 196, 84);
    
    // Judul Riwayat Transaksi
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text("RIWAYAT TRANSAKSI", 14, 92);
    
    // Menyiapkan Data Tabel untuk jspdf-autotable
    const headers = [["No", "Tanggal", "Berat (Gram)", "Harga / Gram", "Total Nominal", "Keterangan"]];
    const data = transactions.map((t, idx) => [
      idx + 1,
      t.date,
      `${t.gram} gram`,
      formatCurrency(t.pricePerGram),
      formatCurrency(t.total),
      t.note || 'Pembelian rutin'
    ]);
    
    // Render Tabel
    doc.autoTable({
      startY: 96,
      head: headers,
      body: data,
      theme: 'grid',
      headStyles: { fillColor: [202, 138, 4], textColor: [255, 255, 255] }, // Gold theme head
      styles: { fontSize: 9, cellPadding: 3 },
      columnStyles: {
        0: { cellWidth: 10 },
        1: { cellWidth: 25 },
        2: { cellWidth: 25 },
        3: { cellWidth: 35 },
        4: { cellWidth: 35 },
        5: { cellWidth: 50 },
      },
      margin: { left: 14, right: 14 }
    });
    
    // Unduh File
    doc.save(`GoldTech_Laporan_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  // Tooltip Kustom untuk Grafik Area
  const CustomAreaTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="custom-tooltip card" style={{ padding: '10px 14px' }}>
          <p className="tooltip-date" style={{ fontSize: '11px', color: 'var(--gray-400)', marginBottom: '4px' }}>
            {data.date}
          </p>
          <p style={{ fontSize: '13px', margin: '2px 0' }}>
            Aset: <strong>{formatGram(data.gram)}</strong>
          </p>
          <p style={{ fontSize: '13px', margin: '2px 0', color: 'var(--blue-500)' }}>
            Investasi: <strong>{formatCurrency(data.invested)}</strong>
          </p>
          <p style={{ fontSize: '13px', margin: '2px 0', color: 'var(--gold-600)' }}>
            Nilai Pasar: <strong>{formatCurrency(data.marketValue)}</strong>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="page-wrapper">
      <div className="container">
        {/* Header */}
        <div className="page-header">
          <div className="reports-header-row">
            <div>
              <h1>Laporan Keuangan</h1>
              <p>Analisis portofolio tabungan emasmu secara mendalam dan unduh laporan resmi.</p>
            </div>
            {transactions.length > 0 && (
              <button className="btn btn-primary" onClick={handleDownloadPDF}>
                <FiDownload /> Unduh Laporan PDF
              </button>
            )}
          </div>
        </div>

        {/* Metrik Portofolio */}
        <div className="grid grid-3 performance-metrics animate-fade-in">
          {/* Nilai Investasi vs Pasar */}
          <div className="card performance-card">
            <div className="p-header">
              <FiPieChart className="p-icon blue" />
              <span>Modal vs Nilai Pasar</span>
            </div>
            <div className="p-body">
              <div className="p-value-row">
                <span className="p-lbl">Modal Disetor:</span>
                <strong>{formatCurrency(totalInvested)}</strong>
              </div>
              <div className="p-value-row">
                <span className="p-lbl">Nilai Pasar:</span>
                <strong style={{ color: 'var(--gold-600)' }}>{formatCurrency(currentValue)}</strong>
              </div>
            </div>
          </div>

          {/* Rata-rata Harga Beli */}
          <div className="card performance-card">
            <div className="p-header">
              <FiDollarSign className="p-icon gold" />
              <span>Metrik Emas</span>
            </div>
            <div className="p-body">
              <div className="p-value-row">
                <span className="p-lbl">Saldo Emas:</span>
                <strong>{totalGram.toFixed(4)} gram</strong>
              </div>
              <div className="p-value-row">
                <span className="p-lbl">Harga Pasar / gr:</span>
                <strong>{formatCurrency(CURRENT_GOLD_PRICE)}</strong>
              </div>
            </div>
          </div>

          {/* Akumulasi Profit/Loss */}
          <div className="card performance-card">
            <div className="p-header">
              <FiTrendingUp className={`p-icon ${profitLoss >= 0 ? 'green' : 'red'}`} />
              <span>Estimasi Hasil Investasi</span>
            </div>
            <div className="p-body">
              <div className="p-value-row">
                <span className="p-lbl">Total Profit:</span>
                <strong className={profitLoss >= 0 ? 'text-green' : 'text-red'}>
                  {formatCurrency(profitLoss)}
                </strong>
              </div>
              <div className="p-value-row">
                <span className="p-lbl">Persentase:</span>
                <span className={`badge ${profitLoss >= 0 ? 'badge-green' : 'badge-red'}`}>
                  {profitLoss >= 0 ? '+' : ''}{profitPercent}%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Grafik Pertumbuhan Saldo Emas */}
        {growthChartData.length > 0 ? (
          <div className="card growth-chart-container animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <div className="chart-info-header">
              <FiFileText className="ci-icon text-gold" />
              <div>
                <h2>Grafik Akumulasi Aset Emas</h2>
                <p>Visualisasi pertumbuhan kepemilikan gram emas dari waktu ke waktu</p>
              </div>
            </div>

            {/* Recharts Area Chart */}
            <div className="recharts-wrapper">
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={growthChartData}>
                  <defs>
                    <linearGradient id="colorGram" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ca8a04" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#ca8a04" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--gray-100)" />
                  <XAxis dataKey="date" stroke="var(--gray-400)" tick={{ fontSize: 11 }} dy={10} />
                  <YAxis stroke="var(--gray-400)" tick={{ fontSize: 11 }} dx={-10} label={{ value: 'gram', angle: -90, position: 'insideLeft', offset: 0, style: { fontSize: 11, fill: 'var(--gray-400)' } }} />
                  <Tooltip content={<CustomAreaTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="gram"
                    stroke="var(--gold-600)"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorGram)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        ) : (
          <div className="card animate-fade-in" style={{ padding: '40px', textAlign: 'center' }}>
            <p style={{ color: 'var(--gray-400)', marginBottom: '16px' }}>Belum ada transaksi untuk membuat grafik pertumbuhan portofolio.</p>
            <a href="/savings" className="btn btn-primary">Tambah Transaksi Pertama</a>
          </div>
        )}
      </div>
    </div>
  );
};

export default Reports;
