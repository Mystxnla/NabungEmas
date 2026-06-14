import { useLocation, Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import './Layout.css';

/**
 * Layout
 * Komponen layout utama yang membungkus halaman dengan sidebar navigasi.
 * Landing page tidak menggunakan sidebar.
 */
const Layout = () => {
  const location = useLocation();
  const isLanding = location.pathname === '/';

  return (
    <div className={`app-layout ${isLanding ? 'no-sidebar' : 'with-sidebar'}`}>
      <Navbar />
      <main className={`main-content ${isLanding ? '' : 'with-nav'}`}>
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
