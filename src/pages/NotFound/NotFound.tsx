import { Link } from 'react-router-dom';
import { useTranslation } from '../../contexts/TranslationContext';
import './NotFound.css';

export default function NotFound() {
  const { t } = useTranslation();
  return (
    <div className="nf-shell">
      <div className="nf-core">
        <h1 className="nf-code" aria-label="404">404</h1>
        <h2 className="nf-title">{t('404.title')}</h2>
        <p className="nf-desc">{t('404.desc')}</p>
        <div className="nf-actions">
          <Link className="nf-btn home" to="/">{t('404.home')}</Link>
          <Link className="nf-btn app" to="/app">{t('404.app')}</Link>
        </div>
        <p className="nf-hint">{t('404.hint')}</p>
      </div>
      <div className="nf-glow" />
    </div>
  );
}
