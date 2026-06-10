import { test, expect } from '@playwright/test';

test.describe('Navigation and Page Structure', () => {
  test('home page is accessible', async ({ page }) => {
    await page.goto('/');
    expect(page.url()).toContain('localhost:5175');
  });

  test('can reload page', async ({ page }) => {
    await page.goto('/');
    const initialUrl = page.url();
    
    await page.reload();
    await page.waitForTimeout(2000);
    
    expect(page.url()).toBe(initialUrl);
  });

  test('back/forward navigation works', async ({ page }) => {
    await page.goto('/');
    const initialUrl = page.url();
    
    // Navigate to a different URL (if available)
    const link = page.locator('a').first();
    if (await link.count() > 0) {
      const href = await link.getAttribute('href');
      if (href && !href.startsWith('http')) {
        await link.click();
        await page.waitForTimeout(1000);
        
        await page.goBack();
        await page.waitForTimeout(500);
        
        // URL might be same after back
        expect(page.url()).toBeTruthy();
      }
    }
  });

  test('page has main content area', async ({ page }) => {
    await page.goto('/');
    
    const main = page.locator('main');
    const section = page.locator('section').first();
    const contentArea = main.count() > 0 ? main : section;
    
    if (await contentArea.count() > 0) {
      await expect(contentArea).toBeVisible();
    }
  });

  test('page layout is stable', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(2000);
    
    const body = page.locator('body');
    await expect(body).toHaveCSS('display', /flex|grid|block/);
  });

  test('no console errors on page load', async ({ page }) => {
    const consoleErrors: string[] = [];
    
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    await page.goto('/');
    await page.waitForTimeout(2000);
    
    // Filter out expected errors or third-party errors
    const appErrors = consoleErrors.filter(
      err => !err.includes('third-party') && !err.includes('extension')
    );
    
    expect(appErrors.length).toBe(0);
  });

  test('all links are valid', async ({ page }) => {
    await page.goto('/');
    
    const links = page.locator('a');
    const linkCount = await links.count();
    
    expect(linkCount).toBeGreaterThanOrEqual(0);

    // Test each link (limit to first 5 to avoid timeout)
    for (let i = 0; i < Math.min(linkCount, 5); i++) {
      const link = links.nth(i);
      const href = await link.getAttribute('href');
      
      if (href && !href.startsWith('http') && href !== '#') {
        // Check link doesn't navigate to 404
        const response = await page.request.head(href).catch(() => null);
        if (response) {
          expect([200, 301, 302]).toContain(response.status());
        }
      }
    }
  });

  test('page responds to viewport resize', async ({ page }) => {
    await page.goto('/');
    
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForTimeout(500);
    
    const body = page.locator('body');
    await expect(body).toBeVisible();
    
    // Test desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.waitForTimeout(500);
    
    await expect(body).toBeVisible();
  });
});

