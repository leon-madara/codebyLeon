import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { ScrollSmoother } from 'gsap/ScrollSmoother';

/**
 * ScrollToTop component that scrolls to the top of the page on route changes,
 * or scrolls to the target element if a hash is present in the URL.
 */
export function ScrollToTop() {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace('#', '');
      const scrollTarget = () => {
        const element = document.getElementById(id);
        if (element) {
          const smoother = ScrollSmoother.get();
          if (smoother) {
            // Scroll to the element using ScrollSmoother instantly
            smoother.scrollTo(element, false, 'top top');
          } else {
            element.scrollIntoView({ behavior: 'instant', block: 'start' });
          }
          return true;
        }
        return false;
      };

      if (!scrollTarget()) {
        // Wait a tiny bit for DOM to render if not immediately found
        const timer = setTimeout(() => {
          scrollTarget();
        }, 100);
        return () => clearTimeout(timer);
      }
      return;
    }

    // Only scroll to top for new navigation (not browser back/forward)
    if (location.state?.scrollToTop !== false && location.state?.preserveScroll !== true) {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }
  }, [location.pathname, location.search, location.hash]);

  return null;
}
