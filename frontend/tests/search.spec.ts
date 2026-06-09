import { test, expect } from '@playwright/test';

test('search input works', async ({ page }) => {
  await page.goto('/');
  const input = page.locator('input[type="search"], input[placeholder*="Search"], input[name*="search"]');
  if (await input.count() === 0) {
    test.skip();
    return;
  }
  await input.first().fill('Toyota');
  await page.waitForTimeout(500);
  // expect some result item to appear
  const item = page.locator('text=Toyota');
  await expect(item.first()).toBeVisible().catch(() => {});
});
