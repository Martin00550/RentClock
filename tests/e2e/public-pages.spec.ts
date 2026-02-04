import { test, expect } from '@playwright/test';

test('landing page has title and login button', async ({ page }) => {
    await page.goto('/');

    // Expect a title "to contain" a substring.
    await expect(page).toHaveTitle(/RentClock/);

    // Check for call to action
    await expect(page.getByRole('link', { name: /Start Free/i }).first()).toBeVisible();
});

test('pricing section is visible', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByText('Simple, Transparent Pricing')).toBeVisible();
});
