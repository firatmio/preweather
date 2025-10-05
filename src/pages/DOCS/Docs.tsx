import { useEffect, useMemo, useRef, useState } from 'react';
import { FaCalendarAlt, FaChartBar, FaCrosshairs, FaExchangeAlt, FaSave, FaWater } from 'react-icons/fa';
import { useTranslation } from '../../contexts/TranslationContext';
import './Docs.css';

export default function Docs() {
  const { t } = useTranslation();
  const [activeSection, setActiveSection] = useState('intro');

  const introRef = useRef<HTMLElement>(null);
  const startedRef = useRef<HTMLElement>(null);
  const locationRef = useRef<HTMLElement>(null);
  const dateRef = useRef<HTMLElement>(null);
  const predictionRef = useRef<HTMLElement>(null);
  const resultsRef = useRef<HTMLElement>(null);
  const metricsRef = useRef<HTMLElement>(null);
  const climateRef = useRef<HTMLElement>(null);
  const exportRef = useRef<HTMLElement>(null);
  const tipsRef = useRef<HTMLElement>(null);

  useEffect(() => {
    document.title = `PreWeather - ${t('nav.docs')}`
  }, [])

  const sections = useMemo(() => [
    { id: 'intro', label: t('docs.nav.intro'), ref: introRef },
    { id: 'started', label: t('docs.nav.started'), ref: startedRef },
    { id: 'location', label: t('docs.nav.location'), ref: locationRef },
    { id: 'date', label: t('docs.nav.date'), ref: dateRef },
    { id: 'prediction', label: t('docs.nav.prediction'), ref: predictionRef },
    { id: 'results', label: t('docs.nav.results'), ref: resultsRef },
    { id: 'metrics', label: t('docs.nav.metrics'), ref: metricsRef },
    { id: 'climate', label: t('docs.nav.climate'), ref: climateRef },
    { id: 'export', label: t('docs.nav.export'), ref: exportRef },
    { id: 'tips', label: t('docs.nav.tips'), ref: tipsRef },
  ], [t]);

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -70% 0px',
      threshold: 0
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const sectionId = entry.target.getAttribute('data-section');
          if (sectionId) {
            setActiveSection(sectionId);
          }
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    sections.forEach((section) => {
      const element = section.ref.current;
      if (element) {
        element.setAttribute('data-section', section.id);
        observer.observe(element);
      }
    });

    return () => {
      observer.disconnect();
    };
  }, [sections]);

  const scrollToSection = (sectionId: string) => {
    const section = sections.find(s => s.id === sectionId);
    section?.ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="docs-page">
      <div className="docs-main">
        <aside className="docs-sidebar">
          <div className="docs-nav-sticky">
            <h3 className="docs-nav-title">{t('docs.title')}</h3>
            <nav className="docs-nav">
              {sections.map(section => (
                <button
                  key={section.id}
                  onClick={() => scrollToSection(section.id)}
                  className={`docs-nav-item ${activeSection === section.id ? 'active' : ''}`}
                >
                  {section.label}
                </button>
              ))}
            </nav>
          </div>
        </aside>

        <div className="docs-content">
          <section ref={introRef} className="docs-article">
            <h2>{t('docs.intro.title')}</h2>
            <p>{t('docs.intro.p1')}</p>
            <p>{t('docs.intro.p2')}</p>
            <p>{t('docs.intro.p3')}</p>
          </section>

          <section ref={startedRef} className="docs-article">
            <h2>{t('docs.started.title')}</h2>
            <p>{t('docs.started.p1')}</p>
            <p>{t('docs.started.p2')}</p>
          </section>

          <section ref={locationRef} className="docs-article">
            <h2>{t('docs.location.title')}</h2>
            <h3>{t('docs.location.step1')}</h3>
            <p>{t('docs.location.step1.p1')}</p>
            <p>{t('docs.location.step1.p2')}</p>
            <h3>{t('docs.location.step2')}</h3>
            <p>{t('docs.location.step2.p1')}</p>
            <p>{t('docs.location.step2.p2')}</p>
            <p>{t('docs.location.step2.p3')}</p>
            <h3>{t('docs.location.step3')}</h3>
            <p>{t('docs.location.step3.p1')}</p>
            <p>{t('docs.location.step3.p2')}</p>
          </section>

          <section ref={dateRef} className="docs-article">
            <h2>{t('docs.date.title')}</h2>
            <p>{t('docs.date.p1')}</p>
            <h3>{t('docs.date.calendar')}</h3>
            <p>{t('docs.date.calendar.p1')}</p>
            <p>{t('docs.date.calendar.p2')}</p>
            <p>{t('docs.date.calendar.p3')}</p>
            <div className="docs-note">
              <strong>
                <FaCalendarAlt style={{ marginRight: 8, color: '#f05514' }} />
                {t('docs.date.format')}
              </strong>
            </div>
          </section>

          <section ref={predictionRef} className="docs-article">
            <h2>{t('docs.prediction.title')}</h2>
            <h3>{t('docs.prediction.button')}</h3>
            <p>{t('docs.prediction.button.p1')}</p>
            <p>{t('docs.prediction.button.p2')}</p>
            <h3>{t('docs.prediction.loading')}</h3>
            <p>{t('docs.prediction.loading.p1')}</p>
            <p>{t('docs.prediction.loading.p2')}</p>
            <p>{t('docs.prediction.loading.p3')}</p>
          </section>

          <section ref={resultsRef} className="docs-article">
            <h2>{t('docs.results.title')}</h2>
            <h3>{t('docs.results.panel')}</h3>
            <p>{t('docs.results.panel.p1')}</p>
            <p>{t('docs.results.panel.p2')}</p>
            <h3>{t('docs.results.general')}</h3>
            <ul className="docs-list-simple">
              <li>{t('docs.results.general.p1')}</li>
              <li>{t('docs.results.general.p2')}</li>
              <li>{t('docs.results.general.p3')}</li>
            </ul>
            <h3>{t('docs.results.weather')}</h3>
            <p>{t('docs.results.weather.p1')}</p>
            <p>{t('docs.results.weather.p2')}</p>
            <p>{t('docs.results.weather.p3')}</p>
          </section>

          <section ref={metricsRef} className="docs-article">
            <h2>{t('docs.metrics.title')}</h2>
            <p>{t('docs.metrics.intro')}</p>
            <h3>{t('docs.metrics.toggle')}</h3>
            <p>{t('docs.metrics.toggle.p1')}</p>
            <p>{t('docs.metrics.toggle.p2')}</p>
            <p>{t('docs.metrics.toggle.p3')}</p>
            <div className="docs-metrics-grid">
              <div className="docs-metric-card"><strong>T2M</strong><p>{t('docs.metrics.t2m')}</p></div>
              <div className="docs-metric-card"><strong>PRECTOTCORR</strong><p>{t('docs.metrics.prec')}</p></div>
              <div className="docs-metric-card"><strong>RH2M</strong><p>{t('docs.metrics.rh')}</p></div>
              <div className="docs-metric-card"><strong>WS2M</strong><p>{t('docs.metrics.ws')}</p></div>
            </div>
          </section>

          <section ref={climateRef} className="docs-article">
            <h2>{t('docs.climate.title')}</h2>
            <h3>{t('docs.climate.button')}</h3>
            <p>{t('docs.climate.button.p1')}</p>
            <p>{t('docs.climate.button.p2')}</p>
            <h3>{t('docs.climate.chart')}</h3>
            <p>{t('docs.climate.chart.p1')}</p>
            <p>{t('docs.climate.chart.p2')}</p>
            <p>{t('docs.climate.chart.p3')}</p>
            <h3>{t('docs.climate.export')}</h3>
            <p>{t('docs.climate.export.p1')}</p>
            <ul className="docs-list-simple">
              <li>{t('docs.climate.export.p2')}</li>
              <li>{t('docs.climate.export.p3')}</li>
            </ul>
          </section>

          <section ref={exportRef} className="docs-article">
            <h2>{t('docs.export.title')}</h2>
            <h3>{t('docs.export.json')}</h3>
            <p>{t('docs.export.json.p1')}</p>
            <p>{t('docs.export.json.p2')}</p>
            <p>{t('docs.export.json.p3')}</p>
            <h3>{t('docs.export.usage')}</h3>
            <p>{t('docs.export.usage.p1')}</p>
            <p>{t('docs.export.usage.p2')}</p>
          </section>

          <section ref={tipsRef} className="docs-article">
            <h2>{t('docs.tips.title')}</h2>
            <div className="docs-tips-grid">
              <div className="docs-tip-card"><FaCrosshairs className="tip-icon" />{t('docs.tips.1')}</div>
              <div className="docs-tip-card"><FaCalendarAlt className="tip-icon" />{t('docs.tips.2')}</div>
              <div className="docs-tip-card"><FaWater className="tip-icon" />{t('docs.tips.3')}</div>
              <div className="docs-tip-card"><FaChartBar className="tip-icon" />{t('docs.tips.4')}</div>
              <div className="docs-tip-card"><FaExchangeAlt className="tip-icon" />{t('docs.tips.5')}</div>
              <div className="docs-tip-card"><FaSave className="tip-icon" />{t('docs.tips.6')}</div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
