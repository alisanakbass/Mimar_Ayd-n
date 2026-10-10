import React, { useState } from 'react';
import { Camera, Clock, CheckCircle2, MessageCircle, FileText, Send, Sparkles } from 'lucide-react';
import { STUDIO_INFO } from '../data/initialProjects';
import { sendInquiry } from '../lib/supabase';

export default function QuickAnalysisSection() {
  const [propertyType, setPropertyType] = useState('Boş Arsa / Villa İnşaatı');
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [note, setNote] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await sendInquiry({
        name,
        phone,
        project_type: propertyType,
        message: `24 SAATTE ÖN ANALİZ TALEBİ: ${note || 'Detaylı analiz istiyor.'}`
      });
      setIsSuccess(true);
      setName('');
      setPhone('');
      setNote('');
      setTimeout(() => setIsSuccess(false), 6000);
    } catch (err) {
      console.error(err);
      alert('Talebiniz kaydedilemedi. Lütfen WhatsApp üzerinden fotoğraf ile birlikte iletiniz.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const whatsappFastUrl = `https://wa.me/${STUDIO_INFO.phoneRaw}?text=Merhaba%20G%C3%BCnerler%20Mimarl%C4%B1k,%20arsam%C4%B1n%20/%20dairemin%20foto%C4%9Fraf%C4%B1n%C4%B1%20g%C3%B6ndererek%2024%20saatte%20%C3%BCcretsiz%20mimari%20%C3%B6n%20analiz%20almak%20istiyorum.`;

  return (
    <section id="hizli-analiz" className="section-pad" style={{ background: 'var(--bg-primary)', position: 'relative' }}>
      <div className="container">
        <div style={{
          background: 'linear-gradient(135deg, rgba(26, 29, 35, 0.95) 0%, rgba(13, 14, 17, 0.98) 100%)',
          border: '1px solid var(--border-gold)',
          borderRadius: '8px',
          padding: '3.5rem 2.5rem',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6), 0 0 30px rgba(197, 168, 128, 0.08)'
        }}>
          {/* ARKA PLAN DEKORATİF IŞIMA */}
          <div style={{
            position: 'absolute',
            top: '-50px',
            right: '-50px',
            width: '260px',
            height: '260px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(197, 168, 128, 0.15) 0%, transparent 70%)',
            pointerEvents: 'none'
          }} />

          <div style={{ display: 'grid', gridTemplateColumns: '1.15fr 0.85fr', gap: '3.5rem', alignItems: 'center' }}>
            
            {/* SOL: TANITIM & 3 ADIMLI ÇALIŞMA SİSTEMİ */}
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.6rem', padding: '0.4rem 0.9rem', background: 'rgba(197, 168, 128, 0.1)', border: '1px solid var(--border-gold)', borderRadius: '20px', color: 'var(--accent-gold)', fontSize: '0.74rem', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '1.2rem', fontWeight: 600 }}>
                <Clock size={14} />
                <span>24 SAATTE ÜCRETSİZ ÖN ANALİZ & KEŞİF</span>
              </div>

              <h2 style={{ fontSize: 'clamp(1.8rem, 3.2vw, 2.7rem)', lineHeight: 1.2, color: '#FFFFFF', marginBottom: '1.2rem' }}>
                Arsanızın veya Dairenizin Fotoğrafını İletin, <br />
                <span style={{ color: 'var(--accent-gold)', fontStyle: 'italic', fontFamily: 'var(--font-serif)' }}>
                  Uzman Kadromuzla Analiz Edelim.
                </span>
              </h2>

              <p style={{ color: 'var(--text-secondary)', fontSize: '0.96rem', lineHeight: 1.7, marginBottom: '2.2rem', maxWidth: '580px' }}>
                Boş arsanızın imar durumunu ya da yenilemek istediğiniz daire/villanızın mevcut fotoğraflarını gönderin; inşaat mühendisimiz ve iç mimarlarımız 24 saat içinde potansiyel tasarım ve fizibilite değerlendirmesini çıkarsın.
              </p>

              {/* 3 ADIMLI SÜREÇ KARTLARI */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '1.2rem', marginBottom: '2.4rem' }}>
                <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-subtle)', borderRadius: '4px', padding: '1.2rem 1rem' }}>
                  <div style={{ color: 'var(--accent-gold)', marginBottom: '0.5rem' }}>
                    <Camera size={22} />
                  </div>
                  <strong style={{ display: 'block', fontSize: '0.86rem', color: '#FFF', marginBottom: '0.3rem' }}>
                    1. Fotoğrafı Çekin
                  </strong>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: 1.4, display: 'block' }}>
                    Arsa, oda, cephe veya imar çapı belgesini seçin.
                  </span>
                </div>

                <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-subtle)', borderRadius: '4px', padding: '1.2rem 1rem' }}>
                  <div style={{ color: 'var(--accent-gold)', marginBottom: '0.5rem' }}>
                    <Sparkles size={22} />
                  </div>
                  <strong style={{ display: 'block', fontSize: '0.86rem', color: '#FFF', marginBottom: '0.3rem' }}>
                    2. İhtiyacınızı Belirtin
                  </strong>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: 1.4, display: 'block' }}>
                    Hayal ettiğiniz stili veya metrekareyi kısaca yazın.
                  </span>
                </div>

                <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-subtle)', borderRadius: '4px', padding: '1.2rem 1rem' }}>
                  <div style={{ color: '#25D366', marginBottom: '0.5rem' }}>
                    <CheckCircle2 size={22} />
                  </div>
                  <strong style={{ display: 'block', fontSize: '0.86rem', color: '#FFF', marginBottom: '0.3rem' }}>
                    3. 24 Saatte Rapor
                  </strong>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: 1.4, display: 'block' }}>
                    Mühendis & mimar ekibimiz ön analizi iletsin.
                  </span>
                </div>
              </div>

              {/* BÜYÜK WHATSAPP HIZLI FOTOĞRAF GÖNDERME AKSİYONU */}
              <div>
                <a 
                  href={whatsappFastUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn"
                  style={{
                    background: '#25D366',
                    color: '#FFFFFF',
                    border: 'none',
                    fontWeight: 600,
                    padding: '1rem 1.8rem',
                    fontSize: '0.9rem',
                    boxShadow: '0 8px 24px rgba(37, 211, 102, 0.35)'
                  }}
                >
                  <MessageCircle size={18} />
                  <span>WhatsApp'tan Fotoğraf & Bilgi Gönder</span>
                </a>
              </div>
            </div>

            {/* SAĞ: HIZLI FORM */}
            <div style={{
              background: 'rgba(18, 20, 24, 0.95)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '6px',
              padding: '2.2rem',
              boxShadow: 'var(--shadow-lg)'
            }}>
              <h3 style={{ fontSize: '1.25rem', color: '#FFF', marginBottom: '0.4rem', fontFamily: 'var(--font-serif)' }}>
                Ön Keşif İsteği Bırakın
              </h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '1.5rem', lineHeight: 1.5 }}>
                Bilgilerinizi bırakın, uzmanımız sizi arayıp projenizin detaylarını alsın.
              </p>

              {isSuccess ? (
                <div style={{
                  background: 'rgba(197, 168, 128, 0.1)',
                  border: '1px solid var(--border-gold)',
                  borderRadius: '4px',
                  padding: '1.8rem 1rem',
                  textAlign: 'center'
                }}>
                  <CheckCircle2 size={36} color="var(--accent-gold)" style={{ margin: '0 auto 0.8rem auto' }} />
                  <h4 style={{ color: '#FFF', fontSize: '1.1rem', marginBottom: '0.4rem' }}>Talebiniz Alındı!</h4>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                    24 saat içinde mimarlık ekibimiz sizinle iletişime geçecektir.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>
                      Mülk / Proje Türü
                    </label>
                    <select
                      value={propertyType}
                      onChange={(e) => setPropertyType(e.target.value)}
                      style={{
                        width: '100%',
                        background: '#0D0E11',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: '2px',
                        padding: '0.75rem 0.9rem',
                        color: 'var(--text-primary)',
                        fontSize: '0.88rem',
                        outline: 'none'
                      }}
                    >
                      <option value="Boş Arsa / Villa İnşaatı">Boş Arsa / Villa İnşaatı</option>
                      <option value="Komple Daire Tadilatı">Daire / Rezidans Tadilatı</option>
                      <option value="Peyzaj & Bahçe Düzenlemesi">Peyzaj & Bahçe Düzenlemesi</option>
                      <option value="Kafe / Restoran / Ticari İşletme">Kafe / Restoran / Ticari</option>
                      <option value="Kentsel Dönüşüm & Dış Cephe">Kentsel Dönüşüm & Cephe</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>
                      Adınız Soyadınız *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Örn: Mehmet Bey"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      style={{
                        width: '100%',
                        background: '#0D0E11',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: '2px',
                        padding: '0.75rem 0.9rem',
                        color: 'var(--text-primary)',
                        fontSize: '0.88rem',
                        outline: 'none'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>
                      Telefon Numaranız *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="0532 000 00 00"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      style={{
                        width: '100%',
                        background: '#0D0E11',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: '2px',
                        padding: '0.75rem 0.9rem',
                        color: 'var(--text-primary)',
                        fontSize: '0.88rem',
                        outline: 'none'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>
                      Kısaca Hayaliniz / Notunuz
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Lokasyon veya metrekare belirtebilirsiniz..."
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      style={{
                        width: '100%',
                        background: '#0D0E11',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: '2px',
                        padding: '0.75rem 0.9rem',
                        color: 'var(--text-primary)',
                        fontSize: '0.88rem',
                        outline: 'none',
                        resize: 'none'
                      }}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn btn-primary"
                    style={{ width: '100%', marginTop: '0.4rem' }}
                  >
                    <Send size={15} />
                    <span>{isSubmitting ? 'Gönderiliyor...' : '24 Saatte Ön Analiz Talep Et'}</span>
                  </button>
                </form>
              )}
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
