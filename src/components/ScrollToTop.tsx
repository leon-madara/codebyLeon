import { useEffect, useLayoutEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { ScrollSmoother } from 'gsap/ScrollSmoother';

// Prevent the browser from restoring scroll position on client-side navigation.
// This must run once before any navigation so the browser doesn't fight us.
if (typeof window !== 'undefined') {
  window.history.scrollRestoration = 'manual';
}

/**
 * ScrollToTop component that scrolls to the top of the page on route changes,
 * or scrolls to the target element if a hash is present in the URL.
 *
 * Uses useLayoutEffect (fires before paint) to prevent the "slides up from bottom"
 * artifact caused by the browser briefly rendering at the previous scroll offset.
 */
export function ScrollToTop() {
  const location = useLocation();

  // useLayoutEffect fires synchronously after DOM mutations but before the browser paints,
  // so the scroll position is corrected before the user ever sees the new page.
  useLayoutEffect(() => {
    if (location.hash) return; // hash scrolling handled in useEffect below

    if (location.state?.scrollToTop !== false && location.state?.preserveScroll !== true) {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    }
  }, [location.pathname, location.search]);

  useEffect(() => {
    if (!location.hash) return;

    const id = location.hash.replace('#', '');
    const scrollTarget = () => {
      const element = document.getElementById(id);
      if (element) {
        const smoother = ScrollSmoother.get();
        if (smoother) {
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
  }, [location.pathname, location.search, location.hash]);

  return null;
}
