import { useTypingAnimation } from '../../hooks/useTypingAnimation';

export function Hero() {
  const typingRef = useTypingAnimation();

  return (
    <section className="hero">
      {/* LAYER 2: Abstract Orbs */}
      <div className="orbs-container">
        <div className="orb orb-purple"></div>
        <div className="orb orb-orange"></div>
        <div className="orb orb-blue"></div>
      </div>

      {/* LAYER 3: Full-Screen Frosted Overlay with Dot Grid */}
      <div className="frosted-overlay"></div>

      {/* LAYER 4: Content (Bold Typography) */}
      <div className="hero-content main-content">
        <div className="hero-text-wrapper">
          {/* Badge */}
          <span className="hero-badge anim-item">Nairobi-based design studio</span>

          {/* Main Headline */}
          <h1 className="hero-headline anim-item">
            <div className="headline-line-1"><span className="highlight-bold">Bold</span> websites for</div>
            <div className="headline-line-2">
              <span ref={typingRef} className="highlight-ambitious"></span>
            </div>
            <div className="headline-line-3">brands<span className="highlight-dot">.</span></div>
          </h1>

          {/* Subheadline */}
          <p className="hero-subheadline anim-item">
            Websites and design that make your business<br />look as professional as it is.
          </p>

          {/* Tag with Gradient + SVG Underline */}
          <div className="hero-tag-wrapper anim-item">
            <span className="hero-tag gradient-text">Beyond the Blueprint</span>
            <svg className="underline-svg" viewBox="0 0 200 12" preserveAspectRatio="none">
              <path 
                className="underline-path"
                d="M0 6 Q16.67 0.5 33.33 6 Q50 11.5 66.67 6 Q83.33 0.5 100 6 Q116.67 11.5 133.33 6 Q150 0.5 166.67 6 Q183.33 11.5 200 6"
                fill="none" 
                stroke="currentColor" 
                strokeWidth="3" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
              />
            </svg>
          </div>

          {/* CTAs */}
          <div className="hero-ctas anim-item">
            <a href="/get-started.html" className="btn-primary">Book a free 20-minute call</a>
            <a href="#portfolio" className="btn-secondary">VIEW PORTFOLIO</a>
          </div>
        </div>
      </div>
    </section>
  );
}
