import { createContext, useContext, useMemo, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';
import { transactionService } from '../api/transactionService';
import { sellTransactionService } from '../api/sellTransactionService';
import { goalService } from '../api/goalService';
import { profileService } from '../api/profileService';
import { badgeService } from '../api/badgeService';
import { streakService } from '../api/streakService';
import { watchlistService } from '../api/watchlistService';
import { CURRENT_GOLD_PRICE, USER_LEVELS } from '../utils/constants';
import { calculateProgress } from '../utils/helpers';

/**
 * AppContext
 * Context utama aplikasi untuk state management yang terhubung ke Backend API.
 */

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const { user, token } = useAuth();
  const { showToast } = useToast();

  const [transactions, setTransactions] = useState([]);
  const [sellTransactions, setSellTransactions] = useState([]);
  const [goals, setGoals] = useState([]);
  const [profile, setProfileState] = useState(null);
  const [badges, setBadgesState] = useState([]);
  const [streak, setStreakState] = useState({ current_streak: 0, longest_streak: 0 });
  const [watchlist, setWatchlistState] = useState([]);
  const [isLoadingData, setIsLoadingData] = useState(false);

  // Fetch data saat user login
  useEffect(() => {
    if (user && token) {
      fetchUserData();
    } else {
      // Clear data if logged out
      setTransactions([]);
      setSellTransactions([]);
      setGoals([]);
      setProfileState(null);
      setBadgesState([]);
      setStreakState({ current_streak: 0, longest_streak: 0 });
      setWatchlistState([]);
    }
  }, [user, token]);

  const fetchUserData = async () => {
    setIsLoadingData(true);
    try {
      const [
        txRes, sellTxRes, goalsRes, profileRes, badgesRes, streakRes, watchlistRes
      ] = await Promise.all([
        transactionService.getAll(),
        sellTransactionService.getAll(),
        goalService.getAll(),
        profileService.get(),
        badgeService.getAll(),
        streakService.get(),
        watchlistService.get(),
      ]);

      setTransactions(txRes.data.data);
      setSellTransactions(sellTxRes.data.data);
      setGoals(goalsRes.data.data);
      setProfileState(profileRes.data.data);
      setBadgesState(badgesRes.data.data.map(b => b.badge_code));
      if (streakRes.data.data) {
        setStreakState({
          currentStreak: streakRes.data.data.current_streak,
          longestStreak: streakRes.data.data.longest_streak,
          lastSaveMonth: streakRes.data.data.last_save_month
        });
      }
      setWatchlistState(watchlistRes.data.data.map(w => w.stock_code));
    } catch (error) {
      console.error('Failed to fetch user data', error);
      if (error.response?.status !== 401) {
        showToast('Gagal memuat sebagian data pengguna', 'error');
      }
    } finally {
      setIsLoadingData(false);
    }
  };

  // ---- Computed Values (data turunan) ----

  // Total gram emas yang DIBELI
  const totalGram = useMemo(() => {
    return transactions.reduce((sum, t) => sum + Number(t.gram), 0);
  }, [transactions]);

  // Total gram emas yang DIJUAL
  const totalSoldGram = useMemo(() => {
    return sellTransactions.reduce((sum, t) => sum + Number(t.gram), 0);
  }, [sellTransactions]);

  // Gram bersih yang saat ini dimiliki
  const netGram = useMemo(() => {
    return Math.max(0, totalGram - totalSoldGram);
  }, [totalGram, totalSoldGram]);

  // Total nilai investasi berdasarkan harga beli
  const totalInvested = useMemo(() => {
    return transactions.reduce((sum, t) => sum + Number(t.total), 0);
  }, [transactions]);

  // Estimasi nilai saat ini berdasarkan harga emas terkini (pakai netGram)
  const currentValue = useMemo(() => {
    return netGram * CURRENT_GOLD_PRICE;
  }, [netGram]);

  // Harga beli rata-rata per gram
  const avgBuyPrice = useMemo(() => {
    if (totalGram === 0) return CURRENT_GOLD_PRICE;
    return totalInvested / totalGram;
  }, [totalInvested, totalGram]);

  // Profit/loss dari emas yang masih dipegang
  const profitLoss = useMemo(() => {
    const holdingCost = netGram * avgBuyPrice;
    return currentValue - holdingCost;
  }, [currentValue, netGram, avgBuyPrice]);

  // Profit terealisasi dari penjualan
  const realizedProfit = useMemo(() => {
    return sellTransactions.reduce((sum, t) => {
      const costBasis = Number(t.gram) * avgBuyPrice;
      return sum + (Number(t.total) - costBasis);
    }, 0);
  }, [sellTransactions, avgBuyPrice]);

  // Total uang yang diterima dari penjualan
  const totalSellRevenue = useMemo(() => {
    return sellTransactions.reduce((sum, t) => sum + Number(t.total), 0);
  }, [sellTransactions]);

  // Level pengguna berdasarkan total gram
  const userLevel = useMemo(() => {
    let currentLevel = USER_LEVELS[0];
    for (const level of USER_LEVELS) {
      if (totalGram >= level.minGram) {
        currentLevel = level;
      }
    }
    return currentLevel;
  }, [totalGram]);

  // Progress ke level berikutnya
  const levelProgress = useMemo(() => {
    const currentIdx = USER_LEVELS.findIndex(l => l.level === userLevel.level);
    const nextLevel = USER_LEVELS[currentIdx + 1];
    if (!nextLevel) return 100;
    return calculateProgress(
      totalGram - userLevel.minGram,
      nextLevel.minGram - userLevel.minGram
    );
  }, [totalGram, userLevel]);

  // ---- CRUD Transaksi Beli API Wrapper ----
  const addTransaction = async (transaction) => {
    try {
      const res = await transactionService.create(transaction);
      setTransactions((prev) => [res.data.data, ...prev]);
      return res.data.data;
    } catch (error) {
      showToast(error.response?.data?.message || 'Gagal tambah transaksi', 'error');
      throw error;
    }
  };

  const updateTransaction = async (id, updatedData) => {
    try {
      const res = await transactionService.update(id, updatedData);
      setTransactions((prev) => prev.map((t) => (t.id === id ? res.data.data : t)));
    } catch (error) {
      showToast(error.response?.data?.message || 'Gagal update transaksi', 'error');
      throw error;
    }
  };

  const deleteTransaction = async (id) => {
    try {
      await transactionService.remove(id);
      setTransactions((prev) => prev.filter((t) => t.id !== id));
    } catch (error) {
      showToast(error.response?.data?.message || 'Gagal hapus transaksi', 'error');
      throw error;
    }
  };

  // ---- CRUD Goals API Wrapper ----
  const addGoal = async (goal) => {
    try {
      const res = await goalService.create(goal);
      setGoals((prev) => [res.data.data, ...prev]);
    } catch (error) {
      showToast(error.response?.data?.message || 'Gagal tambah target', 'error');
      throw error;
    }
  };

  const updateGoal = async (id, updatedData) => {
    try {
      const res = await goalService.update(id, updatedData);
      setGoals((prev) => prev.map((g) => (g.id === id ? res.data.data : g)));
    } catch (error) {
      showToast(error.response?.data?.message || 'Gagal update target', 'error');
      throw error;
    }
  };

  const deleteGoal = async (id) => {
    try {
      await goalService.remove(id);
      setGoals((prev) => prev.filter((g) => g.id !== id));
    } catch (error) {
      showToast(error.response?.data?.message || 'Gagal hapus target', 'error');
      throw error;
    }
  };

  // ---- CRUD Transaksi Jual API Wrapper ----
  const addSellTransaction = async (transaction) => {
    try {
      const res = await sellTransactionService.create(transaction);
      setSellTransactions((prev) => [res.data.data, ...prev]);
    } catch (error) {
      showToast(error.response?.data?.message || 'Gagal tambah transaksi jual', 'error');
      throw error;
    }
  };

  const deleteSellTransaction = async (id) => {
    try {
      await sellTransactionService.remove(id);
      setSellTransactions((prev) => prev.filter((t) => t.id !== id));
    } catch (error) {
      showToast(error.response?.data?.message || 'Gagal hapus transaksi jual', 'error');
      throw error;
    }
  };

  // ---- Watchlist Saham API Wrapper ----
  const addToWatchlist = async (stockCode) => {
    try {
      await watchlistService.add(stockCode);
      setWatchlistState((prev) => {
        if (prev.includes(stockCode)) return prev;
        return [...prev, stockCode];
      });
    } catch (error) {
      showToast('Gagal menambah ke watchlist', 'error');
    }
  };

  const removeFromWatchlist = async (stockCode) => {
    try {
      await watchlistService.remove(stockCode);
      setWatchlistState((prev) => prev.filter((code) => code !== stockCode));
    } catch (error) {
      showToast('Gagal menghapus dari watchlist', 'error');
    }
  };

  // ---- Badge System API Wrapper ----
  const unlockBadge = async (badgeCode) => {
    if (badges.includes(badgeCode)) return;
    try {
      await badgeService.unlock(badgeCode);
      setBadgesState((prev) => [...prev, badgeCode]);
    } catch (error) {
      console.error('Failed to unlock badge:', error);
    }
  };

  // ---- Streak System API Wrapper ----
  const updateStreak = async () => {
    try {
      const res = await streakService.update();
      if (res.data.data) {
        setStreakState({
          currentStreak: res.data.data.current_streak,
          longestStreak: res.data.data.longest_streak,
          lastSaveMonth: res.data.data.last_save_month
        });
      }
    } catch (error) {
      console.error('Failed to update streak:', error);
    }
  };

  const setProfile = async (profileData) => {
    try {
      const res = await profileService.update(profileData);
      setProfileState(res.data.data);
    } catch (error) {
      showToast(error.response?.data?.message || 'Gagal update profil', 'error');
      throw error;
    }
  };

  // Value yang disediakan ke seluruh aplikasi
  const value = {
    // Data
    transactions,
    sellTransactions,
    goals,
    profile,
    badges,
    streak,
    watchlist,
    isLoadingData,

    // Computed
    totalGram,
    totalSoldGram,
    netGram,
    totalInvested,
    currentValue,
    profitLoss,
    realizedProfit,
    totalSellRevenue,
    avgBuyPrice,
    userLevel,
    levelProgress,

    // Actions - Transaksi Beli
    addTransaction,
    updateTransaction,
    deleteTransaction,

    // Actions - Transaksi Jual
    addSellTransaction,
    deleteSellTransaction,

    // Actions - Goals
    addGoal,
    updateGoal,
    deleteGoal,

    // Actions - Watchlist
    addToWatchlist,
    removeFromWatchlist,

    // Actions - Gamifikasi
    unlockBadge,
    updateStreak,
    setProfile,

    // Konstanta
    CURRENT_GOLD_PRICE,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

/**
 * Hook untuk mengakses AppContext
 */
export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp harus digunakan di dalam AppProvider');
  }
  return context;
};
