import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function NotFound() {
  const { t } = useTranslation();
  return (
    <section style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div className="about-terminal" style={{ maxWidth: '600px', width: '100%', boxShadow: '0 0 50px rgba(255, 60, 110, 0.2)', border: '1px solid var(--accent3)' }}>
        <div className="terminal-bar">
          <div style={{ display: 'flex', gap: '8px' }}>
            <div className="dot red"></div>
            <div className="dot yellow"></div>
            <div className="dot green"></div>
          </div>
          <span className="terminal-title">error_404.sh</span>
        </div>
        <div className="terminal-body" style={{ padding: '60px 40px', textAlign: 'center' }}>
           <h1 className="blink" style={{ fontSize: '5rem', color: 'var(--accent3)', textShadow: '0 0 20px rgba(255, 60, 110, 0.7)', margin: 0, lineHeight: 1 }}>404</h1>
           <h2 style={{ fontSize: '1.5rem', fontFamily: 'Share Tech Mono', marginTop: '10px', marginBottom: '20px', color: 'var(--text)' }}>
             {t('notFound.title')}
           </h2>
           <p style={{ color: 'var(--text-dim)', marginBottom: '40px', lineHeight: 1.6 }}>
             {t('notFound.desc')}
           </p>
           <Link to="/" className="btn-primary" style={{ display: 'inline-block' }}>
             {t('notFound.back')}
           </Link>
        </div>
      </div>
    </section>
  );
}
