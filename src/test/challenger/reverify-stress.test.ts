import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { ServiceConfigurator } from '../../scripts/configurator';

function setupConfiguratorDOM() {
  document.body.innerHTML = `
    <div class="configurator-page">
      <main class="configurator">
        <header class="configurator-header">
          <button class="back-btn" id="btnBack">
            <span class="back-text">Back</span>
            <span class="back-arrow">←</span>
          </button>
          <a href="#" class="close-btn">✕</a>
          <div class="close-btn-tooltip">Your progress will be saved</div>
        </header>

        <div class="configurator-content">
          <div class="progress-section">
            <span class="progress-label">Get Started</span>
            <div class="progress-bar">
              <div class="progress-fill" id="progressFill"></div>
            </div>
            <div id="tierBadge" class="tier-badge" style="display: none;">
              <span class="tier-badge-label">Selected Tier:</span>
              <strong id="tierBadgeText" class="tier-badge-value"></strong>
            </div>
          </div>

          <!-- STEP 1 -->
          <div class="step active" data-step="1">
            <h1 class="step-title">Tell us about yourself</h1>
            <button class="option-card" data-value="small-business">Small Business</button>
          </div>

          <!-- FEEDBACK 1 -->
          <div class="step feedback-step" data-step="feedback-1"></div>

          <!-- STEP 2 -->
          <div class="step" data-step="2">
            <button class="option-card" data-value="no-website">No Website</button>
            <button class="option-card" data-value="outdated">Outdated</button>
            <button class="option-card" data-value="modern">Modern</button>
          </div>

          <!-- STEP 3 -->
          <div class="step" data-step="3">
            <button class="option-card" data-value="leads">Leads</button>
            <button class="option-card" data-value="credibility">Credibility</button>
          </div>

          <!-- FEEDBACK 2 -->
          <div class="step feedback-step" data-step="feedback-2"></div>

          <!-- STEP 4 -->
          <div class="step" data-step="4">
            <button class="option-card" data-value="asap">ASAP</button>
          </div>

          <!-- STEP 5 -->
          <div class="step" data-step="5">
            <button class="option-card" data-value="budget-mid">Budget Mid</button>
          </div>

          <!-- FEEDBACK 3 -->
          <div class="step feedback-step" data-step="feedback-3"></div>

          <!-- STEP 6 -->
          <div class="step" data-step="6">
            <button class="option-card multi-select" data-value="mobile-first">Mobile-First</button>
            <button class="option-card multi-select" data-value="seo">SEO</button>
            <button class="option-card multi-select" data-value="analytics">Analytics</button>
            <button class="option-card multi-select" data-value="whatsapp">WhatsApp</button>
          </div>

          <!-- STEP 7 -->
          <div class="step" data-step="7">
            <p class="step-label">Almost there!</p>
            <h1 class="step-title">How can we reach you?</h1>
            <form class="contact-form" id="contactForm">
              <input type="text" id="userName" name="name" value="Leon Test">
              <input type="email" id="userEmail" name="email" value="test@codebyleon.com">
              <input type="tel" id="userPhone" name="phone" value="+254700000000">
              <input type="text" id="businessName" name="business" value="Test Corp">
            </form>
          </div>

          <!-- PROCESSING -->
          <div class="step processing-step" data-step="processing"></div>

          <!-- STEP 8 -->
          <div class="step" data-step="8">
            <p class="result-label">All set!</p>
            <h2 class="result-title">Your perfect fit: <span id="packageName"></span></h2>
            <p class="result-price" id="packagePrice"></p>
            <div class="result-section">
              <h3>Why this works:</h3>
              <ul id="whyList"></ul>
            </div>
            <div class="result-section">
              <h3>What's included:</h3>
              <ul id="includedList"></ul>
            </div>
            <div class="result-ctas">
              <a href="https://calendly.com/codebyleon/discovery-call" class="cta-primary" id="btnBookCall">Book Strategy Call</a>
              <a href="https://wa.me/254700000000" class="cta-secondary" id="btnWhatsappLeon">WhatsApp Leon</a>
            </div>
          </div>
        </div>

        <div class="nav-controls">
          <button class="btn-continue" id="btnContinue">Continue</button>
        </div>
      </main>
    </div>
  `;
}

describe('Challenger Re-verification Stress Harness', () => {
  beforeEach(() => {
    localStorage.clear();
    setupConfiguratorDOM();
  });

  afterEach(() => {
    localStorage.clear();
    document.body.innerHTML = '';
    window.history.replaceState({}, '', '/get-started.html');
  });

  describe('Adversarial Open Redirect Vector Battery on getReturnUrl()', () => {
    const maliciousVectors = [
      '//evil.com',
      '//evil.com/phishing',
      '///evil.com',
      '////evil.com',
      '/\\evil.com',
      '/\\evil.com/path',
      '\\evil.com',
      '\\\\evil.com',
      '\\/evil.com',
      '/\\\\evil.com',
      'https://evil.com',
      'http://evil.com',
      'ftp://evil.com',
      'javascript:alert(document.cookie)',
      'data:text/html,<script>alert(1)</script>',
      'vbscript:alert(1)',
      '//localhost:8080/evil',
      '//127.0.0.1/evil',
      '//[::1]/evil',
      '//google.com%2f%2fevil.com',
      '//',
    ];

    maliciousVectors.forEach((vector) => {
      it(`blocks malicious returnUrl vector: "${vector}"`, () => {
        window.history.replaceState({}, '', `/get-started.html?from=${encodeURIComponent(vector)}`);
        const configurator = new ServiceConfigurator();
        const returnUrl = configurator.getReturnUrl();
        expect(returnUrl).toBe('/?no-burn=true');
        expect(returnUrl).not.toBe(vector);
      });
    });

    const legitimateVectors = [
      '/',
      '/?no-burn=true',
      '/#final-cta',
      '/#reality-check',
      '/work',
      '/work/kossy-langat',
      '/work/delivah-dispatch-hub',
      '/work/legit-logistics',
      '/blog',
      '/blog/scalable-web-architecture',
      '/get-started.html',
    ];

    legitimateVectors.forEach((vector) => {
      it(`allows legitimate relative returnUrl: "${vector}"`, () => {
        window.history.replaceState({}, '', `/get-started.html?from=${encodeURIComponent(vector)}`);
        const configurator = new ServiceConfigurator();
        expect(configurator.getReturnUrl()).toBe(vector);
      });
    });

    it('falls back to /?no-burn=true when from param is missing or empty', () => {
      window.history.replaceState({}, '', '/get-started.html');
      const c1 = new ServiceConfigurator();
      expect(c1.getReturnUrl()).toBe('/?no-burn=true');

      window.history.replaceState({}, '', '/get-started.html?from=');
      const c2 = new ServiceConfigurator();
      expect(c2.getReturnUrl()).toBe('/?no-burn=true');
    });
  });

  describe('Adversarial Query Param Boundary Testing on handleQueryParams()', () => {
    it('gracefully handles unknown / malformed query parameters without throwing', () => {
      expect(() => {
        window.history.replaceState({}, '', '/get-started.html?intent=invalid-hack&tier=non-existent-tier&random=123');
        const configurator = new ServiceConfigurator();
        expect(configurator.isDiscoveryCall).toBe(false);
        expect(configurator.selectedTier).toBeNull();
        expect(configurator.currentIndex).toBe(0);
      }).not.toThrow();
    });

    it('gracefully handles empty query parameters', () => {
      expect(() => {
        window.history.replaceState({}, '', '/get-started.html?intent=&tier=');
        const configurator = new ServiceConfigurator();
        expect(configurator.isDiscoveryCall).toBe(false);
        expect(configurator.selectedTier).toBeNull();
      }).not.toThrow();
    });

    it('correctly coordinates both intent=discovery-call and tier=custom-website simultaneously', () => {
      window.history.replaceState({}, '', '/get-started.html?intent=discovery-call&tier=custom-website');
      const configurator = new ServiceConfigurator();

      // Fast-tracks to step 7
      expect(configurator.isDiscoveryCall).toBe(true);
      expect(configurator.currentIndex).toBe(configurator.stepFlow.indexOf('7'));

      // Pre-selects custom-website tier details
      expect(configurator.selectedTier).toBe('custom-website');
      expect(configurator.answers['2']).toBe('no-website');
      expect(configurator.answers['3']).toBe('credibility');
      expect(configurator.additionalNeeds).toContain('mobile-first');
      expect(configurator.additionalNeeds).toContain('seo');

      // Tier badge displayed
      const badge = document.getElementById('tierBadge');
      const badgeText = document.getElementById('tierBadgeText');
      expect(badge?.style.display).toBe('inline-flex');
      expect(badgeText?.textContent).toBe('A Brand-New Custom Website');

      // Step 7 adapted
      const step7Title = document.querySelector('.step[data-step="7"] .step-title');
      expect(step7Title?.textContent).toBe('Book Your 20-Minute Discovery Call with Leon');
    });

    it('updates Back button to "Exit" on step 7 in discovery call mode', () => {
      window.history.replaceState({}, '', '/get-started.html?intent=discovery-call');
      const configurator = new ServiceConfigurator();
      const backText = document.querySelector('#btnBack .back-text');
      expect(backText?.textContent).toBe('Exit');
    });

    it('all 3 canonical service tiers configure distinct package and feature sets', () => {
      const tiers = [
        { id: 'custom-website', name: 'A Brand-New Custom Website', step2: 'no-website' },
        { id: 'redesign-modernization', name: 'Complete Website Redesign & Modernization', step2: 'outdated' },
        { id: 'portals-workflows', name: 'Custom Portals & Automated Workflows', step2: 'modern' }
      ];

      tiers.forEach((t) => {
        window.history.replaceState({}, '', `/get-started.html?tier=${t.id}`);
        const c = new ServiceConfigurator();
        expect(c.selectedTier).toBe(t.id);
        expect(c.selectedTierConfig?.name).toBe(t.name);
        expect(c.answers['2']).toBe(t.step2);

        const rec = c.generateRecommendation();
        expect(rec.packageName).toBe(t.name);
        expect(rec.features.length).toBeGreaterThanOrEqual(4);
      });
    });
  });

  describe('Zero Placeholder Links Guarantee', () => {
    it('step 8 CTAs point to legitimate live targets without template stubs', () => {
      window.history.replaceState({}, '', '/get-started.html');
      const configurator = new ServiceConfigurator();
      configurator.generateRecommendation();

      const primaryCta = document.querySelector('.step[data-step="8"] .cta-primary') as HTMLAnchorElement;
      const secondaryCta = document.querySelector('.step[data-step="8"] .cta-secondary') as HTMLAnchorElement;

      expect(primaryCta.href).toBe('https://calendly.com/codebyleon/discovery-call');
      expect(primaryCta.href).not.toContain('your-link');

      expect(secondaryCta.href).toContain('https://wa.me/254700000000');
      expect(secondaryCta.href).not.toContain('YOUR-NUMBER');
    });
  });
});
