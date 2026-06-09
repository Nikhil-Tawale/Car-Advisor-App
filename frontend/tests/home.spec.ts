import { test, expect } from '@playwright/test';

test('homepage shows app title', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('h1')).toHaveCount(1);
});
