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
    'docs.subtitle': 'PreWeather uygulamasını kullanarak hava tahmini yapmanın detaylı rehberi',
    
    'docs.nav.intro': 'Giriş',
    'docs.nav.started': 'Başlarken',
    'docs.nav.location': 'Konum Seçimi',
    'docs.nav.date': 'Tarih Seçimi',
    'docs.nav.prediction': 'Tahmin Alma',
    'docs.nav.results': 'Sonuçları Anlama',
    'docs.nav.metrics': 'Bazı Metrikler',
    'docs.nav.climate': 'İklim Verileri',
    'docs.nav.export': 'Veri Dışa Aktarma',
    'docs.nav.tips': 'İpuçları',

    'docs.intro.title': 'PreWeather Nedir?',
    'docs.intro.p1': 'PreWeather, NASA POWER API ve Prophet makine öğrenimi modelini kullanarak gelecek tarihler için hava durumu tahminleri yapan gelişmiş bir web uygulamasıdır.',
    'docs.intro.p2': 'Uygulama, geçmiş meteoroloji verilerini analiz ederek sıcaklık, yağış, nem, rüzgar hızı ve daha fazlası gibi parametreleri tahmin eder.',
    'docs.intro.p3': 'Tarım, seyahat planlaması ve günlük aktiviteler için güvenilir hava tahminleri sunar.',

    'docs.started.title': 'Başlarken',
    'docs.started.p1': 'PreWeather kullanmaya başlamak için herhangi bir hesap oluşturmanıza gerek yoktur. Anasayfadan "Tahmine Başla" butonuna tıklayarak doğrudan uygulamaya erişebilirsiniz.',
    'docs.started.p2': 'Uygulama, interaktif bir harita üzerinde konum seçimi yapmanıza ve istediğiniz tarih için tahmin almanıza olanak tanır.',

    'docs.location.title': 'Konum Seçimi',
    'docs.location.step1': '1. Harita Üzerinden Seçim',
    'docs.location.step1.p1': 'Uygulama açıldığında karşınıza interaktif bir harita gelir. Bu harita üzerinde herhangi bir noktaya tıklayarak konum seçebilirsiniz.',
    'docs.location.step1.p2': 'Tıkladığınız noktada kırmızı bir işaretçi belirir ve seçilen konumun enlem (latitude) ve boylam (longitude) bilgileri gösterilir.',
    
    'docs.location.step2': '2. Adres Arama',
    'docs.location.step2.p1': 'Haritanın üst kısmında bulunan arama kutusunu kullanarak şehir, ilçe veya sokak adı arayabilirsiniz.',
    'docs.location.step2.p2': 'Yazmaya başladığınızda otomatik olarak öneriler görünür. İstediğiniz konumu seçtiğinizde harita o bölgeye yakınlaşır.',
    'docs.location.step2.p3': 'Arama kutusu, OpenStreetMap Nominatim API kullanarak dünya çapında konum araması yapar.',
    
    'docs.location.step3': '3. Su Kontrolü',
    'docs.location.step3.p1': 'Bir konum seçtiğinizde sistem, seçilen noktanın deniz, göl veya nehir gibi su kütlesi üzerinde olup olmadığını otomatik kontrol eder.',
    'docs.location.step3.p2': 'Eğer su üzerinde bir nokta seçtiyseniz ekranın sağ üst köşesinde uyarı mesajı belirir ve tahmin alamazsınız.',

    'docs.date.title': 'Tarih Seçimi',
    'docs.date.p1': 'Konum seçtikten sonra hangi tarih için tahmin istediğinizi belirlemeniz gerekir.',
    'docs.date.calendar': 'Takvim Kullanımı',
    'docs.date.calendar.p1': 'Sağ taraftaki panelde bulunan takvim simgesine tıklayarak tarih seçici açılır.',
    'docs.date.calendar.p2': 'Sadece bugünden sonraki tarihler seçilebilir. Geçmiş tarihler devre dışıdır.',
    'docs.date.calendar.p3': 'Maksimum 365 gün ileriye kadar tahmin alabilirsiniz.',
    'docs.date.format': 'Tarih formatı: GG.AA.YYYY (örn: 15.10.2025)',

    'docs.prediction.title': 'Tahmin Alma',
    'docs.prediction.button': 'Tahmin Et Butonu',
    'docs.prediction.button.p1': 'Konum ve tarih seçtikten sonra yeşil "Tahmin Et" butonuna tıklayın.',
    'docs.prediction.button.p2': 'Buton, hem konum hem de tarih seçilene kadar devre dışı kalır ve gri renkte görünür.',
    'docs.prediction.loading': 'Yükleme Süreci',
    'docs.prediction.loading.p1': 'Tahmin Et butonuna tıkladığınızda sistem NASA API\'den veri çekmeye başlar.',
    'docs.prediction.loading.p2': 'Bu işlem genellikle 3-5 saniye sürer. Yükleme animasyonu görürsünüz.',
    'docs.prediction.loading.p3': 'Yükleme sırasında başka işlem yapamazsınız.',

    'docs.results.title': 'Sonuçları Anlama',
    'docs.results.panel': 'Sonuç Paneli',
    'docs.results.panel.p1': 'Tahmin tamamlandığında ekranın sağ tarafında detaylı sonuç paneli açılır.',
    'docs.results.panel.p2': 'Panel üç ana bölümden oluşur: Genel Bilgiler, Metrik Değerler ve Yapay Zeka Önerileri.',
    
    'docs.results.general': 'Genel Bilgiler',
    'docs.results.general.p1': 'Seçtiğiniz konum (şehir/bölge adı)',
    'docs.results.general.p2': 'Hedef tarih',
    'docs.results.general.p3': 'Koordinat bilgileri',
    
    'docs.results.weather': 'Hava Durumu Özeti',
    'docs.results.weather.p1': 'Panelin üst kısmında büyük bir simge ile tahmin edilen hava durumu gösterilir.',
    'docs.results.weather.p2': 'Simgeler: ☀️ Güneşli, ☁️ Bulutlu, 🌧️ Yağmurlu, ❄️ Karlı',
    'docs.results.weather.p3': 'Tahmin edilen sıcaklık değeri büyük punto ile gösterilir.',

    'docs.metrics.title': 'Bazı Metrik Değerleri',
    'docs.metrics.intro': '',
    'docs.metrics.toggle': 'Metrikleri Açma/Kapama',
    'docs.metrics.toggle.p1': 'Her metriğin yanında bir göz simgesi bulunur.',
    'docs.metrics.toggle.p2': 'Bu simgeye tıklayarak istediğiniz metriği harita üzerinde renkli katman olarak görüntüleyebilirsiniz.',
    'docs.metrics.toggle.p3': 'Aynı anda birden fazla metrik açık olabilir.',
    
    'docs.metrics.t2m': 'T2M (Sıcaklık): 2 metre yükseklikteki hava sıcaklığı (°C)',
    'docs.metrics.prec': 'PRECTOTCORR (Yağış): Toplam yağış miktarı (mm/gün)',
    'docs.metrics.rh': 'RH2M (Nem): 2 metre yükseklikteki bağıl nem (%)',
    'docs.metrics.ws': 'WS2M (Rüzgar): 2 metre yükseklikteki rüzgar hızı (m/s)',
    'docs.metrics.qv': 'QV2M (Özgül Nem): Havadaki su buharı miktarı (g/kg)',
    'docs.metrics.dew': 'T2MDEW (Çiğ Noktası): Çiğlenme sıcaklığı (°C)',
    'docs.metrics.cloud': 'CLOUD_AMT (Bulutluluk): Bulut miktarı (%)',
    'docs.metrics.solar': 'ALLSKY_SFC_SW_DWN (Güneş Radyasyonu): Yüzeye ulaşan güneş enerjisi (kWh/m²/gün)',

    'docs.climate.title': 'Geçmiş İklim Verileri',
    'docs.climate.button': 'İklim Butonu',
    'docs.climate.button.p1': 'Sonuç panelinin sağ üst köşesinde "Geçmiş Hava Verileri" butonu bulunur.',
    'docs.climate.button.p2': 'Bu butona tıkladığınızda seçili konum için 1981-2010 yılları arası geçmiş veriler açılır.',
    
    'docs.climate.chart': 'Grafik Özellikleri',
    'docs.climate.chart.p1': 'Sol tarafta her metrik için renkli noktalar ve çizgilerle görselleştirilmiş grafik gösterilir.',
    'docs.climate.chart.p2': 'Farenizi noktaların üzerine getirdiğinizde detaylı bilgi (metrik adı, değer, yıl) görürsünüz.',
    'docs.climate.chart.p3': 'Sağ tarafta checkbox listesiyle hangi metrikleri görmek istediğinizi seçebilirsiniz.',
    
    'docs.climate.export': 'Grafik İndirme',
    'docs.climate.export.p1': 'Modalın sağ alt köşesinde PNG ve PDF indirme butonları bulunur.',
    'docs.climate.export.p2': 'PNG: Grafiği yüksek çözünürlükte görüntü olarak indirir',
    'docs.climate.export.p3': 'PDF: Grafiği yatay formatta PDF belgesi olarak kaydeder',

    'docs.export.title': 'Veri Dışa Aktarma',
    'docs.export.json': 'JSON İndirme',
    'docs.export.json.p1': 'Sonuç panelinin altında "JSON İndir" butonu bulunur.',
    'docs.export.json.p2': 'Bu buton, tüm tahmin verilerini JSON formatında bilgisayarınıza kaydeder.',
    'docs.export.json.p3': 'İndirilen dosya şunları içerir: Konum bilgileri, tarih, tüm metrik değerleri, yapay zeka önerileri.',
    
    'docs.export.usage': 'JSON Dosyasını Kullanma',
    'docs.export.usage.p1': 'İndirdiğiniz JSON dosyasını herhangi bir metin editöründe açabilirsiniz.',
    'docs.export.usage.p2': 'Verileri kendi uygulamalarınızda, Excel\'de veya programlama dillerinde kullanabilirsiniz.',

    'docs.tips.title': 'İpuçları ve Püf Noktaları',
    'docs.tips.1': 'Doğru Konum: Hassas tahmin için mümkün olduğunca spesifik konum seçin.',
    'docs.tips.2': 'Zaman Aralığı: Yakın tarihlerdeki tahminler daha güvenilirdir.',
    'docs.tips.3': 'Su Kontrol: Kara üzerinde nokta seçtiğinizden emin olun.',
    'docs.tips.4': 'Metrik Karşılaştırma: Birden fazla metriği harita üzerinde açarak karşılaştırma yapın.',
    'docs.tips.5': 'Birim Değiştirme: Sağ üst köşedeki butonlarla °C/°F ve m/s/km/h arası geçiş yapabilirsiniz.',
    'docs.tips.6': 'Veri Saklama: Önemli tahminleri JSON olarak kaydedin.',
    'docs.tips.7': 'Dil Desteği: Türkçe ve İngilizce arasında geçiş yapabilirsiniz.',
    'docs.tips.8': 'Mobil Uyumlu: Uygulama telefon ve tablette de sorunsuz çalışır.',

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
    'app.results.fetch': 'Tahmin Et',
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
    'app.results.showValues': 'Değerler',
    'app.results.showReliability': 'Güvenilirlik',
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
    'docs.subtitle': 'Detailed guide to making weather predictions using PreWeather',
    
    'docs.nav.intro': 'Introduction',
    'docs.nav.started': 'Getting Started',
    'docs.nav.location': 'Location Selection',
    'docs.nav.date': 'Date Selection',
    'docs.nav.prediction': 'Making Prediction',
    'docs.nav.results': 'Understanding Results',
    'docs.nav.metrics': 'Some Metrics',
    'docs.nav.climate': 'Climate Data',
    'docs.nav.export': 'Data Export',
    'docs.nav.tips': 'Tips',

    'docs.intro.title': 'What is PreWeather?',
    'docs.intro.p1': 'PreWeather is an advanced web application that makes weather predictions for future dates using NASA POWER API and Prophet machine learning model.',
    'docs.intro.p2': 'The application predicts parameters such as temperature, precipitation, humidity, wind speed and more by analyzing historical meteorological data.',
    'docs.intro.p3': 'It provides reliable weather forecasts for agriculture, travel planning and daily activities.',

    'docs.started.title': 'Getting Started',
    'docs.started.p1': 'You don\'t need to create an account to start using PreWeather. You can access the application directly by clicking the "Start Predicting" button on the homepage.',
    'docs.started.p2': 'The application allows you to select a location on an interactive map and get predictions for your desired date.',

    'docs.location.title': 'Location Selection',
    'docs.location.step1': '1. Selection via Map',
    'docs.location.step1.p1': 'When the application opens, you will see an interactive map. You can select a location by clicking anywhere on this map.',
    'docs.location.step1.p2': 'A red marker appears at the clicked point and the latitude and longitude information of the selected location is displayed.',
    
    'docs.location.step2': '2. Address Search',
    'docs.location.step2.p1': 'You can search for city, district or street name using the search box at the top of the map.',
    'docs.location.step2.p2': 'Suggestions appear automatically as you start typing. When you select the desired location, the map zooms to that area.',
    'docs.location.step2.p3': 'The search box uses OpenStreetMap Nominatim API for worldwide location search.',
    
    'docs.location.step3': '3. Water Check',
    'docs.location.step3.p1': 'When you select a location, the system automatically checks whether the selected point is on a water body such as sea, lake or river.',
    'docs.location.step3.p2': 'If you select a point on water, a warning message appears in the top right corner and you cannot get a prediction.',

    'docs.date.title': 'Date Selection',
    'docs.date.p1': 'After selecting a location, you need to specify which date you want a prediction for.',
    'docs.date.calendar': 'Using Calendar',
    'docs.date.calendar.p1': 'Click the calendar icon in the right panel to open the date picker.',
    'docs.date.calendar.p2': 'Only dates after today can be selected. Past dates are disabled.',
    'docs.date.calendar.p3': 'You can get predictions up to 365 days ahead.',
    'docs.date.format': 'Date format: DD.MM.YYYY (e.g: 15.10.2025)',

    'docs.prediction.title': 'Making Prediction',
    'docs.prediction.button': 'Predict Button',
    'docs.prediction.button.p1': 'After selecting location and date, click the green "Predict" button.',
    'docs.prediction.button.p2': 'The button remains disabled and appears gray until both location and date are selected.',
    'docs.prediction.loading': 'Loading Process',
    'docs.prediction.loading.p1': 'When you click the Predict button, the system starts fetching data from NASA API.',
    'docs.prediction.loading.p2': 'This process usually takes 3-5 seconds. You will see a loading animation.',
    'docs.prediction.loading.p3': 'You cannot perform other operations during loading.',

    'docs.results.title': 'Understanding Results',
    'docs.results.panel': 'Result Panel',
    'docs.results.panel.p1': 'When the prediction is complete, a detailed results panel opens on the right side of the screen.',
    'docs.results.panel.p2': 'The panel consists of three main sections: General Information, Metric Values and AI Recommendations.',
    
    'docs.results.general': 'General Information',
    'docs.results.general.p1': 'Selected location (city/region name)',
    'docs.results.general.p2': 'Target date',
    'docs.results.general.p3': 'Coordinate information',
    
    'docs.results.weather': 'Weather Summary',
    'docs.results.weather.p1': 'At the top of the panel, the predicted weather is shown with a large icon.',
    'docs.results.weather.p2': 'Icons: ☀️ Sunny, ☁️ Cloudy, 🌧️ Rainy, ❄️ Snowy',
    'docs.results.weather.p3': 'The predicted temperature value is shown in large font.',

    'docs.metrics.title': 'Some Metric Values',
    'docs.metrics.intro': '',
    'docs.metrics.toggle': 'Toggle Metrics',
    'docs.metrics.toggle.p1': 'There is an eye icon next to each metric.',
    'docs.metrics.toggle.p2': 'By clicking this icon, you can view the desired metric as a colored layer on the map.',
    'docs.metrics.toggle.p3': 'Multiple metrics can be active at the same time.',
    
    'docs.metrics.t2m': 'T2M (Temperature): Air temperature at 2 meters height (°C)',
    'docs.metrics.prec': 'PRECTOTCORR (Precipitation): Total precipitation amount (mm/day)',
    'docs.metrics.rh': 'RH2M (Humidity): Relative humidity at 2 meters height (%)',
    'docs.metrics.ws': 'WS2M (Wind): Wind speed at 2 meters height (m/s)',
    'docs.metrics.qv': 'QV2M (Specific Humidity): Amount of water vapor in air (g/kg)',
    'docs.metrics.dew': 'T2MDEW (Dew Point): Dew point temperature (°C)',
    'docs.metrics.cloud': 'CLOUD_AMT (Cloudiness): Cloud amount (%)',
    'docs.metrics.solar': 'ALLSKY_SFC_SW_DWN (Solar Radiation): Solar energy reaching surface (kWh/m²/day)',

    'docs.climate.title': 'Historical Climate Data',
    'docs.climate.button': 'Climate Button',
    'docs.climate.button.p1': 'There is a "Past Weather Data" button in the top right corner of the results panel.',
    'docs.climate.button.p2': 'When you click this button, historical data from 1981-2010 for the selected location opens.',
    
    'docs.climate.chart': 'Chart Features',
    'docs.climate.chart.p1': 'On the left side, a chart visualized with colored dots and lines for each metric is shown.',
    'docs.climate.chart.p2': 'When you hover over the dots, you see detailed information (metric name, value, year).',
    'docs.climate.chart.p3': 'On the right side, you can select which metrics you want to see with a checkbox list.',
    
    'docs.climate.export': 'Chart Download',
    'docs.climate.export.p1': 'There are PNG and PDF download buttons in the bottom right corner of the modal.',
    'docs.climate.export.p2': 'PNG: Downloads the chart as a high-resolution image',
    'docs.climate.export.p3': 'PDF: Saves the chart as a PDF document in landscape format',

    'docs.export.title': 'Data Export',
    'docs.export.json': 'JSON Download',
    'docs.export.json.p1': 'There is a "Download JSON" button at the bottom of the results panel.',
    'docs.export.json.p2': 'This button saves all prediction data in JSON format to your computer.',
    'docs.export.json.p3': 'The downloaded file includes: Location information, date, all metric values, AI recommendations.',
    
    'docs.export.usage': 'Using JSON File',
    'docs.export.usage.p1': 'You can open the downloaded JSON file in any text editor.',
    'docs.export.usage.p2': 'You can use the data in your own applications, Excel or programming languages.',

    'docs.tips.title': 'Tips and Tricks',
    'docs.tips.1': 'Accurate Location: Select a specific location for precise prediction.',
    'docs.tips.2': 'Time Range: Predictions for nearby dates are more reliable.',
    'docs.tips.3': 'Water Check: Make sure you select a point on land.',
    'docs.tips.4': 'Metric Comparison: Compare by opening multiple metrics on the map.',
    'docs.tips.5': 'Unit Change: You can switch between °C/°F and m/s/km/h with buttons in the top right corner.',
    'docs.tips.6': 'Data Storage: Save important predictions as JSON.',
    'docs.tips.7': 'Language Support: You can switch between Turkish and English.',
    'docs.tips.8': 'Mobile Friendly: The application works smoothly on phone and tablet.',

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
    'app.results.showValues': 'Values',
    'app.results.showReliability': 'Reliability',
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
