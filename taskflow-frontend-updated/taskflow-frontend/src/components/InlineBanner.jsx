function InlineBanner({ tone = "error", children }) {
    if (!children) return null;

    return (
        <div className={`banner banner-${tone}`} role={tone === "error" ? "alert" : "status"}>
            {children}
        </div>
    );
}

export default InlineBanner;
