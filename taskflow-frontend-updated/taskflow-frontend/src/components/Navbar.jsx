import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "./Logo";
import { logout } from "../services/api";

function initials(name) {
    if (!name) return "?";
    return name.trim().charAt(0).toUpperCase();
}

function Navbar({ username, onToggleSidebar }) {
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(e) {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setMenuOpen(false);
            }
        }
        function handleEscape(e) {
            if (e.key === "Escape") setMenuOpen(false);
        }
        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("keydown", handleEscape);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("keydown", handleEscape);
        };
    }, []);

    const handleLogout = () => {
        logout();
        navigate("/login", { replace: true });
    };

    return (
        <header className="navbar">
            <div className="navbar-left">
                <button
                    type="button"
                    className="navbar-menu-btn"
                    onClick={onToggleSidebar}
                    aria-label="Toggle navigation menu"
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                        <path
                            d="M3 6h18M3 12h18M3 18h18"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                        />
                    </svg>
                </button>
                <Logo size="sm" />
            </div>

            <div className="navbar-right" ref={menuRef}>
                <button
                    type="button"
                    className="navbar-user"
                    onClick={() => setMenuOpen((v) => !v)}
                    aria-haspopup="true"
                    aria-expanded={menuOpen}
                >
                    <span className="navbar-avatar">{initials(username)}</span>
                    <span className="navbar-username">{username}</span>
                    <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        aria-hidden="true"
                        className={`navbar-chevron ${menuOpen ? "navbar-chevron-open" : ""}`}
                    >
                        <path
                            d="M6 9l6 6 6-6"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                </button>

                {menuOpen && (
                    <div className="navbar-dropdown" role="menu">
                        <button
                            type="button"
                            className="navbar-dropdown-item"
                            role="menuitem"
                            onClick={handleLogout}
                        >
                            Log out
                        </button>
                    </div>
                )}
            </div>
        </header>
    );
}

export default Navbar;
