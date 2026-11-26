import type { Locator, Page } from '@playwright/test';

export class WelcomePage {
  readonly heading: Locator;
  readonly email: Locator;
  readonly signOutButton: Locator;

  constructor(readonly page: Page) {
    this.heading = page.getByTestId('welcome-heading');
    this.email = page.getByTestId('welcome-email');
    this.signOutButton = page.getByTestId('signout-button');
  }

  async goto() {
    await this.page.goto('/welcome');
  }

  async signOut() {
    await this.signOutButton.click();
  }
}
