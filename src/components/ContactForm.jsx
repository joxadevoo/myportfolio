import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';
import { Linkedin, Github, Mail, MapPin } from 'lucide-react';

export default function ContactForm() {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState({ submitting: false, success: false, error: null });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ submitting: true, success: false, error: null });
    try {
      if (!isSupabaseConfigured) {
        setTimeout(() => {
          setStatus({ submitting: false, success: true, error: null });
          setFormData({ name: '', email: '', message: '' });
        }, 1000);
        return;
      }
      const { error } = await supabase.from('messages').insert([formData]);
      if (error) throw error;
      setStatus({ submitting: false, success: true, error: null });
      setFormData({ name: '', email: '', message: '' });
    } catch (err) {
      console.error(err);
      setStatus({ submitting: false, success: false, error: "Failed to send message." });
    }
  };

  return (
    <section id="contact" style={{ background: 'rgba(0,20,40,0.3)' }}>
      <div className="section-header">
        <span className="section-num">// 06</span>
        <h2 className="section-title">{t('contact.title')}</h2>
        <div className="section-line"></div>
      </div>
      <div className="contact-grid">
        <div className="contact-info">
          <h3>{t('contact.heading')}</h3>
          <p>{t('contact.desc')}</p>
          <div className="contact-links">
            <a href="https://www.linkedin.com/in/jaxongirtoshpolatov" target="_blank" rel="noreferrer" className="contact-link">
              <span className="contact-link-icon"><Linkedin size={20} /></span> linkedin.com/in/jaxongirtoshpolatov
            </a>
            <a href="https://github.com/joxadevoo" target="_blank" rel="noreferrer" className="contact-link">
              <span className="contact-link-icon"><Github size={20} /></span> github.com/joxadevoo
            </a>
            <a href="mailto:joxacybers@proton.me" className="contact-link">
              <span className="contact-link-icon"><Mail size={20} /></span> joxacybers@proton.me
            </a>
            <a href="#contact" className="contact-link">
              <span className="contact-link-icon"><MapPin size={20} /></span> Termez, Uzbekistan
            </a>
          </div>
        </div>
        
        <form className="contact-form" onSubmit={handleSubmit}>
          {status.success && <div style={{ color: 'var(--accent)', fontFamily: 'Share Tech Mono' }}>{t('contact.success')}</div>}
          <div className="form-group">
            <label className="form-label">{t('contact.name')}</label>
            <input type="text" name="name" className="form-input" placeholder="John Doe" value={formData.name} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label className="form-label">{t('contact.email')}</label>
            <input type="email" name="email" className="form-input" placeholder="john@example.com" value={formData.email} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label className="form-label">{t('contact.message')}</label>
            <textarea name="message" className="form-input" placeholder={t('contact.placeholder')} value={formData.message} onChange={handleChange} required></textarea>
          </div>
          <button type="submit" className="btn-primary" style={{ width: 'fit-content' }} disabled={status.submitting}>
            {status.submitting ? t('contact.sending') : t('contact.send')}
          </button>
        </form>
      </div>
    </section>
  );
}
