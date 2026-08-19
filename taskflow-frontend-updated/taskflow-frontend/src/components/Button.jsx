function Button({
    children,
    variant = "primary",
    loading = false,
    disabled = false,
    className = "",
    type = "button",
    ...rest
}) {
    return (
        <button
            type={type}
            className={`btn btn-${variant} ${loading ? "btn-loading" : ""} ${className}`}
            disabled={disabled || loading}
            aria-busy={loading || undefined}
            {...rest}
        >
            {loading && <span className="btn-spinner" aria-hidden="true" />}
            <span className="btn-label">{children}</span>
        </button>
    );
}

export default Button;
