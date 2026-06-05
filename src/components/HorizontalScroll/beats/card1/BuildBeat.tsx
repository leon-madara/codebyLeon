import { forwardRef } from 'react';
import { Hammer } from 'lucide-react';
import { BeatCard } from '../../BeatCard';
import image from '@/assets/horizontal-scroll/3.png';

const Card1BuildBeat = forwardRef<HTMLElement>((_, ref) => {
  return (
    <BeatCard
      ref={ref}
      step={3}
      totalSteps={4}
      tagText="BUILD"
      imageSrc={image}
      icon={<Hammer className="w-6 h-6" style={{ color: 'var(--color-primary, #10B981)' }} />}
      heading="We Build"
      subheading="Crafted with precision"
      body="Watch your vision come to life. Fast iterations, transparent progress, and pixel-perfect execution."
    />
  );
});

Card1BuildBeat.displayName = 'Card1BuildBeat';
export default Card1BuildBeat;
