import React, {useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import {useAuth} from "./auth/UseAuth";
import {UserIcon} from "@heroicons/react/24/solid";
import ConfirmationDialog from "./ConfirmationDialog";

const Navbar: React.FC = () => {
    const {isAuthenticated, logout, user} = useAuth();
    const navigate = useNavigate();
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <>
        <nav className="flex items-center justify-between px-6 py-4 bg-gray-100 shadow">
            {/* Left: Logo + Title */}
            <Link to="/" className="flex items-center space-x-2">
                <img src="/favicon-cart.jpg" alt="Logo" className="w-8 h-8"/>
                <span className="font-bold text-xl text-gray-800">E-Shop</span>
            </Link>
            {/* Right: Navigation Links */}
            <div className="flex items-center space-x-4">
                {isAuthenticated && user && (
                    <Link to="/profile" className="relative group flex items-center space-x-2 text-gray-700">
                        {user.avatarUrl ? (
                            <img
                                src={`${import.meta.env.VITE_API_BASE_URL}${user.avatarUrl}`}
                                alt="User Avatar"
                                className="w-8 h-8 rounded-full border border-gray-300 shadow-sm object-cover hover:ring-2 hover:ring-gray-500 transition"
                            />
                        ) : (
                            <UserIcon className="w-6 h-6 hover:text-gray-900 transition duration-150" />
                        )}
                        <span className="hidden sm:inline">Welcome {user.firstname} !</span>
                        <span className="absolute -bottom-8 left-[-2rem] transform -translate-x-1/2 scale-0 group-hover:scale-100 bg-black text-white text-xs px-2 py-1 rounded shadow transition-transform duration-200">
            Edit your profile
        </span>
                    </Link>
                )}
                {isAuthenticated ? (
                    <>
                        <Link to="/home" className="text-gray-700 hover:underline">Home</Link>
                        <Link to="/dashboard" className="text-gray-700 hover:underline">Dashboard</Link>
                        <button
                            onClick={() => setShowLogoutConfirm(true)}
                            className="ml-auto px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                        >
                            Logout
                        </button>
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
            {/* Modal to confirm logout */}
            <ConfirmationDialog
                isOpen={showLogoutConfirm}
                title="Confirm Logout"
                message="Are you sure you want to log out ?"
                onConfirm={() => {
                    setShowLogoutConfirm(false);
                    handleLogout();
                }}
                onCancel={() => setShowLogoutConfirm(false)}
            />
        </>
    );
};

export default Navbar;