import { Sparkles, Crown, TrendingUp, Eye } from 'lucide-react';
import StoryBeat from '../../StoryBeat';
import { forwardRef } from 'react';

interface Card2TransformationBeatProps {
  showPricing?: boolean;
}

const Card2TransformationBeat = forwardRef<HTMLDivElement, Card2TransformationBeatProps>(({ showPricing = true }, ref) => {
  return (
    <StoryBeat
      ref={ref}
      index={3}
      title="The Transformation"
      subtitle="New Era"
      description="Emerge with a brand that turns heads, builds trust, and positions you as the leader you've become."
      icon={<Crown className="w-12 h-12" />}
      gradientClass="card2-beat-4"
    >
      <div className="mt-8">
        {/* Before/After visual */}
        <div className="relative w-full max-w-lg mx-auto bg-background/10 backdrop-blur-sm rounded-2xl border border-background/20 overflow-hidden shadow-lg p-8">
          <div className="flex items-center justify-center gap-8">
            <div className="text-center opacity-40">
              <div className="w-16 h-16 rounded-lg bg-background/20 flex items-center justify-center mb-2 mx-auto">
                <span className="text-2xl">📦</span>
              </div>
              <span className="text-primary-foreground/50 text-sm">Before</span>
            </div>
            <div className="text-primary-foreground text-2xl">→</div>
            <div className="text-center">
              <div className="w-16 h-16 rounded-lg bg-primary-foreground/20 flex items-center justify-center mb-2 mx-auto shadow-lg">
                <Sparkles className="w-8 h-8 text-primary-foreground" />
              </div>
              <span className="text-primary-foreground font-medium text-sm">After</span>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="flex justify-center gap-8 mt-8">
          {[
            { icon: Eye, label: 'Brand Recognition', value: '↑ 85%' },
            { icon: TrendingUp, label: 'Client Trust', value: '↑ 70%' },
            { icon: Crown, label: 'Market Position', value: 'Leader' },
          ].map((stat, i) => (
            <div
              key={stat.label}
              className="text-center"
              style={{ animationDelay: `${0.5 + i * 0.1}s` }}
            >
              <stat.icon className="w-6 h-6 text-primary-foreground/60 mx-auto mb-2" />
              <div className="text-xl font-bold text-primary-foreground">{stat.value}</div>
              <div className="text-xs text-primary-foreground/60">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Pricing CTA */}
        {showPricing && (
          <div className="mt-10 p-6 bg-background/15 backdrop-blur-sm rounded-2xl border border-background/20 max-w-md mx-auto">
            <div className="text-center">
              <div className="text-primary-foreground/70 text-sm font-medium mb-2">Investment</div>
              <div className="text-4xl font-bold text-primary-foreground mb-2">KES 75,000</div>
              <div className="text-primary-foreground/60 text-sm mb-4">3-4 week delivery</div>
              <button className="w-full px-6 py-3 bg-primary-foreground text-cyan-dark rounded-xl font-semibold hover:bg-primary-foreground/90 transition-all duration-300">
                Start Your Refresh
              </button>
            </div>
          </div>
        )}
      </div>
    </StoryBeat>
  );
});

Card2TransformationBeat.displayName = 'Card2TransformationBeat';

export default Card2TransformationBeat;
