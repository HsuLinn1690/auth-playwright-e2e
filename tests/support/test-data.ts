/** Test data shared by UI and API tests. */

export const APP_URL = 'http://localhost:5173';
export const API_URL = 'http://localhost:3001';

/** Seeded by mock-api/db.seed.json. Read-only: tests must never modify or delete it. */
export const SEED_USER = {
  id: 1,
  fullName: 'Test User',
  email: 'testuser@example.com',
  password: 'Test@1234',
} as const;

/** Meets every Sign Up password rule. */
export const VALID_PASSWORD = 'Passw0rd!';

/** Unique per call, so parallel workers and browsers never collide on the duplicate-email check. */
export function uniqueEmail(prefix = 'user'): string {
  const rand = Math.random().toString(36).slice(2, 8);
  return `${prefix}.${Date.now()}.${rand}@example.com`;
}

export interface SignUpData {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
}

/** A valid new user. Override any field; confirmPassword follows password unless given. */
export function newUser(overrides: Partial<SignUpData> = {}): SignUpData {
  const password = overrides.password ?? VALID_PASSWORD;
  return {
    fullName: 'Jane Doe',
    email: uniqueEmail(),
    acceptTerms: true,
    ...overrides,
    password,
    confirmPassword: overrides.confirmPassword ?? password,
  };
}

/** Builds a password of an exact length that satisfies every character rule. */
export function passwordOfLength(length: number): string {
  return 'Aa1!' + 'a'.repeat(Math.max(0, length - 4));
}
