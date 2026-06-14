import { useState, useMemo } from 'react';
import { useApp } from '../contexts/AppContext';
import { useToast } from '../contexts/ToastContext';
import Modal from '../components/ui/Modal';
import EmptyState from '../components/ui/EmptyState';
import { FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi';
import {
  formatCurrency, formatGram, formatDate, generateId,
  calculateProgress, daysBetween, getTodayDate,
  isPositiveNumber, calculateAverage,
} from '../utils/helpers';
import { MILESTONE_MESSAGES } from '../utils/constants';
import './GoalTracker.css';

/**
 * GoalTracker
 * Halaman untuk membuat dan memantau target keuangan emas.
 * Menampilkan progress, estimasi pencapaian, dan motivasi di milestone.
 */
const GoalTracker = () => {
  const {
    goals, addGoal, updateGoal, deleteGoal,
    totalGram, transactions, unlockBadge,
  } = useApp();
  const toast = useToast();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [form, setForm] = useState({
    name: '',
    targetGram: '',
    targetNominal: '',
    deadline: '',
  });
  const [errors, setErrors] = useState({});

  // Rata-rata tabungan gram per bulan
  const avgGramPerMonth = useMemo(() => {
    if (transactions.length < 2) return 0;
    const sorted = [...transactions].sort((a, b) => new Date(a.date) - new Date(b.date));
    const firstDate = new Date(sorted[0].date);
    const lastDate = new Date(sorted[sorted.length - 1].date);
    const months = Math.max(1, (lastDate - firstDate) / (1000 * 60 * 60 * 24 * 30));
    return totalGram / months;
  }, [transactions, totalGram]);

  // Validasi form
  const validateForm = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = 'Nama tujuan wajib diisi';
    if (!isPositiveNumber(form.targetGram)) newErrors.targetGram = 'Target gram harus positif';
    if (!isPositiveNumber(form.targetNominal)) newErrors.targetNominal = 'Target nominal harus positif';
    if (!form.deadline) newErrors.deadline = 'Deadline wajib diisi';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAdd = () => {
    setEditingId(null);
    setForm({ name: '', targetGram: '', targetNominal: '', deadline: '' });
    setErrors({});
    setModalOpen(true);
  };

  const handleEdit = (goal) => {
    setEditingId(goal.id);
    setForm({
      name: goal.name,
      targetGram: goal.targetGram.toString(),
      targetNominal: goal.targetNominal.toString(),
      deadline: goal.deadline,
    });
    setErrors({});
    setModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const data = {
      name: form.name,
      targetGram: Number(form.targetGram),
      targetNominal: Number(form.targetNominal),
      deadline: form.deadline,
    };

    if (editingId) {
      updateGoal(editingId, data);
      toast.success('Target berhasil diperbarui!');
    } else {
      addGoal({ ...data, id: generateId(), createdAt: getTodayDate() });
      if (goals.length === 0) unlockBadge('goal_1');
      if (goals.length + 1 >= 5) unlockBadge('goal_5');
      toast.success('Target baru berhasil ditambahkan! 🎯');
    }

    setModalOpen(false);
  };

  const handleDelete = (id) => {
    deleteGoal(id);
    setConfirmDelete(null);
    toast.success('Target berhasil dihapus');
  };

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  // Dapatkan pesan motivasi berdasarkan progress
  const getMotivation = (progress) => {
    const milestones = Object.keys(MILESTONE_MESSAGES)
      .map(Number)
      .sort((a, b) => b - a);
    for (const milestone of milestones) {
      if (progress >= milestone) return MILESTONE_MESSAGES[milestone];
    }
    return '💡 Mulai langkah pertamamu hari ini!';
  };

  // Estimasi kapan target tercapai
  const getEstimation = (targetGram) => {
    if (avgGramPerMonth <= 0) return 'Belum cukup data';
    const remaining = targetGram - totalGram;
    if (remaining <= 0) return 'Tercapai!';
    const monthsNeeded = Math.ceil(remaining / avgGramPerMonth);
    if (monthsNeeded <= 1) return '~1 bulan lagi';
    if (monthsNeeded < 12) return `~${monthsNeeded} bulan lagi`;
    const years = Math.floor(monthsNeeded / 12);
    const months = monthsNeeded % 12;
    return `~${years} tahun ${months > 0 ? months + ' bulan' : ''} lagi`;
  };

  return (
    <div className="page-wrapper">
      <div className="container">
        <div className="page-header">
          <div className="savings-header">
            <div>
              <h1>Goal Tracker</h1>
              <p>Tetapkan dan pantau target tabungan emasmu.</p>
            </div>
            <button className="btn btn-primary" onClick={handleAdd}>
              <FiPlus /> Buat Target Baru
            </button>
          </div>
        </div>

        {/* Info rata-rata tabungan */}
        <div className="card avg-info animate-fade-in">
          <span>📊 Rata-rata tabunganmu:</span>
          <strong>{formatGram(avgGramPerMonth)} / bulan</strong>
        </div>

        {/* Daftar Goals */}
        {goals.length > 0 ? (
          <div className="goals-grid">
            {goals.map((goal, i) => {
              const progress = calculateProgress(totalGram, goal.targetGram);
              const daysLeft = daysBetween(getTodayDate(), goal.deadline);
              const isPastDeadline = new Date(goal.deadline) < new Date();
              const motivation = getMotivation(progress);
              const estimation = getEstimation(goal.targetGram);

              return (
                <div
                  key={goal.id}
                  className="card goal-card animate-fade-in"
                  style={{ animationDelay: `${i * 0.1}s` }}
                >
                  <div className="goal-card-header">
                    <h3>{goal.name}</h3>
                    <div className="action-btns">
                      <button
                        className="btn btn-ghost btn-sm"
                        onClick={() => handleEdit(goal)}
                      >
                        <FiEdit2 />
                      </button>
                      <button
                        className="btn btn-ghost btn-sm"
                        onClick={() => setConfirmDelete(goal.id)}
                        style={{ color: 'var(--red-500)' }}
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </div>

                  {/* Progress */}
                  <div className="goal-progress-section">
                    <div className="goal-progress-header">
                      <span className="goal-progress-text">Progress</span>
                      <span className="goal-progress-percent">{progress.toFixed(1)}%</span>
                    </div>
                    <div className="progress-bar-container" style={{ height: '12px' }}>
                      <div
                        className="progress-bar-fill"
                        style={{
                          width: `${progress}%`,
                          background: progress >= 100
                            ? 'linear-gradient(135deg, #22c55e, #16a34a)'
                            : 'var(--gradient-gold-dark)',
                        }}
                      />
                    </div>
                    <div className="goal-gram-info">
                      <span>{formatGram(totalGram)}</span>
                      <span>/ {formatGram(goal.targetGram)}</span>
                    </div>
                  </div>

                  {/* Detail */}
                  <div className="goal-details">
                    <div className="goal-detail-item">
                      <span className="gd-label">Target Nominal</span>
                      <span className="gd-value">{formatCurrency(goal.targetNominal)}</span>
                    </div>
                    <div className="goal-detail-item">
                      <span className="gd-label">Deadline</span>
                      <span className={`gd-value ${isPastDeadline ? 'text-red' : ''}`}>
                        {formatDate(goal.deadline)}
                      </span>
                    </div>
                    <div className="goal-detail-item">
                      <span className="gd-label">Sisa Waktu</span>
                      <span className={`gd-value ${isPastDeadline ? 'text-red' : ''}`}>
                        {isPastDeadline ? 'Sudah lewat' : `${daysLeft} hari`}
                      </span>
                    </div>
                    <div className="goal-detail-item">
                      <span className="gd-label">Estimasi Tercapai</span>
                      <span className="gd-value">{estimation}</span>
                    </div>
                  </div>

                  {/* Motivasi */}
                  <div className="goal-motivation">
                    {motivation}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="card">
            <EmptyState
              icon="🎯"
              title="Belum Ada Target"
              message="Buat target tabungan emas pertamamu untuk mulai tracking progres."
              actionLabel="Buat Target"
              onAction={handleAdd}
            />
          </div>
        )}

        {/* Modal Form */}
        <Modal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          title={editingId ? 'Edit Target' : 'Buat Target Baru'}
        >
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="goalName">Nama Tujuan</label>
              <input
                id="goalName"
                type="text"
                className="form-control"
                placeholder="Contoh: Dana Darurat"
                value={form.name}
                onChange={(e) => handleChange('name', e.target.value)}
              />
              {errors.name && <div className="form-error">{errors.name}</div>}
            </div>

            <div className="form-group">
              <label htmlFor="targetGram">Target Gram Emas</label>
              <input
                id="targetGram"
                type="number"
                step="0.01"
                className="form-control"
                placeholder="Contoh: 25"
                value={form.targetGram}
                onChange={(e) => handleChange('targetGram', e.target.value)}
              />
              {errors.targetGram && <div className="form-error">{errors.targetGram}</div>}
            </div>

            <div className="form-group">
              <label htmlFor="targetNominal">Target Nominal (Rp)</label>
              <input
                id="targetNominal"
                type="number"
                className="form-control"
                placeholder="Contoh: 31250000"
                value={form.targetNominal}
                onChange={(e) => handleChange('targetNominal', e.target.value)}
              />
              {errors.targetNominal && <div className="form-error">{errors.targetNominal}</div>}
            </div>

            <div className="form-group">
              <label htmlFor="deadline">Deadline</label>
              <input
                id="deadline"
                type="date"
                className="form-control"
                value={form.deadline}
                onChange={(e) => handleChange('deadline', e.target.value)}
              />
              {errors.deadline && <div className="form-error">{errors.deadline}</div>}
            </div>

            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={() => setModalOpen(false)}>
                Batal
              </button>
              <button type="submit" className="btn btn-primary">
                {editingId ? 'Simpan Perubahan' : 'Buat Target'}
              </button>
            </div>
          </form>
        </Modal>

        {/* Modal Konfirmasi Hapus */}
        <Modal
          isOpen={!!confirmDelete}
          onClose={() => setConfirmDelete(null)}
          title="Konfirmasi Hapus"
        >
          <p style={{ marginBottom: '8px', color: 'var(--gray-600)' }}>
            Apakah kamu yakin ingin menghapus target ini?
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

export default GoalTracker;
