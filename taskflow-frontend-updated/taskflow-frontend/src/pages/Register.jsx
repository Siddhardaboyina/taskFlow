import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../components/Logo";
import TextField from "../components/TextField";
import PasswordField from "../components/PasswordField";
import PasswordStrength from "../components/PasswordStrength";
import Button from "../components/Button";
import InlineBanner from "../components/InlineBanner";
import { register } from "../services/api";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function Register() {
    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [fieldErrors, setFieldErrors] = useState({});
    const [formError, setFormError] = useState("");
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    const validate = () => {
        const errors = {};

        if (!username.trim()) errors.username = "Choose a username";

        if (!email.trim()) errors.email = "Enter your email";
        else if (!EMAIL_RE.test(email.trim())) errors.email = "Enter a valid email address";

        if (!password) errors.password = "Choose a password";
        else if (password.length < 8) errors.password = "Use at least 8 characters";

        if (!confirmPassword) errors.confirmPassword = "Confirm your password";
        else if (confirmPassword !== password) errors.confirmPassword = "Passwords don't match";

        setFieldErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setFormError("");

        if (!validate() || loading) return;

        setLoading(true);
        try {
            // confirmPassword is never sent to the backend — client-side check only.
            await register(username.trim(), email.trim(), password);

            setSuccess(true);
            setUsername("");
            setEmail("");
            setPassword("");
            setConfirmPassword("");
        } catch (error) {
            setFormError(error.message || "Registration failed");
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="auth-page">
                <div className="auth-card auth-card-success">
                    <div className="auth-brand">
                        <Logo size="lg" withWordmark={false} />
                    </div>
                    <div className="success-icon" aria-hidden="true">
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                            <path
                                d="M5 13l4 4L19 7"
                                stroke="var(--color-success)"
                                strokeWidth="2.4"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </div>
                    <h1 className="auth-title">Account created</h1>
                    <p className="auth-subtitle">You can sign in with your new account now.</p>
                    <Button variant="primary" className="btn-block" onClick={() => navigate("/login")}>
                        Go to sign in
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="auth-page">
            <div className="auth-card">
                <div className="auth-brand">
                    <Logo size="lg" withWordmark={false} />
                </div>

                <h1 className="auth-title">Create your account</h1>
                <p className="auth-subtitle">Start organizing your work with TaskFlow</p>

                <InlineBanner tone="error">{formError}</InlineBanner>

                <form onSubmit={handleRegister} noValidate>
                    <TextField
                        id="reg-username"
                        label="Username"
                        type="text"
                        autoComplete="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        error={fieldErrors.username}
                        disabled={loading}
                        autoFocus
                    />

                    <TextField
                        id="reg-email"
                        label="Email"
                        type="email"
                        autoComplete="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        error={fieldErrors.email}
                        disabled={loading}
                    />

                    <PasswordField
                        id="reg-password"
                        label="Password"
                        autoComplete="new-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        error={fieldErrors.password}
                        disabled={loading}
                    />
                    <PasswordStrength password={password} />

                    <PasswordField
                        id="reg-confirm-password"
                        label="Confirm password"
                        autoComplete="new-password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        error={fieldErrors.confirmPassword}
                        disabled={loading}
                        className="field-tight"
                    />

                    <Button type="submit" variant="primary" loading={loading} className="btn-block">
                        Create account
                    </Button>
                </form>

                <p className="auth-switch">
                    Already have an account? <Link to="/login">Sign in</Link>
                </p>
            </div>
        </div>
    );
}

export default Register;
