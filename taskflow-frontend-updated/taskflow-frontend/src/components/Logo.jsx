function Logo({ size = "md", withWordmark = true }) {
    const markSize = size === "lg" ? 40 : size === "sm" ? 24 : 32;

    return (
        <div className={`logo logo-${size}`}>
            <svg
                width={markSize}
                height={markSize}
                viewBox="0 0 32 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
            >
                <defs>
                    <linearGradient id="logoGradient" x1="0" y1="0" x2="32" y2="32">
                        <stop offset="0%" stopColor="#4F46E5" />
                        <stop offset="100%" stopColor="#7C3AED" />
                    </linearGradient>
                </defs>
                <rect width="32" height="32" rx="9" fill="url(#logoGradient)" />
                <path
                    d="M10 16.5L14 20.5L22 11.5"
                    stroke="white"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </svg>
            {withWordmark && <span className="logo-wordmark">TaskFlow</span>}
        </div>
    );
}

export default Logo;
