import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "./auth/AuthContext";
import { UserIcon } from "@heroicons/react/24/solid";

const Navbar: React.FC = () => {
    const { isAuthenticated, logout, user  } = useAuth(); // assuming user has a 'firstname'
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
                {isAuthenticated && user && (
                    <div className="flex items-center space-x-2 text-gray-700">
                        <UserIcon className="w-5 h-5" />
                        <span className="hidden sm:inline">Welcome, {user.firstname}!</span>
                    </div>
                )}
                {isAuthenticated ? (
                    <>
                        <Link to="/profile" className="text-gray-700 hover:underline">Profile</Link>
                        <Link to="/home" className="text-gray-700 hover:underline">Home</Link>
                        <Link to="/dashboard" className="text-gray-700 hover:underline">Dashboard</Link>
                        <button onClick={handleLogout} className="ml-auto px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">Logout</button>
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