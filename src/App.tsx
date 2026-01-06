import { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { Navigation } from './components/Layout/Navigation';
import { MouseTrail } from './components/MouseTrail';
import { ScrollToTop } from './components/ScrollToTop';
import { HomePage } from './pages/HomePage';
import RouteLoadingFallback from './components/RouteLoadingFallback';

// Lazy load blog pages for code splitting
const BlogListingPage = lazy(() => import('./pages/BlogListingPage').then(module => ({ default: module.BlogListingPage })));
const BlogPostPage = lazy(() => import('./pages/BlogPostPage'));

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <MouseTrail />
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
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
