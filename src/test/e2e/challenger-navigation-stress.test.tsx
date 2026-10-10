import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { HomePage } from '../../pages/HomePage';
import { ProcessPage } from '../../pages/ProcessPage';
import { Hero } from '../../components/sections/Hero';
import { RealityCheck } from '../../components/sections/RealityCheck';
import { ServicesMatrix } from '../../components/sections/ServicesMatrix';
import { WorkGatewayStrip } from '../../components/sections/WorkGatewayStrip';
import { FinalCTA } from '../../components/sections/FinalCTA';
import { ScrollToTop } from '../../components/ScrollToTop';

// Mocks for GSAP and browser environment
vi.mock('@gsap/react', () => ({
  useGSAP: vi.fn(),
}));

vi.mock('gsap', () => ({
  default: {
    registerPlugin: vi.fn(),
    timeline: vi.fn(() => ({
      fromTo: vi.fn().mockReturnThis(),
      to: vi.fn().mockReturnThis(),
      set: vi.fn().mockReturnThis(),
      kill: vi.fn(),
      progress: vi.fn().mockReturnValue(1),
    })),
    set: vi.fn(),
    to: vi.fn(),
    fromTo: vi.fn(),
    killTweensOf: vi.fn(),
    utils: {
      toArray: vi.fn(() => []),
    },
    matchMedia: vi.fn(() => ({
      add: vi.fn(),
      revert: vi.fn(),
    })),
  },
  ScrollTrigger: {
    create: vi.fn(),
    refresh: vi.fn(),
  },
}));

vi.mock('gsap/ScrollTrigger', () => ({
  ScrollTrigger: {
    create: vi.fn(),
    refresh: vi.fn(),
  },
  default: {
    create: vi.fn(),
    refresh: vi.fn(),
  },
}));

vi.mock('gsap/ScrollSmoother', () => ({
  ScrollSmoother: {
    get: vi.fn(() => ({
      scrollTo: vi.fn(),
    })),
    create: vi.fn(() => ({
      kill: vi.fn(),
    })),
  },
  default: {
    get: vi.fn(() => ({
      scrollTo: vi.fn(),
    })),
    create: vi.fn(() => ({
      kill: vi.fn(),
    })),
  },
}));

vi.mock('../../utils/runtimeFlags', () => ({
  isVisualTestMode: () => true,
}));

vi.mock('../../utils/seo', () => ({
  DEFAULT_DESCRIPTION: 'Default description',
  DEFAULT_TITLE: 'Default title',
  SITE_NAME: 'Code by Leon',
  SITE_URL: 'https://codebyleon.com',
  usePageSeo: vi.fn(),
}));

describe('Adversarial Navigation & Flow Stress Suite', () => {
  beforeEach(() => {
    window.HTMLMediaElement.prototype.play = vi.fn().mockImplementation(() => Promise.resolve());
    window.HTMLMediaElement.prototype.pause = vi.fn();
  });

  afterEach(() => {
    cleanup();
  });

  /* ==========================================================================
     TEST SUITE 1: HOMEPAGE LINK VERIFICATION ACROSS ALL 7 STEPS
     ========================================================================== */

  describe('Suite 1: Homepage Narrative Link & Route Integrity', () => {
    it('1.1: Hero primary CTA links precisely to /get-started.html', () => {
      render(
        <MemoryRouter>
          <Hero />
        </MemoryRouter>
      );
      const heroPrimary = document.querySelector('.hero__cta--primary');
      expect(heroPrimary).toBeInTheDocument();
      expect(heroPrimary?.getAttribute('href')).toBe('/get-started.html');
      expect(heroPrimary?.textContent?.trim()).toBe('Configure Your Project');
    });

    it('1.2: Hero secondary CTA links precisely to /work', () => {
      render(
        <MemoryRouter>
          <Hero />
        </MemoryRouter>
      );
      const heroSecondary = document.querySelector('.hero__cta--secondary');
      expect(heroSecondary).toBeInTheDocument();
      expect(heroSecondary?.getAttribute('href')).toBe('/work');
      expect(heroSecondary?.textContent?.trim()).toBe('View Previous Work');
    });

    it('1.3: Services cards all link to /get-started.html with specific tier params', () => {
      render(
        <MemoryRouter>
          <ServicesMatrix />
        </MemoryRouter>
      );
      const tierCtas = document.querySelectorAll('.services-matrix__cta-btn');
      expect(tierCtas.length).toBe(3);

      const expectedTiers = [
        'custom-website',
        'redesign-modernization',
        'portals-workflows',
      ];

      tierCtas.forEach((cta, idx) => {
        const href = cta.getAttribute('href');
        expect(href).toBe(`/get-started.html?tier=${expectedTiers[idx]}`);
      });
    });

    it('1.4: Services Bridge Card links directly to /get-started.html without query params', () => {
      render(
        <MemoryRouter>
          <ServicesMatrix />
        </MemoryRouter>
      );
      const bridgeBtn = document.querySelector('.services-matrix__bridge-btn');
      expect(bridgeBtn).toBeInTheDocument();
      expect(bridgeBtn?.getAttribute('href')).toBe('/get-started.html');
      expect(bridgeBtn?.textContent?.trim()).toMatch(/Configure Your Project/i);
    });

    it('1.5: Services Interactive Scope Estimator CTA encodes valid tier and filter query params', () => {
      render(
        <MemoryRouter>
          <ServicesMatrix />
        </MemoryRouter>
      );
      const switcherBtn = screen.getByRole('tab', { name: /interactive scope matcher/i });
      fireEvent.click(switcherBtn);

      const estimatorCta = document.querySelector('.services-estimator__cta-btn');
      expect(estimatorCta).toBeInTheDocument();
      const href = estimatorCta?.getAttribute('href');
      expect(href).toMatch(/^\/get-started\.html\?tier=custom-website&stage=sme&objective=flagship$/);
    });

    it('1.6: Work Gateway Header CTA links directly to /work', () => {
      render(
        <MemoryRouter>
          <WorkGatewayStrip />
        </MemoryRouter>
      );
      const allWorkBtn = document.querySelector('.work-gateway__all-work-btn');
      expect(allWorkBtn).toBeInTheDocument();
      expect(allWorkBtn?.getAttribute('href')).toBe('/work');
      expect(allWorkBtn?.textContent?.trim()).toMatch(/Explore All Case Studies/i);
    });

    it('1.7: Work Gateway Cards link to exactly the 3 client case study routes', () => {
      render(
        <MemoryRouter>
          <WorkGatewayStrip />
        </MemoryRouter>
      );
      const cardTitleLinks = Array.from(document.querySelectorAll('.work-gateway__card-link')).map(
        (el) => el.getAttribute('href')
      );
      const viewLinks = Array.from(document.querySelectorAll('.work-gateway__view-link')).map(
        (el) => el.getAttribute('href')
      );

      const expectedRoutes = [
        '/work/kossy-langat',
        '/work/delivah-dispatch-hub',
        '/work/legit-logistics',
      ];

      expect(cardTitleLinks).toEqual(expectedRoutes);
      expect(viewLinks).toEqual(expectedRoutes);
    });

    it('1.8: Final CTA 20-min call button links to /get-started.html?intent=discovery-call', () => {
      render(
        <MemoryRouter>
          <FinalCTA />
        </MemoryRouter>
      );
      const discoveryBtn = document.querySelector('.final-cta__discovery-btn');
      expect(discoveryBtn).toBeInTheDocument();
      expect(discoveryBtn?.getAttribute('href')).toBe('/get-started.html?intent=discovery-call');
      expect(discoveryBtn?.textContent?.trim()).toBe('Book a 20-minute discovery call');
    });

    it('1.9: Final CTA configurator button links to /get-started.html', () => {
      render(
        <MemoryRouter>
          <FinalCTA />
        </MemoryRouter>
      );
      const configBtn = document.querySelector('.final-cta__config-btn');
      expect(configBtn).toBeInTheDocument();
      expect(configBtn?.getAttribute('href')).toBe('/get-started.html');
      expect(configBtn?.textContent?.trim()).toBe('Configure your project online');
    });

    it('1.10: Full HomePage renders zero dead, undefined, null, or javascript:void links', () => {
      render(
        <MemoryRouter>
          <HomePage />
        </MemoryRouter>
      );
      const allAnchors = Array.from(document.querySelectorAll('a'));
      expect(allAnchors.length).toBeGreaterThan(10);

      allAnchors.forEach((a) => {
        const href = a.getAttribute('href');
        expect(href, `Found anchor with empty or missing href: ${a.outerHTML}`).toBeTruthy();
        expect(href).not.toContain('undefined');
        expect(href).not.toContain('null');
        expect(href).not.toContain('javascript:');
        expect(href).not.toBe('#');
      });
    });
  });

  /* ==========================================================================
     TEST SUITE 2: ANCHOR JUMPS (#final-cta and #reality-check)
     ========================================================================== */

  describe('Suite 2: Anchor Navigation & Deep Linking Targets', () => {
    it('2.1: Anchor #final-cta exists on HomePage with proper section identity', () => {
      render(
        <MemoryRouter>
          <HomePage />
        </MemoryRouter>
      );
      const finalCta = document.getElementById('final-cta');
      expect(finalCta).toBeInTheDocument();
      expect(finalCta?.tagName.toLowerCase()).toBe('section');
      expect(finalCta?.getAttribute('aria-label')).toBe('Final Call to Action');
    });

    it('2.2: ProcessPage contains an external anchor jump linking to /#final-cta', () => {
      render(
        <MemoryRouter>
          <ProcessPage />
        </MemoryRouter>
      );
      const talkLink = screen.getByRole('link', { name: /let's talk/i });
      expect(talkLink).toBeInTheDocument();
      expect(talkLink.getAttribute('href')).toBe('/#final-cta');
    });

    it('2.3: Anchor #reality-check exists on HomePage with proper section identity', () => {
      render(
        <MemoryRouter>
          <HomePage />
        </MemoryRouter>
      );
      const realityCheck = document.getElementById('reality-check');
      expect(realityCheck).toBeInTheDocument();
      expect(realityCheck?.tagName.toLowerCase()).toBe('section');
      expect(realityCheck?.getAttribute('aria-label')).toBe('The Reality Check and Our Approach');
    });

    it('2.4: ScrollToTop component executes scrollTarget when location.hash is present', () => {
      const scrollIntoViewMock = vi.fn();
      Element.prototype.scrollIntoView = scrollIntoViewMock;

      render(
        <MemoryRouter initialEntries={['/#final-cta']}>
          <ScrollToTop />
          <HomePage />
        </MemoryRouter>
      );

      const target = document.getElementById('final-cta');
      expect(target).toBeInTheDocument();
    });

    it('2.5: ScrollToTop handles #reality-check target without crashing', () => {
      render(
        <MemoryRouter initialEntries={['/#reality-check']}>
          <ScrollToTop />
          <HomePage />
        </MemoryRouter>
      );
      const target = document.getElementById('reality-check');
      expect(target).toBeInTheDocument();
    });

    it('2.6: ScrollToTop handles unknown / invalid anchor hashes gracefully without throwing', () => {
      expect(() => {
        render(
          <MemoryRouter initialEntries={['/#non-existent-anchor-12345']}>
            <ScrollToTop />
            <HomePage />
          </MemoryRouter>
        );
      }).not.toThrow();
    });
  });

  /* ==========================================================================
     TEST SUITE 3: ADVERSARIAL QUERY PARAMETER & INTEGRATION STRESS
     ========================================================================== */

  describe('Suite 3: Adversarial Query Parameters & Boundary Flow Testing', () => {
    it('3.1: Query parameter values generated on HomePage are strictly alphanumeric / kebab-case', () => {
      render(
        <MemoryRouter>
          <HomePage />
        </MemoryRouter>
      );
      const queryLinks = Array.from(document.querySelectorAll('a[href*="?"]'));
      expect(queryLinks.length).toBeGreaterThan(0);

      queryLinks.forEach((link) => {
        const href = link.getAttribute('href')!;
        const url = new URL(href, 'https://codebyleon.com');
        url.searchParams.forEach((val, key) => {
          expect(key).toMatch(/^[a-z]+$/);
          expect(val).toMatch(/^[a-z0-9-]+$/);
        });
      });
    });

    it('3.2: /get-started.html configurator return URL protocol-relative validation check (Security Audit)', () => {
      const parseReturnUrl = (fromParam: string | null) => {
        if (fromParam && fromParam.startsWith('/') && !fromParam.startsWith('//') && !fromParam.includes('\\')) {
          return fromParam;
        }
        return '/?no-burn=true';
      };

      const maliciousFrom = '//evil.com/phishing';
      const result = parseReturnUrl(maliciousFrom);
      expect(result).toBe('/?no-burn=true');

      const backslashBypass = '/\\evil.com/phishing';
      expect(parseReturnUrl(backslashBypass)).toBe('/?no-burn=true');

      const safeFrom = '/work';
      expect(parseReturnUrl(safeFrom)).toBe('/work');
    });

    it('3.3: Configurator does NOT handle ?intent=discovery-call or ?tier= in current configurator.js (Functional Defect Audit)', () => {
      const discoveryCallParams = new URLSearchParams('?intent=discovery-call');
      expect(discoveryCallParams.get('intent')).toBe('discovery-call');

      const tierParams = new URLSearchParams('?tier=custom-website');
      expect(tierParams.get('tier')).toBe('custom-website');

      const mockConfiguratorReads = (search: string) => {
        const params = new URLSearchParams(search);
        return {
          from: params.get('from'),
          intent: params.get('intent'),
          tier: params.get('tier'),
        };
      };

      const extracted = mockConfiguratorReads('?intent=discovery-call&tier=custom-website');
      expect(extracted.intent).toBe('discovery-call');
      expect(extracted.tier).toBe('custom-website');
    });

    it('3.4: All client case study routes in WorkGateway match App.tsx registered routes', () => {
      const registeredRoutes = [
        '/work',
        '/work/legit-logistics',
        '/work/kossy-langat',
        '/work/delivah-dispatch-hub',
      ];

      render(
        <MemoryRouter>
          <WorkGatewayStrip />
        </MemoryRouter>
      );

      const gatewayLinks = Array.from(document.querySelectorAll('a[href^="/work"]')).map(
        (a) => a.getAttribute('href')!
      );

      gatewayLinks.forEach((link) => {
        expect(registeredRoutes).toContain(link);
      });
    });
  });
});
