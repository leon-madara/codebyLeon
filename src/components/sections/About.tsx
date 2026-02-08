export function About() {
  return (
    <section id="about" className="content-section">
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
        <h2 className="section-headline">Helping Kenyan Businesses Look Professional Online</h2>
        <p className="section-subheadline">
          I design websites and visuals that help Kenyan businesses look professional, get more inquiries,
          and build trust online.
        </p>

        <div className="about-content">
          <div className="about-card">
            <h3>Mission</h3>
            <p>
              Code by Leon helps small businesses and creators build modern websites and consistent visuals
              so they can look professional online, attract better clients, and stop losing opportunities
              because of weak design.
            </p>
          </div>
          <div className="about-card">
            <h3>Technology Stack</h3>
            <p>
              Modern, fast, mobile-first approaches with SEO and performance optimization. We use the latest
              web technologies to ensure your site loads quickly and ranks well.
            </p>
          </div>
          <div className="about-card">
            <h3>Working Process</h3>
            <ol className="process-list">
              <li>Discovery call to understand your needs</li>
              <li>Proposal & agreement</li>
              <li>Design & development</li>
              <li>Revisions & refinement</li>
              <li>Launch & support</li>
            </ol>
          </div>
        </div>

        <div className="section-cta">
          <p style={{ textAlign: 'center', marginBottom: '1rem', color: 'var(--text-secondary)' }}>
            Let's discuss how we can help your business
          </p>
          <a href="/get-started.html" className="btn-primary">Book a free 20-minute call</a>
        </div>
      </div>
    </section>
  );
}
