import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Shield, Terminal, Code, Database, Activity, ShieldAlert, Wifi, Lock, Globe, Server, Eye, Cpu } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';

const iconMap = {
  Shield: <Shield size={36} />, Terminal: <Terminal size={36} />, Code: <Code size={36} />,
  Database: <Database size={36} />, Activity: <Activity size={36} />, ShieldAlert: <ShieldAlert size={36} />,
  Wifi: <Wifi size={36} />, Lock: <Lock size={36} />, Globe: <Globe size={36} />,
  Server: <Server size={36} />, Eye: <Eye size={36} />, Cpu: <Cpu size={36} />
};

const iconStyle = { color: 'var(--accent)' };

export default function Skills() {
  const { t } = useTranslation();
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetch() {
      const fallbackSkills = [
        { name: "Network Security", percent: 90, icon: "Shield" },
        { name: "Linux Admin", percent: 85, icon: "Terminal" },
        { name: "Python Scripting", percent: 80, icon: "Code" },
        { name: "Databases (SQL)", percent: 75, icon: "Database" },
        { name: "SIEM Tools", percent: 70, icon: "Activity" },
        { name: "Vulnerability Assessment", percent: 65, icon: "Eye" }
      ];

      if (!isSupabaseConfigured) { 
        setSkills(fallbackSkills); 
        setLoading(false); 
        return; 
      }
      
      try {
        const { data, error } = await supabase.from('skills').select('*').order('sort_order', { ascending: true });
        if (error || !data || data.length === 0) {
          setSkills(fallbackSkills);
        } else {
          setSkills(data);
        }
      } catch (err) {
        setSkills(fallbackSkills);
      } finally {
        setLoading(false);
      }
    }
    fetch();
  }, []);

  return (
    <section id="skills">
      <div className="section-header">
        <div className="section-eyebrow">02 — Skills</div>
        <h2 className="section-title">{t('skills.title')}</h2>
      </div>
      <div className="skills-grid">
        {skills.map((s, i) => {
          const IconEl = iconMap[s.icon] || <Shield size={36} />;
          return (
            <div className="skill-card" key={i}>
              <div className="skill-icon" style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
                {React.cloneElement(IconEl, { style: iconStyle })}
              </div>
              <div className="skill-name">{s.name}</div>
              <div className="skill-bar-bg"><div className="skill-bar-fill" style={{ width: s.percent + '%' }}></div></div>
              <div className="skill-percent">{s.percent}%</div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
