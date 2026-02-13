export function FinalCTA() {
  return (
    <section id="final-cta" className="final-cta">
      {/* LAYER 2: Abstract Orbs */}
      <div className="final-cta__orbs">
        <div className="final-cta__orb final-cta__orb--purple"></div>
        <div className="final-cta__orb final-cta__orb--orange"></div>
        <div className="final-cta__orb final-cta__orb--blue"></div>
      </div>

      {/* LAYER 3: Frosted Overlay */}
      <div className="final-cta__overlay"></div>

      {/* LAYER 4: Content */}
      <div className="final-cta__content">
        <h2 className="final-cta__headline">Ready to Transform Your Online Presence?</h2>
        <p className="final-cta__subheadline">
          Let's discuss how we can help your business look professional and attract better clients.
        </p>
        <div className="final-cta__cta">
          <a href="/get-started.html" className="btn-primary">Book a free 20-minute call</a>
          <a href="#portfolio" className="btn-secondary">View Our Work</a>
        </div>
      </div>
    </section>
  );
}
