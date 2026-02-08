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
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="logo">
          <img src="/icons/main-logo.svg" alt="Code by Leon" className="logo-svg" />
        </Link>

        <ul className="nav-links">
          <li><a href="#portfolio" className={location.pathname === '/' ? 'active' : ''}>PORTFOLIO</a></li>
          <li><a href="#about" className={location.pathname === '/' ? 'active' : ''}>ABOUT</a></li>
          <li><a href="#services" className={location.pathname === '/' ? 'active' : ''}>SERVICES</a></li>
          <li><Link to="/blog" state={{ preserveScroll: true }} className={isActiveLink('/blog') ? 'active' : ''}>BLOG</Link></li>
        </ul>

        <a href="/get-started.html" className="cta-button">GET IN TOUCH</a>

        {/* Theme Toggle */}
        <div className="theme-toggle-wrapper">
          <div
            className={`toggle-switch ${theme === 'dark' ? 'active' : ''}`}
            onClick={toggleTheme}
          >
            <div className="toggle-background">
              <div className="scenery day-scenery">
                <div className="cloud cloud-1"></div>
                <div className="cloud cloud-2"></div>
                <div className="cloud cloud-3"></div>
                <div className="cloud cloud-4"></div>
                <div className="cloud cloud-5"></div>
              </div>
              <div className="scenery night-scenery">
                <div className="star star-1">✦</div>
                <div className="star star-2">★</div>
                <div className="star star-3">✦</div>
              </div>
            </div>
            <div className="toggle-knob">
              <div className="crater crater-1"></div>
              <div className="crater crater-2"></div>
              <div className="crater crater-3"></div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
