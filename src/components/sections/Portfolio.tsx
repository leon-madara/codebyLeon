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
    <section id="portfolio" className="content-section" ref={sectionRef}>
      {/* LAYER 2: Abstract Orbs */}
      <div className="orbs-container">
        <div className="orb orb-purple"></div>
        <div className="orb orb-orange"></div>
        <div className="orb orb-blue"></div>
      </div>

      {/* LAYER 3: Frosted Overlay */}
      <div className="frosted-overlay"></div>

      {/* LAYER 4: Content */}
      <div className="section-content">
        <h2 className="section-headline">Our Work</h2>
        <p className="section-subheadline">
          See how we've helped Kenyan businesses look professional and attract better clients.
        </p>

        <div className="portfolio-filters" ref={filtersRef}>
          <div className="filter-slider" ref={sliderRef}></div>
          <button
            ref={el => el && buttonRefs.current.set('all', el)}
            className={`filter-btn ${activeFilter === 'all' ? 'active' : ''}`}
            onClick={() => handleFilterClick('all')}
          >
            All Projects
          </button>
          <button
            ref={el => el && buttonRefs.current.set('small-business', el)}
            className={`filter-btn ${activeFilter === 'small-business' ? 'active' : ''}`}
            onClick={() => handleFilterClick('small-business')}
          >
            Small Business
          </button>
          <button
            ref={el => el && buttonRefs.current.set('creative', el)}
            className={`filter-btn ${activeFilter === 'creative' ? 'active' : ''}`}
            onClick={() => handleFilterClick('creative')}
          >
            Creative Professional
          </button>
        </div>

        <div className="portfolio-grid">
          {filteredItems.map(item => (
            <div key={item.id} className="portfolio-item">
              <div className="portfolio-image-placeholder">
                <p>Project Image</p>
              </div>
              <h3>{item.name}</h3>
              <p className="portfolio-type">{item.type}</p>
              <p className="portfolio-results">Results summary will appear here</p>
            </div>
          ))}
        </div>

        <div className="section-cta">
          <a href="/get-started.html" className="btn-primary">Ready to Start Your Project?</a>
        </div>
      </div>
    </section>
  );
}
