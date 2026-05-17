import { supabase, isSupabaseConfigured } from './supabaseClient';

const VISITOR_KEY = 'joxa_visitor_id';
let lastTrackedKey = '';

function createVisitorId() {
  if (window.crypto?.randomUUID) return window.crypto.randomUUID();
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function getVisitorId() {
  const saved = localStorage.getItem(VISITOR_KEY);
  if (saved) return saved;

  const next = createVisitorId();
  localStorage.setItem(VISITOR_KEY, next);
  return next;
}

function getPageType(path) {
  if (path.startsWith('/blog/')) return 'blog_post';
  if (path === '/') return 'home';
  return 'page';
}

function getContentId(path) {
  if (!path.startsWith('/blog/')) return null;
  return path.split('/').filter(Boolean)[1] || null;
}

export async function trackPageView(path) {
  if (!isSupabaseConfigured || typeof window === 'undefined') return;

  const safePath = path || window.location.pathname || '/';
  if (safePath.startsWith('/dora705221')) return;
  if (['localhost', '127.0.0.1'].includes(window.location.hostname)) return;

  const trackingKey = `${safePath}:${Date.now().toString().slice(0, -3)}`;
  if (trackingKey === lastTrackedKey) return;
  lastTrackedKey = trackingKey;

  try {
    await supabase.from('page_views').insert([{
      path: safePath.slice(0, 240),
      page_type: getPageType(safePath),
      content_id: getContentId(safePath),
      visitor_id: getVisitorId(),
      referrer: document.referrer ? document.referrer.slice(0, 500) : null,
      user_agent: navigator.userAgent ? navigator.userAgent.slice(0, 500) : null
    }]);
  } catch (error) {
    console.error('Analytics tracking failed:', error);
  }
}
