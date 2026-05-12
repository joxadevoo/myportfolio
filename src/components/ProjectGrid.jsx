import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';

export default function ProjectGrid() {
  const { t } = useTranslation();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    async function fetchProjects() {
      try {
        if (!isSupabaseConfigured) {
          setProjects([
            {
              id: 1, tag: "NETWORK SECURITY", title: "Home Lab Security Setup",
              description: "Built a virtual security lab environment to practice penetration testing, network monitoring, and intrusion detection in a safe controlled environment.",
              tools: ["Linux", "Wireshark", "Suricata", "VirtualBox"]
            },
            {
              id: 2, tag: "INCIDENT RESPONSE", title: "SIEM Log Analysis",
              description: "Analyzed security logs using Splunk to identify suspicious activities, potential threats, and security incidents in a simulated enterprise environment.",
              tools: ["Splunk", "Chronicle", "SQL", "Python"]
            },
            {
              id: 3, tag: "AUTOMATION", title: "Security Automation Script",
              description: "Developed Python scripts to automate repetitive security tasks including log parsing, IP reputation checking, and automated alert generation.",
              tools: ["Python", "Bash", "Linux", "API"]
            },
            {
              id: 4, tag: "WEB SECURITY", title: "Vulnerability Assessment",
              description: "Conducted vulnerability assessments on test web applications identifying SQL injection, XSS, and other OWASP Top 10 vulnerabilities.",
              tools: ["OWASP", "Burp Suite", "Nmap", "Kali Linux"]
            }
          ]);
          setLoading(false);
          return;
        }

        const { data, error } = await supabase.from('projects').select('*').order('id', { ascending: true });
        if (error) {
          setErrorMsg(error.message);
          throw error;
        }
        setProjects(data || []);
      } catch (err) {
        console.error("Error fetching projects:", err);
        if (!errorMsg) setErrorMsg("System networking error");
      } finally {
        setLoading(false);
      }
    }
    fetchProjects();
  }, [errorMsg]);

  if (loading) {
    return (
      <section id="projects">
         <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
           Loading projects...
         </div>
      </section>
    );
  }

  if (errorMsg || projects.length === 0) {
    return (
      <section id="projects">
        <div className="section-header">
          <div className="section-eyebrow">04 — Projects</div>
          <h2 className="section-title">{t('projects.title')}</h2>
        </div>
        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
          {errorMsg ? (
            <div style={{ color: 'var(--red)' }}>
              ERROR: {errorMsg} — {t('projects.error')}
            </div>
          ) : (
            <div>{t('projects.empty')}</div>
          )}
        </div>
      </section>
    );
  }

  return (
    <section id="projects">
      <div className="section-header">
        <div className="section-eyebrow">04 — Projects</div>
        <h2 className="section-title">{t('projects.title')}</h2>
      </div>
      <div className="projects-grid">
        {projects.map((p, i) => {
          const numStr = (i + 1).toString().padStart(2, '0');
          return (
            <div className="project-card" key={p.id}>
              <div className="project-num">{numStr}</div>
              <div className="project-tag">{p.tag || "PROJECT"}</div>
              <div className="project-name">{p.title}</div>
              <div className="project-desc">{p.description}</div>
              <div className="project-tools">
                {p.tools && p.tools.map((t, idx) => (
                  <span className="tool-tag" key={idx}>{t}</span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
