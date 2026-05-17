import React, { Suspense, useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import { Sun, Moon } from 'lucide-react';

const BlogPost = React.lazy(() => import('./pages/BlogPost'));
const AdminPanel = React.lazy(() => import('./pages/AdminPanel'));

function PageLoading() {
  return (
    <section style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ color: 'var(--text-muted)' }}>Loading...</div>
    </section>
  );
}

function ThemeToggle() {
  const [dark, setDark] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved ? saved === 'dark' : true;
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
    localStorage.setItem('theme', dark ? 'dark' : 'light');
  }, [dark]);

  return (
    <button
      className="theme-toggle"
      onClick={() => setDark(d => !d)}
      aria-label="Toggle theme"
      title={dark ? 'Light mode' : 'Dark mode'}
    >
      {dark ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}

function LangToggle() {
  const { i18n } = useTranslation();
  const isUz = i18n.language === 'uz';
  const toggle = () => {
    const next = isUz ? 'en' : 'uz';
    i18n.changeLanguage(next);
    localStorage.setItem('lang', next);
  };
  return (
    <button onClick={toggle} className="lang-toggle">
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
        <Link
          to="/"
          className="nav-logo"
          onClick={() => { window.scrollTo(0, 0); closeMenu(); }}
        >
          Joxa<span>.</span>Dev
        </Link>

        <div className="nav-right-desktop">
          {pathname === '/' ? (
            <ul>
              {navLinks.map(link => (
                <li key={link.href}>
                  <a href={link.href}>{link.label}</a>
                </li>
              ))}
            </ul>
          ) : (
            <ul><li><Link to="/">{t('nav.back')}</Link></li></ul>
          )}
          <ThemeToggle />
          <LangToggle />
        </div>

        <div className="nav-right-mobile">
          <ThemeToggle />
          <button
            className={`hamburger ${menuOpen ? 'open' : ''}`}
            onClick={() => setMenuOpen(v => !v)}
            aria-label="Toggle menu"
          >
            <span /><span /><span />
          </button>
        </div>
      </nav>

      <div className={`mobile-menu ${menuOpen ? 'open' : ''}`}>
        {navLinks.map(link =>
          link.isLink
            ? <Link key={link.href} to={link.href} onClick={closeMenu}>{link.label}</Link>
            : <a key={link.href} href={link.href} onClick={closeMenu}>{link.label}</a>
        )}
        <div style={{ marginTop: '12px' }}><LangToggle /></div>
      </div>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/blog/:id" element={<Suspense fallback={<PageLoading />}><BlogPost /></Suspense>} />
        <Route path="/dora705221" element={<Suspense fallback={<PageLoading />}><AdminPanel /></Suspense>} />
        <Route path="*" element={<NotFound />} />
      </Routes>

      <footer>
        <div className="footer-text">
          &copy; {new Date().getFullYear()} <span>Jaxongir Toshpolatov</span> &mdash; {t('footer.rights')}
        </div>
        <div className="footer-text">
          {t('footer.builtWith')} <span>&hearts;</span> &amp; Supabase
        </div>
      </footer>
    </>
  );
}

export default App;
