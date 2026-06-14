import { useState, useEffect } from 'react';
import { adminService } from '../../api/adminService';
import { useToast } from '../../contexts/ToastContext';

const AdminArticles = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();
  
  // States for modal/form could go here, keeping it simple for now
  
  const fetchArticles = async () => {
    try {
      const res = await adminService.getArticles();
      setArticles(res.data.data);
    } catch (error) {
      showToast('Gagal memuat artikel', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Yakin ingin menghapus artikel ini?')) {
      try {
        await adminService.deleteArticle(id);
        showToast('Berhasil dihapus', 'success');
        fetchArticles();
      } catch (error) {
        showToast('Gagal menghapus', 'error');
      }
    }
  };

  if (loading) return <div>Memuat data...</div>;

  return (
    <div className="admin-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h3 className="admin-card-title" style={{ margin: 0 }}>Kelola Artikel Edukasi</h3>
        <button className="admin-btn-primary" onClick={() => alert('Fitur tambah artikel form akan dibuat terpisah.')}>
          + Tambah Artikel
        </button>
      </div>
      
      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Icon</th>
              <th>Judul</th>
              <th>Kategori</th>
              <th>Waktu Baca</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {articles.map(a => (
              <tr key={a.id}>
                <td style={{ fontSize: '1.5rem' }}>{a.icon}</td>
                <td>{a.title}</td>
                <td>{a.category}</td>
                <td>{a.read_time}</td>
                <td>
                  <button onClick={() => handleDelete(a.id)} className="admin-btn-danger" style={{ padding: '0.2rem 0.5rem', fontSize: '0.8rem' }}>Hapus</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminArticles;
