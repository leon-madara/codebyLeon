import { Hero } from '../components/sections/Hero';
import { Portfolio } from '../components/sections/Portfolio';
import { About } from '../components/sections/About';
import { MultiCardScrollSection } from '../components/HorizontalScroll';
import { Blog } from '../components/sections/Blog';
import { FinalCTA } from '../components/sections/FinalCTA';

/**
 * HomePage component that renders all sections of the home page
 * This component is used for the "/" route
 */
export function HomePage() {
  return (
    <>
      <Hero />
      <Portfolio />
      <About />
      <MultiCardScrollSection />
      <Blog />
      <FinalCTA />
    </>
  );
}