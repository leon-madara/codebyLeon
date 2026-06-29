import { forwardRef } from 'react';
import { Rocket } from 'lucide-react';
import { BeatCard } from '../../BeatCard';
import image from '@/assets/horizontal-scroll/4.png';

const Card1LaunchBeat = forwardRef<HTMLElement>((_, ref) => {
  return (
    <BeatCard
      ref={ref}
      step={4}
      totalSteps={4}
      tagText="LAUNCH"
      imageSrc={image}
      icon={<Rocket className="w-6 h-6" style={{ color: 'var(--color-primary, #10B981)' }} />}
      heading="Launch"
      subheading="Your moment to shine"
      body="Go live with confidence. Your new digital presence is ready to attract, convert, and delight your ideal clients."
      actionHint="Start your project →"
    />
  );
});

Card1LaunchBeat.displayName = 'Card1LaunchBeat';
export default Card1LaunchBeat;
