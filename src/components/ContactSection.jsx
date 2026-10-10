import React, { useState } from 'react';
import { Send, Phone, Mail, MapPin, MessageCircle, Clock, CheckCircle } from 'lucide-react';
import { STUDIO_INFO } from '../data/initialProjects';
import { sendInquiry } from '../lib/supabase';

export default function ContactSection({ studioInfo }) {
  const info = studioInfo || STUDIO_INFO;
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    project_type: 'Villa & Konut',
    approx_area: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await sendInquiry(formData);
      setIsSuccess(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        project_type: 'Villa & Konut',
        approx_area: '',
        message: ''
      });
      setTimeout(() => setIsSuccess(false), 6000);
    } catch (err) {
      console.error(err);
      alert('Mesaj gönderilirken bir sorun oluştu. Lütfen telefon veya WhatsApp üzerinden ulaşınız.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="iletisim" className="section-pad" style={{ background: 'var(--bg-secondary)' }}>
      <div className="container">
        <div className="section-head">
          <div>
            <div className="section-subtitle">BİRLİKTE TASARLAYALIM</div>
            <h2 className="section-title">İletişim & Proje Keşif Talebi</h2>
          </div>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '460px', fontSize: '0.95rem', lineHeight: 1.7 }}>
            Hayalinizdeki konut veya yatırım projenizi paylaşın; arazi analizinden konsept tasarıma kadar ilk adımı birlikte atalım.
          </p>
        </div>

        <div className="contact-layout-grid">
          
          {/* SOL: FORMA ALANI */}
          <div className="contact-form-card">
            <h3 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', color: 'var(--text-primary)' }}>
              Proje Detaylarınızı Paylaşın
            </h3>

            {isSuccess ? (
              <div style={{ 
                background: 'rgba(197, 168, 128, 0.12)', 
                border: '1px solid var(--border-gold)', 
                padding: '2rem', 
                borderRadius: '4px',
                textAlign: 'center'
              }}>
                <CheckCircle size={40} color="var(--accent-gold)" style={{ margin: '0 auto 1rem auto' }} />
                <h4 style={{ fontSize: '1.3rem', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                  Talebiniz Başarıyla Alındı
                </h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: 1.6 }}>
                  Proje detaylarınızı inceleyip en kısa sürede randevu ve ön görüşme için sizinle iletişime geçeceğiz.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.3rem' }}>
                <div className="contact-form-row">
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
                      Adınız Soyadınız *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Örn: Ahmet Yılmaz"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      style={{
                        width: '100%',
                        background: '#121418',
                        border: '1px solid var(--border-subtle)',
                        padding: '0.8rem 1rem',
                        color: 'var(--text-primary)',
                        borderRadius: '2px',
                        outline: 'none',
                        fontSize: '0.9rem'
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
                        background: '#121418',
                        border: '1px solid var(--border-subtle)',
                        padding: '0.8rem 1rem',
                        color: 'var(--text-primary)',
                        borderRadius: '2px',
                        outline: 'none',
                        fontSize: '0.9rem'
                      }}
                    />
                  </div>
                </div>

                <div className="contact-form-row">
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
                      E-posta Adresiniz
                    </label>
                    <input
                      type="email"
                      placeholder="ornek@alanadi.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      style={{
                        width: '100%',
                        background: '#121418',
                        border: '1px solid var(--border-subtle)',
                        padding: '0.8rem 1rem',
                        color: 'var(--text-primary)',
                        borderRadius: '2px',
                        outline: 'none',
                        fontSize: '0.9rem'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
                      Proje Tipolojisi
                    </label>
                    <select
                      value={formData.project_type}
                      onChange={(e) => setFormData({ ...formData, project_type: e.target.value })}
                      style={{
                        width: '100%',
                        background: '#121418',
                        border: '1px solid var(--border-subtle)',
                        padding: '0.8rem 1rem',
                        color: 'var(--text-primary)',
                        borderRadius: '2px',
                        outline: 'none',
                        fontSize: '0.9rem',
                        cursor: 'pointer'
                      }}
                    >
                      <option value="Peyzaj & Bahçe">Peyzaj & Bahçe Düzenleme / Sulama</option>
                      <option value="Mimari & İnşaat">Müteahhitlik & Anahtar Teslim İnşaat</option>
                      <option value="İç Mimarlık & Dekorasyon">İç Mimarlık & Ev / Ofis Dekorasyonu</option>
                      <option value="Villa & Konut">Villa Projesi & Kış Bahçesi</option>
                      <option value="Tadilat & Yenileme">Komple Tadilat & Yenileme</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
                    Tahmini Alan (m²) / Lokasyon
                  </label>
                  <input
                    type="text"
                    placeholder="Örn: 650 m² Bodrum Yalıkavak"
                    value={formData.approx_area}
                    onChange={(e) => setFormData({ ...formData, approx_area: e.target.value })}
                    style={{
                      width: '100%',
                      background: '#121418',
                      border: '1px solid var(--border-subtle)',
                      padding: '0.8rem 1rem',
                      color: 'var(--text-primary)',
                      borderRadius: '2px',
                      outline: 'none',
                      fontSize: '0.9rem'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
                    Proje Özeti & Beklentileriniz *
                  </label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Arsanızın durumu, proje takviminiz veya düşündüğünüz mimari stil hakkında kısaca bahsedebilirsiniz..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    style={{
                      width: '100%',
                      background: '#121418',
                      border: '1px solid var(--border-subtle)',
                      padding: '0.8rem 1rem',
                      color: 'var(--text-primary)',
                      borderRadius: '2px',
                      outline: 'none',
                      fontSize: '0.9rem',
                      resize: 'vertical'
                    }}
                  ></textarea>
                </div>

                <button 
                  type="submit" 
                  disabled={isSubmitting} 
                  className="btn btn-primary"
                  style={{ width: '100%', marginTop: '0.5rem' }}
                >
                  <Send size={16} />
                  <span>{isSubmitting ? 'Gönderiliyor...' : 'Teklif & Keşif Talebini Gönder'}</span>
                </button>
              </form>
            )}
          </div>

          {/* SAĞ: OFİS BİLGİLERİ & WHATSAPP */}
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '1.8rem', color: 'var(--text-primary)' }}>
                Ofis & İletişim Bilgileri
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.8rem' }}>
                <div style={{ display: 'flex', gap: '1.2rem', alignItems: 'flex-start' }}>
                  <div style={{ width: '44px', height: '44px', borderRadius: '2px', background: 'rgba(197, 168, 128, 0.1)', border: '1px solid var(--border-gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-gold)', flexShrink: 0 }}>
                    <MapPin size={20} />
                  </div>
                  <div>
                    <span style={{ fontSize: '0.78rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-muted)', display: 'block', marginBottom: '0.3rem' }}>
                      Adres
                    </span>
                    <p style={{ color: 'var(--text-primary)', fontSize: '0.95rem', lineHeight: 1.6 }}>
                      {info.address}
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '1.2rem', alignItems: 'flex-start' }}>
                  <div style={{ width: '44px', height: '44px', borderRadius: '2px', background: 'rgba(197, 168, 128, 0.1)', border: '1px solid var(--border-gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-gold)', flexShrink: 0 }}>
                    <Phone size={20} />
                  </div>
                  <div>
                    <span style={{ fontSize: '0.78rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-muted)', display: 'block', marginBottom: '0.3rem' }}>
                      Telefon
                    </span>
                    <p style={{ color: 'var(--text-primary)', fontSize: '0.95rem' }}>
                      {info.phone}
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '1.2rem', alignItems: 'flex-start' }}>
                  <div style={{ width: '44px', height: '44px', borderRadius: '2px', background: 'rgba(197, 168, 128, 0.1)', border: '1px solid var(--border-gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-gold)', flexShrink: 0 }}>
                    <Mail size={20} />
                  </div>
                  <div>
                    <span style={{ fontSize: '0.78rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-muted)', display: 'block', marginBottom: '0.3rem' }}>
                      E-Posta
                    </span>
                    <p style={{ color: 'var(--text-primary)', fontSize: '0.95rem' }}>
                      {info.email}
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '1.2rem', alignItems: 'flex-start' }}>
                  <div style={{ width: '44px', height: '44px', borderRadius: '2px', background: 'rgba(197, 168, 128, 0.1)', border: '1px solid var(--border-gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-gold)', flexShrink: 0 }}>
                    <Clock size={20} />
                  </div>
                  <div>
                    <span style={{ fontSize: '0.78rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-muted)', display: 'block', marginBottom: '0.3rem' }}>
                      Çalışma Saatleri
                    </span>
                    <p style={{ color: 'var(--text-primary)', fontSize: '0.95rem' }}>
                      {info.workingHours}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* HIZLI WHATSAPP KARTI */}
            <div style={{ 
              background: 'linear-gradient(135deg, rgba(37, 211, 102, 0.1) 0%, rgba(18, 20, 24, 0.9) 100%)', 
              border: '1px solid rgba(37, 211, 102, 0.25)', 
              padding: '1.8rem', 
              borderRadius: '4px',
              marginTop: '2rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '0.8rem' }}>
                <MessageCircle size={24} color="#25D366" />
                <h4 style={{ fontSize: '1.1rem', color: '#FFFFFF' }}>Hızlı WhatsApp Danışma Hattı</h4>
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginBottom: '1.2rem', lineHeight: 1.5 }}>
                Projenizle ilgili görselleri veya arazinizin imar durumunu doğrudan mimarımıza iletebilirsiniz.
              </p>
              <a 
                href={info.whatsappDirectUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline"
                style={{ width: '100%', borderColor: '#25D366', color: '#25D366' }}
              >
                <span>WhatsApp ile Doğrudan Yazın</span>
              </a>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
