import { useState, useMemo } from 'react';
import { useApp } from '../contexts/AppContext';
import { useToast } from '../contexts/ToastContext';
import Modal from '../components/ui/Modal';
import EmptyState from '../components/ui/EmptyState';
import { FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi';
import {
  formatCurrency, formatGram, formatDate, generateId,
  getTodayDate, isPositiveNumber,
} from '../utils/helpers';
import './SavingsPage.css';

/**
 * SavingsPage
 * Halaman tabungan emas: tambah, edit, hapus transaksi.
 * Form validasi + riwayat transaksi + semua data di Local Storage.
 */
const SavingsPage = () => {
  const {
    transactions, addTransaction, updateTransaction,
    deleteTransaction, updateStreak, unlockBadge, totalGram,
  } = useApp();
  const toast = useToast();

  // State modal & form
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [form, setForm] = useState({
    date: getTodayDate(),
    gram: '',
    pricePerGram: '',
  });
  const [errors, setErrors] = useState({});

  // Hitung total otomatis
  const calculatedTotal = useMemo(() => {
    const g = Number(form.gram);
    const p = Number(form.pricePerGram);
    if (g > 0 && p > 0) return g * p;
    return 0;
  }, [form.gram, form.pricePerGram]);

  // Transaksi terurut dari terbaru
  const sortedTransactions = useMemo(() => {
    return [...transactions].sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [transactions]);

  // Validasi form
  const validateForm = () => {
    const newErrors = {};
    if (!form.date) newErrors.date = 'Tanggal wajib diisi';
    if (!isPositiveNumber(form.gram)) newErrors.gram = 'Berat harus angka positif';
    if (!isPositiveNumber(form.pricePerGram)) newErrors.pricePerGram = 'Harga harus angka positif';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Buka modal untuk tambah transaksi baru
  const handleAdd = () => {
    setEditingId(null);
    setForm({ date: getTodayDate(), gram: '', pricePerGram: '' });
    setErrors({});
    setModalOpen(true);
  };

  // Buka modal untuk edit transaksi
  const handleEdit = (transaction) => {
    setEditingId(transaction.id);
    setForm({
      date: transaction.date,
      gram: transaction.gram.toString(),
      pricePerGram: transaction.pricePerGram.toString(),
    });
    setErrors({});
    setModalOpen(true);
  };

  // Submit form (tambah / update)
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const data = {
      date: form.date,
      gram: Number(form.gram),
      pricePerGram: Number(form.pricePerGram),
      total: Number(form.gram) * Number(form.pricePerGram),
    };

    if (editingId) {
      // Update transaksi
      updateTransaction(editingId, data);
      toast.success('Transaksi berhasil diperbarui!');
    } else {
      // Tambah transaksi baru
      addTransaction({ ...data, id: generateId(), note: '' });
      updateStreak(); // Update streak menabung
      
      // Cek badge
      const newTotal = totalGram + data.gram;
      if (transactions.length === 0) unlockBadge('first_buy');
      if (transactions.length + 1 >= 10) unlockBadge('trans_10');
      if (transactions.length + 1 >= 50) unlockBadge('trans_50');
      if (newTotal >= 5) unlockBadge('gram_5');
      if (newTotal >= 10) unlockBadge('gram_10');
      if (newTotal >= 50) unlockBadge('gram_50');
      
      toast.success('Transaksi berhasil ditambahkan! 🎉');
    }

    setModalOpen(false);
  };

  // Konfirmasi hapus
  const handleDelete = (id) => {
    deleteTransaction(id);
    setConfirmDelete(null);
    toast.success('Transaksi berhasil dihapus');
  };

  // Handle perubahan input form
  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    // Hapus error saat user mulai mengetik
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="page-wrapper">
      <div className="container">
        {/* Header */}
        <div className="page-header">
          <div className="savings-header">
            <div>
              <h1>Tabungan Emas</h1>
              <p>Catat setiap pembelian emasmu di sini.</p>
            </div>
            <button className="btn btn-primary" onClick={handleAdd}>
              <FiPlus /> Tambah Transaksi
            </button>
          </div>
        </div>

        {/* Ringkasan */}
        <div className="grid grid-3 savings-summary">
          <div className="card stat-card">
            <div className="stat-label">Total Transaksi</div>
            <div className="stat-value">{transactions.length}</div>
          </div>
          <div className="card stat-card">
            <div className="stat-label">Total Emas</div>
            <div className="stat-value">{formatGram(totalGram)}</div>
          </div>
          <div className="card stat-card">
            <div className="stat-label">Total Investasi</div>
            <div className="stat-value" style={{ fontSize: '18px' }}>
              {formatCurrency(transactions.reduce((s, t) => s + t.total, 0))}
            </div>
          </div>
        </div>

        {/* Tabel Riwayat Transaksi */}
        {sortedTransactions.length > 0 ? (
          <div className="card">
            <h2 style={{ marginBottom: '16px', fontSize: '18px', fontWeight: 700 }}>
              📋 Riwayat Transaksi
            </h2>
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>No</th>
                    <th>Tanggal</th>
                    <th>Berat (gram)</th>
                    <th>Harga/gram</th>
                    <th>Total</th>
                    <th>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedTransactions.map((t, index) => (
                    <tr key={t.id}>
                      <td>{index + 1}</td>
                      <td>{formatDate(t.date)}</td>
                      <td>{formatGram(t.gram)}</td>
                      <td>{formatCurrency(t.pricePerGram)}</td>
                      <td><strong>{formatCurrency(t.total)}</strong></td>
                      <td>
                        <div className="action-btns">
                          <button
                            className="btn btn-ghost btn-sm"
                            onClick={() => handleEdit(t)}
                            title="Edit"
                          >
                            <FiEdit2 />
                          </button>
                          <button
                            className="btn btn-ghost btn-sm"
                            onClick={() => setConfirmDelete(t.id)}
                            title="Hapus"
                            style={{ color: 'var(--red-500)' }}
                          >
                            <FiTrash2 />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="card">
            <EmptyState
              icon="🪙"
              title="Belum Ada Transaksi"
              message="Mulai catat pembelian emasmu dengan menambahkan transaksi pertama."
              actionLabel="Tambah Transaksi"
              onAction={handleAdd}
            />
          </div>
        )}

        {/* ---- Modal Form Transaksi ---- */}
        <Modal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          title={editingId ? 'Edit Transaksi' : 'Tambah Transaksi'}
        >
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="date">Tanggal Transaksi</label>
              <input
                id="date"
                type="date"
                className="form-control"
                value={form.date}
                onChange={(e) => handleChange('date', e.target.value)}
              />
              {errors.date && <div className="form-error">{errors.date}</div>}
            </div>

            <div className="form-group">
              <label htmlFor="gram">Berat Emas (gram)</label>
              <input
                id="gram"
                type="number"
                step="0.01"
                className="form-control"
                placeholder="Contoh: 1.5"
                value={form.gram}
                onChange={(e) => handleChange('gram', e.target.value)}
              />
              {errors.gram && <div className="form-error">{errors.gram}</div>}
            </div>

            <div className="form-group">
              <label htmlFor="pricePerGram">Harga per Gram (Rp)</label>
              <input
                id="pricePerGram"
                type="number"
                className="form-control"
                placeholder="Contoh: 1250000"
                value={form.pricePerGram}
                onChange={(e) => handleChange('pricePerGram', e.target.value)}
              />
              {errors.pricePerGram && <div className="form-error">{errors.pricePerGram}</div>}
            </div>

            {/* Total otomatis */}
            <div className="calculated-total">
              <span>Total Transaksi:</span>
              <span className="total-value">{formatCurrency(calculatedTotal)}</span>
            </div>

            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={() => setModalOpen(false)}>
                Batal
              </button>
              <button type="submit" className="btn btn-primary">
                {editingId ? 'Simpan Perubahan' : 'Tambah Transaksi'}
              </button>
            </div>
          </form>
        </Modal>

        {/* ---- Modal Konfirmasi Hapus ---- */}
        <Modal
          isOpen={!!confirmDelete}
          onClose={() => setConfirmDelete(null)}
          title="Konfirmasi Hapus"
        >
          <p style={{ marginBottom: '8px', color: 'var(--gray-600)' }}>
            Apakah kamu yakin ingin menghapus transaksi ini? Tindakan ini tidak dapat dibatalkan.
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

export default SavingsPage;
