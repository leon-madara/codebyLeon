import { chromium } from 'playwright';
import path from 'path';
import fs from 'fs';

const OUTPUT_DIR = path.resolve('public/portfolio/case-studies/kossy');
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

const pages = [
  { name: 'kossy-home-hero', url: 'http://localhost:3000/' },
  { name: 'kossy-about-values', url: 'http://localhost:3000/about' },
  { name: 'kossy-work-index', url: 'http://localhost:3000/work' },
  { name: 'kossy-work-tassis', url: 'http://localhost:3000/work/tassis-residential-development' },
  { name: 'kossy-mentorship-hero', url: 'http://localhost:3000/mentorship' },
];

(async () => {
  const browser = await chromium.launch({ headless: true });

  for (const pageInfo of pages) {
    console.log(`Capturing ${pageInfo.name}...`);

    // 1. Desktop Screenshot
    const desktopContext = await browser.newContext({
      viewport: { width: 1280, height: 800 },
      deviceScaleFactor: 1,
    });
    const desktopPage = await desktopContext.newPage();
    await desktopPage.goto(pageInfo.url, { waitUntil: 'networkidle' });
    // Wait a brief moment for animations to settle
    await desktopPage.waitForTimeout(1000);
    await desktopPage.screenshot({
      path: path.join(OUTPUT_DIR, `${pageInfo.name}-desktop.png`),
      fullPage: false,
    });
    await desktopContext.close();

    // 2. Mobile Screenshot (iPhone 12 Pro dimensions: 390x844)
    const mobileContext = await browser.newContext({
      viewport: { width: 390, height: 844 },
      userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0.3 Mobile/15E148 Safari/604.1',
      deviceScaleFactor: 1.5,
      isMobile: true,
      hasTouch: true,
    });
    const mobilePage = await mobileContext.newPage();
    await mobilePage.goto(pageInfo.url, { waitUntil: 'networkidle' });
    await mobilePage.waitForTimeout(1000);
    await mobilePage.screenshot({
      path: path.join(OUTPUT_DIR, `${pageInfo.name}-mobile.png`),
      fullPage: false,
    });
    await mobileContext.close();
  }

  await browser.close();
  console.log('All screenshots captured successfully!');
})();
