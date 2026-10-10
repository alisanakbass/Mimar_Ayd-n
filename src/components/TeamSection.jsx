import React from 'react';
import { HardHat, Compass, Palette, ShieldCheck } from 'lucide-react';
import { TEAM_MEMBERS } from '../data/initialProjects';

export default function TeamSection({ teamMembers }) {
  const list = teamMembers && teamMembers.length > 0 ? teamMembers : TEAM_MEMBERS;

  const getIcon = (role = '') => {
    if (role.includes('Mühendis')) return <HardHat size={22} />;
    if (role.includes('İç Mimar')) return <Palette size={22} />;
    if (role.includes('Tasarım')) return <Compass size={22} />;
    return <ShieldCheck size={22} />;
  };

  return (
    <section id="ekibimiz" className="section-pad" style={{ background: 'var(--bg-primary)' }}>
      <div className="container">
        <div className="section-head">
          <div>
            <div className="section-subtitle">GÜÇLÜ KADRO & MİMARİ VİZYON</div>
            <h2 className="section-title">Uzman Ekibimiz</h2>
          </div>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '480px', fontSize: '0.95rem', lineHeight: 1.7 }}>
            2019'dan bu yana projenizin her aşamasında mimarlık, mühendislik ve disiplinli saha tecrübesini bir araya getiriyoruz.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '2rem'
        }}>
          {list.map((member, idx) => (
            <div 
              key={idx} 
              style={{
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '4px',
                padding: '2.2rem 1.8rem',
                display: 'flex',
                flexDirection: 'column',
                transition: 'all var(--transition-smooth)',
                position: 'relative'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--border-gold)';
                e.currentTarget.style.transform = 'translateY(-6px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--border-subtle)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '2px',
                background: 'rgba(197, 168, 128, 0.1)',
                border: '1px solid var(--border-gold)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--accent-gold)',
                marginBottom: '1.4rem'
              }}>
                {getIcon(member.role)}
              </div>

              <span style={{ 
                fontSize: '0.74rem', 
                letterSpacing: '0.12em', 
                textTransform: 'uppercase', 
                color: 'var(--accent-gold)', 
                marginBottom: '0.4rem',
                fontWeight: 600
              }}>
                {member.role}
              </span>

              <h3 style={{ 
                fontSize: '1.4rem', 
                color: 'var(--text-primary)', 
                marginBottom: '0.3rem',
                fontFamily: 'var(--font-serif)'
              }}>
                {member.name}
              </h3>

              <div style={{
                fontSize: '0.8rem',
                color: 'var(--text-muted)',
                marginBottom: '1rem',
                fontWeight: 500
              }}>
                {member.specialty}
              </div>

              <p style={{ 
                color: 'var(--text-secondary)', 
                fontSize: '0.88rem', 
                lineHeight: 1.6, 
                marginTop: 'auto' 
              }}>
                {member.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
