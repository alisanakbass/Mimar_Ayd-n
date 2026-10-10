import React from 'react';
import { ArrowUp, Compass, Mail, Phone, Lock } from 'lucide-react';
import { STUDIO_INFO } from '../data/initialProjects';

export default function Footer({ studioInfo, onOpenAdmin }) {
  const info = studioInfo || STUDIO_INFO;

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          
          {/* SÜTUN 1: MARKA & TANITIM */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.2rem', color: 'var(--accent-gold)' }}>
              <Compass size={22} />
              <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#fff' }}>
                {info.name}
              </span>
            </div>

            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.7, maxWidth: '320px', marginBottom: '1.8rem' }}>
              Zamansız çizgiler, doğal malzemeler ve insan ölçeğine saygılı çağdaş mimarlık pratikleri.
            </p>
          </div>

          {/* SÜTUN 2: HIZLI BAĞLANTILAR */}
          <div>
            <h4 style={{ fontSize: '0.9rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--accent-gold)', marginBottom: '1.4rem' }}>
              Menü
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              <li>
                <a href="#hero" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.9rem' }}>
                  Ana Sayfa
                </a>
              </li>
              <li>
                <a href="#projeler" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.9rem' }}>
                  Projeler
                </a>
              </li>
              <li>
                <a href="#hizmetler" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.9rem' }}>
                  Hizmetler
                </a>
              </li>
              <li>
                <a href="#referanslar" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.9rem' }}>
                  Referanslar
                </a>
              </li>
              <li>
                <a href="#ekibimiz" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.9rem' }}>
                  Ekibimiz
                </a>
              </li>
              <li>
                <a href="#felsefemiz" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.9rem' }}>
                  Felsefemiz
                </a>
              </li>
              <li>
                <a href="#iletisim" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.9rem' }}>
                  İletişim
                </a>
              </li>
            </ul>
          </div>

          {/* SÜTUN 3: HİZMET ODAKLARI */}
          <div>
            <h4 style={{ fontSize: '0.9rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--accent-gold)', marginBottom: '1.4rem' }}>
              Tipolojiler
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.8rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              <li>Lüks Villa & Konut</li>
              <li>İç Mimarlık & Loft</li>
              <li>Ticari Ofis Merkezleri</li>
              <li>Tarihi Eser Restorasyonu</li>
              <li>Kentsel & Peyzaj Tasarımı</li>
            </ul>
          </div>

          {/* SÜTUN 4: İLETİŞİM */}
          <div>
            <h4 style={{ fontSize: '0.9rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--accent-gold)', marginBottom: '1.4rem' }}>
              Stüdyo
            </h4>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', lineHeight: 1.6, marginBottom: '1rem' }}>
              {info.address}
            </p>
            <p style={{ color: 'var(--text-primary)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
              {info.phone}
            </p>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginBottom: '1.5rem' }}>
              {info.email}
            </p>
          </div>

        </div>

        {/* ALT TELİF VE GERİ DÖN BARI */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '2rem', borderTop: '1px solid var(--border-subtle)', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            <span>© {new Date().getFullYear()} {info.name}. Tüm hakları saklıdır.</span>
            <button 
              onClick={onOpenAdmin} 
              title="Yönetici Girişi"
              style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.18)', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '0.2rem' }}
            >
              <Lock size={12} />
            </button>
          </div>

          <button 
            onClick={scrollToTop} 
            className="btn btn-outline"
            style={{ padding: '0.5rem 1rem', fontSize: '0.75rem' }}
          >
            <span>Yukarı Çık</span>
            <ArrowUp size={14} />
          </button>
        </div>
      </div>
    </footer>
  );
}
