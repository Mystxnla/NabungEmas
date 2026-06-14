import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import {
  FiDollarSign, FiTrendingUp, FiTrendingDown, FiTarget, FiAward,
  FiArrowRight, FiArrowUpRight, FiArrowDownRight,
} from 'react-icons/fi';
import {
  formatCurrency, formatGram, formatDate, calculateProgress,
} from '../utils/helpers';
import './Dashboard.css';

/**
 * Dashboard
 * Halaman ringkasan utama yang menampilkan:
 * - Total emas, nilai aset, profit/loss
 * - Target aktif dengan progress bar
 * - Aktivitas terbaru
 * - Level dan streak pengguna
 */
const Dashboard = () => {
  const {
    transactions, sellTransactions, goals,
    totalGram, netGram, totalSoldGram,
    totalInvested, currentValue, profitLoss,
    realizedProfit, userLevel, levelProgress,
    streak, CURRENT_GOLD_PRICE,
  } = useApp();

  // Profit dalam persen
  const profitPercent = useMemo(() => {
    if (totalInvested === 0) return 0;
    return ((profitLoss / totalInvested) * 100).toFixed(2);
  }, [profitLoss, totalInvested]);

  // 5 aktivitas terbaru (beli + jual, diurutkan by date)
  const recentActivity = useMemo(() => {
    const buys = transactions.map((t) => ({ ...t, type: 'buy' }));
    const sells = sellTransactions.map((t) => ({ ...t, type: 'sell' }));
    return [...buys, ...sells]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 5);
  }, [transactions, sellTransactions]);

  // Target aktif (belum melewati deadline atau belum tercapai 100%)
  const activeGoals = useMemo(() => {
    return goals.filter((g) => {
      const progress = calculateProgress(netGram, g.targetGram);
      return progress < 100;
    }).slice(0, 3);
  }, [goals, netGram]);

  return (
    <div className="page-wrapper">
      <div className="container">
        {/* Header */}
        <div className="page-header">
          <h1>Dashboard</h1>
          <p>Selamat datang kembali! Berikut ringkasan tabungan emasmu.</p>
        </div>

        {/* ---- Stat Cards ---- */}
        <div className="grid grid-4 dashboard-stats">
          {/* Total Emas (bersih setelah jual) */}
          <div className="card stat-card animate-fade-in" style={{ animationDelay: '0s' }}>
            <div className="stat-icon gold"><FiDollarSign /></div>
            <div className="stat-label">Stok Emas</div>
            <div className="stat-value">{formatGram(netGram)}</div>
            <div className="stat-change positive">
              <FiArrowUpRight /> {transactions.length} pembelian
            </div>
          </div>

          {/* Nilai Aset */}
          <div className="card stat-card animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <div className="stat-icon blue"><FiTrendingUp /></div>
            <div className="stat-label">Estimasi Nilai</div>
            <div className="stat-value" style={{ fontSize: '20px' }}>{formatCurrency(currentValue)}</div>
            <div className="stat-change" style={{ color: 'var(--gray-400)' }}>
              Harga: {formatCurrency(CURRENT_GOLD_PRICE)}/gram
            </div>
          </div>

          {/* Profit/Loss Unrealized */}
          <div className="card stat-card animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <div className={`stat-icon ${profitLoss >= 0 ? 'green' : 'red'}`}>
              {profitLoss >= 0 ? <FiArrowUpRight /> : <FiArrowDownRight />}
            </div>
            <div className="stat-label">Profit / Loss</div>
            <div className="stat-value" style={{ fontSize: '20px' }}>{formatCurrency(profitLoss)}</div>
            <div className={`stat-change ${profitLoss >= 0 ? 'positive' : 'negative'}`}>
              {profitLoss >= 0 ? <FiArrowUpRight /> : <FiArrowDownRight />}
              {profitPercent}%
            </div>
          </div>

          {/* Profit Terealisasi */}
          <div className="card stat-card animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <div className={`stat-icon ${realizedProfit >= 0 ? 'green' : 'red'}`}>
              <FiTrendingDown />
            </div>
            <div className="stat-label">Profit Terealisasi</div>
            <div
              className="stat-value"
              style={{ fontSize: '18px', color: realizedProfit >= 0 ? 'var(--green-500)' : 'var(--red-500)' }}
            >
              {realizedProfit >= 0 ? '+' : ''}{formatCurrency(realizedProfit)}
            </div>
            <div className="stat-change" style={{ color: 'var(--gray-400)' }}>
              🏷️ {formatGram(totalSoldGram)} terjual
            </div>
          </div>
        </div>

        {/* ---- Content Grid ---- */}
        <div className="dashboard-grid">
          {/* Target Aktif */}
          <div className="card animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <div className="section-header">
              <h2>🎯 Target Aktif</h2>
              <Link to="/goals" className="btn btn-ghost btn-sm">
                Lihat Semua <FiArrowRight />
              </Link>
            </div>
            {activeGoals.length > 0 ? (
              <div className="goal-list">
                {activeGoals.map((goal) => {
                  const progress = calculateProgress(totalGram, goal.targetGram);
                  return (
                    <div key={goal.id} className="goal-item">
                      <div className="goal-item-header">
                        <span className="goal-name">{goal.name}</span>
                        <span className="goal-percent">{progress.toFixed(1)}%</span>
                      </div>
                      <div className="progress-bar-container">
                        <div
                          className="progress-bar-fill"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      <div className="goal-item-footer">
                        <span>{formatGram(totalGram)} / {formatGram(goal.targetGram)}</span>
                        <span className="goal-deadline">
                          Deadline: {formatDate(goal.deadline)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="empty-state" style={{ padding: '30px' }}>
                <p style={{ color: 'var(--gray-400)' }}>Belum ada target aktif</p>
                <Link to="/goals" className="btn btn-primary btn-sm">
                  Buat Target
                </Link>
              </div>
            )}
          </div>

          {/* Aktivitas Terbaru (beli + jual) */}
          <div className="card animate-fade-in" style={{ animationDelay: '0.5s' }}>
            <div className="section-header">
              <h2>📋 Aktivitas Terbaru</h2>
              <Link to="/savings" className="btn btn-ghost btn-sm">
                Lihat Semua <FiArrowRight />
              </Link>
            </div>
            {recentActivity.length > 0 ? (
              <div className="activity-list">
                {recentActivity.map((t) => (
                  <div key={t.id + t.type} className="activity-item">
                    <div className={`activity-icon ${t.type === 'sell' ? 'activity-sell' : ''}`}>
                      {t.type === 'sell' ? '📤' : '🪙'}
                    </div>
                    <div className="activity-info">
                      <span className="activity-title">
                        {t.type === 'sell' ? 'Jual' : 'Beli'} {formatGram(t.gram)}
                      </span>
                      <span className="activity-date">
                        {formatDate(t.date)}
                      </span>
                    </div>
                    <span
                      className="activity-amount"
                      style={{ color: t.type === 'sell' ? 'var(--red-500)' : undefined }}
                    >
                      {t.type === 'sell' ? '-' : '+'}{formatCurrency(t.total)}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state" style={{ padding: '30px' }}>
                <p style={{ color: 'var(--gray-400)' }}>Belum ada transaksi</p>
                <Link to="/savings" className="btn btn-primary btn-sm">
                  Tambah Transaksi
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* ---- Level Progress + Streak ---- */}
        <div className="dashboard-grid" style={{ marginTop: 0 }}>
          {/* Level Progress */}
          <div className="card level-card animate-fade-in" style={{ animationDelay: '0.6s' }}>
            <div className="level-info">
              <div>
                <h3>Level Progress</h3>
                <p>
                  {userLevel.icon} {userLevel.name} → Level berikutnya
                </p>
              </div>
              <span className="level-percent">{levelProgress.toFixed(0)}%</span>
            </div>
            <div className="progress-bar-container" style={{ height: '12px' }}>
              <div
                className="progress-bar-fill"
                style={{ width: `${levelProgress}%` }}
              />
            </div>
          </div>

          {/* Streak Card */}
          <div className="card stat-card animate-fade-in" style={{ animationDelay: '0.7s' }}>
            <div className="stat-icon gold"><FiAward /></div>
            <div className="stat-label">Level {userLevel.level} — {userLevel.name}</div>
            <div className="stat-value" style={{ fontSize: '20px' }}>🔥 {streak.currentStreak} bulan</div>
            <div className="stat-change positive">
              <FiArrowUpRight /> Streak terpanjang: {streak.longestStreak} bulan
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
