function LoadingSpinner({ label = "Loading…", size = "md" }) {
    return (
        <div className={`spinner-wrap spinner-${size}`} role="status">
            <span className="spinner" aria-hidden="true" />
            {label && <span className="spinner-label">{label}</span>}
        </div>
    );
}

export default LoadingSpinner;
