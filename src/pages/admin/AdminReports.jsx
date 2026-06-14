import { useState } from 'react';
import { adminService } from '../../api/adminService';
import { useToast } from '../../contexts/ToastContext';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const AdminReports = () => {
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  const handleExportPDF = async () => {
    try {
      setLoading(true);
      const res = await adminService.getReports({});
      const { summary, buyTransactions } = res.data.data;
      
      const doc = new jsPDF();
      doc.text("Laporan Transaksi GoldTech", 14, 15);
      
      // Summary text
      doc.setFontSize(10);
      doc.text(`Total Pengguna: ${summary.totalUsers}`, 14, 25);
      doc.text(`Total Emas Terjual (Gram): ${summary.totalGramBought.toFixed(2)} g`, 14, 30);
      doc.text(`Nilai Investasi: Rp ${summary.totalInvested.toLocaleString('id-ID')}`, 14, 35);
      
      // Table
      const tableColumn = ["Tanggal", "Pengguna", "Gram", "Harga/g", "Total"];
      const tableRows = [];
      
      buyTransactions.forEach(t => {
        const row = [
          t.date,
          t.user?.name || 'Unknown',
          parseFloat(t.gram).toFixed(4),
          `Rp ${parseFloat(t.price_per_gram).toLocaleString('id-ID')}`,
          `Rp ${parseFloat(t.total).toLocaleString('id-ID')}`
        ];
        tableRows.push(row);
      });
      
      doc.autoTable({
        head: [tableColumn],
        body: tableRows,
        startY: 45,
      });
      
      doc.save(`Laporan_GoldTech_${new Date().toISOString().split('T')[0]}.pdf`);
      showToast('Laporan PDF berhasil diunduh!', 'success');
    } catch (error) {
      showToast('Gagal men-generate laporan', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-card">
      <h3 className="admin-card-title">Laporan Sistem</h3>
      <p>Download laporan transaksi keseluruhan pengguna dalam format PDF.</p>
      
      <button 
        onClick={handleExportPDF} 
        disabled={loading}
        className="admin-btn-primary"
        style={{ marginTop: '1rem', padding: '0.75rem 1.5rem' }}
      >
        {loading ? 'Membuat Laporan...' : '📄 Download Laporan Transaksi (PDF)'}
      </button>
    </div>
  );
};

export default AdminReports;
