import { ReactNode, forwardRef } from 'react';

interface StoryBeatProps {
  index: number;
  title: string;
  subtitle?: string;
  description: string;
  icon: ReactNode;
  children?: ReactNode;
  gradientClass: string;
}

const StoryBeat = forwardRef<HTMLDivElement, StoryBeatProps>(
  ({ index, title, subtitle, description, icon, children, gradientClass }, ref) => {
    return (
      <article
        ref={ref}
        className={`hs-beat ${gradientClass}`.trim()}
        data-beat={index}
      >
        <div className="hs-beat__content">
          <div className="hs-beat__icon hs-beat-reveal">
            <div className="hs-beat__icon-inner">{icon}</div>
          </div>

          <h2 className="hs-beat__title hs-beat-reveal">{title}</h2>

          {subtitle && (
            <p className="hs-beat__subtitle hs-beat-reveal">{subtitle}</p>
          )}

          <p className="hs-beat__description hs-beat-reveal">{description}</p>

          {children && (
            <div className="hs-beat__body hs-beat-reveal">
              {children}
            </div>
          )}
        </div>
      </article>
    );
  }
);

StoryBeat.displayName = 'StoryBeat';

export default StoryBeat;
