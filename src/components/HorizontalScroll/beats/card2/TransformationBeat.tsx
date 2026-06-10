import { forwardRef } from 'react';
import { Sparkles } from 'lucide-react';
import { BeatCard } from '../../BeatCard';
import image from '@/assets/horizontal-scroll/8.png';

const Card2TransformationBeat = forwardRef<HTMLElement>((_, ref) => {
  return (
    <BeatCard
      ref={ref}
      step={4}
      totalSteps={4}
      tagText="TRANSFORMATION"
      imageSrc={image}
      icon={<Sparkles className="w-6 h-6" style={{ color: 'var(--color-primary, #10B981)' }} />}
      heading="The Transformation"
      subheading="New Era"
      body="Emerge with a brand that turns heads, builds trust, and positions you as the leader you've become."
    />
  );
});

Card2TransformationBeat.displayName = 'Card2TransformationBeat';
export default Card2TransformationBeat;
