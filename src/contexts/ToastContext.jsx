import { createContext, useContext, useState, useCallback } from 'react';
import { FiCheckCircle, FiAlertCircle, FiInfo, FiAlertTriangle } from 'react-icons/fi';

/**
 * ToastContext
 * Context untuk menampilkan notifikasi toast di seluruh aplikasi.
 * Mendukung tipe: success, error, info, warning.
 */

const ToastContext = createContext();

// Komponen Toast individual
const ToastItem = ({ toast, onRemove }) => {
  const icons = {
    success: <FiCheckCircle style={{ color: '#22c55e' }} />,
    error: <FiAlertCircle style={{ color: '#ef4444' }} />,
    info: <FiInfo style={{ color: '#3b82f6' }} />,
    warning: <FiAlertTriangle style={{ color: '#eab308' }} />,
  };

  return (
    <div className={`toast toast-${toast.type} ${toast.exiting ? 'toast-exit' : ''}`}>
      <span className="toast-icon">{icons[toast.type]}</span>
      <span className="toast-message">{toast.message}</span>
    </div>
  );
};

// Provider komponen
export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  // Fungsi untuk menambahkan toast baru
  const addToast = useCallback((message, type = 'info', duration = 3000) => {
    const id = Date.now() + Math.random();
    const newToast = { id, message, type, exiting: false };

    setToasts((prev) => [...prev, newToast]);

    // Auto-remove toast setelah durasi tertentu
    setTimeout(() => {
      setToasts((prev) =>
        prev.map((t) => (t.id === id ? { ...t, exiting: true } : t))
      );
      // Hapus setelah animasi selesai
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 300);
    }, duration);
  }, []);

  // Shortcut untuk setiap tipe toast
  const toast = {
    success: (msg) => addToast(msg, 'success'),
    error: (msg) => addToast(msg, 'error'),
    info: (msg) => addToast(msg, 'info'),
    warning: (msg) => addToast(msg, 'warning'),
    showToast: (msg, type = 'info') => addToast(msg, type)
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}
      {/* Container toast di pojok kanan atas */}
      <div className="toast-container">
        {toasts.map((t) => (
          <ToastItem key={t.id} toast={t} />
        ))}
      </div>
    </ToastContext.Provider>
  );
};

/**
 * Hook untuk menggunakan toast notification
 * Contoh: const toast = useToast(); toast.success('Berhasil!');
 */
export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast harus digunakan di dalam ToastProvider');
  }
  return context;
};
