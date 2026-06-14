import { useState, useEffect } from 'react';
import { adminService } from '../../api/adminService';
import { useToast } from '../../contexts/ToastContext';

const AdminGoals = () => {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    const fetchGoals = async () => {
      try {
        const res = await adminService.getGoals();
        setGoals(res.data.data);
      } catch (error) {
        showToast('Gagal memuat goals', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchGoals();
  }, []);

  if (loading) return <div>Memuat data...</div>;

  return (
    <div className="admin-card">
      <h3 className="admin-card-title">Semua Target Tabungan</h3>
      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Pengguna</th>
              <th>Nama Target</th>
              <th>Target Gram</th>
              <th>Target Nominal</th>
              <th>Tenggat Waktu</th>
            </tr>
          </thead>
          <tbody>
            {goals.map(g => (
              <tr key={g.id}>
                <td>{g.user?.name}</td>
                <td>{g.name}</td>
                <td>{parseFloat(g.target_gram).toFixed(2)} g</td>
                <td>Rp {parseFloat(g.target_nominal).toLocaleString('id-ID')}</td>
                <td>{g.deadline}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminGoals;
