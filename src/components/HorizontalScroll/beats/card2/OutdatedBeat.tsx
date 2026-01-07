import { AlertTriangle } from 'lucide-react';
import StoryBeat from '../../StoryBeat';
import { forwardRef } from 'react';

const Card2OutdatedBeat = forwardRef<HTMLDivElement>((_, ref) => {
  return (
    <StoryBeat
      ref={ref}
      index={0}
      title="The Outdated"
      subtitle="Your brand no longer reflects who you are"
      description="You've evolved, but your digital presence hasn't. Your website feels dated, your branding is inconsistent, and it's silently losing you credibility."
      icon={<AlertTriangle className="w-12 h-12" />}
      gradientClass="card2-beat-1"
    >
      <div className="flex flex-wrap justify-center gap-4 mt-8">
        {['Dated design', 'Inconsistent branding', 'Poor mobile UX', 'Lost credibility'].map((problem, i) => (
          <div
            key={problem}
            className="problem-tag px-4 py-2 bg-background/10 backdrop-blur-sm rounded-full text-primary-foreground/90 text-sm font-medium border border-background/20"
            style={{ animationDelay: `${i * 0.1}s` }}
          >
            {problem}
          </div>
        ))}
      </div>
    </StoryBeat>
  );
});

Card2OutdatedBeat.displayName = 'Card2OutdatedBeat';

export default Card2OutdatedBeat;
