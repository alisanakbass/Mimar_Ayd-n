import React, { useState } from 'react';
import { MapPin, Calendar, Maximize2, ArrowUpRight } from 'lucide-react';

const CATEGORIES = [
  'Tümü',
  'İç Mimarlık & Dekorasyon',
  'Mimari & İnşaat',
  'Peyzaj & Bahçe'
];

export default function ProjectsSection({ projects, onSelectProject }) {
  const [activeCategory, setActiveCategory] = useState('Tümü');

  const filteredProjects = activeCategory === 'Tümü'
    ? projects
    : projects.filter(p => p.category === activeCategory);

  return (
    <section id="projeler" className="section-pad">
      <div className="container">
        {/* BAŞLIK VE AÇIKLAMA */}
        <div className="section-head">
          <div>
            <div className="section-subtitle">SEÇKİN PORTFOLYO</div>
            <h2 className="section-title">İmzamızı Taşıyan Projeler</h2>
          </div>
        </div>

        {/* FİLTRE ÇUBUĞU */}
        <div className="filter-bar">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              className={`filter-btn ${activeCategory === cat ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* PROJE KARTLARI */}
        <div className="projects-grid">
          {filteredProjects.map((project) => (
            <article 
              key={project.id} 
              className="project-card"
              onClick={() => onSelectProject(project)}
            >
              <div className="project-card-image-wrap">
                <img 
                  src={project.cover_image} 
                  alt={project.title} 
                  className="project-card-image"
                  loading="lazy" 
                  decoding="async"
                />
                <span className="project-card-badge">{project.category}</span>
              </div>

              <div className="project-card-body">
                <div className="project-card-meta">
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <MapPin size={13} color="var(--accent-gold)" />
                    {project.location}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <Calendar size={13} />
                    {project.year}
                  </span>
                  <span>{project.area}</span>
                </div>

                <h3 className="project-card-title">{project.title}</h3>
                <p className="project-card-tagline">{project.tagline || project.description?.slice(0, 90) + '...'}</p>

                <div className="project-card-footer">
                  <span>Detayları ve Paftaları İncele</span>
                  <ArrowUpRight size={16} />
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
