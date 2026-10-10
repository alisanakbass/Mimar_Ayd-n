import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { 
  Menu, X, Phone, ArrowRight, MessageCircle, 
  Compass, Hammer, Award, Users, BookOpen, Clock, MapPin 
} from 'lucide-react';
import { STUDIO_INFO } from '../data/initialProjects';

export default function Navbar({ studioInfo, onOpenAdmin }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const info = studioInfo || STUDIO_INFO;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Mobil menü açıkken arka plan kaydırmasını kilitle
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.touchAction = 'none';
    } else {
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
    };
  }, [mobileMenuOpen]);

  const scrollTo = (id) => {
    setMobileMenuOpen(false);
    // Menü kapanış animasyonu ve body overflow açıldıktan sonra pürüzsüz kaydır
    setTimeout(() => {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }, 120);
  };

  const navItems = [
    { id: 'projeler', label: 'Projeler', icon: <Compass size={18} /> },
    { id: 'hizmetler', label: 'Hizmetler', icon: <Hammer size={18} /> },
    { id: 'referanslar', label: 'Referanslar', icon: <Award size={18} /> },
    { id: 'ekibimiz', label: 'Ekibimiz', icon: <Users size={18} /> },
    { id: 'felsefemiz', label: 'Felsefemiz', icon: <BookOpen size={18} /> },
    { id: 'iletisim', label: 'İletişim & Keşif', icon: <Phone size={18} /> },
  ];

  return (
    <>
      <header className={`navbar-header ${isScrolled ? 'scrolled' : ''}`}>
        <div className="container navbar-inner">
          {/* LOGO */}
          <a href="#hero" className="brand-logo" onClick={(e) => { e.preventDefault(); scrollTo('hero'); }}>
            <span className="brand-name">{info.name}</span>
            <span className="brand-sub">{info.subtitle}</span>
          </a>

          {/* MASAÜSTÜ MENÜ LİNKLERİ */}
          <ul className="nav-links desktop-only">
            {navItems.map((item) => (
              <li key={item.id}>
                <button className="nav-link" onClick={() => scrollTo(item.id)}>
                  {item.label}
                </button>
              </li>
            ))}
          </ul>

          {/* SAĞ AKSİYON & MOBİL HAMBURGER BUTONU */}
          <div className="navbar-actions">
            {/* TELEFON CTA (Masaüstü) */}
            <a 
              href={`tel:${info.phoneRaw || info.phone.replace(/[^0-9+]/g, '')}`} 
              className="btn btn-primary navbar-cta-btn"
            >
              <Phone size={14} />
              <span>İletişim</span>
            </a>

            {/* MOBİL HAMBURGER BUTONU (Ergonomik 44px Dokunma Alanı) */}
            <button 
              type="button"
              className="navbar-mobile-toggle"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Menüyü Aç"
              aria-expanded={mobileMenuOpen}
            >
              <Menu size={22} />
            </button>
          </div>
        </div>
      </header>

      {/* MOBİL AÇILIR MENÜ (REACT PORTAL: document.body SEVİYESİNDE RENDER EDİLİR) */}
      {mobileMenuOpen && typeof document !== 'undefined' && createPortal(
        <div 
          className="navbar-mobile-overlay" 
          onClick={() => setMobileMenuOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Mobil Gezinme Menüsü"
        >
          <div 
            className="navbar-mobile-drawer" 
            onClick={(e) => e.stopPropagation()}
          >
            {/* ÇEKMECE ÜST BARI */}
            <div className="navbar-mobile-header">
              <div className="brand-logo" onClick={() => scrollTo('hero')}>
                <span className="brand-name">{info.name}</span>
                <span className="brand-sub">{info.subtitle}</span>
              </div>
              <button 
                className="navbar-mobile-close" 
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Menüyü Kapat"
              >
                <X size={20} />
              </button>
            </div>

            {/* ÇEKMECE LİNKLERİ */}
            <ul className="navbar-mobile-links">
              {navItems.map((item) => (
                <li key={item.id}>
                  <button className="mobile-nav-item" onClick={() => scrollTo(item.id)}>
                    <div className="mobile-nav-item-left">
                      <span className="mobile-nav-icon">{item.icon}</span>
                      <span className="mobile-nav-label">{item.label}</span>
                    </div>
                    <ArrowRight size={16} className="mobile-nav-arrow" />
                  </button>
                </li>
              ))}
            </ul>

            {/* ÇEKMECE ALT İLETİŞİM ALANI */}
            <div className="navbar-mobile-footer">
              <a 
                href={info.whatsappDirectUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mobile-cta-wa"
              >
                <MessageCircle size={18} />
                <span>WhatsApp'tan Yazın</span>
              </a>

              <a 
                href={`tel:${info.phoneRaw || info.phone.replace(/[^0-9+]/g, '')}`} 
                className="mobile-cta-call"
              >
                <Phone size={18} />
                <span>Hemen Arayın: {info.phone}</span>
              </a>

              <div className="mobile-drawer-info">
                <div className="mobile-info-item">
                  <Clock size={13} />
                  <span>{info.workingHours}</span>
                </div>
                <div className="mobile-info-item">
                  <MapPin size={13} />
                  <span>{info.address?.split('—')[0] || info.address}</span>
                </div>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
