import React, { useState, useEffect } from 'react';

const typeWords = ["Jaxongir", "Joxacybers"];

export default function Hero() {
  const [text, setText] = useState('');
  const [wordIndex, setWordIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentWord = typeWords[wordIndex % typeWords.length];
    
    let waitTime = isDeleting ? 80 : 200; // typing speed

    if (!isDeleting && text === currentWord) {
      waitTime = 2500; // Pause at the end of word
      setIsDeleting(true);
    } else if (isDeleting && text === '') {
      setIsDeleting(false);
      setWordIndex((prev) => prev + 1);
      waitTime = 500; // Pause before typing next word
    }

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
        <div className="hero-tag fade-in">Cybersecurity Professional</div>
        
        <h1 className="fade-in" style={{ display: 'flex', flexWrap: 'wrap', gap: '15px', alignItems: 'center' }}>
          <div className="name">I'm</div>
          <div className="accent" style={{ color: 'var(--accent)', minWidth: '280px' }}>
            {text}<span className="blink" style={{ fontWeight: '400', opacity: 0.7 }}>_</span>
          </div>
        </h1>
        
        <div className="hero-subtitle fade-in">Security Analyst · Network Defender · CTF Player</div>
        <p className="hero-desc fade-in">
          Passionate about protecting digital infrastructure and identifying vulnerabilities before attackers do. Currently advancing through Google Cybersecurity Certificate program.
        </p>
        <div className="hero-btns fade-in">
          <a href="#projects" className="btn-primary">VIEW PROJECTS</a>
          <a href="#contact" className="btn-secondary">CONTACT ME</a>
        </div>
        <div className="hero-stats fade-in">
          <div>
            <div className="stat-num">6+</div>
            <div className="stat-label">Certificates</div>
          </div>
          <div>
            <div className="stat-num">10+</div>
            <div className="stat-label">Projects</div>
          </div>
          <div>
            <div className="stat-num">3+</div>
            <div className="stat-label">Years Learning</div>
          </div>
        </div>
      </div>
    </section>
  );
}
