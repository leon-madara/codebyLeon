/**
 * Visual Regression Tests for Homepage
 * 
 * These tests capture screenshots of the homepage in different states
 * and compare them against baseline images to detect visual regressions
 * during CSS architecture refactoring.
 */

import { test, expect } from '@playwright/test';

test.describe('Homepage Visual Regression', () => {
  const screenshotOptions = {
    animations: 'disabled' as const,
    caret: 'hide' as const,
    timeout: 20000,
  };

  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      document.documentElement.setAttribute('data-visual-test', '1');
    });

    // Navigate to homepage before each test
    await page.goto('/?e2e=1');
    
    // Wait for page to be fully loaded
    await page.waitForLoadState('networkidle');
    
    // Wait for any animations to complete
    await page.waitForTimeout(1000);
  });

  test('homepage light theme - full page', async ({ page }) => {
    // Ensure light theme is active
    await page.evaluate(() => {
      document.documentElement.setAttribute('data-theme', 'light');
    });
    
    await page.waitForTimeout(500);
    
    // Take full page screenshot
    await expect(page).toHaveScreenshot('homepage-light-full.png', {
      ...screenshotOptions,
    });
  });

  test('homepage dark theme - full page', async ({ page }) => {
    // Switch to dark theme
    await page.evaluate(() => {
      document.documentElement.setAttribute('data-theme', 'dark');
    });
    
    await page.waitForTimeout(500);
    
    // Take full page screenshot
    await expect(page).toHaveScreenshot('homepage-dark-full.png', {
      ...screenshotOptions,
    });
  });

  test('navigation - light theme', async ({ page }) => {
    // Ensure light theme
    await page.evaluate(() => {
      document.documentElement.setAttribute('data-theme', 'light');
    });
    
    await page.waitForTimeout(500);
    
    // Screenshot just the navigation
    const nav = page.locator('nav').first();
    await expect(nav).toHaveScreenshot('navigation-light.png', {
      ...screenshotOptions,
    });
  });

  test('navigation - dark theme', async ({ page }) => {
    // Switch to dark theme
    await page.evaluate(() => {
      document.documentElement.setAttribute('data-theme', 'dark');
    });
    
    await page.waitForTimeout(500);
    
    // Screenshot just the navigation
    const nav = page.locator('nav').first();
    await expect(nav).toHaveScreenshot('navigation-dark.png', {
      ...screenshotOptions,
    });
  });

  test('navigation - scrolled state', async ({ page }) => {
    // Force scrolled-state modifier for deterministic screenshot capture.
    await page.evaluate(() => {
      document.querySelector('nav')?.classList.add('is-scrolled');
    });
    await page.waitForTimeout(500);
    
    // Screenshot navigation in scrolled state
    const nav = page.locator('nav').first();
    await expect(nav).toHaveScreenshot('navigation-scrolled.png', {
      ...screenshotOptions,
    });
  });

  test('hero section - light theme', async ({ page }) => {
    await page.evaluate(() => {
      document.documentElement.setAttribute('data-theme', 'light');
    });
    
    await page.waitForTimeout(500);
    
    // Screenshot hero section
    const hero = page.locator('section').first();
    await expect(hero).toHaveScreenshot('hero-light.png', {
      ...screenshotOptions,
    });
  });

  test('hero section - dark theme', async ({ page }) => {
    await page.evaluate(() => {
      document.documentElement.setAttribute('data-theme', 'dark');
    });
    
    await page.waitForTimeout(500);
    
    // Screenshot hero section
    const hero = page.locator('section').first();
    await expect(hero).toHaveScreenshot('hero-dark.png', {
      ...screenshotOptions,
    });
  });

  test('portfolio section - light theme', async ({ page }) => {
    await page.evaluate(() => {
      document.documentElement.setAttribute('data-theme', 'light');
    });

    await page.waitForTimeout(500);

    const portfolio = page.locator('#portfolio');
    await expect(portfolio).toHaveScreenshot('portfolio-light.png', {
      ...screenshotOptions,
    });
  });

  test('portfolio section - dark theme', async ({ page }) => {
    await page.evaluate(() => {
      document.documentElement.setAttribute('data-theme', 'dark');
    });

    await page.waitForTimeout(500);

    const portfolio = page.locator('#portfolio');
    await expect(portfolio).toHaveScreenshot('portfolio-dark.png', {
      ...screenshotOptions,
    });
  });

  test('buttons - light theme', async ({ page }) => {
    await page.evaluate(() => {
      document.documentElement.setAttribute('data-theme', 'light');
    });
    
    await page.waitForTimeout(500);
    
    // Find all buttons and screenshot them
    const buttons = page.locator('button, a[class*="button"], a[class*="cta"]');
    const count = await buttons.count();
    
    if (count > 0) {
      const firstButton = buttons.first();
      await expect(firstButton).toHaveScreenshot('button-light.png', {
        ...screenshotOptions,
      });
    }
  });

  test('buttons - dark theme', async ({ page }) => {
    await page.evaluate(() => {
      document.documentElement.setAttribute('data-theme', 'dark');
    });
    
    await page.waitForTimeout(500);
    
    // Find all buttons and screenshot them
    const buttons = page.locator('button, a[class*="button"], a[class*="cta"]');
    const count = await buttons.count();
    
    if (count > 0) {
      const firstButton = buttons.first();
      await expect(firstButton).toHaveScreenshot('button-dark.png', {
        ...screenshotOptions,
      });
    }
  });

  test('responsive - mobile viewport', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/?e2e=1');
    await page.waitForTimeout(500);
    
    // Take full page screenshot
    await expect(page).toHaveScreenshot('homepage-mobile.png', {
      ...screenshotOptions,
    });
  });

  test('responsive - tablet viewport', async ({ page }) => {
    // Set tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/?e2e=1');
    await page.waitForTimeout(500);
    
    // Take full page screenshot
    await expect(page).toHaveScreenshot('homepage-tablet.png', {
      ...screenshotOptions,
    });
  });
});
