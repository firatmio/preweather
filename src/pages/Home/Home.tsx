import { useMemo } from 'react'
import { FaArrowRight, FaBrain, FaChartLine, FaRocket } from 'react-icons/fa'
import { TiWeatherCloudy } from 'react-icons/ti'
import { Link } from 'react-router-dom'
import { useTranslation } from '../../contexts/TranslationContext'
import './Home.css'

export default function Home() {
  const { t } = useTranslation();
  const bgImages = useMemo(() => [
    'https://images.pexels.com/photos/3106799/pexels-photo-3106799.jpeg?cs=srgb&dl=pexels-sidesimagery-3106799.jpg&fm=jpg',
    'https://www.hdwallpapers.in/download/red_black_clouds_sky_sunset_dark_nature_wallpaper_background_4k_hd_dark_background-HD.jpg',
    'https://images.pexels.com/photos/12219473/pexels-photo-12219473.jpeg',
    'https://img.freepik.com/free-photo/beautiful-view-sunset-sea_181624-59229.jpg?t=st=1759516717~exp=1759520317~hmac=135be5559d59ca86f12ce9afe7c67f012125b7c388d88757e2990041de757e6a&w=2000',
    'https://img.freepik.com/free-photo/beautiful-view-sky-sunset-beach_158538-26143.jpg?t=st=1759516768~exp=1759520368~hmac=3cd876f038ab67ff5935b1c0a1c267940a99da981c4bc370d1d393052777f47e&w=2000',
    'https://img.freepik.com/free-photo/vibrant-sunset-rural-forest-meadow-generated-by-ai_188544-42453.jpg?t=st=1759516800~exp=1759520400~hmac=62fcdcf79b24ca7a6644e08e20eca8b5a9d4047ef39eaa0ab62768cd8dd3f756&w=2000'
  ], [])
  const selected = useMemo(() => bgImages[Math.floor(Math.random()*bgImages.length)], [bgImages])

  return (
    <div className="home-page">
      <div className="background" style={{ backgroundImage: `url(${selected})` }}></div>
      <section className="hero">
        <div className="hero-content">
          <div className="hero-badge">
            <TiWeatherCloudy className="badge-icon" />
            <span>{t('home.badge')}</span>
          </div>
          <h1 className="hero-title">
            {t('home.title.main')}
            <span className="gradient-text"> {t('home.title.gradient')}</span>
          </h1>
          <p className="hero-description">
            {t('home.description')}
          </p>
          <div className="hero-actions">
            <Link to="/app" className="btn btn-primary">
              {t('home.cta.start')}
              <span className="btn-icon"><FaArrowRight /></span>
            </Link>
            <Link to="/docs" className="btn btn-secondary">
              {t('home.cta.how')}
            </Link>
          </div>
        </div>
      </section>

      <section className="features">
        <h2 className="section-title">{t('home.features.title')}</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">
              <FaRocket />
            </div>
            <h3>{t('home.feature1.title')}</h3>
            <p>{t('home.feature1.desc')}</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">
              <FaBrain />
            </div>
            <h3>{t('home.feature2.title')}</h3>
            <p>{t('home.feature2.desc')}</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">
              <FaChartLine />
            </div>
            <h3>{t('home.feature3.title')}</h3>
            <p>{t('home.feature3.desc')}</p>
          </div>
        </div>
      </section>

      <section className="stats">
        <div className="stat-item">
          <div className="stat-number">1M+</div>
          <div className="stat-label">{t('home.stats.datapoints')}</div>
        </div>
        <div className="stat-divider"></div>
        <div className="stat-item">
          <div className="stat-number">72%</div>
          <div className="stat-label">{t('home.stats.accuracy')}</div>
        </div>
        <div className="stat-divider"></div>
        <div className="stat-item">
          <div className="stat-number">365 {t('home.stats.days')}</div>
          <div className="stat-label">{t('home.stats.forecast')}</div>
        </div>
      </section>

      <section className="cta">
        <h2>{t('home.cta.title')}</h2>
        <p>{t('home.cta.description')}</p>
        <Link to="/app" className="btn btn-cta">
          {t('home.cta.button')}
        </Link>
      </section>
    </div>
  )
}
