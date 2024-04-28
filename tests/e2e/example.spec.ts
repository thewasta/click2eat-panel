import { test, expect } from '@playwright/test';

test('has title', async ({ page },testInfo) => {
  await page.goto('/');

  await testInfo.attach("screenshot", {
    body: await page.screenshot(),
    contentType: 'image/png',
  });

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Click2Eat/);
});
