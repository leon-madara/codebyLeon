import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';

export function Navigation() {
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();

  // Helper function to determine if a link is active
  const isActiveLink = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="navigation">
      <div className="navigation__container">
        <Link to="/" className="navigation__logo">
          <img src="/icons/main-logo.svg" alt="Code by Leon" className="navigation__logo-svg" />
        </Link>

        <ul className="navigation__links">
          <li><a href="#portfolio" className={`navigation__link ${location.pathname === '/' ? 'is-active' : ''}`}>PORTFOLIO</a></li>
          <li><a href="#about" className={`navigation__link ${location.pathname === '/' ? 'is-active' : ''}`}>ABOUT</a></li>
          <li><a href="#services" className={`navigation__link ${location.pathname === '/' ? 'is-active' : ''}`}>SERVICES</a></li>
          <li><Link to="/blog" state={{ preserveScroll: true }} className={`navigation__link ${isActiveLink('/blog') ? 'is-active' : ''}`}>BLOG</Link></li>
        </ul>

        <a href="/get-started.html" className="navigation__cta">GET IN TOUCH</a>

        {/* Theme Toggle */}
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
