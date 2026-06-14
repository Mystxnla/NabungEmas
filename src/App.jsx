import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { AppProvider } from './contexts/AppContext';
import { ToastProvider } from './contexts/ToastContext';
import Layout from './components/layout/Layout';

// Auth Components
import ProtectedRoute from './components/auth/ProtectedRoute';
import AdminRoute from './components/auth/AdminRoute';

// Halaman Publik
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';

// Halaman User (Protected)
import Dashboard from './pages/Dashboard';
import SavingsPage from './pages/SavingsPage';
import SellPage from './pages/SellPage';
import GoalTracker from './pages/GoalTracker';
import GoldAnalysis from './pages/GoldAnalysis';
import Motivation from './pages/Motivation';
import Education from './pages/Education';
import Reports from './pages/Reports';

// Halaman Admin
import AdminLogin from './pages/admin/AdminLogin';
import AdminLayout from './components/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminTransactions from './pages/admin/AdminTransactions';
import AdminSellTransactions from './pages/admin/AdminSellTransactions';
import AdminGoals from './pages/admin/AdminGoals';
import AdminGoldPrice from './pages/admin/AdminGoldPrice';
import AdminArticles from './pages/admin/AdminArticles';
import AdminQuotes from './pages/admin/AdminQuotes';
import AdminStocks from './pages/admin/AdminStocks';
import AdminBadges from './pages/admin/AdminBadges';
import AdminReports from './pages/admin/AdminReports';

/**
 * App Component
 * Menghubungkan routing dengan Context Providers (Auth, Toast, App) dan Layout.
 */
function App() {
  return (
    <Router>
      <ToastProvider>
        <AuthProvider>
          <AppProvider>
            <Routes>
              {/* Public Routes without Layout */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/" element={<LandingPage />} />

              {/* User Routes with Layout (Protected) */}
              <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/savings" element={<SavingsPage />} />
                <Route path="/sell" element={<SellPage />} />
                <Route path="/goals" element={<GoalTracker />} />
                <Route path="/gold-analysis" element={<GoldAnalysis />} />
                <Route path="/motivation" element={<Motivation />} />
                <Route path="/education" element={<Education />} />
                <Route path="/reports" element={<Reports />} />
              </Route>

              {/* Admin Routes with AdminLayout (Protected by AdminRoute) */}
              <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
                <Route index element={<Navigate to="/admin/dashboard" replace />} />
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="users" element={<AdminUsers />} />
                <Route path="transactions" element={<AdminTransactions />} />
                <Route path="sell-transactions" element={<AdminSellTransactions />} />
                <Route path="goals" element={<AdminGoals />} />
                <Route path="gold-price" element={<AdminGoldPrice />} />
                <Route path="articles" element={<AdminArticles />} />
                <Route path="quotes" element={<AdminQuotes />} />
                <Route path="stocks" element={<AdminStocks />} />
                <Route path="badges" element={<AdminBadges />} />
                <Route path="reports" element={<AdminReports />} />
              </Route>

              {/* Catch all */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </AppProvider>
        </AuthProvider>
      </ToastProvider>
    </Router>
  );
}

export default App;
