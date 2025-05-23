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
        <nav className="flex items-center justify-between px-6 py-4 bg-gray-100 shadow">
            {/* Left: Logo + Title */}
            <Link to="/" className="flex items-center space-x-2">
                <img src="/favicon-cart.jpg" alt="Logo" className="w-8 h-8" />
                <span className="font-bold text-xl text-gray-800">E-Shop</span>
            </Link>

            {/* Right: Navigation Links */}
            <div className="flex items-center space-x-4">
                {isAuthenticated ? (
                    <>
                        <Link to="/home" className="text-gray-700 hover:underline">Home</Link>
                        <Link to="/dashboard" className="text-gray-700 hover:underline">Dashboard</Link>
                        <button onClick={handleLogout} className="text-red-600 hover:underline">Logout</button>
                    </>
                ) : (
                    <>
                        <Link to="/login" className="text-gray-700 hover:underline">Login</Link>
                        <Link to="/signup" className="text-gray-700 hover:underline">Signup</Link>
                        <Link to="/help" className="text-gray-700 hover:underline">Help</Link>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;