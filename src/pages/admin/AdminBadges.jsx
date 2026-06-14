import { useState, useEffect } from 'react';
import { adminService } from '../../api/adminService';
import { useToast } from '../../contexts/ToastContext';

const AdminBadges = () => {
  const [badges, setBadges] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    const fetchBadges = async () => {
      try {
        const res = await adminService.getBadges();
        setBadges(res.data.data);
      } catch (error) {
        showToast('Gagal memuat badges', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchBadges();
  }, []);

  if (loading) return <div>Memuat...</div>;

  return (
    <div className="admin-card">
      <h3 className="admin-card-title">Master Pencapaian (Badges)</h3>
      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Icon</th>
              <th>Kode</th>
              <th>Nama</th>
              <th>Deskripsi</th>
            </tr>
          </thead>
          <tbody>
            {badges.map(b => (
              <tr key={b.id}>
                <td style={{ fontSize: '1.5rem' }}>{b.icon}</td>
                <td style={{ fontFamily: 'monospace' }}>{b.code}</td>
                <td style={{ fontWeight: 'bold' }}>{b.name}</td>
                <td>{b.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminBadges;
