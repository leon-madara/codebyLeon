import { ReactNode, forwardRef } from 'react';

interface BeatCardProps {
  step: number;
  totalSteps: number;
  tagText: string;
  imageSrc: string;
  icon: ReactNode;
  heading: string;
  subheading: string;
  body: string;
}

export const BeatCard = forwardRef<HTMLElement, BeatCardProps>(({
  step,
  totalSteps,
  tagText,
  imageSrc,
  icon,
  heading,
  subheading,
  body
}, ref) => {
  return (
    <article ref={ref} className="beat-card">
      {/* Left side: Visuals */}
      <div className="beat-card__media">
        <div className="beat-card__accent-line" />
        <img src={imageSrc} alt={heading} className="beat-card__image" />
        <div className="beat-card__overlay" />
        
        <div className="beat-card__badge hs-beat-reveal">
          <span className="beat-card__badge-dot" />
          {tagText}
        </div>
      </div>

      {/* Right side: Copy */}
      <div className="beat-card__content">
        <div className="beat-card__step-indicator hs-beat-reveal">
          <span className="beat-card__step-text">STEP {step} OF {totalSteps}</span>
          <span className="beat-card__step-line" />
        </div>

        <div className="beat-card__icon hs-beat-reveal">
          {icon}
        </div>

        <h2 className="beat-card__title hs-beat-reveal">{heading}</h2>
        <p className="beat-card__subheading hs-beat-reveal">{subheading}</p>
        
        <hr className="beat-card__divider hs-beat-reveal" />
        
        <p className="beat-card__body hs-beat-reveal">{body}</p>
      </div>
    </article>
  );
});

BeatCard.displayName = 'BeatCard';
