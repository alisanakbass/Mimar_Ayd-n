import React from 'react';
import { Compass, Hammer, Trees, Sparkles, Building, Ruler, Palette, HardHat, ShieldCheck } from 'lucide-react';
import { DEFAULT_SERVICES } from '../data/siteStore';

export default function ServicesSection({ services }) {
  const list = services && services.length > 0 ? services : DEFAULT_SERVICES;

  const renderIcon = (key) => {
    switch (key) {
      case 'Hammer': return <Hammer size={24} />;
      case 'Trees': return <Trees size={24} />;
      case 'Sparkles': return <Sparkles size={24} />;
      case 'Building': return <Building size={24} />;
      case 'Ruler': return <Ruler size={24} />;
      case 'Palette': return <Palette size={24} />;
      case 'HardHat': return <HardHat size={24} />;
      case 'ShieldCheck': return <ShieldCheck size={24} />;
      default: return <Compass size={24} />;
    }
  };

  return (
    <section id="hizmetler" className="section-pad" style={{ background: 'var(--bg-secondary)' }}>
      <div className="container">
        <div className="section-head">
          <div>
            <div className="section-subtitle">UZMANLIK ALANLARIMIZ</div>
            <h2 className="section-title">Hizmetlerimiz</h2>
          </div>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '480px', fontSize: '0.95rem', lineHeight: 1.7 }}>
            Fikir aşamasından anahtar teslimine kadar her fazda mimari mükemmeliyet ve şeffaf süreç yönetimi sağlıyoruz.
          </p>
        </div>

        <div className="services-grid">
          {list.map((s, idx) => (
            <div key={s.id || idx} className="service-card">
              <span className="service-card-num">{s.num || `0${idx + 1}`}</span>
              <div className="service-icon">{renderIcon(s.iconKey)}</div>
              <h3 className="service-card-title">{s.title}</h3>
              <p className="service-card-desc">{s.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
