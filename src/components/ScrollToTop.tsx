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
    // Skip scrolling for direct navigation to avoid disrupting horizontal scroll
    if (location.state?.scrollToTop !== false && location.state?.preserveScroll !== true) {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }
  }, [location.pathname, location.search]);

  return null;
}