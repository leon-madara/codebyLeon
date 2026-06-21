import { forwardRef } from 'react';
import { RefreshCw } from 'lucide-react';
import { BeatCard } from '../../BeatCard';
import image from '@/assets/horizontal-scroll/11.png';

const Card3WorkflowBeat = forwardRef<HTMLElement>((_, ref) => {
  return (
    <BeatCard
      ref={ref}
      step={3}
      totalSteps={4}
      tagText="WORKFLOW"
      imageSrc={image}
      icon={<RefreshCw className="w-6 h-6" style={{ color: 'var(--color-primary, #10B981)' }} />}
      heading="The Workflow"
      subheading="Ongoing"
      body="Submit requests, get fast turnarounds, and maintain brand consistency across all your marketing materials."
      actionHint="See the workflow →"
    />
  );
});

Card3WorkflowBeat.displayName = 'Card3WorkflowBeat';
export default Card3WorkflowBeat;
