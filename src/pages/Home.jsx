import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Hero from '../components/Hero';
import About from '../components/About';
import Skills from '../components/Skills';
import Certs from '../components/Certs';
import ProjectGrid from '../components/ProjectGrid';
import BlogSection from '../components/BlogSection';
import ContactForm from '../components/ContactForm';

export default function Home() {
  const { hash } = useLocation();

  useEffect(() => {
    // handle programmatic scroll animations
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('fade-in');
          entry.target.style.opacity = 1;
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    document.querySelectorAll('.animate-on-scroll, .fade-in').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (hash) {
      setTimeout(() => {
        document.getElementById(hash.substring(1))?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }, [hash]);

  return (
    <>
      <main>
        <Hero />
        <About />
        <Skills />
        <Certs />
        <ProjectGrid />
        <BlogSection />
        <ContactForm />
      </main>
    </>
  );
}
