-- ==============================================================================
-- MİMAR AYDIN - SUPABASE VERİTABANI ŞEMASI VE TABLOLARI
-- ==============================================================================
-- Bu SQL kodlarını Supabase projenizdeki "SQL Editor" sekmesine yapıştırıp
-- "RUN" butonuna basarak tek seferde tüm tabloları oluşturabilirsiniz.
-- ==============================================================================

-- 1. PROJELER TABLOSU
CREATE TABLE IF NOT EXISTS public.projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    category TEXT NOT NULL, -- 'Villa & Konut', 'Ticari & Ofis', 'İç Mimarlık', 'Restorasyon'
    location TEXT NOT NULL, -- Örn: 'Bodrum, Muğla'
    year TEXT NOT NULL,     -- Örn: '2024'
    area TEXT NOT NULL,     -- Örn: '650 m²'
    status TEXT DEFAULT 'Tamamlandı', -- 'Tamamlandı', 'Devam Ediyor', 'Konsept'
    cover_image TEXT NOT NULL,
    images TEXT[] DEFAULT ARRAY[]::TEXT[],
    description TEXT,
    concept_brief TEXT,
    client TEXT,
    is_featured BOOLEAN DEFAULT true,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. İLETİŞİM & KEŞİF TALEPLERİ TABLOSU
CREATE TABLE IF NOT EXISTS public.inquiries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    project_type TEXT,
    approx_area TEXT,
    message TEXT NOT NULL,
    status TEXT DEFAULT 'Yeni', -- 'Yeni', 'İncelendi', 'Geri Dönüldü'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. OFİS BİLGİLERİ & KATALOG AYARLARI TABLOSU
CREATE TABLE IF NOT EXISTS public.firm_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    studio_name TEXT DEFAULT 'Mimar Aydın',
    tagline TEXT DEFAULT 'Zamansız Çizgiler, Yaşayan Mekânlar',
    phone TEXT DEFAULT '+90 (212) 555 01 98',
    whatsapp TEXT DEFAULT '+90 (532) 555 01 98',
    email TEXT DEFAULT 'info@mimaraydin.com',
    address TEXT DEFAULT 'Teşvikiye Mah. Valikonağı Cad. No:42/4 Nişantaşı, İstanbul',
    instagram TEXT DEFAULT 'https://instagram.com/mimaraydin',
    linkedin TEXT DEFAULT 'https://linkedin.com/company/mimaraydin',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- RLS (ROW LEVEL SECURITY) POLİTİKALARI
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.firm_settings ENABLE ROW LEVEL SECURITY;

-- Projeleri herkes okuyabilir (ziyaretçiler görebilsin)
CREATE POLICY "Projeleri herkes okuyabilir" 
ON public.projects FOR SELECT USING (true);

-- Proje ekleme/düzenleme/silme (anon / admin)
CREATE POLICY "Projeleri yönetme izni" 
ON public.projects FOR ALL USING (true) WITH CHECK (true);

-- İletişim formunu herkes doldurabilir (INSERT)
CREATE POLICY "Herkes teklif formu gönderebilir" 
ON public.inquiries FOR INSERT WITH CHECK (true);

CREATE POLICY "İletişim taleplerini okuma" 
ON public.inquiries FOR SELECT USING (true);

-- 4. FOTOĞRAF DEPOLAMA (SUPABASE STORAGE)
INSERT INTO storage.buckets (id, name, public)
VALUES ('project-images', 'project-images', true)
ON CONFLICT (id) DO NOTHING;

-- Fotoğrafları herkesin görebilmesi için okuma izni
CREATE POLICY "Fotoğrafları herkes görebilir"
ON storage.objects FOR SELECT
USING (bucket_id = 'project-images');

-- Panelden fotoğraf yükleme izni
CREATE POLICY "Herkes fotoğraf yükleyebilir"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'project-images');

-- ÖRNEK BAŞLANGIÇ VERİLERİ (SEED DATA)
INSERT INTO public.projects (title, category, location, year, area, status, cover_image, images, description, concept_brief, client, is_featured, order_index)
VALUES 
(
    'Villa Monolith', 
    'Villa & Konut', 
    'Bodrum, Yalıkavak', 
    '2024', 
    '720 m²', 
    'Tamamlandı',
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=80',
    ARRAY[
        'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=80',
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80',
        'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1600&q=80',
        'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1600&q=80'
    ],
    'Ege topoğrafyasına saygılı, brüt beton ve yerel taşın heykelsi birleşimiyle kurgulanmış lüks rezidans projesi. Ege denizi manzarasına geniş açıklıklarla açılan cephe tasarımı.',
    'Doğal kaya formasyonları ile bütünleşen yatay kütle kompozisyonu, gün ışığının kontrollü filtrelenmesi ve sürdürülebilir mikroklima yaratılması hedeflenmiştir.',
    'Özel Müşteri',
    true,
    1
),
(
    'Artisan Loft & Studio', 
    'İç Mimarlık', 
    'Bebek, İstanbul', 
    '2023', 
    '340 m²', 
    'Tamamlandı',
    'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1600&q=80',
    ARRAY[
        'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1600&q=80',
        'https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?auto=format&fit=crop&w=1600&q=80',
        'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1600&q=80'
    ],
    'Boğaz manzaralı tarihi bir dairenin modern sanat koleksiyoneri için yeniden yorumlanan iç mimari ve restorasyon projesi. Doğal ceviz kaplamalar ve ham traverten şömine detayları.',
    'Açık plan şemasında akustik ve mekânsal akıcılık ön planda tutulmuş, heykelsi ışık hatları ile alanın ruhu zenginleştirilmiştir.',
    'Koleksiyoner Rezidansı',
    true,
    2
),
(
    'Nexus Business Hub', 
    'Ticari & Ofis', 
    'Maslak, İstanbul', 
    '2024', 
    '4.200 m²', 
    'Tamamlandı',
    'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=80',
    ARRAY[
        'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=80',
        'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1600&q=80',
        'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=1600&q=80'
    ],
    'Yeni nesil hibrit çalışma dinamiklerini destekleyen, biyo-filik iç bahçeler ve yüksek enerji verimliliğine sahip LEED sertifikalı genel merkez binası mimarisi.',
    'Çalışan refahını artıran parametrik cephe güneş kırıcıları ve esnek çalışma atriyumları.',
    'Nexus Yatırım Holding',
    true,
    3
),
(
    'Piazza Stone Residence', 
    'Villa & Konut', 
    'Alaçatı, Çeşme', 
    '2023', 
    '520 m²', 
    'Tamamlandı',
    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1600&q=80',
    ARRAY[
        'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1600&q=80',
        'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1600&q=80'
    ],
    'Geleneksel taş işçiliği ile çağdaş minimalist hacimlerin iç içe geçtiği avlulu sahil villası. Yüzme havuzu ile bütünleşen geniş saçaklar ve gölgelikli verandalar.',
    'İç ve dış mekân sınırlarını yok eden kayar cam cepheler ve yerel Alaçatı taşının zanaatkârane kullanımı.',
    'Özel Rezidans',
    true,
    4
),
(
    'Miras Konağı Restorasyonu', 
    'Restorasyon', 
    'Kuzguncuk, İstanbul', 
    '2022', 
    '480 m²', 
    'Tamamlandı',
    'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=1600&q=80',
    ARRAY[
        'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=1600&q=80',
        'https://images.unsplash.com/photo-1541123437800-1bb1317badc2?auto=format&fit=crop&w=1600&q=80'
    ],
    '19. yüzyıl sonu Osmanlı sivil mimarlık örneği ahşap köşkün aslına sadık kalınarak güçlendirilmesi, cephe süslemelerinin ihyası ve çağdaş konfor standartlarıyla donatılması.',
    'Geleneksel bağdadi çıtalama teknikleri ve orijinal ahşap elemanların mikroskobik analizlerle koruma altına alınması.',
    'Vakıf & Aile Mülkiyeti',
    true,
    5
);
