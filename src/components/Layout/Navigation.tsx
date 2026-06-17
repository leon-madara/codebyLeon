import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ScrollSmoother } from 'gsap/ScrollSmoother';
import { Menu, X } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

const SECTION_NAV_CLEARANCE = 12;
const SECTION_SNAP_BUFFER = 4;
const MOBILE_MENU_ID = 'mobile-navigation-menu';

export function Navigation() {
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const isHomeRoute = location.pathname === '/';
  const [activeSection, setActiveSection] = useState<string>('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!isHomeRoute) {
      setActiveSection('');
      return;
    }

    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      return;
    }

    const sections = ['portfolio', 'about', 'services'];
    const observerOptions = {
      root: null,
      rootMargin: '-30% 0px -40% 0px',
      threshold: 0,
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    sections.forEach((sectionId) => {
      const el = document.getElementById(sectionId);
      if (el) observer.observe(el);
    });

    const handleScroll = () => {
      if (window.scrollY < 100) {
        setActiveSection('');
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isHomeRoute]);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname, location.hash]);

  useEffect(() => {
    if (!isMobileMenuOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isMobileMenuOpen]);

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

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const handleMobileSectionLinkClick = (sectionId: string) => (
    event: React.MouseEvent<HTMLAnchorElement>
  ) => {
    closeMobileMenu();
    handleSectionLinkClick(sectionId)(event);
  };

  const renderThemeToggle = (modifier: 'desktop' | 'mobile') => (
    <div className={`navigation__theme-toggle navigation__theme-toggle--${modifier}`}>
      {modifier === 'mobile' && (
        <span className="navigation__theme-label">
          Theme
        </span>
      )}
      <button
        type="button"
        className={`navigation__toggle-switch ${theme === 'dark' ? 'is-active' : ''}`}
        onClick={toggleTheme}
        aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
        aria-pressed={theme === 'dark'}
      >
        <span className="navigation__toggle-background" aria-hidden="true">
          <span className="navigation__scenery navigation__scenery--day">
            <span className="navigation__cloud navigation__cloud--1"></span>
            <span className="navigation__cloud navigation__cloud--2"></span>
            <span className="navigation__cloud navigation__cloud--3"></span>
            <span className="navigation__cloud navigation__cloud--4"></span>
            <span className="navigation__cloud navigation__cloud--5"></span>
          </span>
          <span className="navigation__scenery navigation__scenery--night">
            <span className="navigation__star navigation__star--1">✦</span>
            <span className="navigation__star navigation__star--2">★</span>
            <span className="navigation__star navigation__star--3">✦</span>
          </span>
        </span>
        <span className="navigation__toggle-knob" aria-hidden="true">
          <span className="navigation__crater navigation__crater--1"></span>
          <span className="navigation__crater navigation__crater--2"></span>
          <span className="navigation__crater navigation__crater--3"></span>
        </span>
      </button>
    </div>
  );

  return (
    <nav className="navigation" aria-label="Main navigation">
      <div className="navigation__container">
        <Link to="/#hero" className="navigation__logo" aria-label="Code by Leon home">
          <img src="/icons/main-logo.svg" alt="Code by Leon" className="navigation__logo-svg" />
        </Link>

        <ul className="navigation__links">
          <li>
            <a
              href={getSectionHref('portfolio')}
              onClick={handleSectionLinkClick('portfolio')}
              className={`navigation__link ${activeSection === 'portfolio' ? 'is-active' : ''}`}
            >
              PORTFOLIO
            </a>
          </li>
          <li>
            <a
              href={getSectionHref('about')}
              onClick={handleSectionLinkClick('about')}
              className={`navigation__link ${activeSection === 'about' ? 'is-active' : ''}`}
            >
              ABOUT
            </a>
          </li>
          <li>
            <a
              href={getSectionHref('services')}
              onClick={handleSectionLinkClick('services')}
              className={`navigation__link ${activeSection === 'services' ? 'is-active' : ''}`}
            >
              SERVICES
            </a>
          </li>
          <li>
            <Link
              to="/process"
              className={`navigation__link ${isActiveLink('/process') ? 'is-active' : ''}`}
            >
              PROCESS
            </Link>
          </li>
          <li>
            <Link
              to="/blog"
              state={{ preserveScroll: true }}
              className={`navigation__link ${isActiveLink('/blog') ? 'is-active' : ''}`}
            >
              BLOG
            </Link>
          </li>
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

        {renderThemeToggle('desktop')}

        <button
          type="button"
          className="navigation__menu-button"
          onClick={() => setIsMobileMenuOpen((isOpen) => !isOpen)}
          aria-label={isMobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={isMobileMenuOpen}
          aria-controls={MOBILE_MENU_ID}
        >
          {isMobileMenuOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
        </button>
      </div>

      {isMobileMenuOpen && (
        <div
          id={MOBILE_MENU_ID}
          className="navigation__mobile-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile navigation"
        >
          <div className="navigation__mobile-panel">
            <ul className="navigation__mobile-links">
              <li>
                <a
                  href={getSectionHref('portfolio')}
                  onClick={handleMobileSectionLinkClick('portfolio')}
                  className={`navigation__link navigation__mobile-link ${activeSection === 'portfolio' ? 'is-active' : ''}`}
                >
                  PORTFOLIO
                </a>
              </li>
              <li>
                <a
                  href={getSectionHref('about')}
                  onClick={handleMobileSectionLinkClick('about')}
                  className={`navigation__link navigation__mobile-link ${activeSection === 'about' ? 'is-active' : ''}`}
                >
                  ABOUT
                </a>
              </li>
              <li>
                <a
                  href={getSectionHref('services')}
                  onClick={handleMobileSectionLinkClick('services')}
                  className={`navigation__link navigation__mobile-link ${activeSection === 'services' ? 'is-active' : ''}`}
                >
                  SERVICES
                </a>
              </li>
              <li>
                <Link
                  to="/process"
                  onClick={closeMobileMenu}
                  className={`navigation__link navigation__mobile-link ${isActiveLink('/process') ? 'is-active' : ''}`}
                >
                  PROCESS
                </Link>
              </li>
              <li>
                <Link
                  to="/blog"
                  state={{ preserveScroll: true }}
                  onClick={closeMobileMenu}
                  className={`navigation__link navigation__mobile-link ${isActiveLink('/blog') ? 'is-active' : ''}`}
                >
                  BLOG
                </Link>
              </li>
            </ul>

            {renderThemeToggle('mobile')}
          </div>
        </div>
      )}
    </nav>
  );
}
