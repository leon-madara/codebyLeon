export function About() {
  return (
    <section id="about" className="about">
      {/* LAYER 2: Abstract Orbs */}
      <div className="about__orbs">
        <div className="about__orb about__orb--purple"></div>
        <div className="about__orb about__orb--orange"></div>
        <div className="about__orb about__orb--blue"></div>
      </div>

      {/* LAYER 3: Frosted Overlay */}
      <div className="about__overlay"></div>

      {/* LAYER 4: Content */}
      <div className="about__content">
        <h2 className="about__headline">Helping Kenyan Businesses Look Professional Online</h2>
        <p className="about__subheadline">
          I design websites and visuals that help Kenyan businesses look professional, get more inquiries,
          and build trust online.
        </p>

        <div className="about__container">
          <article className="about__card about__card--featured">
            <div className="about__card-media">
              <div className="about__card-chips">
                <span className="about__card-chip">Mission</span>
                <span className="about__card-chip">Featured</span>
              </div>
              <div className="about__card-media-content">
                <p className="about__card-kicker">Code by Leon</p>
                <h3 className="about__card-title">Professional Presence That Builds Trust</h3>
              </div>
            </div>
            <div className="about__card-body">
              <p className="about__card-description">
                We build polished websites and consistent visuals that make Kenyan businesses look credible,
                win stronger first impressions, and turn more visitors into serious inquiries.
              </p>
              <div className="about__card-tags">
                <span className="about__card-tag">Web Design</span>
                <span className="about__card-tag">Brand Visuals</span>
                <span className="about__card-tag">Lead-Focused</span>
              </div>
              <a href="/get-started.html" className="about__card-button">Start your project</a>
            </div>
          </article>

          <article className="about__card about__card--stack">
            <p className="about__card-kicker">Technology Stack</p>
            <h3 className="about__card-title">Built for Speed, SEO, and Scale</h3>
            <p className="about__card-description">
              Your site is built with modern tooling, mobile-first layouts, and technical SEO best practices
              so it loads fast, ranks better, and stays reliable as your business grows.
            </p>
            <div className="about__card-tags">
              <span className="about__card-tag">Mobile-First</span>
              <span className="about__card-tag">Technical SEO</span>
              <span className="about__card-tag">Performance</span>
            </div>
          </article>

          <article className="about__card about__card--process">
            <p className="about__card-kicker">Working Process</p>
            <h3 className="about__card-title">Clear 5-Step Delivery Process</h3>
            <p className="about__card-intro">
              You always know what is next, what is being delivered, and when it goes live.
            </p>
            <ol className="about__process-list">
              <li className="about__process-item">Discovery and business goals</li>
              <li className="about__process-item">Proposal and scope alignment</li>
              <li className="about__process-item">Design and development sprint</li>
              <li className="about__process-item">Review, revisions, and polish</li>
              <li className="about__process-item">Launch and post-launch support</li>
            </ol>
          </article>
        </div>

        <div className="about__cta">
          <p className="about__cta-text">Let's discuss how we can help your business</p>
          <a href="/get-started.html" className="btn-primary">Book a free 20-minute call</a>
        </div>
      </div>
    </section>
  );
}
