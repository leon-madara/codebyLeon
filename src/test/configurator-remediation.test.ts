import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { ServiceConfigurator } from '../scripts/configurator';

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

describe('Configurator Remediation Tests (Query Params & Security)', () => {
  beforeEach(() => {
    localStorage.clear();
    setupConfiguratorDOM();
  });

  afterEach(() => {
    localStorage.clear();
    document.body.innerHTML = '';
    window.history.replaceState({}, '', '/get-started.html');
  });

  describe('1. Security: Open Redirect Prevention in getReturnUrl()', () => {
    it('accepts safe relative paths', () => {
      window.history.replaceState({}, '', '/get-started.html?from=/work');
      const configurator = new ServiceConfigurator();
      expect(configurator.getReturnUrl()).toBe('/work');
    });

    it('rejects protocol-relative open redirect //evil.com', () => {
      window.history.replaceState({}, '', '/get-started.html?from=//evil.com/phishing');
      const configurator = new ServiceConfigurator();
      expect(configurator.getReturnUrl()).toBe('/?no-burn=true');
    });

    it('rejects backslash open redirect bypass /\\\\evil.com', () => {
      window.history.replaceState({}, '', '/get-started.html?from=/\\evil.com/phishing');
      const configurator = new ServiceConfigurator();
      expect(configurator.getReturnUrl()).toBe('/?no-burn=true');
    });

    it('rejects external absolute URLs', () => {
      window.history.replaceState({}, '', '/get-started.html?from=https://evil.com');
      const configurator = new ServiceConfigurator();
      expect(configurator.getReturnUrl()).toBe('/?no-burn=true');
    });
  });

  describe('2. Discovery Call Intent (?intent=discovery-call)', () => {
    it('fast-tracks directly to Step 7 with custom heading', () => {
      window.history.replaceState({}, '', '/get-started.html?intent=discovery-call');
      const configurator = new ServiceConfigurator();

      expect(configurator.isDiscoveryCall).toBe(true);
      expect(configurator.currentIndex).toBe(configurator.stepFlow.indexOf('7'));

      const activeStep = document.querySelector('.step.active');
      expect(activeStep?.getAttribute('data-step')).toBe('7');

      const step7Title = document.querySelector('.step[data-step="7"] .step-title');
      expect(step7Title?.textContent).toBe('Book Your 20-Minute Discovery Call with Leon');

      const progressLabel = document.querySelector('.progress-label');
      expect(progressLabel?.textContent).toBe('20-Minute Discovery Call');
    });

    it('adapts Step 8 for discovery call with real booking actions and no placeholders', () => {
      window.history.replaceState({}, '', '/get-started.html?intent=discovery-call');
      const configurator = new ServiceConfigurator();

      const recommendation = configurator.generateRecommendation();
      expect(recommendation.packageName).toContain('20-Minute Discovery Call');

      const primaryCta = document.querySelector('.step[data-step="8"] .cta-primary') as HTMLAnchorElement;
      expect(primaryCta.href).toBe('https://calendly.com/codebyleon/discovery-call');
      expect(primaryCta.href).not.toContain('your-link');

      const secondaryCta = document.querySelector('.step[data-step="8"] .cta-secondary') as HTMLAnchorElement;
      expect(secondaryCta.href).toContain('wa.me/254700000000');
      expect(secondaryCta.href).not.toContain('YOUR-NUMBER');
    });
  });

  describe('3. Service Tier Parameter (?tier=...) Pre-selection & Badge', () => {
    it('handles custom-website tier pre-selection and badge display', () => {
      window.history.replaceState({}, '', '/get-started.html?tier=custom-website');
      const configurator = new ServiceConfigurator();

      expect(configurator.selectedTier).toBe('custom-website');
      expect(configurator.answers['2']).toBe('no-website');
      expect(configurator.additionalNeeds).toContain('mobile-first');
      expect(configurator.additionalNeeds).toContain('seo');

      const badge = document.getElementById('tierBadge');
      const badgeText = document.getElementById('tierBadgeText');
      expect(badge?.style.display).toBe('inline-flex');
      expect(badgeText?.textContent).toBe('A Brand-New Custom Website');
    });

    it('handles redesign-modernization tier pre-selection and badge display', () => {
      window.history.replaceState({}, '', '/get-started.html?tier=redesign-modernization');
      const configurator = new ServiceConfigurator();

      expect(configurator.selectedTier).toBe('redesign-modernization');
      expect(configurator.answers['2']).toBe('outdated');
      expect(configurator.additionalNeeds).toContain('mobile-first');

      const badge = document.getElementById('tierBadge');
      const badgeText = document.getElementById('tierBadgeText');
      expect(badge?.style.display).toBe('inline-flex');
      expect(badgeText?.textContent).toBe('Complete Website Redesign & Modernization');
    });

    it('handles portals-workflows tier pre-selection and badge display', () => {
      window.history.replaceState({}, '', '/get-started.html?tier=portals-workflows');
      const configurator = new ServiceConfigurator();

      expect(configurator.selectedTier).toBe('portals-workflows');
      expect(configurator.answers['2']).toBe('modern');
      expect(configurator.additionalNeeds).toContain('analytics');

      const badge = document.getElementById('tierBadge');
      const badgeText = document.getElementById('tierBadgeText');
      expect(badge?.style.display).toBe('inline-flex');
      expect(badgeText?.textContent).toBe('Custom Portals & Automated Workflows');
    });
  });
});
