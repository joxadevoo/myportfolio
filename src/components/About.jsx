import React from 'react';
import { useTranslation } from 'react-i18next';

export default function About() {
  const { t } = useTranslation();
  return (
    <section id="about">
      <div className="section-header">
        <span className="section-num">// 01</span>
        <h2 className="section-title">{t('about.title')}</h2>
        <div className="section-line"></div>
      </div>
      <div className="about-grid">
        <div className="about-text">
          <p>{t('about.p1')}</p>
          <p>{t('about.p2')}</p>
          <div className="about-info">
            <div className="info-item">
              <div className="info-label">{t('about.location')}</div>
              <div className="info-value">Uzbekistan</div>
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
        <div className="about-terminal">
          <div className="terminal-bar">
            <div className="dot red"></div>
            <div className="dot yellow"></div>
            <div className="dot green"></div>
            <span className="terminal-title">whoami.sh</span>
          </div>
          <div className="terminal-body" style={{ whiteSpace: 'pre' }}>
            <div className="t-line"><span className="t-prompt">❯ </span><span className="t-cmd">whoami</span></div>
            <div className="t-out highlight">cybersecurity_student</div>
            <br />
            <div className="t-line"><span className="t-prompt">❯ </span><span className="t-cmd">cat skills.txt</span></div>
            <div className="t-out">Network Security</div>
            <div className="t-out">Linux Administration</div>
            <div className="t-out">Python Scripting</div>
            <div className="t-out">SQL & Databases</div>
            <div className="t-out">SIEM Tools</div>
            <br />
            <div className="t-line"><span className="t-prompt">❯ </span><span className="t-cmd">cat goals.txt</span></div>
            <div className="t-out highlight">SOC Analyst → Security Engineer</div>
            <br />
            <div className="t-line"><span className="t-prompt">❯ </span><span className="t-cmd"><span className="blink">_</span></span></div>
          </div>
        </div>
      </div>
    </section>
  );
}
