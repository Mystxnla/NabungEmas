import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../api/authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('goldtech_token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      if (token) {
        try {
          const response = await authService.getMe();
          setUser(response.data.data);
        } catch (error) {
          console.error('Failed to get user profile:', error);
          logout(); // Clear invalid token
        }
      }
      setLoading(false);
    };

    initAuth();
  }, [token]);

  const login = async (email, password) => {
    const response = await authService.login({ email, password });
    const { token: newToken, user: userData } = response.data.data;
    
    localStorage.setItem('goldtech_token', newToken);
    localStorage.setItem('goldtech_user', JSON.stringify(userData));
    
    setToken(newToken);
    setUser(userData);
    return response.data;
  };

  const register = async (name, email, password) => {
    const response = await authService.register({ name, email, password });
    const { token: newToken, user: userData } = response.data.data;
    
    localStorage.setItem('goldtech_token', newToken);
    localStorage.setItem('goldtech_user', JSON.stringify(userData));
    
    setToken(newToken);
    setUser(userData);
    return response.data;
  };

  const logout = () => {
    localStorage.removeItem('goldtech_token');
    localStorage.removeItem('goldtech_user');
    setToken(null);
    setUser(null);
  };

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    isAdmin: user?.role === 'admin'
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
