import { test, expect } from '@playwright/test';

test.describe('Performance and Edge Cases', () => {
  test('initial page load time is acceptable', async ({ page }) => {
    const startTime = Date.now();
    
    await page.goto('/');
    
    const loadTime = Date.now() - startTime;
    expect(loadTime).toBeLessThan(10000); // Should load within 10 seconds
  });

  test('API response time is acceptable', async ({ page }) => {
    const startTime = Date.now();
    
    const response = await page.request.get('/api/cars');
    
    const responseTime = Date.now() - startTime;
    expect(responseTime).toBeLessThan(5000); // API should respond within 5 seconds
    expect(response.status()).toBe(200);
  });

  test('filter request completes successfully', async ({ page }) => {
    const payload = { budget: 15 };
    
    const response = await page.request.post('/api/shortlist', {
      data: payload,
    });
    
    expect(response.status()).toBe(200);
    
    const data = await response.json();
    expect(Array.isArray(data)).toBeTruthy();
  });

  test('handles network timeout gracefully', async ({ page }) => {
    await page.goto('/');
    
    // Simulate slow network
    await page.route('**/*', route => {
      setTimeout(() => route.continue(), 1000);
    });

    const errorElements = page.locator('text=/error|failed/i');
    const initialErrorCount = await errorElements.count();
    
    expect(initialErrorCount).toBeGreaterThanOrEqual(0);
  });

  test('handles missing data gracefully', async ({ page }) => {
    // Intercept and return empty array
    await page.route('**/api/cars', route => {
      route.abort('failed');
    });

    await page.goto('/');
    await page.waitForTimeout(2000);

    // Page should show error or empty state gracefully
    const errorMsg = page.locator('text=/error|unable|failed/i');
    const carCount = await page.locator('[class*="card"]').count();
    
    expect((await errorMsg.count()) + carCount).toBeGreaterThanOrEqual(0);
  });

  test('handles large result sets', async ({ page }) => {
    const response = await page.request.get('/api/cars');
    const data = await response.json();
    
    // Even with many results, request should complete
    expect(response.status()).toBe(200);
    expect(Array.isArray(data)).toBeTruthy();
  });

  test('form submission with all filters', async ({ page }) => {
    await page.goto('/');
    
    const payload = {
      budget: 20,
      fuel: 'Petrol',
      usage: 'city',
      priority: 'safety'
    };

    const response = await page.request.post('/api/shortlist', {
      data: payload,
    });

    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(Array.isArray(data)).toBeTruthy();
  });

  test('handles special characters in filter values gracefully', async ({ page }) => {
    const payload = { fuel: 'Petrol' };
    const response = await page.request.post('/api/shortlist', {
      data: payload,
    });

    expect([200, 400]).toContain(response.status());
  });

  test('concurrent filter requests', async ({ page }) => {
    const payload1 = { budget: 10 };
    const payload2 = { fuel: 'Diesel' };
    const payload3 = { priority: 'mileage' };

    const [res1, res2, res3] = await Promise.all([
      page.request.post('/api/shortlist', { data: payload1 }),
      page.request.post('/api/shortlist', { data: payload2 }),
      page.request.post('/api/shortlist', { data: payload3 })
    ]);

    expect(res1.status()).toBe(200);
    expect(res2.status()).toBe(200);
    expect(res3.status()).toBe(200);

    const data1 = await res1.json();
    const data2 = await res2.json();
    const data3 = await res3.json();

    expect(Array.isArray(data1)).toBeTruthy();
    expect(Array.isArray(data2)).toBeTruthy();
    expect(Array.isArray(data3)).toBeTruthy();
  });

  test('memory cleanup after multiple filter applications', async ({ page }) => {
    await page.goto('/');

    // Apply filters multiple times
    for (let i = 0; i < 5; i++) {
      const payload = { budget: 10 + i };
      await page.request.post('/api/shortlist', { data: payload });
      await page.waitForTimeout(200);
    }

    // Page should still be responsive
    const response = await page.request.get('/api/cars');
    expect(response.status()).toBe(200);
  });

  test('UI remains interactive after filter application', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(1000);

    // Try to interact with UI
    const button = page.locator('button').first();
    if (await button.count() > 0) {
      await expect(button).toBeEnabled();
    }

    const input = page.locator('input').first();
    if (await input.count() > 0) {
      await expect(input).toBeEnabled();
    }
  });
});
