import { forwardRef } from 'react';
import { BarChart3 } from 'lucide-react';
import { BeatCard } from '../../BeatCard';
import image from '@/assets/horizontal-scroll/12.png';

const Card3SuccessBeat = forwardRef<HTMLElement>((_, ref) => {
  return (
    <BeatCard
      ref={ref}
      step={4}
      totalSteps={4}
      tagText="SUCCESS"
      imageSrc={image}
      icon={<BarChart3 className="w-6 h-6" style={{ color: 'var(--color-primary, #10B981)' }} />}
      heading="The Success"
      subheading="Scalable Growth"
      body="Launch campaigns on time, maintain professional visuals, and scale your business without design holding you back."
      actionHint="Get started today →"
    />
  );
});

Card3SuccessBeat.displayName = 'Card3SuccessBeat';
export default Card3SuccessBeat;
