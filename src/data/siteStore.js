import { STUDIO_INFO as DEFAULT_STUDIO_INFO, TEAM_MEMBERS as DEFAULT_TEAM_MEMBERS, REFERENCES_DATA as DEFAULT_REFERENCES_DATA, INITIAL_PROJECTS } from './initialProjects';

export const DEFAULT_SERVICES = [
  {
    id: "srv-1",
    num: "01",
    iconKey: "Compass",
    title: "Mimari Tasarım & Proje",
    description: "İmar ve parsel analizi, konsept tasarım, 3D görselleştirme, ruhsat ve statik uygulama projeleri. Belediyeler ve ilgili kurumlarla onay süreçlerinin eksiksiz yönetimi."
  },
  {
    id: "srv-2",
    num: "02",
    iconKey: "Hammer",
    title: "Müteahhitlik & İnşaat",
    description: "Temelden çatıya anahtar teslim villa ve konut inşaatları. Deprem yönetmeliğine uygun yüksek dayanımlı karkas, izolasyon, cephe kaplamaları ve disiplinli şantiye denetimi."
  },
  {
    id: "srv-3",
    num: "03",
    iconKey: "Trees",
    title: "Peyzaj & Çevre Düzenleme",
    description: "Sanatsal bahçe peyzajı, rulo çim serimi, egzotik ve yerel bitkilendirme, otomatik sulama ve drenaj altyapısı, süs ve yüzme havuzları, taş yürüyüş yolları ve bahçe aydınlatması."
  },
  {
    id: "srv-4",
    num: "04",
    iconKey: "Sparkles",
    title: "İç Mimarlık & Dekorasyon",
    description: "Mekana özel lüks dekorasyon çözümleri; alçıpan ve gergi tavan sistemleri, çıtalama, dekoratif boya, özel üretim lake mobilyalar, mutfak/banyo yenileme ve tadilat."
  }
];

const KEYS = {
  STUDIO: 'gunerler_site_studio_info_v1',
  TEAM: 'gunerler_site_team_members_v1',
  REFERENCES: 'gunerler_site_references_v1',
  SERVICES: 'gunerler_site_services_v1',
  PROJECTS: 'gunerler_site_projects_v1'
};

// STUDIO BİLGİLERİ
export function getStoredStudioInfo() {
  try {
    const raw = localStorage.getItem(KEYS.STUDIO);
    if (raw) return { ...DEFAULT_STUDIO_INFO, ...JSON.parse(raw) };
  } catch (e) {
    console.warn('Studio bilgisi okunamadı:', e);
  }
  return DEFAULT_STUDIO_INFO;
}

export function saveStoredStudioInfo(data) {
  try {
    localStorage.setItem(KEYS.STUDIO, JSON.stringify(data));
  } catch (e) {
    console.warn('Studio bilgisi kaydedilemedi:', e);
  }
}

// EKİP
export function getStoredTeamMembers() {
  try {
    const raw = localStorage.getItem(KEYS.TEAM);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn('Ekip bilgisi okunamadı:', e);
  }
  return DEFAULT_TEAM_MEMBERS;
}

export function saveStoredTeamMembers(data) {
  try {
    localStorage.setItem(KEYS.TEAM, JSON.stringify(data));
  } catch (e) {
    console.warn('Ekip bilgisi kaydedilemedi:', e);
  }
}

// REFERANSLAR
export function getStoredReferences() {
  try {
    const raw = localStorage.getItem(KEYS.REFERENCES);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        const hasLegacyPaths = parsed.some(r => r.logo && (r.logo.includes('İş yapılan') || r.logo.includes('WhatsApp Image')));
        if (hasLegacyPaths) {
          saveStoredReferences(DEFAULT_REFERENCES_DATA);
          return DEFAULT_REFERENCES_DATA;
        }
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Referanslar okunamadı:', e);
  }
  return DEFAULT_REFERENCES_DATA;
}

export function saveStoredReferences(data) {
  try {
    localStorage.setItem(KEYS.REFERENCES, JSON.stringify(data));
  } catch (e) {
    console.warn('Referanslar kaydedilemedi:', e);
  }
}

// HİZMETLER
export function getStoredServices() {
  try {
    const raw = localStorage.getItem(KEYS.SERVICES);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn('Hizmetler okunamadı:', e);
  }
  return DEFAULT_SERVICES;
}

export function saveStoredServices(data) {
  try {
    localStorage.setItem(KEYS.SERVICES, JSON.stringify(data));
  } catch (e) {
    console.warn('Hizmetler kaydedilemedi:', e);
  }
}

// YEREL PROJELER
export function getStoredProjects() {
  try {
    const raw = localStorage.getItem(KEYS.PROJECTS);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        const blacklist = ['göl vadisi', 'marmara sahil', 'alkent panorama', 'botanica', 'marina plaza', 'taş cepheli'];
        const cleaned = parsed.filter(p => {
          if (!p) return false;
          const title = (p.title || '').toLowerCase();
          const id = (p.id || '').toString();
          return !blacklist.some(b => title.includes(b)) && !/^proj-[1-6]$/.test(id);
        });
        const missingInitial = INITIAL_PROJECTS.filter(ip => !cleaned.some(p => p.id === ip.id));
        const merged = [...missingInitial, ...cleaned];
        if (missingInitial.length > 0 || cleaned.length !== parsed.length) {
          saveStoredProjects(merged);
        }
        return merged.length > 0 ? merged : INITIAL_PROJECTS;
      }
    }
  } catch (e) {
    console.warn('Projeler okunamadı:', e);
  }
  return INITIAL_PROJECTS;
}

export function saveStoredProjects(data) {
  try {
    localStorage.setItem(KEYS.PROJECTS, JSON.stringify(data));
  } catch (e) {
    console.warn('Projeler kaydedilemedi:', e);
  }
}

// TÜM VERİLERİ SIFIRLAMA
export function resetSiteStore() {
  try {
    localStorage.removeItem(KEYS.STUDIO);
    localStorage.removeItem(KEYS.TEAM);
    localStorage.removeItem(KEYS.REFERENCES);
    localStorage.removeItem(KEYS.SERVICES);
    localStorage.removeItem(KEYS.PROJECTS);
    localStorage.removeItem('gunerler_mimarlik_projects_v2');
    localStorage.removeItem('gunerler_mimarlik_projects_v1');
  } catch (e) {
    console.warn('Sıfırlama hatası:', e);
  }
}
