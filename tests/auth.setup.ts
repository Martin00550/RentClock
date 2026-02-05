import { test as setup } from '@playwright/test';
import fs from 'fs';
import path from 'path';

const authFile = 'playwright/.auth/user.json';

setup('authenticate', async ({ page }) => {
    const email = process.env.TEST_EMAIL;
    const password = process.env.TEST_PASSWORD;

    if (!email || !password) {
        console.log('Skipping auth setup: TEST_EMAIL or TEST_PASSWORD not provided.');
        return;
    }

    await page.goto('/sign-in');

    // Clerk typically uses these labels or identifiers
    await page.getByLabel('Email address').fill(email);
    await page.getByRole('button', { name: /continue|sign in/i }).click();

    // Wait for password field to appear
    await page.getByLabel('Password', { exact: true }).fill(password);
    await page.getByRole('button', { name: /continue|sign in/i }).click();

    // Wait for dashboard to confirm successful login
    await page.waitForURL(/\/dashboard/, { timeout: 30000 });

    // Ensure directory exists
    const dirname = path.dirname(authFile);
    if (!fs.existsSync(dirname)) {
        fs.mkdirSync(dirname, { recursive: true });
    }

    // Save state
    await page.context().storageState({ path: authFile });
    console.log('✓ Authentication state saved for', email);
});
