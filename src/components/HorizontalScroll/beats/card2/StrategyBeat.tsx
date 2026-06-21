import { forwardRef } from 'react';
import { Compass } from 'lucide-react';
import { BeatCard } from '../../BeatCard';
import image from '@/assets/horizontal-scroll/6.png';

const Card2StrategyBeat = forwardRef<HTMLElement>((_, ref) => {
  return (
    <BeatCard
      ref={ref}
      step={2}
      totalSteps={4}
      tagText="STRATEGY"
      imageSrc={image}
      icon={<Compass className="w-6 h-6" style={{ color: 'var(--color-primary, #10B981)' }} />}
      heading="The Strategy"
      subheading="Brand Discovery"
      body="We audit your current brand, analyze your competitors, and craft a strategy that positions you for growth. Your new identity starts here."
      actionHint="Explore brand strategy →"
    />
  );
});

Card2StrategyBeat.displayName = 'Card2StrategyBeat';
export default Card2StrategyBeat;
