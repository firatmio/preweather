import { createContext, useContext, useEffect, useState } from 'react'

export type Language = 'en' | 'tr'

interface TranslationContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const TranslationContext = createContext<TranslationContextType | undefined>(
  undefined,
)

const translations = {
  tr: {
    'app.climateInfo': 'Geçmiş Hava Verileri',
    'app.climate.selectData': 'Gösterilecek Veriler',
    'nav.about': 'Hakkında',
    'nav.apis': "API'ler",
    'nav.docs': 'Dokümantasyon',
    'nav.app': 'Uygulama',

    // Home Page
    'home.badge': 'NASA API × Prophet ML',
    'home.title.main': 'Geleceğin Hava Durumunu',
    'home.title.gradient': 'Tahmin Et',
    'home.description':
      "NASA'nın POWER API sini ve Prophet makine öğrenimi modeliyle gelecek tarihlerde hava durumu tahminleri yapın. Sadece geçmiş verileri görmekle kalmayın, geleceği öngörün.",
    'home.cta.start': 'Tahmine Başla',
    'home.cta.how': 'Nasıl Çalışır?',

    'home.feature1.title': 'NASA API Gücü',
    'home.feature1.desc':
      "NASA'nın kapsamlı meteoroloji ve uydu verilerini kullanarak en doğru tahminleri üretin.",
    'home.feature2.title': 'Prophet ML Modeli',
    'home.feature2.desc':
      "Facebook'un geliştirdiği Prophet ile gelecek tarihler için güvenilir tahminler oluşturun.",
    'home.feature3.title': 'Gelecek Tahminleri',
    'home.feature3.desc':
      'Sadece bugünü değil, gelecek haftaları ve ayları tahmin edin. Planlama yapın.',

    'home.features.title': 'Neden PreWeather?',

    'home.stats.datapoints': 'Veri',
    'home.stats.accuracy': 'Ortalama Doğruluk Oranı',
    'home.stats.forecast': 'İleri Tahmin',
    'home.stats.days': 'Gün',

    'home.cta.title': 'Hava Durumunun Geleceğini Keşfet',
    'home.cta.description':
      'Tahminlerinizi yapmaya başlayın ve veriye dayalı kararlar alın.',
    'home.cta.button': 'Şimdi Dene',

    'home.weather.sunny': 'Güneşli',
    'home.weather.rainy': 'Yağmurlu',
    'home.weather.stormy': 'Fırtınalı',

    'about.title': 'Hakkımızda',
    'about.description':
      "PreWeather, NASA API'leri ve Prophet tahmin modeli ile gelecek tarihli hava durumu öngörüleri sunar.",
    'about.badge': 'PreWeather Misyonu',
    'about.mission.title': 'Misyonumuz',
    'about.mission.text':
      'Geleceğin hava durumunu daha erişilebilir, anlaşılır ve tahmin edilebilir kılmak için NASA verisi + makine öğrenimi + öngörüsel modelleme bir arada.',
    'about.mission.data': 'Veri Kaynağı',
    'about.mission.data.desc':
      'NASA uydu ve gözlem verileri ile bilimsel doğruluk.',
    'about.mission.ai': 'Tahmin Motoru',
    'about.mission.ai.desc':
      'Prophet tabanlı zaman serisi modelleme ile ileri tarih öngörüleri.',
    'about.mission.accuracy': 'Tutarlılık',
    'about.mission.accuracy.desc':
      'Model performansını ölçen sürekli validasyon ve geri besleme döngüsü.',
    'about.mission.scalable': 'Genişleyebilirlik',
    'about.mission.scalable.desc':
      'Modüler API yapısı ile yeni veri kaynaklarını entegre etmeye hazır.',
    'about.roadmap.title': 'Yol Haritası',
    'about.roadmap.text':
      'Ürünün evrimi: çekirdekten ileri analitik yeteneklere.',
    'about.roadmap.phase1': 'Çekirdek Altyapı',
    'about.roadmap.phase1.desc':
      'NASA API entegrasyonu, temel tahmin pipeline, çok dilli arayüz.',
    'about.roadmap.phase2': 'Model İyileştirme',
    'about.roadmap.phase2.desc':
      'Ek zaman serisi bileşenleri, mevsimsellik ince ayarı, hata analiz panelleri.',
    'about.roadmap.phase3': 'Gelişmiş Görselleştirme',
    'about.roadmap.phase3.desc':
      'Harita tabanlı tahmin katmanı, anomaly highlight, interaktif senaryo.',
    'about.roadmap.phase4': 'Ekosistem & API',
    'about.roadmap.phase4.desc':
      'Geliştirici API anahtarları, webhook desteği, entegrasyon kitleri.',
    'about.call.title': 'Geleceği Birlikte Tahmin Edelim',
    'about.call.text':
      'PreWeather sürekli gelişiyor. Geri bildiriminiz, doğruluk ve kapsamın artmasına katkı sağlar.',
    'about.call.docs': 'Dokümantasyona Git',
    'about.call.try': 'Uygulamayı Deneyin',

    'docs.title': 'Dokümantasyon',
    'docs.description':
      'API kullanımı ve özellikler hakkında detaylı bilgiler.',

    'apis.title': "API'ler",
    'apis.description': "Kullanılabilir NASA API'lerinin listesi.",

    'app.title': 'PreWeather Uygulaması',
    'app.description': 'Hava durumu verilerine erişin.',
    'app.select.title': 'Konum Seç',
    'app.select.desc':
      'Haritaya tıklayarak bir konum seç. Ardından tarih belirleyip tahmin al.',
    'app.location.title': 'Konum',
    'app.lat': 'Enlem:',
    'app.lng': 'Boylam:',
    'app.date': 'Tarih',
    'app.result.title': 'Tahmin',
    'app.result.targetDate': 'Hedef Tarih:',
    'app.result.temperature': 'Sıcaklık:',
    'app.result.humidity': 'Nem:',
    'app.result.summary.placeholder': 'Model tahmini örnek veri (placeholder)',
    'app.predict.button': 'Tahmin Et',
    'app.predict.loading': 'Tahmin Ediliyor...',
    'app.error.unknown': 'Bilinmeyen hata',
    'app.error.general': 'Bir hata oluştu. Lütfen tekrar deneyin.',
    'app.error.network': 'Ağ bağlantı hatası',
    'app.footer.placeholder': 'API endpoint henüz bağlanmadı (placeholder)',
    'app.home.back': 'Ana sayfaya geri dön.',
    'app.current.page': 'Bu sayfadasın zaten.',
    'app.results.check': 'Sonuçlar Var mı?',
    'app.results.checking': 'Kontrol Ediliyor...',
    'app.results.fetch': 'Tahmini Et',
    'app.results.loading': 'Tahmin Yükleniyor...',
    'app.results.title': 'Tahmin Sonuçları',
    'app.gelismis.title': 'Gelişmiş',
    'app.results.none': 'Henüz sonuç yok',
    'app.results.metrics': 'Metrix Seçimi',
    'app.results.toggleAll': 'Hepsini Aç/Kapat',
    'app.results.advice': 'Tarımsal Tavsiye',
    'app.results.downloadCSV': 'CSV İndir',
    'app.results.downloadJSON': 'JSON İndir',
    'app.results.overallAccuracy': 'Genel Doğruluk',
    'app.results.overallError': 'Genel Hata',
    'app.results.aiInsights': 'AI Öngörüleri',
    'advice.showRaw': 'Ham JSON Göster',
    'advice.hideRaw': 'Ham JSON Gizle',
    'advice.yorum': 'Yorum',
    'advice.öneri': 'Öneri',
    'advice.comment': 'Comment',
    'advice.advice': 'Advice',
    'advice.summary': 'Özet',
    'advice.risks': 'Riskler',
    'advice.recommendations': 'Öneriler',
    'advice.actions': 'Aksiyonlar',
    'advice.notes': 'Notlar',
    'addr.placeholder': 'Adres ara...',
    'addr.searching': 'Aranıyor...',
    'addr.noResults': 'Sonuç yok',
    'addr.editHint': 'Düzenlemek için tıkla',
    'addr.reverseError': 'Adres alınamadı',
    'addr.invalidMessage':
      'Geçerli bir kara adresi bulunamadı. Yeni bir nokta seçin veya adres arayın.',
    'addr.enterPlaceholder': 'Konum Girin',
    'addr.waterDetected': 'Su alanı algılandı',
    'addr.serverError': 'Adres servisi geçici hata verdi',
    'app.results.readableTitle': 'Özet Tahminler',
    'app.results.reliability': 'Güvenilirlik',
    'app.today': 'Bugün',
    'app.clear': 'Temizle',
    'app.date.select': 'Tarih Seç',
    'app.results.noData': 'Veri bulunamadı',
    'datePicker.dialogLabel': 'Tarih Seçici',
    'datePicker.prevMonth': 'Önceki Ay',
    'datePicker.nextMonth': 'Sonraki Ay',
    'datePicker.close': 'Kapat',
    'unit.celsius': '°C',
    'unit.fahrenheit': '°F',
    'unit.toggleLabel': 'Birimler',
    'metricDesc.T2M': 'Ortalama hava sıcaklığı',
    'metricDesc.T2M_MAX': 'Gün içindeki maksimum sıcaklık',
    'metricDesc.T2M_MIN': 'Gün içindeki minimum sıcaklık',
    'metricDesc.WS2M': 'Yaklaşık yüzey rüzgar hızı',
    'metricDesc.PRECTOTCORR': 'Toplam yağış miktarı',
    'metricDesc.SNODP': 'Kar kalınlığı / kar örtüsü',
    'metricDesc.RH2M': 'Bağıl nem oranı',
    'metricDesc.ALLSKY_KT': 'Güneşlenme (All-sky) indeks yüzdesi',
    '404.title': 'Sayfa bulunamadı',
    '404.desc':
      'Aradığınız sayfa taşınmış, silinmiş ya da hiç var olmamış olabilir.',
    '404.home': 'Ana Sayfa',
    '404.app': 'Uygulama',
    '404.hint':
      "URL'yi kontrol edebilir veya yukarıdaki bağlantılardan devam edebilirsiniz.",
    'metric.ALLSKY_KT': 'Güneşlenme İndisi (ALLSKY_KT)',
    'metric.AOD_55_ADJ': 'Aerosol Optik Derinliği (AOD_55_ADJ)',
    'metric.CDD18_3': 'Soğutma Derece Günü (CDD18_3)',
    'metric.FROST_DAYS': 'Don Gün Sayısı (FROST_DAYS)',
    'metric.HDD18_3': 'Isıtma Derece Günü (HDD18_3)',
    'metric.PRECSNOLAND': 'Kar Yağışı (PRECSNOLAND)',
    'metric.PRECTOTCORR': 'Toplam Yağış (PRECTOTCORR)',
    'metric.RH2M': 'Bağıl Nem (RH2M)',
    'metric.SNODP': 'Kar Derinliği (SNODP)',
    'metric.T2M': 'Ortalama Sıcaklık (T2M)',
    'metric.T2M_MAX': 'Maks Sıcaklık (T2M_MAX)',
    'metric.T2M_MIN': 'Min Sıcaklık (T2M_MIN)',
    'metric.WS2M': 'Rüzgar Hızı (WS2M)',
    'cookie.required.title': 'Zorunlu Çerez Onayı Gerekli',
    'cookie.required.message':
      'Devam edebilmek için temel işlevsellik sağlayan zorunlu çerezleri kabul etmeniz gerekiyor. Bu çerezler oturum ve dil tercihleri gibi çekirdek özellikler içindir ve pazarlama amacı taşımaz.',
    'cookie.required.accept': 'Zorunlu Çerezleri Kabul Et',
    'cookie.required.info': 'Detaylı politika yakında eklenecek.',

    'cookie.title': 'Çerezleri Kullanıyoruz',
    'cookie.message':
      'Deneyiminizi geliştirmek için çerezleri kullanıyoruz. Siteyi kullanmaya devam ederek çerez kullanımını kabul etmiş olursunuz.',
    'cookie.accept': 'Kabul Et',
    'cookie.decline': 'Reddet',
    'cookie.learnMore': 'Daha Fazla Bilgi',
  },
  en: {
    'app.climateInfo': 'Past Weather Data',
    'app.climate.selectData': 'Display Data',
    'nav.about': 'About',
    'nav.apis': 'APIs',
    'nav.docs': 'Documentation',
    'nav.app': 'App',

    'home.badge': 'NASA API × Prophet ML',
    'home.title.main': 'Predict the Future',
    'home.title.gradient': 'Weather',
    'home.description':
      "Make weather predictions for future dates with NASA's powerful APIs and Prophet machine learning model. Don't just see past data, predict the future.",
    'home.cta.start': 'Start Predicting',
    'home.cta.how': 'How It Works?',

    'home.feature1.title': 'NASA API Power',
    'home.feature1.desc':
      "Generate the most accurate predictions using NASA's comprehensive meteorology and satellite data.",
    'home.feature2.title': 'Prophet ML Model',
    'home.feature2.desc':
      'Create reliable predictions for future dates with Prophet developed by Facebook.',
    'home.feature3.title': 'Future Predictions',
    'home.feature3.desc':
      'Predict not just today, but weeks and months ahead. Plan accordingly.',

    'home.features.title': 'Why PreWeather?',

    'home.stats.datapoints': 'Data',
    'home.stats.accuracy': 'Average Accuracy Rate',
    'home.stats.forecast': 'Forecast',
    'home.stats.days': 'Days',

    'home.cta.title': 'Discover the Future of Weather',
    'home.cta.description':
      'Start making your predictions and make data-driven decisions.',
    'home.cta.button': 'Try Now',

    'home.weather.sunny': 'Sunny',
    'home.weather.rainy': 'Rainy',
    'home.weather.stormy': 'Stormy',

    'about.title': 'About Us',
    'about.description':
      'PreWeather delivers future date weather forecasts using NASA data and the Prophet time series model.',
    'about.badge': 'PreWeather Mission',
    'about.mission.title': 'Our Mission',
    'about.mission.text':
      'Unifying NASA data + machine learning + predictive modeling for accessible future weather intelligence.',
    'about.mission.data': 'Data Source',
    'about.mission.data.desc':
      'Scientific fidelity powered by NASA satellite and observation data.',
    'about.mission.ai': 'Forecast Engine',
    'about.mission.ai.desc':
      'Prophet-based time series modeling for forward-looking projections.',
    'about.mission.accuracy': 'Consistency',
    'about.mission.accuracy.desc':
      'Continuous validation loop monitoring model performance.',
    'about.mission.scalable': 'Scalability',
    'about.mission.scalable.desc':
      'Modular API design ready for new data source integrations.',
    'about.roadmap.title': 'Roadmap',
    'about.roadmap.text':
      'Product evolution: from core to advanced analytical capabilities.',
    'about.roadmap.phase1': 'Core Infrastructure',
    'about.roadmap.phase1.desc':
      'NASA API integration, base prediction pipeline, multilingual UI.',
    'about.roadmap.phase2': 'Model Refinement',
    'about.roadmap.phase2.desc':
      'Additional time series factors, seasonal tuning, error dashboards.',
    'about.roadmap.phase3': 'Advanced Visualization',
    'about.roadmap.phase3.desc':
      'Map-based forecast layer, anomaly highlighting, interactive scenarios.',
    'about.roadmap.phase4': 'Ecosystem & API',
    'about.roadmap.phase4.desc':
      'Developer API keys, webhook support, integration kits.',
    'about.call.title': 'Let’s Predict the Future Together',
    'about.call.text':
      'PreWeather is evolving. Your feedback helps improve accuracy and coverage.',
    'about.call.docs': 'Go to Docs',
    'about.call.try': 'Try the App',

    'docs.title': 'Documentation',
    'docs.description': 'Detailed information about API usage and features.',

    'apis.title': 'APIs',
    'apis.description': 'List of available NASA APIs.',

    'app.title': 'PreWeather Application',
    'app.description': 'Access weather data.',
    'app.select.title': 'Select Location',
    'app.select.desc':
      'Click on the map to choose a location. Then pick a date to get a forecast.',
    'app.location.title': 'Location',
    'app.lat': 'Lat:',
    'app.lng': 'Lng:',
    'app.date': 'Date',
    'app.result.title': 'Forecast',
    'app.result.targetDate': 'Target Date:',
    'app.result.temperature': 'Temperature:',
    'app.result.humidity': 'Humidity:',
    'app.result.summary.placeholder':
      'Model prediction sample data (placeholder)',
    'app.predict.button': 'Predict',
    'app.predict.loading': 'Predicting...',
    'app.error.unknown': 'Unknown error',
    'app.error.general': 'An error occurred. Please try again.',
    'app.error.network': 'Network connection error',
    'app.footer.placeholder': 'API endpoint not connected yet (placeholder)',
    'app.home.back': 'Back to home.',
    'app.current.page': "You're already on this page.",
    'app.results.check': 'Check For Results',
    'app.results.checking': 'Checking...',
    'app.results.fetch': 'Predict',
    'app.results.loading': 'Loading Prediction...',
    'app.results.title': 'Prediction Results',
    'app.gelismis.title': 'Advanced',
    'app.results.none': 'No results yet',
    'app.results.metrics': 'Metric Selection',
    'app.results.toggleAll': 'Toggle All',
    'app.results.advice': 'Agricultural Advice',
    'app.results.downloadCSV': 'CSV',
    'app.results.downloadJSON': 'JSON',
    'app.results.overallAccuracy': 'Overall Accuracy',
    'app.results.overallError': 'Overall Error',
    'app.results.aiInsights': 'AI Insights',
    'advice.showRaw': 'Show Raw JSON',
    'advice.hideRaw': 'Hide Raw JSON',
    'advice.yorum': 'Comment',
    'advice.öneri': 'Advice',
    'advice.comment': 'Comment',
    'advice.advice': 'Recommendations',
    'advice.summary': 'Summary',
    'advice.risks': 'Risks',
    'advice.recommendations': 'Recommendations',
    'advice.actions': 'Actions',
    'advice.notes': 'Notes',
    'addr.placeholder': 'Search address...',
    'addr.searching': 'Searching...',
    'addr.noResults': 'No results',
    'addr.editHint': 'Click to edit',
    'addr.reverseError': 'Could not fetch address',
    'addr.invalidMessage':
      'No valid land address found. Pick another point or search an address.',
    'addr.enterPlaceholder': 'Enter Location',
    'addr.waterDetected': 'Water area detected',
    'addr.serverError': 'Address service temporary error',
    'app.results.readableTitle': 'Forecast Summary',
    'app.results.reliability': 'Reliability',
    'app.today': 'Today',
    'app.clear': 'Clear',
    'app.date.select': 'Select Date',
    'app.results.noData': 'No data found',
    'datePicker.dialogLabel': 'Date Picker',
    'datePicker.prevMonth': 'Previous Month',
    'datePicker.nextMonth': 'Next Month',
    'datePicker.close': 'Close',
    'unit.celsius': '°C',
    'unit.fahrenheit': '°F',
    'unit.toggleLabel': 'Units',
    'metricDesc.T2M': 'Mean air temperature',
    'metricDesc.T2M_MAX': 'Daily maximum temperature',
    'metricDesc.T2M_MIN': 'Daily minimum temperature',
    'metricDesc.WS2M': 'Near-surface wind speed',
    'metricDesc.PRECTOTCORR': 'Total precipitation amount',
    'metricDesc.SNODP': 'Snow depth / cover',
    'metricDesc.RH2M': 'Relative humidity percentage',
    'metricDesc.ALLSKY_KT': 'All-sky solar index percentage',
    '404.title': 'Page Not Found',
    '404.desc':
      'The page you are looking for may have been moved, deleted, or never existed.',
    '404.home': 'Home',
    '404.app': 'App',
    '404.hint': 'You can check the URL or continue using the links above.',
    'metric.ALLSKY_KT': 'All-Sky Insolation Index (ALLSKY_KT)',
    'metric.AOD_55_ADJ': 'Aerosol Optical Depth (AOD_55_ADJ)',
    'metric.CDD18_3': 'Cooling Degree Days (CDD18_3)',
    'metric.FROST_DAYS': 'Frost Days (FROST_DAYS)',
    'metric.HDD18_3': 'Heating Degree Days (HDD18_3)',
    'metric.PRECSNOLAND': 'Snow Precipitation (PRECSNOLAND)',
    'metric.PRECTOTCORR': 'Total Precipitation (PRECTOTCORR)',
    'metric.RH2M': 'Relative Humidity (RH2M)',
    'metric.SNODP': 'Snow Depth (SNODP)',
    'metric.T2M': 'Mean Temperature (T2M)',
    'metric.T2M_MAX': 'Max Temperature (T2M_MAX)',
    'metric.T2M_MIN': 'Min Temperature (T2M_MIN)',
    'metric.WS2M': 'Wind Speed (WS2M)',
    'cookie.required.title': 'Required Cookie Consent',
    'cookie.required.message':
      'To continue, you must accept the essential cookies that enable core functionality (session, language preference). These do not include marketing or tracking cookies.',
    'cookie.required.accept': 'Accept Essential Cookies',
    'cookie.required.info': 'Detailed policy coming soon.',

    'cookie.title': 'We Use Cookies',
    'cookie.message':
      'We use cookies to improve your experience. By continuing to use the site, you accept the use of cookies.',
    'cookie.accept': 'Accept',
    'cookie.decline': 'Decline',
    'cookie.learnMore': 'Learn More',
  },
}

export function TranslationProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('preferredLanguage')
    return (saved as Language) || 'en'
  })

  useEffect(() => {
    localStorage.setItem('preferredLanguage', language)
    document.documentElement.lang = language
  }, [language])

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
  }

  const t = (key: string): string => {
    return (
      translations[language][key as keyof (typeof translations)['tr']] || key
    )
  }

  return (
    <TranslationContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </TranslationContext.Provider>
  )
}

export function useTranslation() {
  const context = useContext(TranslationContext)
  if (!context) {
    throw new Error('useTranslation must be used within TranslationProvider')
  }
  return context
}
