import { useNavigate } from 'react-router';
import { clearSession, getSession } from '../auth/session';
import { MSG } from '../messages';

export function WelcomePage() {
  const navigate = useNavigate();
  const user = getSession(); // RequireAuth guarantees a session here

  function handleSignOut() {
    clearSession(); // SE-04
    navigate('/signin', { replace: true, state: { banner: MSG.signedOut } });
  }

  return (
    <main className="card">
      <h1 data-testid="welcome-heading">Welcome, {user?.fullName}!</h1>
      <p className="muted">
        Signed in as <strong data-testid="welcome-email">{user?.email}</strong>
      </p>
      <button type="button" className="primary" onClick={handleSignOut} data-testid="signout-button">
        Sign out
      </button>
    </main>
  );
}
