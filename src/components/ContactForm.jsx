import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import emailjs from '@emailjs/browser';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';
import { Linkedin, Github, Mail, MapPin, Send } from 'lucide-react';

const EMAILJS_SERVICE  = import.meta.env.VITE_EMAILJS_SERVICE_ID  || '';
const EMAILJS_TEMPLATE = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || '';
const EMAILJS_KEY      = import.meta.env.VITE_EMAILJS_PUBLIC_KEY  || '';
const EMAIL_CONFIGURED = EMAILJS_SERVICE && EMAILJS_TEMPLATE && EMAILJS_KEY;

export default function ContactForm() {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState({ submitting: false, success: false, error: null });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ submitting: true, success: false, error: null });

    try {
      // 1. Save to Supabase
      if (isSupabaseConfigured) {
        await supabase.from('messages').insert([formData]);
      }

      // 2. Send email notification via EmailJS
      if (EMAIL_CONFIGURED) {
        await emailjs.send(
          EMAILJS_SERVICE,
          EMAILJS_TEMPLATE,
          {
            name:    formData.name,
            email:   formData.email,
            message: formData.message,
            time:    new Date().toLocaleString('uz-UZ')
          },
          EMAILJS_KEY
        );
      }

      setStatus({ submitting: false, success: true, error: null });
      setFormData({ name: '', email: '', message: '' });
      setTimeout(() => setStatus({ submitting: false, success: false, error: null }), 5000);
    } catch (err) {
      console.error(err);
      setStatus({ submitting: false, success: false, error: 'Failed to send message.' });
    }
  };

  return (
    <section id="contact">
      <div className="section-header">
        <div className="section-eyebrow">06 — Contact</div>
        <h2 className="section-title">{t('contact.title')}</h2>
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
            <a href="https://t.me/joxacybers" target="_blank" rel="noreferrer" className="contact-link">
              <span className="contact-link-icon"><Send size={20} /></span> t.me/joxacybers
            </a>
            <a href="#contact" className="contact-link">
              <span className="contact-link-icon"><MapPin size={20} /></span> Termez, Uzbekistan
            </a>
          </div>
        </div>

        <form className="contact-form" onSubmit={handleSubmit}>
          {status.success && (
            <div style={{ color: 'var(--green)', padding: '12px 16px', borderRadius: '8px', border: '1px solid rgba(34,197,94,0.3)', background: 'rgba(34,197,94,0.08)', fontSize: '0.9rem' }}>
              ✓ {t('contact.success')}
            </div>
          )}
          {status.error && (
            <div style={{ color: 'var(--red)', padding: '12px 16px', borderRadius: '8px', border: '1px solid rgba(239,68,68,0.3)', background: 'rgba(239,68,68,0.08)', fontSize: '0.9rem' }}>
              ✗ {status.error}
            </div>
          )}
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
