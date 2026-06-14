import { useState, useMemo } from 'react';
import { useApp } from '../contexts/AppContext';
import { useToast } from '../contexts/ToastContext';
import Modal from '../components/ui/Modal';
import EmptyState from '../components/ui/EmptyState';
import {
  FiTrendingDown, FiTrash2, FiAlertTriangle,
  FiArrowUpRight, FiArrowDownRight, FiPackage,
  FiDollarSign, FiCheckCircle,
} from 'react-icons/fi';
import {
  formatCurrency, formatGram, formatDate,
  generateId, getTodayDate, isPositiveNumber,
} from '../utils/helpers';
import './SellPage.css';

/**
 * SellPage
 * Halaman jual emas: catat penjualan, lihat profit terealisasi,
 * dan riwayat semua transaksi jual.
 */
const SellPage = () => {
  const {
    netGram, avgBuyPrice, addSellTransaction,
    deleteSellTransaction, sellTransactions,
    totalSoldGram, realizedProfit, totalSellRevenue,
    CURRENT_GOLD_PRICE,
  } = useApp();
  const toast = useToast();

  // State modal & form
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [form, setForm] = useState({
    date: getTodayDate(),
    gram: '',
    pricePerGram: CURRENT_GOLD_PRICE.toString(),
    note: '',
  });
  const [errors, setErrors] = useState({});

  // Kalkulasi real-time
  const calculatedTotal = useMemo(() => {
    const g = Number(form.gram);
    const p = Number(form.pricePerGram);
    if (g > 0 && p > 0) return g * p;
    return 0;
  }, [form.gram, form.pricePerGram]);

  const estimatedProfit = useMemo(() => {
    const g = Number(form.gram);
    const p = Number(form.pricePerGram);
    if (g > 0 && p > 0) {
      const costBasis = g * avgBuyPrice;
      return calculatedTotal - costBasis;
    }
    return 0;
  }, [calculatedTotal, form.gram, avgBuyPrice]);

  // Sortir riwayat jual
  const sortedSellTransactions = useMemo(() => {
    return [...sellTransactions].sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [sellTransactions]);

  // Validasi form
  const validateForm = () => {
    const newErrors = {};
    if (!form.date) newErrors.date = 'Tanggal wajib diisi';
    if (!isPositiveNumber(form.gram)) {
      newErrors.gram = 'Berat harus angka positif';
    } else if (Number(form.gram) > netGram) {
      newErrors.gram = `Tidak bisa jual lebih dari stok (${formatGram(netGram)})`;
    }
    if (!isPositiveNumber(form.pricePerGram)) {
      newErrors.pricePerGram = 'Harga harus angka positif';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleOpenModal = () => {
    setForm({
      date: getTodayDate(),
      gram: '',
      pricePerGram: CURRENT_GOLD_PRICE.toString(),
      note: '',
    });
    setErrors({});
    setModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const data = {
      id: generateId(),
      date: form.date,
      gram: Number(form.gram),
      pricePerGram: Number(form.pricePerGram),
      total: Number(form.gram) * Number(form.pricePerGram),
      note: form.note || '',
    };

    addSellTransaction(data);
    toast.success(`Berhasil jual ${formatGram(data.gram)} senilai ${formatCurrency(data.total)}! 💰`);
    setModalOpen(false);
  };

  const handleDelete = (id) => {
    deleteSellTransaction(id);
    setConfirmDelete(null);
    toast.success('Transaksi jual berhasil dihapus');
  };

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const canSell = netGram > 0;

  return (
    <div className="page-wrapper">
      <div className="container">
        {/* Header */}
        <div className="page-header sell-page-header">
          <div className="sell-header-content">
            <div className="sell-header-icon">
              <FiTrendingDown />
            </div>
            <div>
              <h1>Jual Emas</h1>
              <p>Catat dan kelola transaksi penjualan emasmu.</p>
            </div>
          </div>
          <button
            className="btn btn-sell"
            onClick={handleOpenModal}
            disabled={!canSell}
            id="btn-jual-emas"
          >
            <FiTrendingDown /> Jual Emas
          </button>
        </div>

        {/* Alert stok kosong */}
        {!canSell && (
          <div className="sell-alert">
            <FiAlertTriangle />
            <span>Kamu belum memiliki emas untuk dijual. Beli emas terlebih dahulu di halaman <strong>Tabungan</strong>.</span>
          </div>
        )}

        {/* Ringkasan */}
        <div className="grid grid-4 sell-summary">
          {/* Stok Tersedia */}
          <div className="card stat-card sell-stat">
            <div className="stat-icon orange">
              <FiPackage />
            </div>
            <div className="stat-label">Stok Tersedia</div>
            <div className="stat-value">{formatGram(netGram)}</div>
            <div className="stat-change" style={{ color: 'var(--gray-400)' }}>
              Siap dijual
            </div>
          </div>

          {/* Total Terjual */}
          <div className="card stat-card sell-stat">
            <div className="stat-icon red">
              <FiTrendingDown />
            </div>
            <div className="stat-label">Total Terjual</div>
            <div className="stat-value">{formatGram(totalSoldGram)}</div>
            <div className="stat-change" style={{ color: 'var(--gray-400)' }}>
              {sellTransactions.length} transaksi
            </div>
          </div>

          {/* Total Pendapatan */}
          <div className="card stat-card sell-stat">
            <div className="stat-icon blue">
              <FiDollarSign />
            </div>
            <div className="stat-label">Total Pendapatan</div>
            <div className="stat-value sell-stat-value">{formatCurrency(totalSellRevenue)}</div>
            <div className="stat-change" style={{ color: 'var(--gray-400)' }}>
              Dari penjualan
            </div>
          </div>

          {/* Profit Terealisasi */}
          <div className="card stat-card sell-stat">
            <div className={`stat-icon ${realizedProfit >= 0 ? 'green' : 'red'}`}>
              {realizedProfit >= 0 ? <FiArrowUpRight /> : <FiArrowDownRight />}
            </div>
            <div className="stat-label">Profit Terealisasi</div>
            <div
              className="stat-value sell-stat-value"
              style={{ color: realizedProfit >= 0 ? 'var(--green-500)' : 'var(--red-500)' }}
            >
              {realizedProfit >= 0 ? '+' : ''}{formatCurrency(realizedProfit)}
            </div>
            <div className={`stat-change ${realizedProfit >= 0 ? 'positive' : 'negative'}`}>
              {realizedProfit >= 0 ? <FiArrowUpRight /> : <FiArrowDownRight />}
              vs harga beli rata-rata
            </div>
          </div>
        </div>

        {/* Harga beli rata-rata info */}
        <div className="sell-info-bar">
          <div className="sell-info-item">
            <span className="sell-info-label">Harga Beli Rata-rata:</span>
            <span className="sell-info-value">{formatCurrency(avgBuyPrice)}/gram</span>
          </div>
          <div className="sell-info-divider" />
          <div className="sell-info-item">
            <span className="sell-info-label">Harga Pasar Saat Ini:</span>
            <span className="sell-info-value gold">{formatCurrency(CURRENT_GOLD_PRICE)}/gram</span>
          </div>
          <div className="sell-info-divider" />
          <div className="sell-info-item">
            <span className="sell-info-label">Selisih:</span>
            <span
              className="sell-info-value"
              style={{
                color: CURRENT_GOLD_PRICE >= avgBuyPrice ? 'var(--green-500)' : 'var(--red-500)',
              }}
            >
              {CURRENT_GOLD_PRICE >= avgBuyPrice ? '+' : ''}
              {formatCurrency(CURRENT_GOLD_PRICE - avgBuyPrice)}/gram
            </span>
          </div>
        </div>

        {/* Riwayat Transaksi Jual */}
        {sortedSellTransactions.length > 0 ? (
          <div className="card">
            <h2 style={{ marginBottom: '16px', fontSize: '18px', fontWeight: 700 }}>
              📤 Riwayat Penjualan
            </h2>
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>No</th>
                    <th>Tanggal</th>
                    <th>Berat (gram)</th>
                    <th>Harga Jual/gram</th>
                    <th>Total Diterima</th>
                    <th>Profit/Loss</th>
                    <th>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedSellTransactions.map((t, index) => {
                    const profit = t.total - (t.gram * avgBuyPrice);
                    return (
                      <tr key={t.id}>
                        <td>{index + 1}</td>
                        <td>{formatDate(t.date)}</td>
                        <td>
                          <span className="sell-badge-gram">{formatGram(t.gram)}</span>
                        </td>
                        <td>{formatCurrency(t.pricePerGram)}</td>
                        <td><strong>{formatCurrency(t.total)}</strong></td>
                        <td>
                          <span
                            className={`profit-badge ${profit >= 0 ? 'profit-positive' : 'profit-negative'}`}
                          >
                            {profit >= 0 ? <FiArrowUpRight /> : <FiArrowDownRight />}
                            {profit >= 0 ? '+' : ''}{formatCurrency(profit)}
                          </span>
                        </td>
                        <td>
                          <button
                            className="btn btn-ghost btn-sm"
                            onClick={() => setConfirmDelete(t.id)}
                            title="Hapus"
                            style={{ color: 'var(--red-500)' }}
                          >
                            <FiTrash2 />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="card">
            <EmptyState
              icon="📤"
              title="Belum Ada Penjualan"
              message={canSell
                ? 'Kamu belum pernah menjual emas. Klik tombol "Jual Emas" untuk mencatat penjualan.'
                : 'Beli emas terlebih dahulu sebelum bisa menjual.'}
              actionLabel={canSell ? 'Jual Emas Sekarang' : null}
              onAction={canSell ? handleOpenModal : null}
            />
          </div>
        )}

        {/* ---- Modal Form Jual Emas ---- */}
        <Modal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          title="Jual Emas"
        >
          <form onSubmit={handleSubmit}>
            {/* Info stok tersedia */}
            <div className="sell-modal-stock-info">
              <FiCheckCircle />
              <span>Stok tersedia: <strong>{formatGram(netGram)}</strong></span>
            </div>

            <div className="form-group">
              <label htmlFor="sell-date">Tanggal Penjualan</label>
              <input
                id="sell-date"
                type="date"
                className="form-control"
                value={form.date}
                onChange={(e) => handleChange('date', e.target.value)}
              />
              {errors.date && <div className="form-error">{errors.date}</div>}
            </div>

            <div className="form-group">
              <label htmlFor="sell-gram">
                Berat Emas yang Dijual (gram)
                <span className="label-hint"> — maks {formatGram(netGram)}</span>
              </label>
              <input
                id="sell-gram"
                type="number"
                step="0.01"
                min="0.01"
                max={netGram}
                className="form-control"
                placeholder={`Contoh: ${Math.min(1, netGram)}`}
                value={form.gram}
                onChange={(e) => handleChange('gram', e.target.value)}
              />
              {errors.gram && <div className="form-error">{errors.gram}</div>}
            </div>

            <div className="form-group">
              <label htmlFor="sell-price">Harga Jual per Gram (Rp)</label>
              <input
                id="sell-price"
                type="number"
                className="form-control"
                placeholder="Contoh: 1250000"
                value={form.pricePerGram}
                onChange={(e) => handleChange('pricePerGram', e.target.value)}
              />
              {errors.pricePerGram && <div className="form-error">{errors.pricePerGram}</div>}
            </div>

            <div className="form-group">
              <label htmlFor="sell-note">Catatan (opsional)</label>
              <input
                id="sell-note"
                type="text"
                className="form-control"
                placeholder="Contoh: Jual sebagian untuk kebutuhan"
                value={form.note}
                onChange={(e) => handleChange('note', e.target.value)}
              />
            </div>

            {/* Kalkulasi real-time */}
            <div className="sell-calc-box">
              <div className="sell-calc-row">
                <span>Total Diterima:</span>
                <span className="sell-calc-value">{formatCurrency(calculatedTotal)}</span>
              </div>
              <div className="sell-calc-row">
                <span>Harga Beli Rata-rata ({formatGram(Number(form.gram) || 0)}):</span>
                <span>{formatCurrency((Number(form.gram) || 0) * avgBuyPrice)}</span>
              </div>
              <div className="sell-calc-divider" />
              <div className="sell-calc-row sell-calc-profit">
                <span>Estimasi Profit/Loss:</span>
                <span
                  style={{ color: estimatedProfit >= 0 ? 'var(--green-500)' : 'var(--red-500)', fontWeight: 700 }}
                >
                  {estimatedProfit >= 0 ? '+' : ''}{formatCurrency(estimatedProfit)}
                </span>
              </div>
            </div>

            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={() => setModalOpen(false)}>
                Batal
              </button>
              <button type="submit" className="btn btn-sell">
                <FiTrendingDown /> Konfirmasi Jual
              </button>
            </div>
          </form>
        </Modal>

        {/* ---- Modal Konfirmasi Hapus ---- */}
        <Modal
          isOpen={!!confirmDelete}
          onClose={() => setConfirmDelete(null)}
          title="Hapus Riwayat Jual"
        >
          <p style={{ marginBottom: '8px', color: 'var(--gray-600)' }}>
            Apakah kamu yakin ingin menghapus riwayat penjualan ini? Stok emasmu akan dikembalikan.
          </p>
          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={() => setConfirmDelete(null)}>
              Batal
            </button>
            <button className="btn btn-danger" onClick={() => handleDelete(confirmDelete)}>
              Hapus
            </button>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default SellPage;
