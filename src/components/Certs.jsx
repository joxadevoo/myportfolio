import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Award, Lock, Globe, ClipboardCheck, Shield, Star, BookOpen, CheckCircle } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';

const iconMap = {
  Award: <Award size={24} />, Lock: <Lock size={24} />, Globe: <Globe size={24} />,
  ClipboardCheck: <ClipboardCheck size={24} />, Shield: <Shield size={24} />,
  Star: <Star size={24} />, BookOpen: <BookOpen size={24} />, CheckCircle: <CheckCircle size={24} />
};

const iconStyle = { color: 'var(--accent)' };

export default function Certs() {
  const { t } = useTranslation();
  const [certs, setCerts] = useState([]);

  useEffect(() => {
    async function fetch() {
      if (!isSupabaseConfigured) { 
        setCerts([]);
        return; 
      }
      
      try {
        const { data, error } = await supabase.from('certifications').select('*').order('sort_order', { ascending: true });
        if (error) throw error;
        setCerts(data || []);
      } catch {
        setCerts([]);
      }
    }
    fetch();
  }, []);

  return (
    <section id="certs">
      <div className="section-header">
        <div className="section-eyebrow">03 - Certifications</div>
        <h2 className="section-title">{t('certs.title')}</h2>
      </div>
      <div className="cert-grid">
        {certs.map((c, i) => {
          const IconEl = iconMap[c.icon] || <Award size={24} />;
          return (
            <div className="cert-card" key={i}>
              <div className="cert-icon">
                {React.cloneElement(IconEl, { style: iconStyle })}
              </div>
              <div>
                <div className="cert-name">{c.title}</div>
                <div className="cert-issuer">{c.issuer}</div>
                <div className="cert-date">{c.date}</div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
