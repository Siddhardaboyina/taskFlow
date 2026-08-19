import { useState } from "react";

function EyeIcon({ open }) {
    return open ? (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
                d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7-10-7-10-7Z"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.6" />
        </svg>
    ) : (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
                d="M3 3l18 18M10.6 10.6a3 3 0 0 0 4.24 4.24M9.36 5.6C10.2 5.36 11.08 5.24 12 5.24c6.4 0 10 6.76 10 6.76a15 15 0 0 1-3.4 4.16M6.6 6.6C4.32 8.1 2.6 10.4 2 12c0 0 3.6 6.76 10 6.76 1.24 0 2.38-.2 3.4-.56"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

function PasswordField({ id, label, error, hint, className = "", ...inputProps }) {
    const [visible, setVisible] = useState(false);

    return (
        <div className={`field ${className}`}>
            <label htmlFor={id} className="field-label">
                {label}
            </label>
            <div className="field-input-wrap">
                <input
                    id={id}
                    type={visible ? "text" : "password"}
                    className={`field-input ${error ? "field-input-error" : ""}`}
                    aria-invalid={error ? "true" : "false"}
                    aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
                    {...inputProps}
                />
                <button
                    type="button"
                    className="field-toggle"
                    onClick={() => setVisible((v) => !v)}
                    aria-label={visible ? "Hide password" : "Show password"}
                    aria-pressed={visible}
                    tabIndex={0}
                >
                    <EyeIcon open={visible} />
                </button>
            </div>
            {hint && !error && (
                <p id={`${id}-hint`} className="field-hint">
                    {hint}
                </p>
            )}
            {error && (
                <p id={`${id}-error`} className="field-error" role="alert">
                    {error}
                </p>
            )}
        </div>
    );
}

export default PasswordField;
