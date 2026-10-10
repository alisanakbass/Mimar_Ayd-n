import React, { useState } from 'react';
import { ArrowLeft, Camera, Clock, CheckCircle2, MessageCircle, Shield, Sparkles, Send, MapPin, Building, HelpCircle } from 'lucide-react';
import { STUDIO_INFO } from '../data/initialProjects';
import { sendInquiry } from '../lib/supabase';

export default function AnalysisPage({ studioInfo, onBack }) {
  const info = studioInfo || STUDIO_INFO;
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    propertyType: 'Boş Arsa / Villa İnşaatı',
    area: '',
    location: '',
    note: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await sendInquiry({
        name: formData.name,
        phone: formData.phone,
        project_type: formData.propertyType,
        approx_area: formData.area,
        message: `[24 SAATTE ÖN ANALİZ FORMU]\nLokasyon: ${formData.location || 'Belirtilmedi'}\nAlan: ${formData.area || 'Belirtilmedi'}\nNot: ${formData.note || 'Ön analiz talebi'}`
      });
      setIsSuccess(true);
      setFormData({
        name: '',
        phone: '',
        propertyType: 'Boş Arsa / Villa İnşaatı',
        area: '',
        location: '',
        note: ''
      });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.error(err);
      alert('Talebiniz kaydedilirken bir hata oluştu. Lütfen doğrudan WhatsApp üzerinden ulaşınız.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const whatsappFastUrl = `https://wa.me/${info.phoneRaw}?text=Merhaba%20G%C3%BCnerler%20Mimarl%C4%B1k,%20arsam%C4%B1n%20/%20dairemin%20foto%C4%9Fraf%C4%B1n%C4%B1%20g%C3%B6ndererek%2024%20saatte%20%C3%BCcretsiz%20mimari%20%C3%B6n%20analiz%20almak%20istiyorum.`;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', color: 'var(--text-primary)', paddingBottom: '4rem' }}>
      
      {/* ÜST GEZİNME ÇUBUĞU */}
      <header className="analysis-header-sticky">
        <div className="container analysis-header-inner">
          <button
            onClick={onBack}
            className="btn btn-outline analysis-back-btn"
            aria-label="Ana Sayfaya Dön"
          >
            <ArrowLeft size={16} />
            <span>Ana Sayfa</span>
          </button>

          <div className="analysis-header-brand">
            <span className="brand-name">{info.name}</span>
            <span className="brand-sub">Ön Analiz & Keşif</span>
          </div>

          <a
            href={whatsappFastUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="analysis-header-wa-btn"
            aria-label="WhatsApp İle İletişim"
          >
            <MessageCircle size={18} />
            <span className="wa-btn-label">WhatsApp</span>
          </a>
        </div>
      </header>

      {/* SAYFA İÇERİĞİ */}
      <main className="container analysis-main-container">
        
        {/* BAŞLIK & VİZYON */}
        <div style={{ textAlign: 'center', maxWidth: '780px', margin: '0 auto 3rem auto' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '0.45rem 1.1rem',
            background: 'rgba(197, 168, 128, 0.1)',
            border: '1px solid var(--border-gold)',
            borderRadius: '50px',
            color: 'var(--accent-gold)',
            fontSize: '0.74rem',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            fontWeight: 600,
            marginBottom: '1.2rem'
          }}>
            <Clock size={14} />
            <span>24 Saatte Hızlı & Ücretsiz İnceleme</span>
          </div>

          <h1 style={{ fontSize: 'clamp(1.75rem, 5vw, 3.2rem)', lineHeight: 1.18, color: '#FFFFFF', marginBottom: '1.1rem' }}>
            24 Saatte Ücretsiz Mimari <br />
            <span style={{ color: 'var(--accent-gold)', fontStyle: 'italic', fontFamily: 'var(--font-serif)' }}>
              Ön Analiz & Keşif Hizmeti
            </span>
          </h1>

          <p style={{ color: 'var(--text-secondary)', fontSize: 'clamp(0.92rem, 1.8vw, 1.05rem)', lineHeight: 1.7, maxWidth: '640px', margin: '0 auto' }}>
            Arsanızın imar çapını, parsel bilgilerini veya mekanınızın fotoğraflarını iletin. 
            İnşaat mühendisimiz ve iç mimarlarımız 24 saat içinde potansiyel ve fizibilite analizini çıkarsın.
          </p>
        </div>

        {/* 3 ADIMDA ÇALIŞMA SİSTEMİ */}
        <div className="analysis-steps-grid">
          <div className="analysis-step-card">
            <div style={{ width: '44px', height: '44px', borderRadius: '4px', background: 'rgba(197, 168, 128, 0.1)', border: '1px solid var(--border-gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-gold)', marginBottom: '1.2rem' }}>
              <Camera size={22} />
            </div>
            <h3 style={{ fontSize: '1.15rem', color: '#FFF', marginBottom: '0.5rem' }}>1. Fotoğraf veya İmar Belgesi</h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              Arsanızın konumunu, parsel numarasını ya da mekanınızın birkaç fotoğrafını iletin.
            </p>
          </div>

          <div className="analysis-step-card">
            <div style={{ width: '44px', height: '44px', borderRadius: '4px', background: 'rgba(197, 168, 128, 0.1)', border: '1px solid var(--border-gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-gold)', marginBottom: '1.2rem' }}>
              <Sparkles size={22} />
            </div>
            <h3 style={{ fontSize: '1.15rem', color: '#FFF', marginBottom: '0.5rem' }}>2. Hayal & İhtiyaç Belirtin</h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              Aklınızdaki mimari stili, kullanım amacını ve bütçe aralığınızı paylaşın.
            </p>
          </div>

          <div className="analysis-step-card">
            <div style={{ width: '44px', height: '44px', borderRadius: '4px', background: 'rgba(37, 211, 102, 0.1)', border: '1px solid rgba(37, 211, 102, 0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#25D366', marginBottom: '1.2rem' }}>
              <CheckCircle2 size={22} />
            </div>
            <h3 style={{ fontSize: '1.15rem', color: '#FFF', marginBottom: '0.5rem' }}>3. 24 Saatte Uzman Raporu</h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              Statik, mimari ve maliyet çerçevesinde ön değerlendirme raporu cebinize gelsin.
            </p>
          </div>
        </div>

        {/* İKİ SEÇENEKLİ BAŞVURU ALANI */}
        <div className="analysis-layout-grid">
          
          {/* SOL: FORM */}
          <div className="analysis-form-card">
            <h2 style={{ fontSize: '1.5rem', color: '#FFF', marginBottom: '0.5rem' }}>
              Ön Analiz Talep Formu
            </h2>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '2rem' }}>
              Formu doldurduktan sonra mimarlarımız doğrudan sizinle iletişime geçecektir.
            </p>

            {isSuccess ? (
              <div style={{
                background: 'rgba(197, 168, 128, 0.12)',
                border: '1px solid var(--border-gold)',
                borderRadius: '4px',
                padding: '2.5rem 1.5rem',
                textAlign: 'center'
              }}>
                <CheckCircle2 size={44} color="var(--accent-gold)" style={{ margin: '0 auto 1rem auto' }} />
                <h3 style={{ color: '#FFF', fontSize: '1.3rem', marginBottom: '0.6rem' }}>Ön Analiz Talebiniz Alındı!</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: 1.6 }}>
                  Mimar ve mühendis kadromuz bilgilerinizi inceleyip 24 saat içinde sizinle iletişime geçecektir.
                </p>
                <button
                  onClick={() => setIsSuccess(false)}
                  className="btn btn-outline"
                  style={{ marginTop: '1.5rem', padding: '0.6rem 1.4rem', fontSize: '0.8rem' }}
                >
                  Yeni Form Doldur
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                <div className="analysis-form-row">
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
                      Adınız Soyadınız *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Örn: Serdar Bey"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      style={{
                        width: '100%',
                        background: '#0D0E11',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: '2px',
                        padding: '0.85rem 1rem',
                        color: 'var(--text-primary)',
                        fontSize: '0.9rem',
                        outline: 'none'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
                      Telefon Numaranız *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="0532 000 00 00"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      style={{
                        width: '100%',
                        background: '#0D0E11',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: '2px',
                        padding: '0.85rem 1rem',
                        color: 'var(--text-primary)',
                        fontSize: '0.9rem',
                        outline: 'none'
                      }}
                    />
                  </div>
                </div>

                <div className="analysis-form-row">
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
                      Mülk / Proje Türü
                    </label>
                    <select
                      value={formData.propertyType}
                      onChange={(e) => setFormData({ ...formData, propertyType: e.target.value })}
                      style={{
                        width: '100%',
                        background: '#0D0E11',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: '2px',
                        padding: '0.85rem 1rem',
                        color: 'var(--text-primary)',
                        fontSize: '0.9rem',
                        outline: 'none'
                      }}
                    >
                      <option value="Boş Arsa / Villa İnşaatı">Boş Arsa / Sıfırdan Villa</option>
                      <option value="Komple Daire / Rezidans Tadilatı">Daire Tadilatı & Yenileme</option>
                      <option value="Peyzaj & Bahçe Düzenlemesi">Peyzaj & Bahçe Düzenleme</option>
                      <option value="Kafe / Restoran / Ticari İşletme">Kafe / Restoran / Ticari</option>
                      <option value="Kentsel Dönüşüm & Dış Cephe">Kentsel Dönüşüm & Cephe</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
                      Tahmini Alan (m²)
                    </label>
                    <input
                      type="text"
                      placeholder="Örn: 450 m²"
                      value={formData.area}
                      onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                      style={{
                        width: '100%',
                        background: '#0D0E11',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: '2px',
                        padding: '0.85rem 1rem',
                        color: 'var(--text-primary)',
                        fontSize: '0.9rem',
                        outline: 'none'
                      }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
                    Lokasyon / İlçe
                  </label>
                  <input
                    type="text"
                    placeholder="Örn: İstanbul, Antalya Kemer, Kaş veya Muğla"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    style={{
                      width: '100%',
                      background: '#0D0E11',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: '2px',
                      padding: '0.85rem 1rem',
                      color: 'var(--text-primary)',
                      fontSize: '0.9rem',
                      outline: 'none'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
                    Proje Hayaliniz veya Notlarınız
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Düşündüğünüz mimari stil, teslim zamanı veya mevcut durum hakkında kısa not bırakabilirsiniz..."
                    value={formData.note}
                    onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                    style={{
                      width: '100%',
                      background: '#0D0E11',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: '2px',
                      padding: '0.85rem 1rem',
                      color: 'var(--text-primary)',
                      fontSize: '0.9rem',
                      outline: 'none',
                      resize: 'vertical'
                    }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn btn-primary analysis-submit-btn"
                >
                  <Send size={16} />
                  <span>{isSubmitting ? 'Gönderiliyor...' : '24 Saatte Ön Analiz Raporu Talep Et'}</span>
                </button>
              </form>
            )}
          </div>

          {/* SAĞ: WHATSAPP DOĞRUDAN İLETİŞİM & GÜVENİLİRLİK */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            
            {/* WHATSAPP KARTI */}
            <div className="analysis-wa-card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1.2rem' }}>
                <div style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '50%',
                  background: '#25D366',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FFF',
                  flexShrink: 0
                }}>
                  <MessageCircle size={26} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.2rem', color: '#FFF' }}>WhatsApp İle Anında Gönder</h3>
                  <span style={{ fontSize: '0.78rem', color: '#25D366' }}>Doğrudan Mimar Hattı</span>
                </div>
              </div>

              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '1.8rem' }}>
                Form doldurmakla vakit kaybetmek istemiyorsanız; arsanızın imar belgesini ya da mekanınızın fotoğraflarını doğrudan WhatsApp üzerinden mimarımıza iletebilirsiniz.
              </p>

              <a
                href={whatsappFastUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="analysis-wa-action-btn"
              >
                <MessageCircle size={18} />
                <span>WhatsApp ile Belge & Fotoğraf Gönder</span>
              </a>
            </div>

            {/* GÜVENCELERİMİZ */}
            <div className="analysis-guarantees-card">
              <h4 style={{ fontSize: '1rem', color: 'var(--accent-gold)', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '1.2rem' }}>
                Ön Analiz Güvencelerimiz
              </h4>

              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <li style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                  <Shield size={18} color="var(--accent-gold)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <strong style={{ fontSize: '0.88rem', color: '#FFF', display: 'block' }}>%100 Ücretsiz & Taahhütsüz</strong>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Ön analiz süreci için hiçbir ücret veya bağlayıcılık talep edilmez.</span>
                  </div>
                </li>

                <li style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                  <Clock size={18} color="var(--accent-gold)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <strong style={{ fontSize: '0.88rem', color: '#FFF', display: 'block' }}>24 Saat İçinde Dönüş</strong>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Talebiniz mesai saatleri içinde aynı gün incelemeye alınır.</span>
                  </div>
                </li>

                <li style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                  <CheckCircle2 size={18} color="var(--accent-gold)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <strong style={{ fontSize: '0.88rem', color: '#FFF', display: 'block' }}>Mühendis & Mimar Ekibi İnceler</strong>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Otomatik sistemler değil, bizzat inşaat mühendisimiz ve iç mimarımız bakar.</span>
                  </div>
                </li>
              </ul>
            </div>

          </div>
        </div>

      </main>
    </div>
  );
}
