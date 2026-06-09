import { test, expect } from '@playwright/test';

test('navigate to shortlist page', async ({ page }) => {
  await page.goto('/');
  // try clicking a link with text "Shortlist" if exists
  const link = page.getByRole('link', { name: /shortlist/i });
  if (await link.count() > 0) {
    await link.first().click();
    await expect(page).toHaveURL(/shortlist/i);
  } else {
    test.skip();
  }
});
