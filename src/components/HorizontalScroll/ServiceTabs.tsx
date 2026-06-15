import React, { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

interface ServiceTabsProps {
  cards: { id: string; title: string }[];
  activeCard: number;
  onCardClick: (index: number) => void;
  className?: string;
}

const ServiceTabs = ({ cards, activeCard, onCardClick, className = '' }: ServiceTabsProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const activeBgRef = useRef<HTMLSpanElement>(null);
  const buttonsRef = useRef<(HTMLButtonElement | null)[]>([]);
  const isFirstRender = useRef(true);

  useGSAP(() => {
    const updateActiveBg = (immediate = false) => {
      const activeButton = buttonsRef.current[activeCard];
      const activeBg = activeBgRef.current;
      if (activeButton && activeBg) {
        const container = activeButton.parentElement;
        if (container) {
          const containerRect = container.getBoundingClientRect();
          const btnRect = activeButton.getBoundingClientRect();
          const left = btnRect.left - containerRect.left;
          const width = btnRect.width;

          if (immediate) {
            gsap.set(activeBg, {
              x: left,
              width: width,
            });
          } else {
            gsap.to(activeBg, {
              x: left,
              width: width,
              duration: 0.35,
              ease: 'power2.out',
              overwrite: 'auto',
            });
          }
        }
      }
    };

    updateActiveBg(isFirstRender.current);
    isFirstRender.current = false;

    const handleResize = () => updateActiveBg(true);
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, { dependencies: [activeCard], scope: containerRef });

  return (
    <div className={`hs-tabs ${className}`.trim()} ref={containerRef}>
      <div className="hs-tabs__inner">
        {/* Single sliding active indicator background */}
        <span
          ref={activeBgRef}
          className="hs-tabs__active-bg"
          aria-hidden="true"
          style={{ width: 0 }}
        />
        {cards.map((card, index) => {
          const isActive = activeCard === index;

          return (
            <button
              key={card.id}
              ref={(el) => {
                buttonsRef.current[index] = el;
              }}
              onClick={() => onCardClick(index)}
              className={`hs-tabs__button ${isActive ? 'is-active' : ''}`.trim()}
              type="button"
            >
              <span className="hs-tabs__label">{card.title}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ServiceTabs;
