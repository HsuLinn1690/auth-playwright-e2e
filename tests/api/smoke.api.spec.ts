import { expect, test } from '@playwright/test';

// Setup check only: proves the mock API is reachable and seeded.

test('GET /users?email= returns the seed user', async ({ request }) => {
  const res = await request.get('/users', { params: { email: 'testuser@example.com' } });
  expect(res.status()).toBe(200);

  const users = await res.json();
  expect(users).toHaveLength(1);
  expect(users[0]).toMatchObject({ id: 1, fullName: 'Test User', email: 'testuser@example.com' });
});

test('GET /users?email= returns [] for an unknown email', async ({ request }) => {
  const res = await request.get('/users', { params: { email: 'nobody@example.com' } });
  expect(res.status()).toBe(200);
  expect(await res.json()).toEqual([]);
});
