interface ServiceTabsProps {
  cards: { id: string; title: string }[];
  activeCard: number;
  onCardClick: (index: number) => void;
}

const ServiceTabs = ({ cards, activeCard, onCardClick }: ServiceTabsProps) => {
  return (
    <div className="sticky top-16 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-border/50">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex items-center justify-center gap-1 py-3">
          {cards.map((card, index) => (
            <button
              key={card.id}
              onClick={() => onCardClick(index)}
              className={`
                relative px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300
                ${activeCard === index
                  ? 'text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground'
                }
              `}
            >
              {/* Active background */}
              {activeCard === index && (
                <span
                  className={`
                    absolute inset-0 rounded-lg transition-all duration-300
                    ${index === 0 ? 'bg-forest-mid' : ''}
                    ${index === 1 ? 'bg-cyan-mid' : ''}
                    ${index === 2 ? 'bg-emerald-mid' : ''}
                  `}
                  style={{
                    backgroundColor: index === 0 ? 'hsl(145, 40%, 35%)' : 
                                     index === 1 ? 'hsl(195, 65%, 38%)' : 
                                     'hsl(155, 58%, 35%)'
                  }}
                />
              )}
              <span className="relative z-10">{card.title}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ServiceTabs;
