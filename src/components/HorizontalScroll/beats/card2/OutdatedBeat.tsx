import { forwardRef } from 'react';
import { AlertTriangle } from 'lucide-react';
import { BeatCard } from '../../BeatCard';
import image from '@/assets/horizontal-scroll/5.png';

const Card2OutdatedBeat = forwardRef<HTMLElement>((_, ref) => {
  return (
    <BeatCard
      ref={ref}
      step={1}
      totalSteps={4}
      tagText="OUTDATED"
      imageSrc={image}
      icon={<AlertTriangle className="w-6 h-6" style={{ color: 'var(--color-primary, #10B981)' }} />}
      heading="The Outdated"
      subheading="Your brand no longer reflects who you are"
      body="You've evolved, but your digital presence hasn't. Your website feels dated, your branding is inconsistent, and it's silently losing you credibility."
      actionHint="See how we fix this →"
    />
  );
});

Card2OutdatedBeat.displayName = 'Card2OutdatedBeat';
export default Card2OutdatedBeat;
