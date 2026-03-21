import React from 'react';
import { useTranslation } from 'react-i18next';

export default function Hero() {
  const { t } = useTranslation();
  const [text, setText] = React.useState('');
  const [wordIndex, setWordIndex] = React.useState(0);
  const [isDeleting, setIsDeleting] = React.useState(false);

  const typeWords = ["Jaxongir", "Joxacybers"];

  React.useEffect(() => {
    const currentWord = typeWords[wordIndex % typeWords.length];
    let waitTime = isDeleting ? 80 : 200;
    if (!isDeleting && text === currentWord) { waitTime = 2500; setIsDeleting(true); }
    else if (isDeleting && text === '') { setIsDeleting(false); setWordIndex(p => p + 1); waitTime = 500; }
    const timeout = setTimeout(() => {
      setText(currentWord.substring(0, text.length + (isDeleting ? -1 : 1)));
    }, waitTime);
    return () => clearTimeout(timeout);
  }, [text, isDeleting, wordIndex]);

  return (
    <section className="hero" id="home">
      <div className="hero-orb"></div>
      <div className="hero-orb2"></div>
      <div className="hero-content">
        <div className="hero-tag fade-in">{t('hero.tag')}</div>
        <h1 className="fade-in" style={{ display: 'flex', flexWrap: 'wrap', gap: '15px', alignItems: 'center' }}>
          <div className="name">{t('hero.iam')}</div>
          <div className="accent" style={{ color: 'var(--accent)', minWidth: '280px' }}>
            {text}<span className="blink" style={{ fontWeight: '400', opacity: 0.7 }}>_</span>
          </div>
        </h1>
        <div className="hero-subtitle fade-in">{t('hero.subtitle')}</div>
        <p className="hero-desc fade-in">{t('hero.desc')}</p>
        <div className="hero-btns fade-in">
          <a href="#projects" className="btn-primary">{t('hero.viewProjects')}</a>
          <a href="#contact" className="btn-secondary">{t('hero.contactMe')}</a>
        </div>
        <div className="hero-stats fade-in">
          <div><div className="stat-num">6+</div><div className="stat-label">{t('hero.certificates')}</div></div>
          <div><div className="stat-num">10+</div><div className="stat-label">{t('hero.projects')}</div></div>
          <div><div className="stat-num">3+</div><div className="stat-label">{t('hero.yearsLearning')}</div></div>
        </div>
      </div>
    </section>
  );
}
