import {HomeIcon} from "@heroicons/react/24/outline";
import React, {useState} from "react";
import {toast} from "react-hot-toast";
import {Link, useNavigate} from "react-router-dom";
import {useAuth} from "./auth/UseAuth";
import {QuestionMarkCircleIcon, Squares2X2Icon, UserIcon, UserPlusIcon, Bars3Icon, XMarkIcon} from "@heroicons/react/24/outline";
import ConfirmationDialog from "./ConfirmationDialog";

const Navbar: React.FC = () => {
    const {isAuthenticated, logout, user} = useAuth();
    const navigate = useNavigate();
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    const handleLogout = () => {
        logout();
        toast.success(`See you next time ${user?.firstname || "user"}! 👋`);
        navigate("/login");
    };

    return (
        <>
            <nav className="bg-gray-100 shadow">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    {/* Logo and Title */}
                    <Link to="/" className="flex items-center space-x-2">
                        <img src="/favicon-cart.jpg" alt="Logo" className="w-8 h-8" />
                        <span className="font-bold text-xl text-gray-800">E-Shop</span>
                    </Link>
                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center space-x-4">
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
                            </Link>
                        )}

                        {isAuthenticated ? (
                            <>
                                <Link to="/home" className="flex items-center text-gray-700 hover:underline">
                                    <HomeIcon className="h-4 w-4 mr-1" /> Home
                                </Link>
                                <Link to="/dashboard" className="flex items-center text-gray-700 hover:underline">
                                    <Squares2X2Icon className="h-4 w-4 mr-1" /> Dashboard
                                </Link>
                                <button
                                    onClick={() => setShowLogoutConfirm(true)}
                                    className="ml-auto px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="flex items-center text-gray-700 hover:underline">
                                    <UserIcon className="h-4 w-4 mr-1" /> Login
                                </Link>
                                <Link to="/signup" className="flex items-center text-gray-700 hover:underline">
                                    <UserPlusIcon className="h-4 w-4 mr-1" /> Signup
                                </Link>
                                <Link to="/help" className="flex items-center text-gray-700 hover:underline">
                                    <QuestionMarkCircleIcon className="h-4 w-4 mr-1" /> Help
                                </Link>
                            </>
                        )}
                    </div>
                    {/* Mobile Menu Button */}
                    <div className="md:hidden">
                        <button onClick={() => setIsOpen(!isOpen)} className="focus:outline-none">
                            {isOpen ? (
                                <XMarkIcon className="w-6 h-6 text-gray-700" />
                            ) : (
                                <Bars3Icon className="w-6 h-6 text-gray-700" />
                            )}
                        </button>
                    </div>
                </div>
                {/* Mobile Dropdown Menu */}
                {isOpen && (
                    <div className="md:hidden px-6 pb-4 space-y-2">
                        {isAuthenticated && user && (
                            <Link to="/profile" className="flex items-center space-x-2 text-gray-700">
                                {user.avatarUrl ? (
                                    <img
                                        src={`${import.meta.env.VITE_API_BASE_URL}${user.avatarUrl}`}
                                        alt="User Avatar"
                                        className="w-8 h-8 rounded-full border border-gray-300 shadow-sm object-cover"
                                    />
                                ) : (
                                    <UserIcon className="w-6 h-6" />
                                )}
                                <span>Welcome {user.firstname} !</span>
                            </Link>
                        )}
                        {isAuthenticated ? (
                            <>
                                <Link to="/home" className="flex items-center text-gray-700 hover:underline">
                                    <HomeIcon className="h-4 w-4 mr-1" /> Home
                                </Link>
                                <Link to="/dashboard" className="flex items-center text-gray-700 hover:underline">
                                    <Squares2X2Icon className="h-4 w-4 mr-1" /> Dashboard
                                </Link>
                                <button
                                    onClick={() => {
                                        setShowLogoutConfirm(true);
                                        setIsOpen(false);
                                    }}
                                    className="w-full text-left px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="flex items-center text-gray-700 hover:underline">
                                    <UserIcon className="h-4 w-4 mr-1" /> Login
                                </Link>
                                <Link to="/signup" className="flex items-center text-gray-700 hover:underline">
                                    <UserPlusIcon className="h-4 w-4 mr-1" /> Signup
                                </Link>
                                <Link to="/help" className="flex items-center text-gray-700 hover:underline">
                                    <QuestionMarkCircleIcon className="h-4 w-4 mr-1" /> Help
                                </Link>
                            </>
                        )}
                    </div>
                )}
            </nav>
            {/* Logout Confirmation Dialog */}
            <ConfirmationDialog
                isOpen={showLogoutConfirm}
                title="Confirm Logout"
                message="Are you sure you want to log out?"
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