interface ServiceTabsProps {
  cards: { id: string; title: string }[];
  activeCard: number;
  onCardClick: (index: number) => void;
  className?: string;
}

const TAB_COLORS = [
  'hsl(145, 40%, 35%)',
  'hsl(195, 65%, 38%)',
  'hsl(155, 58%, 35%)',
];

const ServiceTabs = ({ cards, activeCard, onCardClick, className = '' }: ServiceTabsProps) => {
  return (
    <div className={`hs-tabs ${className}`.trim()}>
      <div className="hs-tabs__inner">
        {cards.map((card, index) => {
          const isActive = activeCard === index;
          const bgColor = TAB_COLORS[index] ?? TAB_COLORS[TAB_COLORS.length - 1];

          return (
            <button
              key={card.id}
              onClick={() => onCardClick(index)}
              className={`hs-tabs__button ${isActive ? 'is-active' : ''}`.trim()}
              type="button"
            >
              {isActive && (
                <span
                  className="hs-tabs__active-bg"
                  style={{ '--hs-tab-bg': bgColor } as React.CSSProperties}
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
