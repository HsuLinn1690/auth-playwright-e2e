import type { Locator, Page } from '@playwright/test';

export class SignInPage {
  readonly form: Locator;
  readonly email: Locator;
  readonly password: Locator;
  readonly passwordToggle: Locator;
  readonly submit: Locator;
  readonly formError: Locator;
  readonly banner: Locator;
  readonly signUpLink: Locator;
  readonly errors: { email: Locator; password: Locator };

  constructor(readonly page: Page) {
    const id = (testId: string) => page.getByTestId(testId);
    this.form = id('signin-form');
    this.email = id('signin-email-input');
    this.password = id('signin-password-input');
    this.passwordToggle = id('signin-password-toggle');
    this.submit = id('signin-submit-button');
    this.formError = id('signin-form-error');
    this.banner = id('signin-banner');
    this.signUpLink = id('signin-signup-link');
    this.errors = {
      email: id('signin-email-error'),
      password: id('signin-password-error'),
    };
  }

  async goto() {
    await this.page.goto('/signin');
  }

  async signIn(email: string, password: string) {
    await this.email.fill(email);
    await this.password.fill(password);
    await this.submit.click();
  }
}
