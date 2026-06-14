import { useState, useEffect } from 'react';
import { adminService } from '../../api/adminService';
import { useToast } from '../../contexts/ToastContext';

const AdminStocks = () => {
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  const fetchStocks = async () => {
    try {
      const res = await adminService.getStocks();
      setStocks(res.data.data);
    } catch (error) {
      showToast('Gagal memuat saham', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStocks();
  }, []);

  if (loading) return <div>Memuat...</div>;

  return (
    <div className="admin-card">
      <h3 className="admin-card-title">Data Saham Watchlist</h3>
      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Kode</th>
              <th>Nama Saham</th>
              <th>Sektor</th>
              <th>Harga (Rp)</th>
              <th>Perubahan (%)</th>
            </tr>
          </thead>
          <tbody>
            {stocks.map(s => (
              <tr key={s.id}>
                <td style={{ fontWeight: 'bold' }}>{s.code}</td>
                <td>{s.name}</td>
                <td>{s.sector}</td>
                <td>{parseFloat(s.price).toLocaleString('id-ID')}</td>
                <td style={{ color: s.change_percent >= 0 ? '#10b981' : '#ef4444' }}>
                  {s.change_percent >= 0 ? '+' : ''}{parseFloat(s.change_percent).toFixed(2)}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminStocks;
