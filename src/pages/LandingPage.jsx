import { Link } from 'react-router-dom';
import {
  FiTrendingUp, FiTarget, FiAward, FiBarChart2,
  FiBookOpen, FiShield, FiArrowRight, FiCheck,
} from 'react-icons/fi';
import './LandingPage.css';

/**
 * LandingPage
 * Halaman utama yang menjelaskan manfaat aplikasi GoldTech.
 * Berisi hero section, fitur unggulan, dan CTA.
 */
const LandingPage = () => {
  // Daftar fitur unggulan
  const features = [
    {
      icon: <FiTrendingUp />,
      title: 'Lacak Tabungan',
      desc: 'Catat setiap pembelian emas dan pantau pertumbuhan asetmu secara real-time.',
    },
    {
      icon: <FiTarget />,
      title: 'Goal Tracker',
      desc: 'Tetapkan target finansial dan pantau progresmu menuju kebebasan finansial.',
    },
    {
      icon: <FiBarChart2 />,
      title: 'Analisis Pasar',
      desc: 'Lihat grafik pergerakan harga emas untuk keputusan investasi yang cerdas.',
    },
    {
      icon: <FiAward />,
      title: 'Gamifikasi',
      desc: 'Raih badge, naik level, dan jaga streak menabungmu untuk tetap termotivasi.',
    },
    {
      icon: <FiBookOpen />,
      title: 'Edukasi',
      desc: 'Pelajari dasar-dasar investasi emas dan manajemen keuangan.',
    },
    {
      icon: <FiShield />,
      title: 'Data Aman',
      desc: 'Semua data tersimpan di browsermu. Privasi dan keamanan terjamin.',
    },
  ];

  // Keunggulan tabungan emas
  const benefits = [
    'Nilai emas cenderung naik seiring waktu',
    'Perlindungan terhadap inflasi',
    'Mudah dicairkan kapan saja',
    'Bisa dimulai dari nominal kecil',
    'Tidak terpengaruh kebijakan moneter',
    'Aset yang diakui secara global',
  ];

  return (
    <div className="landing-page">
      {/* ---- Hero Section ---- */}
      <section className="hero">
        <div className="hero-bg">
          <div className="hero-shape shape-1"></div>
          <div className="hero-shape shape-2"></div>
          <div className="hero-shape shape-3"></div>
        </div>
        <div className="container hero-content">
          <div className="hero-text">
            <span className="hero-badge">🪙 Platform Tabungan Emas #1</span>
            <h1>
              Mulai Perjalanan<br />
              <span className="text-gold">Tabungan Emas</span>mu<br />
              Hari Ini
            </h1>
            <p>
              GoldTech membantu kamu mencatat, memantau, dan mengoptimalkan
              tabungan emas untuk masa depan yang lebih cerah. Gratis, mudah,
              dan aman.
            </p>
            <div className="hero-actions">
              <Link to="/dashboard" className="btn btn-primary btn-lg">
                Mulai Menabung <FiArrowRight />
              </Link>
              <a href="#features" className="btn btn-secondary btn-lg">
                Pelajari Lebih Lanjut
              </a>
            </div>
            <div className="hero-stats">
              <div className="hero-stat">
                <span className="hero-stat-value">100%</span>
                <span className="hero-stat-label">Gratis</span>
              </div>
              <div className="hero-stat-divider"></div>
              <div className="hero-stat">
                <span className="hero-stat-value">🔒</span>
                <span className="hero-stat-label">Data Lokal</span>
              </div>
              <div className="hero-stat-divider"></div>
              <div className="hero-stat">
                <span className="hero-stat-value">⚡</span>
                <span className="hero-stat-label">Aman Terpercaya</span>
              </div>
            </div>
          </div>
          <div className="hero-visual">
            <div className="hero-card-stack">
              <div className="hero-card card-1">
                <div className="hc-icon">📊</div>
                <div className="hc-text">
                  <span className="hc-label">Total Emas</span>
                  <span className="hc-value">17.50 gram</span>
                </div>
              </div>
              <div className="hero-card card-2">
                <div className="hc-icon">💰</div>
                <div className="hc-text">
                  <span className="hc-label">Nilai Aset</span>
                  <span className="hc-value">Rp 21.875.000</span>
                </div>
              </div>
              <div className="hero-card card-3">
                <div className="hc-icon">🎯</div>
                <div className="hc-text">
                  <span className="hc-label">Progress Target</span>
                  <span className="hc-value">70% tercapai</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---- About Gold Savings Section ---- */}
      <section className="about-section" id="about">
        <div className="container">
          <div className="about-grid">
            <div className="about-text">
              <span className="section-tag">Mengapa Emas?</span>
              <h2>Tabungan Emas: Investasi Cerdas untuk Semua</h2>
              <p>
                Tabungan emas adalah cara menabung dalam bentuk emas yang bisa
                dimulai dengan nominal kecil. Emas telah terbukti sebagai
                penyimpan nilai yang handal selama ribuan tahun.
              </p>
              <ul className="benefit-list">
                {benefits.map((benefit, i) => (
                  <li key={i}>
                    <FiCheck className="benefit-check" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="about-visual">
              <div className="gold-bar-visual">
                <div className="gb-shine"></div>
                <span className="gb-text">Au</span>
                <span className="gb-label">999.9 Fine Gold</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---- Features Section ---- */}
      <section className="features-section" id="features">
        <div className="container">
          <div className="section-header-center">
            <span className="section-tag">Fitur Unggulan</span>
            <h2>Semua yang Kamu Butuhkan</h2>
            <p>GoldTech hadir dengan fitur lengkap untuk mendukung perjalanan investasi emasmu.</p>
          </div>
          <div className="features-grid">
            {features.map((feature, i) => (
              <div
                key={i}
                className="feature-card"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className="feature-icon">{feature.icon}</div>
                <h3>{feature.title}</h3>
                <p>{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---- CTA Section ---- */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-card">
            <h2>Siap Memulai Perjalanan Investasimu?</h2>
            <p>
              Bergabung sekarang dan mulai membangun kebiasaan menabung emas
              yang akan mengubah masa depan finansialmu.
            </p>
            <Link to="/dashboard" className="btn btn-primary btn-lg">
              Mulai Menabung Sekarang <FiArrowRight />
            </Link>
          </div>
        </div>
      </section>

      {/* ---- Footer ---- */}
      <footer className="landing-footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-brand">
              <span className="logo-icon">🪙</span>
              <span className="logo-text">GoldTech</span>
            </div>
            <p>© 2024 GoldTech. Dibuat dengan ❤️ untuk masa depan yang lebih cerah.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
