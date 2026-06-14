import { useState, useEffect } from 'react';
import { adminService } from '../../api/adminService';
import { useToast } from '../../contexts/ToastContext';

const AdminTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await adminService.getTransactions({ limit: 100 });
        setTransactions(res.data.data);
      } catch (error) {
        showToast('Gagal memuat transaksi', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchTransactions();
  }, []);

  if (loading) return <div>Memuat data...</div>;

  return (
    <div className="admin-card">
      <h3 className="admin-card-title">Semua Transaksi Beli</h3>
      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Tgl</th>
              <th>Pengguna</th>
              <th>Gram</th>
              <th>Harga/g</th>
              <th>Total (Rp)</th>
              <th>Catatan</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map(t => (
              <tr key={t.id}>
                <td>{t.date}</td>
                <td>{t.user?.name}</td>
                <td>{parseFloat(t.gram).toFixed(4)}</td>
                <td>{parseFloat(t.price_per_gram).toLocaleString('id-ID')}</td>
                <td>{parseFloat(t.total).toLocaleString('id-ID')}</td>
                <td>{t.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminTransactions;
