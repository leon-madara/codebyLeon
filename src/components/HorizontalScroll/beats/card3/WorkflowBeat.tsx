import { RefreshCw, Check } from 'lucide-react';
import StoryBeat from '../../StoryBeat';
import { forwardRef } from 'react';

const Card3WorkflowBeat = forwardRef<HTMLDivElement>((_, ref) => {
  const items = [
    'Campaign graphics',
    'Landing pages',
    'Site updates',
    'Priority support',
  ];

  return (
    <StoryBeat
      ref={ref}
      index={2}
      title="The Workflow"
      subtitle="Ongoing"
      description="Submit requests, get fast turnarounds, and maintain brand consistency across all your marketing materials."
      icon={<RefreshCw className="w-12 h-12" />}
      gradientClass="card3-beat-3"
    >
      <div className="mt-8 max-w-md mx-auto">
        <div className="relative pl-8">
          <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-background/30 rounded-full">
            <div className="timeline-progress absolute top-0 left-0 w-full bg-primary-foreground rounded-full transition-all duration-500" />
          </div>

          {items.map((item, i) => (
            <div
              key={item}
              className="timeline-item relative flex items-center gap-4 pb-6 last:pb-0"
              style={{ '--animation-delay': `${i * 0.2}s` } as React.CSSProperties}
            >
              <div className="absolute left-0 w-6 h-6 rounded-full bg-primary-foreground/30 border-2 border-primary-foreground flex items-center justify-center">
                <Check className="w-3 h-3 text-primary-foreground" />
              </div>
              <span className="text-primary-foreground/90 font-medium ml-4">{item}</span>
            </div>
          ))}
        </div>
      </div>
    </StoryBeat>
  );
});

Card3WorkflowBeat.displayName = 'Card3WorkflowBeat';

export default Card3WorkflowBeat;
