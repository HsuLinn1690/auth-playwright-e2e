import { expect, test } from '@playwright/test';

// Setup check only: proves the app + mock API start and talk to each other.
// The full AC-01..AC-18 suite (with Page Objects) comes in Phase 3.

test('signed-out visitor on / is redirected to Sign In', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveURL(/\/signin$/);
  await expect(page.getByTestId('signin-form')).toBeVisible();
});

test('seed user can sign in and sign out', async ({ page }) => {
  await page.goto('/signin');
  await page.getByTestId('signin-email-input').fill('testuser@example.com');
  await page.getByTestId('signin-password-input').fill('Test@1234');
  await page.getByTestId('signin-submit-button').click();

  await expect(page).toHaveURL(/\/welcome$/);
  await expect(page.getByTestId('welcome-heading')).toHaveText('Welcome, Test User!');

  await page.getByTestId('signout-button').click();
  await expect(page).toHaveURL(/\/signin$/);
  await expect(page.getByTestId('signin-banner')).toHaveText('You have been signed out.');
});
