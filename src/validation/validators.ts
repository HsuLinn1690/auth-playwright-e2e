import { MSG } from '../messages';

/** Each validator returns an error message, or '' when the value is valid. */

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export const normalizeEmail = (value: string): string => value.trim().toLowerCase();

export function validateFullName(value: string): string {
  const name = value.trim(); // whitespace-only counts as empty (SU-03)
  if (!name) return MSG.fullNameRequired;
  if (name.length < 2 || name.length > 50) return MSG.fullNameLength;
  return '';
}

export function validateEmail(value: string): string {
  const email = value.trim();
  if (!email) return MSG.emailRequired;
  if (email.length > 254 || !EMAIL_PATTERN.test(email)) return MSG.emailInvalid;
  return '';
}

/** Sign Up password: strength rules apply. Not trimmed. */
export function validateNewPassword(value: string): string {
  if (!value) return MSG.passwordRequired;
  const ok =
    value.length >= 8 &&
    value.length <= 64 &&
    /[A-Z]/.test(value) &&
    /[a-z]/.test(value) &&
    /\d/.test(value) &&
    /[^A-Za-z0-9]/.test(value);
  return ok ? '' : MSG.passwordRule;
}

/** Sign In password: required only, no strength rule (SI fields table). */
export function validateSignInPassword(value: string): string {
  return value ? '' : MSG.passwordRequired;
}

export function validateConfirmPassword(password: string, confirm: string): string {
  if (!confirm) return MSG.confirmRequired;
  if (confirm !== password) return MSG.confirmMismatch;
  return '';
}

export function validateTerms(accepted: boolean): string {
  return accepted ? '' : MSG.termsRequired;
}
