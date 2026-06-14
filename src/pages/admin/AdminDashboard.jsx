import { useState, useEffect } from 'react';
import { adminService } from '../../api/adminService';
import { useToast } from '../../contexts/ToastContext';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await adminService.getStats();
        setStats(res.data.data);
      } catch (error) {
        showToast('Gagal memuat statistik', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div>Memuat data...</div>;
  if (!stats) return <div>Data tidak tersedia.</div>;

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        
        {/* Card 1: Users */}
        <div className="admin-card" style={{ borderTop: '4px solid #3b82f6' }}>
          <h3 style={{ color: '#64748b', fontSize: '0.9rem', margin: '0 0 0.5rem 0' }}>Total Pengguna</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: 0, color: '#0f172a' }}>{stats.totalUsers}</p>
          <p style={{ fontSize: '0.85rem', color: '#10b981', margin: '0.5rem 0 0 0' }}>
            +{stats.newUsersThisMonth} pengguna baru bulan ini
          </p>
        </div>

        {/* Card 2: Emas Dibeli */}
        <div className="admin-card" style={{ borderTop: '4px solid #10b981' }}>
          <h3 style={{ color: '#64748b', fontSize: '0.9rem', margin: '0 0 0.5rem 0' }}>Total Emas Dibeli</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: 0, color: '#0f172a' }}>{stats.totalGramBought.toFixed(2)} g</p>
          <p style={{ fontSize: '0.85rem', color: '#64748b', margin: '0.5rem 0 0 0' }}>
            Dari {stats.totalBuyTransactions} transaksi
          </p>
        </div>

        {/* Card 3: Emas Dijual */}
        <div className="admin-card" style={{ borderTop: '4px solid #f59e0b' }}>
          <h3 style={{ color: '#64748b', fontSize: '0.9rem', margin: '0 0 0.5rem 0' }}>Total Emas Dijual</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: 0, color: '#0f172a' }}>{stats.totalGramSold.toFixed(2)} g</p>
          <p style={{ fontSize: '0.85rem', color: '#64748b', margin: '0.5rem 0 0 0' }}>
            Dari {stats.totalSellTransactions} transaksi
          </p>
        </div>

        {/* Card 4: Net Gram */}
        <div className="admin-card" style={{ borderTop: '4px solid #8b5cf6' }}>
          <h3 style={{ color: '#64748b', fontSize: '0.9rem', margin: '0 0 0.5rem 0' }}>Emas Beredar (Net)</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: 0, color: '#0f172a' }}>{stats.netGram.toFixed(2)} g</p>
          <p style={{ fontSize: '0.85rem', color: '#64748b', margin: '0.5rem 0 0 0' }}>
            Total yang dimiliki semua user
          </p>
        </div>

        {/* Card 5: Total Investasi */}
        <div className="admin-card" style={{ borderTop: '4px solid #ef4444' }}>
          <h3 style={{ color: '#64748b', fontSize: '0.9rem', margin: '0 0 0.5rem 0' }}>Total Nilai Pembelian</h3>
          <p style={{ fontSize: '1.8rem', fontWeight: 'bold', margin: 0, color: '#0f172a' }}>
            Rp {stats.totalInvested.toLocaleString('id-ID')}
          </p>
        </div>
        
        {/* Card 6: Total Target */}
        <div className="admin-card" style={{ borderTop: '4px solid #06b6d4' }}>
          <h3 style={{ color: '#64748b', fontSize: '0.9rem', margin: '0 0 0.5rem 0' }}>Total Target Tabungan</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: 0, color: '#0f172a' }}>{stats.totalGoals}</p>
          <p style={{ fontSize: '0.85rem', color: '#64748b', margin: '0.5rem 0 0 0' }}>
            Target aktif dari semua user
          </p>
        </div>

      </div>

      <div className="admin-card">
        <h3 className="admin-card-title">Selamat Datang di Panel Admin GoldTech</h3>
        <p>Gunakan menu di sebelah kiri untuk mengelola data aplikasi. Perubahan yang Anda buat di sini akan langsung mempengaruhi aplikasi pengguna.</p>
      </div>
    </div>
  );
};

export default AdminDashboard;
