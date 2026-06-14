import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './AdminLayout.css';

const AdminLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <h1>🛡️ GoldTech</h1>
          <p>Admin Panel</p>
        </div>

        <div className="admin-user">
          <div className="admin-avatar">{user?.name?.charAt(0).toUpperCase()}</div>
          <div className="admin-info">
            <span className="admin-name">{user?.name}</span>
            <span className="admin-role">Administrator</span>
          </div>
        </div>

        <nav className="admin-nav">
          <NavLink to="/admin/dashboard" className={({isActive}) => isActive ? "admin-nav-item active" : "admin-nav-item"}>
            📊 Dashboard
          </NavLink>
          <NavLink to="/admin/users" className={({isActive}) => isActive ? "admin-nav-item active" : "admin-nav-item"}>
            👥 Kelola Pengguna
          </NavLink>
          <NavLink to="/admin/transactions" className={({isActive}) => isActive ? "admin-nav-item active" : "admin-nav-item"}>
            💰 Transaksi Beli
          </NavLink>
          <NavLink to="/admin/sell-transactions" className={({isActive}) => isActive ? "admin-nav-item active" : "admin-nav-item"}>
            💸 Transaksi Jual
          </NavLink>
          <NavLink to="/admin/goals" className={({isActive}) => isActive ? "admin-nav-item active" : "admin-nav-item"}>
            🎯 Target Tabungan
          </NavLink>
          <NavLink to="/admin/gold-price" className={({isActive}) => isActive ? "admin-nav-item active" : "admin-nav-item"}>
            📈 Harga Emas
          </NavLink>
          
          <div className="admin-nav-divider">Konten</div>
          
          <NavLink to="/admin/articles" className={({isActive}) => isActive ? "admin-nav-item active" : "admin-nav-item"}>
            📄 Artikel Edukasi
          </NavLink>
          <NavLink to="/admin/quotes" className={({isActive}) => isActive ? "admin-nav-item active" : "admin-nav-item"}>
            💡 Kutipan Motivasi
          </NavLink>
          <NavLink to="/admin/stocks" className={({isActive}) => isActive ? "admin-nav-item active" : "admin-nav-item"}>
            🏢 Data Saham
          </NavLink>
          <NavLink to="/admin/badges" className={({isActive}) => isActive ? "admin-nav-item active" : "admin-nav-item"}>
            🏅 Master Badge
          </NavLink>
          
          <div className="admin-nav-divider">Sistem</div>
          
          <NavLink to="/admin/reports" className={({isActive}) => isActive ? "admin-nav-item active" : "admin-nav-item"}>
            📑 Laporan & Export
          </NavLink>
        </nav>

        <div className="admin-sidebar-footer">
          <button className="admin-logout-btn" onClick={handleLogout}>
            🚪 Keluar
          </button>
          <button className="admin-website-btn" onClick={() => navigate('/')}>
            🌐 Lihat Website
          </button>
        </div>
      </aside>

      <main className="admin-main">
        <header className="admin-header">
          <h2>Panel Administrasi</h2>
        </header>
        <div className="admin-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
