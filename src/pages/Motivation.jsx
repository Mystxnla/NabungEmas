import { useState, useMemo, useEffect } from 'react';
import { useApp } from '../contexts/AppContext';
import { useToast } from '../contexts/ToastContext';
import useLocalStorage from '../hooks/useLocalStorage';
import { ACHIEVEMENT_BADGES, MOTIVATIONAL_QUOTES } from '../utils/constants';
import { getDailyQuote, formatCurrency, formatGram, generateId, getTodayDate } from '../utils/helpers';
import { FiAward, FiLock, FiUnlock, FiCheck, FiInfo, FiTrendingUp } from 'react-icons/fi';
import './Motivation.css';

/**
 * Motivation
 * Halaman gamifikasi dan motivasi.
 * Menampilkan streak menabung, badge pencapaian, quote harian,
 * dan Tantangan Menabung 12 Bulan yang terintegrasi dengan tabungan emas.
 */
const Motivation = () => {
  const { streak, badges, totalGram, addTransaction, updateStreak, unlockBadge, CURRENT_GOLD_PRICE } = useApp();
  const toast = useToast();

  // Load quote harian
  const dailyQuote = useMemo(() => {
    return getDailyQuote(MOTIVATIONAL_QUOTES);
  }, []);

  // State tantangan menabung 12 bulan (menyimpan index bulan yang tercentang)
  const [checkedDays, setCheckedDays] = useLocalStorage('GoldTech_challenge_months', []);

  // Nominal bulanan tantangan — flat Rp 200.000 per bulan, total Rp 2.400.000 dalam 12 bulan
  const MONTHLY_CHALLENGE_AMOUNT = 200000;

  // Total uang yang terkumpul dari bulan-bulan yang dicentang
  const accumulatedCash = useMemo(() => {
    return checkedDays.length * MONTHLY_CHALLENGE_AMOUNT;
  }, [checkedDays]);

  // Nama-nama bulan
  const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];

  // Setara gram emas dari uang terkumpul
  const accumulatedGram = useMemo(() => {
    return accumulatedCash / CURRENT_GOLD_PRICE;
  }, [accumulatedCash, CURRENT_GOLD_PRICE]);

  // Centang / hapus centang hari
  const toggleDay = (dayIndex) => {
    setCheckedDays((prev) => {
      if (prev.includes(dayIndex)) {
        return prev.filter((d) => d !== dayIndex);
      } else {
        return [...prev, dayIndex].sort((a, b) => a - b);
      }
    });
  };

  // Klaim hasil tantangan ke transaksi tabungan emas
  const handleClaimChallenge = () => {
    if (checkedDays.length === 0) return;

    const data = {
      id: generateId(),
      date: getTodayDate(),
      gram: Number(accumulatedGram.toFixed(4)),
      pricePerGram: CURRENT_GOLD_PRICE,
      total: accumulatedCash,
      note: `Hasil Tantangan Menabung 12 Bulan (${checkedDays.length} bulan)`,
    };

    addTransaction(data);
    updateStreak();

    // Cek badge
    if (checkedDays.length === 12) {
      unlockBadge('streak_30');
    }
    unlockBadge('first_buy');

    toast.success(`Selamat! Rp ${accumulatedCash.toLocaleString('id-ID')} (${accumulatedGram.toFixed(4)} gram) berhasil dimasukkan ke tabungan emasmu! 🎉`);

    // Reset tantangan
    setCheckedDays([]);
  };

  // Reset semua centang secara manual
  const handleResetChallenge = () => {
    setCheckedDays([]);
    toast.info('Tantangan menabung berhasil di-reset.');
  };

  return (
    <div className="page-wrapper">
      <div className="container">
        {/* Header */}
        <div className="page-header">
          <h1>Motivasi & Pencapaian</h1>
          <p>Raih badge pencapaian, pantau streak menabungmu, dan selesaikan tantangan finansial bulanan.</p>
        </div>

        {/* Quote Harian & Streak Card */}
        <div className="grid grid-2 motivation-top">
          {/* Quote Card */}
          <div className="card quote-card animate-fade-in">
            <span className="quote-tag">💡 Kutipan Hari Ini</span>
            <blockquote className="quote-text">
              "{dailyQuote.text}"
            </blockquote>
            <cite className="quote-author">— {dailyQuote.author}</cite>
          </div>

          {/* Streak Card */}
          <div className="card streak-card animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <div className="streak-header">
              <span className="streak-fire">🔥</span>
              <div>
                <h2>Streak Menabung</h2>
                <p>Konsistensi menabung emasmu</p>
              </div>
            </div>
            <div className="grid grid-2 streak-stats">
              <div className="streak-stat-item">
                <span className="ss-lbl">Streak Saat Ini</span>
                <span className="ss-val">{streak.currentStreak} Bulan</span>
              </div>
              <div className="streak-stat-item">
                <span className="ss-lbl">Streak Terpanjang</span>
                <span className="ss-val">{streak.longestStreak} Bulan</span>
              </div>
            </div>
            <div className="streak-progress-info">
              {streak.currentStreak >= 3 ? (
                <span className="text-green">💪 Luar biasa! Kamu sudah konsisten menabung bulanan.</span>
              ) : (
                <span style={{ color: 'var(--gray-500)' }}>Tabung emas setiap bulan untuk menaikkan streak-mu!</span>
              )}
            </div>
          </div>
        </div>

        {/* Tantangan Menabung 12 Bulan */}
        <div className="card challenge-card animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <div className="challenge-header-row">
            <div>
              <h2>🎯 Tantangan Menabung 12 Bulan</h2>
              <p>Simpan Rp {MONTHLY_CHALLENGE_AMOUNT.toLocaleString('id-ID')} setiap bulan. Centang kotak untuk mencatat bulan yang berhasil.</p>
            </div>
            <div className="challenge-actions">
              {checkedDays.length > 0 && (
                <>
                  <button className="btn btn-secondary btn-sm" onClick={handleResetChallenge}>
                    Reset
                  </button>
                  <button className="btn btn-primary btn-sm" onClick={handleClaimChallenge}>
                    Klaim ke Tabungan
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Progress Tantangan */}
          <div className="challenge-progress-section">
            <div className="cp-header">
              <span>Progress Tantangan</span>
              <strong>{checkedDays.length} / 12 Bulan ({((checkedDays.length / 12) * 100).toFixed(0)}%)</strong>
            </div>
            <div className="progress-bar-container" style={{ height: '12px', marginBottom: '16px' }}>
              <div
                className="progress-bar-fill"
                style={{ width: `${(checkedDays.length / 12) * 100}%` }}
              />
            </div>

            <div className="grid grid-3 challenge-accumulated">
              <div className="ca-item">
                <span className="ca-lbl">Uang Terkumpul</span>
                <span className="ca-val">{formatCurrency(accumulatedCash)}</span>
              </div>
              <div className="ca-item">
                <span className="ca-lbl">Setara Emas</span>
                <span className="ca-val">{formatGram(accumulatedGram)}</span>
              </div>
              <div className="ca-item">
                <span className="ca-lbl">Potensi Selesai (12 Bulan)</span>
                <span className="ca-val">{formatCurrency(12 * MONTHLY_CHALLENGE_AMOUNT)}</span>
              </div>
            </div>
          </div>

          {/* Grid 12 Bulan */}
          <div className="days-grid">
            {MONTH_NAMES.map((monthName, i) => {
              const monthIndex = i + 1;
              const isChecked = checkedDays.includes(monthIndex);
              return (
                <button
                  key={monthIndex}
                  type="button"
                  className={`day-box ${isChecked ? 'checked' : ''}`}
                  onClick={() => toggleDay(monthIndex)}
                >
                  <span className="day-number">{monthName}</span>
                  <div className="day-checkbox">
                    {isChecked ? <FiCheck /> : <span className="dot"></span>}
                  </div>
                  <span className="day-value">Rp {(MONTHLY_CHALLENGE_AMOUNT / 1000)}k</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Badge Pencapaian */}
        <div className="card badges-section animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <div className="section-header">
            <h2>🏆 Badge Pencapaian ({badges.length} / {ACHIEVEMENT_BADGES.length})</h2>
          </div>
          <p className="section-desc" style={{ marginBottom: '24px', color: 'var(--gray-500)' }}>
            Dapatkan lencana penghargaan eksklusif dengan menyelesaikan aktivitas menabung emas dan target finansialmu.
          </p>

          <div className="badges-grid">
            {ACHIEVEMENT_BADGES.map((badge) => {
              const isUnlocked = badges.includes(badge.id);
              return (
                <div key={badge.id} className={`badge-card ${isUnlocked ? 'unlocked' : 'locked'}`}>
                  <div className="badge-icon-wrapper">
                    <span className="badge-icon">{badge.icon}</span>
                    {!isUnlocked && (
                      <div className="badge-lock">
                        <FiLock />
                      </div>
                    )}
                  </div>
                  <div className="badge-info">
                    <h3 className="badge-name">{badge.name}</h3>
                    <p className="badge-desc">{badge.desc}</p>
                    <span className="badge-status">
                      {isUnlocked ? (
                        <span className="unlocked-text"><FiUnlock /> Terbuka</span>
                      ) : (
                        <span className="locked-text">Terkunci</span>
                      )}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Motivation;
