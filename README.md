# GÜNERLER MİMARLIK İNŞAAT & PEYZAJ - DEKORASYON
### Kurumsal Web Sitesi & Bağımsız Dijital Sunum Kataloğu

Bu proje iki bağımsız yapıdan oluşmaktadır:
1. **Ana Kurumsal Web Sitesi (`/`):** Günerler Mimarlık'ın hizmetlerini, vizyonunu ve referanslarını tanıtan modern mimari vitrin.
2. **Bağımsız Müşteri Kataloğu (`/katalog` veya `/katalog.html`):** Müşterilere doğrudan WhatsApp/E-posta ile gönderilebilen, tam ekran açılan lüks mimari lookbook/sunum sayfası ve tek tuşla A4 formatında **PDF İndirme / Yazdırma** aracı.

---

### 🚀 Hızlı Başlangıç

Geliştirme sunucusunu çalıştırmak için:
```bash
npm run dev
```
* **Ana Web Sitesi:** [http://localhost:5173/](http://localhost:5173/)
* **Bağımsız Sunum/Katalog:** [http://localhost:5173/katalog.html](http://localhost:5173/katalog.html)

Üretim derlemesi (Build):
```bash
npm run build
```

---

### 📷 Kolay Proje Ekleme & Fotoğraf Yükleme

Üst menüdeki artı `(+)` ikonuna tıklayarak açılan yönetim panelinde:
* URL aramakla uğraşmadan doğrudan **bilgisayarınızdan veya telefonunuzdan 1-2 fotoğraf seçebilirsiniz**.
* Fotoğraflar otomatik olarak **Supabase Storage** (`project-images` deposuna) yüklenir.
* Proje eklendiği anda hem ana sitede hem de `/katalog` sayfasında otomatik güncellenir.

---

### 🗄️ Supabase Kurulumu

`supabase_schema.sql` dosyasındaki SQL kodlarını Supabase projenizdeki **SQL Editor** sekmesine yapıştırıp çalıştırınız.

`.env` dosyanıza Supabase bilgilerinizi ekleyin:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

---

### 🌐 Netlify Dağıtımı (Deployment)

1. GitHub deponuzu Netlify'a bağlayın.
2. Build Command: `npm run build`
3. Publish Directory: `dist`
4. Netlify Environment Variables alanına `VITE_SUPABASE_URL` ve `VITE_SUPABASE_ANON_KEY` ekleyin.
5. Müşterilerinize paylaşacağınız link: `https://siteniz.netlify.app/katalog`
