import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';
import { Calendar, Clock, FileText } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function BlogSection() {
  const { t } = useTranslation();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    async function fetchPosts() {
      try {
        if (!isSupabaseConfigured) {
          setPosts([]);
          setLoading(false);
          return;
        }

        const { data, error } = await supabase.from('blog_posts').select('*').order('created_at', { ascending: false });
        if (error) {
           setErrorMsg(error.message);
           throw error;
        }
        setPosts(data || []);
      } catch (err) {
        console.error("Error fetching posts:", err);
        setErrorMsg("System networking error");
      } finally {
        setLoading(false);
      }
    }
    fetchPosts();
  }, []);

  if (loading) {
    return (
      <section id="blog">
         <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
           Loading posts...
         </div>
      </section>
    );
  }

  if (errorMsg || posts.length === 0) {
    return (
      <section id="blog">
        <div className="section-header">
          <div className="section-eyebrow">06 - Blog</div>
          <h2 className="section-title">{t('blog.title')}</h2>
        </div>
        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
          {errorMsg ? (
            <div style={{ color: 'var(--red)' }}>
              ERROR: {errorMsg} - {t('blog.error')}
            </div>
          ) : (
            <div>{t('blog.empty')}</div>
          )}
        </div>
      </section>
    );
  }

  return (
    <section id="blog">
      <div className="section-header">
        <div className="section-eyebrow">06 - Blog</div>
        <h2 className="section-title">{t('blog.title')}</h2>
      </div>
      <div className="blog-grid">
        {posts.map(p => (
          <Link to={`/blog/${p.id}`} className="blog-card" key={p.id}>
            <div className="blog-img">
              {p.icon && p.icon.startsWith('http') ? (
                <img src={p.icon} alt={p.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                  <FileText size={32} color="var(--accent)" />
                </span>
              )}
            </div>
            <div className="blog-body">
              <div className="blog-cat">{p.cat || 'Article'}</div>
              <div className="blog-title">{p.title}</div>
              <div className="blog-excerpt">{p.excerpt}</div>
              <div className="blog-meta">
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Calendar size={12} color="var(--accent)" /> {p.date || t('blog.recent')}</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Clock size={12} color="var(--accent)" /> {p.readTime || '5 min read'}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
