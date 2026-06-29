import { forwardRef } from 'react';
import { Clock } from 'lucide-react';
import { BeatCard } from '../../BeatCard';
import image from '@/assets/horizontal-scroll/9.png';

const Card3BottlenecksBeat = forwardRef<HTMLElement>((_, ref) => {
  return (
    <BeatCard
      ref={ref}
      step={1}
      totalSteps={4}
      tagText="BOTTLENECKS"
      imageSrc={image}
      icon={<Clock className="w-6 h-6" style={{ color: 'var(--color-primary, #10B981)' }} />}
      heading="The Bottlenecks"
      subheading="Design work piles up, campaigns wait"
      body="You're growing fast, but design work piles up. Campaigns wait, launches get delayed, and you can't afford a full-time designer yet."
      actionHint="See how we help →"
    />
  );
});

Card3BottlenecksBeat.displayName = 'Card3BottlenecksBeat';
export default Card3BottlenecksBeat;
