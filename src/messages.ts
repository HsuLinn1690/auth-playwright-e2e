/**
 * Every user-facing string, exactly as written in the requirements doc (NF-04).
 * Tests can import this file so assertions never drift from the UI.
 */
export const MSG = {
  fullNameRequired: 'Full name is required.',
  fullNameLength: 'Full name must be 2–50 characters.',
  emailRequired: 'Email is required.',
  emailInvalid: 'Enter a valid email address.',
  emailTaken: 'An account with this email already exists.',
  passwordRequired: 'Password is required.',
  passwordRule:
    'Password must be 8–64 characters and include an uppercase letter, a lowercase letter, a number and a special character.',
  confirmRequired: 'Please confirm your password.',
  confirmMismatch: 'Passwords do not match.',
  termsRequired: 'You must accept the Terms and Conditions.',
  invalidCredentials: 'Invalid email or password.',
  genericError: 'Something went wrong. Please try again.',
  accountCreated: 'Account created. Please sign in.',
  signedOut: 'You have been signed out.',
} as const;
