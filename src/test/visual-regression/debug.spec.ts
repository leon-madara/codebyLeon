import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import { PNG } from 'pngjs';
import pixelmatch from 'pixelmatch';

test('Compare screenshot with baseline', async ({ page }) => {
  await page.goto('http://localhost:5173/');
  const screenshotPath = 'current.png';
  await page.screenshot({ path: screenshotPath });

  const baselinePath = 'c:/Users/Leon/Pictures/Screenshots/Screenshot 2026-02-10 035834.png';

  const img1 = PNG.sync.read(fs.readFileSync(baselinePath));
  const img2 = PNG.sync.read(fs.readFileSync(screenshotPath));
  const { width, height } = img1;
  const diff = new PNG({ width, height });

  const numDiffPixels = pixelmatch(img1.data, img2.data, diff.data, width, height, { threshold: 0.1 });

  if (numDiffPixels > 0) {
    fs.writeFileSync('diff.png', PNG.sync.write(diff));
  }

  expect(numDiffPixels).toBe(0);
});