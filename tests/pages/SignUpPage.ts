import type { Locator, Page } from '@playwright/test';
import type { SignUpData } from '../support/test-data';

export class SignUpPage {
  readonly form: Locator;
  readonly fullName: Locator;
  readonly email: Locator;
  readonly password: Locator;
  readonly passwordToggle: Locator;
  readonly confirmPassword: Locator;
  readonly confirmPasswordToggle: Locator;
  readonly terms: Locator;
  readonly submit: Locator;
  readonly formError: Locator;
  readonly signInLink: Locator;
  readonly errors: {
    fullName: Locator;
    email: Locator;
    password: Locator;
    confirmPassword: Locator;
    terms: Locator;
  };

  constructor(readonly page: Page) {
    const id = (testId: string) => page.getByTestId(testId);
    this.form = id('signup-form');
    this.fullName = id('signup-fullname-input');
    this.email = id('signup-email-input');
    this.password = id('signup-password-input');
    this.passwordToggle = id('signup-password-toggle');
    this.confirmPassword = id('signup-confirm-password-input');
    this.confirmPasswordToggle = id('signup-confirm-password-toggle');
    this.terms = id('signup-terms-checkbox');
    this.submit = id('signup-submit-button');
    this.formError = id('signup-form-error');
    this.signInLink = id('signup-signin-link');
    this.errors = {
      fullName: id('signup-fullname-error'),
      email: id('signup-email-error'),
      password: id('signup-password-error'),
      confirmPassword: id('signup-confirm-password-error'),
      terms: id('signup-terms-error'),
    };
  }

  async goto() {
    await this.page.goto('/signup');
  }

  /** Fills only the fields provided, so tests can leave fields empty on purpose. */
  async fill(data: Partial<SignUpData>) {
    if (data.fullName !== undefined) await this.fullName.fill(data.fullName);
    if (data.email !== undefined) await this.email.fill(data.email);
    if (data.password !== undefined) await this.password.fill(data.password);
    if (data.confirmPassword !== undefined) await this.confirmPassword.fill(data.confirmPassword);
    if (data.acceptTerms !== undefined) await this.terms.setChecked(data.acceptTerms);
  }

  async signUp(data: SignUpData) {
    await this.fill(data);
    await this.submit.click();
  }
}
