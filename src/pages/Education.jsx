import { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import localArticles from '../data/articles';
import { articleService } from '../api/articleService';
import Modal from '../components/ui/Modal';
import { formatCurrency } from '../utils/helpers';
import { FiBookOpen, FiDollarSign, FiCoffee, FiTrendingUp, FiArrowRight } from 'react-icons/fi';
import './Education.css';

/**
 * Education
 * Halaman edukasi finansial dan kalkulator alokasi anggaran bulanan.
 * Membaca konten edukasi dari API backend, dengan fallback ke data lokal.
 */
const Education = () => {
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [activeArticle, setActiveArticle] = useState(null);
  const [articles, setArticles] = useState(localArticles);

  // State Kalkulator Anggaran
  const [monthlyIncome, setMonthlyIncome] = useState('5000000'); // Default Rp 5 Juta

  // Fetch artikel dari API
  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const res = await articleService.getAll();
        if (res.data.data && res.data.data.length > 0) {
          setArticles(res.data.data.map(art => ({
            ...art,
            readTime: art.read_time || art.readTime,
          })));
        }
      } catch (error) {
        // Fallback ke data lokal jika API gagal
        console.error('Gagal memuat artikel dari API, menggunakan data lokal:', error);
      }
    };
    fetchArticles();
  }, []);

  // Daftar kategori artikel unik
  const categories = useMemo(() => {
    const cats = ['Semua'];
    articles.forEach((art) => {
      if (!cats.includes(art.category)) {
        cats.push(art.category);
      }
    });
    return cats;
  }, [articles]);

  // Filter artikel berdasarkan kategori
  const filteredArticles = useMemo(() => {
    if (selectedCategory === 'Semua') return articles;
    return articles.filter((art) => art.category === selectedCategory);
  }, [selectedCategory, articles]);

  // Kalkulasi Anggaran 50/30/20
  const budgetAllocation = useMemo(() => {
    const income = Number(monthlyIncome);
    if (isNaN(income) || income <= 0) return null;

    const needs = income * 0.5;
    const wants = income * 0.3;
    const savings = income * 0.2;

    return { needs, wants, savings };
  }, [monthlyIncome]);

  // Fungsi Parser Markdown Sederhana ke HTML
  const parseMarkdownToHTML = (md) => {
    if (!md) return '';
    const blocks = md.split(/\n\s*\n/);
    
    const parsedBlocks = blocks.map((block) => {
      let text = block.trim();
      if (!text) return '';

      // Blockquote
      if (text.startsWith('>')) {
        const content = text.substring(1).trim();
        return `<blockquote>${parseInline(content)}</blockquote>`;
      }

      // Headings
      if (text.startsWith('###')) {
        return `<h3>${parseInline(text.substring(3).trim())}</h3>`;
      }
      if (text.startsWith('##')) {
        return `<h2>${parseInline(text.substring(2).trim())}</h2>`;
      }
      if (text.startsWith('#')) {
        return `<h1>${parseInline(text.substring(1).trim())}</h1>`;
      }

      // Lists (unordered)
      if (text.startsWith('-') || text.startsWith('*')) {
        const items = text.split(/\n\s*[-\*]\s+/);
        if (items[0].startsWith('-') || items[0].startsWith('*')) {
          items[0] = items[0].replace(/^[-\*]\s+/, '');
        }
        const listItems = items.map(item => `<li>${parseInline(item.trim())}</li>`).join('');
        return `<ul>${listItems}</ul>`;
      }

      // Lists (ordered)
      if (/^\d+\./.test(text)) {
        const items = text.split(/\n\s*\d+\.\s+/);
        if (/^\d+\./.test(items[0])) {
          items[0] = items[0].replace(/^\d+\.\s+/, '');
        }
        const listItems = items.map(item => `<li>${parseInline(item.trim())}</li>`).join('');
        return `<ol>${listItems}</ol>`;
      }

      // Tables
      if (text.startsWith('|')) {
        const lines = text.split('\n');
        let tableHtml = '<div class="table-container"><table>';
        let hasThead = false;
        
        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed) continue;
          if (trimmed.includes('---')) continue;
          
          const cols = trimmed.split('|').slice(1, -1).map(c => c.trim());
          if (!hasThead) {
            tableHtml += '<thead><tr>' + cols.map(c => `<th>${parseInline(c)}</th>`).join('') + '</tr></thead><tbody>';
            hasThead = true;
          } else {
            tableHtml += '<tr>' + cols.map(c => `<td>${parseInline(c)}</td>`).join('') + '</tr>';
          }
        }
        tableHtml += '</tbody></table></div>';
        return tableHtml;
      }

      // Default Paragraph
      const pContent = text.split('\n').map(line => parseInline(line.trim())).join('<br />');
      return `<p>${pContent}</p>`;
    });

    return parsedBlocks.filter(b => b !== '').join('');
  };

  const parseInline = (text) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`(.*?)`/g, '<code>$1</code>');
  };

  return (
    <div className="page-wrapper">
      <div className="container">
        {/* Header */}
        <div className="page-header">
          <h1>Edukasi & Kalkulator Anggaran</h1>
          <p>Pelajari ilmu dasar keuangan pribadi dan alokasikan pendapatan bulananmu secara rasional.</p>
        </div>

        {/* Layout Utama */}
        <div className="edu-layout">
          {/* Bagian Kiri: Kategori & Artikel */}
          <div className="edu-main animate-fade-in">
            {/* Filter Kategori */}
            <div className="category-filters card" style={{ padding: '12px' }}>
              <div className="category-list">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    className={`category-btn ${selectedCategory === cat ? 'active' : ''}`}
                    onClick={() => setSelectedCategory(cat)}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Grid Kartu Artikel */}
            <div className="articles-grid">
              {filteredArticles.map((art, i) => (
                <div
                  key={art.id}
                  className="card article-card"
                  style={{ animationDelay: `${i * 0.1}s` }}
                  onClick={async () => {
                    // Jika artikel dari API belum punya content, fetch detail
                    if (!art.content && art.id) {
                      try {
                        const res = await articleService.getById(art.id);
                        setActiveArticle({ ...art, ...res.data.data, readTime: res.data.data.read_time || art.readTime });
                        return;
                      } catch (error) {
                        console.error('Gagal memuat detail artikel:', error);
                      }
                    }
                    setActiveArticle(art);
                  }}
                >
                  <div className="article-card-header">
                    <span className="art-icon">{art.icon}</span>
                    <span className="badge badge-gold">{art.category}</span>
                  </div>
                  <h3 className="art-title">{art.title}</h3>
                  <p className="art-summary">{art.summary}</p>
                  <div className="article-card-footer">
                    <span>⏱️ Baca: {art.readTime}</span>
                    <span className="btn-read-more">Baca Lengkap →</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bagian Kanan: Kalkulator Anggaran 50/30/20 */}
          <div className="edu-sidebar animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <div className="card budget-calculator-card">
              <div className="calculator-header">
                <FiBookOpen className="calc-icon" />
                <div>
                  <h3>Kalkulator Anggaran 50/30/20</h3>
                  <p>Alokasikan pendapatan bulananmu</p>
                </div>
              </div>

              <div className="form-group" style={{ marginTop: '20px' }}>
                <label htmlFor="monthlyIncome">Pendapatan Bulanan (Rupiah)</label>
                <div className="input-wrapper">
                  <span className="input-prefix">Rp</span>
                  <input
                    id="monthlyIncome"
                    type="number"
                    className="form-control"
                    style={{ paddingLeft: '45px' }}
                    value={monthlyIncome}
                    onChange={(e) => setMonthlyIncome(e.target.value)}
                  />
                </div>
              </div>

              {budgetAllocation && (
                <div className="budget-results">
                  {/* Kebutuhan Pokok (50%) */}
                  <div className="budget-item needs">
                    <div className="bi-header">
                      <div className="bi-title">
                        <FiDollarSign className="bi-icon" />
                        <span>Kebutuhan Pokok (50%)</span>
                      </div>
                      <strong className="bi-val">{formatCurrency(budgetAllocation.needs)}</strong>
                    </div>
                    <p className="bi-desc">
                      Digunakan untuk makanan, kost/sewa kamar, transportasi kuliah, tagihan air/listrik, dan kewajiban bulanan.
                    </p>
                  </div>

                  {/* Keinginan Pribadi (30%) */}
                  <div className="budget-item wants">
                    <div className="bi-header">
                      <div className="bi-title">
                        <FiCoffee className="bi-icon" />
                        <span>Keinginan (30%)</span>
                      </div>
                      <strong className="bi-val">{formatCurrency(budgetAllocation.wants)}</strong>
                    </div>
                    <p className="bi-desc">
                      Digunakan untuk hobi, nongkrong di cafe, langganan streaming film/musik, dan rekreasi akhir pekan.
                    </p>
                  </div>

                  {/* Tabungan & Investasi (20%) */}
                  <div className="budget-item savings">
                    <div className="bi-header">
                      <div className="bi-title">
                        <FiTrendingUp className="bi-icon" />
                        <span>Tabungan & Investasi (20%)</span>
                      </div>
                      <strong className="bi-val">{formatCurrency(budgetAllocation.savings)}</strong>
                    </div>
                    <p className="bi-desc">
                      Prioritaskan untuk menabung emas di GoldTech dan membangun dana darurat untuk masa depan.
                    </p>
                  </div>

                  <Link to="/savings" className="btn btn-primary btn-block" style={{ marginTop: '16px', width: '100%' }}>
                    Mulai Nabung Emas Sekarang <FiArrowRight />
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Modal Viewer Konten Artikel */}
        {activeArticle && (
          <Modal
            isOpen={!!activeArticle}
            onClose={() => setActiveArticle(null)}
            title={activeArticle.title}
          >
            <div className="article-viewer-meta">
              <span className="badge badge-gold">{activeArticle.category}</span>
              <span className="av-readtime">⏱️ Estimasi Baca: {activeArticle.readTime}</span>
            </div>
            
            <div
              className="article-viewer-content"
              dangerouslySetInnerHTML={{ __html: parseMarkdownToHTML(activeArticle.content) }}
            />

            <div className="modal-footer" style={{ borderTop: '1px solid var(--gray-100)', paddingTop: '16px' }}>
              <button className="btn btn-secondary" onClick={() => setActiveArticle(null)}>
                Tutup Bacaan
              </button>
            </div>
          </Modal>
        )}
      </div>
    </div>
  );
};

export default Education;
