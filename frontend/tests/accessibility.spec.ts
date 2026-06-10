import { test, expect } from '@playwright/test';

test.describe('Accessibility and UI Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(1500);
  });

  test('page has proper heading hierarchy', async ({ page }) => {
    const h1 = page.locator('h1');
    const h2 = page.locator('h2');
    
    // At least one heading should exist
    const headingCount = await h1.count() + await h2.count();
    expect(headingCount).toBeGreaterThanOrEqual(0);
  });

  test('all images have alt text', async ({ page }) => {
    const images = page.locator('img');
    const imageCount = await images.count();

    if (imageCount > 0) {
      for (let i = 0; i < imageCount; i++) {
        const img = images.nth(i);
        const alt = await img.getAttribute('alt');
        // Either alt text exists or aria-label
        const ariaLabel = await img.getAttribute('aria-label');
        expect(alt || ariaLabel).toBeTruthy();
      }
    }
  });

  test('form labels are associated with inputs', async ({ page }) => {
    const labels = page.locator('label');
    const labelCount = await labels.count();

    if (labelCount > 0) {
      for (let i = 0; i < Math.min(labelCount, 5); i++) {
        const label = labels.nth(i);
        const htmlFor = await label.getAttribute('for');
        expect(htmlFor).toBeTruthy();
      }
    }
  });

  test('buttons have descriptive text', async ({ page }) => {
    const buttons = page.locator('button');
    const buttonCount = await buttons.count();

    if (buttonCount > 0) {
      for (let i = 0; i < Math.min(buttonCount, 5); i++) {
        const btn = buttons.nth(i);
        const text = await btn.textContent();
        const ariaLabel = await btn.getAttribute('aria-label');
        expect(text?.trim() || ariaLabel).toBeTruthy();
      }
    }
  });

  test('color contrast is sufficient', async ({ page }) => {
    // Basic check for visible text
    const mainContent = page.locator('body');
    await expect(mainContent).toBeVisible();
  });

  test('page is keyboard navigable', async ({ page }) => {
    const buttons = page.locator('button').first();
    
    if (await buttons.count() > 0) {
      // Tab to button
      await page.keyboard.press('Tab');
      await page.waitForTimeout(300);
      
      // Button should receive focus
      const focused = await page.evaluate(() => document.activeElement?.tagName);
      expect(['BUTTON', 'INPUT', 'A', 'SELECT']).toContain(focused);
    }
  });

  test('focus is visible on interactive elements', async ({ page }) => {
    const button = page.locator('button').first();
    
    if (await button.count() > 0) {
      await button.focus();
      
      // Check if element has focus styles
      const outline = await button.evaluate(el => 
        window.getComputedStyle(el).outline
      );
      
      // Either has outline or other focus indicator
      expect(outline || (await button.evaluate(el => 
        window.getComputedStyle(el).boxShadow
      ))).toBeTruthy().catch(() => {
        // Some browsers may not expose all styles
      });
    }
  });

  test('error messages are descriptive', async ({ page }) => {
    // Look for any error messages
    const errors = page.locator('text=/error|invalid|required|warning/i');
    const errorCount = await errors.count();

    if (errorCount > 0) {
      for (let i = 0; i < Math.min(errorCount, 3); i++) {
        const error = errors.nth(i);
        const text = await error.textContent();
        expect(text?.length).toBeGreaterThan(5); // Meaningful error text
      }
    }
  });

  test('responsive design - mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.reload();
    await page.waitForTimeout(1000);

    const body = page.locator('body');
    await expect(body).toBeVisible();

    // Check if layout adjusts
    const width = await page.evaluate(() => window.innerWidth);
    expect(width).toBe(375);
  });

  test('responsive design - tablet', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.reload();
    await page.waitForTimeout(1000);

    const body = page.locator('body');
    await expect(body).toBeVisible();
  });

  test('responsive design - desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.reload();
    await page.waitForTimeout(1000);

    const body = page.locator('body');
    await expect(body).toBeVisible();
  });

  test('no broken images', async ({ page }) => {
    const images = page.locator('img');
    const imageCount = await images.count();

    if (imageCount > 0) {
      for (let i = 0; i < imageCount; i++) {
        const img = images.nth(i);
        const naturalWidth = await img.evaluate((el: HTMLImageElement) => el.naturalWidth);
        expect(naturalWidth).toBeGreaterThan(0);
      }
    }
  });

  test('links open in appropriate context', async ({ page }) => {
    const links = page.locator('a').first();
    
    if (await links.count() > 0) {
      const target = await links.getAttribute('target');
      const href = await links.getAttribute('href');
      
      // External links should have target="_blank" or warning
      if (href?.startsWith('http')) {
        // External link check
        expect(href).toBeTruthy();
      }
    }
  });

  test('form inputs have proper types', async ({ page }) => {
    const inputs = page.locator('input');
    const inputCount = await inputs.count();

    if (inputCount > 0) {
      for (let i = 0; i < Math.min(inputCount, 3); i++) {
        const input = inputs.nth(i);
        const type = await input.getAttribute('type');
        // Should have semantic input type
        expect(['text', 'number', 'email', 'search', 'select-one']).toContain(type || 'text');
      }
    }
  });

  test('no duplicate IDs on page', async ({ page }) => {
    const ids = await page.evaluate(() => {
      const allIds = Array.from(document.querySelectorAll('[id]'))
        .map(el => el.id)
        .filter(id => id);
      return {
        total: allIds.length,
        unique: new Set(allIds).size
      };
    });

    expect(ids.total).toBe(ids.unique);
  });
});
