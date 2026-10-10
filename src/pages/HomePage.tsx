import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { Hero, HeroHandle } from '../components/sections/Hero';
import { RealityCheck } from '../components/sections/RealityCheck';
import { ServicesIntro } from '../components/sections/ServicesIntro';
import { ServicesMatrix } from '../components/sections/ServicesMatrix';
import { AboutVideoIntro } from '../components/sections/AboutVideoIntro';
import { AboutManifesto } from '../components/sections/AboutManifesto';
import { WorkGatewayStrip } from '../components/sections/WorkGatewayStrip';
import { Blog } from '../components/sections/Blog';
import { FinalCTA } from '../components/sections/FinalCTA';
import { isVisualTestMode } from '../utils/runtimeFlags';
import { DEFAULT_DESCRIPTION, DEFAULT_TITLE, SITE_NAME, SITE_URL, usePageSeo } from '../utils/seo';
import { GlassBallCursor } from '../components/cursor/GlassBallCursor';

/**
 * HomePage component that renders all sections of the home page.
 * Hierarchy:
 * 1. Hero (Cinematic Hook & Peel)
 * 2. Services Intro & Services Matrix (Commercial Offer & Scope Estimator)
 * 3. About Video Intro & Founder's Manifesto Bento (Leon Madara & Standards)
 * 4. Selected Works Gateway Strip (Proof bridge to /work)
 * 5. Blog (Thought Leadership)
 * 6. Final CTA (Start Your Project)
 */
export function HomePage() {
  const isVisualTest = isVisualTestMode();
  const heroRef = useRef<HeroHandle>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const heroWrapperRef = useRef<HTMLDivElement>(null);

  usePageSeo({
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    path: '/',
    structuredData: {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'Organization',
          '@id': `${SITE_URL}/#organization`,
          name: SITE_NAME,
          url: SITE_URL,
          logo: `${SITE_URL}/icons/main-logo.svg`,
        },
        {
          '@type': 'WebSite',
          '@id': `${SITE_URL}/#website`,
          name: SITE_NAME,
          url: SITE_URL,
          publisher: {
            '@id': `${SITE_URL}/#organization`,
          },
        },
        {
          '@type': 'ProfessionalService',
          '@id': `${SITE_URL}/#business`,
          name: SITE_NAME,
          url: SITE_URL,
          areaServed: 'Kenya',
          address: {
            '@type': 'PostalAddress',
            addressLocality: 'Nairobi',
            addressCountry: 'KE',
          },
          serviceType: ['Web design', 'Website development', 'Brand identity', 'Conversion design'],
        },
      ],
    },
  });

  useGSAP(() => {
    if (isVisualTest) return;

    // Master Timeline for Entry
    const tl = gsap.timeline({ delay: 0.15 });

    if (heroRef.current) {
      if (heroRef.current.textRefs) {
        tl.to(heroRef.current.textRefs, {
          y: "0%",
          stagger: 0.15,
          duration: 1.1,
          ease: "power3.out"
        }, "-=1.2");
      }
    }

  }, { dependencies: [], scope: containerRef });

  return (
    <div ref={containerRef}>
      {/* 1. Hero with 3D scroll distance */}
      <div ref={heroWrapperRef} className="hero-scroll-wrapper">
        <Hero ref={heroRef} scrollWrapperRef={heroWrapperRef} />
      </div>

      {/* Interactive cursor */}
      <GlassBallCursor />

      {/* 2. The Reality Check & Our Approach */}
      <RealityCheck />

      {/* 3. Services: Promoted to prime position */}
      <ServicesIntro />
      <ServicesMatrix />

      {/* 3. About: Founder Video + Systems Bento */}
      <AboutVideoIntro />
      <AboutManifesto />

      {/* 4. Selected Works Gateway: Proof bridge to dedicated /work route */}
      <WorkGatewayStrip />

      {/* 5. Blog & Final CTA */}
      <Blog />
      <FinalCTA />
    </div>
  );
}
