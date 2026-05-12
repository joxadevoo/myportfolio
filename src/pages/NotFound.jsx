import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function NotFound() {
  const { t } = useTranslation();
  return (
    <section style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', flexDirection: 'column', textAlign: 'center' }}>
      <h1 style={{ fontSize: 'clamp(6rem, 15vw, 10rem)', fontFamily: 'var(--font-display)', fontWeight: 500, lineHeight: 1, margin: 0, color: 'var(--text-main)', letterSpacing: '-0.05em' }}>
        404
      </h1>
      <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontFamily: 'var(--font-display)', fontWeight: 400, marginTop: '24px', marginBottom: '16px', color: 'var(--text-main)' }}>
        {t('notFound.title') || 'Page Not Found'}
      </h2>
      <p style={{ color: 'var(--text-muted)', marginBottom: '48px', fontSize: '1.125rem', maxWidth: '400px' }}>
        {t('notFound.desc') || "The page you are looking for doesn't exist or has been moved."}
      </p>
      <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', padding: '16px 32px', background: 'var(--text-main)', color: 'var(--bg)', borderRadius: '100px', textDecoration: 'none', fontSize: '0.875rem', fontWeight: 500, transition: 'transform 0.2s ease, opacity 0.2s ease' }} onMouseOver={e=>e.currentTarget.style.transform='scale(1.05)'} onMouseOut={e=>e.currentTarget.style.transform='scale(1)'}>
        {t('notFound.back') || 'Return to Home'}
      </Link>
    </section>
  );
}
