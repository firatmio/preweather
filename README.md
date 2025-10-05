# <img src="https://github.com/firatmio/preweather/blob/main/public/logo.png?raw=true" style="width: 36px; height: 36px"> PreWeather

> **NASA POWER API × Prophet ML ile Gelecek Hava Durumu Tahminleri**

PreWeather, NASA'nın POWER API'sini ve Facebook'un Prophet makine öğrenimi modelini kullanarak gelecek tarihler için hava durumu tahminleri yapan gelişmiş bir web uygulamasıdır.

[![Live Demo](https://img.shields.io/badge/demo-live-success)](https://preweather-nasa.vercel.app)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Made with React](https://img.shields.io/badge/Made%20with-React-61dafb.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue.svg)](https://www.typescriptlang.org/)

---

## ✨ Özellikler

### 🎯 Temel Özellikler
- 🗺️ **İnteraktif Harita**: Leaflet tabanlı dünya haritasında istediğiniz noktaya tıklayın
- 🔍 **Adres Arama**: OpenStreetMap Nominatim API ile dünya çapında konum arama
- 📅 **Tarih Seçimi**: 365 gün ileriye kadar tahmin yapma imkanı
- 🌡️ **8 Farklı Metrik**: Sıcaklık, yağış, nem, rüzgar, bulutluluk ve daha fazlası
- 🤖 **AI Önerileri**: DeepL API ile çok dilli tarımsal öneriler
- 📊 **İklim Verileri**: 1981-2010 yılları arası geçmiş veriler ve görselleştirme

### 🛠️ Teknik Özellikler
- ⚡ **React 19** & **TypeScript** ile modern mimari
- 🎨 **Responsive Design**: Mobil, tablet ve masaüstü uyumlu
- 🌐 **Çok Dilli**: Türkçe & İngilizce desteği
- 🔗 **URL State Management**: Paylaşılabilir linkler
- 💾 **Local Storage**: Tercih hatırlama
- 📤 **Veri Dışa Aktarma**: JSON, CSV, PNG, PDF formatları
- 🎭 **3D Animasyonlar**: Three.js ile görsel efektler

---

## 🚀 Hızlı Başlangıç

### Gereksinimler
- Node.js 18+ 
- npm veya yarn
- Git

### Kurulum

```bash
# Repository'yi klonlayın
git clone https://github.com/firatmio/preweather.git
cd preweather

# Bağımlılıkları yükleyin
npm install

# Environment değişkenlerini ayarlayın
cp .env.example .env.local
# .env.local dosyasını düzenleyin (aşağıya bakın)

# Development sunucusunu başlatın
npm run dev
```

### Environment Değişkenleri

`.env.local` dosyası oluşturun ve aşağıdaki değişkenleri ekleyin:

```env
# DeepL API Key (Çeviri için)
VITE_AUTH_KEY=your-deepl-api-key

# Backend API URL (Prophet ML servisi)
VITE_RUST_URL=your-backend-url
```

**DeepL API Key Alma:**
1. [DeepL](https://www.deepl.com/pro-api) hesabı oluşturun
2. Free tier ile ayda 500,000 karakter ücretsiz
3. API key'i kopyalayın

---

## 📦 Komutlar

```bash
# Development sunucusu (http://localhost:5173)
npm run dev

# Production build
npm run build

# Build önizleme
npm run preview

# Linting
npm run lint

# Type check
npx tsc --noEmit
```

---

## 🏗️ Proje Yapısı

```
preweather/
├── api/                      # Vercel Serverless Functions
│   └── translate.ts          # DeepL API proxy
├── public/                   # Static assets
│   ├── logo.ico
│   └── logo.png
├── src/
│   ├── assets/               # Images, fonts
│   ├── components/           # React components
│   │   └── Header/           # Navigation header
│   ├── contexts/             # React contexts
│   │   └── TranslationContext.tsx  # i18n
│   ├── pages/                # Route pages
│   │   ├── About/            # Hakkında sayfası
│   │   ├── apis/             # API listesi
│   │   ├── app/              # Ana uygulama
│   │   ├── DOCS/             # Dokümantasyon
│   │   └── Home/             # Landing page
│   ├── App.css
│   ├── App.tsx               # Route definitions
│   ├── index.css             # Global styles
│   ├── Layout.tsx            # Layout wrapper
│   └── main.tsx              # Entry point
├── .env.local                # Environment variables (git ignored)
├── package.json
├── tsconfig.json
├── vite.config.ts
├── vercel.json               # Vercel deployment config
└── README.md
```

---

## 🌍 Kullanılan Teknolojiler

### Frontend
- **React 19.1** - UI library
- **TypeScript 5.9** - Type safety
- **Vite 7.1** - Build tool & dev server
- **React Router 7.9** - Client-side routing
- **Leaflet & React Leaflet** - Interactive maps
- **Three.js** - 3D graphics
- **React Icons** - Icon library
- **jsPDF** - PDF generation

### APIs & Services
- **NASA POWER API** - Meteoroloji ve iklim verileri
- **DeepL API** - Çeviri servisi
- **OpenStreetMap Nominatim** - Geocoding
- **Prophet ML Model** - Zaman serisi tahminleri (Backend)

### Deployment
- **Vercel** - Hosting & serverless functions
- **Vercel Edge Network** - Global CDN

---

## 📊 Metrikler

PreWeather aşağıdaki meteoroloji metriklerini tahmin eder:

| Metrik | Açıklama | Birim |
|--------|----------|-------|
| **T2M** | 2m yükseklikteki hava sıcaklığı | °C / °F |
| **PRECTOTCORR** | Toplam yağış miktarı | mm/gün |
| **RH2M** | Bağıl nem | % |
| **WS2M** | Rüzgar hızı | m/s / km/h |
| **QV2M** | Özgül nem | g/kg |
| **T2MDEW** | Çiğ noktası sıcaklığı | °C |
| **CLOUD_AMT** | Bulut miktarı | % |
| **ALLSKY_SFC_SW_DWN** | Güneş radyasyonu | kWh/m²/gün |

---

## 🎨 Özellik Detayları

### 1. İnteraktif Harita
- Dünya çapında herhangi bir noktaya tıklayın
- Otomatik reverse geocoding ile adres tespiti
- Su alanı kontrolü
- Zoom ve pan özellikleri

### 2. Tarih Seçimi
- Modern takvim picker
- Sadece gelecek tarihler seçilebilir
- Maksimum 365 gün ileri
- Format: DD.MM.YYYY

### 3. Tahmin Sonuçları
- 8 farklı metrik için tahmin değerleri
- Görsel hava durumu ikonları
- Güvenilirlik skorları
- AI destekli tarımsal öneriler

### 4. İklim Verileri
- 1981-2010 yılları arası geçmiş veriler
- İnteraktif çizgi grafikler
- Metrik seçimi
- PNG & PDF export

### 5. Çok Dilli Destek
- Türkçe & İngilizce
- DeepL API ile yüksek kaliteli çeviri
- Otomatik dil algılama

### 6. URL State Management
```
/app?lat=39.925533&lng=32.866287&date=2025-10-15
```
- Paylaşılabilir linkler
- Tarayıcı geçmişi desteği
- Bookmark edilebilir

---

## 🔧 Konfigürasyon

### Vercel Deployment

`vercel.json`:
```json
{
  "rewrites": [
    { "source": "/api/(.*)", "destination": "/api/$1" },
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

### Vite Config

`vite.config.ts`:
```typescript
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true
  }
})
```

---

## 🚢 Deployment

### Vercel'e Deploy

```bash
# Vercel CLI yükle
npm i -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

**Environment Variables (Vercel Dashboard):**
1. Settings → Environment Variables
2. `VITE_AUTH_KEY` ekle
3. Production, Preview, Development seç
4. Redeploy

### Manuel Build

```bash
npm run build
# dist/ klasörü oluşur
# Bu klasörü herhangi bir static hosting'e deploy edin
```

---

## 🤝 Katkıda Bulunma

Katkılarınızı bekliyoruz! 

1. Fork edin
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit edin (`git commit -m 'feat: add amazing feature'`)
4. Push edin (`git push origin feature/amazing-feature`)
5. Pull Request açın

### Commit Kuralları
- `feat:` Yeni özellik
- `fix:` Bug düzeltme
- `docs:` Dokümantasyon
- `style:` Stil değişiklikleri
- `refactor:` Kod yeniden yapılandırma
- `test:` Test ekleme
- `chore:` Diğer değişiklikler

---

## 🐛 Bilinen Sorunlar

- [ ] Safari'de bazı CSS animasyonları optimize edilmeli
- [ ] Mobilde harita performansı iyileştirilebilir
- [ ] PDF export için daha fazla format seçeneği eklenebilir

---

## 📈 Yol Haritası

### v1.1 (Q1 2025)
- [ ] Batch prediction (çoklu nokta)
- [ ] Grafik karşılaştırma
- [ ] Email export
- [ ] Dark mode

### v1.2 (Q2 2025)
- [ ] Kullanıcı hesapları
- [ ] Tahmin geçmişi
- [ ] Favori lokasyonlar
- [ ] API rate limiting

### v2.0 (Q3 2025)
- [ ] Mobil app (React Native)
- [ ] Push notification
- [ ] Offline mode
- [ ] Advanced analytics

---

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır. Detaylar için [LICENSE](LICENSE) dosyasına bakın.

---

## 👨‍💻 Geliştirici

**Fırat Tuna Arslan**
- GitHub: [@firatmio](https://github.com/firatmio)
- Email: firattunaarslan@gmail.com

---

## 🙏 Teşekkürler

- [NASA POWER Project](https://power.larc.nasa.gov/) - Meteoroloji verileri
- [Facebook Prophet](https://facebook.github.io/prophet/) - ML modeli
- [OpenStreetMap](https://www.openstreetmap.org/) - Harita verileri
- [DeepL](https://www.deepl.com/) - Çeviri servisi
- [Vercel](https://vercel.com/) - Hosting

---

## 📞 İletişim & Destek

- 🐛 **Bug Report**: [Issues](https://github.com/firatmio/preweather/issues)
- 💡 **Feature Request**: [Discussions](https://github.com/firatmio/preweather/discussions)
- 📧 **Email**: your-email@example.com
- 🌐 **Website**: [preweather.vercel.app](https://preweather-nasa.vercel.app)

---

<div align="center">

**⭐ Beğendiyseniz yıldız vermeyi unutmayın! ⭐**

Made with ❤️ and ☕ by [Fırat Tuna Arslan](https://github.com/firatmio)

</div>
