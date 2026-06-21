import { forwardRef } from 'react';
import { Lightbulb } from 'lucide-react';
import { BeatCard } from '../../BeatCard';
import image from '@/assets/horizontal-scroll/2.png';

const Card1PlanBeat = forwardRef<HTMLElement>((_, ref) => {
  return (
    <BeatCard
      ref={ref}
      step={2}
      totalSteps={4}
      tagText="PLAN"
      imageSrc={image}
      icon={<Lightbulb className="w-6 h-6" style={{ color: 'var(--color-primary, #10B981)' }} />}
      heading="The Plan"
      subheading="Strategy meets execution"
      body="We map out your unique positioning, target audience, and goals. Every decision is intentional, every element serves a purpose."
      actionHint="Explore our process →"
    />
  );
});

Card1PlanBeat.displayName = 'Card1PlanBeat';
export default Card1PlanBeat;
