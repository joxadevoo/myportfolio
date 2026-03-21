import React, { useState } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Home from './pages/Home';
import BlogPost from './pages/BlogPost';
import AdminPanel from './pages/AdminPanel';
import NotFound from './pages/NotFound';

function LangToggle() {
  const { i18n: i18nInst } = useTranslation();
  const isUz = i18nInst.language === 'uz';
  const toggle = () => {
    const next = isUz ? 'en' : 'uz';
    i18nInst.changeLanguage(next);
    localStorage.setItem('lang', next);
  };
  return (
    <button onClick={toggle} style={{
      background: 'transparent',
      border: '1px solid var(--accent)',
      color: 'var(--accent)',
      fontFamily: 'Share Tech Mono',
      fontSize: '0.75rem',
      padding: '6px 14px',
      cursor: 'pointer',
      letterSpacing: '2px',
      transition: 'all 0.3s',
      flexShrink: 0
    }}>
      {isUz ? 'EN' : 'UZ'}
    </button>
  );
}

function App() {
  const { pathname } = useLocation();
  const { t } = useTranslation();
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = pathname === '/'
    ? [
        { href: '#about', label: t('nav.about') },
        { href: '#skills', label: t('nav.skills') },
        { href: '#certs', label: t('nav.certs') },
        { href: '#projects', label: t('nav.projects') },
        { href: '#blog', label: t('nav.blog') },
        { href: '#contact', label: t('nav.contact') },
      ]
    : [{ href: '/', label: t('nav.back'), isLink: true }];

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <nav>
        <Link to="/" className="nav-logo" style={{ cursor: 'pointer' }} onClick={() => { window.scrollTo(0,0); closeMenu(); }}>
          JOXA<span>_</span>CYBERS
        </Link>

        {/* Desktop nav */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '30px' }} className="nav-right-desktop">
          {pathname === '/' ? (
            <ul>
              {navLinks.map(link => (
                <li key={link.href}><a href={link.href}>{link.label}</a></li>
              ))}
            </ul>
          ) : (
            <ul><li><Link to="/">{t('nav.back')}</Link></li></ul>
          )}
          <LangToggle />
        </div>

        {/* Mobile right: lang + hamburger */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ display: 'none' }} className="lang-mobile"><LangToggle /></div>
          <button
            className={`hamburger ${menuOpen ? 'open' : ''}`}
            onClick={() => setMenuOpen(v => !v)}
            aria-label="Toggle menu"
          >
            <span></span><span></span><span></span>
          </button>
        </div>
      </nav>

      {/* Mobile dropdown */}
      <div className={`mobile-menu ${menuOpen ? 'open' : ''}`}>
        {navLinks.map(link =>
          link.isLink
            ? <Link key={link.href} to={link.href} onClick={closeMenu}>{link.label}</Link>
            : <a key={link.href} href={link.href} onClick={closeMenu}>{link.label}</a>
        )}
        <div style={{ marginTop: '20px' }}><LangToggle /></div>
      </div>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/blog/:id" element={<BlogPost />} />
        <Route path="/dora705221" element={<AdminPanel />} />
        <Route path="*" element={<NotFound />} />
      </Routes>

      <footer>
        <div className="footer-text">© {new Date().getFullYear()} <span>Jaxongir Toshpolatov</span> — {t('footer.rights')}</div>
        <div className="footer-text">{t('footer.builtWith')} <span>♥</span> & Supabase</div>
      </footer>
    </>
  );
}

export default App;
