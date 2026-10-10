import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ProjectsSection from './components/ProjectsSection';
import ServicesSection from './components/ServicesSection';
import PhilosophySection from './components/PhilosophySection';
import ReferencesSection from './components/ReferencesSection';
import TeamSection from './components/TeamSection';
import ContactSection from './components/ContactSection';
import Footer from './components/Footer';
import FloatingContactButtons from './components/FloatingContactButtons';
import AnalysisPage from './components/AnalysisPage';
import ProjectDetailModal from './components/ProjectDetailModal';
import AdminModal from './components/AdminModal';
import { getProjects } from './lib/supabase';
import { 
  getStoredStudioInfo, saveStoredStudioInfo,
  getStoredTeamMembers, saveStoredTeamMembers,
  getStoredReferences, saveStoredReferences,
  getStoredServices, saveStoredServices,
  getStoredProjects, saveStoredProjects,
  resetSiteStore, DEFAULT_SERVICES
} from './data/siteStore';
import { 
  STUDIO_INFO, TEAM_MEMBERS, REFERENCES_DATA, INITIAL_PROJECTS 
} from './data/initialProjects';
import { 
  getSimulationData, saveSimulationData, DEFAULT_SIMULATION_DATA, resetSimulationData 
} from './data/simulationData';

export default function App() {
  const [projects, setProjects] = useState(getStoredProjects);
  const [studioInfo, setStudioInfo] = useState(getStoredStudioInfo);
  const [teamMembers, setTeamMembers] = useState(getStoredTeamMembers);
  const [references, setReferences] = useState(getStoredReferences);
  const [services, setServices] = useState(getStoredServices);
  const [simulationData, setSimulationData] = useState(getSimulationData);

  const [selectedProject, setSelectedProject] = useState(null);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isAnalysisPageOpen, setIsAnalysisPageOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Projeleri Supabase veya Yerel Depodan Yükle
  useEffect(() => {
    async function loadData() {
      try {
        const data = await getProjects();
        if (data && data.length > 0) {
          setProjects(data);
          saveStoredProjects(data);
        }
      } catch (err) {
        console.warn('Veri yükleme:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();

    const checkHashOrQuery = () => {
      const hash = window.location.hash.toLowerCase();
      const search = window.location.search.toLowerCase();
      if (hash.includes('admin') || search.includes('admin') || hash.includes('yonetim')) {
        setIsAdminOpen(true);
      }
      if (hash.includes('analiz') || search.includes('analiz')) {
        setIsAnalysisPageOpen(true);
      }
    };

    checkHashOrQuery();
    window.addEventListener('hashchange', checkHashOrQuery);
    return () => window.removeEventListener('hashchange', checkHashOrQuery);
  }, []);

  // Proje İşlemleri
  const handleProjectAdded = (newProj) => {
    setProjects(prev => {
      const updated = [newProj, ...prev];
      saveStoredProjects(updated);
      return updated;
    });
  };

  const handleProjectUpdated = (updatedProj) => {
    setProjects(prev => {
      const updated = prev.map(p => p.id === updatedProj.id ? updatedProj : p);
      saveStoredProjects(updated);
      return updated;
    });
  };

  const handleProjectDeleted = (id) => {
    setProjects(prev => {
      const updated = prev.filter(p => p.id !== id);
      saveStoredProjects(updated);
      return updated;
    });
  };

  // Stüdyo & İletişim Güncelleme
  const handleStudioUpdated = (newData) => {
    setStudioInfo(newData);
    saveStoredStudioInfo(newData);
  };

  // Ekip Güncelleme
  const handleTeamUpdated = (newData) => {
    setTeamMembers(newData);
    saveStoredTeamMembers(newData);
  };

  // Referanslar Güncelleme
  const handleReferencesUpdated = (newData) => {
    setReferences(newData);
    saveStoredReferences(newData);
  };

  // Hizmetler Güncelleme
  const handleServicesUpdated = (newData) => {
    setServices(newData);
    saveStoredServices(newData);
  };

  // Canlı Simülasyon Güncelleme
  const handleSimulationUpdated = (newData) => {
    setSimulationData(newData);
    saveSimulationData(newData);
  };

  // Tüm Verileri Fabrika Ayarlarına Sıfırlama
  const handleResetAll = () => {
    resetSiteStore();
    resetSimulationData();
    setProjects(INITIAL_PROJECTS);
    setStudioInfo(STUDIO_INFO);
    setTeamMembers(TEAM_MEMBERS);
    setReferences(REFERENCES_DATA);
    setServices(DEFAULT_SERVICES);
    setSimulationData(DEFAULT_SIMULATION_DATA);
  };

  const handleOpenAnalysis = () => {
    setIsAnalysisPageOpen(true);
    window.location.hash = 'on-analiz';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCloseAnalysis = () => {
    setIsAnalysisPageOpen(false);
    if (window.location.hash.includes('analiz')) {
      window.history.pushState(null, '', window.location.pathname);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // AYRI SAYFA: 24 SAATTE ÖN ANALİZ & KEŞİF
  if (isAnalysisPageOpen) {
    return (
      <div className="site-wrapper">
        <AnalysisPage 
          studioInfo={studioInfo}
          onBack={handleCloseAnalysis} 
        />
      </div>
    );
  }

  return (
    <div className="site-wrapper">
      {/* ÜST MENÜ */}
      <Navbar 
        studioInfo={studioInfo}
        onOpenAdmin={() => setIsAdminOpen(true)} 
      />

      {/* HERO VİTRİN */}
      <Hero 
        studioInfo={studioInfo}
        simulationData={simulationData} 
        onOpenAnalysis={handleOpenAnalysis}
      />

      {/* PROJELER & PORTFOLYO */}
      <ProjectsSection 
        projects={projects}
        onSelectProject={(proj) => setSelectedProject(proj)}
      />

      {/* HİZMETLER */}
      <ServicesSection 
        services={services}
      />

      {/* REFERANSLAR & ÇÖZÜM ORTAKLARI */}
      <ReferencesSection 
        references={references}
      />

      {/* UZMAN EKİBİMİZ */}
      <TeamSection 
        teamMembers={teamMembers}
      />

      {/* FELSEFEMİZ & MANİFESTO */}
      <PhilosophySection 
        studioInfo={studioInfo}
      />

      {/* İLETİŞİM & KEŞİF FORMU */}
      <ContactSection 
        studioInfo={studioInfo}
      />

      {/* FOOTER */}
      <Footer 
        studioInfo={studioInfo}
        onOpenAdmin={() => setIsAdminOpen(true)}
      />

      {/* SAĞ ALT SABİT DANIŞMA, WHATSAPP & ARAMA BUTONLARI */}
      <FloatingContactButtons 
        studioInfo={studioInfo}
        onOpenAnalysis={handleOpenAnalysis}
      />

      {/* PROJE DETAY MODALI */}
      {selectedProject && (
        <ProjectDetailModal 
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}

      {/* GELİŞMİŞ YÖNETİM PANELİ MODALI */}
      {isAdminOpen && (
        <AdminModal 
          projects={projects}
          references={references}
          services={services}
          teamMembers={teamMembers}
          studioInfo={studioInfo}
          simulationData={simulationData}
          onProjectAdded={handleProjectAdded}
          onProjectUpdated={handleProjectUpdated}
          onProjectDeleted={handleProjectDeleted}
          onReferencesUpdated={handleReferencesUpdated}
          onServicesUpdated={handleServicesUpdated}
          onTeamUpdated={handleTeamUpdated}
          onStudioUpdated={handleStudioUpdated}
          onSimulationUpdated={handleSimulationUpdated}
          onResetAll={handleResetAll}
          onClose={() => setIsAdminOpen(false)}
        />
      )}
    </div>
  );
}
