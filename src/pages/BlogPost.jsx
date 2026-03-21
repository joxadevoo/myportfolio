import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';
import { ArrowLeft, Clock, Calendar, Eye, Twitter, Linkedin, Link as LinkIcon } from 'lucide-react';
import MDEditor from '@uiw/react-md-editor';

export default function BlogPost() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

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
          setLoading(false);
          return;
        }

        const { data, error } = await supabase.from('blog_posts').select('*').eq('id', id).single();
        if (error) throw error;
        
        // Setup initial post view optimistically
        const newViews = (data.views || 0) + 1;
        setPost({ ...data, views: newViews });
        
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
    alert('Payload URL copied to clipboard!');
  };

  if (loading) {
    return <section style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="terminal-title blink" style={{ fontSize: '1.5rem' }}>Loading secure transmission...</div>
    </section>;
  }

  if (!post) {
    return <section style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="terminal-title" style={{ fontSize: '1.5rem', color: 'var(--accent3)' }}>Error 404: Payload not found.</div>
    </section>;
  }

  return (
    <section style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '120px 20px 80px' }}>
      <div style={{ width: '100%', maxWidth: '850px' }}>
        
        <Link to="/#blog" className="btn-secondary" style={{ display: 'inline-flex', gap: '10px', marginBottom: '30px', padding: '10px 20px', clipPath: 'none' }}>
          <ArrowLeft size={16} /> RETURN TO MAINFRAME
        </Link>
        
        <article className="about-terminal" style={{ margin: '0 auto', boxShadow: '0 10px 40px rgba(0,0,0,0.5)' }}>
          <div className="terminal-bar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div className="dot red"></div>
              <div className="dot yellow"></div>
              <div className="dot green"></div>
              <span className="terminal-title">view_payload_{id}.sh</span>
            </div>
            <div className="blog-cat" style={{ margin: 0 }}>{post.cat || 'Article'}</div>
          </div>
          
          <div className="terminal-body" style={{ padding: '50px 40px' }}>
            {post.icon && post.icon.startsWith('http') && (
               <div style={{ width: '100%', height: '300px', marginBottom: '35px', borderRadius: '4px', overflow: 'hidden' }}>
                 <img src={post.icon} alt={post.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
               </div>
            )}
            <h1 style={{ fontSize: 'clamp(2rem, 4vw, 2.8rem)', marginBottom: '25px', lineHeight: 1.2 }}>{post.title}</h1>
            
            {/* Meta Data Row */}
            <div style={{ 
              display: 'flex', flexWrap: 'wrap', gap: '20px', 
              marginBottom: '40px', paddingBottom: '20px', 
              borderBottom: '1px solid var(--border)',
              fontFamily: 'Share Tech Mono', fontSize: '0.85rem', color: 'var(--text-dim)'
            }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Calendar size={14} color="var(--accent)" /> {post.date || 'Recent'}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Clock size={14} color="var(--accent)" /> {post.readTime || '5 min read'}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Eye size={14} color="var(--accent)" /> {post.views} views
              </span>
            </div>
            
            {/* Post Content */}
            <div data-color-mode="dark" style={{ marginBottom: '60px' }}>
              <MDEditor.Markdown 
                source={post.content || ''} 
                style={{ 
                  background: 'transparent', 
                  color: 'var(--text)', 
                  fontSize: '1.05rem', 
                  lineHeight: 1.9,
                  fontFamily: 'inherit'
                }}
              />
            </div>

            {/* Share / Footer Row */}
            <div style={{ 
              display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
              paddingTop: '25px', borderTop: '1px dashed var(--border)',
              flexWrap: 'wrap', gap: '20px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.85rem', fontFamily: 'Share Tech Mono', color: 'var(--accent)' }}>
                <span className="blink">_</span> EOF
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <span style={{ fontSize: '0.8rem', fontFamily: 'Share Tech Mono', color: 'var(--text-dim)' }}>SHARE:</span>
                <button onClick={copyLink} style={{ background: 'transparent', border: 'none', color: 'var(--text)', cursor: 'pointer', display: 'flex' }} title="Copy Link">
                  <LinkIcon size={18} />
                </button>
                <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(window.location.href)}`} target="_blank" rel="noreferrer" style={{ color: 'var(--text)' }} title="Share on Twitter">
                  <Twitter size={18} />
                </a>
                <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`} target="_blank" rel="noreferrer" style={{ color: 'var(--text)' }} title="Share on LinkedIn">
                  <Linkedin size={18} />
                </a>
              </div>
            </div>

          </div>
        </article>
      </div>
    </section>
  );
}
