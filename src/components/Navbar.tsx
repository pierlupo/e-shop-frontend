import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "./auth/AuthContext";

const Navbar: React.FC = () => {
    const { isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <nav style={{ padding: "1rem", backgroundColor: "#f4f4f4" }}>
            {isAuthenticated && (
                <>
                    <Link to="/home" style={{ marginRight: "1rem" }}>Home</Link>
                    <Link to="/dashboard" style={{ marginRight: "1rem" }}>Dashboard</Link>
                </>
            )}
            {!isAuthenticated ? (
                <>
                    <Link to="/login" style={{ marginRight: "1rem" }}>Login</Link>
                    <Link to="/signup" style={{ marginRight: "1rem" }}>Signup</Link>
                    <Link to="/help">Help</Link>
                </>
            ) : (
                <button onClick={handleLogout} style={{ marginLeft: "1rem" }}>Logout</button>
            )}
        </nav>
    );
};

export default Navbar;