function TextField({ id, label, error, hint, className = "", ...inputProps }) {
    return (
        <div className={`field ${className}`}>
            <label htmlFor={id} className="field-label">
                {label}
            </label>
            <input
                id={id}
                className={`field-input ${error ? "field-input-error" : ""}`}
                aria-invalid={error ? "true" : "false"}
                aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
                {...inputProps}
            />
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

export default TextField;
