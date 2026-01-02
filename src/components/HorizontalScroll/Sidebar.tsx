import { Button } from '@/components/ui/button';
import { Phone } from 'lucide-react';
import { useState, useEffect } from 'react';

interface SidebarProps {
  currentStep: number;
  totalSteps: number;
}

const Sidebar = ({ currentStep, totalSteps }: SidebarProps) => {
  const [isBlogVisible, setIsBlogVisible] = useState(false);

  useEffect(() => {
    const blogSection = document.querySelector('#blog');
    if (!blogSection) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsBlogVisible(entry.isIntersecting);
        });
      },
      { threshold: 0.1 } // Trigger when 10% of blog section is visible
    );

    observer.observe(blogSection);
    return () => observer.disconnect();
  }, []);

  // Conditionally apply positioning: fixed when blog not visible, absolute when blog visible
  const positionClass = isBlogVisible 
    ? 'absolute bottom-0'  // Unpinned - scrolls with content
    : 'fixed bottom-0';     // Pinned - stays at bottom

  return (
    <div className={`hidden lg:flex ${positionClass} left-0 w-full h-[80px] flex-row items-center justify-center bg-background/80 backdrop-blur-md border-t border-border/50 z-[60]`}>
      <div className="flex flex-row items-center justify-between gap-4 px-6 py-4 w-full max-w-7xl mx-auto">
        {/* CTA Button */}
        <Button 
          size="lg" 
          className="group relative overflow-hidden bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 rounded-xl shadow-medium hover:shadow-glow transition-all duration-300"
        >
          <span className="flex items-center gap-2 font-semibold">
            <Phone className="w-5 h-5" />
            Book a Free Call
          </span>
        </Button>

        {/* Step indicator */}
        <div className="text-muted-foreground font-medium">
          Step <span className="text-primary font-bold">{currentStep + 1}</span> of {totalSteps}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
