import type { NewUser, User } from '../types';

export const API_URL: string = import.meta.env.VITE_API_URL ?? 'http://localhost:3001';

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status?: number,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${API_URL}${path}`, {
      headers: { 'Content-Type': 'application/json' },
      ...init,
    });
  } catch {
    // Network failure / API not running (SU-07, SI-06)
    throw new ApiError('Network error');
  }
  if (!res.ok) throw new ApiError(`HTTP ${res.status}`, res.status);
  return (await res.json()) as T;
}

/** GET /users?email= : exact match, so callers pass a normalized (lowercase) email. */
export function findUsersByEmail(email: string): Promise<User[]> {
  return request<User[]>(`/users?email=${encodeURIComponent(email)}`);
}

/** POST /users : json-server returns 201 with the created user incl. id. */
export function createUser(user: NewUser): Promise<User> {
  return request<User>('/users', { method: 'POST', body: JSON.stringify(user) });
}
