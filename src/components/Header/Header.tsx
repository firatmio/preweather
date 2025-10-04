import { TiWeatherCloudy } from "react-icons/ti";
import { Link } from "react-router-dom";
import { useTranslation } from "../../contexts/TranslationContext";
import "./Header.css";

export default function Header() {
  const { language, setLanguage, t } = useTranslation();

  const toggleLanguage = () => {
    setLanguage(language === 'tr' ? 'en' : 'tr');
  };

  return (
    <div className="header">
      <div className="container">
        <h2 className="logo">
          <TiWeatherCloudy />
          <Link to="/">PreWeather</Link>
        </h2>
        <div className="actionButtons">
          <Link to="/app"><span>{t('nav.app')}</span></Link>
          <Link to="/docs"><span>{t('nav.docs')}</span></Link>
          <Link to="/about"><span>{t('nav.about')}</span></Link>
          
          <button 
            className="language-toggle" 
            onClick={toggleLanguage}
            aria-label="Change language"
          >
            <span className="lang-option">{language === 'tr' ? 'TR' : 'EN'}</span>
            <span className="lang-divider">|</span>
            <span className="lang-option inactive">{language === 'tr' ? 'EN' : 'TR'}</span>
          </button>
        </div>
      </div>
    </div>
  )
}
