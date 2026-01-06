import { Calendar, Briefcase, Zap } from 'lucide-react';
import StoryBeat from '../../StoryBeat';
import { forwardRef } from 'react';

const Card3ModelBeat = forwardRef<HTMLDivElement>((_, ref) => {
  return (
    <StoryBeat
      ref={ref}
      index={1}
      title="The Model"
      subtitle="Monthly Retainer"
      description="Get 10-20 hours of design work each month. Campaign graphics, landing pages, site updates—all handled without the overhead."
      icon={<Briefcase className="w-12 h-12" />}
      gradientClass="card3-beat-2"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 max-w-2xl mx-auto">
        {[
          { icon: Calendar, label: 'Monthly Hours', desc: '10-20 hrs/month' },
          { icon: Briefcase, label: 'No Overhead', desc: 'Skip hiring costs' },
          { icon: Zap, label: 'Fast Turnaround', desc: '24-48hr delivery' },
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

Card3ModelBeat.displayName = 'Card3ModelBeat';

export default Card3ModelBeat;
