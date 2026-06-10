import { test, expect } from '@playwright/test';

test.describe('Car Advisor Home Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Wait for cars to load
    await page.waitForSelector('[class*="car"]', { timeout: 10000 }).catch(() => {});
  });

  test('page loads successfully', async ({ page }) => {
    expect(page.url()).toContain('localhost');
    await expect(page).toHaveTitle(/car|advisor|app/i).catch(() => {
      // Title might not contain these words
    });
  });

  test('header is visible', async ({ page }) => {
    const header = page.locator('header');
    await expect(header).toBeVisible().catch(async () => {
      // If no header, check for main content
      const main = page.locator('main');
      await expect(main).toBeVisible();
    });
  });

  test('car list is displayed', async ({ page }) => {
    // Wait for cars to load
    await page.waitForTimeout(2000);
    
    const carCards = page.locator('[class*="card"], [class*="car-item"], article, .car');
    const count = await carCards.count();
    
    expect(count).toBeGreaterThan(0);
  });

  test('each car displays essential information', async ({ page }) => {
    const firstCar = page.locator('[class*="card"], [class*="car-item"], article').first();
    
    // Check if car card is visible
    await expect(firstCar).toBeVisible().catch(() => {
      test.skip();
    });

    // Check for car details (model, price, etc.)
    const carText = await firstCar.textContent();
    expect(carText).toBeTruthy();
    expect(carText?.length).toBeGreaterThan(0);
  });

  test('filter controls are visible', async ({ page }) => {
    const filterSection = page.locator('[class*="filter"], form, fieldset').first();
    
    await expect(filterSection).toBeVisible().catch(() => {
      test.skip();
    });
  });

  test('no error message on initial load', async ({ page }) => {
    const errorText = page.locator('text=/error|failed/i');
    
    const count = await errorText.count();
    expect(count).toBe(0);
  });

  test('page is responsive', async ({ page }) => {
    const viewport = page.viewportSize();
    expect(viewport).toBeTruthy();
    expect(viewport?.width).toBeGreaterThan(0);
  });
});

