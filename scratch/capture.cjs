const { chromium } = require('@playwright/test');
const path = require('path');
const fs = require('fs');

async function run() {
  console.log('Launching browser...');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 }
  });
  const page = await context.newPage();

  console.log('Navigating to dashboard...');
  await page.goto('http://localhost:8080/dashboard-demo');
  await page.waitForTimeout(2000); // wait for load

  // Click "New Test Order" to ensure there is at least one active job
  console.log('Creating test order...');
  const newOrderButton = page.locator('button:has-text("New Test Order")');
  if (await newOrderButton.isVisible()) {
    await newOrderButton.click();
    await page.waitForTimeout(3000); // wait for creation & toast
  }

  // Reload/re-fetch just in case
  await page.reload();
  await page.waitForTimeout(2000);

  // Take dashboard list screenshot
  console.log('Taking dashboard screenshot...');
  const dashboardPath = path.resolve('public/portfolio-legit-dashboard.png');
  await page.screenshot({ path: dashboardPath });
  console.log(`Saved dashboard screenshot to: ${dashboardPath}`);

  // Get the first delivery row if it exists, and click it
  console.log('Opening delivery details...');
  const deliveryItem = page.locator('.cursor-pointer').first();
  if (await deliveryItem.isVisible()) {
    await deliveryItem.click();
    await page.waitForTimeout(2000);
    // Take details view screenshot
    const detailsPath = path.resolve('public/portfolio-legit-dashboard-details.png');
    await page.screenshot({ path: detailsPath });
    console.log(`Saved details screenshot to: ${detailsPath}`);
  }

  // Go to Driver Demo
  console.log('Navigating to driver demo...');
  const driverPage = await context.newPage();
  await driverPage.setViewportSize({ width: 375, height: 812 }); // iPhone X size for driver app
  await driverPage.goto('http://localhost:8080/driver-demo');
  await driverPage.waitForTimeout(2000);

  // Click the first job
  const jobItem = driverPage.locator('.cursor-pointer').first();
  if (await jobItem.isVisible()) {
    await jobItem.click();
    await driverPage.waitForTimeout(2000);
    // Take driver job status control view
    const driverPath = path.resolve('public/portfolio-legit-driver.png');
    await driverPage.screenshot({ path: driverPath });
    console.log(`Saved driver app screenshot to: ${driverPath}`);
  }

  // Go to Customer Tracking (Order Lookup or specific order)
  console.log('Navigating to Order Lookup / Customer tracking...');
  const trackingPage = await context.newPage();
  await trackingPage.setViewportSize({ width: 1024, height: 768 }); // Tablet size
  await trackingPage.goto('http://localhost:8080/find');
  await trackingPage.waitForTimeout(2000);

  // Take lookup screenshot
  const lookupPath = path.resolve('public/portfolio-legit-lookup.png');
  await trackingPage.screenshot({ path: lookupPath });
  console.log(`Saved lookup screenshot to: ${lookupPath}`);

  // Let's check if we have an active tracking code in the dashboard to look up
  const trkCode = await page.evaluate(() => {
    // search text for TRK-XXXX
    const html = document.body.innerHTML;
    const match = html.match(/TRK-[A-Z0-9]+/i);
    return match ? match[0] : null;
  });

  if (trkCode) {
    console.log(`Found tracking code: ${trkCode}. Navigating to tracking page...`);
    await trackingPage.goto(`http://localhost:8080/track/${trkCode}`);
    await trackingPage.waitForTimeout(3000);
    const trackPath = path.resolve('public/portfolio-legit-tracking.png');
    await trackingPage.screenshot({ path: trackPath });
    console.log(`Saved tracking screenshot to: ${trackPath}`);
  } else {
    console.log('No tracking code found in dashboard text.');
  }

  await browser.close();
  console.log('Screenshot capture process complete!');
}

run().catch(console.error);
