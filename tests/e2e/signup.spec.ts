import { MSG } from '../../src/messages';
import { expect, test } from '../support/fixtures';
import { SEED_USER, newUser, passwordOfLength } from '../support/test-data';

test.describe('Sign Up', () => {
  test.beforeEach(async ({ signUpPage }) => {
    await signUpPage.goto();
  });

  test('AC-01 valid sign up redirects to Sign In and creates the user', { tag: '@critical' }, async ({
    page,
    signUpPage,
    signInPage,
    usersApi,
  }) => {
    const user = newUser();

    await signUpPage.signUp(user);

    await expect(page).toHaveURL(/\/signin$/);
    await expect(signInPage.banner).toHaveText(MSG.accountCreated);

    const saved = await usersApi.findByEmail(user.email);
    expect(saved).toHaveLength(1);
    expect(saved[0]).toMatchObject({ fullName: user.fullName, email: user.email });
  });

  test('AC-02 duplicate email (different case) is rejected', { tag: '@critical' }, async ({
    page,
    signUpPage,
    usersApi,
  }) => {
    await signUpPage.signUp(newUser({ email: 'TestUser@Example.com' }));

    await expect(signUpPage.errors.email).toHaveText(MSG.emailTaken);
    await expect(page).toHaveURL(/\/signup$/);
    expect(await usersApi.findByEmail(SEED_USER.email)).toHaveLength(1);
  });

  test('AC-03 empty form shows all required-field errors', { tag: '@critical' }, async ({ signUpPage }) => {
    await signUpPage.submit.click();

    await expect(signUpPage.errors.fullName).toHaveText(MSG.fullNameRequired);
    await expect(signUpPage.errors.email).toHaveText(MSG.emailRequired);
    await expect(signUpPage.errors.password).toHaveText(MSG.passwordRequired);
    await expect(signUpPage.errors.confirmPassword).toHaveText(MSG.confirmRequired);
    await expect(signUpPage.errors.terms).toHaveText(MSG.termsRequired);
  });

  test('AC-04 password without a number shows the password rule', { tag: '@critical' }, async ({
    signUpPage,
  }) => {
    await signUpPage.signUp(newUser({ password: 'Password!' }));

    await expect(signUpPage.errors.password).toHaveText(MSG.passwordRule);
  });

  test('AC-05 confirm password mismatch', { tag: '@critical' }, async ({ signUpPage }) => {
    await signUpPage.signUp(newUser({ password: 'Passw0rd!', confirmPassword: 'Passw0rd?' }));

    await expect(signUpPage.errors.confirmPassword).toHaveText(MSG.confirmMismatch);
  });

  test('SU-02 a field error clears when the field is corrected', { tag: '@edge' }, async ({
    signUpPage,
  }) => {
    await signUpPage.submit.click();
    await expect(signUpPage.errors.fullName).toBeVisible();

    await signUpPage.fullName.fill('Jane Doe');

    await expect(signUpPage.errors.fullName).toBeHidden();
    await expect(signUpPage.errors.email).toBeVisible(); // other errors stay
  });

  // AC-12: boundary values for password length (8–64)
  for (const { length, valid } of [
    { length: 7, valid: false },
    { length: 8, valid: true },
    { length: 64, valid: true },
    { length: 65, valid: false },
  ]) {
    test(`AC-12 password of ${length} characters is ${valid ? 'accepted' : 'rejected'}`, { tag: '@edge' }, async ({
      page,
      signUpPage,
    }) => {
      await signUpPage.signUp(newUser({ password: passwordOfLength(length) }));

      if (valid) {
        await expect(page).toHaveURL(/\/signin$/);
      } else {
        await expect(signUpPage.errors.password).toHaveText(MSG.passwordRule);
      }
    });
  }

  // AC-13: boundary values for full name (2–50, trimmed)
  for (const { label, value, error } of [
    { label: '1 character', value: 'A', error: MSG.fullNameLength },
    { label: '2 characters', value: 'Ab', error: null },
    { label: '50 characters', value: 'a'.repeat(50), error: null },
    { label: '51 characters', value: 'a'.repeat(51), error: MSG.fullNameLength },
    { label: 'spaces only', value: '   ', error: MSG.fullNameRequired },
  ]) {
    test(`AC-13 full name of ${label} is ${error ? 'rejected' : 'accepted'}`, { tag: '@edge' }, async ({
      page,
      signUpPage,
    }) => {
      await signUpPage.signUp(newUser({ fullName: value }));

      if (error) {
        await expect(signUpPage.errors.fullName).toHaveText(error);
      } else {
        await expect(page).toHaveURL(/\/signin$/);
      }
    });
  }

  test('AC-14 double-click on submit creates exactly one user', { tag: '@edge' }, async ({
    page,
    signUpPage,
    usersApi,
  }) => {
    const user = newUser();
    await signUpPage.fill(user);

    await signUpPage.submit.dblclick();

    await expect(page).toHaveURL(/\/signin$/);
    expect(await usersApi.findByEmail(user.email)).toHaveLength(1);
  });
});
