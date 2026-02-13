interface WaveDividerProps {
  position: 'top' | 'bottom';
  color?: string;
  className?: string;
}

const WaveDivider = ({ position, color = 'hsl(var(--sage))', className = '' }: WaveDividerProps) => {
  const isTop = position === 'top';

  return (
    <div
      className={`hs-wave-divider ${isTop ? 'hs-wave-divider--top' : 'hs-wave-divider--bottom'} ${className}`.trim()}
      style={{ '--hs-wave-transform': isTop ? 'rotate(180deg)' : 'none' } as React.CSSProperties}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 1440 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="hs-wave-divider__svg"
        preserveAspectRatio="none"
      >
        <path
          d="M0,60 C150,100 350,20 600,60 C850,100 1050,20 1200,60 C1350,100 1440,80 1440,60 L1440,120 L0,120 Z"
          fill={color}
          fillOpacity="0.4"
        />
        <path
          d="M0,80 C200,40 400,100 720,80 C1040,60 1240,100 1440,80 L1440,120 L0,120 Z"
          fill={color}
          fillOpacity="0.6"
        />
        <path
          d="M0,100 C180,80 360,110 540,90 C720,70 900,110 1080,90 C1260,70 1350,100 1440,100 L1440,120 L0,120 Z"
          fill={color}
        />
      </svg>
    </div>
  );
};

export default WaveDivider;
