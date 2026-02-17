import { expect, test } from '@playwright/test';

interface SnapshotData {
  scrollY: number;
  wrapperTransform: string;
  wrapperInlineStyle: string;
  portfolioTransform: string;
  portfolioInlineStyle: string;
  portfolioTop: number;
  portfolioBottom: number;
  portfolioPosition: string;
  aboutTop: number;
}

test.describe('Portfolio Pinning Invariants', () => {
  test('portfolio remains sticky and wrapper is never transformed by runtime JS', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(700);

    const scrollPlan = await page.evaluate(() => {
      document.documentElement.style.scrollBehavior = 'auto';
      document.body.style.scrollBehavior = 'auto';

      const wrapper = document.querySelector('.portfolio-sticky-wrapper') as HTMLElement | null;
      const portfolio = document.querySelector('#portfolio') as HTMLElement | null;
      if (!wrapper || !portfolio) return null;

      const wrapperRect = wrapper.getBoundingClientRect();
      const portfolioRect = portfolio.getBoundingClientRect();
      const wrapperDocTop = wrapperRect.top + window.scrollY;
      const wrapperHeight = wrapperRect.height;
      const portfolioHeight = portfolioRect.height;

      const holdContract = getComputedStyle(wrapper).getPropertyValue('--portfolio-hold-distance').trim();
      const holdValue = Number.parseFloat(holdContract || '0');
      const holdPx = holdContract.endsWith('vh') ? (window.innerHeight * holdValue) / 100 : holdValue;

      const enterY = Math.max(0, Math.round(wrapperDocTop + 24));
      const midY = Math.max(
        enterY + 20,
        Math.round(wrapperDocTop + Math.min(Math.max(holdPx * 0.5, 80), Math.max(120, wrapperHeight - portfolioHeight - 40)))
      );
      const postY = Math.max(
        midY + 20,
        Math.round(wrapperDocTop + Math.max(wrapperHeight - portfolioHeight + 40, holdPx + 120))
      );

      return { enterY, midY, postY };
    });

    expect(scrollPlan).not.toBeNull();
    if (!scrollPlan) return;

    const captureAt = async (targetY: number): Promise<SnapshotData> => {
      return page.evaluate(async (y) => {
        window.scrollTo({ top: y, left: 0, behavior: 'auto' });
        await new Promise((resolve) => setTimeout(resolve, 60));

        const wrapper = document.querySelector('.portfolio-sticky-wrapper') as HTMLElement;
        const portfolio = document.querySelector('#portfolio') as HTMLElement;
        const about = document.querySelector('#about') as HTMLElement;

        const portfolioRect = portfolio.getBoundingClientRect();
        const aboutRect = about.getBoundingClientRect();

        return {
          scrollY: window.scrollY,
          wrapperTransform: getComputedStyle(wrapper).transform,
          wrapperInlineStyle: wrapper.getAttribute('style') || '',
          portfolioTransform: getComputedStyle(portfolio).transform,
          portfolioInlineStyle: portfolio.getAttribute('style') || '',
          portfolioTop: Number(portfolioRect.top.toFixed(2)),
          portfolioBottom: Number(portfolioRect.bottom.toFixed(2)),
          portfolioPosition: getComputedStyle(portfolio).position,
          aboutTop: Number(aboutRect.top.toFixed(2)),
        };
      }, targetY);
    };

    const enter = await captureAt(scrollPlan.enterY);
    const mid = await captureAt(scrollPlan.midY);
    const post = await captureAt(scrollPlan.postY);

    expect(enter.portfolioPosition).toBe('sticky');
    expect(mid.portfolioPosition).toBe('sticky');
    expect(Math.abs(enter.portfolioTop)).toBeLessThanOrEqual(120);
    expect(Math.abs(mid.portfolioTop)).toBeLessThanOrEqual(120);
    expect(enter.portfolioTransform).toBe('none');
    expect(mid.portfolioTransform).toBe('none');
    expect(post.portfolioTransform).toBe('none');
    expect(enter.portfolioInlineStyle).not.toContain('transform');
    expect(mid.portfolioInlineStyle).not.toContain('transform');
    expect(post.portfolioInlineStyle).not.toContain('transform');
    expect(enter.portfolioInlineStyle).not.toContain('position');
    expect(mid.portfolioInlineStyle).not.toContain('position');
    expect(post.portfolioInlineStyle).not.toContain('position');

    expect(enter.wrapperTransform).toBe('none');
    expect(mid.wrapperTransform).toBe('none');
    expect(post.wrapperTransform).toBe('none');
    expect(enter.wrapperInlineStyle).not.toContain('transform');
    expect(mid.wrapperInlineStyle).not.toContain('transform');
    expect(post.wrapperInlineStyle).not.toContain('transform');

    // Guard against large whitespace introduced between portfolio and about during handoff.
    const handoffGap = post.aboutTop - post.portfolioBottom;
    expect(handoffGap).toBeLessThan(500);
  });
});
