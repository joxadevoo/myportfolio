import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';
import { ArrowLeft, Clock, Calendar, Eye, Twitter, Linkedin, Link as LinkIcon, ThumbsUp, ThumbsDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import MDEditor from '@uiw/react-md-editor';

export default function BlogPost() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [likes, setLikes] = useState(0);
  const [dislikes, setDislikes] = useState(0);
  const [userAction, setUserAction] = useState(null); // 'like' | 'dislike' | null

  useEffect(() => {
    window.scrollTo(0, 0);

    async function fetchPost() {
      try {
        if (!isSupabaseConfigured) {
          const dummyData = [
            { 
              id: "1", icon: '🔐', cat: "Network Security", title: "How SQL Injection Attacks Work", 
              content: "<p>SQL Injection (SQLi) is one of the most dangerous and common vulnerabilities in modern web applications. It occurs when an application improperly parses user-supplied input before executing a SQL query.</p><br/><h3>How It Occurs</h3><p>An attacker can inject a properly crafted SQL statement into text fields. If the application isn't using prepared statements, the database interprets this malicious input as a valid command.</p><br/><h3>Mitigation</h3><p>Always use parameterized queries, utilize ORM security bindings, and sanitize inputs to defend against these vulnerabilities!</p>", 
              date: "12 Jan 2025", readTime: "5 min read", views: 1240 
            },
            { 
              id: "2", icon: '🐧', cat: "Linux", title: "Linux Commands Every Security Pro Should Know", 
              content: "<p>The command line is the primary weapon in a security professional's arsenal.</p><br/><h3>Essential Tooling:</h3><p><strong>grep, awk, sed</strong>: For processing massive log files in milliseconds.<br/><br/><strong>nmap / netstat</strong>: For mapping internal ports and routing footprinting.</p><br/><p>Mastering these turns you from a beginner into an efficient analyst.</p>", 
              date: "04 Feb 2025", readTime: "7 min read", views: 3892 
            },
            { 
              id: "3", icon: '🛡️', cat: "Career", title: "My Journey into Cybersecurity", 
              content: "<p>Entering the cybersecurity space is daunting, but highly rewarding. It began with an innate curiosity to figure out how websites operated securely.</p><br/><h3>The Turning Point</h3><p>I enrolled in the Google Cybersecurity Certificate program, which laid a foundational understanding of SIEM frameworks.</p><br/><h3>Looking Ahead</h3><p>My goal now is continuous upskilling toward a SOC Analyst position.</p>", 
              date: "15 Mar 2025", readTime: "4 min read", views: 953 
            }
          ];
          const found = dummyData.find(p => p.id === id);
          setPost(found);
          setLikes(found?.likes || 0);
          setDislikes(found?.dislikes || 0);
          setLoading(false);
          return;
        }

        const { data, error } = await supabase.from('blog_posts').select('*').eq('id', id).single();
        if (error) throw error;
        
        // Setup initial post view optimistically
        const newViews = (data.views || 0) + 1;
        setPost({ ...data, views: newViews });
        setLikes(data.likes || 0);
        setDislikes(data.dislikes || 0);
        
        // Background DB Update
        await supabase.from('blog_posts').update({ views: newViews }).eq('id', id);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchPost();
  }, [id]);

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    alert(t('blog.linkCopied') || 'Link copied to clipboard!');
  };

  const handleInteraction = async (action) => {
    if (userAction === action) return; // Already clicked

    let newLikes = likes;
    let newDislikes = dislikes;

    if (action === 'like') {
      newLikes += 1;
      if (userAction === 'dislike') newDislikes -= 1;
    } else {
      newDislikes += 1;
      if (userAction === 'like') newLikes -= 1;
    }

    setLikes(newLikes);
    setDislikes(newDislikes);
    setUserAction(action);

    if (isSupabaseConfigured && post) {
      try {
        await supabase.from('blog_posts').update({ likes: newLikes, dislikes: newDislikes }).eq('id', id);
      } catch (err) {
        // Ignore error if columns don't exist yet
      }
    }
  };

  if (loading) {
    return <section style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ fontSize: '1.25rem', color: 'var(--text-muted)' }}>{t('blog.loading') || 'Loading...'}</div>
    </section>;
  }

  if (!post) {
    return <section style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ fontSize: '1.25rem', color: 'var(--text-muted)' }}>{t('blog.notFound') || 'Article not found.'}</div>
    </section>;
  }

  return (
    <section style={{ minHeight: '100vh', padding: '120px 20px 80px', display: 'flex', justifyContent: 'center' }}>
      <div style={{ width: '100%', maxWidth: '720px' }}>
        
        <Link to="/#blog" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '48px', color: 'var(--text-muted)', fontSize: '0.875rem', textDecoration: 'none', transition: 'color var(--transition-smooth)' }} onMouseOver={(e) => e.currentTarget.style.color = 'var(--text-main)'} onMouseOut={(e) => e.currentTarget.style.color = 'var(--text-muted)'}>
          <ArrowLeft size={16} /> {t('blog.back') || 'Back to Articles'}
        </Link>
        
        <article>
          <div style={{ marginBottom: '40px' }}>
            <div className="blog-cat" style={{ marginBottom: '16px' }}>{post.cat || 'Article'}</div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.5rem, 5vw, 3.5rem)', fontWeight: 500, lineHeight: 1.1, marginBottom: '24px', letterSpacing: '-0.02em' }}>
              {post.title}
            </h1>
            
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '24px', color: 'var(--text-muted)', fontSize: '0.875rem', borderBottom: '1px solid var(--border)', paddingBottom: '32px' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Calendar size={16} /> {post.date || t('blog.recent') || 'Recent'}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Clock size={16} /> {post.readTime || `5 ${t('blog.minRead') || 'min read'}`}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Eye size={16} /> {post.views} {t('blog.views') || 'views'}
              </span>
            </div>
          </div>
          
          {post.icon && post.icon.startsWith('http') && (
            <div style={{ width: '100%', aspectRatio: '16/9', marginBottom: '48px', borderRadius: '16px', overflow: 'hidden', background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
              <img src={post.icon} alt={post.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          )}
            
          <div className="blog-content-wrapper" style={{ fontSize: '1.125rem', lineHeight: 1.8, color: 'var(--text-main)' }}>
            <MDEditor.Markdown 
              source={post.content || ''} 
              style={{ 
                background: 'transparent', 
                color: 'inherit',
                fontFamily: 'var(--font-sans)'
              }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '64px', paddingTop: '32px', borderTop: '1px solid var(--border)', flexWrap: 'wrap', gap: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <button 
                onClick={() => handleInteraction('like')}
                style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'transparent', border: 'none', color: userAction === 'like' ? 'var(--text-main)' : 'var(--text-muted)', cursor: 'pointer', transition: 'color 0.3s' }}
              >
                <ThumbsUp size={20} className={userAction === 'like' ? 'fill-current' : ''} />
                <span style={{ fontSize: '0.875rem' }}>{likes}</span>
              </button>
              <button 
                onClick={() => handleInteraction('dislike')}
                style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'transparent', border: 'none', color: userAction === 'dislike' ? 'var(--text-main)' : 'var(--text-muted)', cursor: 'pointer', transition: 'color 0.3s' }}
              >
                <ThumbsDown size={20} className={userAction === 'dislike' ? 'fill-current' : ''} />
                <span style={{ fontSize: '0.875rem' }}>{dislikes}</span>
              </button>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{t('blog.share') || 'Share'}</span>
              <button onClick={copyLink} style={{ background: 'transparent', border: 'none', color: 'var(--text-main)', cursor: 'pointer', display: 'flex', opacity: 0.7, transition: 'opacity 0.3s' }} onMouseOver={e=>e.currentTarget.style.opacity=1} onMouseOut={e=>e.currentTarget.style.opacity=0.7} title="Copy Link">
                <LinkIcon size={20} />
              </button>
              <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(window.location.href)}`} target="_blank" rel="noreferrer" style={{ color: 'var(--text-main)', opacity: 0.7, transition: 'opacity 0.3s' }} onMouseOver={e=>e.currentTarget.style.opacity=1} onMouseOut={e=>e.currentTarget.style.opacity=0.7} title="Share on Twitter">
                <Twitter size={20} />
              </a>
              <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`} target="_blank" rel="noreferrer" style={{ color: 'var(--text-main)', opacity: 0.7, transition: 'opacity 0.3s' }} onMouseOver={e=>e.currentTarget.style.opacity=1} onMouseOut={e=>e.currentTarget.style.opacity=0.7} title="Share on LinkedIn">
                <Linkedin size={20} />
              </a>
            </div>
          </div>

        </article>
      </div>
    </section>
  );
}
