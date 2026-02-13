import { Check } from 'lucide-react';

interface ProgressIndicatorProps {
  currentBeat: number;
  totalBeats: number;
  progress: number;
  labels: string[];
  className?: string;
}

const clamp = (value: number, min = 0, max = 1) => Math.min(max, Math.max(min, value));

const ProgressIndicator = ({ currentBeat, totalBeats, progress, labels, className = '' }: ProgressIndicatorProps) => {
  const clampedProgress = clamp(progress);
  const normalizedProgress = clampedProgress * totalBeats;

  return (
    <div className={`hs-progress ${className}`.trim()}>
      <div className="hs-progress__row">
        {labels.map((label, index) => {
          const isLast = index === labels.length - 1;
          const isCompleted = normalizedProgress >= index + 1;
          const isActive = !isCompleted && normalizedProgress >= index;
          const lineFillPercent = clamp(normalizedProgress - index) * 100;

          return (
            <div key={label} className="hs-progress__item">
              <div className="hs-progress__node-wrap">
                <div
                  className={`hs-progress__node ${isCompleted || isActive ? 'is-complete' : ''}`.trim()}
                  aria-hidden="true"
                >
                  {isCompleted || isActive ? (
                    <Check className="hs-progress__check" />
                  ) : (
                    <span className="hs-progress__number">{index + 1}</span>
                  )}
                </div>
                <span
                  className={`hs-progress__label ${isActive ? 'is-active' : ''} ${isCompleted ? 'is-complete' : ''}`.trim()}
                >
                  {label}
                </span>
              </div>

              {!isLast && (
                <div className="hs-progress__line" aria-hidden="true">
                  <div className="hs-progress__line-fill" style={{ width: `${lineFillPercent}%` }} />
                </div>
              )}
            </div>
          );
        })}
      </div>

      <span className="sr-only">
        Step {Math.min(totalBeats, currentBeat + 1)} of {totalBeats}
      </span>
    </div>
  );
};

export default ProgressIndicator;
