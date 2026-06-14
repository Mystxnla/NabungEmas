import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import '../Login.css';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  
  const from = location.state?.from?.pathname || '/admin';

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      showToast('Email dan password wajib diisi!', 'error');
      return;
    }

    try {
      setIsLoading(true);
      const response = await login(email, password);
      
      // Verifikasi role setelah login berhasil (di sisi client)
      if (response.data.user.role === 'admin') {
        showToast('Login admin berhasil!', 'success');
        navigate(from, { replace: true });
      } else {
        showToast('Akses ditolak. Anda bukan admin.', 'error');
        // Bukan admin, jangan biarkan di halaman admin
        navigate('/dashboard', { replace: true });
      }
      
    } catch (error) {
      const msg = error.response?.data?.message || 'Login gagal. Kredensial tidak valid.';
      showToast(msg, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container admin-theme">
      <div className="auth-card">
        <div className="auth-header">
          <div className="admin-icon">🛡️</div>
          <h2>Admin Login</h2>
          <p>GoldTech Management Panel</p>
        </div>
        
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Admin Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@goldtech.com"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>
          
          <button 
            type="submit" 
            className="btn auth-btn admin-btn"
            disabled={isLoading}
          >
            {isLoading ? 'Authenticating...' : 'Secure Login'}
          </button>
        </form>
        
        <div className="auth-footer">
          <button className="link-btn" onClick={() => navigate('/')}>
            ← Kembali ke Website
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
