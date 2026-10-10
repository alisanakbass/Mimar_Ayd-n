import React from 'react';
import { Award } from 'lucide-react';
import { REFERENCES_DATA } from '../data/initialProjects';

export default function ReferencesSection({ references }) {
  const list = references && references.length > 0 ? references : REFERENCES_DATA;
  // Kesintisiz sonsuz akış için iki kat dizi oluşturuyoruz
  const marqueeList = [...list, ...list];

  return (
    <section id="referanslar" className="section-pad references-section" style={{ background: 'var(--bg-secondary)', borderTop: '1px solid var(--border-subtle)', borderBottom: '1px solid var(--border-subtle)', overflow: 'hidden' }}>
      <div className="container">
        <div className="section-head" style={{ marginBottom: '2.5rem' }}>
          <div>
            <div className="section-subtitle">
              <Award size={14} style={{ marginRight: '6px' }} />
              GÜVEN & İŞ ORTAKLIKLARI
            </div>
            <h2 className="section-title">Referanslarımız & Çözüm Ortaklarımız</h2>
          </div>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '520px', fontSize: '0.95rem', lineHeight: 1.7 }}>
            2019'dan bu yana Türkiye'nin önde gelen gayrimenkul grupları, kamu kurumları ve ticari markalarıyla güven temelli projeler yürütüyoruz.
          </p>
        </div>
      </div>

      {/* SONSUZ AKAN YATAY ŞERİT (INFINITE MARQUEE) */}
      <div className="references-marquee-wrapper">
        <div className="references-marquee-track">
          {marqueeList.map((ref, idx) => (
            <div key={idx} className="reference-marquee-card">
              <div className="reference-marquee-logo-wrap">
                <img
                  src={ref.logo}
                  alt={ref.name}
                  className="reference-marquee-logo"
                  loading="lazy"
                />
              </div>
              <div className="reference-marquee-info">
                <h4 className="reference-marquee-name">{ref.name}</h4>
                <span className="reference-marquee-category">{ref.category}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
