import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  FiHome, FiTarget, FiTrendingUp, FiBookOpen, FiBarChart2,
  FiAward, FiFileText, FiMenu, FiX, FiDollarSign, FiTrendingDown,
  FiLogOut, FiShield
} from 'react-icons/fi';
import { useAuth } from '../../contexts/AuthContext';
import './Navbar.css';

/**
 * Navbar
 * Komponen navigasi utama aplikasi.
 * Responsive: sidebar di desktop, hamburger menu di mobile.
 */
const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, logout, isAdmin } = useAuth();

  // Daftar menu navigasi
  const menuItems = [
    { path: '/dashboard', label: 'Dashboard', icon: <FiHome /> },
    { path: '/savings', label: 'Beli Emas', icon: <FiDollarSign /> },
    { path: '/sell', label: 'Jual Emas', icon: <FiTrendingDown /> },
    { path: '/goals', label: 'Target', icon: <FiTarget /> },
    { path: '/gold-analysis', label: 'Analisis Emas', icon: <FiTrendingUp /> },
    { path: '/motivation', label: 'Motivasi', icon: <FiAward /> },
    { path: '/education', label: 'Edukasi', icon: <FiBookOpen /> },
    { path: '/reports', label: 'Laporan', icon: <FiFileText /> },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Jangan tampilkan navbar di landing page atau halaman auth
  if (['/', '/login', '/register', '/admin/login'].includes(location.pathname) || location.pathname.startsWith('/admin')) return null;

  return (
    <>
      {/* Tombol hamburger untuk mobile */}
      <button
        className="mobile-menu-btn"
        onClick={() => setMobileOpen(!mobileOpen)}
        aria-label="Toggle menu"
      >
        {mobileOpen ? <FiX /> : <FiMenu />}
      </button>

      {/* Overlay mobile */}
      {mobileOpen && (
        <div
          className="mobile-overlay"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar navigasi */}
      <nav className={`navbar ${mobileOpen ? 'open' : ''}`}>
        {/* Logo */}
        <Link to="/" className="navbar-logo">
          <span className="logo-icon">🪙</span>
          <span className="logo-text">GoldTech</span>
        </Link>

        {/* User Info */}
        {user && (
          <div className="navbar-user" style={{ padding: '0 1.5rem 1rem', borderBottom: '1px solid rgba(212, 175, 55, 0.2)', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'var(--primary-color)', color: 'black', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div style={{ overflow: 'hidden' }}>
                <div style={{ fontSize: '0.9rem', fontWeight: 'bold', color: 'var(--text-color)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.name}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Investormu</div>
              </div>
            </div>
          </div>
        )}

        {/* Menu items */}
        <div className="navbar-menu">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`navbar-item ${location.pathname === item.path ? 'active' : ''}`}
              onClick={() => setMobileOpen(false)}
            >
              <span className="navbar-item-icon">{item.icon}</span>
              <span className="navbar-item-label">{item.label}</span>
            </Link>
          ))}

          {isAdmin && (
            <Link
              to="/admin/dashboard"
              className="navbar-item"
              style={{ marginTop: '1rem', borderTop: '1px solid rgba(212, 175, 55, 0.2)', paddingTop: '1rem', color: '#3b82f6' }}
            >
              <span className="navbar-item-icon"><FiShield /></span>
              <span className="navbar-item-label">Admin Panel</span>
            </Link>
          )}

          <button
            className="navbar-item"
            onClick={handleLogout}
            style={{ width: '100%', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', color: '#ef4444', marginTop: 'auto' }}
          >
            <span className="navbar-item-icon"><FiLogOut /></span>
            <span className="navbar-item-label">Keluar</span>
          </button>
        </div>

        {/* Footer sidebar */}
        <div className="navbar-footer">
          <p>© 2024 GoldTech</p>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
