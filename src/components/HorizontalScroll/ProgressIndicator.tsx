import { Check } from 'lucide-react';
import React from 'react';

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
      <div className="hs-progress__row" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
        {labels.map((label, index) => {
          const isLast = index === labels.length - 1;
          const isCompleted = normalizedProgress >= index + 1;
          const isActive = !isCompleted && normalizedProgress >= index;
          const lineFillPercent = clamp(normalizedProgress - index) * 100;

          // Colors
          const nodeBg = (isCompleted || isActive) ? 'var(--color-primary, hsl(var(--primary)))' : 'transparent';
          const nodeBorder = (isCompleted || isActive) ? 'var(--color-primary, hsl(var(--primary)))' : 'hsl(var(--muted-foreground) / 0.4)';
          const textColor = (isCompleted || isActive) ? 'var(--color-primary, hsl(var(--primary)))' : 'hsl(var(--muted-foreground) / 0.65)';

          return (
            <React.Fragment key={label}>
              <div className="hs-progress__item" style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
                <div className="hs-progress__node-wrap" style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  
                  {/* Node */}
                  <div
                    className={`hs-progress__node ${isCompleted || isActive ? 'is-complete' : ''}`.trim()}
                    aria-hidden="true"
                    style={{
                      width: '1.8rem',
                      height: '1.8rem',
                      borderRadius: '9999px',
                      border: `2px solid ${nodeBorder}`,
                      background: nodeBg,
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.22s ease',
                    }}
                  >
                    {isCompleted || isActive ? (
                      <Check className="hs-progress__check" style={{ width: '1rem', height: '1rem', color: 'hsl(var(--background))' }} strokeWidth={3} />
                    ) : (
                      <span className="hs-progress__number" style={{ fontSize: '0.75rem', fontWeight: 600, color: 'hsl(var(--muted-foreground))' }}>
                        {index + 1}
                      </span>
                    )}
                  </div>

                  {/* Label */}
                  <span
                    className={`hs-progress__label ${isActive ? 'is-active' : ''} ${isCompleted ? 'is-complete' : ''}`.trim()}
                    style={{
                      position: 'absolute',
                      top: 'calc(100% + 0.75rem)',
                      whiteSpace: 'nowrap',
                      textTransform: 'uppercase',
                      letterSpacing: '0.08em',
                      fontSize: '0.65rem',
                      fontWeight: 700,
                      color: textColor,
                      transition: 'color 0.22s ease',
                    }}
                  >
                    {label}
                  </span>
                </div>
              </div>

              {/* Connecting Line */}
              {!isLast && (
                <div className="hs-progress__line" aria-hidden="true" style={{
                  width: 'clamp(3rem, 12vw, 10rem)',
                  height: '2px',
                  margin: '0 0.5rem',
                  borderRadius: '9999px',
                  background: 'hsl(var(--muted-foreground) / 0.2)',
                  overflow: 'hidden',
                  position: 'relative'
                }}>
                  <div className="hs-progress__line-fill" style={{ 
                    height: '100%', 
                    width: `${lineFillPercent}%`,
                    background: 'var(--color-primary, hsl(var(--primary)))',
                    transition: 'width 0.2s linear'
                  }} />
                </div>
              )}
            </React.Fragment>
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
