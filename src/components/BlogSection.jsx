import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';
import { Calendar, Clock } from 'lucide-react';

export default function BlogSection() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    async function fetchPosts() {
      try {
        if (!isSupabaseConfigured) {
          setPosts([
            { id: 1, icon: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=600', cat: "Network Security", title: "How SQL Injection Attacks Work", excerpt: "A deep dive into one of the most common web vulnerabilities and how to defend against it.", date: "Jan 2025", readTime: "5 min read" },
            { id: 2, icon: 'https://images.unsplash.com/photo-1614064641913-a53e839eabcc?q=80&w=600', cat: "Linux", title: "Linux Commands Every Security Pro Should Know", excerpt: "Essential command-line tools and techniques for security professionals using Linux daily.", date: "Feb 2025", readTime: "7 min read" },
            { id: 3, icon: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=600', cat: "Career", title: "My Journey into Cybersecurity", excerpt: "From zero to cybersecurity student — my experience with Google Career Certificates.", date: "Mar 2025", readTime: "4 min read" }
          ]);
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
        if (!errorMsg) setErrorMsg("System networking error");
      } finally {
        setLoading(false);
      }
    }
    fetchPosts();
  }, [errorMsg]);

  if (loading) {
    return (
      <section id="blog" style={{ padding: '60px 0' }}>
         <div style={{ textAlign: 'center', fontFamily: 'Share Tech Mono', color: 'var(--accent)' }}>
           Loading payload...
         </div>
      </section>
    );
  }

  if (errorMsg || posts.length === 0) {
    return (
      <section id="blog">
        <div className="section-header">
          <span className="section-num">// 05</span>
          <h2 className="section-title">Blog Posts</h2>
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
                  <span className="blink">_</span> No entries found. Blog database is currently empty.
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="blog">
      <div className="section-header">
        <span className="section-num">// 05</span>
        <h2 className="section-title">Blog Posts</h2>
        <div className="section-line"></div>
      </div>
      <div className="blog-grid">
        {posts.map(p => (
          <Link to={`/blog/${p.id}`} className="blog-card" key={p.id} style={{ display: 'block', textDecoration: 'none' }}>
            <div className="blog-img" style={{ padding: 0, overflow: 'hidden', minWidth: '80px', height: '80px', borderRadius: '4px' }}>
              {p.icon && p.icon.startsWith('http') ? (
                <img src={p.icon} alt={p.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <span style={{ fontSize: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>{p.icon || '📝'}</span>
              )}
            </div>
            <div className="blog-body">
              <div className="blog-cat">{p.cat || 'Article'}</div>
              <div className="blog-title">{p.title}</div>
              <div className="blog-excerpt">{p.excerpt}</div>
              <div className="blog-meta">
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Calendar size={12} color="var(--accent)" /> {p.date || 'Recent'}</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Clock size={12} color="var(--accent)" /> {p.readTime || '5 min read'}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
