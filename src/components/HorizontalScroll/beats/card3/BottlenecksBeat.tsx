import { Clock } from 'lucide-react';
import StoryBeat from '../../StoryBeat';
import { forwardRef } from 'react';

const Card3BottlenecksBeat = forwardRef<HTMLDivElement>((_, ref) => {
  return (
    <StoryBeat
      ref={ref}
      index={0}
      title="The Bottlenecks"
      subtitle="Design work piles up, campaigns wait"
      description="You're growing fast, but design work piles up. Campaigns wait, launches get delayed, and you can't afford a full-time designer yet."
      icon={<Clock className="w-12 h-12" />}
      gradientClass="card3-beat-1"
    >
      <div className="flex flex-wrap justify-center gap-4 mt-8">
        {['Delayed campaigns', 'Inconsistent visuals', 'No bandwidth', 'Missed deadlines'].map((problem, i) => (
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

Card3BottlenecksBeat.displayName = 'Card3BottlenecksBeat';

export default Card3BottlenecksBeat;
