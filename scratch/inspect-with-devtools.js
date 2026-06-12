import { chromium } from '@playwright/test';

(async () => {
  console.log('Launching browser with Chrome DevTools...');
  // Launch non-headless so the user can see and interact with the page
  const browser = await chromium.launch({
    headless: false,
    devtools: true,
  });

  // Create context without viewport constraints if we want standard resizing
  const context = await browser.newContext();
  const page = await context.newPage();

  console.log('Navigating to local dev server http://localhost:5173/ ...');
  await page.goto('http://localhost:5173/', { waitUntil: 'domcontentloaded' });

  console.log('--- BROWSER OPENED ---');
  console.log('You can now use Chrome DevTools to inspect, debug, and test the page.');
  console.log('Close the browser window or the page to end the session.');

  // Keep script running until the page or browser is closed
  await new Promise((resolve) => {
    browser.on('disconnected', () => {
      console.log('Browser window closed.');
      resolve();
    });
    page.on('close', () => {
      console.log('Page closed.');
      resolve();
    });
  });

  await browser.close();
  console.log('Inspection complete.');
})();
