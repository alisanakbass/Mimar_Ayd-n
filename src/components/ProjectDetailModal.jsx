import React, { useState } from 'react';
import { X, MapPin, Calendar, Layers, CheckCircle2, MessageCircle, Share2 } from 'lucide-react';
import { STUDIO_INFO } from '../data/initialProjects';

export default function ProjectDetailModal({ project, onClose }) {
  if (!project) return null;

  const [activeImage, setActiveImage] = useState(project.cover_image);
  const images = project.images && project.images.length > 0 
    ? project.images 
    : [project.cover_image];

  const handleShare = () => {
    const text = `Mimar Aydın Mimarlık - ${project.title} (${project.location}): ${window.location.href}`;
    if (navigator.share) {
      navigator.share({ title: project.title, text: text, url: window.location.href }).catch(() => {});
    } else {
      navigator.clipboard.writeText(text);
      alert('Proje bağlantısı panoya kopyalandı!');
    }
  };

  const whatsappMessage = encodeURIComponent(
    `Merhaba Mimar Aydın, web sitenizdeki "${project.title}" (${project.location}) projeniz hakkında detaylı bilgi ve benzer bir proje için görüşmek istiyorum.`
  );

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-container" 
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '1000px' }}
      >
        {/* MODAL BAŞLIK BARI */}
        <div className="modal-header-bar">
          <div>
            <span style={{ fontSize: '0.75rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--accent-gold)' }}>
              {project.category}
            </span>
            <h2 style={{ fontSize: '1.6rem', marginTop: '0.2rem' }}>{project.title}</h2>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
            <button 
              className="btn btn-outline" 
              onClick={handleShare}
              title="Paylaş / Kopyala"
              style={{ padding: '0.5rem 0.9rem', fontSize: '0.75rem' }}
            >
              <Share2 size={14} />
              <span>Paylaş</span>
            </button>
            <button className="modal-close-btn" onClick={onClose} aria-label="Kapat">
              <X size={20} />
            </button>
          </div>
        </div>

        {/* İÇERİK ALANI */}
        <div className="project-modal-body">
          {/* ANA GÖRSEL */}
          <div className="project-modal-image-wrap">
            <img 
              src={activeImage} 
              alt={project.title} 
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>

          {/* KÜÇÜK RESİM GALERİSİ */}
          {images.length > 1 && (
            <div style={{ display: 'flex', gap: '0.8rem', overflowX: 'auto', marginBottom: '2.5rem', paddingBottom: '0.5rem' }}>
              {images.map((img, idx) => (
                <div
                  key={idx}
                  onClick={() => setActiveImage(img)}
                  style={{
                    width: '110px',
                    height: '75px',
                    borderRadius: '2px',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    border: activeImage === img ? '2px solid var(--accent-gold)' : '1px solid var(--border-subtle)',
                    opacity: activeImage === img ? 1 : 0.65,
                    transition: 'all 0.2s',
                    flexShrink: 0
                  }}
                >
                  <img src={img} alt={`Galeri ${idx}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              ))}
            </div>
          )}

          {/* MİMARİ KÜNYE & AÇIKLAMA */}
          <div className="project-modal-grid">
            <div>
              <h3 style={{ fontSize: '1.4rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>
                Tasarım Konsepti & Mimari Yaklaşım
              </h3>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, fontSize: '0.95rem', marginBottom: '1.5rem' }}>
                {project.description}
              </p>

              {project.concept_brief && (
                <div style={{ 
                  background: 'rgba(197, 168, 128, 0.05)', 
                  borderLeft: '3px solid var(--accent-gold)', 
                  padding: '1.2rem', 
                  marginBottom: '1.8rem',
                  fontSize: '0.9rem',
                  color: 'var(--text-primary)',
                  lineHeight: 1.7
                }}>
                  <strong>Mekânsal Kurgu:</strong> {project.concept_brief}
                </div>
              )}

              {/* ÖNE ÇIKAN ÖZELLİKLER */}
              {project.features && project.features.length > 0 && (
                <div>
                  <h4 style={{ fontSize: '1.1rem', marginBottom: '0.8rem', color: 'var(--accent-gold)' }}>
                    Öne Çıkan Mimari Detaylar
                  </h4>
                  <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {project.features.map((feat, i) => (
                      <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                        <CheckCircle2 size={16} color="var(--accent-gold)" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* SAĞ KÜNYE TABLOSU */}
            <div>
              <div style={{ background: '#12151B', border: '1px solid var(--border-subtle)', padding: '1.8rem', borderRadius: '4px' }}>
                <h4 style={{ fontSize: '1.1rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--accent-gold)', marginBottom: '1.2rem', paddingBottom: '0.6rem', borderBottom: '1px solid var(--border-subtle)' }}>
                  Mimari Künye
                </h4>

                <table className="catalog-specs-table">
                  <tbody>
                    <tr>
                      <td>Lokasyon</td>
                      <td>{project.location}</td>
                    </tr>
                    <tr>
                      <td>Tipoloji</td>
                      <td>{project.category}</td>
                    </tr>
                    <tr>
                      <td>Toplam Alan</td>
                      <td>{project.area}</td>
                    </tr>
                    <tr>
                      <td>Proje Yılı</td>
                      <td>{project.year}</td>
                    </tr>
                    <tr>
                      <td>Durum</td>
                      <td>{project.status || 'Tamamlandı'}</td>
                    </tr>
                    {project.client && (
                      <tr>
                        <td>İşveren</td>
                        <td>{project.client}</td>
                      </tr>
                    )}
                  </tbody>
                </table>

                {/* HIZLI İLETİŞİM AKSİYONU */}
                <div style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                  <a 
                    href={`https://wa.me/${STUDIO_INFO.phoneRaw}?text=${whatsappMessage}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary"
                    style={{ width: '100%' }}
                  >
                    <MessageCircle size={16} />
                    <span>WhatsApp ile Bilgi Al</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
