function scorePassword(password) {
    if (!password) return 0;

    let score = 0;
    if (password.length >= 8) score += 1;
    if (password.length >= 12) score += 1;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score += 1;
    if (/\d/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;

    return Math.min(score, 4);
}

const LABELS = ["Too short", "Weak", "Fair", "Good", "Strong"];

function PasswordStrength({ password }) {
    if (!password) return null;

    const score = scorePassword(password);

    return (
        <div className="strength" aria-hidden="false">
            <div className="strength-bars">
                {[0, 1, 2, 3].map((i) => (
                    <span
                        key={i}
                        className={`strength-bar ${i < score ? `strength-bar-filled strength-${score}` : ""}`}
                    />
                ))}
            </div>
            <span className="strength-label">{LABELS[score]}</span>
        </div>
    );
}

export default PasswordStrength;
