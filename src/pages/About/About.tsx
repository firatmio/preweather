import { useEffect } from 'react'
import { FaBrain, FaCloudSunRain, FaCodeBranch, FaSatellite } from 'react-icons/fa'
import { TiWeatherCloudy } from 'react-icons/ti'
import { useTranslation } from '../../contexts/TranslationContext'
import './About.css'

export default function About() {
  const { t } = useTranslation()
  useEffect(() => {
    document.title = `PreWeather - ${t('nav.about')}`
  }, [])

  return (
  <div className="about-page about-light">
      <section className="about-hero">
        <div className="about-hero-content">
          <div className="about-badge">
            <TiWeatherCloudy />
            <span>{t('about.badge') || 'PreWeather Mission'}</span>
          </div>
          <h1 className="about-title">{t('about.title')}</h1>
          <p className="about-lead">{t('about.description')}</p>
        </div>
      </section>

      <section className="about-section mission">
        <div className="section-head">
          <h2>{t('about.mission.title') || 'Misyonumuz'}</h2>
          <p>{t('about.mission.text') || 'Geleceğin hava durumunu daha erişilebilir, anlaşılır ve tahmin edilebilir kılmak için NASA verisi + makine öğrenimi + öngörüsel modelleme bir arada.'}</p>
        </div>
        <div className="mission-grid">
          <div className="mission-card">
            <FaSatellite />
            <h3>{t('about.mission.data') || 'Veri Kaynağı'}</h3>
            <p>{t('about.mission.data.desc') || 'NASA uydu ve gözlem verileri ile bilimsel doğruluk.'}</p>
          </div>
          <div className="mission-card">
            <FaBrain />
            <h3>{t('about.mission.ai') || 'Tahmin Motoru'}</h3>
            <p>{t('about.mission.ai.desc') || 'Prophet tabanlı zaman serisi modelleme ile ileri tarih öngörüleri.'}</p>
          </div>
          <div className="mission-card">
            <FaCloudSunRain />
            <h3>{t('about.mission.accuracy') || 'Tutarlılık'}</h3>
            <p>{t('about.mission.accuracy.desc') || 'Model performansını ölçen sürekli validasyon ve geri besleme döngüsü.'}</p>
          </div>
          <div className="mission-card">
            <FaCodeBranch />
            <h3>{t('about.mission.scalable') || 'Genişleyebilirlik'}</h3>
            <p>{t('about.mission.scalable.desc') || 'Modüler API yapısı ile yeni veri kaynaklarını entegre etmeye hazır.'}</p>
          </div>
        </div>
      </section>

      <section className="about-section roadmap">
        <div className="section-head">
          <h2>{t('about.roadmap.title') || 'Yol Haritası'}</h2>
          <p>{t('about.roadmap.text') || 'Ürünün evrimi: çekirdekten ileri analitik yeteneklere.'}</p>
        </div>
        <div className="timeline">
          <div className="timeline-item">
            <div className="dot" />
            <div className="content">
              <h4>{t('about.roadmap.phase1') || 'Çekirdek Altyapı'}</h4>
              <p>{t('about.roadmap.phase1.desc') || 'NASA API entegrasyonu, temel tahmin pipeline, çok dilli arayüz.'}</p>
            </div>
          </div>
          <div className="timeline-item">
            <div className="dot" />
            <div className="content">
              <h4>{t('about.roadmap.phase2') || 'Model İyileştirme'}</h4>
              <p>{t('about.roadmap.phase2.desc') || 'Ek zaman serisi bileşenleri, mevsimsellik ince ayarı, hata analiz panelleri.'}</p>
            </div>
          </div>
          <div className="timeline-item">
            <div className="dot" />
            <div className="content">
              <h4>{t('about.roadmap.phase3') || 'Gelişmiş Görselleştirme'}</h4>
              <p>{t('about.roadmap.phase3.desc') || 'Harita tabanlı tahmin katmanı, anomaly highlight, interaktif senaryo.'}</p>
            </div>
          </div>
          <div className="timeline-item">
            <div className="dot" />
            <div className="content">
              <h4>{t('about.roadmap.phase4') || 'Ekosistem & API'}</h4>
              <p>{t('about.roadmap.phase4.desc') || 'Geliştirici API anahtarları, webhook desteği, entegrasyon kitleri.'}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="about-cta">
        <h2>{t('about.call.title') || 'Geleceği Birlikte Tahmin Edelim'}</h2>
        <p>{t('about.call.text') || 'PreWeather sürekli gelişiyor. Geri bildiriminiz, doğruluk ve kapsamın artmasına katkı sağlar.'}</p>
        <div className="about-cta-actions">
          <a href="/docs" className="about-btn primary">{t('about.call.docs') || 'Dokümantasyona Git'}</a>
          <a href="/app" className="about-btn outline">{t('about.call.try') || 'Uygulamayı Deneyin'}</a>
        </div>
      </section>
    </div>
  )
}
