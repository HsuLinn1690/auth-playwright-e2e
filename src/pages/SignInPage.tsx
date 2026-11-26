import { useRef, useState, type FormEvent } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import { findUsersByEmail } from '../api/usersApi';
import { saveSession } from '../auth/session';
import { PasswordInput } from '../components/PasswordInput';
import { TextField } from '../components/TextField';
import { MSG } from '../messages';
import { normalizeEmail, validateEmail, validateSignInPassword } from '../validation/validators';

interface LocationState {
  banner?: string;
}

export function SignInPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [banner, setBanner] = useState((location.state as LocationState | null)?.banner ?? '');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({ email: '', password: '' });
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const inFlight = useRef(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (inFlight.current) return;
    setBanner(''); // SI-10: banner disappears on next submit
    setFormError('');

    // SI-01
    const next = { email: validateEmail(email), password: validateSignInPassword(password) };
    setErrors(next);
    if (next.email || next.password) return;

    inFlight.current = true;
    setSubmitting(true);
    try {
      // SI-02: trimmed + lowercased lookup (AC-11)
      const [user] = await findUsersByEmail(normalizeEmail(email));
      if (!user || user.password !== password) {
        // SI-03: same message for unknown email and wrong password; clear password, keep email
        setFormError(MSG.invalidCredentials);
        setPassword('');
        return;
      }
      saveSession(user); // SI-04, SE-01
      navigate('/welcome', { replace: true });
    } catch {
      setFormError(MSG.genericError); // SI-06
    } finally {
      inFlight.current = false;
      setSubmitting(false);
    }
  }

  return (
    <main className="card">
      <h1>Sign in</h1>

      {banner && (
        <p className="alert alert-info" role="status" data-testid="signin-banner">
          {banner}
        </p>
      )}
      {formError && (
        <p className="alert alert-error" role="alert" data-testid="signin-form-error">
          {formError}
        </p>
      )}

      <form noValidate onSubmit={handleSubmit} data-testid="signin-form">
        <TextField
          id="email"
          label="Email"
          type="email"
          value={email}
          error={errors.email}
          autoComplete="email"
          testIdPrefix="signin-email"
          onChange={(v) => {
            setEmail(v);
            setErrors((prev) => ({ ...prev, email: '' }));
          }}
        />
        <PasswordInput
          id="password"
          label="Password"
          value={password}
          error={errors.password}
          autoComplete="current-password"
          testIdPrefix="signin-password"
          onChange={(v) => {
            setPassword(v);
            setErrors((prev) => ({ ...prev, password: '' }));
          }}
        />

        <button type="submit" className="primary" disabled={submitting} data-testid="signin-submit-button">
          {submitting ? 'Signing in…' : 'Sign in'}
        </button>
      </form>

      <p className="switch">
        Don&apos;t have an account?{' '}
        <Link to="/signup" data-testid="signin-signup-link">
          Sign up
        </Link>
      </p>
    </main>
  );
}
