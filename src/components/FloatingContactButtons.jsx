import React, { useState, useEffect } from 'react';
import { Phone, Sparkles, X, ArrowRight } from 'lucide-react';
import WhatsAppIcon from './WhatsAppIcon';
import { STUDIO_INFO } from '../data/initialProjects';

export default function FloatingContactButtons({ studioInfo, onOpenAnalysis }) {
  const [isPromptExpanded, setIsPromptExpanded] = useState(false);
  const [hoveredBtn, setHoveredBtn] = useState(null);
  const info = studioInfo || STUDIO_INFO;

  // 5 sn sonra açılsın, 10 sn kalsın ve kendiliğinden buton haline geri dönsün
  useEffect(() => {
    const openTimer = setTimeout(() => {
      setIsPromptExpanded(true);
    }, 5000);

    const closeTimer = setTimeout(() => {
      setIsPromptExpanded(false);
    }, 15000); // 5000 + 10000 = 15. saniye

    return () => {
      clearTimeout(openTimer);
      clearTimeout(closeTimer);
    };
  }, []);

  return (
    <aside 
      aria-label="Hızlı İletişim ve Danışma Butonları"
      className="floating-contact-buttons"
    >
      {/* 1. MİMAR DANIŞMA HATTI (5 SN SONRA AÇILAN, 10 SN SONRA BUTONA DÖNEN KART) */}
      {!isPromptExpanded ? (
        <button
          onClick={() => setIsPromptExpanded(true)}
          title="Mimar Danışma Hattı"
          aria-label="Mimar Danışma Hattı"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(22, 25, 32, 0.95)',
            border: '1.5px solid var(--accent-gold)',
            color: 'var(--accent-gold-light)',
            padding: '9px 14px',
            borderRadius: '50px',
            cursor: 'pointer',
            boxShadow: '0 6px 20px rgba(0, 0, 0, 0.6), 0 0 12px rgba(197, 168, 128, 0.25)',
            backdropFilter: 'blur(10px)',
            transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
            fontWeight: 600,
            fontSize: '0.8rem',
            letterSpacing: '0.02em',
            marginBottom: '4px'
          }}
        >
          <div style={{
            width: '7px',
            height: '7px',
            borderRadius: '50%',
            background: '#25D366',
            boxShadow: '0 0 8px #25D366'
          }} />
          <Sparkles size={15} color="var(--accent-gold)" />
          <span>Mimar Danışma</span>
        </button>
      ) : (
        <div
          style={{
            width: '320px',
            maxWidth: 'calc(100vw - 32px)',
            background: 'rgba(18, 21, 26, 0.97)',
            border: '1px solid var(--border-gold)',
            borderRadius: '12px',
            padding: '1.2rem',
            boxShadow: '0 16px 40px rgba(0, 0, 0, 0.85), 0 0 20px rgba(197, 168, 128, 0.15)',
            backdropFilter: 'blur(16px)',
            color: 'var(--text-primary)',
            textAlign: 'left',
            marginBottom: '4px',
            animation: 'fadeInPrompt 0.3s ease-out'
          }}
        >
          {/* Başlık & Küçültme Butonu */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.8rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{
                width: '7px',
                height: '7px',
                borderRadius: '50%',
                background: '#25D366',
                boxShadow: '0 0 8px #25D366'
              }} />
              <span style={{
                fontSize: '0.72rem',
                color: 'var(--accent-gold)',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                fontWeight: 700
              }}>
                Mimar Danışma Hattı
              </span>
            </div>
            <button
              onClick={() => setIsPromptExpanded(false)}
              title="Küçült"
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                padding: '3px',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <X size={15} />
            </button>
          </div>

          {/* Mesaj */}
          <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', marginBottom: '1rem' }}>
            <div style={{
              width: '34px',
              height: '34px',
              borderRadius: '50%',
              background: 'rgba(197, 168, 128, 0.12)',
              border: '1px solid var(--border-gold)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--accent-gold)',
              flexShrink: 0
            }}>
              <Sparkles size={16} />
            </div>
            <p style={{
              fontSize: '0.84rem',
              lineHeight: 1.45,
              color: 'var(--text-primary)',
              margin: 0
            }}>
              Arsanız veya daireniz için <strong style={{ color: 'var(--accent-gold)' }}>24 Saatte Ücretsiz Ön Analiz</strong> yaptırmak ister misiniz?
            </p>
          </div>

          {/* Form Açma Aksiyon Butonu */}
          <button
            onClick={() => {
              if (onOpenAnalysis) onOpenAnalysis();
            }}
            className="btn btn-primary"
            style={{
              width: '100%',
              padding: '0.65rem 1rem',
              fontSize: '0.8rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              borderRadius: '4px'
            }}
          >
            <span>Hemen Başlat</span>
            <ArrowRight size={14} />
          </button>
        </div>
      )}

      {/* 2. WHATSAPP BUTONU (ORİJİNAL LOGO) */}
      <a
        href={info.whatsappDirectUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="WhatsApp ile Mesaj Gönder"
        onMouseEnter={() => setHoveredBtn('wa')}
        onMouseLeave={() => setHoveredBtn(null)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: '#25D366',
          color: '#FFFFFF',
          padding: hoveredBtn === 'wa' ? '10px 16px 10px 12px' : '12px',
          borderRadius: '50px',
          textDecoration: 'none',
          boxShadow: '0 6px 20px rgba(37, 211, 102, 0.45), 0 2px 6px rgba(0,0,0,0.4)',
          transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
          cursor: 'pointer'
        }}
      >
        <WhatsAppIcon size={24} color="#FFFFFF" />
        <span 
          style={{
            fontSize: '0.85rem',
            fontWeight: 600,
            whiteSpace: 'nowrap',
            maxWidth: hoveredBtn === 'wa' ? '160px' : '0px',
            opacity: hoveredBtn === 'wa' ? 1 : 0,
            overflow: 'hidden',
            transition: 'all 0.3s ease'
          }}
        >
          WhatsApp'tan Yazın
        </span>
      </a>

      {/* 3. TELEFON ARAMA BUTONU */}
      <a
        href={`tel:${info.phoneRaw}`}
        aria-label={`Telefon ile Ara: ${info.phone}`}
        onMouseEnter={() => setHoveredBtn('call')}
        onMouseLeave={() => setHoveredBtn(null)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: 'linear-gradient(135deg, #1A1D23 0%, #0D0E11 100%)',
          border: '1.5px solid var(--accent-gold)',
          color: 'var(--accent-gold)',
          padding: hoveredBtn === 'call' ? '10px 16px 10px 12px' : '12px',
          borderRadius: '50px',
          textDecoration: 'none',
          boxShadow: '0 6px 20px rgba(0, 0, 0, 0.6), 0 0 15px rgba(197, 168, 128, 0.25)',
          transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
          cursor: 'pointer'
        }}
      >
        <Phone size={22} style={{ flexShrink: 0 }} />
        <span 
          style={{
            fontSize: '0.85rem',
            fontWeight: 600,
            whiteSpace: 'nowrap',
            color: '#FFFFFF',
            maxWidth: hoveredBtn === 'call' ? '160px' : '0px',
            opacity: hoveredBtn === 'call' ? 1 : 0,
            overflow: 'hidden',
            transition: 'all 0.3s ease'
          }}
        >
          Hemen Arayın
        </span>
      </a>
    </aside>
  );
}
