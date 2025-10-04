import { useTranslation } from '../../contexts/TranslationContext';
import './Docs.css';

export default function Docs() {
  const { t } = useTranslation();

  return (
    <div className="docs-page">
      <h1>{t('docs.title')}</h1>
      <p>{t('docs.description')}</p>
    </div>
  )
}
