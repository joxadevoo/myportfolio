import React, { useState, useRef, useEffect, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';
import { fetchHomeSettings, normalizeHomeSettings, saveHomeSettings } from '../lib/siteSettings';
import MDEditor from '@uiw/react-md-editor/nohighlight';
import { safeMarkdownUrl } from '../lib/markdownSecurity';

const initialProjectForm = { title: '', tag: '', description: '', tools: '' };
const initialPostForm = { title: '', cat: '', excerpt: '', content: '', image: '' };
const initialSkillForm = { name: '', icon: 'Shield', percent: 70, sort_order: 0 };
const initialCertForm = { title: '', issuer: '', date: '', icon: 'Award', sort_order: 0 };
const initialHomeForm = {
  certificates: '',
  projects: '',
  years: '',
  location: '',
  status: '',
  focus: '',
  languages: '',
  competencies: ''
};

const skillIcons = ['Shield', 'Terminal', 'Code', 'Database', 'Activity', 'ShieldAlert', 'Wifi', 'Lock', 'Globe', 'Server', 'Eye', 'Cpu'];
const certIcons = ['Award', 'Lock', 'Globe', 'ClipboardCheck', 'Shield', 'Star', 'BookOpen', 'CheckCircle'];

export default function AdminPanel() {
  const [auth, setAuth] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(isSupabaseConfigured);
  const [loginVal, setLoginVal] = useState('');
  const [passVal, setPassVal] = useState('');

  const [activeTab, setActiveTab] = useState('project');
  const [projectForm, setProjectForm] = useState(initialProjectForm);
  const [postForm, setPostForm] = useState(initialPostForm);
  const [skillForm, setSkillForm] = useState(initialSkillForm);
  const [certForm, setCertForm] = useState(initialCertForm);
  const [homeForm, setHomeForm] = useState(initialHomeForm);

  const [projectsList, setProjectsList] = useState([]);
  const [postsList, setPostsList] = useState([]);
  const [skillsList, setSkillsList] = useState([]);
  const [certsList, setCertsList] = useState([]);

  const [editingProjectId, setEditingProjectId] = useState(null);
  const [editingPostId, setEditingPostId] = useState(null);
  const [editingSkillId, setEditingSkillId] = useState(null);
  const [editingCertId, setEditingCertId] = useState(null);
  const [editingHome, setEditingHome] = useState(false);
  const [pendingDelete, setPendingDelete] = useState(null);
  const [status, setStatus] = useState(null);
  const inputRef = useRef(null);

  const clearStatus = () => {
    setTimeout(() => setStatus(null), 5000);
  };

  const verifyAdminSession = useCallback(async (session) => {
    if (!session) {
      setAuth(false);
      setCheckingAuth(false);
      return false;
    }

    const { data, error } = await supabase
      .from('admin_users')
      .select('user_id')
      .eq('user_id', session.user.id)
      .maybeSingle();

    if (error) {
      setAuth(false);
      setCheckingAuth(false);
      setStatus({ type: 'error', msg: `Admin access check failed: ${error.message}` });
      await supabase.auth.signOut();
      return false;
    }

    if (!data) {
      setAuth(false);
      setCheckingAuth(false);
      setStatus({ type: 'error', msg: 'This account is not allowed to use the admin panel.' });
      await supabase.auth.signOut();
      return false;
    }

    setAuth(true);
    setCheckingAuth(false);
    return true;
  }, []);

  const fetchProjects = useCallback(async () => {
    const { data, error } = await supabase.from('projects').select('*').order('id', { ascending: true });
    if (error) {
      setStatus({ type: 'error', msg: `ERROR: ${error.message}` });
      return;
    }
    setProjectsList(data || []);
  }, []);

  const fetchPosts = useCallback(async () => {
    const { data, error } = await supabase.from('blog_posts').select('*').order('created_at', { ascending: false });
    if (error) {
      setStatus({ type: 'error', msg: `ERROR: ${error.message}` });
      return;
    }
    setPostsList(data || []);
  }, []);

  const fetchSkills = useCallback(async () => {
    const { data, error } = await supabase.from('skills').select('*').order('sort_order', { ascending: true });
    if (error) {
      setStatus({ type: 'error', msg: `ERROR: ${error.message}` });
      return;
    }
    setSkillsList(data || []);
  }, []);

  const fetchCerts = useCallback(async () => {
    const { data, error } = await supabase.from('certifications').select('*').order('sort_order', { ascending: true });
    if (error) {
      setStatus({ type: 'error', msg: `ERROR: ${error.message}` });
      return;
    }
    setCertsList(data || []);
  }, []);

  const fetchHome = useCallback(async () => {
    try {
      const settings = await fetchHomeSettings();
      setHomeForm({
        certificates: settings.stats.certificates,
        projects: settings.stats.projects,
        years: settings.stats.years,
        location: settings.about.location,
        status: settings.about.status,
        focus: settings.about.focus,
        languages: settings.about.languages,
        competencies: settings.about.competencies.join('\n')
      });
      setEditingHome(true);
    } catch (error) {
      setStatus({ type: 'error', msg: `ERROR: ${error.message}` });
    }
  }, []);

  const loadTabData = useCallback((tab) => {
    if (tab === 'home') fetchHome();
    if (tab === 'project') fetchProjects();
    if (tab === 'post') fetchPosts();
    if (tab === 'skill') fetchSkills();
    if (tab === 'cert') fetchCerts();
  }, [fetchHome, fetchProjects, fetchPosts, fetchSkills, fetchCerts]);

  useEffect(() => {
    if (!auth && inputRef.current) {
      inputRef.current.focus();
    }
  }, [auth]);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      return undefined;
    }

    let mounted = true;

    supabase.auth.getSession().then(({ data }) => {
      if (mounted) verifyAdminSession(data.session);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (mounted) verifyAdminSession(session);
    });

    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, [verifyAdminSession]);

  useEffect(() => {
    if (!auth) return undefined;

    const timer = window.setTimeout(() => loadTabData(activeTab), 0);
    return () => window.clearTimeout(timer);
  }, [auth, activeTab, loadTabData]);

  const handleTerminalSubmit = async (e) => {
    e.preventDefault();
    const email = loginVal.trim();

    if (!email || !passVal) {
      setStatus({ type: 'error', msg: 'Email va parolni kiriting' });
      return;
    }

    if (!isSupabaseConfigured) {
      setStatus({ type: 'error', msg: 'Supabase is not configured' });
      return;
    }

    setStatus({ type: 'loading', msg: 'Authenticating...' });
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password: passVal
    });

    if (error) {
      setStatus({ type: 'error', msg: 'Login incorrect' });
      setPassVal('');
      return;
    }

    const allowed = await verifyAdminSession(data.session);
    if (!allowed) {
      setPassVal('');
      return;
    }

    setPassVal('');
    setStatus(null);
    loadTabData(activeTab);
  };

  const switchTab = (tab) => {
    setActiveTab(tab);
    setPendingDelete(null);
    setStatus(null);
  };

  const resetProjectForm = () => {
    setProjectForm(initialProjectForm);
    setEditingProjectId(null);
  };

  const resetPostForm = () => {
    setPostForm(initialPostForm);
    setEditingPostId(null);
  };

  const resetSkillForm = () => {
    setSkillForm(initialSkillForm);
    setEditingSkillId(null);
  };

  const resetCertForm = () => {
    setCertForm(initialCertForm);
    setEditingCertId(null);
  };

  const handleHomeSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: 'loading', msg: 'Saving home info...' });

    try {
      const payload = normalizeHomeSettings({
        stats: {
          certificates: homeForm.certificates.trim(),
          projects: homeForm.projects.trim(),
          years: homeForm.years.trim()
        },
        about: {
          location: homeForm.location.trim(),
          status: homeForm.status.trim(),
          focus: homeForm.focus.trim(),
          languages: homeForm.languages.trim(),
          competencies: homeForm.competencies
            .split('\n')
            .map(item => item.trim())
            .filter(Boolean)
        }
      });

      await saveHomeSettings(payload);
      setEditingHome(true);
      setStatus({ type: 'success', msg: 'HOME INFO SAVED!' });
      clearStatus();
    } catch (error) {
      setStatus({ type: 'error', msg: `ERROR: ${error.message}` });
    }
  };

  const handleProjectSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: 'loading', msg: editingProjectId ? 'Updating project...' : 'Adding project...' });

    const toolsArray = projectForm.tools.split(',').map(tool => tool.trim()).filter(Boolean);
    const payload = {
      title: projectForm.title,
      tag: projectForm.tag,
      description: projectForm.description,
      tools: toolsArray
    };

    const { error } = editingProjectId
      ? await supabase.from('projects').update(payload).eq('id', editingProjectId)
      : await supabase.from('projects').insert([payload]);

    if (error) {
      setStatus({ type: 'error', msg: `ERROR: ${error.message}` });
      return;
    }

    setStatus({ type: 'success', msg: editingProjectId ? 'PROJECT UPDATED!' : 'PROJECT ADDED!' });
    resetProjectForm();
    fetchProjects();
    clearStatus();
  };

  const handlePostSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: 'loading', msg: editingPostId ? 'Updating blog post...' : 'Publishing blog post...' });

    const plainContent = postForm.content.replace(/<[^>]*>?/gm, '').trim();
    const wordCount = plainContent ? plainContent.split(/\s+/).length : 0;
    const autoReadTime = `${Math.max(1, Math.ceil(wordCount / 200))} min read`;
    const payload = {
      title: postForm.title,
      cat: postForm.cat,
      icon: postForm.image.trim(),
      excerpt: postForm.excerpt,
      content: postForm.content,
      readTime: autoReadTime
    };

    const { error } = editingPostId
      ? await supabase.from('blog_posts').update(payload).eq('id', editingPostId)
      : await supabase.from('blog_posts').insert([{
          ...payload,
          date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
        }]);

    if (error) {
      setStatus({ type: 'error', msg: `ERROR: ${error.message}` });
      return;
    }

    setStatus({ type: 'success', msg: editingPostId ? 'BLOG POST UPDATED!' : 'BLOG POST ADDED!' });
    resetPostForm();
    fetchPosts();
    clearStatus();
  };

  const handleSkillSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: 'loading', msg: editingSkillId ? 'Updating skill...' : 'Adding skill...' });

    const payload = {
      ...skillForm,
      percent: Number(skillForm.percent),
      sort_order: Number(skillForm.sort_order)
    };

    const { error } = editingSkillId
      ? await supabase.from('skills').update(payload).eq('id', editingSkillId)
      : await supabase.from('skills').insert([payload]);

    if (error) {
      setStatus({ type: 'error', msg: `ERROR: ${error.message}` });
      return;
    }

    setStatus({ type: 'success', msg: editingSkillId ? 'SKILL UPDATED!' : 'SKILL ADDED!' });
    resetSkillForm();
    fetchSkills();
    clearStatus();
  };

  const handleCertSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: 'loading', msg: editingCertId ? 'Updating certification...' : 'Adding certification...' });

    const payload = {
      ...certForm,
      sort_order: Number(certForm.sort_order)
    };

    const { error } = editingCertId
      ? await supabase.from('certifications').update(payload).eq('id', editingCertId)
      : await supabase.from('certifications').insert([payload]);

    if (error) {
      setStatus({ type: 'error', msg: `ERROR: ${error.message}` });
      return;
    }

    setStatus({ type: 'success', msg: editingCertId ? 'CERTIFICATION UPDATED!' : 'CERTIFICATION ADDED!' });
    resetCertForm();
    fetchCerts();
    clearStatus();
  };

  const requestDelete = (table, id, refresh, label) => {
    setPendingDelete({ table, id, refresh, label });
    setStatus(null);
  };

  const cancelDelete = () => {
    setPendingDelete(null);
  };

  const confirmDelete = async () => {
    if (!pendingDelete) return;
    const { table, id, refresh, label } = pendingDelete;
    setStatus({ type: 'loading', msg: `Deleting ${label}...` });

    const { data, error } = await supabase
      .from(table)
      .delete()
      .eq('id', id)
      .select('id');

    if (error) {
      setStatus({ type: 'error', msg: `ERROR: ${error.message}` });
      return;
    }

    if (!data || data.length === 0) {
      setStatus({ type: 'error', msg: `ERROR: ${label} not deleted. Check Supabase DELETE policy for ${table}.` });
      return;
    }

    setPendingDelete(null);
    setStatus({ type: 'success', msg: `${label.toUpperCase()} DELETED!` });
    refresh();
    clearStatus();
  };

  const startEditProject = (project) => {
    setEditingProjectId(project.id);
    setProjectForm({
      title: project.title || '',
      tag: project.tag || '',
      description: project.description || '',
      tools: Array.isArray(project.tools) ? project.tools.join(', ') : project.tools || ''
    });
  };

  const startEditPost = (post) => {
    setEditingPostId(post.id);
    setPostForm({
      title: post.title || '',
      cat: post.cat || '',
      excerpt: post.excerpt || '',
      content: post.content || '',
      image: post.icon || ''
    });
  };

  const startEditSkill = (skill) => {
    setEditingSkillId(skill.id);
    setSkillForm({
      name: skill.name || '',
      icon: skill.icon || 'Shield',
      percent: skill.percent ?? 70,
      sort_order: skill.sort_order ?? 0
    });
  };

  const startEditCert = (cert) => {
    setEditingCertId(cert.id);
    setCertForm({
      title: cert.title || '',
      issuer: cert.issuer || '',
      date: cert.date || '',
      icon: cert.icon || 'Award',
      sort_order: cert.sort_order ?? 0
    });
  };

  const renderActions = (onEdit, onDelete) => (
    <div className="admin-row-actions">
      <button
        type="button"
        onClick={onEdit}
        className="admin-mini-button"
      >
        EDIT
      </button>
      <button
        type="button"
        onClick={onDelete}
        className="admin-mini-button danger"
      >
        DELETE
      </button>
    </div>
  );

  const renderDeleteConfirm = () => (
    <div className="admin-row-actions">
      <button
        type="button"
        onClick={confirmDelete}
        className="admin-mini-button danger"
      >
        CONFIRM
      </button>
      <button
        type="button"
        onClick={cancelDelete}
        className="admin-mini-button"
      >
        CANCEL
      </button>
    </div>
  );

  if (checkingAuth) {
    return (
      <section style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '120px 20px 60px' }}>
        <div style={{ color: 'var(--text-muted)' }}>Checking admin access...</div>
      </section>
    );
  }

  if (!auth) {
    return (
      <section style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '120px 20px 60px' }}>
        <div className="about-terminal" style={{ maxWidth: '480px', width: '100%', boxShadow: '0 24px 80px rgba(0, 0, 0, 0.35)' }}>
          <form onSubmit={handleTerminalSubmit} style={{ padding: '42px 36px' }}>
            <div style={{ marginBottom: '30px' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '12px' }}>
                Admin Panel
              </div>
              <h1 style={{ fontSize: '2rem', marginBottom: '10px' }}>Kirish</h1>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.6 }}>
                Ma'lumotlarni boshqarish uchun admin email va parolingizni kiriting.
              </p>
            </div>

            {status && (
              <div style={{
                padding: '12px 14px',
                marginBottom: '22px',
                border: '1px solid',
                borderColor: status.type === 'error' ? 'rgba(255,60,110,0.55)' : 'var(--border)',
                color: status.type === 'error' ? '#ff6b93' : 'var(--text-main)',
                background: status.type === 'error' ? 'rgba(255,60,110,0.08)' : 'var(--card-bg)',
                fontSize: '0.9rem'
              }}>
                {status.msg}
              </div>
            )}

            <div className="form-group">
              <label className="form-label" htmlFor="admin-email">Email</label>
              <input
                id="admin-email"
                ref={inputRef}
                type="email"
                className="form-input"
                value={loginVal}
                onChange={e => setLoginVal(e.target.value)}
                placeholder="admin@example.com"
                autoComplete="username"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="admin-password">Parol</label>
              <input
                id="admin-password"
                type="password"
                className="form-input"
                value={passVal}
                onChange={e => setPassVal(e.target.value)}
                placeholder="Parolingiz"
                autoComplete="current-password"
                required
              />
            </div>

            <button type="submit" className="btn-primary" style={{ width: '100%', padding: '15px', marginTop: '8px' }}>
              {status?.type === 'loading' ? 'Kirilmoqda...' : 'Kirish'}
            </button>
          </form>
        </div>
      </section>
    );
  }

  return (
    <section className="admin-shell">
      <div className="admin-container">
        <div className="admin-header">
          <div>
            <div className="admin-eyebrow">Content Manager</div>
            <h2>Command Center</h2>
          </div>
          <span className="admin-user"><span className="blink">_</span> WELCOME, ROOT</span>
        </div>

        <div className="admin-tabs">
          <button type="button" onClick={() => switchTab('home')} className={`admin-tab ${activeTab === 'home' ? 'active' : ''}`}>HOME INFO</button>
          <button type="button" onClick={() => switchTab('project')} className={`admin-tab ${activeTab === 'project' ? 'active' : ''}`}>PROJECTS</button>
          <button type="button" onClick={() => switchTab('post')} className={`admin-tab ${activeTab === 'post' ? 'active' : ''}`}>BLOG POSTS</button>
          <button type="button" onClick={() => switchTab('skill')} className={`admin-tab ${activeTab === 'skill' ? 'active' : ''}`}>SKILLS</button>
          <button type="button" onClick={() => switchTab('cert')} className={`admin-tab ${activeTab === 'cert' ? 'active' : ''}`}>CERTS</button>
        </div>

        <div className="admin-panel">
          <div className="admin-panel-head">
            <span>{editingHome || editingProjectId || editingPostId || editingSkillId || editingCertId ? 'edit' : 'manage'}_{activeTab}.sh</span>
          </div>

          <div className="admin-panel-body">
            {status && (
              <div style={{
                padding: '15px',
                marginBottom: '25px',
                border: '1px solid',
                fontFamily: 'Share Tech Mono',
                textAlign: 'center',
                background: status.type === 'error' ? 'rgba(255,60,110,0.1)' : status.type === 'success' ? 'rgba(0,255,231,0.1)' : 'transparent',
                borderColor: status.type === 'error' ? 'var(--accent3)' : status.type === 'success' ? 'var(--accent)' : 'var(--border)',
                color: status.type === 'error' ? 'var(--accent3)' : status.type === 'success' ? 'var(--accent)' : 'var(--text)'
              }}>
                {status.msg}
              </div>
            )}

            {activeTab === 'home' && (
              <div className="admin-management-grid single">
                <form className="admin-editor-card" onSubmit={handleHomeSubmit}>
                  <div className="admin-form-section-title">Hero stats</div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '18px' }}>
                    <div className="form-group">
                      <label className="form-label">Certificates</label>
                      <input type="text" className="form-input" value={homeForm.certificates} onChange={e => setHomeForm({ ...homeForm, certificates: e.target.value })} placeholder="6+" />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Projects</label>
                      <input type="text" className="form-input" value={homeForm.projects} onChange={e => setHomeForm({ ...homeForm, projects: e.target.value })} placeholder="10+" />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Years Learning</label>
                      <input type="text" className="form-input" value={homeForm.years} onChange={e => setHomeForm({ ...homeForm, years: e.target.value })} placeholder="3+" />
                    </div>
                  </div>

                  <div className="admin-form-section-title">About info</div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '18px' }}>
                    <div className="form-group">
                      <label className="form-label">Location</label>
                      <input type="text" className="form-input" value={homeForm.location} onChange={e => setHomeForm({ ...homeForm, location: e.target.value })} placeholder="Uzbekistan" />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Status</label>
                      <input type="text" className="form-input" value={homeForm.status} onChange={e => setHomeForm({ ...homeForm, status: e.target.value })} placeholder="Open to Work" />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Focus</label>
                      <input type="text" className="form-input" value={homeForm.focus} onChange={e => setHomeForm({ ...homeForm, focus: e.target.value })} placeholder="Cybersecurity" />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Languages</label>
                      <input type="text" className="form-input" value={homeForm.languages} onChange={e => setHomeForm({ ...homeForm, languages: e.target.value })} placeholder="UZ / EN / TR" />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Core Competencies (one per line)</label>
                    <textarea className="form-input" rows="8" value={homeForm.competencies} onChange={e => setHomeForm({ ...homeForm, competencies: e.target.value })} placeholder="Network Security & Monitoring&#10;Linux System Administration" />
                  </div>

                  <button type="submit" className="admin-submit">SAVE HOME INFO</button>
                  <button type="button" onClick={fetchHome} className="admin-cancel">RELOAD FROM SUPABASE</button>
                </form>
              </div>
            )}

            {activeTab === 'project' && (
              <div className="admin-management-grid">
                <form className="admin-editor-card" onSubmit={handleProjectSubmit}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div className="form-group">
                      <label className="form-label">Project Title</label>
                      <input type="text" className="form-input" required value={projectForm.title} onChange={e => setProjectForm({ ...projectForm, title: e.target.value })} placeholder="Home Lab Setup" />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Tag Category</label>
                      <input type="text" className="form-input" required value={projectForm.tag} onChange={e => setProjectForm({ ...projectForm, tag: e.target.value })} placeholder="NETWORK SECURITY" />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Tools (comma separated)</label>
                      <input type="text" className="form-input" required value={projectForm.tools} onChange={e => setProjectForm({ ...projectForm, tools: e.target.value })} placeholder="Linux, Wireshark, Bash" />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Description</label>
                      <textarea className="form-input" required rows="4" value={projectForm.description} onChange={e => setProjectForm({ ...projectForm, description: e.target.value })} placeholder="A short explanation of the project..."></textarea>
                    </div>
                  </div>
                  <button type="submit" className="admin-submit">
                    {editingProjectId ? 'SAVE PROJECT' : '+ ADD PROJECT'}
                  </button>
                  {editingProjectId && (
                    <button type="button" onClick={resetProjectForm} className="admin-cancel">CANCEL EDIT</button>
                  )}
                </form>

                <div className="admin-list-card">
                  <ListHeader title="EXISTING PROJECTS" onRefresh={fetchProjects} />
                  {projectsList.map(project => (
                    <div key={project.id} className="admin-list-row">
                      <div>
                        <div style={{ color: 'var(--text)', fontFamily: 'Share Tech Mono', fontSize: '0.9rem' }}>{project.title}</div>
                        <div style={{ color: 'var(--text-dim)', fontSize: '0.75rem' }}>{project.tag}</div>
                      </div>
                      {pendingDelete?.table === 'projects' && pendingDelete?.id === project.id
                        ? renderDeleteConfirm()
                        : renderActions(
                            () => startEditProject(project),
                            () => requestDelete('projects', project.id, fetchProjects, 'project')
                          )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'post' && (
              <div className="admin-management-grid">
                <form className="admin-editor-card" onSubmit={handlePostSubmit}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
                      <div className="form-group">
                        <label className="form-label">Blog Title</label>
                        <input type="text" className="form-input" required value={postForm.title} onChange={e => setPostForm({ ...postForm, title: e.target.value })} />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Category</label>
                        <input type="text" className="form-input" required value={postForm.cat} onChange={e => setPostForm({ ...postForm, cat: e.target.value })} placeholder="Linux" />
                      </div>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Cover Image URL</label>
                      <input type="url" className="form-input" value={postForm.image} onChange={e => setPostForm({ ...postForm, image: e.target.value })} placeholder="https://example.com/cyber-image.jpg" />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Excerpt</label>
                      <textarea className="form-input" required rows="2" value={postForm.excerpt} onChange={e => setPostForm({ ...postForm, excerpt: e.target.value })}></textarea>
                    </div>
                    <div className="form-group" data-color-mode="dark">
                      <label className="form-label">Full Content (Markdown allowed)</label>
                      <MDEditor
                        value={postForm.content}
                        onChange={val => setPostForm({ ...postForm, content: val || '' })}
                        preview="edit"
                        previewOptions={{
                          skipHtml: true,
                          urlTransform: safeMarkdownUrl
                        }}
                        height={350}
                        style={{ marginTop: '10px' }}
                      />
                    </div>
                  </div>
                  <button type="submit" className="admin-submit">
                    {editingPostId ? 'SAVE BLOG POST' : '+ ADD BLOG POST'}
                  </button>
                  {editingPostId && (
                    <button type="button" onClick={resetPostForm} className="admin-cancel">CANCEL EDIT</button>
                  )}
                </form>

                <div className="admin-list-card">
                  <ListHeader title="EXISTING BLOG POSTS" onRefresh={fetchPosts} />
                  {postsList.map(post => (
                    <div key={post.id} className="admin-list-row">
                      <div>
                        <div style={{ color: 'var(--text)', fontFamily: 'Share Tech Mono', fontSize: '0.9rem' }}>{post.title}</div>
                        <div style={{ color: 'var(--text-dim)', fontSize: '0.75rem' }}>{post.cat} - {post.date || 'No date'}</div>
                      </div>
                      {pendingDelete?.table === 'blog_posts' && pendingDelete?.id === post.id
                        ? renderDeleteConfirm()
                        : renderActions(
                            () => startEditPost(post),
                            () => requestDelete('blog_posts', post.id, fetchPosts, 'blog post')
                          )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'skill' && (
              <div className="admin-management-grid">
                <form className="admin-editor-card" onSubmit={handleSkillSubmit}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '15px' }}>
                      <div className="form-group">
                        <label className="form-label">Skill Name</label>
                        <input type="text" className="form-input" required value={skillForm.name} onChange={e => setSkillForm({ ...skillForm, name: e.target.value })} placeholder="Network Security" />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Percent %</label>
                        <input type="number" min="0" max="100" className="form-input" required value={skillForm.percent} onChange={e => setSkillForm({ ...skillForm, percent: e.target.value })} />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Order</label>
                        <input type="number" className="form-input" value={skillForm.sort_order} onChange={e => setSkillForm({ ...skillForm, sort_order: e.target.value })} />
                      </div>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Icon Name</label>
                      <select className="form-input" value={skillForm.icon} onChange={e => setSkillForm({ ...skillForm, icon: e.target.value })}>
                        {skillIcons.map(icon => <option key={icon} value={icon}>{icon}</option>)}
                      </select>
                    </div>
                  </div>
                  <button type="submit" className="admin-submit">
                    {editingSkillId ? 'SAVE SKILL' : '+ ADD SKILL'}
                  </button>
                  {editingSkillId && (
                    <button type="button" onClick={resetSkillForm} className="admin-cancel">CANCEL EDIT</button>
                  )}
                </form>

                <div className="admin-list-card">
                  <ListHeader title="EXISTING SKILLS" onRefresh={fetchSkills} />
                  {skillsList.map(skill => (
                    <div key={skill.id} className="admin-list-row">
                      <span style={{ color: 'var(--text)', fontFamily: 'Share Tech Mono' }}>{skill.name} <span style={{ color: 'var(--accent)' }}>{skill.percent}%</span></span>
                      {pendingDelete?.table === 'skills' && pendingDelete?.id === skill.id
                        ? renderDeleteConfirm()
                        : renderActions(
                            () => startEditSkill(skill),
                            () => requestDelete('skills', skill.id, fetchSkills, 'skill')
                          )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'cert' && (
              <div className="admin-management-grid">
                <form className="admin-editor-card" onSubmit={handleCertSubmit}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <div className="form-group">
                      <label className="form-label">Certificate Title</label>
                      <input type="text" className="form-input" required value={certForm.title} onChange={e => setCertForm({ ...certForm, title: e.target.value })} placeholder="Google Cybersecurity Certificate" />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '15px' }}>
                      <div className="form-group">
                        <label className="form-label">Issuer</label>
                        <input type="text" className="form-input" required value={certForm.issuer} onChange={e => setCertForm({ ...certForm, issuer: e.target.value })} placeholder="Google / Coursera" />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Date</label>
                        <input type="text" className="form-input" required value={certForm.date} onChange={e => setCertForm({ ...certForm, date: e.target.value })} placeholder="In Progress - 2024" />
                      </div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '15px' }}>
                      <div className="form-group">
                        <label className="form-label">Icon Name</label>
                        <select className="form-input" value={certForm.icon} onChange={e => setCertForm({ ...certForm, icon: e.target.value })}>
                          {certIcons.map(icon => <option key={icon} value={icon}>{icon}</option>)}
                        </select>
                      </div>
                      <div className="form-group">
                        <label className="form-label">Order</label>
                        <input type="number" className="form-input" value={certForm.sort_order} onChange={e => setCertForm({ ...certForm, sort_order: e.target.value })} />
                      </div>
                    </div>
                  </div>
                  <button type="submit" className="admin-submit">
                    {editingCertId ? 'SAVE CERTIFICATION' : '+ ADD CERTIFICATION'}
                  </button>
                  {editingCertId && (
                    <button type="button" onClick={resetCertForm} className="admin-cancel">CANCEL EDIT</button>
                  )}
                </form>

                <div className="admin-list-card">
                  <ListHeader title="EXISTING CERTIFICATIONS" onRefresh={fetchCerts} />
                  {certsList.map(cert => (
                    <div key={cert.id} className="admin-list-row">
                      <div>
                        <div style={{ color: 'var(--text)', fontFamily: 'Share Tech Mono', fontSize: '0.85rem' }}>{cert.title}</div>
                        <div style={{ color: 'var(--text-dim)', fontSize: '0.75rem' }}>{cert.issuer} - {cert.date}</div>
                      </div>
                      {pendingDelete?.table === 'certifications' && pendingDelete?.id === cert.id
                        ? renderDeleteConfirm()
                        : renderActions(
                            () => startEditCert(cert),
                            () => requestDelete('certifications', cert.id, fetchCerts, 'certification')
                          )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function ListHeader({ title, onRefresh }) {
  return (
    <div className="admin-list-header">
      <div className="admin-list-title">{title}</div>
      <button
        type="button"
        onClick={onRefresh}
        className="admin-mini-button"
      >
        REFRESH
      </button>
    </div>
  );
}
