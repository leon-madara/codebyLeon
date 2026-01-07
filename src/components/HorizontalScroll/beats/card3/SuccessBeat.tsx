import { BarChart3, Rocket, Sparkles } from 'lucide-react';
import StoryBeat from '../../StoryBeat';
import { forwardRef } from 'react';

interface Card3SuccessBeatProps {
  showPricing?: boolean;
}

const Card3SuccessBeat = forwardRef<HTMLDivElement, Card3SuccessBeatProps>(({ showPricing = true }, ref) => {
  return (
    <StoryBeat
      ref={ref}
      index={3}
      title="The Success"
      subtitle="Scalable Growth"
      description="Launch campaigns on time, maintain professional visuals, and scale your business without design holding you back."
      icon={<Rocket className="w-12 h-12" />}
      gradientClass="card3-beat-4"
    >
      <div className="mt-8">
        {/* Success visualization */}
        <div className="relative w-full max-w-lg mx-auto bg-background/10 backdrop-blur-sm rounded-2xl border border-background/20 overflow-hidden shadow-lg p-8">
          <div className="flex items-center justify-between gap-4">
            {[BarChart3, Rocket, Sparkles].map((Icon, i) => (
              <div
                key={i}
                className="flex-1 text-center"
                style={{ animationDelay: `${i * 0.15}s` }}
              >
                <div className="w-14 h-14 rounded-xl bg-primary-foreground/20 flex items-center justify-center mb-3 mx-auto shadow-lg">
                  <Icon className="w-7 h-7 text-primary-foreground" />
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-6">
            <span className="text-primary-foreground font-medium">Consistent growth, zero bottlenecks</span>
          </div>
        </div>

        {/* Results */}
        <div className="flex justify-center gap-8 mt-8">
          {[
            { label: 'Campaigns/mo', value: '4-6' },
            { label: 'Turnaround', value: '48hrs' },
            { label: 'Cost Savings', value: '60%' },
          ].map((stat, i) => (
            <div
              key={stat.label}
              className="text-center"
              style={{ animationDelay: `${0.5 + i * 0.1}s` }}
            >
              <div className="text-2xl font-bold text-primary-foreground">{stat.value}</div>
              <div className="text-sm text-primary-foreground/60">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Pricing CTA */}
        {showPricing && (
          <div className="mt-10 p-6 bg-background/15 backdrop-blur-sm rounded-2xl border border-background/20 max-w-md mx-auto">
            <div className="text-center">
              <div className="text-primary-foreground/70 text-sm font-medium mb-2">Monthly retainer</div>
              <div className="text-4xl font-bold text-primary-foreground mb-2">KES 25,000 - 50,000</div>
              <div className="text-primary-foreground/60 text-sm mb-4">Flexible monthly plans</div>
              <button className="w-full px-6 py-3 bg-primary-foreground text-emerald-dark rounded-xl font-semibold hover:bg-primary-foreground/90 transition-all duration-300">
                Start Monthly Support
              </button>
            </div>
          </div>
        )}
      </div>
    </StoryBeat>
  );
});

Card3SuccessBeat.displayName = 'Card3SuccessBeat';

export default Card3SuccessBeat;
