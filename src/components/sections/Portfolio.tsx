import { useState, useRef, useEffect } from 'react';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';

type FilterType = 'all' | 'small-business' | 'creative';

export function Portfolio() {
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const sectionRef = useRef<HTMLElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);
  const filtersRef = useRef<HTMLDivElement>(null);
  const buttonRefs = useRef<Map<FilterType, HTMLButtonElement>>(new Map());

  // Scroll animation
  useScrollAnimation(sectionRef, {
    trigger: sectionRef.current || '',
    start: 'top 80%',
    animateHeadline: true,
    animateSubheadline: true,
    animateFilters: true,
    animateItems: true,
    headlineSelector: '.portfolio__title',
    subheadlineSelector: '.portfolio__subtitle',
    filtersSelector: '.portfolio__filters',
    itemsSelector: '.portfolio__item',
  });

  const portfolioItems = [
    { id: 1, category: 'small-business', name: 'Client Name', type: 'Small Service Business' },
    { id: 2, category: 'creative', name: 'Client Name', type: 'Creative Professional' },
    { id: 3, category: 'small-business', name: 'Client Name', type: 'Small Service Business' },
  ];

  const filteredItems = activeFilter === 'all'
    ? portfolioItems
    : portfolioItems.filter(item => item.category === activeFilter);

  const updateSliderPosition = (filter: FilterType) => {
    const button = buttonRefs.current.get(filter);
    const slider = sliderRef.current;
    const filtersContainer = filtersRef.current;

    if (!button || !slider || !filtersContainer) return;

    const filtersRect = filtersContainer.getBoundingClientRect();
    const buttonRect = button.getBoundingClientRect();

    const left = buttonRect.left - filtersRect.left;
    const width = buttonRect.width;

    slider.style.width = `${width}px`;
    slider.style.left = `${left}px`;
  };

  useEffect(() => {
    setTimeout(() => updateSliderPosition(activeFilter), 100);
  }, [activeFilter]);

  useEffect(() => {
    const handleResize = () => updateSliderPosition(activeFilter);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [activeFilter]);

  const handleFilterClick = (filter: FilterType) => {
    setActiveFilter(filter);
  };

  return (
    <section id="portfolio" className="portfolio" ref={sectionRef}>
      {/* LAYER 2: Abstract Orbs */}
      <div className="portfolio__orbs">
        <div className="portfolio__orb portfolio__orb--purple"></div>
        <div className="portfolio__orb portfolio__orb--orange"></div>
        <div className="portfolio__orb portfolio__orb--blue"></div>
      </div>

      {/* LAYER 3: Frosted Overlay */}
      <div className="portfolio__overlay"></div>

      {/* LAYER 4: Content */}
      <div className="portfolio__container">
        <h2 className="portfolio__title">Our Work</h2>
        <p className="portfolio__subtitle">
          See how we've helped Kenyan businesses look professional and attract better clients.
        </p>

        <div className="portfolio__filters" ref={filtersRef}>
          <div className="portfolio__filter-slider" ref={sliderRef}></div>
          <button
            ref={el => el && buttonRefs.current.set('all', el)}
            className={`portfolio__filter-btn ${activeFilter === 'all' ? 'is-active' : ''}`}
            onClick={() => handleFilterClick('all')}
          >
            All Projects
          </button>
          <button
            ref={el => el && buttonRefs.current.set('small-business', el)}
            className={`portfolio__filter-btn ${activeFilter === 'small-business' ? 'is-active' : ''}`}
            onClick={() => handleFilterClick('small-business')}
          >
            Small Business
          </button>
          <button
            ref={el => el && buttonRefs.current.set('creative', el)}
            className={`portfolio__filter-btn ${activeFilter === 'creative' ? 'is-active' : ''}`}
            onClick={() => handleFilterClick('creative')}
          >
            Creative Professional
          </button>
        </div>

        <div className="portfolio__grid">
          {filteredItems.map(item => (
            <div key={item.id} className="portfolio__item">
              <div className="portfolio__image">
                <p>Project Image</p>
              </div>
              <h3 className="portfolio__item-title">{item.name}</h3>
              <p className="portfolio__item-type">{item.type}</p>
              <p className="portfolio__item-description">Results summary will appear here</p>
            </div>
          ))}
        </div>

        <div className="portfolio__cta">
          <a href="/get-started.html" className="btn-primary">Ready to Start Your Project?</a>
        </div>
      </div>
    </section>
  );
}
