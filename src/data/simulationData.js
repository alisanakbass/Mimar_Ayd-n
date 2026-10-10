export const DEFAULT_SIMULATION_DATA = {
  blueprint: {
    tabLabel: '1. CAD Blueprint',
    title: '3D CAD Tel Kafes & Aks Çizimi',
    subtitle: 'Beylikdüzü Kırıklar İnşaat - İzometrik tel kafes (wireframe), aks koordinatları ve kat kotları',
    image: '/images/beylikduzu-kiriklar/kiriklar-cad-blueprint.jpg',
    badge: 'BIM / CAD v2.4 - 3D TEL KAFES',
    stats: [
      { label: 'Ölçek', val: '1:100 İzometrik' },
      { label: 'Cephe Yükseklik', val: '24.80 m (8 Kat)' },
      { label: 'Tel Kafes Ağı', val: '142.850 Poligon' }
    ],
    hotspots: [
      { top: '25%', left: '22%', title: 'Çatı Parapet Kotu', tag: '+24.80m Kot' },
      { top: '40%', left: '22%', title: '5. Kat Döşeme Kotu', tag: '+15.60m Kot' },
      { top: '75%', left: '24%', title: 'Zemin Ticari Giriş', tag: '±0.00m Kot' },
      { top: '88%', left: '60%', title: 'Cadde Cephe Genişliği', tag: '48.60m (9 Aks)' }
    ]
  },
  structure: {
    tabLabel: '2. Strüktür & Şantiye',
    title: 'Betonarme Karkas & Taşyünü Yalıtım',
    subtitle: 'C35/45 hazır beton, iskele kurulumu ve yangına dayanıklı taşyünü mantolama',
    image: '/images/beylikduzu-kiriklar/kiriklar-4.jpeg',
    badge: 'ŞANTİYE & TAŞYÜNÜ MANTOLAMA',
    stats: [
      { label: 'İskele Sistemi', val: 'Flanşlı Güvenlikli' },
      { label: 'Mantolama', val: '150 kg/m³ Taşyünü' },
      { label: 'Standart', val: 'İSG A+ Sınıfı' }
    ],
    hotspots: [
      { top: '35%', left: '40%', title: 'Taşyünü Cephe Yalıtımı', tag: 'A1 Sınıfı Yanmaz' },
      { top: '68%', left: '30%', title: 'Perde Duvar & Kolonlar', tag: 'C35/45 Betonarme' }
    ]
  },
  render: {
    tabLabel: '3. Realistik Cephe',
    title: 'Ultra-Lüks Nihai Dış Cephe & Çevre Düzenleme',
    subtitle: 'Fotogerçekçi 8K malzeme dokusu, antrasit kompozit, ahşap latalar ve vitrin aydınlatması',
    image: '/images/beylikduzu-kiriklar/kiriklar-sim-render.jpg',
    badge: 'FOTOGERÇEKÇİ 8K NİHAİ CEPHE',
    stats: [
      { label: 'Toplam Alan', val: '12.500 m² Brüt' },
      { label: 'Bağımsız Bölüm', val: '64 Daire + 8 Dükkan' },
      { label: 'Teslim Standardı', val: 'A+ Anahtar Teslim' }
    ],
    hotspots: [
      { top: '25%', left: '38%', title: 'Antrasit & Ahşap Kompozit', tag: 'Alüminyum Giydirme' },
      { top: '72%', left: '50%', title: 'Cadde Mağazaları & Vitrin', tag: 'Temperli Akustik Cam' }
    ]
  }
};

const STORAGE_KEY = 'gunerler_simulation_data_v3';

export function getSimulationData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return { ...DEFAULT_SIMULATION_DATA, ...parsed };
    }
  } catch (e) {
    console.warn('Simülasyon verisi okunamadı:', e);
  }
  return DEFAULT_SIMULATION_DATA;
}

export function saveSimulationData(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.warn('Simülasyon verisi kaydedilemedi:', e);
  }
}

export function resetSimulationData() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.warn('Simülasyon verisi sıfırlanamadı:', e);
  }
  return DEFAULT_SIMULATION_DATA;
}
