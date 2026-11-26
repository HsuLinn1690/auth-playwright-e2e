interface TextFieldProps {
  id: string;
  label: string;
  type?: 'text' | 'email';
  value: string;
  error: string;
  autoComplete?: string;
  testIdPrefix: string; // e.g. "signup-email" -> signup-email-input / signup-email-error
  onChange: (value: string) => void;
}

export function TextField({
  id,
  label,
  type = 'text',
  value,
  error,
  autoComplete,
  testIdPrefix,
  onChange,
}: TextFieldProps) {
  const errorId = `${id}-error`;
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        name={id}
        // type="text" for email too: the browser's native email validation would
        // block submit and hide our own messages (NF-04). inputMode keeps the mobile keyboard.
        type="text"
        inputMode={type === 'email' ? 'email' : undefined}
        value={value}
        autoComplete={autoComplete}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        data-testid={`${testIdPrefix}-input`}
        onChange={(e) => onChange(e.target.value)}
      />
      {error && (
        <p id={errorId} className="field-error" data-testid={`${testIdPrefix}-error`}>
          {error}
        </p>
      )}
    </div>
  );
}
