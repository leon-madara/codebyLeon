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
          <div className="about__card">
            <h3 className="about__card-title">Mission</h3>
            <p className="about__card-description">
              Code by Leon helps small businesses and creators build modern websites and consistent visuals
              so they can look professional online, attract better clients, and stop losing opportunities
              because of weak design.
            </p>
          </div>
          <div className="about__card">
            <h3 className="about__card-title">Technology Stack</h3>
            <p className="about__card-description">
              Modern, fast, mobile-first approaches with SEO and performance optimization. We use the latest
              web technologies to ensure your site loads quickly and ranks well.
            </p>
          </div>
          <div className="about__card">
            <h3 className="about__card-title">Working Process</h3>
            <ol className="about__process-list">
              <li className="about__process-item">Discovery call to understand your needs</li>
              <li className="about__process-item">Proposal & agreement</li>
              <li className="about__process-item">Design & development</li>
              <li className="about__process-item">Revisions & refinement</li>
              <li className="about__process-item">Launch & support</li>
            </ol>
          </div>
        </div>

        <div className="about__cta">
          <p className="about__cta-text">Let's discuss how we can help your business</p>
          <a href="/get-started.html" className="btn-primary">Book a free 20-minute call</a>
        </div>
      </div>
    </section>
  );
}
