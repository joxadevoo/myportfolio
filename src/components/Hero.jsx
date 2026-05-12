import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';

const typeWords = ['Full-Stack Developer', 'Cybersecurity Student', 'Open Source Contributor'];

export default function Hero() {
  const { t } = useTranslation();
  const [text, setText] = useState('');
  const [wordIndex, setWordIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [stats, setStats] = useState({ certificates: '6+', projects: '10+', years: '3+' });

  useEffect(() => {
    const currentWord = typeWords[wordIndex % typeWords.length];
    let waitTime = isDeleting ? 60 : 150;
    if (!isDeleting && text === currentWord) { waitTime = 2200; setIsDeleting(true); }
    else if (isDeleting && text === '') { setIsDeleting(false); setWordIndex(p => p + 1); waitTime = 400; }
    const t2 = setTimeout(() => {
      setText(currentWord.substring(0, text.length + (isDeleting ? -1 : 1)));
    }, waitTime);
    return () => clearTimeout(t2);
  }, [text, isDeleting, wordIndex]);

  useEffect(() => {
    async function fetchStats() {
      if (!isSupabaseConfigured) return;
      const [certsRes, projectsRes] = await Promise.all([
        supabase.from('certifications').select('id', { count: 'exact', head: true }),
        supabase.from('projects').select('id', { count: 'exact', head: true }),
      ]);
      setStats({
        certificates: certsRes.count > 0 ? certsRes.count + '+' : '6+',
        projects: projectsRes.count > 0 ? projectsRes.count + '+' : '10+',
        years: '3+',
      });
    }
    fetchStats();
  }, []);

  return (
    <section className="hero" id="home">
      <div className="hero-content">
        <div className="hero-badge fade-in">Available for opportunities</div>

        <h1 className="fade-in">
          Hi, I'm <span className="accent">Jaxongir</span><br />
          {text}<span className="blink" style={{ color: 'var(--accent)', fontWeight: 300 }}>|</span>
        </h1>

        <p className="hero-subtitle fade-in">{t('hero.subtitle')}</p>
        <p className="hero-desc fade-in">{t('hero.desc')}</p>

        <div className="hero-btns fade-in">
          <a href="#projects" className="btn-primary">{t('hero.viewProjects')}</a>
          <a href="#contact" className="btn-secondary">{t('hero.contactMe')}</a>
        </div>

        <div className="hero-stats fade-in">
          <div>
            <div className="stat-num">{stats.certificates}</div>
            <div className="stat-label">{t('hero.certificates')}</div>
          </div>
          <div>
            <div className="stat-num">{stats.projects}</div>
            <div className="stat-label">{t('hero.projects')}</div>
          </div>
          <div>
            <div className="stat-num">{stats.years}</div>
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
