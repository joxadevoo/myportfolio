import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MapPin, Zap } from 'lucide-react';
import { emptyHomeSettings, fetchHomeSettings } from '../lib/siteSettings';

export default function About() {
  const { t } = useTranslation();
  const [about, setAbout] = useState(emptyHomeSettings.about);

  useEffect(() => {
    async function loadAbout() {
      try {
        const settings = await fetchHomeSettings();
        setAbout(settings.about);
      } catch (error) {
        console.error('Error fetching about settings:', error);
      }
    }

    loadAbout();
  }, []);

  return (
    <section id="about">
      <div className="section-header">
        <div className="section-eyebrow">01 - About</div>
        <h2 className="section-title">{t('about.title')}</h2>
        <p className="section-desc">{t('about.p1')}</p>
      </div>

      <div className="about-grid">
        <div className="about-text">
          <p>{t('about.p1')}</p>
          <p>{t('about.p2')}</p>
          <div className="about-info">
            <div className="info-item">
              <div className="info-label">{t('about.location')}</div>
              <div className="info-value" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <MapPin size={16} color="var(--accent)" /> {about.location || '-'}
              </div>
            </div>
            <div className="info-item">
              <div className="info-label">{t('about.status')}</div>
              <div className="info-value">{about.status || '-'}</div>
            </div>
            <div className="info-item">
              <div className="info-label">{t('about.focus')}</div>
              <div className="info-value">{about.focus || '-'}</div>
            </div>
            <div className="info-item">
              <div className="info-label">{t('about.languages')}</div>
              <div className="info-value">{about.languages || '-'}</div>
            </div>
          </div>
        </div>

        <div className="about-card">
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Zap size={18} color="var(--accent)" /> Core Competencies
          </h3>
          <div className="about-skill-list">
            {about.competencies.map(skill => (
              <div key={skill} className="about-skill-item">{skill}</div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
