import { Lightbulb, Target, Users } from 'lucide-react';
import StoryBeat from '../../StoryBeat';
import { forwardRef } from 'react';

const Card1PlanBeat = forwardRef<HTMLDivElement>((_, ref) => {
  return (
    <StoryBeat
      ref={ref}
      index={1}
      title="The Plan"
      subtitle="Strategy meets execution"
      description="We map out your unique positioning, target audience, and goals. Every decision is intentional, every element serves a purpose."
      icon={<Lightbulb className="w-12 h-12" />}
      gradientClass="card1-beat-2"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 max-w-2xl mx-auto">
        {[
          { icon: Target, label: 'Define Goals', desc: 'Clear objectives' },
          { icon: Users, label: 'Know Audience', desc: 'Target personas' },
          { icon: Lightbulb, label: 'Plan Strategy', desc: 'Actionable roadmap' },
        ].map((item, i) => (
          <div
            key={item.label}
            className="plan-item flex flex-col items-center gap-3 p-6 bg-background/10 backdrop-blur-sm rounded-2xl border border-background/20"
            style={{ '--animation-delay': `${i * 0.15}s` } as React.CSSProperties}
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

Card1PlanBeat.displayName = 'Card1PlanBeat';

export default Card1PlanBeat;
