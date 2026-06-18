import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ScrollSmoother } from 'gsap/ScrollSmoother';
import { Menu, X, Mail, MessageCircle, Linkedin } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

const SECTION_NAV_CLEARANCE = 12;
const SECTION_SNAP_BUFFER = 4;

export function Navigation() {
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const isHomeRoute = location.pathname === '/';
  const [activeSection, setActiveSection] = useState<string>('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  const handleMobileLinkClick = (handler?: (e: React.MouseEvent<HTMLAnchorElement>) => void) => (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (handler) handler(e);
    setIsMobileMenuOpen(false);
  };

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

  const renderThemeToggle = () => (
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
  );

  return (
    <>
    <nav className={`navigation ${isMobileMenuOpen ? 'is-menu-open' : ''}`} aria-label="Main navigation">
      <div className="navigation__container">
        <Link to="/#hero" className="navigation__logo" aria-label="Code by Leon home" onClick={() => setIsMobileMenuOpen(false)}>
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

        <div className="navigation__theme-toggle desktop-only">
          {renderThemeToggle()}
        </div>

        <button 
          className="navigation__hamburger mobile-only" 
          onClick={() => setIsMobileMenuOpen(true)}
          aria-label="Open menu"
        >
          <Menu size={28} />
        </button>
      </div>
    </nav>

    {/* Mobile Menu Overlay */}
    <div className={`mobile-menu-overlay ${isMobileMenuOpen ? 'is-open' : ''}`}>
      <div className="mobile-menu-overlay__header">
        <Link to="/#hero" className="navigation__logo" onClick={() => setIsMobileMenuOpen(false)}>
          <img src="/icons/main-logo.svg" alt="Code by Leon" className="navigation__logo-svg" />
        </Link>
        <a href="/get-started.html" className="navigation__cta">
          <span className="navigation__cta-text">BUILD YOUR QUOTE</span>
        </a>
        <button 
          className="mobile-menu-overlay__close" 
          onClick={() => setIsMobileMenuOpen(false)}
          aria-label="Close menu"
        >
          <X size={28} />
        </button>
      </div>

      <div className="mobile-menu-overlay__content">
        <div className="mobile-menu-overlay__top-space">
          <div className="mobile-menu-overlay__availability">
            <span className="availability-dot"></span>
            <span className="availability-text">Available for new projects</span>
          </div>
        </div>

        <ul className="mobile-menu-overlay__links">
          <li>
            <Link to="/#hero" onClick={handleMobileLinkClick()} className="mobile-menu-overlay__link">Home</Link>
          </li>
          <li>
            <a href={getSectionHref('portfolio')} onClick={handleMobileLinkClick(handleSectionLinkClick('portfolio'))} className="mobile-menu-overlay__link">Portfolio</a>
          </li>
          <li>
            <a href={getSectionHref('about')} onClick={handleMobileLinkClick(handleSectionLinkClick('about'))} className="mobile-menu-overlay__link">About</a>
          </li>
          <li>
            <a href={getSectionHref('services')} onClick={handleMobileLinkClick(handleSectionLinkClick('services'))} className="mobile-menu-overlay__link">Services</a>
          </li>
          <li>
            <Link to="/process" onClick={handleMobileLinkClick()} className="mobile-menu-overlay__link">Process</Link>
          </li>
          <li>
            <Link to="/blog" onClick={handleMobileLinkClick()} className="mobile-menu-overlay__link">Blog</Link>
          </li>
        </ul>

        <div className="mobile-menu-overlay__quick-connect">
          <a href="mailto:hello@codebyleon.com" aria-label="Email" className="quick-connect-link email-link">
            <Mail size={24} />
          </a>
          <a href="https://wa.me/254700000000" aria-label="WhatsApp" className="quick-connect-link whatsapp-link" target="_blank" rel="noopener noreferrer">
            <MessageCircle size={24} />
          </a>
          <a href="https://linkedin.com/company/codebyleon" aria-label="LinkedIn" className="quick-connect-link linkedin-link" target="_blank" rel="noopener noreferrer">
            <Linkedin size={24} />
          </a>
        </div>

        <div className="mobile-menu-overlay__footer">
          <span className="theme-label">THEME</span>
          {renderThemeToggle()}
        </div>
      </div>
    </div>
    </>
  );
}
