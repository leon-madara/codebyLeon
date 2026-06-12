import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    await page.goto('http://localhost:5173/work/legit-logistics', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);

    const data = await page.evaluate(() => {
      const sec2 = document.querySelector('[data-design="v2"]');
      if (!sec2) return { error: 'Section v2 not found' };

      const title = sec2.querySelector('.v1-title');
      const meta = sec2.querySelector('.v1-meta');
      const body = document.body;

      return {
        sectionBg: window.getComputedStyle(sec2).backgroundColor,
        sectionColor: window.getComputedStyle(sec2).color,
        titleBg: title ? window.getComputedStyle(title).backgroundColor : 'N/A',
        titleColor: title ? window.getComputedStyle(title).color : 'N/A',
        bodyBg: window.getComputedStyle(body).backgroundColor,
      };
    });

    console.log('COMPUTED STYLES FOR LEGIT LOGISTICS:', JSON.stringify(data, null, 2));

  } catch (err) {
    console.error('Error during execution:', err);
  } finally {
    await browser.close();
  }
})();
