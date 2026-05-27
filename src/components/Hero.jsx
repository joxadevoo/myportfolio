import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { emptyHomeSettings, fetchHomeSettings } from '../lib/siteSettings';

export default function Hero() {
  const { t } = useTranslation();
  const [stats, setStats] = useState(emptyHomeSettings.stats);

  useEffect(() => {
    async function fetchStats() {
      try {
        const settings = await fetchHomeSettings();
        setStats(settings.stats);
      } catch (error) {
        console.error('Error fetching home stats:', error);
      }
    }
    fetchStats();
  }, []);

  return (
    <section className="hero" id="home">
      <div className="hero-content">
        <div className="hero-badge fade-in">{t('hero.badge')}</div>

        <h1 className="fade-in">
          {t('hero.headlineIntro')} <span className="accent">{t('hero.headlineName')}</span><br />
          {t('hero.headlineRole')}
        </h1>

        <p className="hero-subtitle fade-in">{t('hero.subtitle')}</p>
        <p className="hero-desc fade-in">{t('hero.desc')}</p>

        <div className="hero-btns fade-in">
          <a href="#projects" className="btn-primary">{t('hero.viewProjects')}</a>
          <a href="#contact" className="btn-secondary">{t('hero.contactMe')}</a>
        </div>

        <div className="hero-stats fade-in">
          <div>
            <div className="stat-num">{stats.certificates || '-'}</div>
            <div className="stat-label">{t('hero.certificates')}</div>
          </div>
          <div>
            <div className="stat-num">{stats.projects || '-'}</div>
            <div className="stat-label">{t('hero.projects')}</div>
          </div>
          <div>
            <div className="stat-num">{stats.years || '-'}</div>
            <div className="stat-label">{t('hero.yearsLearning')}</div>
          </div>
        </div>
      </div>

      <div className="hero-image-wrapper fade-in">
        <img src="/profile.jpg" alt="Jaxongir" className="hero-image" />
      </div>
    </section>
  );
}
