import { ArrowRight } from 'lucide-react';

interface ScrollHintProps {
  visible: boolean;
}

const ScrollHint = ({ visible }: ScrollHintProps) => {
  if (!visible) return null;

  return (
    <div
      className={`scroll-hint lg:right-[320px] ${visible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
    >
      <span>Scroll</span>
      <ArrowRight className="w-4 h-4 animate-pulse" />
    </div>
  );
};

export default ScrollHint;
