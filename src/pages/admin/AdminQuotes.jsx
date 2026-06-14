import { useState, useEffect } from 'react';
import { adminService } from '../../api/adminService';
import { useToast } from '../../contexts/ToastContext';

const AdminQuotes = () => {
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();
  
  const [formData, setFormData] = useState({ text: '', author: '' });

  const fetchQuotes = async () => {
    try {
      const res = await adminService.getQuotes();
      setQuotes(res.data.data);
    } catch (error) {
      showToast('Gagal memuat kutipan', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuotes();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await adminService.createQuote(formData);
      showToast('Kutipan berhasil ditambah', 'success');
      setFormData({ text: '', author: '' });
      fetchQuotes();
    } catch (error) {
      showToast('Gagal menambah', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Hapus kutipan ini?')) {
      try {
        await adminService.deleteQuote(id);
        showToast('Dihapus', 'success');
        fetchQuotes();
      } catch (error) {
        showToast('Gagal hapus', 'error');
      }
    }
  };

  if (loading) return <div>Memuat...</div>;

  return (
    <div>
      <div className="admin-card" style={{ marginBottom: '2rem' }}>
        <h3 className="admin-card-title">Tambah Kutipan Baru</h3>
        <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
          <div style={{ flex: 2 }}>
            <input 
              type="text" 
              className="admin-form-control"
              placeholder="Teks kutipan..."
              value={formData.text}
              onChange={e => setFormData({...formData, text: e.target.value})}
              required
            />
          </div>
          <div style={{ flex: 1 }}>
            <input 
              type="text" 
              className="admin-form-control"
              placeholder="Penulis"
              value={formData.author}
              onChange={e => setFormData({...formData, author: e.target.value})}
            />
          </div>
          <button type="submit" className="admin-btn-primary">Tambah</button>
        </form>
      </div>

      <div className="admin-card">
        <h3 className="admin-card-title">Daftar Kutipan Motivasi</h3>
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Teks</th>
                <th>Penulis</th>
                <th width="100">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {quotes.map(q => (
                <tr key={q.id}>
                  <td>"{q.text}"</td>
                  <td>{q.author}</td>
                  <td>
                    <button onClick={() => handleDelete(q.id)} className="admin-btn-danger" style={{ padding: '0.2rem 0.5rem', fontSize: '0.8rem' }}>Hapus</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminQuotes;
