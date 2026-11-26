import type { ReactNode } from 'react';
import { Navigate } from 'react-router';
import { getSession } from '../auth/session';

/** Only signed-in users may see the child page; others go to /signin (SE-05, AC-09). */
export function RequireAuth({ children }: { children: ReactNode }) {
  return getSession() ? children : <Navigate to="/signin" replace />;
}

/** Signed-in users are sent away from /signin and /signup (AC-17). */
export function RedirectIfAuth({ children }: { children: ReactNode }) {
  return getSession() ? <Navigate to="/welcome" replace /> : children;
}

/** "/" redirects by session state. */
export function RootRedirect() {
  return <Navigate to={getSession() ? '/welcome' : '/signin'} replace />;
}
