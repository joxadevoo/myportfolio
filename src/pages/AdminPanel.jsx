import React, { useState, useRef, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import MDEditor from '@uiw/react-md-editor';

export default function AdminPanel() {
  const [auth, setAuth] = useState(false);
  const [step, setStep] = useState('login'); 
  const [loginVal, setLoginVal] = useState('');
  const [passVal, setPassVal] = useState('');
  
  const [activeTab, setActiveTab] = useState('project'); 
  const [projectForm, setProjectForm] = useState({ title: '', tag: '', description: '', tools: '' });
  const [postForm, setPostForm] = useState({ title: '', cat: '', excerpt: '', content: '', image: '' });
  const [status, setStatus] = useState(null); 
  const inputRef = useRef(null);

  useEffect(() => {
    if (!auth && inputRef.current) {
      inputRef.current.focus();
    }
  }, [step, auth]);

  const handleTerminalSubmit = (e) => {
    e.preventDefault();
    if (step === 'login') {
      if (loginVal.trim() === '') return;
      setStep('password');
      setStatus(null);
    } else {
      if (loginVal === 'admin' && passVal === 'cyber2025') {
        setAuth(true);
        setStatus(null);
      } else {
        setStatus({ type: 'error', msg: 'Login incorrect' });
        setStep('login');
        setLoginVal('');
        setPassVal('');
      }
    }
  };

  const clearStatus = () => {
    setTimeout(() => setStatus(null), 5000);
  };

  const handleProjectSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: 'loading', msg: 'Transmitting Payload to Database...' });
    const toolsArray = projectForm.tools.split(',').map(t => t.trim()).filter(Boolean);
    const { error } = await supabase.from('projects').insert([{
      title: projectForm.title,
      tag: projectForm.tag,
      description: projectForm.description,
      tools: toolsArray
    }]);

    if (error) {
      setStatus({ type: 'error', msg: `ERROR: ${error.message}` });
    } else {
      setStatus({ type: 'success', msg: 'PROJECT DEPLOYED SUCCESSFULLY!' });
      setProjectForm({ title: '', tag: '', description: '', tools: '' });
      clearStatus();
    }
  };

  const handlePostSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: 'loading', msg: 'Transmitting Payload to Database...' });

    // Auto-calculate Date
    const autoDate = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    
    // Auto-calculate Read Time (avg 200 words per minute)
    const wordCount = postForm.content.replace(/<[^>]*>?/gm, '').split(/\s+/).length;
    const autoReadTime = Math.max(1, Math.ceil(wordCount / 200)) + ' min read';

    // Define banner URL (store in 'icon' column to save DB migrations)
    const fallbackImage = 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=1000&auto=format&fit=crop';
    const finalImageUrl = postForm.image.trim() !== '' ? postForm.image : fallbackImage;

    const { error } = await supabase.from('blog_posts').insert([{
      title: postForm.title,
      cat: postForm.cat,
      icon: finalImageUrl,
      excerpt: postForm.excerpt,
      content: postForm.content,
      date: autoDate,
      readTime: autoReadTime
    }]);

    if (error) {
      setStatus({ type: 'error', msg: `ERROR: ${error.message}` });
    } else {
      setStatus({ type: 'success', msg: 'BLOG ENTRY DEPLOYED SUCCESSFULLY!' });
      setPostForm({ title: '', cat: '', excerpt: '', content: '', image: '' });
      clearStatus();
    }
  };

  if (!auth) {
    return (
      <section style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }} onClick={() => inputRef.current?.focus()}>
        <div className="about-terminal" style={{ maxWidth: '600px', width: '100%', boxShadow: '0 0 50px rgba(0, 255, 231, 0.15)' }}>
          <div className="terminal-bar">
            <div style={{ display: 'flex', gap: '8px' }}>
              <div className="dot red"></div>
              <div className="dot yellow"></div>
              <div className="dot green"></div>
            </div>
            <span className="terminal-title">joxa_server_tty1</span>
          </div>
          <div className="terminal-body" style={{ padding: '40px 30px', minHeight: '350px', fontFamily: 'Share Tech Mono', fontSize: '1.2rem', color: 'var(--text)' }}>
             <div style={{ marginBottom: '25px', opacity: 0.8 }}>
               Debian GNU/Linux 12 joxa-server tty1<br/>
               Type your credentials to authenticate to the mainframe.
             </div>
             
             {status && status.type === 'error' && (
               <div style={{ marginBottom: '15px' }}>{status.msg}</div>
             )}

             {step === 'password' && (
                 <div style={{ marginBottom: '5px' }}>joxa-server login: {loginVal}</div>
             )}

             <div style={{ display: 'flex', alignItems: 'center' }}>
                <span style={{ marginRight: '10px' }}>
                  {step === 'login' ? 'joxa-server login:' : 'Password:'}
                </span>
                <form onSubmit={handleTerminalSubmit} style={{ flex: 1, display: 'flex' }}>
                    <input 
                      ref={inputRef}
                      type="text" 
                      value={step === 'login' ? loginVal : passVal}
                      onChange={e => step === 'login' ? setLoginVal(e.target.value) : setPassVal(e.target.value)}
                      style={{ 
                         background: 'transparent', border: 'none', 
                         color: step === 'password' ? 'transparent' : 'var(--accent)', 
                         fontFamily: 'Share Tech Mono', fontSize: '1.2rem', outline: 'none', width: '100%',
                         textShadow: step === 'password' ? 'none' : '0 0 5px var(--accent)'
                      }} 
                      autoComplete="off"
                      spellCheck="false"
                    />
                </form>
             </div>
          </div>
        </div>
      </section>
    );
  }

  // Dashboard UI (Centered Forms)
  return (
    <section style={{ minHeight: '100vh', padding: '120px 20px 60px', display: 'flex', justifyContent: 'center' }}>
      <div className="container" style={{ maxWidth: '800px', width: '100%' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
           <h2 style={{ fontSize: '2rem', margin: 0 }}>Command Center</h2>
           <span style={{ color: 'var(--accent)', fontFamily: 'Share Tech Mono', fontSize: '0.9rem' }}><span className="blink">_</span> WELCOME, ROOT</span>
        </div>

        <div style={{ display: 'flex', gap: '15px', marginBottom: '30px' }}>
          <button onClick={() => {setActiveTab('project'); setStatus(null);}} className={activeTab === 'project' ? 'btn-primary' : 'btn-secondary'} style={{ flex: 1 }}>DEPLOY PROJECT</button>
          <button onClick={() => {setActiveTab('post'); setStatus(null);}} className={activeTab === 'post' ? 'btn-primary' : 'btn-secondary'} style={{ flex: 1 }}>DEPLOY BLOG POST</button>
        </div>

        <div className="about-terminal">
          <div className="terminal-bar">
            <div style={{ display: 'flex', gap: '8px' }}>
              <div className="dot red"></div>
              <div className="dot yellow"></div>
              <div className="dot green"></div>
            </div>
            <span className="terminal-title">insert_{activeTab}.sh</span>
          </div>
          <div className="terminal-body" style={{ padding: '50px 40px' }}>
            
            {status && (
              <div style={{ 
                padding: '15px', marginBottom: '25px', border: '1px solid',
                fontFamily: 'Share Tech Mono', textAlign: 'center',
                background: status.type === 'error' ? 'rgba(255,60,110,0.1)' : status.type === 'success' ? 'rgba(0,255,231,0.1)' : 'transparent',
                borderColor: status.type === 'error' ? 'var(--accent3)' : status.type === 'success' ? 'var(--accent)' : 'var(--border)',
                color: status.type === 'error' ? 'var(--accent3)' : status.type === 'success' ? 'var(--accent)' : 'var(--text)'
              }}>
                {status.msg}
              </div>
            )}

            {activeTab === 'project' ? (
              <form onSubmit={handleProjectSubmit} style={{ maxWidth: '600px', margin: '0 auto' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div className="form-group">
                    <label className="form-label">Project Title</label>
                    <input type="text" className="form-input" required value={projectForm.title} onChange={e => setProjectForm({...projectForm, title: e.target.value})} placeholder="Home Lab Setup" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Tag Category (e.g., NETWORK SECURITY)</label>
                    <input type="text" className="form-input" required value={projectForm.tag} onChange={e => setProjectForm({...projectForm, tag: e.target.value})} placeholder="NETWORK SECURITY" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Tools (comma separated)</label>
                    <input type="text" className="form-input" required value={projectForm.tools} onChange={e => setProjectForm({...projectForm, tools: e.target.value})} placeholder="Linux, Wireshark, Bash" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Description</label>
                    <textarea className="form-input" required rows="4" value={projectForm.description} onChange={e => setProjectForm({...projectForm, description: e.target.value})} placeholder="A short explanation of the project..."></textarea>
                  </div>
                </div>
                <button type="submit" className="btn-primary" style={{ marginTop: '30px', width: '100%', padding: '15px' }}>DEPLOY PAYLOAD</button>
              </form>
            ) : (
              <form onSubmit={handlePostSubmit} style={{ maxWidth: '700px', margin: '0 auto' }}>
                 <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    <div className="form-group">
                      <label className="form-label">Blog Title</label>
                      <input type="text" className="form-input" required value={postForm.title} onChange={e => setPostForm({...postForm, title: e.target.value})} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Category</label>
                      <input type="text" className="form-input" required value={postForm.cat} onChange={e => setPostForm({...postForm, cat: e.target.value})} placeholder="Linux" />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Cover Image URL (Link)</label>
                    <input type="url" className="form-input" value={postForm.image} onChange={e => setPostForm({...postForm, image: e.target.value})} placeholder="https://example.com/cyber-image.jpg" />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Excerpt (Preview String)</label>
                    <textarea className="form-input" required rows="2" value={postForm.excerpt} onChange={e => setPostForm({...postForm, excerpt: e.target.value})}></textarea>
                  </div>

                  <div className="form-group" data-color-mode="dark">
                    <label className="form-label">Full Content (Markdown allowed)</label>
                    <MDEditor 
                      value={postForm.content} 
                      onChange={val => setPostForm({...postForm, content: val || ''})} 
                      preview="edit"
                      height={350}
                      style={{ marginTop: '10px' }}
                    />
                  </div>
                </div>

                <button type="submit" className="btn-primary" style={{ marginTop: '30px', width: '100%', padding: '15px' }}>PUBLISH ENTRY</button>
              </form>
            )}
          </div>
        </div>

      </div>
    </section>
  );
}
