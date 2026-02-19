import { Suspense, lazy, useRef, type ReactNode } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollSmoother } from 'gsap/ScrollSmoother';
import { ThemeProvider } from './contexts/ThemeContext';
import { Navigation } from './components/Layout/Navigation';
import { TorchEffect } from './components/TorchEffect';
import { ScrollToTop } from './components/ScrollToTop';
import { HomePage } from './pages/HomePage';
import RouteLoadingFallback from './components/RouteLoadingFallback';
import { BurningReveal } from './components/BurningReveal';
import { isVisualTestMode } from './utils/runtimeFlags';

gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

type SmoothScrollShellProps = {
  visualTestMode: boolean;
  children: ReactNode;
};

function SmoothScrollShell({ visualTestMode, children }: SmoothScrollShellProps) {
  const smoothWrapperRef = useRef<HTMLDivElement>(null);
  const smoothContentRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  useGSAP(() => {
    if (visualTestMode) return;
    const isHome = location.pathname === '/';
    if (!isHome) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isTouchOrSmall = window.matchMedia('(pointer: coarse)').matches || window.innerWidth <= 768;

    if (prefersReduced || isTouchOrSmall) return;
    if (!smoothWrapperRef.current || !smoothContentRef.current) return;

    const smoother = ScrollSmoother.create({
      wrapper: smoothWrapperRef.current,
      content: smoothContentRef.current,
      smooth: 1,
      effects: false,
      normalizeScroll: true,
      ignoreMobileResize: true
    });

    if (document.fonts?.ready) {
      document.fonts.ready.then(() => ScrollTrigger.refresh()).catch(() => { });
    }

    return () => {
      smoother?.kill();
    };
  }, { dependencies: [visualTestMode, location.pathname] });

  return (
    <div id="smooth-wrapper" ref={smoothWrapperRef}>
      <div id="smooth-content" ref={smoothContentRef}>
        {children}
      </div>
    </div>
  );
}

// Lazy load blog pages for code splitting
const BlogListingPage = lazy(() => import('./pages/BlogListingPage').then(module => ({ default: module.BlogListingPage })));
const BlogPostPage = lazy(() => import('./pages/BlogPostPage'));

function App() {
  const visualTestMode = isVisualTestMode();

  return (
    <ThemeProvider>
      <BrowserRouter>
        <SmoothScrollShell visualTestMode={visualTestMode}>
          {!visualTestMode && <TorchEffect />}
          <BurningReveal />
          <Navigation />
          <ScrollToTop />

          <Suspense fallback={<RouteLoadingFallback message="Loading page..." />}>
            <Routes>
              {/* Home page route */}
              <Route path="/" element={<HomePage />} />

              {/* Blog listing page route */}
              <Route path="/blog" element={<BlogListingPage />} />

              {/* Individual blog post route */}
              <Route path="/blog/:slug" element={<BlogPostPage />} />

              {/* Catch-all route for /blog/* that redirects to /blog */}
              <Route path="/blog/*" element={<Navigate to="/blog" replace />} />
            </Routes>
          </Suspense>
        </SmoothScrollShell>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
