import { forwardRef } from 'react';
import { Calendar } from 'lucide-react';
import { BeatCard } from '../../BeatCard';
import image from '@/assets/horizontal-scroll/10.png';

const Card3ModelBeat = forwardRef<HTMLElement>((_, ref) => {
  return (
    <BeatCard
      ref={ref}
      step={2}
      totalSteps={4}
      tagText="MODEL"
      imageSrc={image}
      icon={<Calendar className="w-6 h-6" style={{ color: 'var(--color-primary, #10B981)' }} />}
      heading="The Model"
      subheading="Monthly Retainer"
      body="Get 10-20 hours of design work each month. Campaign graphics, landing pages, site updates—all handled without the overhead."
    />
  );
});

Card3ModelBeat.displayName = 'Card3ModelBeat';
export default Card3ModelBeat;
