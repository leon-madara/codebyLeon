import { AlertCircle } from 'lucide-react';
import StoryBeat from '../../StoryBeat';
import { forwardRef } from 'react';

const Card1ProblemBeat = forwardRef<HTMLDivElement>((_, ref) => {
  return (
    <StoryBeat
      ref={ref}
      index={0}
      title="The Problem"
      subtitle="Your expertise deserves better visibility"
      description="You're brilliant at what you do, but potential clients can only find you through word of mouth. Your skills are hidden behind a non-existent or outdated web presence."
      icon={<AlertCircle className="w-12 h-12" />}
      gradientClass="card1-beat-1"
    >
      <div className="flex flex-wrap justify-center gap-4 mt-8">
        {['No website', 'Outdated design', 'Zero SEO', 'Lost leads'].map((problem, i) => (
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

Card1ProblemBeat.displayName = 'Card1ProblemBeat';

export default Card1ProblemBeat;
