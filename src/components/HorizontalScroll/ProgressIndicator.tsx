import { Check } from 'lucide-react';

interface ProgressIndicatorProps {
  currentBeat: number;
  totalBeats: number;
  progress: number;
  labels: string[];
}

const ProgressIndicator = ({ currentBeat, totalBeats, progress, labels }: ProgressIndicatorProps) => {
  return (
    <div className="relative flex items-center justify-center py-3">
      <div className="relative flex items-center">
        {labels.map((label, index) => {
          const isActive = index === currentBeat;
          const isCompleted = index < currentBeat || (index === currentBeat && progress > 0);
          const isPending = index > currentBeat;
          const isLast = index === labels.length - 1;

          return (
            <div key={label} className="relative flex items-center">
              {/* Circle - directly aligned with line */}
              <div className="relative">
                <div
                  className={`
                    w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 ease-out
                    ${isCompleted || isActive
                      ? 'bg-primary border-primary/80'
                      : 'bg-transparent border-muted-foreground/40'
                    }
                  `}
                >
                  {/* Content: Checkmark for completed/active, Number for pending */}
                  {isCompleted || isActive ? (
                    <Check className="w-4 h-4 text-white" />
                  ) : (
                    <span className="text-xs font-medium text-muted-foreground">
                      {index + 1}
                    </span>
                  )}
                </div>
                {/* Label - absolutely positioned below circle, doesn't affect alignment */}
                <span
                  className={`
                    absolute top-full left-1/2 -translate-x-1/2 mt-2 text-[10px] md:text-xs font-semibold uppercase tracking-wider transition-all duration-300 whitespace-nowrap
                    ${isActive ? 'text-primary' : isCompleted ? 'text-primary/70' : 'text-muted-foreground/50'}
                  `}
                >
                  {label}
                </span>
              </div>

              {/* Connecting line (not after last item) - directly connected to circle */}
              {!isLast && (
                <div className="relative w-16 md:w-24 lg:w-32 h-0.5">
                  {/* Background line */}
                  <div className="absolute inset-0 bg-muted-foreground/20 rounded-full" />
                  {/* Animated fill line */}
                  <div
                    className="absolute left-0 top-0 h-full bg-primary rounded-full transition-all duration-200 ease-out"
                    style={{
                      width: index < currentBeat
                        ? '100%'
                        : index === currentBeat
                          ? `${Math.min(100, (progress * totalBeats - index) * 100)}%`
                          : '0%'
                    }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProgressIndicator;
