import { forwardRef } from 'react';
import { AlertCircle } from 'lucide-react';
import { BeatCard } from '../../BeatCard';
import image from '@/assets/horizontal-scroll/1.png';

const Card1ProblemBeat = forwardRef<HTMLElement>((_, ref) => {
  return (
    <BeatCard
      ref={ref}
      step={1}
      totalSteps={4}
      tagText="PROBLEM"
      imageSrc={image}
      icon={<AlertCircle className="w-6 h-6" style={{ color: 'var(--color-primary, #10B981)' }} />}
      heading="The Problem"
      subheading="Your expertise deserves better visibility"
      body="You're brilliant at what you do, but potential clients can only find you through word of mouth. Your skills are hidden behind a non-existent or outdated web presence."
    />
  );
});

Card1ProblemBeat.displayName = 'Card1ProblemBeat';
export default Card1ProblemBeat;
