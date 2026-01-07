import { Phone } from 'lucide-react';

interface SidebarProps {
  currentStep: number;
  totalSteps: number;
}

const Sidebar = ({ currentStep, totalSteps }: SidebarProps) => {
  return (
    <div className="hidden lg:flex fixed bottom-0 left-0 right-0 h-auto w-full flex-row items-center justify-center bg-background/80 backdrop-blur-md border-t border-border/50 z-40">
      <div className="flex flex-row items-center gap-8 p-6 max-w-4xl mx-auto">
        {/* Yellow element - Step indicator */}
        <div className="bg-yellow-400 text-black px-4 py-3 rounded-lg font-medium shadow-lg">
          Step <span className="font-bold">{currentStep + 1}</span> of {totalSteps}
        </div>

        {/* CTA Button - Red element */}
        <button
          className="group relative overflow-hidden bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <span className="flex items-center gap-2 font-semibold">
            <Phone className="w-5 h-5" />
            Book a Free Call
          </span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
