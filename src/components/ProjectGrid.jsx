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
          setProjects([]);
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
        setErrorMsg("System networking error");
      } finally {
        setLoading(false);
      }
    }
    fetchProjects();
  }, []);

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
          <div className="section-eyebrow">04 - Projects</div>
          <h2 className="section-title">{t('projects.title')}</h2>
        </div>
        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
          {errorMsg ? (
            <div style={{ color: 'var(--red)' }}>
              ERROR: {errorMsg} - {t('projects.error')}
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
        <div className="section-eyebrow">04 - Projects</div>
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
