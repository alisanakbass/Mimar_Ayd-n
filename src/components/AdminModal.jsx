import React, { useState, useRef } from 'react';
import { 
  X, Plus, Trash2, Check, AlertCircle, Edit3, Lock, LogOut, KeyRound, 
  Eye, EyeOff, Building, Users, Award, Wrench, Phone, Cpu, Image as ImageIcon,
  RotateCcw, Save, Search, ExternalLink, PlusCircle
} from 'lucide-react';
import { isSupabaseConfigured, addProject, removeProject, updateProject, uploadProjectImage } from '../lib/supabase';
import { DEFAULT_SIMULATION_DATA } from '../data/simulationData';

const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || 'gunerler2024';

export default function AdminModal({ 
  projects = [], 
  references = [], 
  services = [], 
  teamMembers = [], 
  studioInfo = {}, 
  simulationData,
  onProjectAdded, 
  onProjectUpdated, 
  onProjectDeleted,
  onReferencesUpdated,
  onServicesUpdated,
  onTeamUpdated,
  onStudioUpdated,
  onSimulationUpdated,
  onResetAll,
  onClose 
}) {
  // GÜVENLİK / OTURUM YÖNETİMİ
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem('gunerler_admin_logged_in') === 'true';
  });
  const [inputPassword, setInputPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState('');

  // SEKMELER: 'projects' | 'references' | 'services' | 'team' | 'studio' | 'simulation'
  const [activeTab, setActiveTab] = useState('projects');
  const [toastMsg, setToastMsg] = useState('');

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 4000);
  };

  // ŞİFRE KONTROLÜ
  const handleLogin = (e) => {
    e.preventDefault();
    if (inputPassword.trim() === ADMIN_PASSWORD) {
      sessionStorage.setItem('gunerler_admin_logged_in', 'true');
      setIsAuthenticated(true);
      setAuthError('');
      setInputPassword('');
    } else {
      setAuthError('Hatalı yönetici parolası! Lütfen tekrar deneyiniz.');
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('gunerler_admin_logged_in');
    setIsAuthenticated(false);
    onClose();
  };

  /* ==============================================================================
     1. PROJELER YÖNETİMİ
     ============================================================================== */
  const [projectSearch, setProjectSearch] = useState('');
  const [editingProjectId, setEditingProjectId] = useState(null);
  const [projectForm, setProjectForm] = useState({
    title: '',
    category: 'Mimari & İnşaat',
    location: '',
    year: new Date().getFullYear().toString(),
    area: '',
    tagline: '',
    description: '',
    cover_image: '',
    imagesText: ''
  });
  const [projectLoading, setProjectLoading] = useState(false);
  const projectFormRef = useRef(null);

  const handleStartEditProject = (p) => {
    setEditingProjectId(p.id);
    const imgs = p.images && p.images.length > 0 ? p.images : [p.cover_image];
    setProjectForm({
      title: p.title || '',
      category: p.category || 'Mimari & İnşaat',
      location: p.location || '',
      year: p.year || new Date().getFullYear().toString(),
      area: p.area || '',
      tagline: p.tagline || '',
      description: p.description || '',
      cover_image: p.cover_image || '',
      imagesText: imgs.filter(Boolean).join('\n')
    });
    if (projectFormRef.current) {
      projectFormRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleCancelEditProject = () => {
    setEditingProjectId(null);
    setProjectForm({
      title: '',
      category: 'Mimari & İnşaat',
      location: '',
      year: new Date().getFullYear().toString(),
      area: '',
      tagline: '',
      description: '',
      cover_image: '',
      imagesText: ''
    });
  };

  const handleSaveProject = async (e) => {
    e.preventDefault();
    setProjectLoading(true);

    const imagesArray = projectForm.imagesText
      .split('\n')
      .map(s => s.trim())
      .filter(Boolean);

    const cover = projectForm.cover_image.trim() || imagesArray[0] || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80';

    const projectData = {
      title: projectForm.title,
      category: projectForm.category,
      location: projectForm.location,
      year: projectForm.year,
      area: projectForm.area.includes('m²') ? projectForm.area : `${projectForm.area} m²`,
      tagline: projectForm.tagline,
      description: projectForm.description,
      cover_image: cover,
      images: imagesArray.length > 0 ? imagesArray : [cover],
      features: [
        "Yüksek mühendislik standartları",
        "Anahtar teslim mimari uygulama"
      ]
    };

    try {
      if (editingProjectId) {
        if (isSupabaseConfigured()) {
          await updateProject(editingProjectId, projectData);
        }
        onProjectUpdated({ ...projectData, id: editingProjectId });
        showToast('Proje başarıyla güncellendi!');
      } else {
        let created;
        if (isSupabaseConfigured()) {
          created = await addProject(projectData);
        } else {
          created = { ...projectData, id: `proj-${Date.now()}` };
        }
        onProjectAdded(created);
        showToast('Yeni proje başarıyla eklendi!');
      }
      handleCancelEditProject();
    } catch (err) {
      console.error(err);
      alert('Proje kaydedilirken hata oluştu.');
    } finally {
      setProjectLoading(false);
    }
  };

  const handleDeleteProject = async (id, title) => {
    if (!window.confirm(`"${title}" projesini silmek istediğinize emin misiniz?`)) return;
    try {
      if (isSupabaseConfigured()) {
        await removeProject(id);
      }
      onProjectDeleted(id);
      showToast('Proje silindi.');
    } catch (err) {
      console.error(err);
      alert('Proje silinemedi.');
    }
  };

  /* ==============================================================================
     2. REFERANSLAR YÖNETİMİ
     ============================================================================== */
  const [refList, setRefList] = useState(references);
  const [editingRefIdx, setEditingRefIdx] = useState(null);
  const [refForm, setRefForm] = useState({ name: '', category: '', logo: '' });

  const handleSaveReference = (e) => {
    e.preventDefault();
    let updated;
    if (editingRefIdx !== null) {
      updated = refList.map((item, idx) => idx === editingRefIdx ? { ...refForm } : item);
      setEditingRefIdx(null);
      showToast('Referans firma güncellendi!');
    } else {
      updated = [{ ...refForm }, ...refList];
      showToast('Yeni referans firma eklendi!');
    }
    setRefList(updated);
    onReferencesUpdated(updated);
    setRefForm({ name: '', category: '', logo: '' });
  };

  const handleDeleteRef = (idx) => {
    if (!window.confirm('Bu referans firmayı silmek istediğinize emin misiniz?')) return;
    const updated = refList.filter((_, i) => i !== idx);
    setRefList(updated);
    onReferencesUpdated(updated);
    showToast('Referans silindi.');
  };

  /* ==============================================================================
     3. HİZMETLER YÖNETİMİ
     ============================================================================== */
  const [srvList, setSrvList] = useState(services);
  const [editingSrvIdx, setEditingSrvIdx] = useState(null);
  const [srvForm, setSrvForm] = useState({
    num: '01',
    iconKey: 'Compass',
    title: '',
    description: ''
  });

  const handleSaveService = (e) => {
    e.preventDefault();
    let updated;
    if (editingSrvIdx !== null) {
      updated = srvList.map((s, idx) => idx === editingSrvIdx ? { ...s, ...srvForm } : s);
      setEditingSrvIdx(null);
      showToast('Hizmet güncellendi!');
    } else {
      updated = [...srvList, { ...srvForm, id: `srv-${Date.now()}` }];
      showToast('Yeni hizmet eklendi!');
    }
    setSrvList(updated);
    onServicesUpdated(updated);
    setSrvForm({ num: '01', iconKey: 'Compass', title: '', description: '' });
  };

  const handleDeleteSrv = (idx) => {
    if (!window.confirm('Bu hizmeti silmek istediğinize emin misiniz?')) return;
    const updated = srvList.filter((_, i) => i !== idx);
    setSrvList(updated);
    onServicesUpdated(updated);
    showToast('Hizmet silindi.');
  };

  /* ==============================================================================
     4. EKİP YÖNETİMİ
     ============================================================================== */
  const [teamList, setTeamList] = useState(teamMembers);
  const [editingTeamIdx, setEditingTeamIdx] = useState(null);
  const [teamForm, setTeamForm] = useState({
    name: '',
    role: '',
    specialty: '',
    description: ''
  });

  const handleSaveTeam = (e) => {
    e.preventDefault();
    let updated;
    if (editingTeamIdx !== null) {
      updated = teamList.map((m, idx) => idx === editingTeamIdx ? { ...teamForm } : m);
      setEditingTeamIdx(null);
      showToast('Ekip üyesi güncellendi!');
    } else {
      updated = [...teamList, { ...teamForm }];
      showToast('Yeni ekip üyesi eklendi!');
    }
    setTeamList(updated);
    onTeamUpdated(updated);
    setTeamForm({ name: '', role: '', specialty: '', description: '' });
  };

  const handleDeleteTeam = (idx) => {
    if (!window.confirm('Bu ekip üyesini silmek istediğinize emin misiniz?')) return;
    const updated = teamList.filter((_, i) => i !== idx);
    setTeamList(updated);
    onTeamUpdated(updated);
    showToast('Ekip üyesi silindi.');
  };

  /* ==============================================================================
     5. İLETİŞİM & STÜDYO BİLGİLERİ YÖNETİMİ
     ============================================================================== */
  const [studioForm, setStudioForm] = useState(() => ({ ...studioInfo }));

  const handleSaveStudio = (e) => {
    e.preventDefault();
    const updated = {
      ...studioForm,
      whatsappDirectUrl: `https://wa.me/${studioForm.phoneRaw.replace(/[^0-9]/g, '')}?text=Merhaba%20G%C3%BCnerler%20Mimarl%C4%B1k,%20bilgi%20ve%20ke%C5%9Fif%20almak%20istiyorum.`
    };
    onStudioUpdated(updated);
    showToast('Stüdyo ve iletişim bilgileri başarıyla kaydedildi!');
  };

  /* ==============================================================================
     6. CANLI SİMÜLASYON YÖNETİMİ
     ============================================================================== */
  const [simForm, setSimForm] = useState(() => simulationData || DEFAULT_SIMULATION_DATA);
  const [selectedSimKey, setSelectedSimKey] = useState('blueprint');

  const handleSaveSimulation = (e) => {
    e.preventDefault();
    onSimulationUpdated(simForm);
    showToast('Canlı CAD simülasyon katmanları güncellendi!');
  };

  /* ==============================================================================
     GİRİŞ YAPILMAMIŞSA: ŞİFRE EKRANI
     ============================================================================== */
  if (!isAuthenticated) {
    return (
      <div style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1000,
        background: 'rgba(5, 6, 8, 0.95)',
        backdropFilter: 'blur(20px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem'
      }}>
        <div style={{
          width: '100%',
          maxWidth: '420px',
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-gold)',
          borderRadius: '8px',
          padding: '2.5rem 2rem',
          boxShadow: 'var(--shadow-lg)',
          textAlign: 'center'
        }}>
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            background: 'rgba(197, 168, 128, 0.1)',
            border: '1px solid var(--border-gold)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--accent-gold)',
            margin: '0 auto 1.2rem auto'
          }}>
            <Lock size={26} />
          </div>

          <h3 style={{ fontSize: '1.5rem', color: '#FFF', marginBottom: '0.4rem', fontFamily: 'var(--font-serif)' }}>
            Yönetici Girişi
          </h3>
          <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', marginBottom: '1.8rem' }}>
            Site içeriklerini, projeleri ve iletişim bilgilerini yönetmek için lütfen parolanızı giriniz.
          </p>

          {authError && (
            <div style={{
              background: 'rgba(239, 68, 68, 0.12)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              color: '#F87171',
              padding: '0.75rem',
              borderRadius: '4px',
              fontSize: '0.82rem',
              marginBottom: '1.2rem',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              textAlign: 'left'
            }}>
              <AlertCircle size={16} style={{ flexShrink: 0 }} />
              <span>{authError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                autoFocus
                placeholder="Yönetici Parolası"
                value={inputPassword}
                onChange={(e) => setInputPassword(e.target.value)}
                style={{
                  width: '100%',
                  background: '#0D0E11',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '4px',
                  padding: '0.85rem 2.8rem 0.85rem 1rem',
                  color: '#FFF',
                  fontSize: '0.9rem',
                  outline: 'none'
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer'
                }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', padding: '0.9rem' }}
            >
              <KeyRound size={16} />
              <span>Panele Giriş Yap</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--text-muted)',
                fontSize: '0.82rem',
                cursor: 'pointer',
                marginTop: '0.5rem'
              }}
            >
              Vazgeç ve Siteye Dön
            </button>
          </form>
        </div>
      </div>
    );
  }

  /* ==============================================================================
     GİRİŞ YAPILMIŞSA: KAPSAMLI YÖNETİM PANELİ
     ============================================================================== */
  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 1000,
      background: '#090A0D',
      color: 'var(--text-primary)',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden'
    }}>
      {/* TOAST BİLDİRİMİ */}
      {toastMsg && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          zIndex: 1100,
          background: 'var(--accent-gold)',
          color: '#0A0B0D',
          fontWeight: 600,
          padding: '0.8rem 1.4rem',
          borderRadius: '4px',
          boxShadow: 'var(--shadow-lg)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <Check size={18} />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* ÜST BAR */}
      <header className="admin-modal-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '4px',
            background: 'var(--accent-gold)',
            color: '#0A0B0D',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 800,
            flexShrink: 0
          }}>
            G
          </div>
          <div>
            <h2 style={{ fontSize: '1.05rem', color: '#FFF', margin: 0, fontWeight: 700, letterSpacing: '0.08em' }}>
              GÜNERLER YÖNETİM PANELİ
            </h2>
            <span style={{ fontSize: '0.7rem', color: 'var(--accent-gold)', letterSpacing: '0.1em' }}>
              İçerik, Portfolyo & Künye Yönetimi
            </span>
          </div>
        </div>

        <div className="admin-header-actions">
          <button
            onClick={() => {
              if (window.confirm('Tüm site verilerini orijinal varsayılan ayarlara sıfırlamak istiyor musunuz?')) {
                onResetAll();
                showToast('Tüm veriler varsayılanlara sıfırlandı.');
              }
            }}
            className="btn btn-outline"
            style={{ padding: '0.5rem 0.9rem', fontSize: '0.75rem', borderColor: 'rgba(239, 68, 68, 0.4)', color: '#F87171' }}
            title="Tüm verileri varsayılana döndür"
          >
            <RotateCcw size={13} />
            <span>Varsayılana Sıfırla</span>
          </button>

          <button
            onClick={handleLogout}
            className="btn btn-outline"
            style={{ padding: '0.5rem 0.9rem', fontSize: '0.75rem' }}
          >
            <LogOut size={13} />
            <span>Çıkış Yap</span>
          </button>

          <button
            onClick={onClose}
            className="btn btn-primary"
            style={{ padding: '0.5rem 1rem', fontSize: '0.78rem' }}
          >
            <X size={15} />
            <span>Paneli Kapat</span>
          </button>
        </div>
      </header>

      {/* GÖVDE: SOL MENÜ + SAĞ İÇERİK */}
      <div className="admin-body-layout">
        
        {/* SOL SEKME MENÜSÜ */}
        <aside className="admin-sidebar-nav">
          <button
            onClick={() => setActiveTab('projects')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '0.8rem 1rem',
              borderRadius: '4px',
              border: 'none',
              background: activeTab === 'projects' ? 'var(--accent-gold)' : 'transparent',
              color: activeTab === 'projects' ? '#0A0B0D' : 'var(--text-secondary)',
              fontWeight: activeTab === 'projects' ? 700 : 500,
              fontSize: '0.85rem',
              cursor: 'pointer',
              textAlign: 'left',
              whiteSpace: 'nowrap'
            }}
          >
            <Building size={16} />
            <span>Projeler ({projects.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('references')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '0.8rem 1rem',
              borderRadius: '4px',
              border: 'none',
              background: activeTab === 'references' ? 'var(--accent-gold)' : 'transparent',
              color: activeTab === 'references' ? '#0A0B0D' : 'var(--text-secondary)',
              fontWeight: activeTab === 'references' ? 700 : 500,
              fontSize: '0.85rem',
              cursor: 'pointer',
              textAlign: 'left',
              whiteSpace: 'nowrap'
            }}
          >
            <Award size={16} />
            <span>Referanslar ({refList.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('services')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '0.8rem 1rem',
              borderRadius: '4px',
              border: 'none',
              background: activeTab === 'services' ? 'var(--accent-gold)' : 'transparent',
              color: activeTab === 'services' ? '#0A0B0D' : 'var(--text-secondary)',
              fontWeight: activeTab === 'services' ? 700 : 500,
              fontSize: '0.85rem',
              cursor: 'pointer',
              textAlign: 'left',
              whiteSpace: 'nowrap'
            }}
          >
            <Wrench size={16} />
            <span>Hizmetler ({servicesList.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('team')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '0.8rem 1rem',
              borderRadius: '4px',
              border: 'none',
              background: activeTab === 'team' ? 'var(--accent-gold)' : 'transparent',
              color: activeTab === 'team' ? '#0A0B0D' : 'var(--text-secondary)',
              fontWeight: activeTab === 'team' ? 700 : 500,
              fontSize: '0.85rem',
              cursor: 'pointer',
              textAlign: 'left',
              whiteSpace: 'nowrap'
            }}
          >
            <Users size={16} />
            <span>Ekibimiz ({teamList.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('studio')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '0.8rem 1rem',
              borderRadius: '4px',
              border: 'none',
              background: activeTab === 'studio' ? 'var(--accent-gold)' : 'transparent',
              color: activeTab === 'studio' ? '#0A0B0D' : 'var(--text-secondary)',
              fontWeight: activeTab === 'studio' ? 700 : 500,
              fontSize: '0.85rem',
              cursor: 'pointer',
              textAlign: 'left',
              whiteSpace: 'nowrap'
            }}
          >
            <Phone size={16} />
            <span>İletişim & Stüdyo</span>
          </button>

          <button
            onClick={() => setActiveTab('simulation')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '0.8rem 1rem',
              borderRadius: '4px',
              border: 'none',
              background: activeTab === 'simulation' ? 'var(--accent-gold)' : 'transparent',
              color: activeTab === 'simulation' ? '#0A0B0D' : 'var(--text-secondary)',
              fontWeight: activeTab === 'simulation' ? 700 : 500,
              fontSize: '0.85rem',
              cursor: 'pointer',
              textAlign: 'left',
              whiteSpace: 'nowrap'
            }}
          >
            <Cpu size={16} />
            <span>Canlı CAD Simülasyon</span>
          </button>
        </aside>

        {/* SAĞ İÇERİK ALANI */}
        <main className="admin-main-content">
          
          {/* ====================================================================
             TAB 1: PROJELER
             ==================================================================== */}
          {activeTab === 'projects' && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.4rem', color: '#FFF', margin: 0 }}>Projeler Yönetimi</h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                    Sitede vitrine çıkan projelerin fotoğraflarını, bilgilerini düzenleyin veya yenilerini ekleyin.
                  </p>
                </div>
              </div>

              {/* PROJE EKLEME & DÜZENLEME FORMU */}
              <div ref={projectFormRef} style={{
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-gold)',
                borderRadius: '6px',
                padding: '2rem',
                marginBottom: '2.5rem'
              }}>
                <h4 style={{ fontSize: '1.1rem', color: '#FFF', marginBottom: '1.2rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Edit3 size={18} color="var(--accent-gold)" />
                  <span>{editingProjectId ? 'Projeyi Düzenle' : 'Yeni Proje Ekle'}</span>
                </h4>

                <form onSubmit={handleSaveProject} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '1.2rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>
                        Proje Başlığı *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Örn: Bodrum Lüks Villa & Peyzaj"
                        value={projectForm.title}
                        onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                        style={{ width: '100%', background: '#121418', border: '1px solid var(--border-subtle)', padding: '0.8rem', color: '#FFF', borderRadius: '3px' }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>
                        Kategori *
                      </label>
                      <select
                        value={projectForm.category}
                        onChange={(e) => setProjectForm({ ...projectForm, category: e.target.value })}
                        style={{ width: '100%', background: '#121418', border: '1px solid var(--border-subtle)', padding: '0.8rem', color: '#FFF', borderRadius: '3px' }}
                      >
                        <option value="Mimari & İnşaat">Mimari & İnşaat</option>
                        <option value="İç Mimarlık & Dekorasyon">İç Mimarlık & Dekorasyon</option>
                        <option value="Peyzaj & Bahçe">Peyzaj & Bahçe</option>
                        <option value="İç Mimarlık & Sosyal Yapılar">İç Mimarlık & Sosyal Yapılar</option>
                      </select>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.2rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>
                        Lokasyon / Şehir
                      </label>
                      <input
                        type="text"
                        placeholder="Örn: Antalya, Kaş"
                        value={projectForm.location}
                        onChange={(e) => setProjectForm({ ...projectForm, location: e.target.value })}
                        style={{ width: '100%', background: '#121418', border: '1px solid var(--border-subtle)', padding: '0.8rem', color: '#FFF', borderRadius: '3px' }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>
                        Yıl
                      </label>
                      <input
                        type="text"
                        placeholder="2024"
                        value={projectForm.year}
                        onChange={(e) => setProjectForm({ ...projectForm, year: e.target.value })}
                        style={{ width: '100%', background: '#121418', border: '1px solid var(--border-subtle)', padding: '0.8rem', color: '#FFF', borderRadius: '3px' }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>
                        Alan (m²)
                      </label>
                      <input
                        type="text"
                        placeholder="Örn: 450 m²"
                        value={projectForm.area}
                        onChange={(e) => setProjectForm({ ...projectForm, area: e.target.value })}
                        style={{ width: '100%', background: '#121418', border: '1px solid var(--border-subtle)', padding: '0.8rem', color: '#FFF', borderRadius: '3px' }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>
                      Özet Slogan / Tagline
                    </label>
                    <input
                      type="text"
                      placeholder="Örn: Doğal taş kaplama, ahşap pergolalar ve yüksek mukavemetli inşaat"
                      value={projectForm.tagline}
                      onChange={(e) => setProjectForm({ ...projectForm, tagline: e.target.value })}
                      style={{ width: '100%', background: '#121418', border: '1px solid var(--border-subtle)', padding: '0.8rem', color: '#FFF', borderRadius: '3px' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>
                      Kapak Görseli URL
                    </label>
                    <input
                      type="text"
                      placeholder="https://... veya /images/..."
                      value={projectForm.cover_image}
                      onChange={(e) => setProjectForm({ ...projectForm, cover_image: e.target.value })}
                      style={{ width: '100%', background: '#121418', border: '1px solid var(--border-subtle)', padding: '0.8rem', color: '#FFF', borderRadius: '3px' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>
                      Galeri Fotoğrafları (Her satıra 1 URL veya dosya yolu)
                    </label>
                    <textarea
                      rows={3}
                      placeholder="/images/ornek/foto-1.jpg&#10;/images/ornek/foto-2.jpg"
                      value={projectForm.imagesText}
                      onChange={(e) => setProjectForm({ ...projectForm, imagesText: e.target.value })}
                      style={{ width: '100%', background: '#121418', border: '1px solid var(--border-subtle)', padding: '0.8rem', color: '#FFF', borderRadius: '3px', fontFamily: 'monospace' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>
                      Detaylı Mimari Açıklama
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Proje hakkında detaylar..."
                      value={projectForm.description}
                      onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                      style={{ width: '100%', background: '#121418', border: '1px solid var(--border-subtle)', padding: '0.8rem', color: '#FFF', borderRadius: '3px' }}
                    />
                  </div>

                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                      type="submit"
                      disabled={projectLoading}
                      className="btn btn-primary"
                      style={{ padding: '0.8rem 1.8rem' }}
                    >
                      <Save size={16} />
                      <span>{editingProjectId ? 'Değişiklikleri Kaydet' : 'Projeyi Ekle'}</span>
                    </button>

                    {editingProjectId && (
                      <button
                        type="button"
                        onClick={handleCancelEditProject}
                        className="btn btn-outline"
                        style={{ padding: '0.8rem 1.4rem' }}
                      >
                        İptal
                      </button>
                    )}
                  </div>
                </form>
              </div>

              {/* MEVCUT PROJELER LİSTESİ */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <h4 style={{ fontSize: '1.1rem', color: '#FFF', margin: 0 }}>Yayındaki Projeler ({projects.length})</h4>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '280px' }}>
                    <Search size={16} color="var(--text-muted)" />
                    <input
                      type="text"
                      placeholder="Proje ara..."
                      value={projectSearch}
                      onChange={(e) => setProjectSearch(e.target.value)}
                      style={{ width: '100%', background: '#121418', border: '1px solid var(--border-subtle)', padding: '0.5rem 0.8rem', color: '#FFF', borderRadius: '3px', fontSize: '0.85rem' }}
                    />
                  </div>
                </div>

                {projects
                  .filter(p => !projectSearch || p.title.toLowerCase().includes(projectSearch.toLowerCase()))
                  .map((p) => (
                    <div
                      key={p.id}
                      style={{
                        background: 'var(--bg-surface)',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: '4px',
                        padding: '1.2rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '1.5rem'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <img
                          src={p.cover_image}
                          alt={p.title}
                          style={{ width: '80px', height: '60px', objectFit: 'cover', borderRadius: '3px', background: '#222' }}
                          onError={(e) => { e.target.style.display = 'none'; }}
                        />
                        <div>
                          <h5 style={{ fontSize: '1rem', color: '#FFF', margin: '0 0 4px 0' }}>{p.title}</h5>
                          <span style={{ fontSize: '0.75rem', color: 'var(--accent-gold)', display: 'block' }}>
                            {p.category} | {p.location || 'Lokasyon Belirtilmedi'} | {p.year}
                          </span>
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          onClick={() => handleStartEditProject(p)}
                          className="btn btn-outline"
                          style={{ padding: '0.5rem 0.9rem', fontSize: '0.78rem' }}
                        >
                          <Edit3 size={14} />
                          <span>Düzenle</span>
                        </button>

                        <button
                          onClick={() => handleDeleteProject(p.id, p.title)}
                          className="btn btn-outline"
                          style={{ padding: '0.5rem 0.9rem', fontSize: '0.78rem', borderColor: 'rgba(239, 68, 68, 0.4)', color: '#F87171' }}
                        >
                          <Trash2 size={14} />
                          <span>Sil</span>
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* ====================================================================
             TAB 2: REFERANSLAR
             ==================================================================== */}
          {activeTab === 'references' && (
            <div>
              <div style={{ marginBottom: '2rem' }}>
                <h3 style={{ fontSize: '1.4rem', color: '#FFF', margin: 0 }}>Referanslar & Çözüm Ortakları ({refList.length})</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                  Sitede logoları ve isimleri sergilenen firmaları düzenleyin veya yeni referanslar ekleyin.
                </p>
              </div>

              {/* REFERANS FORMU */}
              <div style={{
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-gold)',
                borderRadius: '6px',
                padding: '1.8rem',
                marginBottom: '2rem'
              }}>
                <h4 style={{ fontSize: '1.05rem', color: '#FFF', marginBottom: '1rem' }}>
                  {editingRefIdx !== null ? 'Referans Firmayı Düzenle' : 'Yeni Referans Firma Ekle'}
                </h4>

                <form onSubmit={handleSaveReference} style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1.5fr auto', gap: '1rem', alignItems: 'end' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>
                      Firma / Kurum Adı *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Örn: RAMS Türkiye"
                      value={refForm.name}
                      onChange={(e) => setRefForm({ ...refForm, name: e.target.value })}
                      style={{ width: '100%', background: '#121418', border: '1px solid var(--border-subtle)', padding: '0.75rem', color: '#FFF', borderRadius: '3px' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>
                      Sektör / Kategori *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Örn: Gayrimenkul & Yatırım"
                      value={refForm.category}
                      onChange={(e) => setRefForm({ ...refForm, category: e.target.value })}
                      style={{ width: '100%', background: '#121418', border: '1px solid var(--border-subtle)', padding: '0.75rem', color: '#FFF', borderRadius: '3px' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>
                      Logo Görseli URL / Dosya Yolu *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="/images/... veya https://..."
                      value={refForm.logo}
                      onChange={(e) => setRefForm({ ...refForm, logo: e.target.value })}
                      style={{ width: '100%', background: '#121418', border: '1px solid var(--border-subtle)', padding: '0.75rem', color: '#FFF', borderRadius: '3px' }}
                    />
                  </div>

                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button type="submit" className="btn btn-primary" style={{ padding: '0.75rem 1.4rem' }}>
                      <Save size={15} />
                      <span>{editingRefIdx !== null ? 'Güncelle' : 'Ekle'}</span>
                    </button>
                    {editingRefIdx !== null && (
                      <button type="button" onClick={() => { setEditingRefIdx(null); setRefForm({ name: '', category: '', logo: '' }); }} className="btn btn-outline" style={{ padding: '0.75rem 1rem' }}>
                        İptal
                      </button>
                    )}
                  </div>
                </form>
              </div>

              {/* REFERANSLAR LİSTESİ */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                gap: '1.2rem'
              }}>
                {refList.map((ref, idx) => (
                  <div
                    key={idx}
                    style={{
                      background: 'var(--bg-surface)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: '4px',
                      padding: '1.2rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1rem',
                      justifyContent: 'space-between'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ width: '54px', height: '42px', background: '#FFF', borderRadius: '3px', padding: '3px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <img src={ref.logo} alt={ref.name} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                      </div>
                      <div>
                        <strong style={{ fontSize: '0.9rem', color: '#FFF', display: 'block' }}>{ref.name}</strong>
                        <span style={{ fontSize: '0.74rem', color: 'var(--accent-gold)' }}>{ref.category}</span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button
                        onClick={() => { setEditingRefIdx(idx); setRefForm({ ...ref }); }}
                        className="btn btn-outline"
                        style={{ padding: '0.4rem 0.6rem' }}
                        title="Düzenle"
                      >
                        <Edit3 size={13} />
                      </button>
                      <button
                        onClick={() => handleDeleteRef(idx)}
                        className="btn btn-outline"
                        style={{ padding: '0.4rem 0.6rem', color: '#F87171', borderColor: 'rgba(239,68,68,0.3)' }}
                        title="Sil"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ====================================================================
             TAB 3: HİZMETLER
             ==================================================================== */}
          {activeTab === 'services' && (
            <div>
              <div style={{ marginBottom: '2rem' }}>
                <h3 style={{ fontSize: '1.4rem', color: '#FFF', margin: 0 }}>Hizmetlerimiz Yönetimi ({srvList.length})</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                  Sitede listelenen 4 ana hizmet alanını düzenleyin ya da yenilerini ekleyin.
                </p>
              </div>

              {/* HİZMET FORMU */}
              <div style={{
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-gold)',
                borderRadius: '6px',
                padding: '1.8rem',
                marginBottom: '2rem'
              }}>
                <h4 style={{ fontSize: '1.05rem', color: '#FFF', marginBottom: '1rem' }}>
                  {editingSrvIdx !== null ? 'Hizmeti Düzenle' : 'Yeni Hizmet Ekle'}
                </h4>

                <form onSubmit={handleSaveService} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '120px 200px 1fr', gap: '1rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>
                        Sıra No
                      </label>
                      <input
                        type="text"
                        placeholder="01"
                        value={srvForm.num}
                        onChange={(e) => setSrvForm({ ...srvForm, num: e.target.value })}
                        style={{ width: '100%', background: '#121418', border: '1px solid var(--border-subtle)', padding: '0.75rem', color: '#FFF', borderRadius: '3px' }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>
                        İkon
                      </label>
                      <select
                        value={srvForm.iconKey}
                        onChange={(e) => setSrvForm({ ...srvForm, iconKey: e.target.value })}
                        style={{ width: '100%', background: '#121418', border: '1px solid var(--border-subtle)', padding: '0.75rem', color: '#FFF', borderRadius: '3px' }}
                      >
                        <option value="Compass">Pusula (Mimari)</option>
                        <option value="Hammer">Çekiç (İnşaat)</option>
                        <option value="Trees">Ağaç (Peyzaj)</option>
                        <option value="Sparkles">Işıltı (Dekorasyon)</option>
                        <option value="Building">Bina / Yapı</option>
                        <option value="Ruler">Cetvel / Tasarım</option>
                        <option value="Palette">Palet / İç Mimar</option>
                      </select>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>
                        Hizmet Başlığı *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Örn: Akıllı Ev & Otomasyon"
                        value={srvForm.title}
                        onChange={(e) => setSrvForm({ ...srvForm, title: e.target.value })}
                        style={{ width: '100%', background: '#121418', border: '1px solid var(--border-subtle)', padding: '0.75rem', color: '#FFF', borderRadius: '3px' }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>
                      Detaylı Açıklama *
                    </label>
                    <textarea
                      rows={2}
                      required
                      placeholder="Hizmet detayları ve sunulan avantajlar..."
                      value={srvForm.description}
                      onChange={(e) => setSrvForm({ ...srvForm, description: e.target.value })}
                      style={{ width: '100%', background: '#121418', border: '1px solid var(--border-subtle)', padding: '0.75rem', color: '#FFF', borderRadius: '3px' }}
                    />
                  </div>

                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button type="submit" className="btn btn-primary" style={{ padding: '0.75rem 1.4rem' }}>
                      <Save size={15} />
                      <span>{editingSrvIdx !== null ? 'Hizmeti Güncelle' : 'Hizmeti Ekle'}</span>
                    </button>
                    {editingSrvIdx !== null && (
                      <button type="button" onClick={() => { setEditingSrvIdx(null); setSrvForm({ num: '01', iconKey: 'Compass', title: '', description: '' }); }} className="btn btn-outline" style={{ padding: '0.75rem 1rem' }}>
                        İptal
                      </button>
                    )}
                  </div>
                </form>
              </div>

              {/* HİZMETLER LİSTESİ */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.2rem' }}>
                {srvList.map((s, idx) => (
                  <div
                    key={s.id || idx}
                    style={{
                      background: 'var(--bg-surface)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: '4px',
                      padding: '1.5rem',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between'
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem' }}>
                        <span style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--accent-gold)' }}>{s.num}</span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>İkon: {s.iconKey}</span>
                      </div>
                      <h4 style={{ fontSize: '1.1rem', color: '#FFF', marginBottom: '0.5rem' }}>{s.title}</h4>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>{s.description}</p>
                    </div>

                    <div style={{ display: 'flex', gap: '8px', marginTop: '1.2rem', paddingTop: '1rem', borderTop: '1px solid var(--border-subtle)' }}>
                      <button
                        onClick={() => { setEditingSrvIdx(idx); setSrvForm({ ...s }); }}
                        className="btn btn-outline"
                        style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem', flexGrow: 1 }}
                      >
                        <Edit3 size={13} />
                        <span>Düzenle</span>
                      </button>
                      <button
                        onClick={() => handleDeleteSrv(idx)}
                        className="btn btn-outline"
                        style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem', color: '#F87171', borderColor: 'rgba(239,68,68,0.3)' }}
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ====================================================================
             TAB 4: EKİP
             ==================================================================== */}
          {activeTab === 'team' && (
            <div>
              <div style={{ marginBottom: '2rem' }}>
                <h3 style={{ fontSize: '1.4rem', color: '#FFF', margin: 0 }}>Uzman Ekibimiz ({teamList.length})</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                  Sitede yer alan mimar, mühendis ve proje sorumlularının bilgilerini düzenleyin.
                </p>
              </div>

              {/* EKİP FORMU */}
              <div style={{
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-gold)',
                borderRadius: '6px',
                padding: '1.8rem',
                marginBottom: '2rem'
              }}>
                <h4 style={{ fontSize: '1.05rem', color: '#FFF', marginBottom: '1rem' }}>
                  {editingTeamIdx !== null ? 'Ekip Üyesini Düzenle' : 'Yeni Ekip Üyesi Ekle'}
                </h4>

                <form onSubmit={handleSaveTeam} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr', gap: '1rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>
                        Ad Soyad *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Örn: Cebrail Öztürk"
                        value={teamForm.name}
                        onChange={(e) => setTeamForm({ ...teamForm, name: e.target.value })}
                        style={{ width: '100%', background: '#121418', border: '1px solid var(--border-subtle)', padding: '0.75rem', color: '#FFF', borderRadius: '3px' }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>
                        Rol / Unvan *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Örn: İnşaat Mühendisi"
                        value={teamForm.role}
                        onChange={(e) => setTeamForm({ ...teamForm, role: e.target.value })}
                        style={{ width: '100%', background: '#121418', border: '1px solid var(--border-subtle)', padding: '0.75rem', color: '#FFF', borderRadius: '3px' }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>
                        Uzmanlık Alanı
                      </label>
                      <input
                        type="text"
                        placeholder="Örn: Statik & Yapı Güvenliği"
                        value={teamForm.specialty}
                        onChange={(e) => setTeamForm({ ...teamForm, specialty: e.target.value })}
                        style={{ width: '100%', background: '#121418', border: '1px solid var(--border-subtle)', padding: '0.75rem', color: '#FFF', borderRadius: '3px' }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>
                      Görev Tanımı & Açıklama
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Kişinin yürüttüğü süreçler ve deneyimi..."
                      value={teamForm.description}
                      onChange={(e) => setTeamForm({ ...teamForm, description: e.target.value })}
                      style={{ width: '100%', background: '#121418', border: '1px solid var(--border-subtle)', padding: '0.75rem', color: '#FFF', borderRadius: '3px' }}
                    />
                  </div>

                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button type="submit" className="btn btn-primary" style={{ padding: '0.75rem 1.4rem' }}>
                      <Save size={15} />
                      <span>{editingTeamIdx !== null ? 'Üyeyi Güncelle' : 'Üyeyi Ekle'}</span>
                    </button>
                    {editingTeamIdx !== null && (
                      <button type="button" onClick={() => { setEditingTeamIdx(null); setTeamForm({ name: '', role: '', specialty: '', description: '' }); }} className="btn btn-outline" style={{ padding: '0.75rem 1rem' }}>
                        İptal
                      </button>
                    )}
                  </div>
                </form>
              </div>

              {/* EKİP LİSTESİ */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.2rem' }}>
                {teamList.map((m, idx) => (
                  <div
                    key={idx}
                    style={{
                      background: 'var(--bg-surface)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: '4px',
                      padding: '1.5rem',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between'
                    }}
                  >
                    <div>
                      <span style={{ fontSize: '0.75rem', color: 'var(--accent-gold)', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                        {m.role}
                      </span>
                      <h4 style={{ fontSize: '1.2rem', color: '#FFF', marginBottom: '4px' }}>{m.name}</h4>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.8rem' }}>
                        {m.specialty}
                      </span>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
                        {m.description}
                      </p>
                    </div>

                    <div style={{ display: 'flex', gap: '8px', marginTop: '1.2rem', paddingTop: '1rem', borderTop: '1px solid var(--border-subtle)' }}>
                      <button
                        onClick={() => { setEditingTeamIdx(idx); setTeamForm({ ...m }); }}
                        className="btn btn-outline"
                        style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem', flexGrow: 1 }}
                      >
                        <Edit3 size={13} />
                        <span>Düzenle</span>
                      </button>
                      <button
                        onClick={() => handleDeleteTeam(idx)}
                        className="btn btn-outline"
                        style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem', color: '#F87171', borderColor: 'rgba(239,68,68,0.3)' }}
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ====================================================================
             TAB 5: İLETİŞİM & STÜDYO BİLGİLERİ
             ==================================================================== */}
          {activeTab === 'studio' && (
            <div>
              <div style={{ marginBottom: '2rem' }}>
                <h3 style={{ fontSize: '1.4rem', color: '#FFF', margin: 0 }}>İletişim & Stüdyo Künyesi</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                  Telefon numaraları, WhatsApp bağlantısı, adres, çalışma saatleri ve hakkımızda metinlerini tek yerden düzenleyin.
                </p>
              </div>

              <div style={{
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-gold)',
                borderRadius: '6px',
                padding: '2.2rem'
              }}>
                <form onSubmit={handleSaveStudio} style={{ display: 'flex', flexDirection: 'column', gap: '1.3rem' }}>
                  
                  {/* MARKA BİLGİLERİ */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 140px', gap: '1.2rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>
                        Marka Adı
                      </label>
                      <input
                        type="text"
                        value={studioForm.name || ''}
                        onChange={(e) => setStudioForm({ ...studioForm, name: e.target.value })}
                        style={{ width: '100%', background: '#121418', border: '1px solid var(--border-subtle)', padding: '0.8rem', color: '#FFF', borderRadius: '3px' }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>
                        Alt Başlık (Slogan Başlık)
                      </label>
                      <input
                        type="text"
                        value={studioForm.subtitle || ''}
                        onChange={(e) => setStudioForm({ ...studioForm, subtitle: e.target.value })}
                        style={{ width: '100%', background: '#121418', border: '1px solid var(--border-subtle)', padding: '0.8rem', color: '#FFF', borderRadius: '3px' }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>
                        Kuruluş Yılı
                      </label>
                      <input
                        type="number"
                        value={studioForm.foundedYear || 2019}
                        onChange={(e) => setStudioForm({ ...studioForm, foundedYear: parseInt(e.target.value, 10) })}
                        style={{ width: '100%', background: '#121418', border: '1px solid var(--border-subtle)', padding: '0.8rem', color: '#FFF', borderRadius: '3px' }}
                      />
                    </div>
                  </div>

                  {/* İLETİŞİM KANALLARI */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.2rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>
                        Görünür Telefon Numarası
                      </label>
                      <input
                        type="text"
                        value={studioForm.phone || ''}
                        onChange={(e) => setStudioForm({ ...studioForm, phone: e.target.value })}
                        style={{ width: '100%', background: '#121418', border: '1px solid var(--border-subtle)', padding: '0.8rem', color: '#FFF', borderRadius: '3px' }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>
                        Doğrudan Arama / WhatsApp Numarası (Sayısal)
                      </label>
                      <input
                        type="text"
                        placeholder="+905072300504"
                        value={studioForm.phoneRaw || ''}
                        onChange={(e) => setStudioForm({ ...studioForm, phoneRaw: e.target.value })}
                        style={{ width: '100%', background: '#121418', border: '1px solid var(--border-subtle)', padding: '0.8rem', color: '#FFF', borderRadius: '3px' }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>
                        E-posta Adresi
                      </label>
                      <input
                        type="email"
                        value={studioForm.email || ''}
                        onChange={(e) => setStudioForm({ ...studioForm, email: e.target.value })}
                        style={{ width: '100%', background: '#121418', border: '1px solid var(--border-subtle)', padding: '0.8rem', color: '#FFF', borderRadius: '3px' }}
                      />
                    </div>
                  </div>

                  {/* ADRES VE ÇALIŞMA SAATLERİ */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '1.2rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>
                        Ofis & Stüdyo Adresi
                      </label>
                      <input
                        type="text"
                        value={studioForm.address || ''}
                        onChange={(e) => setStudioForm({ ...studioForm, address: e.target.value })}
                        style={{ width: '100%', background: '#121418', border: '1px solid var(--border-subtle)', padding: '0.8rem', color: '#FFF', borderRadius: '3px' }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>
                        Çalışma Saatleri
                      </label>
                      <input
                        type="text"
                        value={studioForm.workingHours || ''}
                        onChange={(e) => setStudioForm({ ...studioForm, workingHours: e.target.value })}
                        style={{ width: '100%', background: '#121418', border: '1px solid var(--border-subtle)', padding: '0.8rem', color: '#FFF', borderRadius: '3px' }}
                      />
                    </div>
                  </div>

                  {/* HAKKIMIZDA & BİYOGRAFİ METNİ */}
                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>
                      Şirket Tanıtım & Biyografi Metni
                    </label>
                    <textarea
                      rows={3}
                      value={studioForm.bio || ''}
                      onChange={(e) => setStudioForm({ ...studioForm, bio: e.target.value })}
                      style={{ width: '100%', background: '#121418', border: '1px solid var(--border-subtle)', padding: '0.8rem', color: '#FFF', borderRadius: '3px', lineHeight: 1.6 }}
                    />
                  </div>

                  <div>
                    <button type="submit" className="btn btn-primary" style={{ padding: '0.9rem 2rem', alignSelf: 'flex-start' }}>
                      <Save size={16} />
                      <span>İletişim & Stüdyo Bilgilerini Kaydet</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* ====================================================================
             TAB 6: CANLI CAD SİMÜLASYONU
             ==================================================================== */}
          {activeTab === 'simulation' && (
            <div>
              <div style={{ marginBottom: '2rem' }}>
                <h3 style={{ fontSize: '1.4rem', color: '#FFF', margin: 0 }}>Canlı Mimari CAD Simülasyonu</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                  Hero vitrinindeki 3 aşamalı (Blueprint, Karkas/Şantiye, 8K Render) interaktif simülatör verilerini düzenleyin.
                </p>
              </div>

              {/* KATMAN SEÇİCİ */}
              <div style={{ display: 'flex', gap: '8px', marginBottom: '1.5rem' }}>
                {['blueprint', 'structure', 'render'].map(k => (
                  <button
                    key={k}
                    onClick={() => setSelectedSimKey(k)}
                    className="btn"
                    style={{
                      background: selectedSimKey === k ? 'var(--accent-gold)' : 'rgba(255,255,255,0.05)',
                      color: selectedSimKey === k ? '#0A0B0D' : '#FFF',
                      border: '1px solid var(--border-subtle)',
                      fontWeight: selectedSimKey === k ? 700 : 500
                    }}
                  >
                    {simForm[k]?.tabLabel || k}
                  </button>
                ))}
              </div>

              <div style={{
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-gold)',
                borderRadius: '6px',
                padding: '2rem'
              }}>
                <form onSubmit={handleSaveSimulation} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.2rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>
                        Katman Başlığı
                      </label>
                      <input
                        type="text"
                        value={simForm[selectedSimKey]?.title || ''}
                        onChange={(e) => setSimForm({
                          ...simForm,
                          [selectedSimKey]: { ...simForm[selectedSimKey], title: e.target.value }
                        })}
                        style={{ width: '100%', background: '#121418', border: '1px solid var(--border-subtle)', padding: '0.8rem', color: '#FFF', borderRadius: '3px' }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>
                        Rozet (Badge) Metni
                      </label>
                      <input
                        type="text"
                        value={simForm[selectedSimKey]?.badge || ''}
                        onChange={(e) => setSimForm({
                          ...simForm,
                          [selectedSimKey]: { ...simForm[selectedSimKey], badge: e.target.value }
                        })}
                        style={{ width: '100%', background: '#121418', border: '1px solid var(--border-subtle)', padding: '0.8rem', color: '#FFF', borderRadius: '3px' }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>
                      Katman Görseli URL
                    </label>
                    <input
                      type="text"
                      value={simForm[selectedSimKey]?.image || ''}
                      onChange={(e) => setSimForm({
                        ...simForm,
                        [selectedSimKey]: { ...simForm[selectedSimKey], image: e.target.value }
                      })}
                      style={{ width: '100%', background: '#121418', border: '1px solid var(--border-subtle)', padding: '0.8rem', color: '#FFF', borderRadius: '3px' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>
                      Açıklama / Altyazı
                    </label>
                    <textarea
                      rows={2}
                      value={simForm[selectedSimKey]?.subtitle || ''}
                      onChange={(e) => setSimForm({
                        ...simForm,
                        [selectedSimKey]: { ...simForm[selectedSimKey], subtitle: e.target.value }
                      })}
                      style={{ width: '100%', background: '#121418', border: '1px solid var(--border-subtle)', padding: '0.8rem', color: '#FFF', borderRadius: '3px' }}
                    />
                  </div>

                  <div>
                    <button type="submit" className="btn btn-primary" style={{ padding: '0.9rem 2rem' }}>
                      <Save size={16} />
                      <span>Simülasyon Verilerini Kaydet</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}
