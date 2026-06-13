import { Link, useLocation } from 'react-router-dom';
import { ScrollSmoother } from 'gsap/ScrollSmoother';
import { useTheme } from '../../contexts/ThemeContext';

const SECTION_NAV_CLEARANCE = 12;
const SECTION_SNAP_BUFFER = 4;

export function Navigation() {
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const isHomeRoute = location.pathname === '/';

  const isActiveLink = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  const getSectionHref = (sectionId: string) => {
    if (isHomeRoute) {
      return `#${sectionId}`;
    }
    return `/#${sectionId}`;
  };

  const handleSectionLinkClick = (sectionId: string) => (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (!isHomeRoute) return;
    event.preventDefault();

    const target = document.getElementById(sectionId);
    if (!target) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const smoother = ScrollSmoother.get();
    window.history.replaceState(window.history.state, '', `#${sectionId}`);

    if (smoother) {
      const navigation = document.querySelector<HTMLElement>('.navigation');
      const navigationHeight = navigation?.getBoundingClientRect().height ?? 0;
      const sectionOffset = Math.ceil(
        navigationHeight + SECTION_NAV_CLEARANCE + SECTION_SNAP_BUFFER,
      );
      smoother.scrollTo(target, false, `top top+=${sectionOffset}`);
    } else {
      target.scrollIntoView({
        behavior: prefersReducedMotion ? 'auto' : 'smooth',
        block: 'start',
      });
    }

  };

  return (
    <nav className="navigation" aria-label="Main navigation">
      <div className="navigation__container">
        <Link to="/#hero" className="navigation__logo" aria-label="Code by Leon home">
          <img src="/icons/main-logo.svg" alt="Code by Leon" className="navigation__logo-svg" />
        </Link>

        <ul className="navigation__links">
          <li><a href={getSectionHref('portfolio')} onClick={handleSectionLinkClick('portfolio')} className={`navigation__link ${location.pathname === '/' ? 'is-active' : ''}`}>PORTFOLIO</a></li>
          <li><a href={getSectionHref('about')} onClick={handleSectionLinkClick('about')} className={`navigation__link ${location.pathname === '/' ? 'is-active' : ''}`}>ABOUT</a></li>
          <li><a href={getSectionHref('services')} onClick={handleSectionLinkClick('services')} className={`navigation__link ${location.pathname === '/' ? 'is-active' : ''}`}>SERVICES</a></li>
          <li><Link to="/process" className={`navigation__link ${isActiveLink('/process') ? 'is-active' : ''}`}>PROCESS</Link></li>
          <li><Link to="/blog" state={{ preserveScroll: true }} className={`navigation__link ${isActiveLink('/blog') ? 'is-active' : ''}`}>BLOG</Link></li>
        </ul>

        <a
          href="/get-started.html"
          className="navigation__cta"
          aria-label="Build Your Quote - Configure your project and see pricing"
        >
          <span className="navigation__cta-text">BUILD YOUR QUOTE</span>
          <span className="navigation__cta-tooltip" role="tooltip" aria-hidden="true">
            Configure your project & see pricing
          </span>
        </a>

        <div className="navigation__theme-toggle">
          <div
            className={`navigation__toggle-switch ${theme === 'dark' ? 'is-active' : ''}`}
            onClick={toggleTheme}
          >
            <div className="navigation__toggle-background">
              <div className="navigation__scenery navigation__scenery--day">
                <div className="navigation__cloud navigation__cloud--1"></div>
                <div className="navigation__cloud navigation__cloud--2"></div>
                <div className="navigation__cloud navigation__cloud--3"></div>
                <div className="navigation__cloud navigation__cloud--4"></div>
                <div className="navigation__cloud navigation__cloud--5"></div>
              </div>
              <div className="navigation__scenery navigation__scenery--night">
                <div className="navigation__star navigation__star--1">✦</div>
                <div className="navigation__star navigation__star--2">★</div>
                <div className="navigation__star navigation__star--3">✦</div>
              </div>
            </div>
            <div className="navigation__toggle-knob">
              <div className="navigation__crater navigation__crater--1"></div>
              <div className="navigation__crater navigation__crater--2"></div>
              <div className="navigation__crater navigation__crater--3"></div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
