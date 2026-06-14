import { useState, useEffect } from 'react';
import { adminService } from '../../api/adminService';
import { useToast } from '../../contexts/ToastContext';

const AdminGoldPrice = () => {
  const [prices, setPrices] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();
  
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    price: '',
    high: '',
    low: '',
    volume: ''
  });

  const fetchPrices = async () => {
    try {
      const res = await adminService.getGoldPrices();
      setPrices(res.data.data);
    } catch (error) {
      showToast('Gagal memuat harga', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrices();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await adminService.createGoldPrice(formData);
      showToast('Harga emas berhasil disimpan', 'success');
      setFormData({ date: new Date().toISOString().split('T')[0], price: '', high: '', low: '', volume: '' });
      fetchPrices();
    } catch (error) {
      showToast('Gagal menyimpan harga', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Yakin ingin menghapus data ini?')) {
      try {
        await adminService.deleteGoldPrice(id);
        showToast('Berhasil dihapus', 'success');
        fetchPrices();
      } catch (error) {
        showToast('Gagal menghapus', 'error');
      }
    }
  };

  if (loading) return <div>Memuat data...</div>;

  return (
    <div>
      <div className="admin-card" style={{ maxWidth: '600px', marginBottom: '2rem' }}>
        <h3 className="admin-card-title">Input Harga Hari Ini</h3>
        <form onSubmit={handleSubmit}>
          <div className="admin-form-group">
            <label>Tanggal</label>
            <input 
              type="date" 
              className="admin-form-control"
              value={formData.date}
              onChange={e => setFormData({...formData, date: e.target.value})}
              required
            />
          </div>
          <div className="admin-form-group">
            <label>Harga per Gram (Rp)</label>
            <input 
              type="number" 
              className="admin-form-control"
              value={formData.price}
              onChange={e => setFormData({...formData, price: e.target.value})}
              placeholder="Contoh: 1250000"
              required
            />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="admin-form-group">
              <label>Harga Tertinggi</label>
              <input 
                type="number" 
                className="admin-form-control"
                value={formData.high}
                onChange={e => setFormData({...formData, high: e.target.value})}
              />
            </div>
            <div className="admin-form-group">
              <label>Harga Terendah</label>
              <input 
                type="number" 
                className="admin-form-control"
                value={formData.low}
                onChange={e => setFormData({...formData, low: e.target.value})}
              />
            </div>
          </div>
          <button type="submit" className="admin-btn-primary">Simpan Harga</button>
        </form>
      </div>

      <div className="admin-card">
        <h3 className="admin-card-title">Riwayat Harga (100 Hari Terakhir)</h3>
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Tanggal</th>
                <th>Harga</th>
                <th>Tertinggi</th>
                <th>Terendah</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {prices.map(p => (
                <tr key={p.id}>
                  <td>{p.date}</td>
                  <td>Rp {parseFloat(p.price).toLocaleString('id-ID')}</td>
                  <td>{p.high ? `Rp ${parseFloat(p.high).toLocaleString('id-ID')}` : '-'}</td>
                  <td>{p.low ? `Rp ${parseFloat(p.low).toLocaleString('id-ID')}` : '-'}</td>
                  <td>
                    <button onClick={() => handleDelete(p.id)} className="admin-btn-danger" style={{ padding: '0.2rem 0.5rem', fontSize: '0.8rem' }}>Hapus</button>
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

export default AdminGoldPrice;
