import { Navigate } from "react-router-dom";
import { isAuthenticated } from "../services/api";

// Keeps already-authenticated users off /login and /register.
function GuestRoute({ children }) {
    if (isAuthenticated()) {
        return <Navigate to="/dashboard" replace />;
    }

    return children;
}

export default GuestRoute;
