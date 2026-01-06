import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * ScrollToTop component that scrolls to the top of the page on route changes
 * while preserving scroll position for browser back/forward navigation
 */
export function ScrollToTop() {
  const location = useLocation();

  useEffect(() => {
    // Only scroll to top for new navigation (not browser back/forward)
    // Browser back/forward navigation is handled by the browser's scroll restoration
    if (location.state?.scrollToTop !== false) {
      window.scrollTo(0, 0);
    }
  }, [location.pathname, location.search]);

  return null;
}