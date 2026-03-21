import React, { useEffect, useState } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';

export default function ProjectGrid() {
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
      <section id="projects" style={{ background: 'rgba(0,20,40,0.3)', padding: '60px 0' }}>
         <div style={{ textAlign: 'center', fontFamily: 'Share Tech Mono', color: 'var(--accent)' }}>
           Loading payload...
         </div>
      </section>
    );
  }

  if (errorMsg || projects.length === 0) {
    return (
      <section id="projects" style={{ background: 'rgba(0,20,40,0.3)' }}>
        <div className="section-header">
          <span className="section-num">// 04</span>
          <h2 className="section-title">Projects</h2>
          <div className="section-line"></div>
        </div>
        <div className="container" style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div className="about-terminal" style={{ margin: '0 auto' }}>
            <div className="terminal-bar">
              <div className="dot red"></div>
              <div className="dot yellow"></div>
              <div className="dot green"></div>
              <span className="terminal-title">status.sh</span>
            </div>
            <div className="terminal-body" style={{ textAlign: 'center', padding: '40px' }}>
              {errorMsg ? (
                <div className="t-out highlight" style={{ color: 'var(--accent3)' }}>
                  ERROR: {errorMsg} - Connection failed. System undergoing maintenance.
                </div>
              ) : (
                <div className="t-out" style={{ color: 'var(--text-dim)', fontSize: '1.05rem' }}>
                  <span className="blink">_</span> No projects deployed yet. Database is empty.
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="projects" style={{ background: 'rgba(0,20,40,0.3)' }}>
      <div className="section-header">
        <span className="section-num">// 04</span>
        <h2 className="section-title">Projects</h2>
        <div className="section-line"></div>
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
