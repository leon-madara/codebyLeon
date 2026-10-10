export function FinalCTA() {
  return (
    <section id="final-cta" className="final-cta" aria-label="Final Call to Action">
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
        <div className="final-cta__response-guarantee">
          <span aria-hidden="true">⚡</span>
          <span>We will contact you within hours, if not minutes.</span>
        </div>

        <h2 className="final-cta__headline">Ready to Transform Your Online Presence?</h2>
        <p className="final-cta__subheadline">
          Let&apos;s discuss how we can help your business look established, credible, and ready to win high-value clients.
        </p>

        <div className="final-cta__cta">
          <a
            href="/get-started.html?intent=discovery-call"
            className="button button--secondary final-cta__discovery-btn"
          >
            Book a 20-minute discovery call
          </a>
          <a
            href="/get-started.html"
            className="button button--primary final-cta__config-btn"
          >
            Configure your project online
          </a>
        </div>
      </div>
    </section>
  );
}
