import React, { useState, useEffect } from 'react';
import { Sparkles, X, ArrowRight, ShieldCheck } from 'lucide-react';

export default function LeftFloatingPrompt({ onOpenAnalysis }) {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  // Sayfa açıldıktan 1.5 saniye sonra nazikçe belirsin
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  if (isDismissed || !isVisible) return null;

  return (
    <aside
      aria-label="Ücretsiz Mimari Ön Analiz Bildirimi"
      className="left-floating-prompt"
    >
      <style>{`
        @keyframes slideUpPrompt {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* ÜST BİLGİ & KAPAT BUTONU */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.8rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: '#25D366',
            boxShadow: '0 0 8px #25D366'
          }} />
          <span style={{
            fontSize: '0.72rem',
            color: 'var(--accent-gold)',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            fontWeight: 600
          }}>
            Mimar Danışma Hattı
          </span>
        </div>

        <button
          onClick={() => setIsDismissed(true)}
          title="Kapat"
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            padding: '2px',
            display: 'flex',
            alignItems: 'center'
          }}
        >
          <X size={15} />
        </button>
      </div>

      {/* MESAJ İÇERİĞİ */}
      <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', marginBottom: '1rem' }}>
        <div style={{
          width: '36px',
          height: '36px',
          borderRadius: '50%',
          background: 'rgba(197, 168, 128, 0.15)',
          border: '1px solid var(--border-gold)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--accent-gold)',
          flexShrink: 0
        }}>
          <Sparkles size={18} />
        </div>
        <div>
          <p style={{
            fontSize: '0.88rem',
            lineHeight: 1.45,
            color: 'var(--text-primary)',
            margin: 0
          }}>
            Arsanız veya daireniz için <strong style={{ color: 'var(--accent-gold)' }}>24 Saatte Ücretsiz Ön Analiz</strong> yaptırmak ister misiniz?
          </p>
        </div>
      </div>

      {/* BUTON */}
      <button
        onClick={onOpenAnalysis}
        className="btn btn-primary"
        style={{
          width: '100%',
          padding: '0.7rem 1rem',
          fontSize: '0.8rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px'
        }}
      >
        <span>Hemen Başlat</span>
        <ArrowRight size={14} />
      </button>
    </aside>
  );
}
