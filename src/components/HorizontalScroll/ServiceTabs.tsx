import React from 'react';

interface ServiceTabsProps {
  cards: { id: string; title: string }[];
  activeCard: number;
  onCardClick: (index: number) => void;
  className?: string;
}

const ServiceTabs = ({ cards, activeCard, onCardClick, className = '' }: ServiceTabsProps) => {
  return (
    <div className={`hs-tabs ${className}`.trim()}>
      <div className="hs-tabs__inner" style={{ 
        background: 'hsl(220 18% 7%)', 
        padding: '0.35rem', 
        borderRadius: '999px',
        border: '1px solid hsl(var(--border) / 0.2)',
        display: 'inline-flex',
        margin: '0 auto'
      }}>
        {cards.map((card, index) => {
          const isActive = activeCard === index;

          return (
            <button
              key={card.id}
              onClick={() => onCardClick(index)}
              className={`hs-tabs__button ${isActive ? 'is-active' : ''}`.trim()}
              type="button"
              style={{
                position: 'relative',
                border: 0,
                background: 'transparent',
                color: isActive ? 'hsl(var(--background))' : 'hsl(var(--muted-foreground))',
                padding: '0.6rem 1.5rem',
                borderRadius: '999px',
                fontWeight: 700,
                fontSize: '0.85rem',
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                transition: 'color 0.24s ease',
                zIndex: 1
              }}
            >
              {isActive && (
                <span
                  className="hs-tabs__active-bg"
                  style={{ 
                    position: 'absolute',
                    inset: 0,
                    borderRadius: 'inherit',
                    background: 'var(--color-primary, hsl(var(--primary)))',
                    zIndex: -1
                  }}
                  aria-hidden="true"
                />
              )}
              <span className="hs-tabs__label">{card.title}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ServiceTabs;
