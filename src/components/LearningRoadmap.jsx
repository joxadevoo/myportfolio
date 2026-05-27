import React from 'react';
import { useTranslation } from 'react-i18next';
import { BookOpen, Terminal, Shield, CheckCircle } from 'lucide-react';

const icons = [BookOpen, Terminal, Shield, CheckCircle];

export default function LearningRoadmap() {
  const { t } = useTranslation();
  const steps = t('roadmap.steps', { returnObjects: true });
  const roadmapSteps = Array.isArray(steps) ? steps : [];

  return (
    <section id="roadmap" className="roadmap-section">
      <div className="section-header">
        <div className="section-eyebrow">03 - Roadmap</div>
        <h2 className="section-title">{t('roadmap.title')}</h2>
      </div>

      <div className="roadmap-grid">
        {roadmapSteps.map((step, index) => {
          const Icon = icons[index] || BookOpen;

          return (
            <div className={`roadmap-step ${step.status || ''}`} key={step.title}>
              <div className="roadmap-step-head">
                <span className="roadmap-step-index">{String(index + 1).padStart(2, '0')}</span>
                <span className="roadmap-step-icon">
                  <Icon size={20} />
                </span>
              </div>
              <span className={`roadmap-status ${step.status}`}>
                {t(`roadmap.status.${step.status}`)}
              </span>
              <h3>{step.title}</h3>
              <p>{step.desc}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
