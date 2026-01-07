import { Compass, Palette, Target } from 'lucide-react';
import StoryBeat from '../../StoryBeat';
import { forwardRef } from 'react';

const Card2StrategyBeat = forwardRef<HTMLDivElement>((_, ref) => {
  return (
    <StoryBeat
      ref={ref}
      index={1}
      title="The Strategy"
      subtitle="Brand Discovery"
      description="We audit your current brand, analyze your competitors, and craft a strategy that positions you for growth. Your new identity starts here."
      icon={<Compass className="w-12 h-12" />}
      gradientClass="card2-beat-2"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 max-w-2xl mx-auto">
        {[
          { icon: Target, label: 'Brand Audit', desc: "What's working & not" },
          { icon: Compass, label: 'Competitor Analysis', desc: 'Market positioning' },
          { icon: Palette, label: 'Vision Board', desc: 'New direction' },
        ].map((item, i) => (
          <div
            key={item.label}
            className="plan-item flex flex-col items-center gap-3 p-6 bg-background/10 backdrop-blur-sm rounded-2xl border border-background/20"
            style={{ animationDelay: `${i * 0.15}s` }}
          >
            <item.icon className="w-8 h-8 text-primary-foreground" />
            <span className="text-primary-foreground font-semibold">{item.label}</span>
            <span className="text-primary-foreground/60 text-sm">{item.desc}</span>
          </div>
        ))}
      </div>
    </StoryBeat>
  );
});

Card2StrategyBeat.displayName = 'Card2StrategyBeat';

export default Card2StrategyBeat;
