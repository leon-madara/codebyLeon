/**
 * Visual Regression Tests for Homepage
 * 
 * These tests capture screenshots of the homepage in different states
 * and compare them against baseline images to detect visual regressions
 * during CSS architecture refactoring.
 */

import { test, expect } from '@playwright/test';

test.describe('Homepage Visual Regression', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to homepage before each test
    await page.goto('/');
    
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
      fullPage: true,
      animations: 'disabled',
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
      fullPage: true,
      animations: 'disabled',
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
      animations: 'disabled',
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
      animations: 'disabled',
    });
  });

  test('navigation - scrolled state', async ({ page }) => {
    // Scroll down to trigger scrolled state
    await page.evaluate(() => window.scrollTo(0, 200));
    await page.waitForTimeout(500);
    
    // Screenshot navigation in scrolled state
    const nav = page.locator('nav').first();
    await expect(nav).toHaveScreenshot('navigation-scrolled.png', {
      animations: 'disabled',
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
      animations: 'disabled',
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
      animations: 'disabled',
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
        animations: 'disabled',
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
        animations: 'disabled',
      });
    }
  });

  test('responsive - mobile viewport', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForTimeout(500);
    
    // Take full page screenshot
    await expect(page).toHaveScreenshot('homepage-mobile.png', {
      fullPage: true,
      animations: 'disabled',
    });
  });

  test('responsive - tablet viewport', async ({ page }) => {
    // Set tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.waitForTimeout(500);
    
    // Take full page screenshot
    await expect(page).toHaveScreenshot('homepage-tablet.png', {
      fullPage: true,
      animations: 'disabled',
    });
  });
});
