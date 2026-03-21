import React from 'react';
import { useTranslation } from 'react-i18next';
import { Shield, Terminal, Code, Database, Activity, ShieldAlert } from 'lucide-react';

export default function Skills() {
  const { t } = useTranslation();
  const iconStyle = {
    color: 'var(--accent)',
    filter: 'drop-shadow(0 0 10px rgba(0, 255, 231, 0.8))'
  };

  const skills = [
    { key: 'networkSecurity', icon: <Shield size={36} style={iconStyle} />, percent: 80 },
    { key: 'linux', icon: <Terminal size={36} style={iconStyle} />, percent: 75 },
    { key: 'python', icon: <Code size={36} style={iconStyle} />, percent: 65 },
    { key: 'sql', icon: <Database size={36} style={iconStyle} />, percent: 70 },
    { key: 'siem', icon: <Activity size={36} style={iconStyle} />, percent: 60 },
    { key: 'incident', icon: <ShieldAlert size={36} style={iconStyle} />, percent: 55 }
  ];

  return (
    <section id="skills" style={{ background: 'rgba(0,20,40,0.3)' }}>
      <div className="section-header">
        <span className="section-num">// 02</span>
        <h2 className="section-title">{t('skills.title')}</h2>
        <div className="section-line"></div>
      </div>
      <div className="skills-grid">
        {skills.map((s, i) => (
          <div className="skill-card" key={i}>
            <div className="skill-icon" style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', marginBottom: '15px' }}>
              {s.icon}
            </div>
            <div className="skill-name">{t(`skills.${s.key}`)}</div>
            <div className="skill-bar-bg"><div className="skill-bar-fill" style={{ width: s.percent + '%' }}></div></div>
            <div className="skill-percent">{s.percent}%</div>
          </div>
        ))}
      </div>
    </section>
  );
}
