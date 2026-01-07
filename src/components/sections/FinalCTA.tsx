export function FinalCTA() {
  return (
    <section id="final-cta" className="content-section">
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
        <h2 className="section-headline">Ready to Transform Your Online Presence?</h2>
        <p className="section-subheadline">
          Let's discuss how we can help your business look professional and attract better clients.
        </p>
        <div className="section-cta">
          <a href="/get-started.html" className="btn-primary">Book a free 20-minute call</a>
          <a href="#portfolio" className="btn-secondary">View Our Work</a>
        </div>
      </div>
    </section>
  );
}
