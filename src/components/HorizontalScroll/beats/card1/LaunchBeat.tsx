import { Rocket, Sparkles, TrendingUp, Globe } from 'lucide-react';
import StoryBeat from '../../StoryBeat';
import { forwardRef } from 'react';

interface Card1LaunchBeatProps {
  showPricing?: boolean;
}

const Card1LaunchBeat = forwardRef<HTMLDivElement, Card1LaunchBeatProps>(({ showPricing = true }, ref) => {
  return (
    <StoryBeat
      ref={ref}
      index={3}
      title="Launch"
      subtitle="Your moment to shine"
      description="Go live with confidence. Your new digital presence is ready to attract, convert, and delight your ideal clients."
      icon={<Rocket className="w-12 h-12" />}
      gradientClass="card1-beat-4"
    >
      <div className="mt-8">
        {/* Mockup preview */}
        <div className="launch-mockup relative w-full max-w-lg mx-auto aspect-video bg-background/10 backdrop-blur-sm rounded-2xl border border-background/20 overflow-hidden shadow-lg">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <Globe className="w-16 h-16 text-primary-foreground/50 mx-auto mb-4" />
              <span className="text-primary-foreground/70 font-medium">Your Live Website</span>
            </div>
          </div>

          {/* Success indicators */}
          <div className="absolute -right-4 -bottom-4 flex gap-2">
            {[Sparkles, TrendingUp].map((Icon, i) => (
              <div
                key={i}
                className="launch-icon p-3 bg-accent rounded-full shadow-lg"
                style={{ animationDelay: `${0.3 + i * 0.15}s` }}
              >
                <Icon className="w-5 h-5 text-accent-foreground" />
              </div>
            ))}
          </div>
        </div>

        {/* Results preview */}
        <div className="flex justify-center gap-8 mt-8">
          {[
            { label: 'Load Time', value: '<2s' },
            { label: 'Mobile Ready', value: '100%' },
            { label: 'SEO Score', value: '95+' },
          ].map((stat, i) => (
            <div
              key={stat.label}
              className="launch-stat text-center"
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
              <div className="text-primary-foreground/70 text-sm font-medium mb-2">Starting at</div>
              <div className="text-4xl font-bold text-primary-foreground mb-2">KES 35,000</div>
              <div className="text-primary-foreground/60 text-sm mb-4">10-day delivery</div>
              <button className="w-full px-6 py-3 bg-primary-foreground text-forest-dark rounded-xl font-semibold hover:bg-primary-foreground/90 transition-all duration-300">
                Get Started
              </button>
            </div>
          </div>
        )}
      </div>
    </StoryBeat>
  );
});

Card1LaunchBeat.displayName = 'Card1LaunchBeat';

export default Card1LaunchBeat;
