import { MSG } from '../../src/messages';
import { expect, test } from '../support/fixtures';
import { SEED_USER, newUser } from '../support/test-data';

// Matches every call the app makes to the mock API's users collection
const USERS_API = /localhost:3001\/users/;

test.describe('Resilience and keyboard access', () => {
  test('AC-16 Sign Up with the API down shows a generic error and keeps values', { tag: '@edge' }, async ({
    page,
    signUpPage,
  }) => {
    await page.route(USERS_API, (route) => route.abort('connectionrefused'));
    const user = newUser();
    await signUpPage.goto();

    await signUpPage.signUp(user);

    await expect(signUpPage.formError).toHaveText(MSG.genericError);
    await expect(page).toHaveURL(/\/signup$/);
    await expect(signUpPage.fullName).toHaveValue(user.fullName);
    await expect(signUpPage.email).toHaveValue(user.email);
  });

  test('AC-16 Sign In with the API down shows a generic error', { tag: '@edge' }, async ({
    page,
    signInPage,
  }) => {
    await page.route(USERS_API, (route) => route.abort('connectionrefused'));
    await signInPage.goto();

    await signInPage.signIn(SEED_USER.email, SEED_USER.password);

    await expect(signInPage.formError).toHaveText(MSG.genericError);
    await expect(page).toHaveURL(/\/signin$/);
  });

  test('AC-18 Sign In works with the keyboard only (Tab order + Enter)', { tag: '@edge' }, async ({
    page,
    browserName,
    signInPage,
  }) => {
    // Safari/WebKit skips buttons and links on Tab by default (an OS-level setting), so the
    // button part of the Tab order is checked in Chromium and Firefox only.
    await signInPage.goto();

    await page.keyboard.press('Tab');
    await expect(signInPage.email).toBeFocused();
    await page.keyboard.type(SEED_USER.email);

    await page.keyboard.press('Tab');
    await expect(signInPage.password).toBeFocused();
    await page.keyboard.type(SEED_USER.password);

    if (browserName !== 'webkit') {
      await page.keyboard.press('Tab');
      await expect(signInPage.passwordToggle).toBeFocused();
      await page.keyboard.press('Tab');
      await expect(signInPage.submit).toBeFocused();
    }

    await page.keyboard.press('Enter');

    await expect(page).toHaveURL(/\/welcome$/);
  });

  test('SU-10 Enter in a Sign Up field submits the form', { tag: '@edge' }, async ({ page, signUpPage }) => {
    await signUpPage.goto();
    await signUpPage.fill(newUser());

    await signUpPage.confirmPassword.press('Enter');

    await expect(page).toHaveURL(/\/signin$/);
  });
});
