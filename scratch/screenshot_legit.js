import { chromium } from 'playwright';
import path from 'path';
import fs from 'fs';

const OUTPUT_DIR = path.resolve('public');
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

const pages = [
  { name: 'portfolio-legit-dashboard', url: 'http://localhost:8080/admin' },
  { name: 'portfolio-legit-driver', url: 'http://localhost:8080/driver-demo' },
  { name: 'portfolio-legit-lookup', url: 'http://localhost:8080/find' },
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
    await desktopPage.waitForTimeout(1500); // Give dashboard time to fetch
    await desktopPage.screenshot({
      path: path.join(OUTPUT_DIR, `${pageInfo.name}-desktop.png`),
      fullPage: false,
    });
    await desktopContext.close();

    // 2. Mobile Screenshot
    const mobileContext = await browser.newContext({
      viewport: { width: 390, height: 844 },
      userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0.3 Mobile/15E148 Safari/604.1',
      deviceScaleFactor: 2,
      isMobile: true,
      hasTouch: true,
    });
    const mobilePage = await mobileContext.newPage();
    await mobilePage.goto(pageInfo.url, { waitUntil: 'networkidle' });
    await mobilePage.waitForTimeout(1500);
    await mobilePage.screenshot({
      path: path.join(OUTPUT_DIR, `${pageInfo.name}-mobile.png`),
      fullPage: false,
    });
    await mobileContext.close();
  }

  // Take screenshot of the public tracking details if possible by looking up a mock delivery
  console.log('Capturing public tracking details...');
  const desktopContext = await browser.newContext({
    viewport: { width: 1280, height: 800 },
    deviceScaleFactor: 1,
  });
  const desktopPage = await desktopContext.newPage();
  
  // Let's go to delivery-demo and see if we can open a public tracking page
  await desktopPage.goto('http://localhost:8080/delivery-demo', { waitUntil: 'networkidle' });
  await desktopPage.waitForTimeout(1000);
  
  // Take screenshot of delivery-demo as a fallback tracking details page
  await desktopPage.screenshot({
    path: path.join(OUTPUT_DIR, 'portfolio-legit-tracking-desktop.png'),
    fullPage: false,
  });
  await desktopContext.close();

  // Mobile tracking details
  const mobileContext = await browser.newContext({
    viewport: { width: 390, height: 844 },
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0.3 Mobile/15E148 Safari/604.1',
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
  });
  const mobilePage = await mobileContext.newPage();
  await mobilePage.goto('http://localhost:8080/delivery-demo', { waitUntil: 'networkidle' });
  await mobilePage.waitForTimeout(1000);
  await mobilePage.screenshot({
    path: path.join(OUTPUT_DIR, 'portfolio-legit-tracking-mobile.png'),
    fullPage: false,
  });
  await mobileContext.close();

  await browser.close();
  console.log('All Legit Logistics screenshots captured successfully!');
})();
