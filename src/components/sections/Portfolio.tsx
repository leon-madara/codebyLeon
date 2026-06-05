import { useRef } from 'react';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';

export function Portfolio() {
  const sectionRef = useRef<HTMLElement>(null);

  // Scroll animation
  useScrollAnimation(sectionRef, {
    trigger: sectionRef.current || '',
    start: 'top 80%',
    animateHeadline: true,
    animateSubheadline: true,
    animateFilters: false,
    animateItems: true,
  });

  const portfolioItems = [
    { id: 1, category: 'small-business', name: 'Client Name', type: 'Small Service Business' },
    { id: 2, category: 'creative', name: 'Client Name', type: 'Creative Professional' },
    { id: 3, category: 'small-business', name: 'Client Name', type: 'Small Service Business' },
  ];

  return (
    <section id="portfolio" className="content-section" ref={sectionRef}>
      {/* LAYER 2: Abstract Orbs */}
      <div className="orbs-container">
        <div className="orb orb-purple"></div>
        <div className="orb orb-orange"></div>
        <div className="orb orb-blue"></div>
      </div>

      {/* LAYER 3: Frosted Overlay */}
      <div className="frosted-overlay"></div>

      {/* LAYER 4: Content */}
      <div className="section-content">
        <h2 className="section-headline">Our Work</h2>
        <p className="section-subheadline">
          See how we've helped Kenyan businesses look professional and attract better clients.
        </p>

        <div className="portfolio-grid">
          {portfolioItems.map(item => (
            <div key={item.id} className="portfolio-item">
              <div className="portfolio-image-placeholder">
                <p>Project Image</p>
              </div>
              <h3>{item.name}</h3>
              <p className="portfolio-type">{item.type}</p>
              <p className="portfolio-results">Results summary will appear here</p>
            </div>
          ))}
        </div>

        <div className="section-cta">
          <a href="/get-started.html" className="btn-primary">Ready to Start Your Project?</a>
        </div>
      </div>
    </section>
  );
}
