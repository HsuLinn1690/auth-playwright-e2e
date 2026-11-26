import type { SessionUser, User } from '../types';

export const SESSION_KEY = 'auth_user';

/** SE-01: store id, fullName, email only. Never the password. */
export function saveSession(user: User): void {
  const session: SessionUser = { id: user.id, fullName: user.fullName, email: user.email };
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

/** SE-06: missing or malformed value counts as signed out. */
export function getSession(): SessionUser | null {
  const raw = localStorage.getItem(SESSION_KEY);
  if (!raw) return null;
  try {
    const parsed: unknown = JSON.parse(raw);
    if (
      parsed !== null &&
      typeof parsed === 'object' &&
      typeof (parsed as SessionUser).fullName === 'string' &&
      typeof (parsed as SessionUser).email === 'string'
    ) {
      return parsed as SessionUser;
    }
    return null;
  } catch {
    return null;
  }
}

/** SE-04 */
export function clearSession(): void {
  localStorage.removeItem(SESSION_KEY);
}
