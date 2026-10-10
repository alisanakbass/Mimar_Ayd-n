import React from 'react';
import { STUDIO_INFO } from '../data/initialProjects';
import { Quote } from 'lucide-react';

export default function PhilosophySection({ studioInfo }) {
  const info = studioInfo || STUDIO_INFO;
  const materials = [
    'Yerel Doğal Taşlar',
    'Masif Meşe & Ceviz',
    'Mimari Brüt Beton',
    'Patinalı Ham Pirinç',
    'Keten & Yün Dokular',
    'Geniş Açıklıklı Yalın Camlar'
  ];

  return (
    <section id="felsefemiz" className="section-pad">
      <div className="container">
        <div className="philosophy-grid">
          {/* SOL: FOTOĞRAF VE ALINTI KARTI */}
          <div className="philosophy-image-wrap">
            <img 
              src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80" 
              alt="Mimar Aydın Tasarım Atölyesi" 
              className="philosophy-img"
            />
            <div className="philosophy-quote-card">
              <Quote size={24} color="var(--accent-gold)" style={{ marginBottom: '0.6rem' }} />
              <p style={{ fontSize: '0.92rem', fontStyle: 'italic', color: 'var(--text-primary)', lineHeight: 1.6 }}>
                "İyi bir yapı, yalnızca sağlam temeller üzerinde değil; doğayla nefes alan kusursuz bir peyzajla hayat bulur."
              </p>
              <span style={{ display: 'block', marginTop: '0.6rem', fontSize: '0.78rem', color: 'var(--accent-gold)', letterSpacing: '0.1em' }}>
                — {info.name}
              </span>
            </div>
          </div>

          {/* SAĞ: METİN VE MANİFESTO */}
          <div>
            <div className="section-subtitle">HİZMET FELSEFEMİZ</div>
            <h2 className="section-title" style={{ marginBottom: '1.5rem' }}>
              İnşaat Gücü, Estetik Tasarım ve <br />
              <span style={{ color: 'var(--accent-gold)' }}>Yaşayan Peyzaj</span>
            </h2>

            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, fontSize: '1rem', marginBottom: '1.5rem' }}>
              Günerler Mimarlık İnşaat & Peyzaj - Dekorasyon olarak, yapıyı çevresinden bağımsız görmüyoruz. Kaba inşaatın dayanıklılığını iç mekanın zarif dekorasyonuyla ve bahçenin dingin peyzajıyla bir bütün olarak harmanlıyoruz.
            </p>

            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, fontSize: '0.95rem', marginBottom: '2.5rem' }}>
              İstanbul, Antalya ve Akdeniz kıyılarından tüm Türkiye geneline kadar uzanan villalar, rezidanslar ve ticari projelerde doğru malzeme seçimi, sağlam mühendislik ve zevkli tasarım anlayışımızla müşterilerimize güven veriyoruz.
            </p>

            {/* MALZEME PALETİ */}
            <div>
              <span style={{ fontSize: '0.8rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--accent-gold)' }}>
                Seçilmiş Malzeme Paletimiz:
              </span>
              <div className="material-tags">
                {materials.map((mat, i) => (
                  <span key={i} className="material-tag">
                    {mat}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
