import React from 'react';
import { useTranslation } from 'react-i18next';
import { MapPin, Zap } from 'lucide-react';

export default function About() {
  const { t } = useTranslation();
  return (
    <section id="about">
      <div className="section-header">
        <div className="section-eyebrow">01 — About</div>
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
              <div className="info-value" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><MapPin size={16} color="var(--accent)" /> Uzbekistan</div>
            </div>
            <div className="info-item">
              <div className="info-label">{t('about.status')}</div>
              <div className="info-value">{t('about.statusVal')}</div>
            </div>
            <div className="info-item">
              <div className="info-label">{t('about.focus')}</div>
              <div className="info-value">Cybersecurity</div>
            </div>
            <div className="info-item">
              <div className="info-label">{t('about.languages')}</div>
              <div className="info-value">UZ / EN / TR</div>
            </div>
          </div>
        </div>

        <div className="about-card">
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Zap size={18} color="var(--accent)" /> Core Competencies</h3>
          <div className="about-skill-list">
            {[
              'Network Security & Monitoring',
              'Linux System Administration',
              'Python Scripting & Automation',
              'SQL & Database Management',
              'SIEM Tools (Splunk, ELK)',
              'Penetration Testing Basics',
              'Web Development (React, Supabase)',
              'Goal: SOC Analyst → Security Engineer',
            ].map(skill => (
              <div key={skill} className="about-skill-item">{skill}</div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
