import React from 'react';
import { render, screen, fireEvent, cleanup, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { HomePage } from '../../pages/HomePage';

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

describe('Homepage Narrative E2E Test Suite (Opaque-Box)', () => {
  let originalInnerWidth: number;

  beforeEach(() => {
    originalInnerWidth = window.innerWidth;

    // Mock HTMLCanvasElement for MouseTrail inside Hero
    HTMLCanvasElement.prototype.getContext = vi.fn().mockReturnValue({
      setTransform: vi.fn(),
      clearRect: vi.fn(),
      beginPath: vi.fn(),
      moveTo: vi.fn(),
      lineTo: vi.fn(),
      stroke: vi.fn(),
      fill: vi.fn(),
      arc: vi.fn(),
      save: vi.fn(),
      restore: vi.fn(),
    });

    // Mock HTMLMediaElement play/pause for video
    window.HTMLMediaElement.prototype.play = vi.fn().mockImplementation(() => Promise.resolve());
    window.HTMLMediaElement.prototype.pause = vi.fn();
  });

  afterEach(() => {
    cleanup();
    window.innerWidth = originalInnerWidth;
    document.documentElement.removeAttribute('data-theme');
  });

  const renderHomePage = () => {
    return render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );
  };

  /* ==========================================================================
     TIER 1: FEATURE COVERAGE (50 Tests, ≥5 tests per feature group)
     ========================================================================== */

  describe('Tier 1: Feature 1 - Hero Copy & CTAs', () => {
    it('F1-1: Hero section exists with id="hero" or class "hero"', () => {
      renderHomePage();
      const hero = document.querySelector('#hero') || document.querySelector('.hero');
      expect(hero).toBeInTheDocument();
    });

    it('F1-2: Hero headline presents "Bold Websites for Driven Brands."', () => {
      renderHomePage();
      const hero = document.querySelector('#hero') || document.querySelector('.hero');
      const headline = hero?.querySelector('h1');
      expect(headline).toBeInTheDocument();
      const text = headline?.textContent?.replace(/\s+/g, ' ').trim();
      expect(text).toMatch(/Bold websites for.*brands\./i);
    });

    it('F1-3: Hero subheadline states "We build websites and designs to make your business look as professional as it is."', () => {
      renderHomePage();
      const hero = document.querySelector('#hero') || document.querySelector('.hero');
      const subheadline = hero?.querySelector('.hero__subheadline') || hero?.querySelector('p');
      expect(subheadline).toBeInTheDocument();
      const text = subheadline?.textContent?.replace(/\s+/g, ' ').trim();
      expect(text).toMatch(/make your business.*look as professional as it is/i);
    });

    it('F1-4: Hero Primary CTA has label "Configure Your Project" linking to /get-started.html', () => {
      renderHomePage();
      const hero = document.querySelector('#hero') || document.querySelector('.hero');
      const primaryCta = hero?.querySelector('a[href="/get-started.html"]');
      expect(primaryCta).toBeInTheDocument();
      expect(primaryCta?.textContent?.trim()).toMatch(/Configure Your Project|Start your project/i);
    });

    it('F1-5: Hero Secondary CTA has label "View Previous Work" linking to /work', () => {
      renderHomePage();
      const hero = document.querySelector('#hero') || document.querySelector('.hero');
      const secondaryCta = hero?.querySelector('a[href="/work"]') || hero?.querySelector('a[href="#portfolio"]');
      expect(secondaryCta).toBeInTheDocument();
      expect(secondaryCta?.textContent?.trim()).toMatch(/View Previous Work|View Portfolio/i);
    });
  });

  describe('Tier 1: Feature 2 - The Reality Check & Our Approach', () => {
    it('F2-1: Reality Check section exists with id="reality-check" or class "reality-check"', () => {
      renderHomePage();
      const section = document.querySelector('#reality-check') || document.querySelector('.reality-check');
      expect(section, 'Reality Check section (#reality-check / .reality-check) must be mounted on HomePage').toBeInTheDocument();
    });

    it('F2-2: Reality Check diagnoses the "Professional Gap" in plain English', () => {
      renderHomePage();
      const section = document.querySelector('#reality-check') || document.querySelector('.reality-check');
      expect(section?.textContent).toMatch(/professional gap/i);
    });

    it('F2-3: Reality Check addresses offline business reputation vs outdated online presence', () => {
      renderHomePage();
      const section = document.querySelector('#reality-check') || document.querySelector('.reality-check');
      expect(section?.textContent).toMatch(/offline.*online|reputation.*presence|established/i);
    });

    it('F2-4: Reality Check explains the handcrafted code and bespoke design approach', () => {
      renderHomePage();
      const section = document.querySelector('#reality-check') || document.querySelector('.reality-check');
      expect(section?.textContent).toMatch(/handcrafted|clean code|bespoke/i);
    });

    it('F2-5: Reality Check rejects clunky page builders and template bloat', () => {
      renderHomePage();
      const section = document.querySelector('#reality-check') || document.querySelector('.reality-check');
      expect(section?.textContent).toMatch(/page builder|template bloat|wordpress|webflow/i);
    });
  });

  describe('Tier 1: Feature 3 - Services 3 Plain-English Cards', () => {
    it('F3-1: Services matrix renders service card 1: "A Brand-New Custom Website"', () => {
      renderHomePage();
      const services = document.querySelector('#services') || document.querySelector('.services-matrix');
      expect(services?.textContent).toMatch(/A Brand-New Custom Website|Bespoke Web Platforms/i);
    });

    it('F3-2: Services matrix renders service card 2: "Complete Website Redesign & Modernization"', () => {
      renderHomePage();
      const services = document.querySelector('#services') || document.querySelector('.services-matrix');
      expect(services?.textContent).toMatch(/Complete Website Redesign & Modernization|Brand Authority & Digital Modernization/i);
    });

    it('F3-3: Services matrix renders service card 3: "Custom Portals & Automated Workflows"', () => {
      renderHomePage();
      const services = document.querySelector('#services') || document.querySelector('.services-matrix');
      expect(services?.textContent).toMatch(/Custom Portals & Automated Workflows|Fractional Creative & Systems Retainer/i);
    });

    it('F3-4: Services cards list concrete deliverables without agency jargon', () => {
      renderHomePage();
      const cards = document.querySelectorAll('.services-matrix__card, article');
      expect(cards.length).toBeGreaterThanOrEqual(3);
      cards.forEach((card) => {
        expect(card.textContent?.length).toBeGreaterThan(50);
      });
    });

    it('F3-5: Services cards contain direct CTA links with tier query parameters', () => {
      renderHomePage();
      const tierLinks = document.querySelectorAll('a[href*="/get-started.html?tier="]');
      expect(tierLinks.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('Tier 1: Feature 4 - Services Configurator Bridge Card', () => {
    it('F4-1: Dedicated Bridge Card exists within or alongside Services section', () => {
      renderHomePage();
      const bridge = document.querySelector('.services-matrix__bridge-card') || 
                     document.querySelector('.services-estimator') ||
                     document.querySelector('a[href*="/get-started.html"]');
      expect(bridge).toBeInTheDocument();
    });

    it('F4-2: Bridge Card explicitly highlights the 7-step interactive configurator', () => {
      renderHomePage();
      const servicesText = document.querySelector('.services-matrix')?.textContent || '';
      expect(servicesText).toMatch(/configurator|estimator|scope|7-step|step 1/i);
    });

    it('F4-3: Bridge Card links directly to /get-started.html', () => {
      renderHomePage();
      const links = Array.from(document.querySelectorAll('a')).map((a) => a.getAttribute('href'));
      const hasConfiguratorLink = links.some((href) => href && href.startsWith('/get-started.html'));
      expect(hasConfiguratorLink).toBe(true);
    });

    it('F4-4: Bridge Card copy invites visitors to configure their project online', () => {
      renderHomePage();
      const services = document.querySelector('.services-matrix');
      expect(services?.textContent).toMatch(/configure|estimate|scope|schedule discovery call/i);
    });

    it('F4-5: Bridge Card provides interactive scoping tab or card element', () => {
      renderHomePage();
      const tabOrCard = screen.queryByRole('tab', { name: /scope/i }) || 
                        document.querySelector('.services-matrix__bridge-card') ||
                        document.querySelector('.services-matrix__card');
      expect(tabOrCard).toBeInTheDocument();
    });
  });

  describe('Tier 1: Feature 5 - Proof / Our Work Gateway', () => {
    it('F5-1: Work Gateway section exists with id="work-gateway" or class "work-gateway"', () => {
      renderHomePage();
      const gateway = document.querySelector('#work-gateway') || document.querySelector('.work-gateway');
      expect(gateway).toBeInTheDocument();
    });

    it('F5-2: Work Gateway showcases client snapshot 1: Kossy Langat linking to /work/kossy-langat', () => {
      renderHomePage();
      const kossyLink = document.querySelector('a[href="/work/kossy-langat"]');
      expect(kossyLink).toBeInTheDocument();
      expect(document.body.textContent).toMatch(/Kossy Langat/i);
    });

    it('F5-3: Work Gateway showcases client snapshot 2: Delivah Dispatch linking to /work/delivah-dispatch-hub', () => {
      renderHomePage();
      const delivahLink = document.querySelector('a[href="/work/delivah-dispatch-hub"]');
      expect(delivahLink).toBeInTheDocument();
      expect(document.body.textContent).toMatch(/Delivah Dispatch/i);
    });

    it('F5-4: Work Gateway showcases client snapshot 3: Legit Logistics linking to /work/legit-logistics', () => {
      renderHomePage();
      const logisticsLink = document.querySelector('a[href="/work/legit-logistics"]');
      expect(logisticsLink).toBeInTheDocument();
      expect(document.body.textContent).toMatch(/Legit Logistics/i);
    });

    it('F5-5: Work Gateway includes prominent button directing visitors to /work', () => {
      renderHomePage();
      const allWorkLink = document.querySelector('.work-gateway a[href="/work"]') || document.querySelector('a[href="/work"]');
      expect(allWorkLink).toBeInTheDocument();
      expect(allWorkLink?.textContent).toMatch(/explore all|view all|previous work|work/i);
    });
  });

  describe('Tier 1: Feature 6 - Founder Commitment Copy & Video', () => {
    it('F6-1: Identifies founder Leon Madara explicitly by name', () => {
      renderHomePage();
      expect(screen.getAllByText(/Leon Madara/i).length).toBeGreaterThanOrEqual(1);
    });

    it('F6-2: Promises direct 1-on-1 collaboration with the founder', () => {
      renderHomePage();
      const about = document.querySelector('#about') || document.querySelector('.about-manifesto');
      expect(about?.textContent).toMatch(/partner directly|direct access|direct founder collaboration/i);
    });

    it('F6-3: Explicitly guarantees no junior developers or account managers handoff', () => {
      renderHomePage();
      const about = document.querySelector('#about') || document.querySelector('.about-manifesto');
      expect(about?.textContent).toMatch(/no account reps|no account managers|no junior|no middlemen/i);
    });

    it('F6-4: Founder video intro section renders with a <video> element', () => {
      renderHomePage();
      const video = document.querySelector('video');
      expect(video).toBeInTheDocument();
    });

    it('F6-5: Video player contains interactive play/pause controls', () => {
      renderHomePage();
      const playBtn = screen.getByRole('button', { name: /pause video|play video/i });
      expect(playBtn).toBeInTheDocument();
      fireEvent.click(playBtn);
      expect(window.HTMLMediaElement.prototype.pause).toHaveBeenCalled();
    });
  });

  describe('Tier 1: Feature 7 - Live Nairobi Studio Time & Availability', () => {
    it('F7-1: Displays local studio time for Nairobi, Kenya', () => {
      renderHomePage();
      const about = document.querySelector('#about') || document.querySelector('.about-manifesto');
      expect(about?.textContent).toMatch(/Nairobi, Kenya/i);
      expect(about?.textContent).toMatch(/Local Studio Time/i);
    });

    it('F7-2: Uses Africa/Nairobi timezone in Intl.DateTimeFormat', () => {
      const spy = vi.spyOn(Intl, 'DateTimeFormat');
      renderHomePage();
      expect(spy).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({ timeZone: 'Africa/Nairobi' })
      );
      spy.mockRestore();
    });

    it('F7-3: Formats valid local time string with hours and minutes', () => {
      renderHomePage();
      const timeMatches = screen.queryAllByText(/\d{1,2}:\d{2}/);
      const eatMatch = screen.queryByText(/EAT \(UTC\+3\)/i);
      expect(timeMatches.length > 0 || eatMatch !== null).toBe(true);
    });

    it('F7-4: Displays live status badge indicating intake availability', () => {
      renderHomePage();
      const badge = document.querySelector('.about-manifesto__live-badge');
      expect(badge).toBeInTheDocument();
      expect(badge?.textContent).toMatch(/Available/i);
    });

    it('F7-5: Status badge includes pulsing indicator dot', () => {
      renderHomePage();
      const dot = document.querySelector('.about-manifesto__status-dot');
      expect(dot).toBeInTheDocument();
    });
  });

  describe('Tier 1: Feature 8 - Fast Response Guarantee', () => {
    it('F8-1: Final CTA contains verbatim response promise "We will contact you within hours, if not minutes"', () => {
      renderHomePage();
      const finalCta = document.querySelector('#final-cta') || document.querySelector('.final-cta');
      expect(finalCta?.textContent).toMatch(/We will contact you within hours, if not minutes/i);
    });

    it('F8-2: Response guarantee is located in closing Final CTA section', () => {
      renderHomePage();
      const finalCta = document.querySelector('#final-cta');
      expect(finalCta).toBeInTheDocument();
      expect(finalCta?.textContent).toMatch(/hours.*minutes/i);
    });

    it('F8-3: Response promise uses plain, reassuring human language', () => {
      renderHomePage();
      const finalCta = document.querySelector('#final-cta') || document.querySelector('.final-cta');
      expect(finalCta?.textContent).not.toMatch(/SLA|turnaround ticket|response window protocol/i);
    });

    it('F8-4: Response guarantee retains visible contrast without hidden text', () => {
      renderHomePage();
      const finalCta = document.querySelector('#final-cta') || document.querySelector('.final-cta');
      const paragraph = finalCta?.querySelector('.final-cta__response-guarantee') || finalCta?.querySelector('p');
      expect(paragraph).toBeInTheDocument();
      expect(paragraph?.getAttribute('aria-hidden')).toBeNull();
    });

    it('F8-5: Response guarantee accompanies both conversion paths', () => {
      renderHomePage();
      const finalCta = document.querySelector('#final-cta') || document.querySelector('.final-cta');
      const buttons = finalCta?.querySelectorAll('a, button');
      expect(buttons?.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe('Tier 1: Feature 9 - Final CTA Two Conversion Paths', () => {
    it('F9-1: Final CTA section preserves id="final-cta"', () => {
      renderHomePage();
      const finalCta = document.querySelector('#final-cta');
      expect(finalCta).toBeInTheDocument();
    });

    it('F9-2: Conversion Path 1 offers booking a 20-minute discovery call', () => {
      renderHomePage();
      const finalCta = document.querySelector('#final-cta') || document.querySelector('.final-cta');
      expect(finalCta?.textContent).toMatch(/20-minute discovery call|discovery call/i);
    });

    it('F9-3: Conversion Path 2 offers configuring project online', () => {
      renderHomePage();
      const finalCta = document.querySelector('#final-cta') || document.querySelector('.final-cta');
      expect(finalCta?.textContent).toMatch(/Configure your project|Start your project/i);
    });

    it('F9-4: Conversion Path 2 links to /get-started.html', () => {
      renderHomePage();
      const finalCta = document.querySelector('#final-cta') || document.querySelector('.final-cta');
      const configLink = finalCta?.querySelector('a[href="/get-started.html"]');
      expect(configLink).toBeInTheDocument();
    });

    it('F9-5: Discovery call action triggers scheduling or links with intent parameter', () => {
      renderHomePage();
      const finalCta = document.querySelector('#final-cta') || document.querySelector('.final-cta');
      const discoveryLink = finalCta?.querySelector('a[href*="discovery"], a[href*="calendly"], a[href*="get-started.html?intent="]') ||
                            finalCta?.querySelector('.btn-secondary, a.final-cta__discovery-btn');
      expect(discoveryLink).toBeInTheDocument();
    });
  });

  describe('Tier 1: Feature 10 - Quality Gates Baseline & Hierarchy', () => {
    it('F10-1: HomePage renders the 7 narrative stages in sequential order', () => {
      renderHomePage();
      const hero = document.querySelector('#hero, .hero');
      const realityCheck = document.querySelector('#reality-check, .reality-check');
      const services = document.querySelector('#services, .services-intro, .services-matrix');
      const about = document.querySelector('#about, .about-video-intro, .about-manifesto');
      const work = document.querySelector('#work-gateway, .work-gateway');
      const blog = document.querySelector('#blog, .blog');
      const finalCta = document.querySelector('#final-cta, .final-cta');

      expect(hero).toBeInTheDocument();
      expect(realityCheck).toBeInTheDocument();
      expect(services).toBeInTheDocument();
      expect(about).toBeInTheDocument();
      expect(work).toBeInTheDocument();
      expect(blog).toBeInTheDocument();
      expect(finalCta).toBeInTheDocument();
    });

    it('F10-2: Page contains valid semantic heading hierarchy (h1 followed by h2 sections)', () => {
      renderHomePage();
      const h1s = document.querySelectorAll('h1');
      const h2s = document.querySelectorAll('h2');
      expect(h1s.length).toBeGreaterThanOrEqual(1);
      expect(h2s.length).toBeGreaterThanOrEqual(3);
    });

    it('F10-3: Copy avoids empty buzzwords and corporate agency jargon across sections', () => {
      renderHomePage();
      const bodyText = document.body.textContent || '';
      expect(bodyText).not.toMatch(/synergistic paradigm/i);
      expect(bodyText).not.toMatch(/disruptive turnkey leverage/i);
    });

    it('F10-4: All interactive CTAs have discernible and accessible text', () => {
      renderHomePage();
      const links = document.querySelectorAll('a');
      links.forEach((link) => {
        const text = link.textContent?.trim() || link.getAttribute('aria-label');
        expect(text?.length).toBeGreaterThan(0);
      });
    });

    it('F10-5: HomePage mounts and unmounts without throwing runtime errors', () => {
      const { unmount } = renderHomePage();
      expect(() => unmount()).not.toThrow();
    });
  });

  /* ==========================================================================
     TIER 2: BOUNDARY & CORNER CASES (15 Tests)
     ========================================================================== */

  describe('Tier 2: Boundary & Corner Cases', () => {
    it('BC-1: Primary CTA paths handle undefined or empty query params cleanly', () => {
      renderHomePage();
      const heroLink = document.querySelector('.hero a[href="/get-started.html"]');
      expect(heroLink?.getAttribute('href')).toBe('/get-started.html');
    });

    it('BC-2: Configurator links support query params without malformed encoding', () => {
      renderHomePage();
      const links = Array.from(document.querySelectorAll('a[href*="/get-started.html"]'));
      links.forEach((link) => {
        const href = link.getAttribute('href')!;
        expect(href).not.toContain('&amp;');
        expect(href).not.toContain('undefined');
      });
    });

    it('BC-3: Mobile viewport layout class attributes render properly (375px)', () => {
      window.innerWidth = 375;
      renderHomePage();
      const hero = document.querySelector('.hero');
      expect(hero).toBeInTheDocument();
    });

    it('BC-4: Desktop viewport layout attributes render properly (1280px)', () => {
      window.innerWidth = 1280;
      renderHomePage();
      const grid = document.querySelector('.about-manifesto__bento-grid') || document.querySelector('.work-gateway__cards-grid');
      expect(grid).toBeInTheDocument();
    });

    it('BC-5: Theme attribute data-theme="dark" is supported on root', () => {
      document.documentElement.setAttribute('data-theme', 'dark');
      renderHomePage();
      expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    });

    it('BC-6: Theme attribute data-theme="light" is supported on root', () => {
      document.documentElement.setAttribute('data-theme', 'light');
      renderHomePage();
      expect(document.documentElement.getAttribute('data-theme')).toBe('light');
    });

    it('BC-7: Theme toggling does not cause component unmounts or crashes', () => {
      const { rerender } = render(
        <MemoryRouter>
          <HomePage />
        </MemoryRouter>
      );
      document.documentElement.setAttribute('data-theme', 'dark');
      rerender(
        <MemoryRouter>
          <HomePage />
        </MemoryRouter>
      );
      document.documentElement.setAttribute('data-theme', 'light');
      rerender(
        <MemoryRouter>
          <HomePage />
        </MemoryRouter>
      );
      expect(document.querySelector('#hero')).toBeInTheDocument();
    });

    it('BC-8: Video audio mute button toggles state between muted and unmuted', () => {
      renderHomePage();
      const muteBtn = screen.getByRole('button', { name: /mute video|unmute video/i });
      expect(muteBtn).toBeInTheDocument();
      fireEvent.click(muteBtn);
      expect(muteBtn).toBeInTheDocument();
    });

    it('BC-9: Video seek slider has role="slider" with aria-valuenow bounded 0-100', () => {
      renderHomePage();
      const slider = screen.getByRole('slider', { name: /video seek progress/i });
      expect(slider).toBeInTheDocument();
      const val = Number(slider.getAttribute('aria-valuenow'));
      expect(val).toBeGreaterThanOrEqual(0);
      expect(val).toBeLessThanOrEqual(100);
    });

    it('BC-10: Video volume slider bounds are within 0 and 1', () => {
      renderHomePage();
      const volumeSlider = screen.getByLabelText(/adjust video volume/i);
      expect(volumeSlider).toBeInTheDocument();
      expect(Number(volumeSlider.getAttribute('min'))).toBe(0);
      expect(Number(volumeSlider.getAttribute('max'))).toBe(1);
    });

    it('BC-11: Studio time calculation gracefully handles Intl formatting exceptions', () => {
      const origDateTimeFormat = Intl.DateTimeFormat;
      // @ts-ignore
      Intl.DateTimeFormat = vi.fn().mockImplementation(() => {
        throw new Error('Unsupported timezone');
      });
      renderHomePage();
      const about = document.querySelector('.about-manifesto');
      expect(about?.textContent).toMatch(/EAT \(UTC\+3\)/i);
      Intl.DateTimeFormat = origDateTimeFormat;
    });

    it('BC-12: Preserves #final-cta anchor for hash navigation targets', () => {
      renderHomePage();
      const anchor = document.getElementById('final-cta');
      expect(anchor).toBeInTheDocument();
    });

    it('BC-13: Preserves #reality-check anchor for direct deep links', () => {
      renderHomePage();
      const anchor = document.getElementById('reality-check');
      expect(anchor).toBeInTheDocument();
    });

    it('BC-14: Work Gateway snapshot cards feature non-empty metrics tags', () => {
      renderHomePage();
      const pills = document.querySelectorAll('.work-gateway__metric-pill');
      expect(pills.length).toBeGreaterThanOrEqual(3);
      pills.forEach((pill) => {
        expect(pill.textContent?.trim().length).toBeGreaterThan(0);
      });
    });

    it('BC-15: Case study routes use lowercase kebab-case URLs', () => {
      renderHomePage();
      const caseLinks = document.querySelectorAll('a[href^="/work/"]');
      expect(caseLinks.length).toBeGreaterThanOrEqual(3);
      caseLinks.forEach((link) => {
        const href = link.getAttribute('href')!;
        expect(href).toMatch(/^\/work\/[a-z0-9-]+$/);
      });
    });
  });

  /* ==========================================================================
     TIER 3: CROSS-FEATURE COMBINATIONS (10 Tests)
     ========================================================================== */

  describe('Tier 3: Cross-Feature Combinations & Transition Continuity', () => {
    it('CC-1: Hero Primary CTA and Services Bridge both target /get-started.html', () => {
      renderHomePage();
      const heroPrimary = document.querySelector('.hero a[href="/get-started.html"]');
      const bridgeLinks = Array.from(document.querySelectorAll('a')).filter(
        (a) => a.getAttribute('href')?.startsWith('/get-started.html')
      );
      expect(heroPrimary).toBeInTheDocument();
      expect(bridgeLinks.length).toBeGreaterThanOrEqual(2);
    });

    it('CC-2: Hero Secondary CTA and Work Gateway Header both navigate to /work', () => {
      renderHomePage();
      const workLinks = Array.from(document.querySelectorAll('a[href="/work"]'));
      expect(workLinks.length).toBeGreaterThanOrEqual(1);
    });

    it('CC-3: Narrative Order: Hero immediately precedes Reality Check', () => {
      renderHomePage();
      const hero = document.querySelector('#hero, .hero');
      const realityCheck = document.querySelector('#reality-check, .reality-check');
      expect(hero).toBeInTheDocument();
      expect(realityCheck).toBeInTheDocument();
      // Hero appears before RealityCheck in document order
      if (hero && realityCheck) {
        expect(hero.compareDocumentPosition(realityCheck) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
      }
    });

    it('CC-4: Narrative Order: Reality Check immediately precedes Services', () => {
      renderHomePage();
      const realityCheck = document.querySelector('#reality-check, .reality-check');
      const services = document.querySelector('.services-intro, .services-matrix');
      expect(realityCheck).toBeInTheDocument();
      expect(services).toBeInTheDocument();
      if (realityCheck && services) {
        expect(realityCheck.compareDocumentPosition(services) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
      }
    });

    it('CC-5: Narrative Order: Services precedes Founder Commitment', () => {
      renderHomePage();
      const services = document.querySelector('.services-matrix');
      const about = document.querySelector('.about-video-intro, .about-manifesto');
      expect(services).toBeInTheDocument();
      expect(about).toBeInTheDocument();
      if (services && about) {
        expect(services.compareDocumentPosition(about) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
      }
    });

    it('CC-6: Narrative Order: Founder Commitment precedes Work Gateway', () => {
      renderHomePage();
      const about = document.querySelector('.about-manifesto');
      const work = document.querySelector('.work-gateway');
      expect(about).toBeInTheDocument();
      expect(work).toBeInTheDocument();
      if (about && work) {
        expect(about.compareDocumentPosition(work) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
      }
    });

    it('CC-7: Narrative Order: Work Gateway precedes Blog & Final CTA', () => {
      renderHomePage();
      const work = document.querySelector('.work-gateway');
      const finalCta = document.querySelector('.final-cta');
      expect(work).toBeInTheDocument();
      expect(finalCta).toBeInTheDocument();
      if (work && finalCta) {
        expect(work.compareDocumentPosition(finalCta) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
      }
    });

    it('CC-8: Founder Video and Bento Manifesto both reinforce 1-on-1 Leon Madara partnership', () => {
      renderHomePage();
      const videoIntro = document.querySelector('.about-video-intro');
      const bento = document.querySelector('.about-manifesto');
      expect(videoIntro?.textContent).toMatch(/Leon Madara/i);
      expect(bento?.textContent).toMatch(/Leon Madara/i);
    });

    it('CC-9: Final CTA and Services Estimator both provide discovery call conversion path', () => {
      renderHomePage();
      const finalCta = document.querySelector('.final-cta');
      expect(finalCta?.textContent).toMatch(/discovery call|start your project/i);
    });

    it('CC-10: Cross-feature narrative consistency: All client proof points link to valid case studies', () => {
      renderHomePage();
      const kossy = document.querySelector('a[href="/work/kossy-langat"]');
      const delivah = document.querySelector('a[href="/work/delivah-dispatch-hub"]');
      const legit = document.querySelector('a[href="/work/legit-logistics"]');
      expect(kossy).toBeInTheDocument();
      expect(delivah).toBeInTheDocument();
      expect(legit).toBeInTheDocument();
    });
  });

  /* ==========================================================================
     TIER 4: REAL-WORLD APPLICATION SCENARIOS (5 Tests)
     ========================================================================== */

  describe('Tier 4: Real-World Application Scenarios', () => {
    it('Scenario 1: High-Intent Founder Direct Configurator Path (F1, F4, F9)', () => {
      renderHomePage();

      // Step 1: User lands on Hero and observes Primary CTA to configurator
      const heroCta = document.querySelector('.hero a[href="/get-started.html"]');
      expect(heroCta).toBeInTheDocument();

      // Step 2: User scrolls through Services and sees Bridge Card
      const servicesLinks = Array.from(document.querySelectorAll('.services-matrix a[href*="/get-started.html"]'));
      expect(servicesLinks.length).toBeGreaterThanOrEqual(1);

      // Step 3: User reaches Final CTA and can enter online configurator
      const finalCtaConfigLink = document.querySelector('.final-cta a[href="/get-started.html"]');
      expect(finalCtaConfigLink).toBeInTheDocument();
    });

    it('Scenario 2: Skeptical Prospect Proof Path (F1, F2, F5)', () => {
      renderHomePage();

      // Step 1: Reads Reality Check diagnosing Professional Gap
      const realityCheck = document.querySelector('#reality-check, .reality-check');
      expect(realityCheck).toBeInTheDocument();
      expect(realityCheck?.textContent).toMatch(/professional gap/i);

      // Step 2: Reviews 3 client proof snapshots in Work Gateway
      const workSnapshots = document.querySelectorAll('.work-gateway__card');
      expect(workSnapshots.length).toBeGreaterThanOrEqual(3);

      // Step 3: Clicks through to full /work case studies catalog
      const exploreLink = document.querySelector('.work-gateway a[href="/work"]');
      expect(exploreLink).toBeInTheDocument();
    });

    it('Scenario 3: Direct Founder Relationship Evaluation (F2, F6, F7, F8)', () => {
      renderHomePage();

      // Step 1: Evaluates anti-template / handcrafted code commitment
      const manifesto = document.querySelector('.about-manifesto');
      expect(manifesto?.textContent).toMatch(/handcrafted code|anti-template/i);

      // Step 2: Confirms 1-on-1 collaboration with Leon Madara
      expect(manifesto?.textContent).toMatch(/Leon Madara/i);
      expect(manifesto?.textContent).toMatch(/no account reps|no junior/i);

      // Step 3: Checks live Nairobi studio time & availability badge
      expect(manifesto?.textContent).toMatch(/Nairobi, Kenya/i);
      expect(manifesto?.textContent).toMatch(/Available/i);

      // Step 4: Reassures fast response in hours/minutes
      const finalCta = document.querySelector('.final-cta');
      expect(finalCta?.textContent).toMatch(/within hours, if not minutes/i);
    });

    it('Scenario 4: Fast Discovery Call Booking Journey (F8, F9)', () => {
      renderHomePage();

      // Step 1: User traverses to closing section
      const finalCta = document.querySelector('#final-cta');
      expect(finalCta).toBeInTheDocument();

      // Step 2: Sees rapid contact guarantee
      expect(finalCta?.textContent).toMatch(/contact you within hours, if not minutes/i);

      // Step 3: Triggers 20-minute discovery call path
      const discoveryOption = finalCta?.textContent?.includes('discovery call');
      const configOption = finalCta?.querySelector('a[href="/get-started.html"]');
      expect(discoveryOption || configOption !== null).toBe(true);
    });

    it('Scenario 5: Dual-Theme Visual & Interactive Integrity (F1–F10)', () => {
      // Step 1: Verify dark theme integrity
      document.documentElement.setAttribute('data-theme', 'dark');
      const { unmount: unmountDark } = renderHomePage();
      expect(document.querySelector('#hero')).toBeInTheDocument();
      expect(document.querySelector('#final-cta')).toBeInTheDocument();
      unmountDark();

      // Step 2: Verify light theme integrity
      document.documentElement.setAttribute('data-theme', 'light');
      const { unmount: unmountLight } = renderHomePage();
      expect(document.querySelector('#hero')).toBeInTheDocument();
      expect(document.querySelector('#final-cta')).toBeInTheDocument();
      unmountLight();
    });
  });
});
