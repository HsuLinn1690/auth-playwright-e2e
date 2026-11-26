import { MSG } from '../../src/messages';
import { SESSION_KEY, expect, readSession, seedSession, test } from '../support/fixtures';
import { SEED_USER } from '../support/test-data';

const SESSION_USER = { id: SEED_USER.id, fullName: SEED_USER.fullName, email: SEED_USER.email };

test.describe('Session and route guard', () => {
  test('AC-09 signed-out visitor cannot open /welcome', { tag: '@critical' }, async ({ page }) => {
    await page.goto('/welcome');

    await expect(page).toHaveURL(/\/signin$/);
  });

  test('AC-10 sign out clears the session and Back does not return to /welcome', { tag: '@critical' }, async ({
    page,
    signInPage,
    welcomePage,
  }) => {
    await signInPage.goto();
    await signInPage.signIn(SEED_USER.email, SEED_USER.password);
    await expect(page).toHaveURL(/\/welcome$/);
    // Push a second /welcome entry so history has a page to go Back to after sign out
    await page.goto('/');
    await expect(page).toHaveURL(/\/welcome$/);
    await expect(welcomePage.heading).toBeVisible();

    await welcomePage.signOut();

    await expect(page).toHaveURL(/\/signin$/);
    await expect(signInPage.banner).toHaveText(MSG.signedOut);
    expect(await readSession(page)).toBeNull();

    await page.goBack();

    await expect(page).toHaveURL(/\/signin$/);
    await expect(welcomePage.heading).toBeHidden();
  });

  test('AC-15 session survives a page reload', { tag: '@edge' }, async ({ page, welcomePage }) => {
    await seedSession(page, SESSION_USER);
    await welcomePage.goto();
    await expect(welcomePage.heading).toBeVisible();

    await page.reload();

    await expect(page).toHaveURL(/\/welcome$/);
    await expect(welcomePage.heading).toHaveText(`Welcome, ${SEED_USER.fullName}!`);
  });

  test('AC-17 signed-in user is redirected away from /signin and /signup', { tag: '@edge' }, async ({
    page,
  }) => {
    await seedSession(page, SESSION_USER);

    await page.goto('/signin');
    await expect(page).toHaveURL(/\/welcome$/);

    await page.goto('/signup');
    await expect(page).toHaveURL(/\/welcome$/);
  });

  test('SE-01 session never contains the password', { tag: '@critical' }, async ({ page, signInPage }) => {
    await signInPage.goto();
    await signInPage.signIn(SEED_USER.email, SEED_USER.password);
    await expect(page).toHaveURL(/\/welcome$/);

    const raw = await readSession(page);
    expect(raw).not.toBeNull();
    const session = JSON.parse(raw!);
    expect(session).toEqual(SESSION_USER);
    expect(raw).not.toContain(SEED_USER.password);
  });

  test('SE-06 malformed session value counts as signed out', { tag: '@edge' }, async ({ page }) => {
    await page.goto('/signin');
    await page.evaluate((key) => localStorage.setItem(key, 'not-json'), SESSION_KEY);

    await page.goto('/welcome');

    await expect(page).toHaveURL(/\/signin$/);
  });

  test('Unknown route redirects to the right start page', { tag: '@edge' }, async ({ page }) => {
    await page.goto('/does-not-exist');

    await expect(page).toHaveURL(/\/signin$/);
  });
});
