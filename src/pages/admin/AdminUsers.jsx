import { useState, useEffect } from 'react';
import { adminService } from '../../api/adminService';
import { useToast } from '../../contexts/ToastContext';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  const fetchUsers = async () => {
    try {
      const res = await adminService.getUsers({ limit: 100 });
      setUsers(res.data.data);
    } catch (error) {
      showToast('Gagal memuat pengguna', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleToggleStatus = async (user) => {
    try {
      await adminService.updateUser(user.id, { is_active: !user.is_active });
      showToast('Status pengguna diperbarui', 'success');
      fetchUsers();
    } catch (error) {
      showToast(error.response?.data?.message || 'Gagal mengubah status', 'error');
    }
  };

  if (loading) return <div>Memuat data pengguna...</div>;

  return (
    <div className="admin-card">
      <h3 className="admin-card-title">Kelola Pengguna</h3>
      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nama</th>
              <th>Email</th>
              <th>Role</th>
              <th>Bergabung</th>
              <th>Status</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id}>
                <td>{u.id}</td>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>
                  <span style={{ 
                    padding: '0.25rem 0.5rem', 
                    borderRadius: '0.25rem', 
                    fontSize: '0.8rem',
                    backgroundColor: u.role === 'admin' ? '#dbeafe' : '#f1f5f9',
                    color: u.role === 'admin' ? '#1d4ed8' : '#475569'
                  }}>
                    {u.role}
                  </span>
                </td>
                <td>{u.join_date}</td>
                <td>
                  <span style={{ 
                    padding: '0.25rem 0.5rem', 
                    borderRadius: '0.25rem', 
                    fontSize: '0.8rem',
                    backgroundColor: u.is_active ? '#dcfce3' : '#fee2e2',
                    color: u.is_active ? '#166534' : '#991b1b'
                  }}>
                    {u.is_active ? 'Aktif' : 'Nonaktif'}
                  </span>
                </td>
                <td>
                  {u.role !== 'admin' && (
                    <button 
                      onClick={() => handleToggleStatus(u)}
                      className={u.is_active ? 'admin-btn-danger' : 'admin-btn-primary'}
                      style={{ fontSize: '0.8rem', padding: '0.25rem 0.5rem' }}
                    >
                      {u.is_active ? 'Nonaktifkan' : 'Aktifkan'}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminUsers;
