import { useEffect, useState } from 'react';
import { LiaCookieSolid } from 'react-icons/lia';
import { useTranslation } from '../../contexts/TranslationContext';
import './CookieConsent.css';

export default function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    try {
      const consent = localStorage.getItem('cookieConsent');
      if (!consent) {
        setTimeout(() => setIsVisible(true), 1000);
      }
    } catch (error) {
      setTimeout(() => setIsVisible(true), 1000);
    }
  }, []);

  const handleAccept = () => {
    try {
      localStorage.setItem('cookieConsent', 'accepted');
      setIsVisible(false);
      window.location.reload();
    } catch (error) {
      console.error('Failed to save cookie consent:', error);
      setIsVisible(false);
    }
  };

  const handleDecline = () => {
    try {
      localStorage.setItem('cookieConsent', 'declined');
      setIsVisible(false);
      const keysToRemove = ['preferredLanguage'];
      keysToRemove.forEach(key => {
        try {
          localStorage.removeItem(key);
        } catch (e) {
        }
      });
    } catch (error) {
      console.error('Failed to save cookie decline:', error);
      setIsVisible(false);
    }
  };

  if (!isVisible) return null;

  return (
    <div className="cookie-consent">
      <div className="cookie-content">
              <div className="cookie-icon"><LiaCookieSolid /> </div>
        <div className="cookie-text">
          <h3>{t('cookie.title')}</h3>
          <p>{t('cookie.message')}</p>
        </div>
        <div className="cookie-actions">
          <button onClick={handleAccept} className="cookie-btn cookie-accept">
            {t('cookie.accept')}
          </button>
          <button onClick={handleDecline} className="cookie-btn cookie-decline">
            {t('cookie.decline')}
          </button>
        </div>
      </div>
    </div>
  );
}
