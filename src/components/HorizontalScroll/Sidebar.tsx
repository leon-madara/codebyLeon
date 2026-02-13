import { Phone } from 'lucide-react';
import { forwardRef } from 'react';

interface SidebarProps {
  currentStep: number;
  totalSteps: number;
  visible: boolean;
}

const Sidebar = forwardRef<HTMLDivElement, SidebarProps>(({ currentStep, totalSteps, visible }, ref) => {
  return (
    <div ref={ref} className={`hs-sidebar ${visible ? 'is-visible' : ''}`.trim()}>
      <div className="hs-sidebar__inner">
        <div className="hs-sidebar__step">
          Step <strong>{currentStep + 1}</strong> of {totalSteps}
        </div>

        <button className="hs-sidebar__cta" type="button">
          <Phone className="hs-sidebar__cta-icon" />
          Book a Free Call
        </button>
      </div>
    </div>
  );
});

Sidebar.displayName = 'Sidebar';

export default Sidebar;
