import { useState } from 'react';

interface PasswordInputProps {
  id: string;
  label: string;
  value: string;
  error: string;
  autoComplete: 'new-password' | 'current-password';
  testIdPrefix: string; // e.g. "signup-password" -> signup-password-input / -toggle / -error
  onChange: (value: string) => void;
}

/** Password field with Show/Hide toggle (SU-08, SI-07). */
export function PasswordInput({
  id,
  label,
  value,
  error,
  autoComplete,
  testIdPrefix,
  onChange,
}: PasswordInputProps) {
  const [visible, setVisible] = useState(false);
  const errorId = `${id}-error`;

  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <div className="password-wrap">
        <input
          id={id}
          name={id}
          type={visible ? 'text' : 'password'}
          value={value}
          autoComplete={autoComplete}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          data-testid={`${testIdPrefix}-input`}
          onChange={(e) => onChange(e.target.value)}
        />
        <button
          type="button"
          className="toggle"
          aria-label={visible ? `Hide ${label.toLowerCase()}` : `Show ${label.toLowerCase()}`}
          aria-pressed={visible}
          data-testid={`${testIdPrefix}-toggle`}
          onClick={() => setVisible((v) => !v)}
        >
          {visible ? 'Hide' : 'Show'}
        </button>
      </div>
      {error && (
        <p id={errorId} className="field-error" data-testid={`${testIdPrefix}-error`}>
          {error}
        </p>
      )}
    </div>
  );
}
