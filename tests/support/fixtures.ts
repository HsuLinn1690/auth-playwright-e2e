import { test as base, expect, type APIRequestContext, type Page } from '@playwright/test';
import type { SessionUser, User } from '../../src/types';
import { SignInPage } from '../pages/SignInPage';
import { SignUpPage } from '../pages/SignUpPage';
import { WelcomePage } from '../pages/WelcomePage';
import { API_URL } from './test-data';

/** Thin client for checking data behind the UI (absolute URLs: UI projects use the app as baseURL). */
export class UsersApi {
  constructor(private readonly request: APIRequestContext) {}

  async findByEmail(email: string): Promise<User[]> {
    const res = await this.request.get(`${API_URL}/users`, { params: { email } });
    expect(res.status()).toBe(200);
    return (await res.json()) as User[];
  }
}

type Fixtures = {
  signUpPage: SignUpPage;
  signInPage: SignInPage;
  welcomePage: WelcomePage;
  usersApi: UsersApi;
};

export const test = base.extend<Fixtures>({
  signUpPage: async ({ page }, use) => {
    await use(new SignUpPage(page));
  },
  signInPage: async ({ page }, use) => {
    await use(new SignInPage(page));
  },
  welcomePage: async ({ page }, use) => {
    await use(new WelcomePage(page));
  },
  usersApi: async ({ request }, use) => {
    await use(new UsersApi(request));
  },
});

export { expect };

export const SESSION_KEY = 'auth_user';

/**
 * Signs in without the UI by writing the session to localStorage.
 * Use it for tests about session behaviour, not about the sign-in form itself.
 * (Not addInitScript: that would re-create the session on every navigation and break sign-out tests.)
 */
export async function seedSession(page: Page, user: SessionUser) {
  await page.goto('/signin');
  await page.evaluate(
    ([key, value]) => localStorage.setItem(key, value),
    [SESSION_KEY, JSON.stringify(user)] as const,
  );
}

export async function readSession(page: Page): Promise<string | null> {
  return page.evaluate((key) => localStorage.getItem(key), SESSION_KEY);
}
