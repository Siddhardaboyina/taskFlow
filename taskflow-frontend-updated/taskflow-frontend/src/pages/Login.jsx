import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../components/Logo";
import TextField from "../components/TextField";
import PasswordField from "../components/PasswordField";
import Button from "../components/Button";
import InlineBanner from "../components/InlineBanner";
import { login } from "../services/api";

function Login() {
    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [fieldErrors, setFieldErrors] = useState({});
    const [formError, setFormError] = useState("");
    const [loading, setLoading] = useState(false);

    const validate = () => {
        const errors = {};
        if (!username.trim()) errors.username = "Enter your username";
        if (!password) errors.password = "Enter your password";
        setFieldErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setFormError("");

        if (!validate() || loading) return;

        setLoading(true);
        try {
            await login(username.trim(), password);
            navigate("/dashboard", { replace: true });
        } catch (error) {
            setFormError(error.message || "Invalid username or password");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-card">
                <div className="auth-brand">
                    <Logo size="lg" withWordmark={false} />
                </div>

                <h1 className="auth-title">Welcome back</h1>
                <p className="auth-subtitle">Sign in to continue to TaskFlow</p>

                <InlineBanner tone="error">{formError}</InlineBanner>

                <form onSubmit={handleLogin} noValidate>
                    <TextField
                        id="username"
                        label="Username"
                        type="text"
                        autoComplete="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        error={fieldErrors.username}
                        disabled={loading}
                        autoFocus
                    />

                    <PasswordField
                        id="password"
                        label="Password"
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        error={fieldErrors.password}
                        disabled={loading}
                    />

                    <Button type="submit" variant="primary" loading={loading} className="btn-block">
                        Sign in
                    </Button>
                </form>

                <p className="auth-switch">
                    Don&apos;t have an account? <Link to="/register">Create one</Link>
                </p>
            </div>
        </div>
    );
}

export default Login;
