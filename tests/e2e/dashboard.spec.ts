import { test, expect } from '@playwright/test';

// NOTE: This test requires a valid auth state in 'playwright/.auth/user.json'
// test.use({ storageState: 'playwright/.auth/user.json' });

test('dashboard loads for authenticated user', async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page).toHaveTitle(/Dashboard/);

    // Check for core dashboard components
    await expect(page.getByText(/Leases/i)).toBeVisible();
    await expect(page.getByText(/AI Brain/i)).toBeVisible();
});

test('guest is redirected to sign-in', async ({ page }) => {
    // Clear storage to simulate guest
    await page.context().clearCookies();
    await page.goto('/dashboard');
    // Should verify redirection to Clerk
    await expect(page.url()).toContain('sign-in');
});
