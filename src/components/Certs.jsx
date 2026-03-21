import React from 'react';
import { Award, Lock, Globe, ClipboardCheck } from 'lucide-react';

export default function Certs() {
  const iconStyle = {
    color: 'var(--accent)',
    filter: 'drop-shadow(0 0 10px rgba(0, 255, 231, 0.8))'
  };

  const certs = [
    { title: 'Google Cybersecurity Certificate', issuer: 'Google / Coursera', date: 'In Progress — 2024', icon: <Award size={24} style={iconStyle} /> },
    { title: 'CompTIA Security+', issuer: 'CompTIA', date: 'Planned — 2025', icon: <Lock size={24} style={iconStyle} /> },
    { title: 'Cisco CCNA', issuer: 'Cisco Networking Academy', date: 'Planned — 2025', icon: <Globe size={24} style={iconStyle} /> },
    { title: 'CEH — Ethical Hacking', issuer: 'EC-Council', date: 'Planned — 2025', icon: <ClipboardCheck size={24} style={iconStyle} /> }
  ];

  return (
    <section id="certs">
      <div className="section-header">
        <span className="section-num">// 03</span>
        <h2 className="section-title">Certifications</h2>
        <div className="section-line"></div>
      </div>
      <div className="cert-grid">
        {certs.map((c, i) => (
          <div className="cert-card" key={i}>
            <div className="cert-icon">
              {c.icon}
            </div>
            <div>
              <div className="cert-name">{c.title}</div>
              <div className="cert-issuer">{c.issuer}</div>
              <div className="cert-date">{c.date}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
