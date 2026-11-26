import { expect, test } from '@playwright/test';
import { SEED_USER, VALID_PASSWORD, uniqueEmail } from '../support/test-data';

// The 'api' project sets baseURL to the mock API, so paths are relative.

function userBody(email = uniqueEmail('api')) {
  return { fullName: 'Api User', email, password: VALID_PASSWORD, createdAt: new Date().toISOString() };
}

test.describe('Mock API: /users contract', () => {
  test('GET /users?email= returns the seed user', { tag: '@critical' }, async ({ request }) => {
    const res = await request.get('/users', { params: { email: SEED_USER.email } });

    expect(res.status()).toBe(200);
    const users = await res.json();
    expect(users).toHaveLength(1);
    expect(users[0]).toMatchObject({ id: SEED_USER.id, fullName: SEED_USER.fullName, email: SEED_USER.email });
  });

  test('GET /users?email= returns [] for an unknown email', { tag: '@critical' }, async ({ request }) => {
    const res = await request.get('/users', { params: { email: uniqueEmail('nobody') } });

    expect(res.status()).toBe(200);
    expect(await res.json()).toEqual([]);
  });

  test('POST /users returns 201 with an id; GET /users/{id} returns it', { tag: '@critical' }, async ({
    request,
  }) => {
    const body = userBody();

    const created = await request.post('/users', { data: body });

    expect(created.status()).toBe(201);
    const user = await created.json();
    expect(user).toMatchObject(body);
    expect(user.id).toBeDefined();

    const fetched = await request.get(`/users/${user.id}`);
    expect(fetched.status()).toBe(200);
    expect(await fetched.json()).toMatchObject(body);

    await request.delete(`/users/${user.id}`); // cleanup
  });

  test('GET /users/{id} returns 404 for a missing id', { tag: '@edge' }, async ({ request }) => {
    const res = await request.get('/users/999999999');

    expect(res.status()).toBe(404);
  });

  test('DELETE /users/{id} removes the user', { tag: '@edge' }, async ({ request }) => {
    const user = await (await request.post('/users', { data: userBody() })).json();

    const deleted = await request.delete(`/users/${user.id}`);

    expect(deleted.status()).toBe(200);
    expect((await request.get(`/users/${user.id}`)).status()).toBe(404);
  });

  // Documents a known limitation from the requirements doc: json-server does not enforce
  // unique emails. The UI blocks duplicates (AC-02); the API alone does not.
  // If a real backend replaces the mock, this test should be changed to expect 409.
  test('KNOWN LIMITATION: POST /users accepts a duplicate email', { tag: '@edge' }, async ({ request }) => {
    const email = uniqueEmail('dup');
    const first = await (await request.post('/users', { data: userBody(email) })).json();

    const second = await request.post('/users', { data: userBody(email) });

    expect(second.status()).toBe(201);
    const matches = await (await request.get('/users', { params: { email } })).json();
    expect(matches).toHaveLength(2);

    // cleanup
    await request.delete(`/users/${first.id}`);
    await request.delete(`/users/${(await second.json()).id}`);
  });
});
