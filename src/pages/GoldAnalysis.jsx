import { useState, useMemo, useEffect } from 'react';
import { useApp } from '../contexts/AppContext';
import { goldPriceService } from '../api/goldPriceService';
import { formatCurrency, formatGram, formatDateShort } from '../utils/helpers';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { FiTrendingUp, FiActivity, FiDollarSign, FiCalendar } from 'react-icons/fi';
import './GoldAnalysis.css';

/**
 * GoldAnalysis
 * Halaman analisis pasar emas dan simulator investasi.
 * Menyediakan chart harga interaktif dan kalkulator DCA (Dollar Cost Averaging) historis.
 */
const GoldAnalysis = () => {
  const { CURRENT_GOLD_PRICE } = useApp();
  const [timeRange, setTimeRange] = useState(30); // 7, 30, 90, 365 hari

  // Simulator Konversi Biasa
  const [convertCash, setConvertCash] = useState('1000000');
  const [convertGram, setConvertGram] = useState('0.8');

  // Simulator Investasi Historis (DCA)
  const [monthlySaving, setMonthlySaving] = useState('500000');
  const [dcaMonths, setDcaMonths] = useState(12); // 3, 6, 12 bulan

  // Fetch data harga emas dari API
  const [goldPriceData, setGoldPriceData] = useState([]);
  const [isLoadingChart, setIsLoadingChart] = useState(true);

  useEffect(() => {
    const fetchGoldPrices = async () => {
      setIsLoadingChart(true);
      try {
        const res = await goldPriceService.getHistory(365);
        const apiData = res.data.data;
        if (apiData && apiData.length > 0) {
          setGoldPriceData(apiData.map(d => ({
            date: d.date,
            price: Number(d.price),
            high: Number(d.high || d.price),
            low: Number(d.low || d.price),
          })));
        }
      } catch (error) {
        console.error('Gagal memuat data harga emas dari API:', error);
      } finally {
        setIsLoadingChart(false);
      }
    };
    fetchGoldPrices();
  }, []);

  // Filter data berdasarkan rentang waktu yang dipilih
  const filteredChartData = useMemo(() => {
    return goldPriceData.slice(-timeRange);
  }, [goldPriceData, timeRange]);

  // Statistik harga di rentang waktu terpilih
  const stats = useMemo(() => {
    const prices = filteredChartData.map((d) => d.price);
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    const average = Math.round(prices.reduce((s, p) => s + p, 0) / prices.length);
    const latest = prices[prices.length - 1];
    const initial = prices[0];
    const change = latest - initial;
    const percentChange = ((change / initial) * 100).toFixed(2);

    return { min, max, average, latest, change, percentChange };
  }, [filteredChartData]);

  // Handler konversi Rupiah ke Gram Emas
  const handleCashChange = (val) => {
    setConvertCash(val);
    const num = Number(val);
    if (num > 0) {
      setConvertGram((num / CURRENT_GOLD_PRICE).toFixed(4));
    } else {
      setConvertGram('');
    }
  };

  // Handler konversi Gram Emas ke Rupiah
  const handleGramChange = (val) => {
    setConvertGram(val);
    const num = Number(val);
    if (num > 0) {
      setConvertCash(Math.round(num * CURRENT_GOLD_PRICE).toString());
    } else {
      setConvertCash('');
    }
  };

  // Simulasi DCA Historis
  const dcaSimulation = useMemo(() => {
    const monthlyAmt = Number(monthlySaving);
    if (isNaN(monthlyAmt) || monthlyAmt <= 0) return null;

    // Dapatkan data harga bulanan dari dataset 365 hari
    const monthlyDataPoints = [];
    const totalDays = goldPriceData.length;
    
    // Ambil harga setiap ~30 hari mundur dari hari terakhir
    for (let i = 0; i < dcaMonths; i++) {
      const index = totalDays - 1 - (i * 30);
      if (index >= 0) {
        monthlyDataPoints.unshift(goldPriceData[index]);
      }
    }

    let totalInvested = 0;
    let totalGramsAccumulated = 0;

    const details = monthlyDataPoints.map((point) => {
      const price = point.price;
      const gramsBought = monthlyAmt / price;
      totalInvested += monthlyAmt;
      totalGramsAccumulated += gramsBought;
      
      return {
        date: point.date,
        price,
        gramsBought,
        totalGramsAccumulated,
        investedSoFar: totalInvested,
        valueSoFar: totalGramsAccumulated * CURRENT_GOLD_PRICE,
      };
    });

    const finalValue = totalGramsAccumulated * CURRENT_GOLD_PRICE;
    const profitLoss = finalValue - totalInvested;
    const profitPercent = ((profitLoss / totalInvested) * 100).toFixed(2);

    return {
      totalInvested,
      totalGramsAccumulated,
      finalValue,
      profitLoss,
      profitPercent,
      details,
    };
  }, [monthlySaving, dcaMonths, goldPriceData, CURRENT_GOLD_PRICE]);

  // Tooltip Kustom untuk Grafik Recharts
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="custom-tooltip card">
          <p className="tooltip-date">{formatDateShort(data.date)}</p>
          <p className="tooltip-price">Harga: <strong>{formatCurrency(data.price)}</strong></p>
          <p className="tooltip-range">Terendah: {formatCurrency(data.low)}</p>
          <p className="tooltip-range">Tertinggi: {formatCurrency(data.high)}</p>
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
          <h1>Analisis Emas</h1>
          <p>Pantau fluktuasi harga pasar emas dan lakukan simulasi rencana tabunganmu.</p>
        </div>

        {/* Metrik Performa Rentang Waktu */}
        <div className="grid grid-4 stats-metrics animate-fade-in">
          <div className="card stat-card">
            <div className="stat-label">Harga Hari Ini</div>
            <div className="stat-value">{formatCurrency(CURRENT_GOLD_PRICE)}</div>
            <span className="stat-change text-gold">Terupdate secara real-time</span>
          </div>

          <div className="card stat-card">
            <div className="stat-label">Rata-rata Harga ({timeRange} Hari)</div>
            <div className="stat-value">{formatCurrency(stats.average)}</div>
            <span className="stat-change" style={{ color: 'var(--gray-400)' }}>Rata-rata tertimbang</span>
          </div>

          <div className="card stat-card">
            <div className="stat-label">Tertinggi / Terendah</div>
            <div className="stat-value" style={{ fontSize: '18px' }}>
              {formatCurrency(stats.max)} / {formatCurrency(stats.min)}
            </div>
            <span className="stat-change" style={{ color: 'var(--gray-400)' }}>Dalam rentang {timeRange} hari</span>
          </div>

          <div className="card stat-card">
            <div className="stat-label">Perubahan Harga</div>
            <div className={`stat-value ${stats.change >= 0 ? 'text-green' : 'text-red'}`}>
              {stats.change >= 0 ? '+' : ''}{formatCurrency(stats.change)}
            </div>
            <span className={`stat-change badge ${stats.change >= 0 ? 'badge-green' : 'badge-red'}`}>
              {stats.change >= 0 ? '📈 Up' : '📉 Down'} {stats.percentChange}%
            </span>
          </div>
        </div>

        {/* Bagian Grafik */}
        <div className="card chart-container animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <div className="chart-header">
            <div className="chart-title-group">
              <FiActivity className="chart-icon text-gold" />
              <div>
                <h2>Grafik Harga Emas Logam Mulia</h2>
                <p>Harga spot dalam Rupiah per Gram</p>
              </div>
            </div>
            {/* Filter Rentang Waktu */}
            <div className="time-range-group">
              {[7, 30, 90, 365].map((days) => (
                <button
                  key={days}
                  className={`time-range-btn ${timeRange === days ? 'active' : ''}`}
                  onClick={() => setTimeRange(days)}
                >
                  {days === 365 ? '1 Tahun' : `${days} Hari`}
                </button>
              ))}
            </div>
          </div>

          {/* Grafik Recharts */}
          <div className="recharts-wrapper">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={filteredChartData}>
                <defs>
                  <linearGradient id="goldGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#eab308" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#eab308" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--gray-100)" />
                <XAxis
                  dataKey="date"
                  tickFormatter={formatDateShort}
                  stroke="var(--gray-400)"
                  tick={{ fontSize: 11 }}
                  dy={10}
                />
                <YAxis
                  domain={['dataMin - 10000', 'dataMax + 10000']}
                  tickFormatter={(val) => `Rp ${(val / 1000).toLocaleString('id-ID')}k`}
                  stroke="var(--gray-400)"
                  tick={{ fontSize: 11 }}
                  dx={-10}
                />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey="price"
                  stroke="var(--gold-500)"
                  strokeWidth={3}
                  dot={false}
                  activeDot={{ r: 6, stroke: '#white', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Grid Simulator */}
        <div className="grid grid-2 simulator-grid animate-fade-in" style={{ animationDelay: '0.2s' }}>
          {/* Kalkulator Konversi Langsung */}
          <div className="card">
            <div className="section-header">
              <h2>🪙 Kalkulator Konversi Emas</h2>
            </div>
            <p className="section-desc" style={{ marginBottom: '20px', color: 'var(--gray-500)' }}>
              Konversikan nilai asetmu langsung berdasarkan harga emas hari ini: <br />
              <strong>{formatCurrency(CURRENT_GOLD_PRICE)} / gram</strong>
            </p>

            <div className="form-group">
              <label htmlFor="convertCash">Jumlah Uang (Rupiah)</label>
              <div className="input-wrapper">
                <span className="input-prefix">Rp</span>
                <input
                  id="convertCash"
                  type="number"
                  className="form-control"
                  style={{ paddingLeft: '45px' }}
                  placeholder="Masukkan nominal Rupiah"
                  value={convertCash}
                  onChange={(e) => handleCashChange(e.target.value)}
                />
              </div>
            </div>

            <div className="conversion-separator">
              <div className="sep-line"></div>
              <span className="sep-badge">⇄</span>
              <div className="sep-line"></div>
            </div>

            <div className="form-group">
              <label htmlFor="convertGram">Berat Emas (Gram)</label>
              <div className="input-wrapper">
                <input
                  id="convertGram"
                  type="number"
                  step="0.0001"
                  className="form-control"
                  style={{ paddingRight: '60px' }}
                  placeholder="Masukkan berat gram"
                  value={convertGram}
                  onChange={(e) => handleGramChange(e.target.value)}
                />
                <span className="input-suffix">gram</span>
              </div>
            </div>
          </div>

          {/* Simulator DCA Historis */}
          <div className="card">
            <div className="section-header">
              <h2>📊 Rencana Simulasi Tabungan Rutin</h2>
            </div>
            <p className="section-desc" style={{ marginBottom: '20px', color: 'var(--gray-500)' }}>
              Lihat seberapa banyak keuntunganmu jika kamu menabung secara disiplin (Dollar Cost Averaging) pada bulan-bulan sebelumnya.
            </p>

            <div className="form-group">
              <label htmlFor="monthlySaving">Tabungan Rutin / Bulan (Rupiah)</label>
              <div className="input-wrapper">
                <span className="input-prefix">Rp</span>
                <input
                  id="monthlySaving"
                  type="number"
                  className="form-control"
                  style={{ paddingLeft: '45px' }}
                  value={monthlySaving}
                  onChange={(e) => setMonthlySaving(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Durasi Menabung</label>
              <div className="duration-buttons">
                {[3, 6, 12].map((m) => (
                  <button
                    key={m}
                    type="button"
                    className={`btn ${dcaMonths === m ? 'btn-primary' : 'btn-secondary'}`}
                    style={{ flex: 1 }}
                    onClick={() => setDcaMonths(m)}
                  >
                    {m} Bulan
                  </button>
                ))}
              </div>
            </div>

            {/* Hasil Simulasi DCA */}
            {dcaSimulation && (
              <div className="dca-results">
                <div className="dca-results-header text-gold">Hasil Simulasi Tabungan:</div>
                
                <div className="grid grid-2 dca-metrics">
                  <div className="dca-metric-item">
                    <span className="dca-lbl">Total Disetorkan</span>
                    <span className="dca-val">{formatCurrency(dcaSimulation.totalInvested)}</span>
                  </div>
                  <div className="dca-metric-item">
                    <span className="dca-lbl">Aset Terkumpul</span>
                    <span className="dca-val">{formatGram(dcaSimulation.totalGramsAccumulated)}</span>
                  </div>
                  <div className="dca-metric-item">
                    <span className="dca-lbl">Nilai Sekarang</span>
                    <span className="dca-val" style={{ fontWeight: 700 }}>{formatCurrency(dcaSimulation.finalValue)}</span>
                  </div>
                  <div className="dca-metric-item">
                    <span className="dca-lbl">Estimasi Profit</span>
                    <span className={`dca-val ${dcaSimulation.profitLoss >= 0 ? 'text-green' : 'text-red'}`}>
                      {formatCurrency(dcaSimulation.profitLoss)} ({dcaSimulation.profitPercent}%)
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GoldAnalysis;
