import { expect, test } from '@playwright/test';

test.describe('Process page', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      document.documentElement.setAttribute('data-visual-test', '1');
    });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/process?e2e=1&no-burn=1');
    await page.waitForLoadState('networkidle');
    await page.evaluate(() => document.fonts.ready);
  });

  test('desktop hierarchy, images, FAQ, and overflow', async ({ page }, testInfo) => {
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.reload();
    await page.waitForLoadState('networkidle');

    await expect(page.getByRole('heading', {
      level: 1,
      name: /you bring the ambition\. i'll keep the work clear\./i,
    })).toBeVisible();
    await expect(page.locator('.process-page__journey-step')).toHaveCount(5);
    await expect(page.locator('.process-page__journey-marker', { hasText: '4' })).toBeVisible();

    const imagesLoaded = await page.locator('.process-page img').evaluateAll((images) =>
      images.every((image) => {
        const element = image as HTMLImageElement;
        return element.complete && element.naturalWidth > 0;
      }),
    );
    expect(imagesLoaded).toBe(true);

    await page.getByText('How involved do I need to be?').click();
    await expect(page.getByText(/your involvement is focused around context/i)).toBeVisible();

    const dimensions = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
    }));
    expect(dimensions.scrollWidth).toBe(dimensions.clientWidth);

    await page.screenshot({
      path: testInfo.outputPath('process-desktop-light.png'),
      fullPage: true,
    });
  });

  test('mobile keeps the primary CTA in the opening viewport', async ({ page }, testInfo) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.reload();
    await page.waitForLoadState('networkidle');

    const result = await page.evaluate(() => {
      const cta = document.querySelector<HTMLAnchorElement>(
        '.process-page__hero-actions a[href="/get-started.html"]',
      );
      const rect = cta?.getBoundingClientRect();

      return {
        ctaBottom: rect?.bottom ?? Number.POSITIVE_INFINITY,
        viewportHeight: window.innerHeight,
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
      };
    });

    expect(result.ctaBottom).toBeLessThanOrEqual(result.viewportHeight);
    expect(result.scrollWidth).toBe(result.clientWidth);

    await page.screenshot({
      path: testInfo.outputPath('process-mobile-light.png'),
      fullPage: true,
    });
  });

  test('tablet dark theme remains readable without overflow', async ({ page }, testInfo) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.evaluate(() => {
      document.documentElement.setAttribute('data-theme', 'dark');
    });

    const result = await page.evaluate(() => {
      const pageElement = document.querySelector<HTMLElement>('.process-page');
      const title = document.querySelector<HTMLElement>('.process-page__hero-title');

      return {
        background: pageElement ? getComputedStyle(pageElement).backgroundColor : '',
        titleColor: title ? getComputedStyle(title).color : '',
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
      };
    });

    expect(result.background).not.toBe(result.titleColor);
    expect(result.scrollWidth).toBe(result.clientWidth);

    await page.screenshot({
      path: testInfo.outputPath('process-tablet-dark.png'),
      fullPage: true,
    });
  });
});
