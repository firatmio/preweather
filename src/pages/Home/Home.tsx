import { FaArrowRight, FaBrain, FaChartLine, FaRocket } from 'react-icons/fa'
import { TiWeatherCloudy } from 'react-icons/ti'
import { Link } from 'react-router-dom'
import { useTranslation } from '../../contexts/TranslationContext'
import './Home.css'

export default function Home() {
  const { t } = useTranslation();
  
  return (
    <div className="home-page">
      <div className="background" ></div>
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
