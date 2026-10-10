import { createClient } from '@supabase/supabase-js';
import { INITIAL_PROJECTS } from '../data/initialProjects';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  supabaseUrl.trim() !== '' && 
  supabaseAnonKey.trim() !== '' &&
  !supabaseUrl.includes('your-project-id')
);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// LOCAL STORAGE ANAHTARLARI (Supabase henüz bağlanmadığında veya çevrimdışı fallback olarak)
const STORAGE_KEY_PROJECTS = 'gunerler_mimarlik_projects_v2';
const STORAGE_KEY_INQUIRIES = 'gunerler_mimarlik_inquiries_v2';

// FOTOĞRAF YÜKLEME YARDIMCISI (Supabase Storage veya Base64 Çevrimdışı Modu)
export async function uploadProjectImage(file) {
  if (!file) return null;

  // 1. Supabase Storage yüklenebiliyorsa
  if (isSupabaseConfigured && supabase) {
    try {
      const cleanName = file.name.replace(/[^a-zA-Z0-9.]/g, '_');
      const filePath = `uploads/${Date.now()}_${cleanName}`;

      const { data, error } = await supabase.storage
        .from('project-images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (!error && data) {
        const { data: { publicUrl } } = supabase.storage
          .from('project-images')
          .getPublicUrl(filePath);

        return publicUrl;
      } else {
        console.warn('Supabase storage upload hatası, base64 fallback yapılıyor:', error);
      }
    } catch (e) {
      console.warn('Supabase upload exception:', e);
    }
  }

  // 2. Fallback: Base64 Data URL (Kullanıcı Supabase Storage açmamışsa bile fotoğraf anında çalışır)
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      resolve(reader.result);
    };
    reader.readAsDataURL(file);
  });
}

export const LEGACY_MOCK_KEYWORDS = [
  'göl vadisi',
  'marmara sahil',
  'alkent panorama',
  'botanica',
  'marina plaza',
  'taş cepheli'
];

export const isLegacyMockProject = (p) => {
  if (!p) return false;
  const title = (p.title || '').toLowerCase();
  const id = (p.id || '').toString();
  return LEGACY_MOCK_KEYWORDS.some(k => title.includes(k)) || /^proj-[1-6]$/.test(id);
};

// 1. PROJELERİ GETİR
export async function getProjects() {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('order_index', { ascending: true });

      if (error) {
        console.warn('Supabase projects çekilirken hata oluştu, yerel veriye geçiliyor:', error);
      } else if (data && data.length > 0) {
        const cleanSupabaseData = data.filter(p => !isLegacyMockProject(p));
        return cleanSupabaseData.length > 0 ? cleanSupabaseData : INITIAL_PROJECTS;
      }
    } catch (err) {
      console.warn('Supabase bağlantı hatası:', err);
    }
  }

  // Fallback: LocalStorage veya Initial Data
  const saved = localStorage.getItem(STORAGE_KEY_PROJECTS);
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      // Eski sahte projeleri (Göl Vadisi vb.) tamamen filtrele
      const cleaned = parsed.filter(p => !isLegacyMockProject(p));

      // Başlangıç projelerinin güncellenen alanlarını (kapak fotoğrafı vb.) yerel depoyla senkronize et
      const updated = cleaned.map(p => {
        const initial = INITIAL_PROJECTS.find(ip => ip.id === p.id);
        return initial ? { ...p, ...initial } : p;
      });
      const missingInitial = INITIAL_PROJECTS.filter(ip => !updated.some(p => p.id === ip.id));
      const merged = [...missingInitial, ...updated].filter(p => !isLegacyMockProject(p));
      localStorage.setItem(STORAGE_KEY_PROJECTS, JSON.stringify(merged));
      return merged;
    } catch (e) {
      console.error('Local projects parse hatası:', e);
    }
  }

  // İlk defa açılıyorsa başlangıç projelerini kaydet
  localStorage.setItem(STORAGE_KEY_PROJECTS, JSON.stringify(INITIAL_PROJECTS));
  return INITIAL_PROJECTS;
}

// 2. YENİ PROJE EKLE
export async function addProject(projectData) {
  const newProject = {
    id: 'proj-' + Date.now(),
    created_at: new Date().toISOString(),
    ...projectData
  };

  // Supabase'e kaydetmeyi dene
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('projects')
        .insert([newProject])
        .select();

      if (!error && data && data.length > 0) {
        return { success: true, data: data[0] };
      }
      console.warn('Supabase ekleme uyarısı:', error);
    } catch (err) {
      console.warn('Supabase hatası:', err);
    }
  }

  // Fallback: LocalStorage'a kaydet
  const existing = await getProjects();
  const updated = [newProject, ...existing];
  localStorage.setItem(STORAGE_KEY_PROJECTS, JSON.stringify(updated));
  return { success: true, data: newProject, isLocal: true };
}

// 3. PROJE SİL
export async function removeProject(id) {
  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('projects').delete().eq('id', id);
    } catch (err) {
      console.warn('Supabase silme hatası:', err);
    }
  }

  const existing = await getProjects();
  const filtered = existing.filter(p => p.id !== id);
  localStorage.setItem(STORAGE_KEY_PROJECTS, JSON.stringify(filtered));
  return { success: true };
}

// 4. PROJE DÜZENLE / GÜNCELLE
export async function updateProject(id, updatedData) {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('projects')
        .update(updatedData)
        .eq('id', id)
        .select();

      if (!error && data && data.length > 0) {
        const existing = await getProjects();
        const updatedList = existing.map(p => p.id === id ? { ...p, ...data[0] } : p);
        localStorage.setItem(STORAGE_KEY_PROJECTS, JSON.stringify(updatedList));
        return { success: true, data: data[0] };
      }
      console.warn('Supabase güncelleme hatası:', error);
    } catch (err) {
      console.warn('Supabase updateProject hatası:', err);
    }
  }

  // Fallback: Yerel Depolamada Güncelle
  const existing = await getProjects();
  const updatedList = existing.map(p => p.id === id ? { ...p, ...updatedData } : p);
  localStorage.setItem(STORAGE_KEY_PROJECTS, JSON.stringify(updatedList));
  const updatedItem = updatedList.find(p => p.id === id) || { id, ...updatedData };
  return { success: true, data: updatedItem, isLocal: true };
}

// 4. İLETİŞİM / TEKLİF FORMU GÖNDER
export async function sendInquiry(inquiryData) {
  const record = {
    id: 'inq-' + Date.now(),
    created_at: new Date().toISOString(),
    ...inquiryData
  };

  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('inquiries')
        .insert([record])
        .select();

      if (!error) {
        return { success: true, data: data };
      }
      console.warn('Supabase inquiry hatası:', error);
    } catch (err) {
      console.warn('Supabase inquiry bağlantı sorunu:', err);
    }
  }

  // Fallback: Yerel kaydet
  const saved = localStorage.getItem(STORAGE_KEY_INQUIRIES);
  const list = saved ? JSON.parse(saved) : [];
  list.unshift(record);
  localStorage.setItem(STORAGE_KEY_INQUIRIES, JSON.stringify(list));
  return { success: true, isLocal: true };
}
