import { MSG } from '../../src/messages';
import { expect, test } from '../support/fixtures';
import { SEED_USER } from '../support/test-data';

test.describe('Sign In', () => {
  test.beforeEach(async ({ signInPage }) => {
    await signInPage.goto();
  });

  test('AC-06 valid credentials open the Welcome page', { tag: '@critical' }, async ({
    page,
    signInPage,
    welcomePage,
  }) => {
    await signInPage.signIn(SEED_USER.email, SEED_USER.password);

    await expect(page).toHaveURL(/\/welcome$/);
    await expect(welcomePage.heading).toHaveText(`Welcome, ${SEED_USER.fullName}!`);
    await expect(welcomePage.email).toHaveText(SEED_USER.email);
  });

  test('AC-07 wrong password shows a generic error, clears password, keeps email', { tag: '@critical' }, async ({
    page,
    signInPage,
  }) => {
    await signInPage.signIn(SEED_USER.email, 'Wrong@1234');

    await expect(signInPage.formError).toHaveText(MSG.invalidCredentials);
    await expect(signInPage.password).toHaveValue('');
    await expect(signInPage.email).toHaveValue(SEED_USER.email);
    await expect(page).toHaveURL(/\/signin$/);
  });

  test('AC-08 unknown email shows the same generic error', { tag: '@critical' }, async ({ signInPage }) => {
    await signInPage.signIn('nobody@example.com', 'Whatever@123');

    await expect(signInPage.formError).toHaveText(MSG.invalidCredentials);
  });

  test('AC-11 email with spaces and uppercase still signs in', { tag: '@edge' }, async ({
    page,
    signInPage,
  }) => {
    await signInPage.signIn('  TESTUSER@example.com  ', SEED_USER.password);

    await expect(page).toHaveURL(/\/welcome$/);
  });

  test('SI-01 empty form shows required-field errors', { tag: '@edge' }, async ({ signInPage }) => {
    await signInPage.submit.click();

    await expect(signInPage.errors.email).toHaveText(MSG.emailRequired);
    await expect(signInPage.errors.password).toHaveText(MSG.passwordRequired);
  });

  test('SI-01 invalid email format is rejected before calling the API', { tag: '@edge' }, async ({
    signInPage,
  }) => {
    await signInPage.signIn('not-an-email', 'Whatever@123');

    await expect(signInPage.errors.email).toHaveText(MSG.emailInvalid);
    await expect(signInPage.formError).toBeHidden();
  });
});
