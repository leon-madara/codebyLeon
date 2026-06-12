import { chromium } from 'playwright';
import path from 'path';
import fs from 'fs';

const OUTPUT_DIR = path.resolve('public/portfolio/case-studies/delivah');
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

const pages = [
  { name: 'delivah-home-hero', url: 'http://localhost:8080/' },
  { name: 'delivah-services', url: 'http://localhost:8080/services' },
  { name: 'delivah-contact-form', url: 'http://localhost:8080/contact' },
  { name: 'delivah-register-step-1', url: 'http://localhost:8080/register' },
  { name: 'delivah-admin-login', url: 'http://localhost:8080/admin' }, // This should render the AdminDashboard
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
    await desktopPage.waitForTimeout(1000);
    await desktopPage.screenshot({
      path: path.join(OUTPUT_DIR, `${pageInfo.name}-desktop.png`),
      fullPage: false,
    });
    await desktopContext.close();

    // 2. Mobile Screenshot
    const mobileContext = await browser.newContext({
      viewport: { width: 390, height: 844 },
      userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0.3 Mobile/15E148 Safari/604.1',
      deviceScaleFactor: 2, // 2x DPI is plenty and keeps size down
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

  // 3. Document Upload Step (Step 4 of registration)
  console.log('Capturing delivah-register-document-upload...');
  const desktopContext = await browser.newContext({
    viewport: { width: 1280, height: 800 },
    deviceScaleFactor: 1,
  });
  const desktopPage = await desktopContext.newPage();
  await desktopPage.goto('http://localhost:8080/register', { waitUntil: 'networkidle' });
  await desktopPage.waitForTimeout(1000);
  
  // Click "Next" button 3 times to get to step 4
  // The button has text "Next"
  for (let i = 0; i < 3; i++) {
    await desktopPage.click('button:has-text("Next")');
    await desktopPage.waitForTimeout(300);
  }
  
  await desktopPage.screenshot({
    path: path.join(OUTPUT_DIR, 'delivah-register-document-upload-desktop.png'),
    fullPage: false,
  });
  await desktopContext.close();

  // Mobile view of Document Upload
  const mobileContext = await browser.newContext({
    viewport: { width: 390, height: 844 },
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0.3 Mobile/15E148 Safari/604.1',
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
  });
  const mobilePage = await mobileContext.newPage();
  await mobilePage.goto('http://localhost:8080/register', { waitUntil: 'networkidle' });
  await mobilePage.waitForTimeout(1000);
  
  for (let i = 0; i < 3; i++) {
    await mobilePage.click('button:has-text("Next")');
    await mobilePage.waitForTimeout(300);
  }
  
  await mobilePage.screenshot({
    path: path.join(OUTPUT_DIR, 'delivah-register-document-upload-mobile.png'),
    fullPage: false,
  });
  await mobileContext.close();

  await browser.close();
  console.log('All Delivah screenshots captured successfully!');
})();
