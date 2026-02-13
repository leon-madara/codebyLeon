import { ArrowDown } from 'lucide-react';

interface ScrollHintProps {
  visible: boolean;
}

const ScrollHint = ({ visible }: ScrollHintProps) => {
  if (!visible) return null;

  return (
    <div className="hs-scroll-hint" aria-hidden="true">
      <span className="hs-scroll-hint__text">Scroll to progress</span>
      <ArrowDown className="hs-scroll-hint__icon" />
    </div>
  );
};

export default ScrollHint;
