import { expect, test } from '@playwright/test';

interface SmoothPlan {
  enterY: number;
  midY: number;
  servicesY: number;
  smoothWrapperPosition: string;
}

interface SmoothSnapshot {
  scrollY: number;
  wrapperTransform: string;
  wrapperInlineStyle: string;
  portfolioTop: number;
  portfolioBottom: number;
  portfolioPosition: string;
  hsTop: number;
  hsBottom: number;
  hsPosition: string;
  hsPinSpacerClass: string;
  smoothContentTransform: string;
}

test.describe('Smooth-Mode Pinning Invariants', () => {
  test('portfolio and services chrome stay pinned with ScrollSmoother enabled', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1100);

    const plan = await page.evaluate((): SmoothPlan | null => {
      document.documentElement.style.scrollBehavior = 'auto';
      document.body.style.scrollBehavior = 'auto';

      const wrapper = document.querySelector('.portfolio-carousel__wrapper') as HTMLElement | null;
      const portfolio = document.querySelector('#portfolio') as HTMLElement | null;
      const services = document.querySelector('#services') as HTMLElement | null;
      const smoothWrapper = document.querySelector('#smooth-wrapper') as HTMLElement | null;
      if (!wrapper || !portfolio || !services || !smoothWrapper) return null;

      const wrapperRect = wrapper.getBoundingClientRect();
      const portfolioRect = portfolio.getBoundingClientRect();
      const servicesRect = services.getBoundingClientRect();
      const wrapperDocTop = wrapperRect.top + window.scrollY;
      const servicesDocTop = servicesRect.top + window.scrollY;
      const holdDistance = Math.max(wrapperRect.height - portfolioRect.height, 0);
      const maxScroll = Math.max(
        document.documentElement.scrollHeight - window.innerHeight,
        0
      );
      const clampTarget = (value: number) =>
        Math.max(0, Math.min(Math.round(value), Math.max(maxScroll - 40, 0)));

      return {
        enterY: clampTarget(wrapperDocTop + 24),
        midY: clampTarget(wrapperDocTop + Math.max(180, holdDistance * 0.55)),
        servicesY: clampTarget(servicesDocTop + 120),
        smoothWrapperPosition: getComputedStyle(smoothWrapper).position,
      };
    });

    expect(plan).not.toBeNull();
    if (!plan) return;

    expect(plan.smoothWrapperPosition).toBe('fixed');

    const captureAt = async (targetY: number): Promise<SmoothSnapshot> => {
      return page.evaluate(async (y) => {
        window.scrollTo({ top: y, left: 0, behavior: 'auto' });
        await new Promise((resolve) => setTimeout(resolve, 1800));

        const wrapper = document.querySelector('.portfolio-carousel__wrapper') as HTMLElement;
        const portfolio = document.querySelector('#portfolio') as HTMLElement;
        const hsTopChrome = document.querySelector('.hs__top-chrome') as HTMLElement;
        const smoothContent = document.querySelector('#smooth-content') as HTMLElement;

        const portfolioRect = portfolio.getBoundingClientRect();
        const hsRect = hsTopChrome.getBoundingClientRect();

        return {
          scrollY: Math.round(window.scrollY),
          wrapperTransform: getComputedStyle(wrapper).transform,
          wrapperInlineStyle: wrapper.getAttribute('style') || '',
          portfolioTop: Number(portfolioRect.top.toFixed(2)),
          portfolioBottom: Number(portfolioRect.bottom.toFixed(2)),
          portfolioPosition: getComputedStyle(portfolio).position,
          hsTop: Number(hsRect.top.toFixed(2)),
          hsBottom: Number(hsRect.bottom.toFixed(2)),
          hsPosition: getComputedStyle(hsTopChrome).position,
          hsPinSpacerClass: hsTopChrome.parentElement?.className || '',
          smoothContentTransform: getComputedStyle(smoothContent).transform,
        };
      }, targetY);
    };

    const enter = await captureAt(plan.enterY);
    const mid = await captureAt(plan.midY);
    const services = await captureAt(plan.servicesY);

    expect(Math.abs(enter.portfolioTop)).toBeLessThanOrEqual(8);
    expect(Math.abs(mid.portfolioTop)).toBeLessThanOrEqual(8);
    expect(mid.smoothContentTransform).not.toBe('none');

    expect(Math.abs(services.hsTop)).toBeLessThanOrEqual(16);
    expect(services.hsPinSpacerClass).toContain('pin-spacer');

    expect(enter.wrapperTransform).toBe('none');
    expect(mid.wrapperTransform).toBe('none');
    expect(services.wrapperTransform).toBe('none');
    expect(enter.wrapperInlineStyle).not.toContain('transform');
    expect(mid.wrapperInlineStyle).not.toContain('transform');
    expect(services.wrapperInlineStyle).not.toContain('transform');
  });
});
