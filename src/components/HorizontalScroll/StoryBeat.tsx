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
      <div
        ref={ref}
        className={`beat-card min-w-[100vw] w-[100vw] h-[70vh] ${gradientClass} will-change-transform`}
        data-beat={index}
      >
        <div className="max-w-xl mx-auto px-4 lg:px-0 lg:mr-[280px] py-6">
          {/* Icon */}
          <div className="beat-icon mb-4 p-4 rounded-xl bg-background/10 backdrop-blur-sm border border-background/20 inline-block">
            <div className="text-primary-foreground">{icon}</div>
          </div>

          {/* Title */}
          <h2 className="beat-title font-display text-2xl md:text-3xl lg:text-4xl font-bold text-primary-foreground mb-2 text-balance">
            {title}
          </h2>

          {/* Subtitle */}
          {subtitle && (
            <p className="beat-subtitle text-base md:text-lg text-primary-foreground/80 font-medium mb-3">
              {subtitle}
            </p>
          )}

          {/* Description */}
          <p className="beat-description text-sm md:text-base text-primary-foreground/70 leading-relaxed max-w-md mx-auto">
            {description}
          </p>

          {/* Additional content */}
          {children && (
            <div className="beat-content mt-6">
              {children}
            </div>
          )}
        </div>
      </div>
    );
  }
);

StoryBeat.displayName = 'StoryBeat';

export default StoryBeat;
