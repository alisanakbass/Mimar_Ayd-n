import React, { useState } from 'react';
import { ArrowUpRight, Layers, Cpu, Compass, Sparkles } from 'lucide-react';
import { STUDIO_INFO } from '../data/initialProjects';
import { getSimulationData } from '../data/simulationData';
import ArchitecturalCanvas from './ArchitecturalCanvas';

export default function Hero({ studioInfo, simulationData, onOpenAnalysis }) {
  // İnteraktif Mimari Katman Modu: 'blueprint' | 'structure' | 'render'
  const [activeLayer, setActiveLayer] = useState('render');
  const [isScanning, setIsScanning] = useState(false);

  const info = studioInfo || STUDIO_INFO;
  const data = simulationData || getSimulationData();

  const scrollToProjects = () => {
    const el = document.getElementById('projeler');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handleAnalysisClick = () => {
    if (onOpenAnalysis) {
      onOpenAnalysis();
    } else {
      const el = document.getElementById('iletisim');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleLayerChange = (layer) => {
    if (layer === activeLayer) return;
    setIsScanning(true);
    setActiveLayer(layer);
    setTimeout(() => {
      setIsScanning(false);
    }, 600);
  };

  const current = data[activeLayer] || data.render || Object.values(data)[0];

  return (
    <section id="hero" className="hero-section">
      {/* 1. DİNAMİK MİMARİ BLUEPRINT & CAD CANVAS */}
      <ArchitecturalCanvas />

      {/* 2. ARKA PLAN KATMANI VE AMBİYANS IŞIĞI */}
      <div className="hero-bg-overlay"></div>
      <div className="hero-grid-ambient"></div>

      <div className="container hero-container">
        <div className="hero-grid-layout">
          {/* SOL KOLON: MİMARİ BAŞLIK & VİZYON */}
          <div className="hero-content">
            <h1 className="hero-title">
              Mimari Estetik, Sağlam İnşaat <br />
              <span className="hero-title-accent">& Kusursuz Peyzaj.</span>
            </h1>

            <p className="hero-description">
              Başta İstanbul ve Antalya olmak üzere tüm Türkiye genelinde anahtar teslim villa inşaatından sanatsal peyzaj ve bahçe düzenlemesine, 
              iç mekan dekorasyonundan statik ve mimari projelendirmeye kadar tüm hayallerinizi tek çatı altında inşa ediyoruz.
            </p>

            <div className="hero-actions">
              <button className="btn btn-primary btn-glow" onClick={scrollToProjects}>
                <span>Projeleri Keşfet</span>
                <ArrowUpRight size={16} />
              </button>

              <button 
                onClick={handleAnalysisClick}
                className="btn btn-gold-outline"
                title="24 Saatte Ücretsiz Mimari Ön Analiz ve Danışmanlık"
              >
                <span>Ücretsiz Mimari Keşif</span>
              </button>
            </div>

            {/* MİMARİ İSTATİSTİKLER */}
            <div className="hero-stats">
              {(info.stats || STUDIO_INFO.stats).map((st, i) => (
                <div key={i} className="stat-item">
                  <div className="stat-value-wrap">
                    <span className="stat-value">{st.value}</span>
                  </div>
                  <span className="stat-label">{st.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* SAĞ KOLON: İNTERAKTİF FÜTÜRİSTİK MİMARİ KATMAN VİTRİNİ */}
          <div className="hero-interactive-showcase">
            <div className="futuristic-hud-frame">
              {/* Köşe CAD İşaretleri */}
              <div className="hud-corner hud-corner-tl"></div>
              <div className="hud-corner hud-corner-tr"></div>
              <div className="hud-corner hud-corner-bl"></div>
              <div className="hud-corner hud-corner-br"></div>

              {/* Üst HUD Başlığı & Katman Seçici Sekmeleri */}
              <div className="hud-header">
                <div className="hud-telemetry-status">
                  <span className="hud-live-tag">CANLI SİMÜLASYON</span>
                  <span className="hud-coords">KOT: +18.40m | ELEV: 41.02°</span>
                </div>

                {/* Katman Değiştirme Butonları */}
                <div className="hud-layer-tabs">
                  <button 
                    className={`hud-tab-btn ${activeLayer === 'blueprint' ? 'active' : ''}`}
                    onClick={() => handleLayerChange('blueprint')}
                    title="3D CAD ve Blueprint Katmanı"
                  >
                    <Compass size={13} />
                    <span>{data.blueprint?.tabLabel || '1. CAD Blueprint'}</span>
                  </button>

                  <button 
                    className={`hud-tab-btn ${activeLayer === 'structure' ? 'active' : ''}`}
                    onClick={() => handleLayerChange('structure')}
                    title="Strüktür ve İnşaat Karkası Katmanı"
                  >
                    <Layers size={13} />
                    <span>{data.structure?.tabLabel || '2. Strüktür'}</span>
                  </button>

                  <button 
                    className={`hud-tab-btn ${activeLayer === 'render' ? 'active' : ''}`}
                    onClick={() => handleLayerChange('render')}
                    title="Nihai 8K Render Katmanı"
                  >
                    <Sparkles size={13} />
                    <span>{data.render?.tabLabel || '3. Lüks Render'}</span>
                  </button>
                </div>
              </div>

              {/* Görsel Ekranı & Lazer Tarama Efekti */}
              <div className="hud-display-screen">
                <img 
                  src={current.image} 
                  alt={current.title}
                  className={`hud-main-image ${isScanning ? 'image-glitch' : ''}`}
                  key={activeLayer}
                />

                {/* Dinamik Lazer Tarama Çizgisi */}
                <div className={`hud-laser-scanline ${isScanning ? 'fast-scan' : ''}`}></div>

                {/* Görsel Üzeri Holografik Rozet */}
                <div className="hud-screen-badge">
                  <span>{current.badge}</span>
                </div>

                {/* İnteraktif Hotspot / Nokta Vurguları */}
                {current.hotspots.map((hp, idx) => (
                  <div 
                    key={idx} 
                    className="hud-hotspot-pin"
                    style={{ top: hp.top, left: hp.left }}
                  >
                    <div className="hotspot-pulse-ring"></div>
                    <div className="hotspot-dot"></div>
                    <div className="hotspot-tooltip">
                      <strong>{hp.title}</strong>
                      <span>{hp.tag}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Alt Bilgi & Telemetri Çubuğu */}
              <div className="hud-footer">
                <div className="hud-info-text">
                  <h4 className="hud-info-title">{current.title}</h4>
                  <p className="hud-info-desc">{current.subtitle}</p>
                </div>

                <div className="hud-stats-grid">
                  {current.stats.map((st, i) => (
                    <div key={i} className="hud-stat-box">
                      <span className="hud-stat-val">{st.val}</span>
                      <span className="hud-stat-lbl">{st.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
