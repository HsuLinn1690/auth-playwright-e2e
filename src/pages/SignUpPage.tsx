import { useRef, useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router';
import { createUser, findUsersByEmail } from '../api/usersApi';
import { PasswordInput } from '../components/PasswordInput';
import { TextField } from '../components/TextField';
import { MSG } from '../messages';
import {
  normalizeEmail,
  validateConfirmPassword,
  validateEmail,
  validateFullName,
  validateNewPassword,
  validateTerms,
} from '../validation/validators';

type Field = 'fullName' | 'email' | 'password' | 'confirmPassword' | 'terms';
type Errors = Record<Field, string>;

const NO_ERRORS: Errors = { fullName: '', email: '', password: '', confirmPassword: '', terms: '' };

export function SignUpPage() {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [terms, setTerms] = useState(false);
  const [errors, setErrors] = useState<Errors>(NO_ERRORS);
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  // Ref guard: state updates are async, so a fast double-click could pass a state check (SU-06, AC-14)
  const inFlight = useRef(false);

  /** SU-02: a field's error clears as soon as the user edits it. */
  const clearError = (field: Field) => setErrors((prev) => ({ ...prev, [field]: '' }));

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (inFlight.current) return;
    setFormError('');

    // SU-01: validate all fields at once
    const next: Errors = {
      fullName: validateFullName(fullName),
      email: validateEmail(email),
      password: validateNewPassword(password),
      confirmPassword: validateConfirmPassword(password, confirmPassword),
      terms: validateTerms(terms),
    };
    setErrors(next);
    if (Object.values(next).some(Boolean)) return;

    inFlight.current = true;
    setSubmitting(true);
    try {
      const normalizedEmail = normalizeEmail(email);
      // SU-04: duplicate check (case-insensitive via normalized email)
      const existing = await findUsersByEmail(normalizedEmail);
      if (existing.length > 0) {
        setErrors((prev) => ({ ...prev, email: MSG.emailTaken }));
        return;
      }
      // SU-05
      await createUser({
        fullName: fullName.trim(),
        email: normalizedEmail,
        password,
        createdAt: new Date().toISOString(),
      });
      navigate('/signin', { state: { banner: MSG.accountCreated } });
    } catch {
      setFormError(MSG.genericError); // SU-07: values are kept
    } finally {
      inFlight.current = false;
      setSubmitting(false);
    }
  }

  return (
    <main className="card">
      <h1>Create an account</h1>

      {formError && (
        <p className="alert alert-error" role="alert" data-testid="signup-form-error">
          {formError}
        </p>
      )}

      {/* noValidate: we show our own messages instead of the browser's (NF-04) */}
      <form noValidate onSubmit={handleSubmit} data-testid="signup-form">
        <TextField
          id="fullName"
          label="Full name"
          value={fullName}
          error={errors.fullName}
          autoComplete="name"
          testIdPrefix="signup-fullname"
          onChange={(v) => {
            setFullName(v);
            clearError('fullName');
          }}
        />
        <TextField
          id="email"
          label="Email"
          type="email"
          value={email}
          error={errors.email}
          autoComplete="email"
          testIdPrefix="signup-email"
          onChange={(v) => {
            setEmail(v);
            clearError('email');
          }}
        />
        <PasswordInput
          id="password"
          label="Password"
          value={password}
          error={errors.password}
          autoComplete="new-password"
          testIdPrefix="signup-password"
          onChange={(v) => {
            setPassword(v);
            clearError('password');
          }}
        />
        <PasswordInput
          id="confirmPassword"
          label="Confirm password"
          value={confirmPassword}
          error={errors.confirmPassword}
          autoComplete="new-password"
          testIdPrefix="signup-confirm-password"
          onChange={(v) => {
            setConfirmPassword(v);
            clearError('confirmPassword');
          }}
        />

        <div className="field">
          <label className="checkbox">
            <input
              type="checkbox"
              checked={terms}
              aria-invalid={errors.terms ? true : undefined}
              aria-describedby={errors.terms ? 'terms-error' : undefined}
              data-testid="signup-terms-checkbox"
              onChange={(e) => {
                setTerms(e.target.checked);
                clearError('terms');
              }}
            />
            I accept the Terms and Conditions
          </label>
          {errors.terms && (
            <p id="terms-error" className="field-error" data-testid="signup-terms-error">
              {errors.terms}
            </p>
          )}
        </div>

        <button type="submit" className="primary" disabled={submitting} data-testid="signup-submit-button">
          {submitting ? 'Creating account…' : 'Sign up'}
        </button>
      </form>

      <p className="switch">
        Already have an account?{' '}
        <Link to="/signin" data-testid="signup-signin-link">
          Sign in
        </Link>
      </p>
    </main>
  );
}
