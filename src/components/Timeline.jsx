import React from 'react';

export default function Timeline() {
  const experiences = [
    {
      year: "2023 - Present",
      title: "Senior Frontend Engineer",
      company: "Tech Innovations Inc.",
      description: "Leading the transition to a modern React architecture, improving performance by 40%."
    },
    {
      year: "2021 - 2023",
      title: "Cybersecurity Learner",
      company: "Self Study",
      description: "Practiced Linux, networking, web security, and defensive monitoring fundamentals."
    },
    {
      year: "2018 - 2021",
      title: "B.Sci. Computer Science",
      company: "University of Technology",
      description: "Graduated with honors, specialized in human-computer interaction and web technologies."
    }
  ];

  return (
    <section id="about" style={{ backgroundColor: 'rgba(15, 23, 42, 0.3)' }}>
      <div className="container">
        <h2>Experience & Education</h2>
        
        <div style={{ maxWidth: '800px', margin: '0 auto', position: 'relative', paddingLeft: '2rem' }}>
          {/* Vertical Line */}
          <div style={{
            position: 'absolute',
            left: 0,
            top: 0,
            bottom: 0,
            width: '2px',
            background: 'var(--surface-border)'
          }}></div>

          {experiences.map((exp, idx) => (
            <div key={idx} style={{ position: 'relative', marginBottom: '3rem' }}>
              {/* Timeline Dot */}
              <div style={{
                position: 'absolute',
                left: '-2rem',
                top: '0.5rem',
                width: '1rem',
                height: '1rem',
                borderRadius: '50%',
                background: 'var(--accent-color)',
                transform: 'translateX(-50%)',
                boxShadow: '0 0 10px var(--primary-glow)'
              }}></div>
              
              <div className="glass-card">
                <span style={{ color: 'var(--accent-color)', fontWeight: 600, fontSize: '0.9rem' }}>{exp.year}</span>
                <h3 style={{ margin: '0.5rem 0 0.2rem' }}>{exp.title}</h3>
                <h4 style={{ color: 'var(--text-secondary)', fontWeight: 400, fontSize: '1rem', marginBottom: '1rem' }}>{exp.company}</h4>
                <p style={{ margin: 0, fontSize: '0.95rem' }}>{exp.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
