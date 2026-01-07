import { Hammer, Check } from 'lucide-react';
import StoryBeat from '../../StoryBeat';
import { forwardRef } from 'react';

const Card1BuildBeat = forwardRef<HTMLDivElement>((_, ref) => {
  const steps = [
    'Discovery & wireframes',
    'Visual design & branding',
    'Development & testing',
    'Content integration',
  ];

  return (
    <StoryBeat
      ref={ref}
      index={2}
      title="We Build"
      subtitle="Crafted with precision"
      description="Watch your vision come to life. Fast iterations, transparent progress, and pixel-perfect execution."
      icon={<Hammer className="w-12 h-12" />}
      gradientClass="card1-beat-3"
    >
      <div className="mt-8 max-w-md mx-auto">
        <div className="relative pl-8">
          <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-background/30 rounded-full">
            <div className="timeline-progress absolute top-0 left-0 w-full bg-primary-foreground rounded-full transition-all duration-500" style={{ height: '0%' }} />
          </div>

          {steps.map((step, i) => (
            <div
              key={step}
              className="timeline-item relative flex items-center gap-4 pb-6 last:pb-0"
              style={{ animationDelay: `${i * 0.2}s` }}
            >
              <div className="absolute left-0 w-6 h-6 rounded-full bg-background/20 border-2 border-primary-foreground/50 flex items-center justify-center">
                <Check className="w-3 h-3 text-primary-foreground opacity-0 timeline-check" />
              </div>
              <span className="text-primary-foreground/90 font-medium ml-4">{step}</span>
            </div>
          ))}
        </div>
      </div>
    </StoryBeat>
  );
});

Card1BuildBeat.displayName = 'Card1BuildBeat';

export default Card1BuildBeat;
