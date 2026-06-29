import { forwardRef } from 'react';
import { Wrench } from 'lucide-react';
import { BeatCard } from '../../BeatCard';
import image from '@/assets/horizontal-scroll/7.png';

const Card2ProcessBeat = forwardRef<HTMLElement>((_, ref) => {
  return (
    <BeatCard
      ref={ref}
      step={3}
      totalSteps={4}
      tagText="PROCESS"
      imageSrc={image}
      icon={<Wrench className="w-6 h-6" style={{ color: 'var(--color-primary, #10B981)' }} />}
      heading="The Process"
      subheading="3-4 Weeks"
      body="We transform your visual identity from outdated to outstanding. A complete refresh that tells your new story."
      actionHint="See the timeline →"
    />
  );
});

Card2ProcessBeat.displayName = 'Card2ProcessBeat';
export default Card2ProcessBeat;
