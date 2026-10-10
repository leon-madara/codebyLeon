import { useIsMobile } from '../hooks/use-mobile';
import PortfolioCarousel from '../components/sections/PortfolioCarousel';
import PortfolioCarouselMobile from '../components/sections/PortfolioCarouselMobile';
import { GlassBallCursor } from '../components/cursor/GlassBallCursor';
import { FinalCTA } from '../components/sections/FinalCTA';
import { usePageSeo } from '../utils/seo';

export function OurWorkPage() {
  const isMobile = useIsMobile();

  usePageSeo({
    title: 'Our Work | Production Web Systems & Case Studies | CodeByLeon',
    description: 'Explore recent client web platforms, carrier intake wizards, and custom dispatch software engineered by CodeByLeon in Nairobi, Kenya.',
    path: '/work',
  });

  return (
    <main className="our-work-page">
      {isMobile ? <PortfolioCarouselMobile /> : <PortfolioCarousel />}
      <GlassBallCursor />
      <FinalCTA />
    </main>
  );
}

export default OurWorkPage;
