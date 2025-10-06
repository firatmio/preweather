# <img src="https://github.com/firatmio/preweather/blob/main/public/logo.png?raw=true" style="width: 36px; height: 36px"> PreWeather

> **Future Weather Predictions with NASA POWER API × Prophet ML**

PreWeather is an advanced web application that predicts future weather conditions using NASA’s POWER API and Facebook’s Prophet machine learning model.

[![Live Demo](https://img.shields.io/badge/demo-live-success)](https://preweather-nasa.vercel.app)
[![License](https://img.shields.io/badge/license-Apache%202.0-blue.svg)](LICENSE)
[![Made with React](https://img.shields.io/badge/Made%20with-React-61dafb.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue.svg)](https://www.typescriptlang.org/)

---

## ✨ Features

### 🎯 Core Features
- 🗺️ **Interactive Map**: Click anywhere on the world map powered by Leaflet  
- 🔍 **Address Search**: Global geocoding via OpenStreetMap Nominatim API  
- 📅 **Date Selection**: Forecasts available up to 365 days ahead  
- 🌡️ **8 Metrics**: Temperature, precipitation, humidity, wind, cloud cover, and more  
- 🤖 **AI Suggestions**: Multilingual agricultural insights via DeepL API  
- 📊 **Climate Data**: Visualization of historical data from the past 25 years  

### 🛠️ Technical Features
- ⚡ **React 19** & **TypeScript** for a modern architecture  
- 🌐 **Multilingual Support**: English & Turkish  
- 🔗 **URL State Management**: Shareable forecast URLs  
- 💾 **Local Storage**: Persistent user preferences  
- 📤 **Data Export**: JSON, CSV, PNG, and PDF formats  

---

## 🚀 Quick Start

### Requirements
- Node.js 18+
- npm or yarn
- Git

### Installation

```bash
git clone https://github.com/firatmio/preweather.git
cd preweather
npm install
cp .env.example .env.local
npm run dev
```

### Environment Variables

```env
VITE_AUTH_KEY=your-deepl-api-key
VITE_RUST_URL=your-backend-url
```

---

## 📦 Commands

```bash
npm run dev
npm run build
npm run preview
npm run lint
npx tsc --noEmit
```

---

## 🏗️ Project Structure

```
preweather/
├── api/
│   └── translate.ts
├── public/
│   ├── logo.ico
│   └── logo.png
├── src/
│   ├── assets/
│   ├── components/
│   │   └── Header/
│   ├── contexts/
│   │   └── TranslationContext.tsx
│   ├── pages/
│   │   ├── About/
│   │   ├── apis/
│   │   ├── app/
│   │   ├── DOCS/
│   │   └── Home/
│   ├── App.tsx
│   ├── index.css
│   └── main.tsx
├── .env.local
├── package.json
├── tsconfig.json
├── vite.config.ts
├── vercel.json
└── README.md
```

---

## 🌍 Technologies Used

### Frontend
- **React 19.1**
- **TypeScript 5.9**
- **Vite 7.1**
- **React Router 7.9**
- **Leaflet & React Leaflet**
- **Three.js**
- **React Icons**
- **jsPDF**

### APIs & Services
- **NASA POWER API**
- **DeepL API**
- **OpenStreetMap Nominatim**
- **Prophet ML Model**

### Deployment
- **Vercel**
- **Vercel Edge Network**

---

## 🎨 Feature Details

(Images and details same as Turkish version)

---

## 🔧 Configuration

### Vercel Deployment

```json
{
  "rewrites": [
    { "source": "/api/(.*)", "destination": "/api/$1" },
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

---

## 🚢 Deployment

```bash
npm i -g vercel
vercel login
vercel --prod
```

---

## 🤝 Contributing

1. Fork the repository  
2. Create a new branch  
3. Commit your changes  
4. Push and open a PR

---

## 📄 License

Apache License 2.0

---

## 👨‍💻 Developers

**Fırat Tuna Arslan**  
- GitHub: [@firatmio](https://github.com/firatmio)  
- Email: firattunaarslan@gmail.com  

**Arda Balcı**  
- GitHub: [@EdenBulurHakan59](https://github.com/EdenBulurHakan59)  
- Email: arda_balci24@trabzon.edu.tr  

---

## 🙏 Acknowledgements

- [NASA POWER Project](https://power.larc.nasa.gov/)  
- [Facebook Prophet](https://facebook.github.io/prophet/)  
- [OpenStreetMap](https://www.openstreetmap.org/)  
- [DeepL](https://www.deepl.com/)  
- [Vercel](https://vercel.com/)  

---

<div align="center">

**⭐ If you like this project, don’t forget to star it! ⭐**

Made with ❤️ and ☕ by [Fırat Tuna Arslan](https://github.com/firatmio)

</div>
