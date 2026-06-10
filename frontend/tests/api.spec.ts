import { test, expect } from '@playwright/test';

test.describe('Car Advisor API Tests', () => {
  test('GET /api/cars returns car list', async ({ page }) => {
    const response = await page.request.get('/api/cars');
    expect(response.status()).toBe(200);
    
    const data = await response.json();
    expect(Array.isArray(data)).toBeTruthy();
    expect(data.length).toBeGreaterThan(0);
    
    // Verify car data structure
    data.forEach((car: any) => {
      expect(car).toHaveProperty('id');
      expect(car).toHaveProperty('model');
      expect(car).toHaveProperty('price_lakh');
      expect(car).toHaveProperty('fuel');
      expect(car).toHaveProperty('mileage_kmpl');
      expect(car).toHaveProperty('safety_rating');
    });
  });

  test('POST /api/shortlist with budget filter', async ({ page }) => {
    const payload = { budget: 10 };
    const response = await page.request.post('/api/shortlist', {
      data: payload,
    });
    
    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(Array.isArray(data)).toBeTruthy();
    
    // All cars should be within budget
    data.forEach((car: any) => {
      expect(car.price_lakh).toBeLessThanOrEqual(10);
    });
  });

  test('POST /api/shortlist with fuel type filter', async ({ page }) => {
    const payload = { fuel: 'Petrol' };
    const response = await page.request.post('/api/shortlist', {
      data: payload,
    });
    
    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(Array.isArray(data)).toBeTruthy();
    
    // All cars should be Petrol
    data.forEach((car: any) => {
      expect(car.fuel).toBe('Petrol');
    });
  });

  test('POST /api/shortlist with usage filter', async ({ page }) => {
    const payload = { usage: 'city' };
    const response = await page.request.post('/api/shortlist', {
      data: payload,
    });
    
    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(Array.isArray(data)).toBeTruthy();
  });

  test('POST /api/shortlist with priority filter', async ({ page }) => {
    const payload = { priority: 'safety' };
    const response = await page.request.post('/api/shortlist', {
      data: payload,
    });
    
    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(Array.isArray(data)).toBeTruthy();
    expect(data.length).toBeGreaterThan(0);
  });

  test('POST /api/shortlist with multiple filters', async ({ page }) => {
    const payload = {
      budget: 15,
      fuel: 'Petrol',
      usage: 'city',
      priority: 'mileage'
    };
    const response = await page.request.post('/api/shortlist', {
      data: payload,
    });
    
    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(Array.isArray(data)).toBeTruthy();
  });

  test('POST /api/shortlist with invalid fuel type returns 400', async ({ page }) => {
    const payload = { fuel: 'InvalidFuel' };
    const response = await page.request.post('/api/shortlist', {
      data: payload,
    });
    
    expect(response.status()).toBe(400);
    const data = await response.json();
    expect(data).toHaveProperty('error');
  });

  test('POST /api/shortlist without filters returns 400', async ({ page }) => {
    const payload = {};
    const response = await page.request.post('/api/shortlist', {
      data: payload,
    });
    
    expect(response.status()).toBe(400);
  });
});
