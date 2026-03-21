import React, { useEffect } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import BlogPost from './pages/BlogPost';
import AdminPanel from './pages/AdminPanel';
import NotFound from './pages/NotFound';

function App() {
  const { pathname } = useLocation();

  return (
    <>
      <nav>
        <Link to="/" className="nav-logo" style={{ cursor: 'pointer' }} onClick={() => window.scrollTo(0,0)}>
          PORT<span>_</span>FOLIO
        </Link>
        {pathname === '/' ? (
          <ul>
            <li><a href="#about">About</a></li>
            <li><a href="#skills">Skills</a></li>
            <li><a href="#certs">Certs</a></li>
            <li><a href="#projects">Projects</a></li>
            <li><a href="#blog">Blog</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
        ) : (
          <ul>
            <li><Link to="/">Back to Home</Link></li>
          </ul>
        )}
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/blog/:id" element={<BlogPost />} />
        <Route path="/dora705221" element={<AdminPanel />} />
        <Route path="*" element={<NotFound />} />
      </Routes>

      <footer>
        <div className="footer-text">© {new Date().getFullYear()} <span>Your Name</span> — All rights reserved</div>
        <div className="footer-text">Built with <span>♥</span> & Supabase</div>
      </footer>
    </>
  );
}

export default App;
