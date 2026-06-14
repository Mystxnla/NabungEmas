import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import './Login.css'; // Use the same CSS as login

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { register } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!name || !email || !password) {
      showToast('Semua field wajib diisi!', 'error');
      return;
    }

    if (password !== confirmPassword) {
      showToast('Password dan konfirmasi password tidak cocok!', 'error');
      return;
    }

    if (password.length < 6) {
      showToast('Password minimal 6 karakter!', 'warning');
      return;
    }

    try {
      setIsLoading(true);
      await register(name, email, password);
      showToast('Registrasi berhasil! Selamat datang di GoldTech.', 'success');
      navigate('/dashboard', { replace: true });
    } catch (error) {
      const msg = error.response?.data?.message || 'Registrasi gagal. Silakan coba lagi.';
      showToast(msg, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2>Daftar Akun Baru</h2>
          <p>Mulai perjalanan finansialmu bersama kami</p>
        </div>
        
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Nama Lengkap</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nama@email.com"
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

          <div className="form-group">
            <label htmlFor="confirmPassword">Konfirmasi Password</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>
          
          <button 
            type="submit" 
            className="btn btn-primary auth-btn"
            disabled={isLoading}
          >
            {isLoading ? 'Memproses...' : 'Daftar'}
          </button>
        </form>
        
        <div className="auth-footer">
          <p>Sudah punya akun? <Link to="/login">Masuk di sini</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Register;
