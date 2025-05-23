import React from "react";
import { Link } from "react-router-dom";

const Navbar: React.FC = () => {
    const isAuthenticated = !!localStorage.getItem("token");

    const handleLogout = () => {
        localStorage.removeItem("token");
        window.location.href = "/login";
    };

    return (
        <nav style={{ padding: "1rem", backgroundColor: "#f4f4f4" }}>
            <Link to="/" style={{ marginRight: "1rem" }}>Home</Link>
            {!isAuthenticated ? (
                <>
                    <Link to="/login" style={{ marginRight: "1rem" }}>Login</Link>
                    <Link to="/signup">Signup</Link>
                </>
            ) : (
                <button onClick={handleLogout} style={{ marginLeft: "1rem" }}>Logout</button>
            )}
        </nav>
    );
};

export default Navbar;